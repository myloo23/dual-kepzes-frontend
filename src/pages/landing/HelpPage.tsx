import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth";
import {
  BookOpen,
  GraduationCap,
  Building2,
  UserCheck,
  Settings,
  ArrowRight,
  ShieldCheck,
  Clock,
  Image as ImageIcon
} from "lucide-react";
import dashboardImg from "../../assets/help/dashboard.png";
import dualisallapotImg from "../../assets/help/dualisallapot.png";
import profileImg from "../../assets/help/profile.png";
import validacioshibaImg from "../../assets/help/validacioshiba2.png";
import {
  STUDENT_FAQ_SECTIONS,
  HR_FAQ_SECTIONS,
  MENTOR_FAQ_SECTIONS,
  UNIVERSITY_FAQ_SECTIONS,
  ADMIN_FAQ_SECTIONS
} from "../../data/faqData";

type TutorialImageBlock = {
  title: string;
  caption: string;
  hint: string;
  src?: string;
};

const visualGuides: TutorialImageBlock[] = [
  {
    title: "Kezdő dashboard",
    caption:
      "A sikeres bejelentkezés után a diák felület irányítópultjára érkezel. Itt áttekintheted a legfontosabb műveleteket, híreket és információkat.",
    hint: "Kattints a képre a nagyításhoz",
    src: dashboardImg,
  },
  {
    title: "Saját profil kitöltése",
    caption:
      "A profilodnál megadhatod a személyes és tanulmányi adataidat, nyelvtudásodat, amelyet a jóváhagyott munkáltatók is látni fognak.",
    hint: "Kattints a képre a nagyításhoz",
    src: profileImg,
  },
  {
    title: "Duális helyem státuszai",
    caption:
      "A 'Duális helyem' menüpontban követheted nyomon a jelentkezéseid és partnereid aktuális állapotát (pl. Aktív, Mentorra vár).",
    hint: "Kattints a képre a nagyításhoz",
    src: dualisallapotImg,
  },
  {
    title: "Validációs hiba megjelenése",
    caption:
      "Ha egy űrlap mentésekor hibás vagy hiányzó adatot talált a rendszer, egy jól látható piros hibaüzenet figyelmeztet a probléma helyére.",
    hint: "Kattints a képre a nagyításhoz",
    src: validacioshibaImg,
  },
];

