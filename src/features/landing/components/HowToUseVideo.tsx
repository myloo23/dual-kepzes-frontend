export default function HowToUseVideo() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-4">
        {/* Badge with circles */}
        <div className="inline-flex items-center gap-2 rounded-full bg-nje-jaffa-faint dark:bg-nje-jaffa/15 border border-nje-jaffa/20 px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-nje-jaffa animate-pulse" />
          <span className="text-xs font-bold text-nje-jaffa-dark dark:text-nje-jaffa uppercase tracking-widest">
            Promóciós videó
          </span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-nje-anthracite dark:text-slate-50">
          Ismerd meg a Duális Képzési Rendszert!
        </h2>
        <p className="text-base text-nje-anthracite/60 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Nézd meg hivatalos promóciós videónkat, és fedezd fel, hogyan
          kapcsolja össze a platformunk a hallgatókat, a cégeket és az egyetemet.
        </p>
      </div>

      {/* Video container with brand shapes */}
      <div className="relative">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-8 -top-8 w-24 h-24 rounded-full border-[3px] border-nje-jaffa/20" />
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-nje-amethyst/10 blur-lg" />

        <div className="relative rounded-3xl overflow-hidden bg-nje-anthracite shadow-amethyst ring-1 ring-nje-anthracite/10 dark:ring-white/5 aspect-video">
          <div className="absolute inset-0 bg-gradient-to-tr from-nje-jaffa/8 to-nje-amethyst/8 mix-blend-overlay pointer-events-none z-10" />
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/n3H7DGsJhZ8?rel=0&modestbranding=1"
            title="Duális Képzési Rendszer – Hivatalos Promóciós Videó"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
