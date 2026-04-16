import { useRef, useState, useEffect } from "react";
import { Mail, Briefcase, Info, ChevronRight, User } from "lucide-react";
import { REFERENCES } from "../data/references";
import type { ReferencePerson } from "../types";
import ReferenceDetailModal from "./ReferenceDetailModal";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarStyle(name: string) {
  const palettes = [
    "bg-nje-amethyst/15 text-nje-amethyst",
    "bg-nje-jaffa/15 text-nje-jaffa",
    "bg-nje-cyan/15 text-nje-cyan-dark",
    "bg-nje-anthracite/10 text-nje-anthracite",
    "bg-nje-amethyst/10 text-nje-amethyst-light",
    "bg-nje-jaffa/10 text-nje-jaffa-dark",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palettes[Math.abs(hash) % palettes.length];
}

export default function ReferencesSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState<ReferencePerson | null>(null);

  const displayList = [...REFERENCES, ...REFERENCES];

  useEffect(() => {
    let animationFrameId: number;
    const scrollContainer = scrollRef.current;
    const animate = () => {
      if (!scrollContainer) return;
      if (!isPaused && !isDragging && !selectedPerson) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 0.5;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isDragging, selectedPerson]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement || (e.target as Element).closest("button")) return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };
  const handleMouseLeave = () => { setIsDragging(false); setIsPaused(false); };
  const handleMouseUp = () => { setIsDragging(false); setIsPaused(false); };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    // ⚠️ NO overflow-hidden here — it would clip the horizontal scroll
    <section className="relative w-full py-24 bg-white dark:bg-slate-950 transition-colors duration-300">

      {/* Decorative blur circles — separate wrapper so they don't clip the slider */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-24 top-0 w-64 h-64 rounded-full bg-nje-amethyst/6 blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-48 h-48 rounded-full bg-nje-jaffa/6 blur-3xl" />
      </div>

      {/* Section header */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 mb-12">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-nje-amethyst-faint dark:bg-nje-amethyst/20 border border-nje-amethyst/20 px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-nje-jaffa" />
            <span className="text-xs font-bold text-nje-amethyst dark:text-nje-amethyst-light uppercase tracking-widest">
              Csapat
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-nje-anthracite dark:text-slate-50 tracking-tight">
            Duális Referensek és Munkatársak
          </h2>
          {/* Brand accent — narancs */}
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-nje-jaffa" />
            <span className="w-16 h-0.5 bg-nje-jaffa rounded-full" />
            <span className="w-2 h-2 rounded-full bg-nje-jaffa" />
          </div>
          <p className="text-nje-anthracite/60 dark:text-slate-400 mt-1 max-w-2xl text-sm leading-relaxed">
            Ismerje meg a képzések szakmai felelőseit és a központ munkatársait,
            akik támogatják a duális képzésben résztvevő hallgatókat.
          </p>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative">
        {/* Fade edges — must match the section's own bg (bg-white / dark:bg-slate-950) */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-20" />

        <div
          ref={scrollRef}
          className="flex gap-5 py-4 overflow-x-auto cursor-grab active:cursor-grabbing px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsPaused(true)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {displayList.map((person, index) => (
            <div
              key={`${person.email}-${index}`}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-nje-anthracite/8 dark:border-slate-800 w-[280px] flex-shrink-0 hover:shadow-card hover:border-nje-anthracite/15 dark:hover:border-slate-700 transition-all duration-300 select-none group/card relative overflow-hidden flex flex-col"
              title={person.description}
            >
              {/* Top accent bar on hover */}
              <div className="h-[3px] w-full bg-gradient-to-r from-nje-jaffa to-nje-amethyst opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex-shrink-0" />

              {/* Card body */}
              <div className="p-6 flex flex-col flex-1">
                {/* Decorative circle */}
                <div className="pointer-events-none absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-nje-amethyst/5 group-hover/card:bg-nje-amethyst/10 transition-colors duration-300" />

                {/* Avatar + name */}
                <div className="flex flex-col items-center text-center gap-3 mb-4">
                  <div
                    className={`h-24 w-24 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xl overflow-hidden ring-4 ring-nje-pearl dark:ring-slate-800 ${!person.image ? getAvatarStyle(person.name) : "bg-nje-pearl dark:bg-slate-800"}`}
                  >
                    {person.image ? (
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      getInitials(person.name)
                    )}
                  </div>
                  <div className="min-w-0 w-full">
                    <h3 className="font-bold text-nje-anthracite dark:text-slate-100 text-base tracking-tight leading-tight">
                      {person.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-nje-amethyst dark:text-nje-amethyst-light uppercase tracking-widest mt-1">
                      {person.group || "Referens"}
                    </p>
                  </div>
                </div>

                {/* Info rows — flex-1 so button stays at bottom */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-start gap-2.5 bg-nje-pearl dark:bg-slate-800/50 p-2.5 rounded-xl">
                    <Briefcase size={14} className="text-nje-anthracite/40 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-nje-anthracite dark:text-slate-300 font-medium leading-snug line-clamp-2" title={person.title}>
                      {person.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 px-0.5">
                    <Mail size={14} className="text-nje-jaffa flex-shrink-0" />
                    <a
                      href={`mailto:${person.email}`}
                      className="text-xs font-medium text-nje-anthracite/60 dark:text-slate-400 hover:text-nje-jaffa dark:hover:text-nje-jaffa-light hover:underline truncate transition-colors"
                      draggable="false"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {person.email}
                    </a>
                  </div>

                  {person.description && (
                    <div className="pt-2 border-t border-nje-anthracite/8 dark:border-slate-800">
                      <div className="flex items-start gap-2">
                        <Info size={12} className="text-nje-anthracite/30 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-nje-anthracite/50 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {person.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA button */}
                <div className="mt-4 pt-3 border-t border-nje-anthracite/8 dark:border-slate-800">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedPerson(person);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-nje-pearl dark:bg-slate-800 hover:bg-nje-jaffa hover:text-white text-nje-anthracite dark:text-slate-300 font-semibold transition-colors text-sm"
                  >
                    <User size={14} />
                    <span>Bemutatkozás</span>
                    <ChevronRight size={14} className="opacity-40 group-hover/btn:opacity-100 ml-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReferenceDetailModal
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </section>
  );
}
