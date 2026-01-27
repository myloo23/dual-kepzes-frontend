import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Position } from "../../../lib/api";
import { useGeocoding } from "../hooks/useGeocoding";

// Default blue marker for positions
const defaultIcon = L.icon({
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

L.Marker.prototype.options.icon = defaultIcon;

interface PositionsMapProps {
    positions: Position[];
    userLocation?: { lat: number; lng: number } | null;
    onPositionClick?: (positionId: string | number) => void;
}

export default function PositionsMap({
    positions,
    userLocation,
    onPositionClick
}: PositionsMapProps) {
    // Use custom geocoding hook
    const { positionsWithCoords, loading, progress } = useGeocoding(positions);

    // Calculate map center
    const mapCenter: [number, number] = useMemo(() => {
        if (userLocation && positionsWithCoords.length > 0) {
            const avgLat = positionsWithCoords.reduce((sum: number, p: any) => sum + (p.latitude || 0), 0) / positionsWithCoords.length;
            const avgLng = positionsWithCoords.reduce((sum: number, p: any) => sum + (p.longitude || 0), 0) / positionsWithCoords.length;
            return [(userLocation.lat + avgLat) / 2, (userLocation.lng + avgLng) / 2];
        }

        if (positionsWithCoords.length > 0) {
            const avgLat = positionsWithCoords.reduce((sum: number, p: any) => sum + (p.latitude || 0), 0) / positionsWithCoords.length;
            const avgLng = positionsWithCoords.reduce((sum: number, p: any) => sum + (p.longitude || 0), 0) / positionsWithCoords.length;
            return [avgLat, avgLng];
        }

        if (userLocation) {
            return [userLocation.lat, userLocation.lng];
        }

        return [47.1, 19.5];
    }, [userLocation, positionsWithCoords]);

    const handleViewPosition = (positionId: string | number) => {
        if (onPositionClick) {
            onPositionClick(positionId);
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-sm text-slate-600">
                    {progress.total > 0
                        ? `Címek feldolgozása... ${progress.current} / ${progress.total}`
                        : "Térkép betöltése..."}
                </p>
            </div>
        );
    }

    if (positionsWithCoords.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">
                        Pozíciók: <span className="font-semibold text-slate-900">{positionsWithCoords.length}</span>
                    </span>
                </div>
                {userLocation && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-slate-600">Az Ön helyzete</span>
                    </div>
                )}
            </div>

            <div className="relative z-0 h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <MapContainer
                    center={mapCenter}
                    zoom={7}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {positionsWithCoords.map((p) => (
                        <Marker
                            key={p.id}
                            position={[p.latitude!, p.longitude!]}
                            icon={defaultIcon}
                        >
                            <Popup>
                                <div className="text-xs space-y-2 min-w-[200px]">
                                    <div className="font-semibold text-slate-900 text-sm">
                                        {p.title}
                                    </div>
                                    {p.company?.name && (
                                        <div className="text-slate-600">{p.company.name}</div>
                                    )}
                                    <div className="text-slate-500">
                                        {p.location?.address}, {p.location?.city}
                                    </div>
                                    <button
                                        onClick={() => handleViewPosition(p.id!)}
                                        className="w-full mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Megnézem az állást
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {userLocation && (
                        <Marker
                            position={[userLocation.lat, userLocation.lng]}
                            icon={userIcon}
                        >
                            <Popup>
                                <div className="text-xs space-y-1">
                                    <div className="font-semibold text-slate-900">
                                        Az Ön helyzete
                                    </div>
                                    <div className="text-slate-600">
                                        {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
