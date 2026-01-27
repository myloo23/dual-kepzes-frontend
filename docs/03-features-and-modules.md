# Funkciók és Modulok

Az alkalmazás számos üzleti modulra van felosztva, amelyek az `src/features/` könyvtárban találhatók.

## Alapvető Funkciók (Core Features)

### 🔐 Hitelesítés (`auth/`)

Minden felhasználói identitással kapcsolatos műveletet kezel.

- **Context**: Az `AuthContext` globális hozzáférést biztosít az aktuális felhasználóhoz (User objektum) és a hitelesítési státuszhoz.
- **Token Kezelés**: A JWT tokenek a `localStorage`-ban kerülnek tárolásra, és automatikusan beillesztésre kerülnek az API kérésekbe.
- **Komponensek**: Bejelentkezési űrlapok, jelszó-visszaállítási folyamatok.

### 🏢 Vállalatok (`companies/`)

A vállalati profilokat és adatokat kezeli.

- **Publikus**: Kereshető vállalati profilok a hallgatók számára.
- **HR/Admin**: Felületek a vállalatok számára adataik, logójuk és leírásuk szerkesztésére.

### 💼 Pozíciók (`positions/`)

Az alkalmazás állásportál komponense.

- **Listázás**: Szűrők a "Duális" és "Hagyományos" pozíciók megkülönböztetésére.
- **Menedzsment**: HR adminisztrátorok létrehozhatnak, szerkeszthetnek, lezárhatnak és újra megnyithatnak álláshirdetéseket.
- **Jelentkezés**: Összeköti a hallgatókat ezekkel a pozíciókkal.

### 📋 Jelentkezések (`applications/`)

Nyomon követi egy hallgató adott pozícióra történő jelentkezésének életciklusát.

- **Folyamat**: Hallgató jelentkezik -> Vállalat (HR) értékeli -> Elfogadás/Elutasítás.
- **Státusz Követés**: Vizuális indikátorok a jelentkezés státuszához (Függőben, Interjú, Elfogadva, Elutasítva).

### 🤝 Partnerségek (`partnerships/`)

A duális képzési rendszer formális kapcsolatait kezeli.

- **Mentor Hozzárendelés**: Vállalati mentor összekapcsolása a hallgatóval.
- **Egyetemi Felügyelet**: Eszközök az egyetemi személyzet számára a partnerségek monitorozására.

### 📰 Hírek (`news/`)

CMS-szerű funkció a közlemények számára.

- **Célzás**: A hírek specifikus szerepkörökhöz rendelhetők (pl. "Csak Hallgatóknak", "Csak Mentoroknak").
- **Admin**: Belső szerkesztő hírek létrehozására és publikálására.

## Megosztott Infrastruktúra (`components/`)

### Layoutok

- **`AdminLayout`**: Oldalsáv navigáció a rendszeradminisztrátorok számára.
- **`HrLayout`**: Irányítópult (dashboard) nézet a vállalati HR képviselők számára.
- **`StudentLayout`**: Felhasználóközpontú nézet a hallgatók számára.

### UI Komponensek

Egyedi, Tailwind CSS alapú design rendszert használunk.

- **`Button`**: Szabványosított variánsok (primary, secondary, danger, ghost).
- **`Modal`**: Hozzáférhető párbeszédablakok űrlapokhoz és megerősítésekhez.
- **`Card`**: Konténer stílus listákhoz és dashboardokhoz.
