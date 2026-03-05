import { ArrowRight, Building2, GraduationCap } from "lucide-react";

export default function DualInfoSection() {
  return (
    <section className="py-8 md:py-16 bg-transparent overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
        <div className="grid gap-6 md:gap-12 lg:grid-cols-2 w-full max-w-full">
          {/* Duális Képzés Leírás */}
          <div className="relative overflow-hidden">
            <div className="absolute -left-4 -top-4 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-60 hidden md:block transition-colors" />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 h-full transition-colors">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
                <GraduationCap size={14} />
                Duális Képzés
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6 transition-colors">
                Mi a Duális Képzés?
              </h2>

              <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
                <p>
                  A duális képzés során a hallgató az egyetemi tanulmányai
                  mellett egy vállalatnál is aktívan részt vesz a munkában. A
                  tanulmányi idő alatt{" "}
                  <strong>folyamatos kapcsolatban áll a céggel</strong>,
                  hallgatói munkaszerződéssel dolgozik, és havi juttatásban
                  részesül.
                </p>
                <p>
                  A szorgalmi időszakot az egyetemen tölti, míg az egyetemi
                  szünetekben hosszabb, szervezett vállalati gyakorlati
                  időszakokon vesz részt, a szak képzési programja mellett a cég
                  saját képzési rendszerét is teljesítve.
                </p>
                <p>
                  A duális képzés mindhárom fél számára előnyös: a hallgató már
                  diplomája megszerzése előtt értékes szakmai tapasztalatot és
                  piacképes tudást szerez, a vállalat saját igényeire szabott
                  jövőbeli munkavállalókat képez, az egyetem pedig
                  gyakorlatorientáltabb, munkaerőpiac-közeli képzést biztosít.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 transition-colors">
                <a
                  href="https://gamf.nje.hu/dualis-kepzes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-dkk-blue dark:text-blue-400 font-semibold hover:underline transition-colors"
                >
                  További részletek a GAMF oldalán <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Duális Képzési Központ */}
          <div className="relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full blur-xl opacity-60 hidden md:block transition-colors" />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 h-full flex flex-col transition-colors">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-6 w-fit transition-colors">
                <Building2 size={14} />
                Duális Képzési Központ
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6 transition-colors">
                A Központ Feladatai
              </h2>

              <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 md:mb-6 transition-colors">
                <p>
                  A{" "}
                  <strong>
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

              {/* Leader Highlight */}
              <div className="mt-auto bg-slate-50 dark:bg-slate-900/50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-base md:text-lg flex-shrink-0 transition-colors">
                    EA
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 transition-colors">
                      Dr. Angeli Eliza
                    </h4>
                    <p className="text-[10px] md:text-xs text-rose-600 dark:text-rose-400 font-bold uppercase mb-1 md:mb-2 transition-colors">
                      A KÖZPONT VEZETŐJE
                    </p>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-snug transition-colors">
                      Meghatározó szerepet tölt be a duális képzések
                      fejlesztésében és minőségbiztosításában.
                      <a
                        href="mailto:angeli.eliza@nje.hu"
                        className="text-dkk-blue dark:text-blue-400 hover:underline ml-1 transition-colors"
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
