import { useState, useEffect } from "react";

interface Coordinates {
    lat: number;
    lng: number;
}

interface UseLocationGeocodingResult {
    companyCoords: Coordinates | null;
    userCoords: Coordinates | null;
    geocodingError: string | null;
    locationError: string | null;
    isLoadingGeocode: boolean;
    isLoadingLocation: boolean;
    distance: number | null;
}

/**
 * Custom hook for geocoding company address and getting user location
 * Used in LocationMap component
 */
export function useLocationGeocoding(
    companyCity: string,
    companyAddress: string
): UseLocationGeocodingResult {
    const [companyCoords, setCompanyCoords] = useState<Coordinates | null>(null);
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
    const [geocodingError, setGeocodingError] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoadingGeocode, setIsLoadingGeocode] = useState(true);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    // Geocode company address
    useEffect(() => {
        const geocodeAddress = async () => {
            try {
                setIsLoadingGeocode(true);
                setGeocodingError(null);

                const fullAddress = `${companyAddress}, ${companyCity}, Hungary`;
                const encodedAddress = encodeURIComponent(fullAddress);

                // Using Photon API
                const response = await fetch(
                    `https://photon.komoot.io/api/?q=${encodedAddress}&limit=1`
                );

                if (!response.ok) {
                    throw new Error("Geocoding szolgáltatás nem elérhető");
                }

                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    setCompanyCoords({
                        lat: data.features[0].geometry.coordinates[1],
                        lng: data.features[0].geometry.coordinates[0],
                    });
                } else {
                    // Fallback: try with just city name
                    const cityResponse = await fetch(
                        `https://photon.komoot.io/api/?q=${encodeURIComponent(
                            `${companyCity}, Hungary`
                        )}&limit=1`
                    );

                    const cityData = await cityResponse.json();
                    if (cityData.features && cityData.features.length > 0) {
                        setCompanyCoords({
                            lat: cityData.features[0].geometry.coordinates[1],
                            lng: cityData.features[0].geometry.coordinates[0],
                        });
                    } else {
                        setGeocodingError("A cég címe nem található a térképen");
                    }
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                setGeocodingError("Hiba történt a cím meghatározása során");
            } finally {
                setIsLoadingGeocode(false);
            }
        };

        if (companyCity && companyAddress) {
            geocodeAddress();
        } else {
            setIsLoadingGeocode(false);
            setGeocodingError("Hiányos címadatok");
        }
    }, [companyCity, companyAddress]);

    // Get user's current location
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("A böngésző nem támogatja a helymeghatározást");
            setIsLoadingLocation(false);
            return;
        }

        setIsLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocationError(null);
                setIsLoadingLocation(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                let errorMessage = "Nem sikerült meghatározni a tartózkodási helyet";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Helymeghatározás engedély megtagadva";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Helymeghatározás nem elérhető";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Helymeghatározás időtúllépés";
                        break;
                }

                setLocationError(errorMessage);
                setIsLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, []);

    // Calculate distance between two coordinates (in km)
    const calculateDistance = (
        coord1: Coordinates,
        coord2: Coordinates
    ): number => {
        const R = 6371; // Earth's radius in km
        const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
        const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((coord1.lat * Math.PI) / 180) *
            Math.cos((coord2.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const distance =
        companyCoords && userCoords
            ? calculateDistance(companyCoords, userCoords)
            : null;

    return {
        companyCoords,
        userCoords,
        geocodingError,
        locationError,
        isLoadingGeocode,
        isLoadingLocation,
        distance,
    };
}
