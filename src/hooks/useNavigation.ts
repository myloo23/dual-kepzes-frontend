import { useState, useEffect } from "react";
import { useAuth } from "../features/auth";
import { ROLE_NAVIGATION_PATHS, type UserRole } from "../config/navigation";

export function useNavigation() {
  const { user, isAuthenticated } = useAuth();
  const [links, setLinks] = useState<{ news: string | null; dashboard: string | null }>({
    news: null,
    dashboard: null,
  });

  useEffect(() => {
    const calculateLinks = () => {
      // Fallback to localStorage if auth context isn't ready/persisted differently
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      const role = (user?.role || localStorage.getItem("role") || "").toUpperCase() as UserRole;
      
      const isLoggedIn = isAuthenticated || !!token;

      if (!isLoggedIn || !role || !ROLE_NAVIGATION_PATHS[role]) {
        setLinks({ news: null, dashboard: null });
        return;
      }

      setLinks(ROLE_NAVIGATION_PATHS[role]);
    };

    calculateLinks();

    // Listen to storage events for cross-tab sync or manual updates
    const handleStorageChange = () => calculateLinks();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdated", handleStorageChange);
    };
  }, [user?.role, isAuthenticated]);

  return links;
}
