import { useState, useEffect, useCallback } from "react";
import { galleryApi } from "../services/galleryApi";
import type { GalleryGroup, GalleryImage } from "../types";

/**
 * Flattens the API response into a list of GalleryImage objects
 * that the existing GalleryGrid component can render.
 */
function toGalleryImages(groups: GalleryGroup[]): GalleryImage[] {
  return groups.flatMap((group) =>
    group.images.map((img) => ({
      id: img.id,
      src: img.url,
      alt: img.caption ?? img.url.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") ?? "Galéria kép",
      caption: undefined,
      category: group.title,
    }))
  );
}

export interface UseGalleryReturn {
  groups: GalleryGroup[];
  images: GalleryImage[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useGallery(): UseGalleryReturn {
  const [groups, setGroups] = useState<GalleryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await galleryApi.listGroups();
      setGroups(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "A galéria betöltése sikertelen.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const images = toGalleryImages(groups);
  const categories = ["Összes", ...groups.map((g) => g.title)];

  return {
    groups,
    images,
    categories,
    loading,
    error,
    refresh: fetchGroups,
  };
}
