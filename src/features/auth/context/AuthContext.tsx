import { useState, useEffect, type ReactNode } from "react";
import type { User } from "../../../types/api.types";
import { AuthContext } from "./authContextDef";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Optionally validate token specifically if needed,
        // but api interceptors usually handle 401s
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, newUser: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("role", newUser.role);

    setUser(newUser);

    // Notify other tabs/components if they listen to storage events
    // (though Context handles internal app state now)
    window.dispatchEvent(new Event("localStorageUpdated"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setUser(null);

    window.dispatchEvent(new Event("localStorageUpdated"));

    // Use hard redirect to ensure complete state cleanup and prevent white screen
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
