import dkkLogoImage from "../../assets/logos/dkk_logos/logó.png";
import njeLogoImage from "../../assets/logos/nje_logos/nje_logo2.png";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/50 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* DKK Logo */}
          <img
            src={dkkLogoImage}
            alt="Duális Képzési Központ"
            className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300"
          />

          {/* Copyright */}
          <p className="text-center text-[13px] text-slate-400 font-medium tracking-wide">
            © {new Date().getFullYear()} Duális Képzési Központ - Neumann János
            Egyetem
          </p>

          {/* NJE Logo */}
          <img
            src={njeLogoImage}
            alt="Neumann János Egyetem"
            className="h-14 w-auto object-contain hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
    </footer>
  );
}
