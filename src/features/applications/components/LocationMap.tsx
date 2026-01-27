import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocationGeocoding } from "../hooks/useLocationGeocoding";

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

export default function LocationMap({
    companyName,
    companyCity,
    companyAddress,
}: LocationMapProps) {
    // Use custom location geocoding hook
    const {
        companyCoords,
        userCoords,
        geocodingError,
        locationError,
        isLoadingGeocode,
        isLoadingLocation,
        distance,
    } = useLocationGeocoding(companyCity, companyAddress);

    const isLoading = isLoadingGeocode || isLoadingLocation;

    // Determine map center and zoom
    const getMapCenter = (): [number, number] => {
        if (companyCoords && userCoords) {
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
        return [47.1, 19.5]; // Default to Hungary center
    };

    const getMapZoom = (): number => {
        if (companyCoords && userCoords && distance) {
            if (distance < 5) return 12;
            if (distance < 20) return 10;
            if (distance < 50) return 9;
            if (distance < 100) return 8;
            return 7;
        }
        return 13; // Default zoom for single location
    };

    const mapCenter = useMemo(getMapCenter, [companyCoords, userCoords]);
    const mapZoom = useMemo(getMapZoom, [companyCoords, userCoords, distance]);

    if (isLoading) {
        return (
            <div className="w-full h-[400px] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-2">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-slate-600">Térkép betöltése...</p>
                </div>
            </div>
        );
    }

    if (geocodingError) {
        return (
            <div className="w-full h-[400px] rounded-xl border border-red-200 bg-red-50 flex items-center justify-center">
                <div className="text-center space-y-2 p-4">
                    <MapPin className="w-8 h-8 text-red-600 mx-auto" />
                    <p className="text-sm text-red-800 font-medium">
                        {geocodingError}
                    </p>
                </div>
            </div>
        );
    }

    if (!companyCoords) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Company marker */}
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
                                    {companyAddress}, {companyCity}
                                </div>
                            </div>
                        </Popup>
                    </Marker>

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

            {/* Distance display */}
            {distance && userCoords && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-green-700 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-green-900">
                                Távolság a munkahelytől
                            </p>
                            <p className="text-2xl font-bold text-green-700">
                                {distance.toFixed(1)} km
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Location error (optional - user location not critical) */}
            {locationError && !userCoords && (
                <div className="text-xs text-slate-500 italic">
                    {locationError}
                </div>
            )}
        </div>
    );
}
