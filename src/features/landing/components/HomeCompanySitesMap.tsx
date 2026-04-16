import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCompanySiteGeocoding } from "../hooks/useCompanySiteGeocoding";

const defaultIcon = L.icon({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const createGroupedIcon = (siteCount: number) =>
  L.divIcon({
    className: "custom-grouped-marker",
    html: `
      <div class="relative flex justify-center items-end" style="width: 25px; height: 41px;">
        <img src="/leaflet/marker-icon.png" style="width: 25px; height: 41px;" />
        <div class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-sm z-10">
          ${siteCount}
        </div>
      </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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

interface HomeCompanySitesMapProps {
  userLocation?: { lat: number; lng: number } | null;
}

export default function HomeCompanySitesMap({
  userLocation,
}: HomeCompanySitesMapProps) {
  const { sitesWithCoords, loading, progress } = useCompanySiteGeocoding();

  const groupedSites = useMemo(() => {
    const groups = new Map<string, typeof sitesWithCoords>();
    sitesWithCoords.forEach((site) => {
      const key = `${site.latitude.toFixed(4)},${site.longitude.toFixed(4)}`;
      const existing = groups.get(key);
      if (existing) {
        existing.push(site);
        return;
      }
      groups.set(key, [site]);
    });
    return Array.from(groups.values());
  }, [sitesWithCoords]);

  const mapCenter: [number, number] = useMemo(() => {
    if (!sitesWithCoords.length && userLocation) {
      return [userLocation.lat, userLocation.lng];
    }

    if (!sitesWithCoords.length) {
      return [47.1, 19.5];
    }

    const avgLat =
      sitesWithCoords.reduce((sum, site) => sum + site.latitude, 0) /
      sitesWithCoords.length;
    const avgLng =
      sitesWithCoords.reduce((sum, site) => sum + site.longitude, 0) /
      sitesWithCoords.length;

    if (!userLocation) {
      return [avgLat, avgLng];
    }

    return [(userLocation.lat + avgLat) / 2, (userLocation.lng + avgLng) / 2];
  }, [sitesWithCoords, userLocation]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-nje-jaffa mb-3"></div>
        <p className="text-sm text-slate-600">
          {progress.total > 0
            ? `Telephelyek feldolgozása... ${progress.current} / ${progress.total}`
            : "Térkép betöltése..."}
        </p>
      </div>
    );
  }

  if (!sitesWithCoords.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-nje-jaffa rounded-full"></div>
          <span className="text-slate-600 dark:text-slate-400 transition-colors">
            Fogadóhelyek (összes telephely):{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">
              {sitesWithCoords.length}
            </span>
          </span>
        </div>
        {userLocation && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-600 dark:text-slate-400 transition-colors">
              Az Ön helyzete
            </span>
          </div>
        )}
      </div>

      <div className="relative z-0 h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none dark:[&_.leaflet-tile-pane]:invert dark:[&_.leaflet-tile-pane]:hue-rotate-180 dark:[&_.leaflet-tile-pane]:opacity-80 transition-colors">
        <MapContainer
          center={mapCenter}
          zoom={7}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {groupedSites.map((group) => {
            const first = group[0];
            const icon =
              group.length > 1 ? createGroupedIcon(group.length) : defaultIcon;

            return (
              <Marker
                key={`${first.latitude.toFixed(4)},${first.longitude.toFixed(4)}`}
                position={[first.latitude, first.longitude]}
                icon={icon}
              >
                <Popup>
                  <div className="text-xs min-w-[240px] max-h-[280px] overflow-y-auto pr-1">
                    {group.map((site, index) => (
                      <div
                        key={site.id}
                        className={`pb-2 ${
                          index !== group.length - 1
                            ? "border-b border-slate-200 mb-2"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-slate-900 text-sm leading-tight">
                          {site.companyName}
                        </div>
                        <div className="text-slate-600">
                          {site.zipCode} {site.city}
                        </div>
                        <div className="text-slate-500">{site.address}</div>
                      </div>
                    ))}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-slate-900">Az Ön helyzete</div>
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
