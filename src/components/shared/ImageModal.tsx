// src/components/shared/ImageModal.tsx
import { useEffect } from "react";
import { X } from "lucide-react";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    imageAlt: string;
    title?: string;
}

export default function ImageModal({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
    title,
}: ImageModalProps) {
    // Handle ESC key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative max-w-5xl max-h-[90vh] w-full bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-lg transition-all"
                    aria-label="Bezárás"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Title */}
                {title && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6 pt-8">
                        <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                            {title}
                        </h3>
                    </div>
                )}

                {/* Image */}
                <div className="overflow-auto max-h-[90vh]">
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
