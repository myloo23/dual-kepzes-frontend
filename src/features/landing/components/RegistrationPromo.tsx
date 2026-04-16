import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Building2, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export default function RegistrationPromo() {
  const cards = [
    {
      title: "Középiskolásoknak",
      description:
        "Alapozd meg a jövőd! Jelentkezz duális képzésre, szerezz igazi szakmai tapasztalatot és anyagi függetlenséget már az egyetemi éveid alatt.",
      icon: <GraduationCap className="h-6 w-6 text-nje-jaffa" />,
      ctaText: "Regisztráció diákoknak",
      href: "/register",
      accentColor: "nje-jaffa",
      bgClass: "bg-gradient-to-br from-nje-jaffa-faint to-white dark:from-nje-jaffa/10 dark:to-slate-900",
      borderClass: "border-nje-jaffa/20 dark:border-nje-jaffa/15 hover:border-nje-jaffa/50",
      iconBg: "bg-nje-jaffa/10 dark:bg-nje-jaffa/15",
      barColor: "from-nje-jaffa to-nje-jaffa-light",
    },
    {
      title: "Egyetemi hallgatóknak",
      description:
        "Váltsd valódi tudásra az elméletet. Csatlakozz partnercégeinkhez, dolgozz valós projekteken, és építs kapcsolatokat még a diploma megszerzése előtt.",
      icon: <Briefcase className="h-6 w-6 text-nje-amethyst" />,
      ctaText: "Hallgatói csatlakozás",
      href: "/register",
      accentColor: "nje-amethyst",
      bgClass: "bg-gradient-to-br from-nje-amethyst-faint to-white dark:from-nje-amethyst/10 dark:to-slate-900",
      borderClass: "border-nje-amethyst/20 dark:border-nje-amethyst/15 hover:border-nje-amethyst/50",
      iconBg: "bg-nje-amethyst/10 dark:bg-nje-amethyst/15",
      barColor: "from-nje-amethyst to-nje-amethyst-light",
    },
    {
      title: "Vállalatoknak",
      description:
        "Találd meg a jövő tehetségeit. Vegyél részt a duális képzésben, formáld a hallgatókat a saját igényeid szerint, és biztosítsd a magasan képzett utánpótlást.",
      icon: <Building2 className="h-6 w-6 text-nje-cyan-dark" />,
      ctaText: "Vállalati regisztráció",
      href: "/register-company-partner",
      accentColor: "nje-cyan",
      bgClass: "bg-gradient-to-br from-nje-cyan-faint to-white dark:from-nje-cyan/10 dark:to-slate-900",
      borderClass: "border-nje-cyan/20 dark:border-nje-cyan/15 hover:border-nje-cyan/50",
      iconBg: "bg-nje-cyan/10 dark:bg-nje-cyan/15",
      barColor: "from-nje-cyan to-nje-cyan-light",
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 border-t border-nje-anthracite/8 dark:border-slate-800/50 transition-colors">
      {/* Decorative blur circles — own overflow-hidden wrapper so the section itself isn't clipped */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-32 top-0 w-[500px] h-[500px] rounded-full bg-nje-amethyst/6 blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] rounded-full bg-nje-jaffa/6 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-nje-amethyst-faint dark:bg-nje-amethyst/20 border border-nje-amethyst/20 px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-nje-jaffa" />
            <span className="text-xs font-bold text-nje-amethyst dark:text-nje-amethyst-light uppercase tracking-widest">
              Csatlakozás
            </span>
          </div>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-nje-anthracite dark:text-slate-50">
              Legyél te is a{" "}
              <span className="text-gradient-jaffa">rendszer része</span>
            </h2>
            <p className="mt-4 text-lg text-nje-anthracite/60 dark:text-slate-400 leading-relaxed font-normal">
              Csatlakozz Közép-Magyarország legdinamikusabban fejlődő duális képzési hálózatához.
              Válaszd ki a profilod, és indulj el a közös siker felé.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={cn(
                "group relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ease-out overflow-hidden",
                "border shadow-card hover:shadow-lg hover:-translate-y-1.5",
                card.bgClass,
                card.borderClass,
              )}
            >
              {/* Decorative circle */}
              <div className="pointer-events-none absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-current opacity-5" />

              <div>
                <div className={cn("mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl", card.iconBg)}>
                  {card.icon}
                </div>

                <h3 className="mb-3 text-xl font-bold tracking-tight text-nje-anthracite dark:text-slate-50">
                  {card.title}
                </h3>

                <p className="mb-10 text-[15px] text-nje-anthracite/60 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <Link
                to={card.href}
                className="inline-flex w-full items-center justify-between rounded-2xl bg-white dark:bg-slate-900 px-5 py-4 text-[15px] font-semibold text-nje-anthracite dark:text-slate-100 shadow-sm border border-nje-anthracite/10 dark:border-slate-800 transition-all duration-200 hover:bg-nje-pearl dark:hover:bg-slate-800 group-hover:border-nje-anthracite/20 dark:group-hover:border-slate-700"
              >
                <span>{card.ctaText}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nje-pearl dark:bg-slate-800 group-hover:bg-nje-anthracite/10 dark:group-hover:bg-slate-700 transition-colors">
                  <ChevronRight className="h-4 w-4 text-nje-anthracite/60 dark:text-slate-400" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
