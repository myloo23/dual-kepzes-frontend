import { ArrowRight, Building2, GraduationCap } from "lucide-react";

export default function DualInfoSection() {
  return (
    <section className="py-8 md:py-16 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 w-full max-w-full">

          {/* Duális Képzés */}
          <div className="relative overflow-hidden">
            {/* Decorative semicircle */}
            <div className="pointer-events-none absolute -left-10 -top-10 w-36 h-36 rounded-full bg-nje-cyan/10 dark:bg-nje-cyan/8 blur-2xl" />
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-nje-anthracite/8 dark:border-slate-800 h-full shadow-card dark:shadow-none transition-colors">
              {/* Top brand accent */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-nje-cyan to-nje-amethyst" />

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nje-cyan-faint dark:bg-nje-cyan/15 border border-nje-cyan/20 text-nje-cyan-dark dark:text-nje-cyan text-xs font-bold uppercase tracking-widest mb-6 mt-2">
                <GraduationCap size={13} />
                Duális Képzés
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-nje-anthracite dark:text-slate-100 mb-4 md:mb-6 tracking-tight">
                Mi a Duális Képzés?
              </h2>

              <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-nje-anthracite/70 dark:text-slate-300 leading-relaxed">
                <p>
                  A duális képzés során a hallgató az egyetemi tanulmányai
                  mellett egy vállalatnál is aktívan részt vesz a munkában. A
                  tanulmányi idő alatt{" "}
                  <strong className="text-nje-anthracite dark:text-slate-100 font-semibold">
                    folyamatos kapcsolatban áll a céggel
                  </strong>
                  , hallgatói munkaszerződéssel dolgozik, és havi juttatásban
                  részesül.
                </p>
                <p>
                  A szorgalmi időszakot az egyetemen tölti, míg az egyetemi
                  szünetekben hosszabb, szervezett vállalati gyakorlati
                  időszakokon vesz részt, a szak képzési programja mellett a
                  cég saját képzési rendszerét is teljesítve.
                </p>
                <p>
                  A duális képzés mindhárom fél számára előnyös: a hallgató már
                  diplomája megszerzése előtt értékes szakmai tapasztalatot és
                  piacképes tudást szerez, a vállalat saját igényeire szabott
                  jövőbeli munkavállalókat képez, az egyetem pedig
                  gyakorlatorientáltabb, munkaerőpiac-közeli képzést biztosít.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-nje-anthracite/8 dark:border-slate-800">
                <a
                  href="https://gamf.nje.hu/dualis-kepzes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-nje-cyan dark:text-nje-cyan-light font-semibold hover:underline transition-colors text-sm"
                >
                  További részletek a GAMF oldalán <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Duális Képzési Központ */}
          <div className="relative overflow-hidden">
            {/* Decorative semicircle */}
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-nje-jaffa/10 dark:bg-nje-jaffa/8 blur-2xl" />
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-nje-anthracite/8 dark:border-slate-800 h-full flex flex-col shadow-card dark:shadow-none transition-colors">
              {/* Top brand accent */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-nje-jaffa to-nje-amethyst" />

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nje-jaffa-faint dark:bg-nje-jaffa/15 border border-nje-jaffa/20 text-nje-jaffa-dark dark:text-nje-jaffa text-xs font-bold uppercase tracking-widest mb-6 mt-2 w-fit">
                <Building2 size={13} />
                Duális Képzési Központ
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-nje-anthracite dark:text-slate-100 mb-4 md:mb-6 tracking-tight">
                A Központ Feladatai
              </h2>

              <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-nje-anthracite/70 dark:text-slate-300 leading-relaxed mb-4 md:mb-6">
                <p>
                  A{" "}
                  <strong className="text-nje-anthracite dark:text-slate-100 font-semibold">
                    Neumann János Egyetem Duális Képzési Központja
                  </strong>{" "}
                  a duális képzések szakmai és szervezeti hátterét biztosítja,
                  összefogja az egyetem és a vállalati partnerek
                  együttműködését, valamint támogatja a hallgatók duális
                  tanulmányainak teljes folyamatát.
                </p>
                <p>
                  A központ feladatai közé tartozik a vállalati kapcsolatok
                  koordinálása, a képzések működtetésének összehangolása,
                  valamint a hallgatók és a cégek folyamatos szakmai és
                  adminisztratív támogatása.
                </p>
              </div>

              {/* Leader highlight */}
              <div className="mt-auto bg-nje-pearl dark:bg-slate-800/60 rounded-2xl p-4 md:p-5 border border-nje-anthracite/8 dark:border-slate-700">
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Circular avatar with brand color */}
                  <div className="relative flex-shrink-0">
                    <div className="h-11 w-11 md:h-13 md:w-13 rounded-full bg-gradient-to-br from-nje-jaffa/20 to-nje-amethyst/20 text-nje-amethyst dark:text-nje-amethyst-light flex items-center justify-center font-bold text-base ring-2 ring-nje-jaffa/30">
                      EA
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-nje-jaffa border-2 border-white dark:border-slate-800" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-nje-anthracite dark:text-slate-100">
                      Dr. Angeli Eliza
                    </h4>
                    <p className="text-[10px] md:text-xs text-nje-jaffa dark:text-nje-jaffa-light font-bold uppercase tracking-widest mb-1 md:mb-2">
                      A KÖZPONT VEZETŐJE
                    </p>
                    <p className="text-xs md:text-sm text-nje-anthracite/60 dark:text-slate-400 leading-snug">
                      Meghatározó szerepet tölt be a duális képzések
                      fejlesztésében és minőségbiztosításában.{" "}
                      <a
                        href="mailto:angeli.eliza@nje.hu"
                        className="text-nje-cyan dark:text-nje-cyan-light hover:underline"
                      >
                        angeli.eliza@nje.hu
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
