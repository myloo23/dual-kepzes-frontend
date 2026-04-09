import { useEffect, useState, type ChangeEvent } from "react";
import { type Id } from "@/types/api.types";
import { companyApi, type CompanyImage } from "../services/companyApi";

interface CompanyImagesManagerProps {
  companyId: Id;
}

export default function CompanyImagesManager({
  companyId,
}: CompanyImagesManagerProps) {
  const [images, setImages] = useState<CompanyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyApi.companyImages.list(companyId);
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hiba a képek betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadImages();
  }, [companyId]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Csak képfájl tölthetõ fel.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      await companyApi.companyImages.upload(companyId, formData);
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hiba a kép feltöltésekor.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    const confirmed = window.confirm("Biztosan törlöd ezt a képet?");
    if (!confirmed) return;

    setDeletingId(imageId);
    setError(null);

    try {
      await companyApi.companyImages.remove(companyId, imageId);
      setImages((prev) => prev.filter((image) => image.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hiba a kép törlésekor.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Ceges kepek
        </h2>
        <label className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
          {uploading ? "Feltoltes..." : "Uj kep feltoltese"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">Betoltes...</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Meg nincs feltoltott ceges kep.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <article
              key={image.id}
              className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
            >
              <div className="aspect-video bg-slate-100 dark:bg-slate-900">
                <img
                  src={image.url}
                  alt={image.caption || "Ceges kep"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="truncate text-sm text-slate-700 dark:text-slate-300">
                  {image.caption || "Feltoltott kep"}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  {deletingId === image.id ? "Torles..." : "Torles"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
