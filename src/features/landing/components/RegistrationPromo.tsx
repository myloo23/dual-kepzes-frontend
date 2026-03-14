import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Building2, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export default function RegistrationPromo() {
  const cards = [
    {
      title: "Középiskolásoknak",
      description:
        "Alapozd meg a jövőd! Jelentkezz duális képzésre, szerezz igazi szakmai tapasztalatot és anyagi függetlenséget már az egyetemi éveid alatt.",
      icon: <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      ctaText: "Regisztráció diákoknak",
      href: "/register",
      bgClass: "bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900 border-blue-100/50 dark:border-blue-900/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      hoverClass: "hover:border-blue-300 dark:hover:border-blue-700/50",
    },
    {
      title: "Egyetemi hallgatóknak",
      description:
        "Váltsd valódi tudásra az elméletet. Csatlakozz partnercégeinkhez, dolgozz valós projekteken, és építs kapcsolatokat még a diploma megszerzése előtt.",
      icon: <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      ctaText: "Hallgatói csatlakozás",
      href: "/register",
      bgClass: "bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100/50 dark:border-indigo-900/30",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      hoverClass: "hover:border-indigo-300 dark:hover:border-indigo-700/50",
    },
    {
      title: "Vállalatoknak",
      description:
        "Találd meg a jövő tehetségeit. Vegyél részt a duális képzésben, formáld a hallgatókat a saját igényeid szerint, és biztosítsd a magasan képzett utánpótlást.",
      icon: <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      ctaText: "Vállalati regisztráció",
      href: "/register-company-partner",
      bgClass: "bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100/50 dark:border-emerald-900/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      hoverClass: "hover:border-emerald-300 dark:hover:border-emerald-700/50",
    },
  ];

  return (
    <section className="py-24 lg:py-32 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Premium Header Segment */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 transition-colors">
              Legyél te is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">rendszer része</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Csatlakozz Közép-Magyarország legdinamikusabban fejlődő duális képzési hálózatához. Válaszd ki a profilod, és indulj el a közös siker felé.
            </p>
          </div>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={cn(
                "group relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ease-out",
                "border shadow-sm hover:shadow-xl hover:-translate-y-1",
                card.bgClass,
                card.hoverClass
              )}
            >
              <div>
                <div className={cn("mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-colors", card.iconBg)}>
                  {card.icon}
                </div>
                
                <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {card.title}
                </h3>
                
                <p className="mb-10 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <Link
                to={card.href}
                className="inline-flex w-full items-center justify-between rounded-2xl bg-white dark:bg-slate-900 px-5 py-4 text-[15px] font-medium text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700"
              >
                <span>{card.ctaText}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </span>
              </Link>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
