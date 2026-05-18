import { useState } from "react";
import { Link } from "react-router-dom";
import dashboardImg from "../../assets/help/dashboard.png";
import dualisallapotImg from "../../assets/help/dualisallapot.png";
import profileImg from "../../assets/help/profile.png";
import validacioshibaImg from "../../assets/help/validacioshiba2.png";

type TutorialStep = {
  title: string;
  description: string;
};

type TutorialImageBlock = {
  title: string;
  caption: string;
  hint: string;
  src?: string;
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
      "A bejelentkezést követően a rendszer a jogosultságaidnak megfelelően irányít a megfelelő kezdőoldalra (például a Diák felületre).",
      "Az irányítópulton azonnal láthatod az aktuális teendőidet, a leadási határidőket, valamint gyors elérést biztosítunk a profilodhoz és a jelentkezéseidhez.",
    ],
    imageBlocks: [
      {
        title: "Kezdő dashboard",
        caption:
          "A sikeres bejelentkezés után a diák felület irányítópultjára érkezel. Itt áttekintheted a legfontosabb műveleteket és információkat.",
        hint: "Kattints a képre a nagyításhoz",
        src: dashboardImg,
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
      "A rendszerben a legfontosabb folyamatok egyszerűen nyomon követhetőek. Egy új jelentkezés leadásakor például csak ki kell töltened az űrlapot, majd elmenteni.",
      "Minden mentés után a rendszer visszajelzést ad, a listanézetekben pedig azonnal láthatod a jelentkezéseid aktuális állapotát, ami biztosítja a folyamatos átláthatóságot.",
    ],
    imageBlocks: [
      {
        title: "Saját profil kitöltése",
        caption:
          "A profilodnál megadhatod a személyes és tanulmányi adataidat, amelyeket a munkáltatók is látni fognak.",
        hint: "Kattints a képre a nagyításhoz",
        src: profileImg,
      },
      {
        title: "Duális helyem státuszai",
        caption:
          "A 'Duális helyem' menüpontban követheted nyomon a jelentkezéseid és partnereid aktuális állapotát (pl. Aktív, Elfogadva).",
        hint: "Kattints a képre a nagyításhoz",
        src: dualisallapotImg,
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
      "Ha hibát tapasztalsz (például sikertelen mentés vagy érvénytelen adat), a rendszer piros hibaüzenetekkel jelzi a probléma pontos helyét.",
      "Ilyen esetekben ellenőrizd, hogy minden kötelező mezőt kitöltöttél-e, illetve megfelelő formátumban adtad-e meg az adatokat (például telefonszám vagy email cím).",
    ],
    imageBlocks: [
      {
        title: "Validációs hiba megjelenése",
        caption:
          "Ha egy űrlap mentésekor hibás vagy hiányzó adatot talált a rendszer, egy jól látható piros hibaüzenet figyelmeztet a probléma helyére.",
        hint: "Kattints a képre a nagyításhoz",
        src: validacioshibaImg,
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-14">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 shadow-sm p-6 lg:p-10 transition-colors">
          <p className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Súgóközpont
          </p>
          <h1 className="mt-4 text-3xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Útmutató a Duális Képzési Rendszerhez
          </h1>
          <p className="mt-4 max-w-3xl text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Üdvözlünk a Súgóközpontban! Itt minden fontos információt és lépésről lépésre szóló útmutatót megtalálsz, amely segít a rendszer gördülékeny használatában, a jelentkezések leadásától kezdve az állapotok nyomon követéséig.
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
                        {imageBlock.src ? (
                          <div
                            className="overflow-hidden rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
                            onClick={() => setSelectedImage(imageBlock.src!)}
                          >
                            <img src={imageBlock.src} alt={imageBlock.title} className="w-full h-auto object-cover" />
                          </div>
                        ) : (
                          <div className="flex min-h-[140px] items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-500 dark:text-slate-300 text-xs font-medium tracking-wide uppercase">
                            Kép helye
                          </div>
                        )}
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

      {/* Kép Nagyító Modal */}
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
              className="w-auto h-auto max-w-full max-h-[85vh] rounded-lg shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
