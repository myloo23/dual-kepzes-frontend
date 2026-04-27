import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Navigation, Map as MapIcon } from "lucide-react";

const LazyHomeCompanySitesMap = lazy(() => import("./HomeCompanySitesMap"));

function MapSkeleton() {
  return (
    <div className="space-y-3">
      {/* Legend skeleton */}
      <div className="flex gap-4 text-sm opacity-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse"></div>
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
      </div>
      {/* Map container skeleton */}
      <div className="h-[400px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 animate-pulse flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-3">
        <MapIcon className="w-8 h-8 opacity-50" />
        <span className="text-sm font-medium">Térkép betöltése...</span>
      </div>
    </div>
  );
}

export default function HomeMapSection() {
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Intersection Observer for lazy loading the map
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Load slightly before it comes into view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6" ref={sectionRef}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          Képzési helyszínek térképe
        </h3>
        {gpsLocation && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
            <Navigation className="w-4 h-4 text-nje-jaffa" />
            <span>Mérve a jelenlegi pozíciójából</span>
          </div>
        )}
      </div>

      {isVisible ? (
        <Suspense fallback={<MapSkeleton />}>
          <LazyHomeCompanySitesMap userLocation={gpsLocation} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}
    </div>
  );
}
