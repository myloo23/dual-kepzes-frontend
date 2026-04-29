import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, MapPin, User, Building2 } from "lucide-react";
import { api, type Company, type Position } from "../../lib/api";

type PositionCompanyWithDesc = NonNullable<Position["company"]> & { description?: string };
import { companyApi } from "../../features/companies/services/companyApi";
import PositionCard from "../../features/positions/components/PositionCard";
import { pickLogo } from "../../features/positions/utils/positions.utils";
import abcTechLogo from "../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../assets/logos/business-it.jpg";
import LocationMap from "../../features/applications/components/LocationMap";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/shared/ToastContainer";
import { resolveApiAssetUrl } from "../../lib/media-url";
import { pickPrimaryCompanyImageUrl } from "../../features/companies/utils/companyImageLogo";

export default function PublicCompanyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch company details
        const companyData = await companyApi.get(id);
        const companyImages = await companyApi.companyImages.list(id).catch(() => []);
        const primaryImageUrl = pickPrimaryCompanyImageUrl(companyImages);
        const effectiveLogoUrl =
          primaryImageUrl ?? resolveApiAssetUrl(companyData.logoUrl) ?? null;
        const normalizedCompanyData = {
          ...companyData,
          logoUrl: effectiveLogoUrl,
        };
        console.log("Fetched company data:", normalizedCompanyData);
        setCompany(normalizedCompanyData);

        // Fetch public positions with higher limit and company filter
        // We ask for 100 items to avoid missing jobs due to pagination
        // We also attempt to pass companyId filter in case the API supports it
        const allPositions = await api.positions.listPublic({
          limit: 100,
          companyId: id,
        });

        // Client-side filter is still kept as a safety net in case the API ignores the companyId param
        const companyPositions = allPositions.filter(
          (p) => String(p.companyId) === String(id),
        );

        // Sort by newness (optional, but good for UX)
        companyPositions.sort((a, b) => {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        });

        // Enrich positions with company data (to ensure hasOwnApplication is present)
        const enrichedPositions: Position[] = companyPositions.map((p) => ({
          ...p,
          companyId: String(companyData.id), // Ensure companyId is present
          company: {
            ...p.company,
            id: companyData.id,
            name: companyData.name,
            logoUrl: effectiveLogoUrl,
            locations: companyData.locations,
            hasOwnApplication: companyData.hasOwnApplication ?? false,
            externalApplicationUrl:
              companyData.externalApplicationUrl ??
              p.company?.externalApplicationUrl ??
              null,
            website: companyData.website ?? p.company?.website ?? null,
          },
        })) as Position[]; // Cast as Position to satisfy strict type checks (api response might be slightly loose)

        setPositions(enrichedPositions);
      } catch (err) {
        console.error("Error fetching company profile:", err);
        setError("A cég adatainak betöltése sikertelen.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fallback fetch if description is missing
  useEffect(() => {
    const fetchDescriptionFallback = async () => {
      if (company && !company.description && !loading) {
        console.group("🛑 Company Description Debugger");
        console.log(
          "Initial fetch missing description. Attempting fallbacks...",
        );

        try {
          // Strategy 1: Global Company List
          console.log("1. Checking Global Company List...");
          const companies = await companyApi.list();
          const foundInList = companies.find(
            (c) => String(c.id) === String(company.id),
          );

          if (foundInList?.description) {
            console.log(
              "✅ Found in Global List:",
              foundInList.description.substring(0, 20) + "...",
            );
            setCompany((prev) =>
              prev ? { ...prev, description: foundInList.description } : null,
            );
            console.groupEnd();
            return;
          }

          // Strategy 2: Positions by Company
          console.log("2. Checking Positions by Company...");
          // Try catch this specifically as it might fail for unauth
          try {
            const companyPositions = await api.positions.listByCompany(
              company.id,
            );
            const foundInPos = companyPositions.find(
              (p) => (p.company as PositionCompanyWithDesc | undefined)?.description,
            );

            if (foundInPos) {
              const desc = (foundInPos.company as PositionCompanyWithDesc).description!;
              console.log(
                "✅ Found in Position (ByCompany):",
                desc.substring(0, 20) + "...",
              );
              setCompany((prev) =>
                prev ? { ...prev, description: desc } : null,
              );
              console.groupEnd();
              return;
            }
          } catch (err) {
            console.log("⚠️ Strategy 2 failed (likely auth needed):", err);
          }

          // Strategy 3: Public Positions (Unauthenticated)
          console.log("3. Checking Public Positions (No Token)...");
          const publicPositions = await api.positions.listPublic({
            limit: 100,
          });
          const foundInPublic = publicPositions.find(
            (p) =>
              String(p.companyId) === String(company.id) &&
              (p.company as PositionCompanyWithDesc | undefined)?.description,
          );

          if (foundInPublic) {
            const desc = (foundInPublic.company as PositionCompanyWithDesc).description!;
            console.log(
              "✅ Found in Public Position:",
              desc.substring(0, 20) + "...",
            );
            setCompany((prev) =>
              prev ? { ...prev, description: desc } : null,
            );
            console.groupEnd();
            return;
          }

          console.warn("❌ Description not found in any fallback source.");
        } catch (e) {
          console.error("Fallback fetch failed", e);
        }
        console.groupEnd();
      }
    };
    fetchDescriptionFallback();
  }, [company?.description, company?.id, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="text-slate-600 dark:text-slate-400">Betöltés...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="text-red-600 dark:text-red-400">{error || "Cég nem található"}</div>
        <button
          onClick={() => navigate("/positions")}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Vissza az állásokhoz
        </button>
      </div>
    );
  }

  const logo = pickLogo(company.name, {
    logo1: abcTechLogo,
    logo2: businessItLogo,
  });
  // Fallback for location if hqCity is missing but present in locations array (backend inconsistency handling)
  const location = company.locations?.[0];
  const city = location?.city;
  const address = location?.address;

  const handleApply = (positionId: string | number) => {
    const p = positions.find((pos) => String(pos.id) === String(positionId));

    if (p?.company?.hasOwnApplication) {
      const externalUrl =
        p.company.externalApplicationUrl || p.company.website || null;
      if (externalUrl) {
        toast.showInfo(`Átirányítás a(z) ${company.name} karrier oldalára...`);
        setTimeout(() => {
          window.open(externalUrl, "_blank");
        }, 1500);
        return;
      }
    }

    // Internal application flow
    navigate(`/positions?id=${positionId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-8 transition-colors">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/positions")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-200"
        >
          <ArrowLeft size={16} />
          Vissza az állásokhoz
        </button>

        {/* Header Card */}
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
          <div className="relative h-32 bg-slate-900 dark:bg-slate-950 md:h-48 transition-colors">
            {/* Cover placeholder - could be a real cover image if available */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90 dark:opacity-80" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          </div>

          <div className="relative px-6 pb-8 md:px-10">
            <div className="flex flex-col items-center md:flex-row md:items-end md:gap-8">
              {/* Logo - overlaps the blue header */}
              <div className="relative -mt-12 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 shadow-md md:-mt-16 md:h-32 md:w-32 flex-shrink-0 transition-colors">
                <img
                  src={company.logoUrl || logo}
                  alt={company.name}
                  className="h-full w-full object-contain p-2"
                />
              </div>

              {/* Company info - on white background */}
              <div className="mt-4 text-center md:mb-2 md:mt-0 md:text-left flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">
                  {company.name}
                </h1>
                <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400 md:justify-start transition-colors">
                  {city && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
                      <span>{city}</span>
                    </div>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Globe size={16} className="text-slate-400 dark:text-slate-500" />
                      <span>Weboldal</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <section className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white transition-colors">
                    A cégről
                  </h2>
                  <div className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
                    {company.description || "Nincs elérhető leírás."}
                  </div>
                </section>

                <div className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-10 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors">
                      Nyitott pozíciók
                      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300 transition-colors">
                        {positions.length}
                      </span>
                    </h2>
                  </div>

                  {positions.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {positions.map((position) => (
                        <PositionCard
                          key={position.id}
                          position={position}
                          logo={company.logoUrl || logo}
                          hideCompanyInfo={true} // Clean look for profile page
                          onApply={(id) => handleApply(id)}
                          onCompanyClick={() => {}}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 text-center text-slate-500 dark:text-slate-400 transition-colors">
                      Jelenleg nincsenek meghirdetett pozíciók ennél a cégnél.
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-colors">
                  <h3 className="mb-4 font-semibold text-slate-900 dark:text-white transition-colors">
                    Kapcsolat
                  </h3>

                  <div className="space-y-4">
                    {(company.contactName || company.contactEmail) && (
                      <div className="flex gap-3">
                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">
                            Kapcsolattartó
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                            {company.contactName}
                          </div>
                          {company.contactEmail && (
                            <a
                              href={`mailto:${company.contactEmail}`}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                            >
                              {company.contactEmail}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {city && (
                      <div className="flex gap-3">
                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">
                            Székhely
                          </div>
                          <div className="text-sm text-slate-900 dark:text-slate-100 transition-colors">
                            {city}
                            {address && (
                              <div className="text-slate-600 dark:text-slate-400 transition-colors">{address}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {company.website && (
                      <div className="flex gap-3">
                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-colors">
                          <Globe size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">
                            Weboldal
                          </div>
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all transition-colors"
                          >
                            {company.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Widget */}
                {city && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm transition-colors">
                    <div className="h-64 w-full">
                      <LocationMap
                        companyName={company.name}
                        companyCity={city}
                        companyAddress={address || ""}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
