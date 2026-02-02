import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  description?: string;
  align?: "center" | "top";
  hideHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
  description,
  align = "center",
  hideHeader = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;
  if (!visible && !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-[95vw] h-[95vh]",
  };

  const alignClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-20",
  };

  return createPortal(
    <div className={cn(
      "fixed inset-0 z-[9999] flex p-4 sm:p-6",
      alignClasses[align],
      !isOpen && "pointer-events-none"
    )}>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full transform rounded-2xl bg-white shadow-2xl transition-all duration-300 flex flex-col max-h-[90vh]",
          sizeClasses[size],
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-slate-900 leading-none tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1.5 text-sm text-slate-500">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className={cn(
            "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent",
             !hideHeader ? "p-6" : ""
        )}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
