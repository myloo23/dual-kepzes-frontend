import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, MapPin, User, Building2 } from "lucide-react";
import { api, type Company, type Position } from "../../lib/api";
import PositionCard from "../../features/positions/components/PositionCard";
import { pickLogo } from "../../features/positions/utils/positions.utils";
import abcTechLogo from "../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../assets/logos/business-it.jpg";
import LocationMap from "../../features/applications/components/LocationMap";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/shared/ToastContainer";

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
                const companyData = await api.companies.get(id);
                console.log("Fetched company data:", companyData);
                setCompany(companyData);

                // Fetch public positions with higher limit and company filter
                // We ask for 100 items to avoid missing jobs due to pagination
                // We also attempt to pass companyId filter in case the API supports it
                const allPositions = await api.positions.listPublic({ 
                    limit: 100,
                    companyId: id as any // Cast to any if type definition is strict, though PaginationQuery usually allows extras
                });
                
                // Client-side filter is still kept as a safety net in case the API ignores the companyId param
                const companyPositions = allPositions.filter(p =>
                    String(p.companyId) === String(id)
                );
                
                // Sort by newness (optional, but good for UX)
                companyPositions.sort((a, b) => {
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(); 
                });

                // Enrich positions with company data (to ensure hasOwnApplication is present)
                const enrichedPositions = companyPositions.map(p => ({
                    ...p,
                    company: {
                        ...p.company,
                        name: companyData.name,
                        logoUrl: companyData.logoUrl,
                        locations: companyData.locations,
                        hasOwnApplication: companyData.hasOwnApplication,
                        website: companyData.website
                    }
                }));

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
                console.log("Initial fetch missing description. Attempting fallbacks...");
                
                try {
                    // Strategy 1: Global Company List
                    console.log("1. Checking Global Company List...");
                    const companies = await api.companies.list();
                    const foundInList = companies.find(c => String(c.id) === String(company.id));
                    
                    if (foundInList?.description) {
                        console.log("✅ Found in Global List:", foundInList.description.substring(0, 20) + "...");
                        setCompany(prev => prev ? ({ ...prev, description: foundInList.description }) : null);
                        console.groupEnd();
                        return;
                    }

                    // Strategy 2: Positions by Company
                    console.log("2. Checking Positions by Company...");
                    // Try catch this specifically as it might fail for unauth
                    try {
                        const companyPositions = await api.positions.listByCompany(company.id);
                        const foundInPos = companyPositions.find(p => (p.company as any)?.description);
                        
                        if (foundInPos) {
                            const desc = (foundInPos.company as any).description;
                            console.log("✅ Found in Position (ByCompany):", desc.substring(0, 20) + "...");
                            setCompany(prev => prev ? ({ ...prev, description: desc }) : null);
                            console.groupEnd();
                            return;
                        }
                    } catch (err) {
                        console.log("⚠️ Strategy 2 failed (likely auth needed):", err);
                    }

                    // Strategy 3: Public Positions (Unauthenticated)
                    console.log("3. Checking Public Positions (No Token)...");
                    const publicPositions = await api.positions.listPublic({ limit: 100 });
                    const foundInPublic = publicPositions.find(p => 
                        String(p.companyId) === String(company.id) && (p.company as any)?.description
                    );

                    if (foundInPublic) {
                        const desc = (foundInPublic.company as any).description;
                        console.log("✅ Found in Public Position:", desc.substring(0, 20) + "...");
                        setCompany(prev => prev ? ({ ...prev, description: desc }) : null);
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
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-slate-600">Betöltés...</div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                <div className="text-red-600">{error || "Cég nem található"}</div>
                <button
                    onClick={() => navigate("/positions")}
                    className="text-blue-600 hover:underline"
                >
                    Vissza az állásokhoz
                </button>
            </div>
        );
    }

    const logo = pickLogo(company.name, { logo1: abcTechLogo, logo2: businessItLogo });
    // Fallback for location if hqCity is missing but present in locations array (backend inconsistency handling)
    const location = company.locations?.[0];
    const city = location?.city;
    const address = location?.address;

    const handleApply = (positionId: string | number) => {
        const p = positions.find(pos => String(pos.id) === String(positionId));
        
        if (p?.company?.hasOwnApplication && p?.company?.website) {
            const targetUrl = p.company.website;
            toast.showInfo(`Átirányítás a(z) ${company.name} karrier oldalára...`);
            setTimeout(() => {
                window.open(targetUrl, '_blank');
            }, 1500);
            return;
        }

        // Fallback for internal application
        sessionStorage.setItem('openPositionId', String(positionId));
        navigate('/positions');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="mx-auto max-w-6xl px-4 lg:px-8">

                {/* Back button */}
                <button
                    onClick={() => navigate("/positions")}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                    <ArrowLeft size={16} />
                    Vissza az állásokhoz
                </button>

                {/* Header Card */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="relative h-32 bg-slate-900 md:h-48">
                        {/* Cover placeholder - could be a real cover image if available */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                    </div>

                    <div className="relative px-6 pb-8 md:px-10">
                        <div className="flex flex-col items-center md:flex-row md:items-end md:gap-8">
                            {/* Logo - overlaps the blue header */}
                            <div className="relative -mt-12 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md md:-mt-16 md:h-32 md:w-32 flex-shrink-0">
                                <img
                                    src={company.logoUrl || logo}
                                    alt={company.name}
                                    className="h-full w-full object-contain p-2"
                                />
                            </div>
                            
                            {/* Company info - on white background */}
                            <div className="mt-4 text-center md:mb-2 md:mt-0 md:text-left flex-1">
                                <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
                                <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-slate-600 md:justify-start">
                                    {city && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-slate-400" />
                                            <span>{city}</span>
                                        </div>
                                    )}
                                    {company.website && (
                                        <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 transition-colors hover:text-blue-600"
                                        >
                                            <Globe size={16} className="text-slate-400" />
                                            <span>Weboldal</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-10 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <section className="prose prose-slate max-w-none">
                                    <h2 className="mb-4 text-xl font-semibold text-slate-900">A cégről</h2>
                                    <div className="whitespace-pre-line text-slate-600 leading-relaxed">
                                        {company.description || "Nincs elérhető leírás."}
                                    </div>
                                </section>

                                <div className="mt-12 border-t border-slate-100 pt-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            Nyitott pozíciók 
                                            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {positions.length}
                                            </span>
                                        </h2>
                                    </div>
                                    
                                    {positions.length > 0 ? (
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {positions.map(position => (
                                                <PositionCard
                                                    key={position.id}
                                                    position={position}
                                                    logo={company.logoUrl || logo}
                                                    hideCompanyInfo={true} // Clean look for profile page
                                                    onApply={(id) => handleApply(id)}
                                                    onCompanyClick={() => { }} 
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                                            Jelenleg nincsenek meghirdetett pozíciók ennél a cégnél.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 font-semibold text-slate-900">Kapcsolat</h3>

                                    <div className="space-y-4">
                                        {(company.contactName || company.contactEmail) && (
                                            <div className="flex gap-3">
                                                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-slate-500">Kapcsolattartó</div>
                                                    <div className="text-sm font-medium text-slate-900">{company.contactName}</div>
                                                    {company.contactEmail && (
                                                        <a href={`mailto:${company.contactEmail}`} className="text-sm text-blue-600 hover:underline">
                                                            {company.contactEmail}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {city && (
                                            <div className="flex gap-3">
                                                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                    <Building2 size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-slate-500">Székhely</div>
                                                    <div className="text-sm text-slate-900">
                                                        {city}
                                                        {address && <div className="text-slate-600">{address}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {company.website && (
                                            <div className="flex gap-3">
                                                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                    <Globe size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-slate-500">Weboldal</div>
                                                    <a
                                                        href={company.website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm text-blue-600 hover:underline break-all"
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
                                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
