import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
        <Link
          to="/"
          className="font-semibold tracking-tight text-slate-900"
          onClick={closeMobileMenu}
        >
          Duális képzési rendszer
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
          <Link to="/" className="hover:text-slate-900">Kezdőlap</Link>
          <Link to="/positions" className="hover:text-slate-900">Elérhető állások</Link>
          <Link to="/map" className="hover:text-slate-900">Térképes nézet</Link>
          <Link to="/admin" className="hover:text-slate-900">Admin</Link>
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
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${
                mobileOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-opacity ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-slate-700 transition-transform ${
                mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex flex-col gap-2 text-sm text-slate-700">
            <Link to="/" className="py-1" onClick={closeMobileMenu}>Kezdőlap</Link>
            <Link to="/positions" className="py-1" onClick={closeMobileMenu}>Elérhető állások</Link>
            <Link to="/map" className="py-1" onClick={closeMobileMenu}>Térképes nézet</Link>
            <Link to="/admin" className="py-1" onClick={closeMobileMenu}>Admin</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
