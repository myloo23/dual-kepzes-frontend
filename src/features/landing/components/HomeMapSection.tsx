import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePositions } from "../../positions/hooks/usePositions";
import PositionsMap from "../../positions/components/PositionsMap";
import { isExpired } from "../../positions/utils/positions.utils";
import { Navigation } from "lucide-react";

export default function HomeMapSection() {
  const navigate = useNavigate();
  const { positions, loading, error } = usePositions();
  
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user location for map
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

  const handlePositionClick = (positionId: string | number) => {
    navigate(`/positions?id=${positionId}`);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500">Térkép betöltése...</p>
      </div>
    );
  }

  if (error) {
    return null;
  }

  const activePositions = positions.filter(p => !isExpired(p.deadline));

  if (activePositions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 transition-colors">
          A térképen
        </h3>
        {gpsLocation && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span>Mérve a jelenlegi pozíciójából</span>
          </div>
        )}
      </div>
      
      <PositionsMap
        positions={activePositions}
        userLocation={gpsLocation}
        onPositionClick={handlePositionClick}
      />
    </div>
  );
}
