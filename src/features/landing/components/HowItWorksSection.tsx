const steps = [
  {
    num: "01",
    title: "Jelentkezés",
    description:
      "A hallgató feltölti a dokumentumait és jelentkezik a számára szimpatikus pozíciókra.",
    color: "nje-jaffa",
    bg: "bg-nje-jaffa-faint dark:bg-nje-jaffa/10",
    border: "border-nje-jaffa/25",
    numBg: "bg-nje-jaffa text-white",
  },
  {
    num: "02",
    title: "Céges kiválasztás",
    description:
      "A céges admin áttekinti a jelentkezéseket, interjút szervez és kiválasztja a megfelelő jelölteket.",
    color: "nje-amethyst",
    bg: "bg-nje-amethyst-faint dark:bg-nje-amethyst/10",
    border: "border-nje-amethyst/25",
    numBg: "bg-nje-amethyst text-white",
  },
  {
    num: "03",
    title: "Szerződés és státusz",
    description:
      "Az egyetem jóváhagyja a duális státuszt, és a rendszer nyomon követi a szerződéses adatokat.",
    color: "nje-cyan",
    bg: "bg-nje-cyan-faint dark:bg-nje-cyan/10",
    border: "border-nje-cyan/25",
    numBg: "bg-nje-cyan text-white",
  },
  {
    num: "04",
    title: "Naplózás és értékelés",
    description:
      "A hallgató naplózza a tevékenységét, a mentor jóváhagyja, majd félév végén mindkét fél értékel.",
    color: "nje-anthracite",
    bg: "bg-nje-anthracite/5 dark:bg-nje-anthracite/10",
    border: "border-nje-anthracite/15",
    numBg: "bg-nje-anthracite text-white",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-16 border-t border-nje-anthracite/8 dark:border-slate-800/50 overflow-hidden"
    >
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-nje-amethyst/4 to-transparent blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-nje-amethyst-faint dark:bg-nje-amethyst/20 border border-nje-amethyst/20 px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-nje-jaffa" />
            <span className="text-xs font-bold text-nje-amethyst dark:text-nje-amethyst-light uppercase tracking-widest">
              Folyamat
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-nje-anthracite dark:text-slate-50">
            Hogyan működik a duális rendszer?
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative group">
              {/* Connector line (desktop, except last) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-8px)] w-full h-px bg-gradient-to-r from-nje-anthracite/20 to-transparent z-10 pointer-events-none" />
              )}

              <div
                className={`relative rounded-3xl p-6 border ${step.bg} ${step.border} h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card overflow-hidden`}
              >
                {/* Decorative circle in corner */}
                <div className="pointer-events-none absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-current opacity-5" />

                {/* Step number circle */}
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${step.numBg} text-sm font-bold mb-4 shadow-sm`}
                >
                  {step.num}
                </div>

                <h3 className="font-bold text-nje-anthracite dark:text-slate-100 mb-2 text-base tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-nje-anthracite/60 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
