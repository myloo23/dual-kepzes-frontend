import type { GalleryImage } from "../types";

// A galéria képei később cserélhetők intézményi fotókra.
export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "1",
    src: "https://picsum.photos/seed/nje1/800/600",
    alt: "Hallgatók a laboratóriumban",
    caption: "Hallgatók a laboratóriumban",
    category: "Oktatás",
  },
  {
    id: "2",
    src: "https://picsum.photos/seed/nje2/600/800",
    alt: "Csapatmunka egy cégnél",
    caption: "Csapatmunka valódi projekten",
    category: "Céges gyakorlat",
  },
  {
    id: "3",
    src: "https://picsum.photos/seed/nje3/800/500",
    alt: "Bemutató a vállalatnál",
    caption: "Prezentáció a mentoroknak",
    category: "Céges gyakorlat",
  },
  {
    id: "4",
    src: "https://picsum.photos/seed/nje4/700/700",
    alt: "Diákok az egyetem előtt",
    caption: "NJE campus hangulat",
    category: "Kampusz",
  },
  {
    id: "5",
    src: "https://picsum.photos/seed/nje5/900/600",
    alt: "Géptermi munka",
    caption: "Géptermi fejlesztési nap",
    category: "Oktatás",
  },
  {
    id: "6",
    src: "https://picsum.photos/seed/nje6/600/900",
    alt: "Mentor és hallgató",
    caption: "Mentor és hallgató együttműködése",
    category: "Mentoring",
  },
  {
    id: "7",
    src: "https://picsum.photos/seed/nje7/800/600",
    alt: "Duális nap az egyetemen",
    caption: "Duális nap – NJE 2024",
    category: "Rendezvény",
  },
  {
    id: "8",
    src: "https://picsum.photos/seed/nje8/600/800",
    alt: "Hallgató bemutató projekten",
    caption: "Projekt bemutató a partnercégnél",
    category: "Céges gyakorlat",
  },
  {
    id: "9",
    src: "https://picsum.photos/seed/nje9/800/550",
    alt: "Csoportkép a rendezvényen",
    caption: "Duális képzés zárórendezvény",
    category: "Rendezvény",
  },
  {
    id: "10",
    src: "https://picsum.photos/seed/nje10/700/900",
    alt: "Műhely gyakorlat",
    caption: "Műhelymunka a partnernél",
    category: "Céges gyakorlat",
  },
  {
    id: "11",
    src: "https://picsum.photos/seed/nje11/900/600",
    alt: "Oktatói előadás",
    caption: "Szakmai előadás sorozat",
    category: "Oktatás",
  },
  {
    id: "12",
    src: "https://picsum.photos/seed/nje12/600/600",
    alt: "Networking esemény",
    caption: "Hallgató-munkáltató találkozó",
    category: "Rendezvény",
  },
];

export const GALLERY_CATEGORIES = [
  "Összes",
  ...Array.from(new Set(GALLERY_IMAGES.map((img) => img.category ?? ""))).filter(Boolean),
];
