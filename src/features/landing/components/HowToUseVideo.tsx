import { useState } from 'react';
import { Play } from 'lucide-react';

export default function HowToUseVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "n3H7DGsJhZ8";

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
          
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="group relative w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-nje-jaffa focus-visible:ring-offset-2 focus-visible:ring-offset-nje-anthracite cursor-pointer"
              aria-label="Promóciós videó lejátszása"
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Videó borítóképe"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />
              <div className="relative z-20 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-nje-jaffa/90 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-nje-jaffa">
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </div>
            </button>
          ) : (
            <iframe
              className="relative z-20 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Duális Képzési Rendszer – Hivatalos Promóciós Videó"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}

