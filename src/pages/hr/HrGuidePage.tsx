type FaqItem = {
  question: string;
  answer: string[];
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

const HR_FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Áttekintés és kezdőlap",
    items: [
      {
        question: "Milyen információkat látok azonnal a belépés után?",
        answer: [
          "A bejelentkezés után az Áttekintés és statisztika menüpontba érkezik.",
          "Itt rögtön látható az aktív álláshirdetések és az összes beérkezett jelentkező száma.",
          "A kártyákról egy kattintással elérhetők a részletes listák.",
        ],
      },
    ],
  },
  {
    title: "Toborzás és álláshirdetések",
    items: [
      {
        question: "Hogyan tudok új nyitott pozíciót meghirdetni a hallgatóknak?",
        answer: [
          "Az Álláshirdetések menüpont alatt az + Új pozíció gombra kattintva hozható létre hirdetés.",
          "Meg kell adni a szakot, a címet, a leírást, a jelentkezési határidőt, a munkavégzés helyét és a címkéket.",
        ],
      },
      {
        question:
          "Csak duális pozíciókat hirdethetek, vagy normál állásokat is?",
        answer: [
          "A rendszer mindkettőt támogatja.",
          "A Duális képzés pozíció jelölőnégyzettel dönthető el, hogy duális vagy normál (teljes munkaidős) pozícióként jelenjen meg a hirdetés.",
        ],
      },
    ],
  },
  {
    title: "Jelentkezők kezelése és aktív keresés",
    items: [
      {
        question: "Hol látom a jelentkezőket, és hogyan tudom őket elbírálni?",
        answer: [
          "A Jelentkezések menüpontban szűrhető listában láthatók a pályázatok.",
          "A hallgatói kártyákon az Elfogadás, Elutasítás és Törlés műveletek azonnal elérhetők.",
          "A Megtekintés gomb a részletes adatlapot nyitja meg.",
        ],
      },
      {
        question: "Van lehetőségem proaktívan is keresni a hallgatók között?",
        answer: [
          "Igen. A Duális helyet keresők menüpontban böngészhet a munkát kereső hallgatók között.",
          "Szűrni lehet szakma, nyelvvizsga és elérhetőség alapján, majd a Megkeresés küldése gombbal közvetlenül felvehető a kapcsolat.",
        ],
      },
    ],
  },
  {
    title: "Szerződött hallgatók és mentorok",
    items: [
      {
        question:
          "Hogyan menedzselem a már felvett, nálunk dolgozó duális hallgatókat?",
        answer: [
          "A Duális hallgatóink menüpontban kezelhetők a szerződött diákok.",
          "Itt látható a státusz (Aktív, Mentor jóváhagyásra vár, Lezárt) és a képzési időszak.",
        ],
      },
      {
        question: "Hogyan tudok a hallgatóhoz vállalati mentort rendelni?",
        answer: [
          "A hallgató neve melletti + Mentor gombbal választható ki a mentor a regisztrált munkatársak közül.",
          "A kiválasztás után a hozzárendelés véglegesíthető.",
        ],
      },
      {
        question: "Hol látom a cégünk regisztrált munkatársait?",
        answer: [
          "A Munkavállalók almenü listázza a céghez tartozó mentorokat és HR adminisztrátorokat az elérhetőségeikkel együtt.",
        ],
      },
    ],
  },
  {
    title: "Cégprofil és beállítások",
    items: [
      {
        question:
          "Hogyan tudom szerkeszteni a vállalatunk adatait és telephelyeit?",
        answer: [
          "A Cégprofil menüpontban frissíthető az adószám, weboldal és bemutatkozó szöveg, valamint itt kezelhetők a telephelyek.",
          "Ugyanitt aktiválható a Saját jelentkezési felület használata opció, és megfelelő jogosultsággal céges képek is feltölthetők.",
        ],
      },
      {
        question: "Hol tudom a saját adataimat módosítani?",
        answer: [
          "A Profil beállítások oldalon módosítható a név, telefonszám és jelszó, valamint profilkép is feltölthető.",
          "Itt érhető el a profil végleges törlésének lehetősége is.",
        ],
      },
    ],
  },
  {
    title: "Kommunikáció és támogatás",
    items: [
      {
        question: "Hogyan értesülök az egyetem fontos közleményeiről?",
        answer: [
          "A Hírek menüpontban olvashatók az egyetemi adminisztrátorok üzenetei.",
          "A Csak fontos szűrővel kiemelhetők a sürgős közlemények.",
        ],
      },
      {
        question: "Hol találok segítséget a felület használatához?",
        answer: [
          "A Súgó és Segítség menüpontban interaktív tananyagok érhetők el.",
          "A rendszer nyomon követi az elvégzett modulok állapotát is.",
        ],
      },
    ],
  },
];

export default function HrGuidePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm text-center transition-colors">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
          GYIK - Céges toborzási és HR felület
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto transition-colors">
          Ez az oldal a céges adminisztrációs felület használatához kapcsolódó leggyakoribb kérdéseket és válaszokat tartalmazza.
        </p>
      </div>

      <div className="space-y-4">
        {HR_FAQ_SECTIONS.map((section) => (
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


