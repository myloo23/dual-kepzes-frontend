# Projekt Struktúra Dokumentáció (`src`)

Ez a dokumentum a `src` könyvtár szerkezetét és az egyes könyvtárak célját mutatja be.

## Fő Könyvtárszerkezet

```
src/
├── assets/          # Statikus fájlok (képek, logók)
├── components/      # Globális UI komponensek
├── config/          # Alkalmazás konfiguráció
├── constants/       # Konstans értékek
├── features/        # Funkcionális modulok (Feature-based architecture)
├── hooks/           # Globális Custom Hook-ok
├── layouts/         # Oldal elrendezések (Layouts)
├── lib/             # Infrastruktúra és API kliensek
├── pages/           # Útválasztás (Routing) szerinti oldalak
├── types/           # Globális TypeScript definíciók
└── utils/           # Segédfüggvények
```

## Részletes Leírás

### `assets/`

Statikus erőforrások tárolása.

- `documents/`: Letölthető dokumentumok.
- `logos/`: Partner és céges logók.
- `reference-images/`: Referencia képek a designhoz.

### `components/`

Újrafelhasználható, "buta" (presentational) komponensek.

- `ui/`: Atomikus UI elemek (pl. `Button`, `Input`).
- `shared/`: Több helyen használt, összetettebb komponensek (pl. `Pagination`, `Modal`).
- `layout/`: Régi layout elemek (deprecated, layout-ok a `layouts` mappában vannak).

### `config/`

Az alkalmazás működését befolyásoló konfigurációs fájlok.

- `app.config.ts`: Környezeti változók és API URL beállítások.
- `navigation.ts`: Szerepkör alapú navigációs útvonalak (`ROLE_NAVIGATION_PATHS`).

### `constants/`

Hardcoded értékek kiszervezése a könnyebb karbantarthatóságért.

- `messages.ts`: Felhasználói üzenetek, szövegek (i18n előkészítés).
- `routes.ts`: Útvonal definíciók.
- `ui.ts`: UI konstansok (pl. animációs idők).
- `filters.ts`: Szűrő opciók értékei.

### `features/`

**Feature-Based Architecture**: Az üzleti logika moduláris szervezése. Minden mappa egy-egy funkcionális egységet tartalmaz, saját komponensekkel, hook-okkal és típusokkal.

- `auth/`: Hitelesítés, regisztráció, login.
- `applications/`: Jelentkezések kezelése.
- `companies/`: Cégek kezelése.
- `landing/`: Publikus oldal elemei.
- `news/`: Hírek kezelése.
- `notifications/`: Értesítési rendszer.
- `partnerships/`: Egyetemi partnerségek.
- `positions/`: Állásajánlatok kezelése.
- `users/`: Felhasználókezelés (Admin).

### `hooks/`

Kizárólag globális, generikus hook-ok. (A feature-specifikus hook-ok a `features` mappában vannak).

- `useCRUD.ts`: Generikus adatkezelő hook (listázás, létrehozás, törlés).
- `useModal.ts`: Modális ablakok állapotkezelése.
- `useNavigation.ts`: Szerepkör alapú navigációs logika.
- `useToast.ts`: Értesítő üzenetek kezelése.

### `layouts/`

Az alkalmazás keretét adó komponensek.

- `DashboardLayout.tsx`: A fő elrendezés (Sidebar + Header + Content).
- Szerepkör-specifikus layoutok (pl. `AdminLayout`, `StudentLayout`): Ezek mind a `DashboardLayout`-ot használják, specifikus menüpontokkal.

### `lib/`

Alacsony szintű infrastruktúra kód.

- `api.ts`: Központi API facade.
- `api-client.ts`: Axios példány és interceptorok.
- `auth-token.ts`: Token kezelés.

### `pages/`

Az alkalmazás oldalai, az URL struktúrának megfelelően szervezve. Ezek többnyire "vékony" komponensek, amelyek a `features` mappából importálják a logikát.

- `admin/`: Adminisztrációs felület oldalai.
- `auth/`: Bejelentkezés, regisztráció.
- `student/`: Hallgatói felület.
- `hr/`: Céges (HR) felület.
- `landing/`: Publikus (Landing) oldalak.

### `types/`

Globális TypeScript típusdefiníciók.

- `api.types.ts`: Backend API válaszok típusai (Single Source of Truth).
- `ui.types.ts`: UI elemek típusai.
- `form.types.ts`: Űrlap kezelés típusai.

### `utils/`

"Tiszta" segédfüggvények (pure functions), amelyek nem függenek az alkalmazás állapotától.

- `cn.ts`: Classname összefűző utility (Tailwind-hez).
- `validation-utils.ts`: Validációs segédfüggvények.
- `city-coordinates.ts`: Város koordináták (hardcoded).
