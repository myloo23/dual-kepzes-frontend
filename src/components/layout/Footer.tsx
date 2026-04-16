import dkkLogoImage from "../../assets/logos/dkk_logos/logó.png";
import njeLogoImage from "../../assets/logos/nje_logos/nje_logo3.png";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-nje-anthracite/10 dark:border-slate-800 bg-nje-anthracite dark:bg-slate-950 py-8 mt-auto transition-colors duration-300">
      {/* Decorative brand circles */}
      <div className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-nje-jaffa/10" />
      <div className="pointer-events-none absolute -left-12 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-nje-amethyst/10" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* NJE Logo – larger, inverted */}
          <img
            src={njeLogoImage}
            alt="Neumann János Egyetem"
            className="h-16 w-auto object-contain brightness-0 invert hover:scale-105 transition-transform duration-300"
          />

          {/* Copyright */}
          <p className="text-center text-[13px] text-white/50 font-medium tracking-wide">
            © {new Date().getFullYear()} Duális Képzési Központ · Neumann János Egyetem
          </p>

          {/* DKK Logo – inverted */}
          <img
            src={dkkLogoImage}
            alt="Duális Képzési Központ"
            className="h-10 w-auto object-contain brightness-0 invert hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </footer>
  );
}
