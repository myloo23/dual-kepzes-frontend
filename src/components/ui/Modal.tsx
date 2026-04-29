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
  const [visible, setVisible] = useState(false);
  const canUseDocument = typeof document !== "undefined";

  useEffect(() => {
    if (!canUseDocument) return;

    if (isOpen) {
      const timer = window.setTimeout(() => setVisible(true), 0);
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }

    const timer = window.setTimeout(() => setVisible(false), 200);
    document.body.style.overflow = "";
    return () => window.clearTimeout(timer);
  }, [isOpen, canUseDocument]);

  useEffect(() => {
    if (!canUseDocument) return;

    return () => {
      document.body.style.overflow = "";
    };
  }, [canUseDocument]);

  // Handle ESC key
  useEffect(() => {
    if (!canUseDocument) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, canUseDocument]);

  if (!canUseDocument) return null;
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
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex p-4 sm:p-6",
        alignClasses[align],
        !isOpen && "pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full transform rounded-2xl bg-white dark:bg-slate-900 shadow-card dark:shadow-none transition-all duration-300 flex flex-col max-h-[90vh] border border-nje-anthracite/10 dark:border-slate-800 overflow-hidden",
          sizeClasses[size],
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Brand accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-nje-jaffa via-nje-amethyst to-nje-cyan shrink-0" />

        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-nje-anthracite/8 dark:border-slate-800 px-6 py-4 shrink-0 transition-colors">
            <div>
              {title && (
                <h2 className="text-xl font-bold text-nje-anthracite dark:text-slate-100 leading-none tracking-tight transition-colors">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1.5 text-sm text-nje-anthracite/50 dark:text-slate-400 transition-colors">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-nje-anthracite/40 dark:text-slate-500 hover:bg-nje-pearl dark:hover:bg-slate-800 hover:text-nje-anthracite dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-nje-cyan/40"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div
          className={cn(
            "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent",
            !hideHeader ? "p-6" : "",
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
