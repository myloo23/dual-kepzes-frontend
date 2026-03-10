import testVideo from "../../../assets/videos/testvideo.mp4";

export default function HowToUseVideo() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 space-y-4">
        <span className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase transition-colors">
          Útmutató
        </span>
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
          Hogyan használd a rendszert?
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors">
          Nézd meg rövid bemutató videónkat, amely végigvezet a platform
          legfontosabb funkcióin.
        </p>
      </div>

      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 aspect-video group">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 mix-blend-overlay pointer-events-none"></div>
        <video
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          poster=""
        >
          <source src={testVideo} type="video/mp4" />A böngésződ nem támogatja a
          videók lejátszását.
        </video>
      </div>
    </div>
  );
}
