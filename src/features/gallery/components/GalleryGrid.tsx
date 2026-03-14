import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/utils/cn";
import type { GalleryImage } from "../types";

interface LightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") onClose();
  };

  const image = images[current];

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Kép nagyítva"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Bezárás"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
        aria-label="Előző"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>

      {/* Image */}
      <div
        className="relative max-h-[90vh] max-w-[90vw] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={image.id}
          src={image.src}
          alt={image.alt}
          className="max-h-[82vh] max-w-[88vw] rounded-xl object-contain shadow-2xl animate-in zoom-in-95 duration-200"
        />
        {image.caption && (
          <p className="text-sm text-white/70 text-center">{image.caption}</p>
        )}
      </div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
        aria-label="Következő"
      >
        <ChevronRight className="h-7 w-7" />
      </button>
    </div>
  );
}

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {/* Masonry-style grid via CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "group relative break-inside-avoid overflow-hidden rounded-2xl cursor-pointer",
              "shadow-sm hover:shadow-xl transition-all duration-300",
              "border border-slate-200/60 dark:border-slate-800/60"
            )}
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex items-end justify-between">
                <div>
                  {image.category && (
                    <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider mb-1">
                      {image.category}
                    </span>
                  )}
                  {image.caption && (
                    <p className="text-sm font-medium text-white leading-tight">
                      {image.caption}
                    </p>
                  )}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
