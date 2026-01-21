import { X } from "lucide-react";
import { type Company } from "../../../../lib/api";

type CompanyProfileModalProps = {
    company: Company | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function CompanyProfileModal({ company, isOpen, onClose }: CompanyProfileModalProps) {
    if (!isOpen || !company) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fejléc */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                    <h2 className="text-xl font-semibold text-slate-900">Cég profilja</h2>
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
                        <h3 className="text-2xl font-bold text-slate-900">{company.name}</h3>
                    </div>

                    {/* Leírás */}
                    {company.description && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Leírás</h4>
                            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                {company.description}
                            </p>
                        </div>
                    )}

                    {/* Kapcsolattartó */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Kapcsolattartó</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                                <span className="text-slate-500 min-w-[100px]">Név:</span>
                                <span className="text-slate-900 font-medium">{company.contactName}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-slate-500 min-w-[100px]">Email:</span>
                                <a
                                    href={`mailto:${company.contactEmail}`}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {company.contactEmail}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Székhely */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Székhely</h4>
                        {company.locations && company.locations.length > 0 ? (
                            company.locations.map((loc, index) => (
                                <div key={index} className="space-y-2 border-b border-slate-100 last:border-0 pb-2 last:pb-0 mb-2 last:mb-0">
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[100px]">Ország:</span>
                                        <span className="text-slate-900">{loc.country}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[100px]">Irányítószám:</span>
                                        <span className="text-slate-900">{loc.zipCode}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[100px]">Város:</span>
                                        <span className="text-slate-900">{loc.city}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[100px]">Cím:</span>
                                        <span className="text-slate-900">{loc.address}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm italic">Nincs megadva cím.</p>
                        )}
                    </div>
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
