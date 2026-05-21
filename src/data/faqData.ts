export type FaqItem = {
  question: string;
  answer: string[];
};

export type FaqSection = {
  title: string;
  items: FaqItem[];
};

export const ADMIN_FAQ_SECTIONS: FaqSection[] = [
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
        question: "Hogyan tudok új vállalatot rögzíteni vagy a meglévők adatait módosítani?",
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
        question: "Hogyan tudom ellenőrizni, hogy melyik hallgató melyik céggel kötött szerződést?",
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
        question: "Hogyan tudom értesíteni a hallgatókat vagy a cégeket egy fontos eseményről?",
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

export const HR_FAQ_SECTIONS: FaqSection[] = [
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
        question: "Csak duális pozíciókat hirdethetek, vagy normál állásokat is?",
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
        question: "Hogyan menedzselem a már felvett, nálunk dolgozó duális hallgatókat?",
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
        question: "Hogyan tudom szerkeszteni a vállalatunk adatait és telephelyeit?",
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
