import { useEffect, useState } from "react";
import { Navigation } from "lucide-react";
import HomeCompanySitesMap from "./HomeCompanySitesMap";

export default function HomeMapSection() {
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user location for map.
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          Képzési helyszínek térképe
        </h3>
        {gpsLocation && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span>Mérve a jelenlegi pozíciójából</span>
          </div>
        )}
      </div>

      <HomeCompanySitesMap userLocation={gpsLocation} />
    </div>
  );
}
