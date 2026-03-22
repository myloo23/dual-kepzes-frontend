import { useState, useCallback, useEffect } from "react";
import { Images, RefreshCw, Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { galleryApi } from "@/features/gallery/services/galleryApi";
import type { GalleryGroup } from "@/features/gallery/types";
import { useGalleryAdmin } from "@/features/gallery/hooks/useGalleryAdmin";
import { AlbumCard } from "@/features/gallery/components/AlbumCard";
import { CreateAlbumModal } from "@/features/gallery/components/CreateAlbumModal";

export default function AdminGallery() {
  const [createOpen, setCreateOpen] = useState(false);
  const [groups, setGroups] = useState<GalleryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryApi.listGroups();
      setGroups(data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Hiba a galéria betöltésekor.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const { actionLoading, createGroup, deleteGroup, uploadImage, deleteImage } =
    useGalleryAdmin(setGroups, fetchGroups);

  const totalImages = groups.reduce(
    (sum: number, g: GalleryGroup) => sum + g.images.length,
    0,
  );

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleCreateGroup = async (name: string, description?: string) => {
    await createGroup(name, description);
    flash(`„${name}" album létrehozva.`);
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      flash("Album törölve.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Hiba az album törlésekor.",
      );
    }
  };

  const handleUploadImage = async (groupId: string, file: File) => {
    try {
      await uploadImage(groupId, file);
      flash("Kép feltöltve.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Hiba a feltöltés során.",
      );
    }
  };

  const handleDeleteImage = async (imageId: string, groupId: string) => {
    try {
      await deleteImage(imageId, groupId);
      flash("Kép törölve.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Hiba a kép törlésekor.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Galéria kezelése
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Albumok létrehozása és képek feltöltése a nyilvános galériába.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats pill */}
          {!loading && (
            <div className="hidden sm:flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs transition-colors">
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {groups.length}
                </span>{" "}
                album
              </span>
              <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {totalImages}
                </span>{" "}
                kép
              </span>
            </div>
          )}

          <button
            onClick={fetchGroups}
            disabled={loading || actionLoading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Frissítés
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            disabled={actionLoading || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Új album
          </button>
        </div>
      </div>

      {/* Action loading bar */}
      {actionLoading && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-2.5 text-sm text-blue-700 dark:text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Folyamatban...
        </div>
      )}

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 text-sm text-red-700 dark:text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-sm">Albumok betöltése...</p>
        </div>
      )}

      {/* Error state (initial load failure) */}
      {!loading && error && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <button
            onClick={fetchGroups}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Újrapróbál
          </button>
        </div>
      )}

      {/* Albums list */}
      {!loading && (
        <>
          {groups.length === 0 && !error ? (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-24 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all"
              onClick={() => setCreateOpen(true)}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30">
                <Images className="h-7 w-7 text-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Még nincs album
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Hozd létre az első albumot a galéria indításához
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <AlbumCard
                  key={group.id}
                  group={group}
                  onUpload={handleUploadImage}
                  onDeleteImage={handleDeleteImage}
                  onDeleteGroup={handleDeleteGroup}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create album modal */}
      <CreateAlbumModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  );
}
