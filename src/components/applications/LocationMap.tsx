import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icons for company and user locations
const companyIcon = L.icon({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Red marker for user location
const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" 
                  fill="#EF4444" stroke="#991B1B" stroke-width="1"/>
            <circle cx="12.5" cy="12.5" r="4" fill="white"/>
        </svg>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

interface LocationMapProps {
    companyName: string;
    companyCity: string;
    companyAddress: string;
}

interface Coordinates {
    lat: number;
    lng: number;
}

export default function LocationMap({
    companyName,
    companyCity,
    companyAddress,
}: LocationMapProps) {
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

                // Construct full address for better geocoding results
                const fullAddress = `${companyAddress}, ${companyCity}, Hungary`;
                const encodedAddress = encodeURIComponent(fullAddress);

                // Using Photon API (more lenient than Nominatim)
                const response = await fetch(
                    `https://photon.komoot.io/api/?q=${encodedAddress}&limit=1`
                );

                if (!response.ok) {
                    throw new Error("Geocoding szolgáltatás nem elérhető");
                }

                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    // Photon returns GeoJSON format: coordinates are [lng, lat]
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
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Helymeghatározás engedély megtagadva");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("A helyzet nem elérhető");
                        break;
                    case error.TIMEOUT:
                        setLocationError("Helymeghatározás időtúllépés");
                        break;
                    default:
                        setLocationError("Ismeretlen hiba történt");
                }
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

    const isLoading = isLoadingGeocode || isLoadingLocation;

    // Determine map center and zoom
    const getMapCenter = (): [number, number] => {
        if (companyCoords && userCoords) {
            // Center between both points
            return [
                (companyCoords.lat + userCoords.lat) / 2,
                (companyCoords.lng + userCoords.lng) / 2,
            ];
        }
        if (companyCoords) {
            return [companyCoords.lat, companyCoords.lng];
        }
        if (userCoords) {
            return [userCoords.lat, userCoords.lng];
        }
        // Default to Hungary center
        return [47.1, 19.5];
    };

    const getMapZoom = (): number => {
        if (companyCoords && userCoords) {
            const distance = calculateDistance(companyCoords, userCoords);
            // Adjust zoom based on distance
            if (distance < 5) return 12;
            if (distance < 20) return 10;
            if (distance < 50) return 9;
            if (distance < 100) return 8;
            return 7;
        }
        return 13; // Default zoom for single location
    };

    const distance =
        companyCoords && userCoords
            ? calculateDistance(companyCoords, userCoords)
            : null;

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
                Helyszín
            </label>

            {/* Loading state */}
            {isLoading && (
                <div className="h-[300px] rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <div className="text-center space-y-2">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-slate-600">
                            {isLoadingGeocode && "Cím meghatározása..."}
                            {!isLoadingGeocode && isLoadingLocation && "Helyzet lekérése..."}
                        </p>
                    </div>
                </div>
            )}

            {/* Error states */}
            {!isLoading && geocodingError && !companyCoords && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    ⚠️ {geocodingError}
                </div>
            )}

            {/* Map */}
            {!isLoading && (companyCoords || userCoords) && (
                <div className="h-[300px] rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                    <MapContainer
                        center={getMapCenter()}
                        zoom={getMapZoom()}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Company marker */}
                        {companyCoords && (
                            <Marker
                                position={[companyCoords.lat, companyCoords.lng]}
                                icon={companyIcon}
                            >
                                <Popup>
                                    <div className="text-xs space-y-1">
                                        <div className="font-semibold text-slate-900">
                                            {companyName}
                                        </div>
                                        <div className="text-slate-600">
                                            {companyAddress}
                                        </div>
                                        <div className="text-slate-500">{companyCity}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* User marker */}
                        {userCoords && (
                            <Marker
                                position={[userCoords.lat, userCoords.lng]}
                                icon={userIcon}
                            >
                                <Popup>
                                    <div className="text-xs space-y-1">
                                        <div className="font-semibold text-slate-900">
                                            Az Ön helyzete
                                        </div>
                                        <div className="text-slate-600">
                                            {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            )}

            {/* Location permission info */}
            {!isLoadingLocation && locationError && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-800">
                    ℹ️ {locationError}. A térkép csak a cég helyszínét mutatja.
                </div>
            )}

            {/* Distance display - prominent */}
            {distance !== null && (
                <div className="rounded-lg border-2 border-green-300 bg-green-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">
                                Távolság a cégtől
                            </p>
                            <p className="text-2xl font-bold text-green-700">
                                {distance.toFixed(1)} km
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
