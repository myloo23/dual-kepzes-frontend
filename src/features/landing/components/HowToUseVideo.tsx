export default function HowToUseVideo() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-4">
        <span className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase transition-colors">
          Promóciós videó
        </span>
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
          Ismerd meg a Duális Képzési Rendszert!
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors">
          Nézd meg hivatalos promóciós videónkat, és fedezd fel, hogyan
          kapcsolja össze a platformunk a hallgatókat, a cégeket és az egyetemet.
        </p>
      </div>

      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 aspect-video group">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 mix-blend-overlay pointer-events-none z-10"></div>
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
  );
}
