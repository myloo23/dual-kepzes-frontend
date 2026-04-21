import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }
    }
    return "system";
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme === "dark") return true;
      if (storedTheme === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const applyTheme = (selectedTheme: Theme) => {
      const root = window.document.documentElement;
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const currentlyDark =
        selectedTheme === "dark" ||
        (selectedTheme === "system" && mediaQuery.matches);

      setIsDark(currentlyDark);
      root.classList.remove("light", "dark");
      if (currentlyDark) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
    };

    applyTheme(theme);

    // Watch for system changes if 'system' is selected
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (newTheme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
  };

  return { theme, setTheme: changeTheme, isDark };
}
