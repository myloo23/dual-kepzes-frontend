import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../../assets/logos/dkk_logos/logó.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsLink, setNewsLink] = useState<string | null>(null);
  const [dashboardLink, setDashboardLink] = useState<string | null>(null);
  const location = useLocation();

  // Számítsa ki a linkeket a localStorage alapján
  const calculateLinks = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("auth_token") || "";
    const role = localStorage.getItem("role") || "";

    // DEBUG: Nézd meg a konzolban
    console.log("🔍 Navbar Debug:");
    console.log("  Token:", token ? `${token.substring(0, 20)}...` : "NINCS");
    console.log("  Role:", role || "NINCS");

    if (!token || !role) {
      console.log("  ❌ Nincs token vagy role - links = null");
      return { news: null, dashboard: null };
    }

    const roleUpper = role.trim().toUpperCase();
    console.log("  Role (uppercase):", roleUpper);

    let news = null;
    let dashboard = null;

    // Student role-ok
    if (roleUpper === "STUDENT") {
      news = "/student/news";
      dashboard = "/student";
    }
    // Admin role-ok
    else if (roleUpper === "ADMIN" || roleUpper === "SYSTEM_ADMIN" || roleUpper === "SUPER_ADMIN") {
      news = "/admin/news";
      dashboard = "/admin";
    }
    // Teacher role-ok
    else if (roleUpper === "TEACHER") {
      // news = "/teacher/news";
      dashboard = "/teacher";
    }
    // Mentor role-ok
    else if (roleUpper === "MENTOR") {
      // news = "/mentor/news";
      dashboard = "/mentor";
    }
    // HR role-ok
    else if (roleUpper === "HR" || roleUpper === "COMPANY_ADMIN") {
      // news = "/hr/news";
      dashboard = "/hr";
    }
    else {
      console.log("  ⚠️ Ismeretlen role - links = null");
    }

    return { news, dashboard };
  };

  // Kezdeti betöltés és localStorage változások figyelése
  useEffect(() => {
    const updateLinks = () => {
      const { news, dashboard } = calculateLinks();
      setNewsLink(news);
      setDashboardLink(dashboard);
    };

    // Kezdeti érték beállítása
    updateLinks();

    // Storage event listener (más tab-ok változásaihoz)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "auth_token" || e.key === "role") {
        console.log("🔄 localStorage változás észlelve (másik tab)");
        updateLinks();
      }
    };

    // Custom event listener (ugyanazon tab változásaihoz)
    const handleCustomStorageChange = () => {
      console.log("🔄 localStorage változás észlelve (ugyanez a tab)");
      updateLinks();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdated", handleCustomStorageChange);
    };
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  const getLinkClass = (path: string) => {
    // Kezdőlap esetén pontos egyezés kell, különben mindenhol aktív lenne
    const isActive = path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

    const baseClass = "transition-colors duration-200";
    const activeClass = "text-dkk-blue font-semibold";
    const inactiveClass = "text-slate-600 hover:text-dkk-blue";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  // Mobil nézethez külön class generátor (nagyobb padding/margin)
  const getMobileLinkClass = (path: string) => {
    // Kezdőlap esetén pontos egyezés kell
    const isActive = path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

    const baseClass = "py-1 block transition-colors duration-200";
    const activeClass = "text-dkk-blue font-semibold";
    const inactiveClass = "text-slate-700 hover:text-dkk-blue";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };


  // DEBUG: Végső ellenőrzés
  console.log("📊 Navbar render - newsLink:", newsLink, "dashboardLink:", dashboardLink);

  return (
    <header className="sticky top-0 z-20 border-b border-dkk-gray/30 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={closeMobileMenu}
        >
          <img
            src={logoImage}
            alt="Duális Képzési Központ"
            className="h-10 object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6 text-sm">
          <Link to="/" className={getLinkClass("/")}>Kezdőlap</Link>

          {dashboardLink && (
            <Link to={dashboardLink} className={getLinkClass(dashboardLink)}>
              Irányítópult
            </Link>
          )}

          <Link to="/positions" className={getLinkClass("/positions")}>Elérhető állások</Link>

          {newsLink && (
            <Link to={newsLink} className={getLinkClass(newsLink)}>Hírek</Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-md border border-slate-300 px-2 py-1 text-slate-700 bg-white shadow-sm"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Menü megnyitása"
        >
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${mobileOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"
                }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden border-t border-dkk-gray/30 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex flex-col gap-2 text-sm">
            <Link to="/" className={getMobileLinkClass("/")} onClick={closeMobileMenu}>Kezdőlap</Link>

            {dashboardLink && (
              <Link to={dashboardLink} className={getMobileLinkClass(dashboardLink)} onClick={closeMobileMenu}>
                Irányítópult
              </Link>
            )}

            <Link to="/positions" className={getMobileLinkClass("/positions")} onClick={closeMobileMenu}>Elérhető állások</Link>

            {newsLink && (
              <Link to={newsLink} className={getMobileLinkClass(newsLink)} onClick={closeMobileMenu}>Hírek</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
