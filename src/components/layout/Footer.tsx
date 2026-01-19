import dkkLogoImage from "../../assets/logos/dkk_logos/logó.png";
import njeLogoImage from "../../assets/logos/nje_logos/nje_logo2.png";

export default function Footer() {
  return (
    <footer className="border-t border-dkk-gray/30 bg-white py-4">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* DKK Logo - bal oldal */}
          <img
            src={dkkLogoImage}
            alt="Duális Képzési Központ"
            className="h-10 object-contain order-1 sm:order-1"
          />

          {/* Copyright szöveg - középen */}
          <p className="text-center text-xs text-slate-500 order-3 sm:order-2">
            © {new Date().getFullYear()} Duális Képzési Központ - Neumann János Egyetem
          </p>

          {/* NJE Logo - jobb oldal */}
          <img
            src={njeLogoImage}
            alt="Neumann János Egyetem"
            className="h-20 object-contain order-2 sm:order-3"
          />
        </div>
      </div>
    </footer>
  );
}
