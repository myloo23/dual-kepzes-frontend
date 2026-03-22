import { useState, useCallback } from "react";
import { galleryApi } from "../services/galleryApi";
import type { GalleryGroup } from "../types";

export interface UseGalleryAdminReturn {
  actionLoading: boolean;
  createGroup: (name: string, description?: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  uploadImage: (groupId: string, file: File) => Promise<void>;
  deleteImage: (imageId: string, groupId: string) => Promise<void>;
}

/**
 * All actions THROW on failure so the caller can handle errors
 * (show them in the modal, in an inline message, etc.).
 * Actions resolve silently on success — the caller is responsible
 * for refreshing state (fetchGroups / optimistic setGroups).
 */
export function useGalleryAdmin(
  setGroups: React.Dispatch<React.SetStateAction<GalleryGroup[]>>,
  fetchGroups: () => Promise<void>,
): UseGalleryAdminReturn {
  const [actionLoading, setActionLoading] = useState(false);

  const createGroup = useCallback(
    async (title: string, description?: string) => {
      setActionLoading(true);
      try {
        await galleryApi.createGroup({ title, description });
        await fetchGroups();
      } finally {
        setActionLoading(false);
      }
    },
    [fetchGroups],
  );

  const deleteGroup = useCallback(
    async (groupId: string) => {
      setActionLoading(true);
      try {
        await galleryApi.deleteGroup(groupId);
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
      } finally {
        setActionLoading(false);
      }
    },
    [setGroups],
  );

  const uploadImage = useCallback(
    async (groupId: string, file: File) => {
      setActionLoading(true);
      try {
        const fd = new FormData();
        fd.append("image", file);
        await galleryApi.uploadImage(groupId, fd);
        await fetchGroups();
      } finally {
        setActionLoading(false);
      }
    },
    [fetchGroups],
  );

  const deleteImage = useCallback(
    async (imageId: string, groupId: string) => {
      setActionLoading(true);
      try {
        await galleryApi.deleteImage(imageId);
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? { ...g, images: g.images.filter((img) => img.id !== imageId) }
              : g,
          ),
        );
      } finally {
        setActionLoading(false);
      }
    },
    [setGroups],
  );

  return {
    actionLoading,
    createGroup,
    deleteGroup,
    uploadImage,
    deleteImage,
  };
}
