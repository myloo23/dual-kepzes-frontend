import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, MapPin, User, Building2 } from "lucide-react";
import { api, type Company, type Position } from "../../lib/api";
import PositionCard from "../../components/positions/PositionCard";
import { pickLogo } from "../../lib/positions-utils";
import abcTechLogo from "../../assets/logos/abc-tech.jpg";
import businessItLogo from "../../assets/logos/business-it.jpg";
import LocationMap from "../../components/applications/LocationMap";

export default function PublicCompanyProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
                setCompany(companyData);

                // Fetch all public positions
                const allPositions = await api.positions.listPublic();
                // Filter for this company
                const companyPositions = allPositions.filter(p =>
                    String(p.companyId) === String(id) ||
                    (p.company?.id && String(p.company.id) === String(id))
                );
                setPositions(companyPositions);

            } catch (err) {
                console.error("Error fetching company profile:", err);
                setError("A cég adatainak betöltése sikertelen.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
    const location = (company as any).locations?.[0];
    const city = company.hqCity || location?.city;
    const address = company.hqAddress || location?.address;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="mx-auto max-w-5xl px-4 lg:px-8">

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
                    <div className="relative h-32 bg-slate-900 md:h-40">
                        {/* Cover placeholder - could be a real cover image if available */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                    </div>

                    <div className="relative px-6 pb-8 md:px-10">
                        <div className="-mt-12 mb-6 flex flex-col items-center md:-mt-16 md:flex-row md:items-end md:gap-8">
                            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md md:h-32 md:w-32">
                                <img
                                    src={company.logoUrl || logo}
                                    alt={company.name}
                                    className="h-full w-full object-contain p-2"
                                />
                            </div>
                            <div className="text-center md:mb-4 md:text-left">
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

                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <section className="prose prose-slate max-w-none">
                                    <h2 className="mb-4 text-xl font-semibold text-slate-900">A cégről</h2>
                                    <div className="whitespace-pre-line text-slate-600">
                                        {company.description || "Nincs elérhető leírás."}
                                    </div>
                                </section>

                                <div className="mt-8 border-t border-slate-100 pt-8">
                                    <h2 className="mb-6 text-xl font-semibold text-slate-900">
                                        Nyitott pozíciók ({positions.length})
                                    </h2>
                                    {positions.length > 0 ? (
                                        <div className="grid gap-6">
                                            {positions.map(position => (
                                                <PositionCard
                                                    key={position.id}
                                                    position={position}
                                                    logo={company.logoUrl || logo}
                                                    hideCompanyInfo={true} // New prop needed!
                                                    onApply={(id) => {
                                                        // Store current position to auto-open modal when going back
                                                        sessionStorage.setItem('openPositionId', String(id));
                                                        navigate('/positions');
                                                    }}
                                                    onCompanyClick={() => { }} // Already here
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
        </div>
    );
}
