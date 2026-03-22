// ============= API Response Types (from /api/galleries) =============

export interface GalleryImageItem {
  id: string;
  galleryGroupId: string;
  url: string;
  publicId: string | null;
  caption: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryGroup {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  images: GalleryImageItem[];
}

// ============= UI / Component Friendly Types =============

/** Flattened image shape used by the GalleryGrid / Lightbox components */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category?: string; // maps to the group name
}
