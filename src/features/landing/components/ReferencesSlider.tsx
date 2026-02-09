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

function getRandomColor(name: string) {
  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-rose-100 text-rose-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ReferencesSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState<ReferencePerson | null>(
    null,
  );

  // Duplicate list for infinite scroll effect
  const displayList = [...REFERENCES, ...REFERENCES];

  useEffect(() => {
    let animationFrameId: number;
    const scrollContainer = scrollRef.current;

    const animate = () => {
      if (!scrollContainer) return;

      // Only auto-scroll if not paused, not dragging, and no modal is open
      if (!isPaused && !isDragging && !selectedPerson) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 0.5; // Adjust speed here
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isDragging, selectedPerson]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target instanceof HTMLButtonElement ||
      (e.target as Element).closest("button")
    )
      return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll-fastness
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="w-full py-24 bg-white border-t border-dkk-gray/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-10">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Duális Referensek és Munkatársak
        </h2>
        <div className="w-20 h-1.5 bg-dkk-blue mx-auto mt-4 rounded-full" />
        <p className="text-center text-slate-600 mt-4 max-w-2xl mx-auto">
          Ismerje meg a képzések szakmai felelőseit és a központ munkatársait,
          akik támogatják a duális képzésben résztvevő hallgatókat.
        </p>
      </div>

      <div className="relative group">
        {/* Fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-6 py-4 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-4"
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
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 w-[320px] flex-shrink-0 hover:shadow-lg transition-all duration-300 select-none group/card relative overflow-hidden flex flex-col"
              title={person.description}
            >
              {/* Hover effect gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-dkk-blue to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

              <div className="flex flex-col items-center text-center gap-4 mb-4">
                <div
                  className={`h-32 w-32 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-3xl shadow-md overflow-hidden border-4 border-white ${!person.image ? getRandomColor(person.name) : "bg-slate-100"}`}
                >
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    getInitials(person.name)
                  )}
                </div>
                <div className="min-w-0 w-full">
                  <h3 className="font-bold text-slate-900 truncate text-xl">
                    {person.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide truncate mt-1">
                    {person.group || "Referens"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                  <Briefcase
                    size={18}
                    className="text-slate-400 mt-0.5 flex-shrink-0"
                  />
                  <p
                    className="text-sm text-slate-700 font-medium leading-snug line-clamp-2"
                    title={person.title}
                  >
                    {person.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 px-1">
                  <Mail size={18} className="text-dkk-blue flex-shrink-0" />
                  <a
                    href={`mailto:${person.email}`}
                    className="text-sm font-medium text-slate-600 hover:text-dkk-blue hover:underline truncate transition-colors"
                    draggable="false"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {person.email}
                  </a>
                </div>

                {/* Description snippet */}
                {person.description && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <div className="flex items-start gap-2">
                      <Info
                        size={14}
                        className="text-slate-400 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {person.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedPerson(person);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-50 hover:bg-dkk-blue hover:text-white text-slate-600 font-medium transition-all group/btn text-sm"
                >
                  <User size={16} />
                  <span>Bemutatkozás</span>
                  <ChevronRight
                    size={16}
                    className="opacity-50 group-hover/btn:opacity-100 transition-opacity"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

      <ReferenceDetailModal
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </section>
  );
}
