import { X } from "lucide-react";
import LocationMap from "../../../applications/components/LocationMap";

type CompanyInfoModalProps = {
    companyInfo: {
        name: string;
        logoUrl?: string | null;
        locations?: Array<{ city: string; address?: string }>;
        description?: string;
        contactName?: string;
        contactEmail?: string;
        website?: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function CompanyInfoModal({ companyInfo, isOpen, onClose }: CompanyInfoModalProps) {
    if (!isOpen || !companyInfo) return null;

    const hasFullData = !!(companyInfo.description || companyInfo.contactName || companyInfo.contactEmail || companyInfo.website);

    return (
        <div
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fejléc */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                    <h2 className="text-xl font-semibold text-slate-900">Cég információk</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                        aria-label="Bezárás"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tartalom */}
                <div className="p-6 space-y-6">
                    {/* Cég neve */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{companyInfo.name}</h3>
                    </div>

                    {/* Leírás */}
                    {companyInfo.description && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Leírás</h4>
                            <p className="text-base text-slate-700 whitespace-pre-line leading-relaxed">
                                {companyInfo.description}
                            </p>
                        </div>
                    )}

                    {/* Térkép - Use first location or iterate */}
                    {companyInfo.locations?.[0]?.city && (
                        <LocationMap
                            companyName={companyInfo.name}
                            companyCity={companyInfo.locations[0].city}
                            companyAddress={companyInfo.locations[0].address || ""}
                        />
                    )}

                    {/* Kapcsolattartó */}
                    {(companyInfo.contactName || companyInfo.contactEmail) && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Kapcsolattartó</h4>
                            <div className="space-y-2 text-sm">
                                {companyInfo.contactName && (
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[80px]">Név:</span>
                                        <span className="text-slate-900 font-medium">{companyInfo.contactName}</span>
                                    </div>
                                )}
                                {companyInfo.contactEmail && (
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[80px]">Email:</span>
                                        <a
                                            href={`mailto:${companyInfo.contactEmail}`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {companyInfo.contactEmail}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Székhely város */}
                    {companyInfo.locations && companyInfo.locations.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Telephelyek</h4>
                            <div className="space-y-1">
                                {companyInfo.locations.map(
                                    (loc: { city: string; address?: string }, i: number) => (
                                    <div key={i} className="text-sm text-slate-900">
                                        {loc.city}{loc.address ? `, ${loc.address}` : ''}
                                    </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Weboldal */}
                    {companyInfo.website && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Weboldal</h4>
                            <a
                                href={companyInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {companyInfo.website}
                            </a>
                        </div>
                    )}

                    {/* Megjegyzés csak akkor ha nincs teljes adat */}
                    {!hasFullData && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm text-amber-800">
                                <strong>Megjegyzés:</strong> A cég részletes adatai jelenleg nem érhetők el.
                                További információkért kérjük, vegye fel a kapcsolatot az álláshirdetésben megadott elérhetőségeken.
                            </p>
                        </div>
                    )}
                </div>

                {/* Lábléc */}
                <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                        Bezárás
                    </button>
                </div>
            </div>
        </div>
    );
}
