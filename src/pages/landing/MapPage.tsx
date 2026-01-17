import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api, type Position } from "../../lib/api";
import { isExpired } from "../../lib/positions-utils";
import { getCityCoordinates } from "../../lib/city-coordinates";

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

interface PositionWithCoords extends Position {
  latitude?: number;
  longitude?: number;
}

interface UserLocation {
  lat: number;
  lng: number;
}

function MapPage() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionsWithCoords, setPositionsWithCoords] = useState<PositionWithCoords[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  // Fetch positions from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching positions from API...");
        const res = await api.positions.listPublic();

        console.log("📦 API Response:", res);
        console.log("📦 Response type:", Array.isArray(res) ? "Array" : typeof res);

        // Filter to only active positions
        const activePositions = Array.isArray(res)
          ? res.filter(p => !isExpired(p.deadline))
          : [];

        console.log(`✅ Loaded ${activePositions.length} active positions (${Array.isArray(res) ? res.length : 0} total)`);

        if (activePositions.length > 0) {
          console.log("📍 First position sample:", activePositions[0]);
        }

        setPositions(activePositions);
      } catch (e) {
        console.error("❌ Failed to fetch positions:", e);
        setError("A pozíciók betöltése sikertelen volt.");
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  // Geocode positions
  useEffect(() => {
    if (positions.length === 0) {
      setLoading(false);
      return;
    }

    const geocodePositions = async () => {
      const geocoded: PositionWithCoords[] = [];
      setGeocodingProgress({ current: 0, total: positions.length });

      console.log(`🗺️ Starting geocoding for ${positions.length} positions`);

      // Load cache from localStorage
      const cacheKey = 'geocoding_cache';
      let cache: Record<string, { lat: number; lng: number }> = {};
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
        setGeocodingProgress({ current: i + 1, total: positions.length });

        console.log(`📍 Geocoding position ${i + 1}/${positions.length}:`, {
          id: position.id,
          title: position.title,
          city: position.city,
          address: position.address,
        });

        // Skip if no city or address
        if (!position.city || !position.address) {
          console.warn(`⚠️ Skipping position ${position.id} - missing city or address`);
          continue;
        }

        // Check cache first
        const cacheKeyForPosition = `${position.city}|${position.address}`;
        console.log(`🔍 Checking cache for: "${cacheKeyForPosition}"`);
        console.log(`📦 Cache has key?`, cache.hasOwnProperty(cacheKeyForPosition));

        if (cache[cacheKeyForPosition]) {
          console.log(`💾 Using cached coordinates for: ${cacheKeyForPosition}`, cache[cacheKeyForPosition]);
          geocoded.push({
            ...position,
            latitude: cache[cacheKeyForPosition].lat,
            longitude: cache[cacheKeyForPosition].lng,
          });
          continue;
        }

        // Try pre-geocoded city coordinates
        const cityCoords = getCityCoordinates(position.city);
        if (cityCoords) {
          console.log(`🏙️ Using pre-geocoded coordinates for city: ${position.city}`, cityCoords);
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
          const fullAddress = `${position.address}, ${position.city}, Hungary`;
          const encodedAddress = encodeURIComponent(fullAddress);

          console.log(`🔍 Trying full address with Photon: ${fullAddress}`);

          // Using Photon API (more lenient than Nominatim)
          const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodedAddress}&limit=1`
          );

          if (!response.ok) {
            console.error(`❌ Photon API error: ${response.status} ${response.statusText}`);
            // Try city-only fallback
            const cityResponse = await fetch(
              `https://photon.komoot.io/api/?q=${encodeURIComponent(`${position.city}, Hungary`)}&limit=1`
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
            // Photon returns GeoJSON format: coordinates are [lng, lat]
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
            console.log(`🔄 Full address failed, trying city only: ${position.city}`);
            const cityResponse = await fetch(
              `https://photon.komoot.io/api/?q=${encodeURIComponent(`${position.city}, Hungary`)}&limit=1`
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
                console.warn(`❌ City geocoding also failed for: ${position.city}`);
              }
            }
          }

          // Reduced rate limiting: Photon is more lenient, 200ms should be enough
          if (i < positions.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.error(`❌ Failed to geocode position ${position.id}:`, error);
          // Continue with next position
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

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Silently fail - user location is optional
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Calculate map center
  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation && positionsWithCoords.length > 0) {
      const avgLat = positionsWithCoords.reduce((sum, p) => sum + (p.latitude || 0), 0) / positionsWithCoords.length;
      const avgLng = positionsWithCoords.reduce((sum, p) => sum + (p.longitude || 0), 0) / positionsWithCoords.length;
      return [(userLocation.lat + avgLat) / 2, (userLocation.lng + avgLng) / 2];
    }

    if (positionsWithCoords.length > 0) {
      const avgLat = positionsWithCoords.reduce((sum, p) => sum + (p.latitude || 0), 0) / positionsWithCoords.length;
      const avgLng = positionsWithCoords.reduce((sum, p) => sum + (p.longitude || 0), 0) / positionsWithCoords.length;
      return [avgLat, avgLng];
    }

    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }

    return [47.1, 19.5];
  }, [userLocation, positionsWithCoords]);

  const handleViewPosition = (positionId: string | number) => {
    sessionStorage.setItem('openPositionId', String(positionId));
    navigate('/positions');
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
          Itt láthatod, hogy a duális képzésben elérhető pozíciók
          földrajzilag hol helyezkednek el. A jelölőre kattintva
          megjelenik a pozíció részletei.
        </p>
      </header>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-slate-600">
            {geocodingProgress.total > 0
              ? `Címek feldolgozása... ${geocodingProgress.current} / ${geocodingProgress.total}`
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
                        {p.address}, {p.city}
                      </div>
                      <button
                        onClick={() => handleViewPosition(p.id)}
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
