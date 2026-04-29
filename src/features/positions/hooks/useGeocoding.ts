import { useState, useEffect } from "react";
import { getCityCoordinates } from "../../../utils/city-coordinates";
import type { Position } from "../../../lib/api";
import type { Location } from "../../../types/api.types";

export interface PositionWithCoords extends Position {
  latitude?: number;
  longitude?: number;
  mapLocation: Location;
  mapUnitId: string;
  mapUnitLabel: string;
}

interface GeocodingCache {
  [key: string]: { lat: number; lng: number };
}

interface UseGeocodingResult {
  positionsWithCoords: PositionWithCoords[];
  loading: boolean;
  progress: { current: number; total: number };
}

function hasUsableAddress(location?: Location | null): location is Location {
  return Boolean(location?.city && location?.address);
}

function resolvePositionLocation(position: Position): Location | null {
  if (hasUsableAddress(position.location)) {
    return position.location;
  }

  const companyLocations = position.company?.locations ?? [];
  if (companyLocations.length === 0) {
    return null;
  }

  if (position.locationId) {
    const matched = companyLocations.find(
      (loc) => String(loc.id ?? "") === String(position.locationId),
    );
    if (hasUsableAddress(matched)) {
      return matched;
    }
  }

  return companyLocations.find((loc) => hasUsableAddress(loc)) ?? null;
}

function createMapUnitMeta(position: Position, location: Location) {
  const companyKey = String(
    position.companyId ?? position.company?.id ?? "unknown-company",
  );
  const locationKey = String(
    location.id ?? `${location.zipCode ?? ""}|${location.city}|${location.address}`,
  );

  return {
    mapUnitId: `${companyKey}::${locationKey}`,
    mapUnitLabel: `${position.company?.name ?? "Ismeretlen cég"} - ${location.city}, ${location.address}`,
  };
}

/**
 * Custom hook for geocoding positions using Photon API
 * Implements caching and pre-geocoded city fallback
 */
export function useGeocoding(positions: Position[]): UseGeocodingResult {
  const [positionsWithCoords, setPositionsWithCoords] = useState<
    PositionWithCoords[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const hasPositions = positions.length > 0;

  useEffect(() => {
    if (!hasPositions) {
      return;
    }

    const geocodePositions = async () => {
      const geocoded: PositionWithCoords[] = [];
      setProgress({ current: 0, total: positions.length });
      setLoading(true);

      const cacheStorageKey = "geocoding_cache";
      let cache: GeocodingCache = {};
      try {
        const cached = localStorage.getItem(cacheStorageKey);
        if (cached) {
          cache = JSON.parse(cached);
        }
      } catch (e) {
        console.warn("Failed to load geocoding cache:", e);
      }

      for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        setProgress({ current: i + 1, total: positions.length });

        const resolvedLocation = resolvePositionLocation(position);
        const city = resolvedLocation?.city;
        const address = resolvedLocation?.address;

        if (!city || !address || !resolvedLocation) {
          continue;
        }

        const { mapUnitId, mapUnitLabel } = createMapUnitMeta(
          position,
          resolvedLocation,
        );

        const cacheKeyForPosition = `${city}|${address}`;

        if (cache[cacheKeyForPosition]) {
          geocoded.push({
            ...position,
            latitude: cache[cacheKeyForPosition].lat,
            longitude: cache[cacheKeyForPosition].lng,
            mapLocation: resolvedLocation,
            mapUnitId,
            mapUnitLabel,
          });
          continue;
        }

        const cityCoords = getCityCoordinates(city);
        if (cityCoords) {
          geocoded.push({
            ...position,
            latitude: cityCoords.lat,
            longitude: cityCoords.lng,
            mapLocation: resolvedLocation,
            mapUnitId,
            mapUnitLabel,
          });
          cache[cacheKeyForPosition] = cityCoords;
          continue;
        }

        try {
          const fullAddress = `${address}, ${city}, Hungary`;
          const encodedAddress = encodeURIComponent(fullAddress);

          const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodedAddress}&limit=1`,
          );

          if (!response.ok) {
            const cityResponse = await fetch(
              `https://photon.komoot.io/api/?q=${encodeURIComponent(`${city}, Hungary`)}&limit=1`,
            );

            if (cityResponse.ok) {
              const cityData = await cityResponse.json();
              if (cityData.features && cityData.features.length > 0) {
                const coords = {
                  lat: cityData.features[0].geometry.coordinates[1],
                  lng: cityData.features[0].geometry.coordinates[0],
                };
                geocoded.push({
                  ...position,
                  latitude: coords.lat,
                  longitude: coords.lng,
                  mapLocation: resolvedLocation,
                  mapUnitId,
                  mapUnitLabel,
                });
                cache[cacheKeyForPosition] = coords;
              }
            }
            continue;
          }

          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const coords = {
              lat: data.features[0].geometry.coordinates[1],
              lng: data.features[0].geometry.coordinates[0],
            };
            geocoded.push({
              ...position,
              latitude: coords.lat,
              longitude: coords.lng,
              mapLocation: resolvedLocation,
              mapUnitId,
              mapUnitLabel,
            });
            cache[cacheKeyForPosition] = coords;
          } else {
            const cityResponse = await fetch(
              `https://photon.komoot.io/api/?q=${encodeURIComponent(`${city}, Hungary`)}&limit=1`,
            );

            if (cityResponse.ok) {
              const cityData = await cityResponse.json();
              if (cityData.features && cityData.features.length > 0) {
                const coords = {
                  lat: cityData.features[0].geometry.coordinates[1],
                  lng: cityData.features[0].geometry.coordinates[0],
                };
                geocoded.push({
                  ...position,
                  latitude: coords.lat,
                  longitude: coords.lng,
                  mapLocation: resolvedLocation,
                  mapUnitId,
                  mapUnitLabel,
                });
                cache[cacheKeyForPosition] = coords;
              }
            }
          }

          if (i < positions.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.error(`Failed to geocode position ${position.id}:`, error);
        }
      }

      try {
        localStorage.setItem(cacheStorageKey, JSON.stringify(cache));
      } catch (e) {
        console.warn("Failed to save geocoding cache:", e);
      }

      setPositionsWithCoords(geocoded);
      setLoading(false);
    };

    geocodePositions();
  }, [hasPositions, positions]);

  return {
    positionsWithCoords: hasPositions ? positionsWithCoords : [],
    loading: hasPositions ? loading : false,
    progress: hasPositions ? progress : { current: 0, total: 0 },
  };
}
