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
      {
        question: "Hogyan történik a rendszerműveletek auditálása?",
        answer: [
          "A rendszerben végzett minden kritikus művelet (pl. felhasználók módosítása, cégek státuszának átállítása, hirdetések törlése) automatikusan naplózásra kerül az Audit Naplóban (Audit Log).",
          "Az Audit Naplóban látható a műveletet végző felhasználó, a pontos időpont, a művelet típusa és a módosított adatok részletei.",
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
        question: "Hogyan működik az új cégregisztrációk jóváhagyása?",
        answer: [
          "A nyilvános regisztrációs felületen beküldött cégregisztrációk alapértelmezetten függőben lévő (PENDING) státuszba kerülnek, és ezek a felhasználók nem tudnak bejelentkezni.",
          "Az adminisztrátornak a 'Függőben lévő cégek' fül alatt kell ellenőriznie az adószámot és a kapcsolattartót, majd a 'Jóváhagyás' gombra kattintva aktiválhatja a céget.",
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
          "A Hírek menüpontban közlemények publikálhatók célközönség szerint (pl. csak hallgatóknak, csak cégeknek, vagy mindenkinek).",
          "A Fontos kiemelés opcióval kiemelhető a bejegyzés (piros szegéllyel jelenik meg a dashboardon), a hírek utólag szerkeszthetők vagy archiválhatók.",
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
      {
        question: "Miért kapok bejelentkezési hibát közvetlenül regisztráció után?",
        answer: [
          "Az új vállalati regisztrációkat a Neumann János Egyetem adminisztrátorainak manuálisan kell jóváhagyniuk és aktiválniuk az adatok hitelessége miatt.",
          "Amíg a jóváhagyás nem történik meg (a cég státusza PENDING), a rendszer elutasítja a bejelentkezési kísérleteket. A jóváhagyásról e-mailes értesítést fog kapni.",
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
          "A Pozíció típusa opcióval dönthető el, hogy Duális képzés, Szakmai gyakorlat vagy Normál munkahelyként jelenjen meg a hirdetés.",
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
          "A hallgatói kártyákon az Elfogadás, Elutasítás és Törlés műveletek azonnal elérhetők. A Megtekintés gomb a részletes adatlapot nyitja meg.",
        ],
      },
      {
        question: "Hogyan férhetek hozzá a hallgató önéletrajzához?",
        answer: [
          "A GDPR-kompatibilis adatvédelmi irányelvek miatt a szerverünk nem menti el a diákok feltöltött fájljait a központi adatbázisba.",
          "Amikor egy diák jelentkezik a pozícióra, az önéletrajza és a motivációs levele közvetlenül, e-mail csatolmányként érkezik meg a cég kapcsolattartási e-mail címére. A felületen a hallgató személyes, tanulmányi és motivációs szöveges adatait láthatja.",
        ],
      },
      {
        question: "Van lehetőségem proaktívan is keresni a hallgatók között?",
        answer: [
          "Igen. A Duális helyet keresők menüpontban böngészhet a munkát kereső hallgatók között.",
          "Szűrni lehet szakma, nyelvvizsga és elérhetőség alapján, majd a Megkeresés küldése gombbal közvetlenül felvehető a kapcsolat.",
        ],
      },
      {
        question: "Miért kapok hibaüzenetet egy diák jelentkezésének elfogadásakor?",
        answer: [
          "A rendszer szabályai szerint egy hallgatónak egyszerre legfeljebb egy aktív vagy folyamatban lévő duális partnersége (szerződése) lehet.",
          "Ha a hallgatót egy másik cég már elfogadta és a szerződéskötés folyamatban van vagy lezárult, a rendszer biztonsági okokból blokkolja a párhuzamos elfogadást.",
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
          "A hallgató neve melletti + Mentor gombbal választható ki a mentor a regisztrált munkatársak közül. A hozzárendelés véglegesíthető.",
          "A partnerség státusza ekkor PENDING_UNIVERSITY (Egyetemre vár) állapotba lép, és továbbkerül az egyetemi referens elé jóváhagyásra.",
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
];

export const STUDENT_FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Regisztráció és profil beállítások",
    items: [
      {
        question: "Hogyan tudok regisztrálni a duális képzési rendszerbe?",
        answer: [
          "Diák fiók létrehozásához meg kell adnod az e-mail címed, egy legalább 12 karakteres jelszót, teljes nevedet és telefonszámodat.",
          "A regisztrációs űrlapon ki kell töltened a személyes adatokat, a lakcímedet és a jelenlegi tanulmányi hátteredet (pl. középiskola vagy már egyetemi képzés). Az adatkezelési nyilatkozat elfogadása után véglegesítheted a regisztrációt.",
        ],
      },
      {
        question: "Mi az az egyetemi átállás és hogyan működik?",
        answer: [
          "Ha középiskolásként regisztráltál, majd felvételt nyertél a Neumann János Egyetemre, a profiloldaladon az 'Egyetemi átállás' (Transition to University) gombbal rögzítheted a megszerzett Neptun kódodat és az egyetemi szakodat.",
          "Ez átváltja a fiókodat egyetemi hallgató státuszra, ami elengedhetetlen az egyetemi jóváhagyásokhoz.",
        ],
      },
      {
        question: "Hogyan érhetem el, hogy a cégek megtaláljanak a rendszerben?",
        answer: [
          "A profilodon található 'Munkakeresési státusz' kapcsolóval teheted láthatóvá magad a partnercégek számára. Alapértelmezés szerint ez inaktív.",
          "Ha bekapcsolod, a cégek böngészhetnek a profilodban szak, nyelvtudás szerint, és közvetlen megkeresést (érdeklődést) küldhetnek neked.",
        ],
      },
    ],
  },
  {
    title: "Állások és a jelentkezés folyamata",
    items: [
      {
        question: "Hogyan kereshetek állást és duális pozíciókat?",
        answer: [
          "Az állások oldalon térképes és szűrőkkel ellátott listás nézetben is kereshetsz. Szűrhetsz szak, helyszín, cég vagy jelentkezési határidő alapján.",
        ],
      },
      {
        question: "Hogyan működik a fájlok feltöltése a jelentkezésnél? Biztonságban vannak a dokumentumaim?",
        answer: [
          "Igen, teljes biztonságban. Adatvédelmi és GDPR okokból a rendszerünk nem tárolja el a feltöltött önéletrajzokat (CV) és motivációs leveleket a szerver lemezein vagy adatbázisában.",
          "A jelentkezés gomb megnyomásakor a fájlok közvetlenül a memóriából titkosított e-mail csatolmányként kerülnek továbbításra a cég adminisztrátorának. Emiatt minden új jelentkezésnél újra fel kell töltened az önéletrajzodat.",
        ],
      },
      {
        question: "Jelentkezhetek-e egyszerre több helyre, és hány duális szerződésem lehet?",
        answer: [
          "Igen, szabadon jelentkezhetsz tetszőleges számú nyitott pozícióra a felületen.",
          "Azonban a rendszer szabályai szerint egyszerre legfeljebb egy aktív vagy jóváhagyás alatt álló duális partnerséged (szerződésed) lehet. Amint egy cég elfogadja a jelentkezésedet és elindul a szerződéskötés, a többi jelentkezésed függőben marad vagy visszavonásra kerül, és lekerülsz a szabadon kereshető diákok listájáról.",
        ],
      },
      {
        question: "Hol követhetem a jelentkezéseim státuszát?",
        answer: [
          "A 'Jelentkezéseim' fül alatt láthatod a leadott pályázataidat és azok aktuális állapotát (pl. Beküldve, Elfogadva, Elutasítva). Bármikor visszavonhatod a jelentkezésedet a kuka ikonra kattintva.",
        ],
      },
    ],
  },
  {
    title: "Duális partnerség életciklusa",
    items: [
      {
        question: "Milyen fázisokon megy keresztül a duális megállapodásom?",
        answer: [
          "A duális kapcsolat az alábbi státuszokon halad végig:",
          "1. Mentorra vár (PENDING_MENTOR): A cég elfogadta a jelentkezésedet, de még nem jelölte ki a céges mentorodat.",
          "2. Egyetemre vár (PENDING_UNIVERSITY): A cég kijelölte a mentorodat, most az egyetemi referensen a sor, hogy jóváhagyja és kijelölje az egyetemi felelősödet.",
          "3. Aktív (ACTIVE): Az egyetemi jóváhagyás megtörtént, a duális jogviszonyod éles és dolgozol a cégnél.",
          "4. Lezárt (FINISHED) vagy Megszakított (TERMINATED): A félév/képzés sikeresen befejeződött, vagy valamilyen okból idő előtt megszakadt.",
        ],
      },
      {
        question: "Hol találom a mentorom és az egyetemi felelősöm elérhetőségét?",
        answer: [
          "A 'Duális helyem' fül alatt láthatod az aktuális partnerséged részleteit, beleértve a céges mentorod és az egyetemi referensed nevét és e-mail címét.",
        ],
      },
    ],
  },
];

export const MENTOR_FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Mentor szerepkör és feladatok",
    items: [
      {
        question: "Mi a feladatom mentorként a rendszerben?",
        answer: [
          "Mentorként Ön a vállalat szakmai képviselője, aki közvetlenül felügyeli és támogatja a hozzárendelt hallgatók munkáját.",
          "A rendszerben nyomon követheti a hallgatók adatait, ellenőrizheti a képzési időszakot, és kapcsolatot tarthat az egyetemi referensekkel.",
        ],
      },
      {
        question: "Milyen jogosultságaim vannak a cégadminisztrátorhoz képest?",
        answer: [
          "A mentor elsősorban a szakmai megvalósításért és a hozzá rendelt hallgatókért felelős. Nem szerkesztheti a vállalat globális adatait, telephelyeit, nem vehet fel új munkatársakat, és nem bírálhatja el a beérkező jelentkezéseket. Ezeket a feladatokat a Cégadminisztrátor látja el.",
          "A mentor ugyanakkor láthatja a cég által meghirdetett pozíciókat, és frissítheti vagy lezárhatja a saját szakterületéhez tartozó hirdetéseket.",
        ],
      },
    ],
  },
  {
    title: "Hallgatók kezelése és partnerség",
    items: [
      {
        question: "Hogyan leszek hozzárendelve egy hallgatóhoz?",
        answer: [
          "Amikor a cégadminisztrátor elfogadja egy hallgató jelentkezését, a 'Duális hallgatóink' listában ki kell választania Önt, mint kijelölt mentort.",
          "Ekkor Ön a rendszeren keresztül azonnali értesítést kap a felkérésről és a hallgató adatairól.",
        ],
      },
      {
        question: "Mi a teendőm a hozzárendelés után?",
        answer: [
          "A hozzárendelés után a partnerség 'PENDING_UNIVERSITY' státuszba kerül. Vegye fel a kapcsolatot a hallgatóval, egyeztesse a szakmai feladatokat.",
          "Amint az egyetemi referens is kijelöli az egyetemi felügyelőt, a partnerség ACTIVE státuszba lép, és megkezdődhet a hivatalos képzés.",
        ],
      },
      {
        question: "Hogyan értesülök a fontos eseményekről?",
        answer: [
          "A rendszer automatikus értesítéseket (Notifications) küld a harang ikon alatt, ha új diákot rendelnek Önhöz, vagy ha változás áll be a képzés állapotában.",
        ],
      },
    ],
  },
];

