import { useMemo } from "react";
import { getCityCoordinates } from "../../../utils/city-coordinates";
import {
  COMPANY_SITES,
  type CompanySiteEntry,
} from "../data/companySites";

export interface GeocodedCompanySite extends CompanySiteEntry {
  id: string;
  zipCode: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface UseCompanySiteGeocodingResult {
  sitesWithCoords: GeocodedCompanySite[];
  loading: boolean;
  progress: { current: number; total: number };
}

interface ParsedHeadquarters {
  zipCode: string;
  city: string;
  address: string;
}

const HUNGARY_CENTER = { lat: 47.1625, lng: 19.5033 };

const ZIP_PREFIX_COORDS: Record<string, { lat: number; lng: number }> = {
  "10": { lat: 47.4979, lng: 19.0402 }, // Budapest
  "11": { lat: 47.4979, lng: 19.0402 },
  "12": { lat: 47.4979, lng: 19.0402 },
  "21": { lat: 47.6383, lng: 19.1419 }, // Dunakeszi / Pest
  "23": { lat: 47.35, lng: 19.3 }, // Dabas / Pest
  "25": { lat: 47.7928, lng: 18.7436 }, // Esztergom
  "26": { lat: 47.7758, lng: 19.1347 }, // Vác
  "27": { lat: 47.1717, lng: 19.8014 }, // Cegléd
  "28": { lat: 47.5692, lng: 18.4041 }, // Tatabánya
  "41": { lat: 47.6694, lng: 21.5119 }, // Nádudvar / Hajdú térség
  "50": { lat: 47.1747, lng: 20.1993 }, // Szolnok
  "51": { lat: 47.5, lng: 19.9167 }, // Jászberény
  "54": { lat: 46.84, lng: 20.29 }, // Kunszentmárton térség
  "57": { lat: 46.65, lng: 21.2833 }, // Gyula
  "58": { lat: 46.35, lng: 21.13 }, // Dombegyház térség
  "59": { lat: 46.5667, lng: 20.6667 }, // Orosháza
  "60": { lat: 46.9062, lng: 19.6913 }, // Kecskemét
  "61": { lat: 46.8, lng: 19.5 }, // Bács-Kiskun régió
  "62": { lat: 46.7, lng: 19.85 }, // Kiskunfélegyháza térség
  "65": { lat: 46.1819, lng: 18.9553 }, // Baja
  "66": { lat: 46.65, lng: 20.2667 }, // Szentes
  "67": { lat: 46.253, lng: 20.1414 }, // Szeged
  "68": { lat: 46.4181, lng: 20.3294 }, // Hódmezővásárhely
  "74": { lat: 46.3594, lng: 17.7967 }, // Kaposvár
  "75": { lat: 46.2333, lng: 17.35 }, // Nagyatád
  "80": { lat: 47.19, lng: 18.4108 }, // Székesfehérvár
  "81": { lat: 47.13, lng: 18.58 }, // Seregélyes térség
  "84": { lat: 47.1, lng: 17.5667 }, // Ajka
  "92": { lat: 47.8681, lng: 17.2708 }, // Mosonmagyaróvár térség
  "96": { lat: 47.25, lng: 16.9333 }, // Sárvár
};

function parseHeadquarters(headquarters: string): ParsedHeadquarters {
  const cleaned = headquarters.trim().replace(/^"+|"+$/g, "");
  const match = cleaned.match(/^(\d{4})\s+([^,]+),\s*(.+)$/);

  if (match) {
    return {
      zipCode: match[1].trim(),
      city: match[2].trim(),
      address: match[3].trim(),
    };
  }

  return {
    zipCode: "",
    city: "",
    address: cleaned,
  };
}

function fallbackByIndex(index: number) {
  const row = Math.floor(index / 11);
  const col = index % 11;
  return {
    lat: HUNGARY_CENTER.lat + (row - 4) * 0.025,
    lng: HUNGARY_CENTER.lng + (col - 5) * 0.03,
  };
}

function getCoordsByZipPrefix(zipCode: string): { lat: number; lng: number } | null {
  if (!zipCode || zipCode.length < 2) return null;
  return ZIP_PREFIX_COORDS[zipCode.slice(0, 2)] ?? null;
}

export function useCompanySiteGeocoding(): UseCompanySiteGeocodingResult {
  const sitesWithCoords = useMemo(() => {
    return COMPANY_SITES.map((site, index) => {
      const parsed = parseHeadquarters(site.headquarters);

      const coords =
        (parsed.city ? getCityCoordinates(parsed.city) : null) ??
        getCoordsByZipPrefix(parsed.zipCode) ??
        fallbackByIndex(index);

      return {
        ...site,
        id: `home-site-${index + 1}`,
        zipCode: parsed.zipCode,
        city: parsed.city,
        address: parsed.address,
        latitude: coords.lat,
        longitude: coords.lng,
      };
    });
  }, []);

  return {
    sitesWithCoords,
    loading: false,
    progress: { current: sitesWithCoords.length, total: sitesWithCoords.length },
  };
}