export default function HelpPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Determine allowed role id based on login state and user role
  let allowedRoleId = "student";
  if (isAuthenticated && user) {
    if (user.role === "COMPANY_ADMIN") {
      allowedRoleId = "company";
    } else if (user.role === "MENTOR") {
      allowedRoleId = "mentor";
    } else if (user.role === "UNIVERSITY_USER" || user.role === "TEACHER") {
      allowedRoleId = "university";
    } else if (user.role === "SYSTEM_ADMIN") {
      allowedRoleId = "admin";
    } else {
      allowedRoleId = "student";
    }
  }

  const ROLES_INFO = [
    {
      id: "student",
      name: "Hallgató",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-600",
      description: "Duális állások böngészése és térképes keresése, önéletrajz közvetlen elküldése, profilépítés és az egyetemi átállás kezelése.",
      faq: STUDENT_FAQ_SECTIONS,
    },
    {
      id: "company",
      name: "Cégadmin",
      icon: Building2,
      color: "from-emerald-500 to-teal-600",
      description: "Céges profil és telephelyek karbantartása, állások hirdetése, beérkező jelentkezések elbírálása, és mentorok kijelölése.",
      faq: HR_FAQ_SECTIONS,
    },
    {
      id: "mentor",
      name: "Mentor",
      icon: UserCheck,
      color: "from-amber-500 to-orange-600",
      description: "A hozzárendelt hallgatók szakmai fejlődésének kísérése, a cég aktív pozícióinak követése és szakmai segédletek elérése.",
      faq: MENTOR_FAQ_SECTIONS,
    },
    {
      id: "university",
      name: "Egyetem / Oktató",
      icon: BookOpen,
      color: "from-purple-500 to-pink-600",
      description: "A duális partnerségek koordinációja, egyetemi felelős kijelölése (aktiválás), képzések felügyelete, lezárása és oktatási segédletek elérése.",
      faq: UNIVERSITY_FAQ_SECTIONS,
    },
    {
      id: "admin",
      name: "Rendszergazda",
      icon: Settings,
      color: "from-rose-500 to-red-600",
      description: "A teljes platform felügyelete, cégek regisztrációjának jóváhagyása, szakok kezelése, hírek publikálása és audit napló követése.",
      faq: ADMIN_FAQ_SECTIONS,
    },
  ];

  const visibleRoles = ROLES_INFO.filter((r) => r.id === allowedRoleId);
  const activeRoleInfo = visibleRoles[0] || ROLES_INFO[0];

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 shadow-md p-8 lg:p-12 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider">
              Súgóközpont & Folyamatleírás
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Neumann János Egyetem <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Duális Képzési Rendszer Súgó
              </span>
            </h1>
            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Üdvözlünk az NJE Duális Képzési Rendszer súgófelületén! Ez az oldal segít megérteni a rendszer működését, a különböző felhasználói szerepkörök jogosultságait és a duális szerződések létrejöttének lépéseit.
            </p>
          </div>
        </section>

        <div className="mt-8 space-y-10 animate-in fade-in duration-300">


          {/* PROCESS TIMELINE */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              A Duális Képzési Megállapodás Folyamata
            </h2>

            <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 md:ml-6 space-y-8">

              {/* Step 1 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 border-2 border-blue-600 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Jelentkezés és közvetlen, biztonságos fájltovábbítás (GDPR)</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A hallgató jelentkezik a pozícióra. A jelentkezés során feltöltött önéletrajz és motivációs levél **adatvédelmi okokból soha nem kerül mentésre a szerver adatbázisában**. A rendszer a fájlokat közvetlenül a memóriában dolgozza fel, és titkosított e-mail csatolmányként továbbítja a cég kapcsolattartójának.
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> GDPR kompatibilis közvetlen e-mail átvitel
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 border-2 border-blue-600 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Céges elbírálás és Partnerkapcsolat létrejötte</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A cégadminisztrátor elbírálja a hallgatót. Amennyiben a cég az <strong>Elfogadás</strong> mellett dönt, a rendszer automatikusan létrehozza a duális partnerkapcsolatot. A partnerség kezdeti állapota: <span className="font-semibold text-amber-600">Mentor kijelölésére vár</span>.
                  </p>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    * Megjegyzés: Ha a hallgatónak már van egy másik aktív vagy függőben lévő partnersége, a rendszer a párhuzamos elfogadást ütközés miatt blokkolja.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 border-2 border-blue-600 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Céges mentor kijelölése</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A cégadminisztrátor a regisztrált céges munkavállalók közül kijelöli a hallgató szakmai mentorát. A hozzárendelés pillanatában a partnerség állapota a következő fázisba lép: <span className="font-semibold text-indigo-600">Egyetemi jóváhagyásra vár</span>.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Egyetemi jóváhagyás (Aktiválás)</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Az egyetemi kapcsolattartó referens megvizsgálja a partnerséget, és hozzárendeli a rendszerben az egyetemi felelőst (supervisort). Ezzel a partnerség állapota <span className="font-semibold text-emerald-600">ACTIVE</span> (Aktív) lesz. A hallgató profilja automatikusan lekerül a munkakeresők nyilvános listájáról.
                  </p>
                </div>
              </div>

            </div>

            {/* Status State Diagram */}
            <div className="mt-8 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Partnerség állapot-átmenetek (State Diagram)
              </h4>
              <div className="flex flex-wrap items-center justify-start gap-2 text-xs md:text-sm font-semibold">
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">Létrejön</span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/50">Mentor kijelölésére vár</span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900/50">Egyetemi jóváhagyásra vár</span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50">Aktív (Szerződött)</span>
              </div>
            </div>
          </section>

          {/* FAQ List */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeRoleInfo.color} flex items-center justify-center text-white`}>
                  <activeRoleInfo.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {activeRoleInfo.name} GYIK
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gyakori kérdések kifejezetten {activeRoleInfo.name.toLowerCase()} szerepkörre szabva.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activeRoleInfo.faq.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 border-b border-slate-200 dark:border-slate-800 pb-1">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <details
                          key={item.question}
                          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3"
                        >
                          <summary className="cursor-pointer list-none font-medium text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                            <span>{item.question}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold ml-2">▼</span>
                          </summary>
                          <div className="mt-3 space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {item.answer.map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Képes Rendszerútmutató */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-blue-600" /> Képes Rendszerútmutató
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Az alábbi képek segítségével lépésről lépésre láthatod a legfontosabb felületek felépítését és működését.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visualGuides.map((guide, idx) => (
                  <figure
                    key={idx}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-4 flex flex-col justify-between"
                  >
                    {guide.src ? (
                      <div
                        className="overflow-hidden rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer transition-transform duration-200 hover:scale-[1.01] hover:shadow-md"
                        onClick={() => setSelectedImage(guide.src!)}
                      >
                        <img src={guide.src} alt={guide.title} className="w-full h-auto object-cover max-h-56" />
                      </div>
                    ) : (
                      <div className="flex min-h-[140px] items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-500 dark:text-slate-300 text-xs font-medium tracking-wide uppercase">
                        Kép helye
                      </div>
                    )}
                    <figcaption className="mt-4 space-y-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{guide.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{guide.caption}</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400">{guide.hint}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* QUICK NAVIGATION LINKS */}
          <section className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Gyors hivatkozások</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Közvetlen elérést biztosító gombok a legfontosabb nyilvános felületekre:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Kezdőlap
              </Link>
              <Link
                to="/positions"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Állásajánlatok
              </Link>
              <Link
                to="/gallery"
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Galéria
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* IMAGE ZOOM MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-900/90 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-6xl flex items-center justify-center">
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
              aria-label="Nagyító bezárása"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img
              src={selectedImage}
              alt="Nagyított nézet"
              className="w-auto h-auto max-w-full max-h-[80vh] rounded-lg shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