export const UNIVERSITY_FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Egyetemi koordináció és felügyelet",
    items: [
      {
        question: "Mi a feladatom egyetemi kapcsolattartóként (referensként)?",
        answer: [
          "Ön felügyeli a duális képzés egyetemi/akadémiai oldalát.",
          "Feladata a vállalatok és diákok közötti létrejövő partnerségek ellenőrzése, az egyetemi felelősök (supervisor) hozzárendelése, valamint a képzési időszak végén a partnerségek lezárása vagy szükség szerinti megszakítása.",
        ],
      },
      {
        question: "Hogyan segíthetek a még helyet kereső diákoknak?",
        answer: [
          "A 'Hallgatók' menüpontban áttekintheti az egyetem hallgatóit, és szűrhet a 'Duális helyet kereső' státuszú diákokra. Így láthatja, kiknek van még szükségük segítségre a közvetítésben.",
        ],
      },
    ],
  },
  {
    title: "Partnerségek jóváhagyása és életciklusa",
    items: [
      {
        question: "Hogyan és mikor kell jóváhagynom egy partnerséget?",
        answer: [
          "Amikor a cégadminisztrátor elfogad egy jelentkezést és kijelöli a céges mentort, a partnerség státusza PENDING_UNIVERSITY (Egyetemre vár) lesz. Ekkor jelenik meg az Ön jóváhagyási listájában.",
          "A partnerség jóváhagyásához ki kell jelölnie az egyetemi felelős oktatót a rendszerben. A rögzítés után a státusz automatikusan ACTIVE (Aktív) lesz, a hallgató profilja pedig inaktívvá válik a toborzási keresőben.",
        ],
      },
      {
        question: "Hogyan végződik a partnerség a rendszerben?",
        answer: [
          "A képzési vagy féléves időszak végén Önnek van jogosultsága a partnerséget sikeresen lezárni (FINISHED).",
          "Ha a hallgató vagy a cég idő előtt megszakítja az együttműködést, Ön állíthatja át a státuszt megszakítottra (TERMINATED).",
        ],
      },
    ],
  },
  {
    title: "Oktatói feladatok és segédletek",
    items: [
      {
        question: "Mi az oktató (egyetemi felügyelő) szerepe a duális rendszerben?",
        answer: [
          "Az oktatók, ha egyetemi felelősként ki vannak jelölve egy partnerség mellé, kísérik a hallgató egyetemi előrehaladását, egyeztetnek a céges mentorral, és ellenőrzik, hogy a vállalati gyakorlat illeszkedik-e az egyetemi tantervhez.",
        ],
      },
      {
        question: "Hogyan használhatom az Oktatási Segédlet menüpontot?",
        answer: [
          "Az 'Oktatási segédlet' pont alatt olyan beágyazott Canva prezentációk és módszertani anyagok találhatók, amelyek segítenek megismerni a duális képzés működését, a mentorálás szabályait és a követelményeket.",
        ],
      },
      {
        question: "Milyen funkciók várhatók a jövőben az oktatói felületen?",
        answer: [
          "Az oktatói felület jelenleg fejlesztés alatt áll.",
          "A jövőbeli verziókban az oktatók közvetlenül láthatják a hozzájuk rendelt diákok névsorát, elérhetik a látogatási naplókat, a céges mentorok visszajelzéseit, és online tölthetik ki a féléves szakmai értékelő lapokat.",
        ],
      },
    ],
  },
];

export const TEACHER_FAQ_SECTIONS = UNIVERSITY_FAQ_SECTIONS;
