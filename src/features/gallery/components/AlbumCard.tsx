import { useState } from "react";
import { ImagePlus, Trash2, X, FolderOpen, Calendar } from "lucide-react";
import type { GalleryGroup, GalleryImageItem } from "../types";
import { ImageUploadModal } from "./ImageUploadModal";
import { cn } from "@/utils/cn";

interface AlbumCardProps {
  group: GalleryGroup;
  onUpload: (groupId: string, file: File) => Promise<void>;
  onDeleteImage: (imageId: string, groupId: string) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
}

export function AlbumCard({
  group,
  onUpload,
  onDeleteImage,
  onDeleteGroup,
}: AlbumCardProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<GalleryImageItem | null>(null);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleDeleteGroup = () => {
    if (
      !confirm(
        `Biztosan törlöd az „${group.title}" albumot az összes képével együtt? Ez a művelet nem visszavonható.`,
      )
    )
      return;
    onDeleteGroup(group.id);
  };

  const handleDeleteImage = (img: GalleryImageItem) => {
    if (!confirm(`Törlöd ezt a képet?`)) return;
    onDeleteImage(img.id, group.id);
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors">
        {/* Album header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {group.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Calendar className="h-3 w-3" />
                {formatDate(group.createdAt)}
                <span className="mx-1">·</span>
                {group.images.length} kép
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Kép hozzáadása
            </button>
            <button
              onClick={handleDeleteGroup}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Album törlése"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {group.description && (
          <p className="px-5 pt-3 text-xs text-slate-500 dark:text-slate-400">
            {group.description}
          </p>
        )}

        {/* Image grid */}
        <div className="p-4">
          {group.images.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-10 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
              onClick={() => setUploadOpen(true)}
            >
              <ImagePlus className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Kattints a kép feltöltéséhez
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {group.images.map((img) => (
                <div
                  key={img.id}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-xl cursor-pointer",
                    "border border-slate-100 dark:border-slate-800",
                    "hover:shadow-md transition-all duration-200",
                  )}
                  onClick={() => setLightboxImg(img)}
                >
                  <img
                    src={img.url}
                    alt={img.caption ?? "Galéria kép"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Delete overlay */}
                  <button
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img);
                    }}
                    title="Kép törlése"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      <ImageUploadModal
        groupName={group.title}
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(file) => onUpload(group.id, file)}
      />

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightboxImg.url}
            alt={lightboxImg.caption ?? "Galéria kép"}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
