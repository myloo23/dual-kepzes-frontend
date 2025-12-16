import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PositionsPage from "./pages/PositionsPage";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
          <Link
            to="/"
            className="font-semibold tracking-tight text-slate-900"
          >
            Duális képzési rendszer
          </Link>
          <nav className="hidden sm:flex gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">
              Kezdőlap
            </Link>
            <Link to="/positions" className="hover:text-slate-900">
              Elérhető állások
            </Link>
            <Link to="/map" className="hover:text-slate-900">
              Térképes nézet
            </Link>

            {/* Ezek a HomePage-en lévő szekciókra mutatnak */}
            <a href="/#how-it-works" className="hover:text-slate-900">
              Hogyan működik?
            </a>
            <a href="#contact" className="hover:text-slate-900">
              Kapcsolat
            </a>
          </nav>
        </div>
      </header>

      {/* ROUTES */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-3">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-xs text-slate-500 text-right">
          © {new Date().getFullYear()} Duális képzési rendszer
        </div>
      </footer>
    </div>
  );
}

export default App;
