import { useState } from "react";
import LocationMap from "./LocationMap";
import { Modal } from "../../../components/ui/Modal";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    position: {
        id: string;
        title: string;
        company?: { name: string };
        city?: string;
        address?: string;
    };
    onSubmit: (note: string) => Promise<void>;
}

export default function ApplicationModal({
    isOpen,
    onClose,
    position,
    onSubmit,
}: ApplicationModalProps) {
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (note.trim().length > 500) {
            setError("A motivációs levél maximum 500 karakter lehet.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onSubmit(note.trim());
            setNote("");
            onClose();
        } catch (err: any) {
            setError(err.message || "Hiba történt a jelentkezés során.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setNote("");
            setError(null);
            onClose();
        }
    };

    const charCount = note.length;
    const isOverLimit = charCount > 500;
    
    // Construct title and description
    const title = "Jelentkezés pozícióra";
    const description = `${position.title}${position.company?.name ? ` • ${position.company.name}` : ''}`;


    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            description={description}
            size="2xl"
        >
                <div className="space-y-4">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Motivációs levél <span className="text-slate-400">(opcionális)</span>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Írj egy rövid motivációs levelet, hogy miért jelentkezel erre a pozícióra..."
                            rows={8}
                            disabled={loading}
                            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${isOverLimit
                                ? "border-red-300 focus:ring-red-500"
                                : "border-slate-300 focus:ring-blue-500"
                                }`}
                        />
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">
                                Maximum 500 karakter
                            </span>
                            <span className={`font-medium ${isOverLimit ? "text-red-600" : "text-slate-600"}`}>
                                {charCount}/500
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Tipp:</strong> Írd le röviden, hogy miért vagy alkalmas erre a pozícióra,
                            milyen releváns tapasztalataid vagy készségeid vannak, és miért érdekel ez a lehetőség.
                        </p>
                    </div>

                    {/* Location Map */}
                    {position.company?.name && position.city && position.address && (
                        <LocationMap
                            companyName={position.company.name}
                            companyCity={position.city}
                            companyAddress={position.address}
                        />
                    )}
                    
                    {/* Footer */}
                    <div className="border-t border-slate-200 pt-4 flex gap-3 justify-end">
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Mégse
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || isOverLimit}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Jelentkezés..." : "Jelentkezés"}
                        </button>
                    </div>
                </div>
        </Modal>
    );
}
