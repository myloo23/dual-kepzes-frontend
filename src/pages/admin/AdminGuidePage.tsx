type FaqItem = {
  question: string;
  answer: string[];
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

const ADMIN_FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Általános áttekintés és statisztikák",
    items: [
      {
        question: "Mit látok, amikor bejelentkezem az adminisztrátori felületre?",
        answer: [
          "A belépés után a Rendszer Statisztikák (Irányítópult) fogadja, amely átfogó képet ad a rendszer aktivitásáról.",
          "A felső kártyákon azonnal látható a regisztrált felhasználók, a partnercégek, a nyitott pozíciók és az aktuálisan cégnél lévő duális hallgatók száma.",
        ],
      },
      {
        question: "Milyen részletes mutatókat követhetek nyomon a statisztikák között?",
        answer: [
          "Jelentkezések állapota: összes jelentkezés, 30 napos növekmény, konverziós arány, státuszok megoszlása.",
          "Partnerségek áttekintése: aktív partnerségek, átlagos hossz, féléves bontású hallgatói létszám.",
          "Pozíciók állapota: 7 napon belül lejáró, illetve jelentkezés nélküli hirdetések.",
          "Trendek: az elmúlt 6 hónap regisztrációinak, jelentkezéseinek és partnerségeinek alakulása.",
        ],
      },
    ],
  },
  {
    title: "Felhasználók és hallgatók kezelése",
    items: [
      {
        question: "Hogyan tudom áttekinteni a rendszerben lévő felhasználókat?",
        answer: [
          "A Felhasználók menüpontban kategóriákra bontva listázhatók a felhasználók (hallgatók, cégadminok, egyetemi felhasználók, inaktívak).",
          "A táblázatban megjelenik az ID, név, e-mail, Neptun-kód és típus, az adatok kereshetők és Excelbe exportálhatók.",
        ],
      },
      {
        question: "Tudom módosítani egy hallgató adatait?",
        answer: [
          "Igen. A Szerkesztés gombbal módosíthatók a személyes adatok, a lakcím és a tanulmányi háttér.",
          "Szükség esetén a Törlés gombbal a fiók véglegesen eltávolítható.",
        ],
      },
    ],
  },
  {
    title: "Cégek és telephelyek kezelése",
    items: [
      {
        question:
          "Hogyan tudok új vállalatot rögzíteni vagy a meglévők adatait módosítani?",
        answer: [
          "A Cégek menüben látható az aktív és jóváhagyásra váró partnercégek listája.",
          "Az + Új cég gombbal új rekord hozható létre, a Szerkesztés gombbal a meglévő adatlapok módosíthatók.",
        ],
      },
      {
        question: "Milyen adatokat állíthatok be egy cég profiljánál?",
        answer: [
          "Megadható a cégnév, adószám, weboldal, kapcsolattartói adatok és bemutatkozó szöveg.",
          "A Saját jelentkezési felület használata opció is itt kezelhető, a Címek, telephelyek blokkban pedig több telephely rögzíthető.",
        ],
      },
    ],
  },
  {
    title: "Pozíciók és partnerkapcsolatok",
    items: [
      {
        question: "Hol láthatom a meghirdetett állásajánlatokat?",
        answer: [
          "A Pozíciók menüben minden cég hirdetése látható státusszal együtt.",
          "Innen új pozíció hozható létre, a meglévők szerkeszthetők, deaktiválhatók vagy törölhetők.",
        ],
      },
      {
        question:
          "Hogyan tudom ellenőrizni, hogy melyik hallgató melyik céggel kötött szerződést?",
        answer: [
          "A Partnerkapcsolatok menüpontban látható a hallgató, cég, pozíció, időszak, mentor és egyetemi felelős.",
          "Az aktuális státuszok követhetők, és az adminisztrátor közvetlenül hozzárendelhet egyetemi felelőst.",
        ],
      },
    ],
  },
  {
    title: "Kommunikáció és értesítések",
    items: [
      {
        question:
          "Hogyan tudom értesíteni a hallgatókat vagy a cégeket egy fontos eseményről?",
        answer: [
          "A Hírek menüpontban közlemények publikálhatók célközönség szerint.",
          "A Fontos kiemelés opcióval kiemelhető a bejegyzés, a hírek utólag szerkeszthetők vagy archiválhatók.",
        ],
      },
      {
        question: "Hol látom a rendszer automatikus visszajelzéseit?",
        answer: [
          "Az Értesítési központban (Notifications) jelennek meg a rendszerüzenetek.",
          "Az üzenetek szerepkör és típus szerint szűrhetők.",
        ],
      },
    ],
  },
  {
    title: "Oktatási segédletek és saját beállítások",
    items: [
      {
        question: "Hogyan ellenőrizhetem az oktatási segédletek használatát?",
        answer: [
          "A Rendszer Statisztikák (Irányítópult) oldalon látható, melyik modult hányan végezték el, és milyen értékelést adtak rá.",
        ],
      },
      {
        question: "Hol tudom módosítani a saját adataimat?",
        answer: [
          "A Beállítások menüpontban kezelhető a saját profil.",
          "Az e-mail cím és szerepkör fix, de a név és a telefonszám bármikor frissíthető.",
        ],
      },
    ],
  },
];

export default function AdminGuidePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm dark:shadow-none text-center transition-colors">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          GYIK - Adminisztrátori felület
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto transition-colors">
          Ez az oldal a rendszergazdai feladatokhoz kapcsolódó leggyakoribb kérdéseket és válaszokat tartalmazza.
        </p>
      </div>

      <div className="space-y-4">
        {ADMIN_FAQ_SECTIONS.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100">
                    {item.question}
                  </summary>
                  <div className="mt-3 space-y-2">
                    {item.answer.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>    </div>
  );
}


