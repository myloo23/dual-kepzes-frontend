import { useState, useEffect } from "react";
import { getCityCoordinates } from "../lib/city-coordinates";
import type { Position } from "../lib/api";

interface PositionWithCoords extends Position {
    latitude?: number;
    longitude?: number;
}

interface GeocodingCache {
    [key: string]: { lat: number; lng: number };
}

interface UseGeocodingResult {
    positionsWithCoords: PositionWithCoords[];
    loading: boolean;
    progress: { current: number; total: number };
}

/**
 * Custom hook for geocoding positions using Photon API
 * Implements caching and pre-geocoded city fallback
 */
export function useGeocoding(positions: Position[]): UseGeocodingResult {
    const [positionsWithCoords, setPositionsWithCoords] = useState<PositionWithCoords[]>([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        if (positions.length === 0) {
            setLoading(false);
            return;
        }

        const geocodePositions = async () => {
            const geocoded: PositionWithCoords[] = [];
            setProgress({ current: 0, total: positions.length });

            console.log(`🗺️ Starting geocoding for ${positions.length} positions`);

            // Load cache from localStorage
            const cacheKey = 'geocoding_cache';
            let cache: GeocodingCache = {};
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    cache = JSON.parse(cached);
                    console.log(`📦 Loaded geocoding cache with ${Object.keys(cache).length} entries`);
                }
            } catch (e) {
                console.warn('Failed to load geocoding cache:', e);
            }

            for (let i = 0; i < positions.length; i++) {
                const position = positions[i];
                setProgress({ current: i + 1, total: positions.length });

                // Extract location data, handling both flat and nested structures
                // Extract location data
                const city = position.location?.city;
                const address = position.location?.address;

                console.log(`📍 Geocoding position ${i + 1}/${positions.length}:`, {
                    id: position.id,
                    title: position.title,
                    city,
                    address,
                });

                // Skip if no city or address
                if (!city || !address) {
                    console.warn(`⚠️ Skipping position ${position.id} - missing city or address`);
                    continue;
                }

                // Check cache first
                const cacheKeyForPosition = `${city}|${address}`;
                if (cache[cacheKeyForPosition]) {
                    console.log(`💾 Using cached coordinates for: ${cacheKeyForPosition}`);
                    geocoded.push({
                        ...position,
                        latitude: cache[cacheKeyForPosition].lat,
                        longitude: cache[cacheKeyForPosition].lng,
                    });
                    continue;
                }

                // Try pre-geocoded city coordinates
                const cityCoords = getCityCoordinates(city);
                if (cityCoords) {
                    console.log(`🏙️ Using pre-geocoded coordinates for city: ${city}`);
                    geocoded.push({
                        ...position,
                        latitude: cityCoords.lat,
                        longitude: cityCoords.lng,
                    });
                    cache[cacheKeyForPosition] = cityCoords;
                    continue;
                }

                console.log(`🌐 No cache or pre-geocoded data found, geocoding from Photon API...`);

                try {
                    const fullAddress = `${address}, ${city}, Hungary`;
                    const encodedAddress = encodeURIComponent(fullAddress);

                    console.log(`🔍 Trying full address with Photon: ${fullAddress}`);

                    // Using Photon API
                    const response = await fetch(
                        `https://photon.komoot.io/api/?q=${encodedAddress}&limit=1`
                    );

                    if (!response.ok) {
                        console.error(`❌ Photon API error: ${response.status}`);
                        // Try city-only fallback
                        const cityResponse = await fetch(
                            `https://photon.komoot.io/api/?q=${encodeURIComponent(`${city}, Hungary`)}&limit=1`
                        );

                        if (cityResponse.ok) {
                            const cityData = await cityResponse.json();
                            if (cityData.features && cityData.features.length > 0) {
                                const coords = {
                                    lat: cityData.features[0].geometry.coordinates[1],
                                    lng: cityData.features[0].geometry.coordinates[0],
                                };
                                console.log(`✅ City geocoded with Photon:`, coords);
                                geocoded.push({
                                    ...position,
                                    latitude: coords.lat,
                                    longitude: coords.lng,
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
                        console.log(`✅ Geocoded successfully with Photon:`, coords);
                        geocoded.push({
                            ...position,
                            latitude: coords.lat,
                            longitude: coords.lng,
                        });
                        cache[cacheKeyForPosition] = coords;
                    } else {
                        // Fallback: try city only
                        console.log(`🔄 Full address failed, trying city only: ${city}`);
                        const cityResponse = await fetch(
                            `https://photon.komoot.io/api/?q=${encodeURIComponent(`${city}, Hungary`)}&limit=1`
                        );

                        if (cityResponse.ok) {
                            const cityData = await cityResponse.json();
                            if (cityData.features && cityData.features.length > 0) {
                                const coords = {
                                    lat: cityData.features[0].geometry.coordinates[1],
                                    lng: cityData.features[0].geometry.coordinates[0],
                                };
                                console.log(`✅ City geocoded with Photon:`, coords);
                                geocoded.push({
                                    ...position,
                                    latitude: coords.lat,
                                    longitude: coords.lng,
                                });
                                cache[cacheKeyForPosition] = coords;
                            } else {
                                console.warn(`❌ City geocoding also failed for: ${city}`);
                            }
                        }
                    }

                    // Rate limiting
                    if (i < positions.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                } catch (error) {
                    console.error(`❌ Failed to geocode position ${position.id}:`, error);
                }
            }

            // Save cache to localStorage
            try {
                localStorage.setItem(cacheKey, JSON.stringify(cache));
                console.log(`💾 Saved geocoding cache with ${Object.keys(cache).length} entries`);
            } catch (e) {
                console.warn('Failed to save geocoding cache:', e);
            }

            console.log(`🎉 Geocoding complete! ${geocoded.length} positions geocoded successfully`);
            setPositionsWithCoords(geocoded);
            setLoading(false);
        };

        geocodePositions();
    }, [positions]);

    return { positionsWithCoords, loading, progress };
}
