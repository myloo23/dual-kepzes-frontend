import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Camera, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import { useGallery } from "@/features/gallery/hooks/useGallery";
import { cn } from "@/utils/cn";

export default function GalleryPage() {
  const allCategoryLabel = "Összes";
  const [activeCategory, setActiveCategory] = useState(allCategoryLabel);
  const { user } = useAuth();
  const isSystemAdmin = user?.role === "SYSTEM_ADMIN";

  const { images, categories, loading, error, refresh } = useGallery();

  const safeCategories = useMemo(() => {
    const onlyGroupCategories = categories.filter(
      (cat) => cat !== allCategoryLabel,
    );
    return [allCategoryLabel, ...onlyGroupCategories];
  }, [categories]);

  const filtered =
    activeCategory === allCategoryLabel
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-800 px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_25%,white,transparent_45%),radial-gradient(circle_at_80%_75%,white,transparent_40%)]" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Életképek
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            A Duális Képzés Pillanatai
          </h1>
          <p className="mt-3 text-base text-sky-100 sm:text-lg">
            Több album és sok kép egységes, áttekinthető megjelenítése.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <section
          className={cn(
            "mb-8 grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:p-6",
            isSystemAdmin ? "md:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-wide text-slate-500">Képek</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {images.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-wide text-slate-500">Albumok</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {Math.max(safeCategories.length - 1, 0)}
            </p>
          </div>

          {isSystemAdmin && (
            <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50 p-4 dark:border-sky-800/80 dark:bg-sky-950/30">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                Admin feltöltés
              </p>
              <p className="mt-1 text-xs text-sky-700/90 dark:text-sky-400">
                Képfeltöltés és albumkezelés az admin galéria felületen érhető el.
              </p>
              <Link
                to="/admin/gallery"
                className="mt-3 inline-flex items-center rounded-full bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-700"
              >
                Galéria kezelése
              </Link>
            </div>
          )}
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-sm">Képek betöltése...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Újrapróbál
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {safeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                  )}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto flex items-center text-sm text-slate-400 dark:text-slate-500">
                {filtered.length} kép
              </span>
            </div>

            {filtered.length > 0 ? (
              <GalleryGrid images={filtered} />
            ) : (
              <div className="py-24 text-center text-slate-400 dark:text-slate-500">
                <Camera className="mx-auto mb-3 h-12 w-12 opacity-30" />
                <p className="text-sm">Nincs kép ebben a kategóriában.</p>
              </div>
            )}

            <p className="mt-12 text-center text-xs text-slate-400 dark:text-slate-600">
              A galéria folyamatosan bővül.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
