import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api, type Position } from "../../lib/api";
import { isExpired } from "../../features/positions/utils/positions.utils";
import { useGeocoding, type PositionWithCoords } from "../../features/positions/hooks/useGeocoding";

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

// Inactive (grayscale) marker
const inactiveIcon = L.icon({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "grayscale opacity-75",
});

// Grouped marker - badge shows unique site count
const createGroupedIcon = (siteCount: number, hasActive: boolean) => L.divIcon({
  className: "custom-grouped-marker",
  html: `
    <div class="relative flex justify-center items-end" style="width: 25px; height: 41px;">
       <img src="/leaflet/marker-icon.png" style="width: 25px; height: 41px;" class="${!hasActive ? 'grayscale opacity-75' : ''}" />
       <div class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-sm z-10">
         ${siteCount}
       </div>
    </div>
  `,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Red marker for user location
const userIcon = L.divIcon({
  className: "custom-user-marker",
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

interface UserLocation {
  lat: number;
  lng: number;
}

function MapPage() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use custom geocoding hook
  const { positionsWithCoords, loading, progress } = useGeocoding(positions);

  // Group positions by coordinates - badge shows unique site count
  const groupedPositions = useMemo(() => {
    const groups = new Map<string, PositionWithCoords[]>();

    positionsWithCoords.forEach((p) => {
      const lat = p.latitude?.toFixed(4);
      const lng = p.longitude?.toFixed(4);
      const key = `${lat},${lng}`;

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      const existing = groups.get(key)!;
      if (!existing.find((e) => e.id === p.id)) {
        existing.push(p);
      }
    });

    return Array.from(groups.values());
  }, [positionsWithCoords]);

  // Total unique receiving site count for the legend.
  const uniqueSiteCount = useMemo(() => {
    return new Set(positionsWithCoords.map((p) => p.mapUnitId)).size;
  }, [positionsWithCoords]);


  // Fetch positions from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setError(null);
        console.log("🔄 Fetching positions from API...");
        const res = await api.positions.listPublic();

        console.log("📦 API Response:", res);

        const activePositions = Array.isArray(res)
          ? res.filter((p) => !isExpired(p.deadline))
          : [];

        console.log(`✅ Loaded ${activePositions.length} active positions`);

        setPositions(activePositions);
      } catch (e) {
        console.error("❌ Failed to fetch positions:", e);
        setError("A pozíciók betöltése sikertelen volt.");
      }
    };

    fetchPositions();
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  // Calculate map center
  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation && positionsWithCoords.length > 0) {
      const avgLat =
        positionsWithCoords.reduce(
          (sum: number, p: any) => sum + (p.latitude || 0),
          0,
        ) / positionsWithCoords.length;
      const avgLng =
        positionsWithCoords.reduce(
          (sum: number, p: any) => sum + (p.longitude || 0),
          0,
        ) / positionsWithCoords.length;
      return [(userLocation.lat + avgLat) / 2, (userLocation.lng + avgLng) / 2];
    }

    if (positionsWithCoords.length > 0) {
      const avgLat =
        positionsWithCoords.reduce(
          (sum: number, p: any) => sum + (p.latitude || 0),
          0,
        ) / positionsWithCoords.length;
      const avgLng =
        positionsWithCoords.reduce(
          (sum: number, p: any) => sum + (p.longitude || 0),
          0,
        ) / positionsWithCoords.length;
      return [avgLat, avgLng];
    }

    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }

    return [47.1, 19.5];
  }, [userLocation, positionsWithCoords]);

  const handleViewPosition = (positionId: string | number) => {
    sessionStorage.setItem("openPositionId", String(positionId));
    navigate("/positions");
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Pozíciók térképes megjelenítése
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Itt láthatod, hogy a duális képzésben elérhető pozíciók földrajzilag
          hol helyezkednek el. A jelölőre kattintva megjelenik a pozíció
          részletei.
        </p>
      </header>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-slate-600">
            {progress.total > 0
              ? `Címek feldolgozása... ${progress.current} / ${progress.total}`
              : "Pozíciók betöltése..."}
          </p>
        </div>
      )}

      {!loading && (
        <>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">
                Fogadóhelyek (összes telephely):{" "}
                <span className="font-semibold text-slate-900">
                  {uniqueSiteCount}
                </span>
              </span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">Az Ön helyzete</span>
              </div>
            )}
          </div>

          <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
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

              {groupedPositions.map((group) => {
                const first = group[0];
                const hasActive = group.some(p => !isExpired(p.deadline));
                const uniqueSitesAtCoord = new Set(group.map(p => p.mapUnitId)).size;
                const icon = uniqueSitesAtCoord > 1
                  ? createGroupedIcon(uniqueSitesAtCoord, hasActive)
                  : (!hasActive ? inactiveIcon : defaultIcon);

                return (
                  <Marker
                    key={`${first.latitude?.toFixed(4)},${first.longitude?.toFixed(4)}`}
                    position={[first.latitude!, first.longitude!]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="text-xs min-w-[220px] max-h-[300px] overflow-y-auto pr-1">
                        {group.map((p, index) => {
                          const active = !isExpired(p.deadline);
                          return (
                            <div
                              key={p.id}
                              className={`space-y-1 pb-3 ${
                                index !== group.length - 1 ? 'border-b border-slate-200 mb-3' : ''
                              } ${!active ? 'opacity-70' : ''}`}
                            >
                              <div className="font-semibold text-slate-900 text-sm leading-tight">
                                {p.title}
                                {!active && (
                                  <span className="ml-2 text-[10px] text-red-500 font-bold px-1.5 py-0.5 bg-red-50 border border-red-200 rounded-md">
                                    Lejárt
                                  </span>
                                )}
                              </div>
                              {p.company?.name && (
                                <div className="text-slate-600 font-medium">{p.company.name}</div>
                              )}
                              <div className="text-slate-500">
                                {p.location?.address}, {p.location?.city}
                              </div>
                              <button
                                onClick={() => handleViewPosition(p.id)}
                                className="w-full mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                              >
                                Megnézem az állást
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

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
                        {userLocation.lat.toFixed(4)},{" "}
                        {userLocation.lng.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {positionsWithCoords.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              Jelenleg nincsenek megjeleníthető pozíciók a térképen.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MapPage;
