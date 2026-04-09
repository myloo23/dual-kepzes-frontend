import { Link } from "react-router-dom";

type TutorialStep = {
  title: string;
  description: string;
};

type TutorialImageBlock = {
  title: string;
  caption: string;
  hint: string;
};

type TutorialSection = {
  id: string;
  badge: string;
  title: string;
  intro: string;
  textBlocks: string[];
  imageBlocks: TutorialImageBlock[];
  steps: TutorialStep[];
};

const tutorialSections: TutorialSection[] = [
  {
    id: "elso-lepesek",
    badge: "Alapok",
    title: "Első lépések a felületen",
    intro:
      "Ez a fejezet bemutatja, hogyan induljon a felhasználó a bejelentkezéstől a releváns munkaterületig.",
    textBlocks: [
      "A belépés után a rendszer szerepkör alapján irányítja a felhasználót a megfelelő nézetre (hallgató, vállalati, egyetemi vagy admin felület).",
      "Ebben a blokkban érdemes röviden tisztázni, hogy hol találhatók a legfontosabb menüpontok, és mi a kezdőoldal célja.",
    ],
    imageBlocks: [
      {
        title: "Kezdő dashboard képernyőkép",
        caption:
          "Adj ide egy teljes szélességű képet az első belépés utáni dashboardról.",
        hint: "Ajánlott arány: 16:9, minimum 1440x810 px.",
      },
    ],
    steps: [
      {
        title: "Bejelentkezés",
        description: "Nyisd meg a bejelentkező oldalt, majd add meg a fiókadatokat.",
      },
      {
        title: "Szerepkör ellenőrzése",
        description: "A rendszer a jogosultságod alapján automatikusan a megfelelő felületre visz.",
      },
      {
        title: "Kezdő navigáció",
        description: "Ellenőrizd a felső navigációt és nyisd meg az elsődleges munkaterületet.",
      },
    ],
  },
  {
    id: "folyamatok",
    badge: "Munkafolyamat",
    title: "Tipikus felhasználói folyamat",
    intro:
      "Példa lépések, amelyek végigvezetnek egy gyakori feladaton elejétől a befejezésig.",
    textBlocks: [
      "A szakasz célja, hogy üzleti oldalról is érthető legyen a folyamat: milyen bemenet kell, mi történik közben, és mi a várt eredmény.",
      "A későbbi bővítéshez minden új folyamatot külön alfejezetként célszerű felvenni azonos sablon szerint.",
    ],
    imageBlocks: [
      {
        title: "Űrlap kitöltési példa",
        caption:
          "Mutasd be képpel, mely mezők kötelezők és hol látható a visszajelzés mentés után.",
        hint: "Ajánlott arány: 4:3, minimum 1200x900 px.",
      },
      {
        title: "Állapotjelzés / státusz nézet",
        caption:
          "Helyezz el státuszlistát bemutató képet, hogy a felhasználó értse az állapotváltozásokat.",
        hint: "Ajánlott arány: 16:10, minimum 1280x800 px.",
      },
    ],
    steps: [
      {
        title: "Új elem létrehozása",
        description: "Nyisd meg a megfelelő modult és kattints az új rekord létrehozására.",
      },
      {
        title: "Adatok mentése",
        description: "Töltsd ki az űrlapot, majd mentsd el. A rendszer visszajelzést ad a sikeres műveletről.",
      },
      {
        title: "Ellenőrzés és követés",
        description: "A lista nézetben ellenőrizd a rekordot és kövesd a státuszát.",
      },
    ],
  },
  {
    id: "gyik-hibakereses",
    badge: "Támogatás",
    title: "GYIK és hibaelhárítás",
    intro:
      "Szerkezet, amelyben gyakori kérdéseket és gyors megoldási lépéseket lehet publikálni.",
    textBlocks: [
      "A GYIK blokkokat rövid kérdés-válasz formában érdemes kezelni. Minden kérdéshez egyértelmű cím és 2-4 mondatos válasz ajánlott.",
      "Hibakezelésnél célszerű a jelenség, lehetséges ok és megoldási lépés hármas szerkezetét követni.",
    ],
    imageBlocks: [
      {
        title: "Hibaüzenet képernyőkép",
        caption:
          "Ide kerülhet egy tipikus hibaüzenet képe kiemelt magyarázattal.",
        hint: "Ajánlott arány: 3:2, minimum 1200x800 px.",
      },
    ],
    steps: [
      {
        title: "Jelenség azonosítása",
        description: "Rögzítsd pontosan, melyik képernyőn és milyen műveletnél jelentkezett a hiba.",
      },
      {
        title: "Gyors ellenőrzés",
        description: "Ellenőrizd a jogosultságot, hálózati kapcsolatot és a kötelező mezőket.",
      },
      {
        title: "Továbblépés support felé",
        description: "Ha a hiba ismétlődik, küldj képernyőképet és rövid leírást az ügyfélszolgálatnak.",
      },
    ],
  },
];

const quickLinks = [
  { label: "Kezdőlap", to: "/" },
  { label: "Állásajánlatok", to: "/positions" },
  { label: "Galéria", to: "/gallery" },
];

export default function HelpPage() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 shadow-sm p-6 lg:p-10 transition-colors">
          <p className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Súgóközpont
          </p>
          <h1 className="mt-4 text-3xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Tutorial és súgó tartalom oldalszerkezete
          </h1>
          <p className="mt-4 max-w-3xl text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Az alábbi oldalstruktúra kifejezetten úgy készült, hogy később gyorsan bővíthető legyen:
            minden fejezet külön blokkban jelenik meg, és külön tartalmaz szöveges részt,
            képes tartalmat, valamint lépésről lépésre útmutatót.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Szekciók</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {tutorialSections.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Lépések</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {tutorialSections.reduce((sum, section) => sum + section.steps.length, 0)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Képes blokkok</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {tutorialSections.reduce((sum, section) => sum + section.imageBlocks.length, 0)}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 lg:mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-24 h-max rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              Tartalomjegyzék
            </h2>
            <nav className="mt-4 space-y-2">
              {tutorialSections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                >
                  {index + 1}. {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <section className="space-y-6">
            {tutorialSections.map((section, sectionIndex) => (
              <article
                id={section.id}
                key={section.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 lg:p-7 scroll-mt-24"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
                    {section.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Fejezet {sectionIndex + 1}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm lg:text-base text-slate-600 dark:text-slate-300">
                  {section.intro}
                </p>

                <div className="mt-5 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                      Szöveges blokkok
                    </h4>
                    {section.textBlocks.map((text, textIndex) => (
                      <div
                        key={`${section.id}-text-${textIndex}`}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4"
                      >
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                      Képes blokkok
                    </h4>
                    {section.imageBlocks.map((imageBlock, imageIndex) => (
                      <figure
                        key={`${section.id}-image-${imageIndex}`}
                        className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-4"
                      >
                        <div className="flex min-h-[140px] items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-500 dark:text-slate-300 text-xs font-medium tracking-wide uppercase">
                          Kép helye
                        </div>
                        <figcaption className="mt-3 space-y-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{imageBlock.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{imageBlock.caption}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{imageBlock.hint}</p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    Lépésről lépésre
                  </h4>
                  <ol className="mt-3 space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <li
                        key={`${section.id}-step-${stepIndex}`}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {stepIndex + 1}. {step.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 lg:p-7">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Gyors hivatkozások</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Ezek a linkek közvetlenül a legfontosabb publikus oldalakra visznek.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
