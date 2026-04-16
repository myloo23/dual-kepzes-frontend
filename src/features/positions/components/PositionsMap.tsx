import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Position } from "../../../lib/api";
import { useGeocoding, type PositionWithCoords } from "../hooks/useGeocoding";
import {
  isExpired,
  POSITION_TYPE_CONFIG,
} from "../utils/positions.utils";

const createTypeIcon = (fill: string, stroke: string, inactive = false) =>
  L.divIcon({
    className: "",
    html: `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg" style="opacity:${inactive ? 0.5 : 1};filter:${inactive ? "grayscale(1)" : "none"}">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z"
              fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <circle cx="12.5" cy="12.5" r="4.5" fill="white"/>
      </svg>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

const createGroupedIcon = (
  unitCount: number,
  hasActive: boolean,
  fill: string,
  stroke: string,
) =>
  L.divIcon({
    className: "",
    html: `
    <div style="position:relative;width:25px;height:41px;display:flex;justify-content:center;align-items:flex-end;">
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg" style="opacity:${hasActive ? 1 : 0.5};filter:${hasActive ? "none" : "grayscale(1)"}">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z"
              fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <circle cx="12.5" cy="12.5" r="4.5" fill="white"/>
      </svg>
      <div style="position:absolute;top:-8px;right:-8px;background:#EF4444;color:white;font-size:10px;font-weight:700;width:18px;height:18px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,.3);">
        ${unitCount}
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

const universityIcon = L.divIcon({
  className: "custom-university-marker",
  html: `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" 
            fill="#10B981" stroke="#047857" stroke-width="1"/>
      <circle cx="12.5" cy="12.5" r="4" fill="white"/>
      <path d="M12.5 8 L15 13 L10 13 Z" fill="#047857" /> 
    </svg>
  `,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Pre-build type icons
const TYPE_ICONS = {
  DUAL: createTypeIcon(
    POSITION_TYPE_CONFIG.DUAL.mapColor,
    POSITION_TYPE_CONFIG.DUAL.mapStroke,
  ),
  DUAL_inactive: createTypeIcon(
    POSITION_TYPE_CONFIG.DUAL.mapColor,
    POSITION_TYPE_CONFIG.DUAL.mapStroke,
    true,
  ),
  PROFESSIONAL_PRACTICE: createTypeIcon(
    POSITION_TYPE_CONFIG.PROFESSIONAL_PRACTICE.mapColor,
    POSITION_TYPE_CONFIG.PROFESSIONAL_PRACTICE.mapStroke,
  ),
  PROFESSIONAL_PRACTICE_inactive: createTypeIcon(
    POSITION_TYPE_CONFIG.PROFESSIONAL_PRACTICE.mapColor,
    POSITION_TYPE_CONFIG.PROFESSIONAL_PRACTICE.mapStroke,
    true,
  ),
  REGULAR_WORK: createTypeIcon(
    POSITION_TYPE_CONFIG.REGULAR_WORK.mapColor,
    POSITION_TYPE_CONFIG.REGULAR_WORK.mapStroke,
  ),
  REGULAR_WORK_inactive: createTypeIcon(
    POSITION_TYPE_CONFIG.REGULAR_WORK.mapColor,
    POSITION_TYPE_CONFIG.REGULAR_WORK.mapStroke,
    true,
  ),
};

interface PositionsMapProps {
  positions: Position[];
  userLocation?: { lat: number; lng: number } | null;
  onPositionClick?: (positionId: string | number) => void;
}

interface SiteGroup {
  mapUnitId: string;
  companyName: string;
  locationLabel: string;
  positions: PositionWithCoords[];
}

export default function PositionsMap({
  positions,
  userLocation,
  onPositionClick,
}: PositionsMapProps) {
  const { positionsWithCoords, loading, progress } = useGeocoding(positions);

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

  const uniqueSiteCount = useMemo(() => {
    return new Set(positionsWithCoords.map((p) => p.mapUnitId)).size;
  }, [positionsWithCoords]);

  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation && positionsWithCoords.length > 0) {
      const avgLat =
        positionsWithCoords.reduce((sum, p) => sum + (p.latitude || 0), 0) /
        positionsWithCoords.length;
      const avgLng =
        positionsWithCoords.reduce((sum, p) => sum + (p.longitude || 0), 0) /
        positionsWithCoords.length;
      return [(userLocation.lat + avgLat) / 2, (userLocation.lng + avgLng) / 2];
    }

    if (positionsWithCoords.length > 0) {
      const avgLat =
        positionsWithCoords.reduce((sum, p) => sum + (p.latitude || 0), 0) /
        positionsWithCoords.length;
      const avgLng =
        positionsWithCoords.reduce((sum, p) => sum + (p.longitude || 0), 0) /
        positionsWithCoords.length;
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
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: POSITION_TYPE_CONFIG.DUAL.mapColor }}></div>
          <span className="text-slate-600 dark:text-slate-400 transition-colors">Duális</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: POSITION_TYPE_CONFIG.PROFESSIONAL_PRACTICE.mapColor }}></div>
          <span className="text-slate-600 dark:text-slate-400 transition-colors">Szakmai gyakorlat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: POSITION_TYPE_CONFIG.REGULAR_WORK.mapColor }}></div>
          <span className="text-slate-600 dark:text-slate-400 transition-colors">Rendes munka</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400 transition-colors">
            Fogadóhelyek:{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">
              {uniqueSiteCount}
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-slate-600 dark:text-slate-400 transition-colors">
            Egyetem
          </span>
        </div>
      </div>

      <div className="relative z-0 h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none dark:[&_.leaflet-tile-pane]:invert dark:[&_.leaflet-tile-pane]:hue-rotate-180 dark:[&_.leaflet-tile-pane]:opacity-80 transition-colors">
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
            const hasActive = group.some((p) => !isExpired(p.deadline));
            const uniqueSitesAtCoord = new Set(group.map((p) => p.mapUnitId)).size;

            // Determine dominant type for this coordinate group
            const typeCounts: Record<string, number> = {};
            group.forEach((p) => {
              const t = p.type ?? "DUAL";
              typeCounts[t] = (typeCounts[t] ?? 0) + 1;
            });
            const dominantType = Object.entries(typeCounts).sort(
              (a, b) => b[1] - a[1],
            )[0][0] as keyof typeof POSITION_TYPE_CONFIG;
            const { mapColor, mapStroke } =
              POSITION_TYPE_CONFIG[dominantType] ?? POSITION_TYPE_CONFIG.DUAL;

            const icon =
              uniqueSitesAtCoord > 1
                ? createGroupedIcon(uniqueSitesAtCoord, hasActive, mapColor, mapStroke)
                : TYPE_ICONS[
                    `${dominantType}${hasActive ? "" : "_inactive"}` as keyof typeof TYPE_ICONS
                  ] ?? TYPE_ICONS.DUAL;

            const siteGroupsMap = new Map<string, SiteGroup>();
            group.forEach((position) => {
              const existing = siteGroupsMap.get(position.mapUnitId);
              if (existing) {
                existing.positions.push(position);
                return;
              }

              siteGroupsMap.set(position.mapUnitId, {
                mapUnitId: position.mapUnitId,
                companyName: position.company?.name ?? "Ismeretlen cég",
                locationLabel: `${position.mapLocation.city}, ${position.mapLocation.address}`,
                positions: [position],
              });
            });

            const siteGroups = Array.from(siteGroupsMap.values());

            return (
              <Marker
                key={`${first.latitude?.toFixed(4)},${first.longitude?.toFixed(4)}`}
                position={[first.latitude!, first.longitude!]}
                icon={icon}
              >
                <Popup>
                  <div className="text-xs min-w-[220px] max-h-[300px] overflow-y-auto pr-1">
                    {siteGroups.map((site, siteIndex) => (
                      <div
                        key={site.mapUnitId}
                        className={`pb-3 ${
                          siteIndex !== siteGroups.length - 1
                            ? "border-b border-slate-200 mb-3"
                            : ""
                        }`}
                      >
                        <div className="font-semibold text-slate-900 text-sm leading-tight">
                          {site.companyName}
                        </div>
                        <div className="text-slate-500">{site.locationLabel}</div>

                        <div className="mt-2 space-y-2">
                          {site.positions.map((p) => {
                            const active = !isExpired(p.deadline);
                            return (
                              <div
                                key={p.id}
                                className={`rounded-md border px-2 py-1.5 ${
                                  active
                                    ? "border-slate-200"
                                    : "border-red-200 bg-red-50/50 opacity-80"
                                }`}
                              >
                                <div className="font-medium text-slate-800 leading-tight">
                                  {p.title}
                                </div>
                                {!active && (
                                  <div className="mt-1 text-[10px] text-red-600 font-semibold">
                                    Lejárt pozíció
                                  </div>
                                )}
                                <button
                                  onClick={() => handleViewPosition(p.id!)}
                                  className="w-full mt-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                                >
                                  Megnézem az állást
                                </button>
                              </div>
                            );
                          })}
                        </div>
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

          <Marker position={[46.8964, 19.6688]} icon={universityIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-900">Neumann János Egyetem</div>
                <div className="text-slate-600">Kecskemét, Izsáki út 10.</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
