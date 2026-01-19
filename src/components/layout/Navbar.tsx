import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/logos/dkk_logos/logó.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsLink, setNewsLink] = useState<string | null>(null);

  // Számítsa ki a newsLink-et a localStorage alapján
  const calculateNewsLink = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("auth_token") || "";
    const role = localStorage.getItem("role") || "";

    // DEBUG: Nézd meg a konzolban
    console.log("🔍 Navbar Debug:");
    console.log("  Token:", token ? `${token.substring(0, 20)}...` : "NINCS");
    console.log("  Role:", role || "NINCS");

    if (!token || !role) {
      console.log("  ❌ Nincs token vagy role - newsLink = null");
      return null;
    }

    const roleUpper = role.trim().toUpperCase();
    console.log("  Role (uppercase):", roleUpper);

    // Student role-ok
    if (roleUpper === "STUDENT") {
      console.log("  ✅ STUDENT role - newsLink = /student/news");
      return "/student/news";
    }

    // Admin role-ok
    if (roleUpper === "ADMIN" || roleUpper === "SYSTEM_ADMIN" || roleUpper === "SUPER_ADMIN") {
      console.log("  ✅ ADMIN role - newsLink = /admin/news");
      return "/admin/news";
    }

    // További role-ok később bővíthetők
    // if (roleUpper === "TEACHER") return "/teacher/news";
    // if (roleUpper === "MENTOR") return "/mentor/news";
    // if (roleUpper === "HR" || roleUpper === "COMPANY_ADMIN") return "/hr/news";

    console.log("  ⚠️ Ismeretlen role - newsLink = null");
    return null;
  };

  // Kezdeti betöltés és localStorage változások figyelése
  useEffect(() => {
    // Kezdeti érték beállítása
    setNewsLink(calculateNewsLink());

    // Storage event listener (más tab-ok változásaihoz)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "auth_token" || e.key === "role") {
        console.log("🔄 localStorage változás észlelve (másik tab)");
        setNewsLink(calculateNewsLink());
      }
    };

    // Custom event listener (ugyanazon tab változásaihoz)
    const handleCustomStorageChange = () => {
      console.log("🔄 localStorage változás észlelve (ugyanez a tab)");
      setNewsLink(calculateNewsLink());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdated", handleCustomStorageChange);
    };
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  // DEBUG: Végső ellenőrzés
  console.log("📊 Navbar render - newsLink:", newsLink);

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
        <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
          <Link to="/" className="hover:text-dkk-blue">Kezdőlap</Link>
          <Link to="/positions" className="hover:text-dkk-blue">Elérhető állások</Link>
          {newsLink && (
            <Link to={newsLink} className="hover:text-dkk-blue">Hírek</Link>
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
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex flex-col gap-2 text-sm text-slate-700">
            <Link to="/" className="py-1" onClick={closeMobileMenu}>Kezdőlap</Link>
            <Link to="/positions" className="py-1" onClick={closeMobileMenu}>Elérhető állások</Link>
            {newsLink && (
              <Link to={newsLink} className="py-1" onClick={closeMobileMenu}>Hírek</Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
