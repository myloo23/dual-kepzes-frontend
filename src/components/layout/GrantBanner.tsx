import palyazatiBanner from "../../assets/logos/dkk_logos/palyazati banner.png";

interface GrantBannerProps {
  className?: string;
  variant?: "topbar" | "footer" | "standalone";
}

export default function GrantBanner({ className = "", variant = "topbar" }: GrantBannerProps) {
  if (variant === "topbar") {
    return (
      <div className={`w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between pl-3 sm:pl-6 pr-14 sm:pr-16 py-1 ${className}`}>
        <div className="flex items-center gap-3">
          <a
            href="https://www.palyazat.gov.hu"
            target="_blank"
            rel="noopener noreferrer"
            title="Széchenyi Terv Plusz - Az Európai Unió finanszírozásával NextGenerationEU"
            className="inline-flex items-center transition-opacity hover:opacity-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-nje-amethyst/50 rounded"
          >
            <img
              src={palyazatiBanner}
              alt="Széchenyi Terv Plusz - Az Európai Unió finanszírozásával NextGenerationEU"
              className="h-[44px] sm:h-[54px] max-h-[64px] w-auto object-contain"
            />
          </a>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <a
          href="https://www.palyazat.gov.hu"
          target="_blank"
          rel="noopener noreferrer"
          title="Széchenyi Terv Plusz - Az Európai Unió finanszírozásával NextGenerationEU"
          className="inline-block bg-white p-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-nje-amethyst/50"
        >
          <img
            src={palyazatiBanner}
            alt="Széchenyi Terv Plusz - Az Európai Unió finanszírozásával NextGenerationEU"
            className="h-[52px] sm:h-[60px] max-h-[64px] w-auto object-contain"
          />
        </a>
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`}>
      <a
        href="https://www.palyazat.gov.hu"
        target="_blank"
        rel="noopener noreferrer"
        title="Széchenyi Terv Plusz"
        className="inline-block transition-opacity hover:opacity-95"
      >
        <img
          src={palyazatiBanner}
          alt="Széchenyi Terv Plusz - Az Európai Unió finanszírozásával NextGenerationEU"
          className="h-[52px] sm:h-[60px] max-h-[64px] w-auto object-contain"
        />
      </a>
    </div>
  );
}
