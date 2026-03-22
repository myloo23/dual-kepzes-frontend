import { useState } from "react";
import { Camera, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/utils/cn";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("Összes");
  const { images, categories, loading, error, refresh } = useGallery();

  const filtered =
    activeCategory === "Összes"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 py-16 text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Camera className="h-4 w-4" />
            Duális Képzés Pillanatai
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Galéria
          </h1>
          <p className="mt-3 text-base text-blue-100 sm:text-lg">
            Valódi pillanatok, valódi élmények – így zajlik a duális képzés az
            NJE-n és a partnervállalatainknál.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm">Képek betöltése...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-3 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Újrapróbál
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Category filter pills */}
            <div className="mb-8 flex flex-wrap gap-2 items-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600"
                  )}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto flex items-center text-sm text-slate-400 dark:text-slate-500">
                {filtered.length} kép
              </span>
            </div>

            {/* Gallery */}
            {filtered.length > 0 ? (
              <GalleryGrid images={filtered} />
            ) : (
              <div className="py-24 text-center text-slate-400 dark:text-slate-500">
                <Camera className="mx-auto mb-3 h-12 w-12 opacity-30" />
                <p className="text-sm">Nincs kép ebben a kategóriában.</p>
              </div>
            )}

            {/* Footer note */}
            <p className="mt-12 text-center text-xs text-slate-400 dark:text-slate-600">
              A galéria folyamatosan bővül. A képek feltöltéséhez fordulj a
              koordinátorokhoz.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
