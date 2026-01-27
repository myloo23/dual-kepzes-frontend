# Architektúra Áttekintés

## Magas Szintű Tervezés

A **Dual Képzés Frontend** egy modern alkalmazás (SPA), amely **React** és **TypeScript** alapokon nyugszik. Ez a rendszer szolgál elsődleges felületként a duális képzési együttműködések kezelésére az egyetemek, vállalatok és hallgatók között. Az alkalmazás **szerepkör-alapú** (Role-Based), ami azt jelenti, hogy a felhasználói felület és az elérhető funkciók dinamikusan alkalmazkodnak a bejelentkezett felhasználó szerepköréhez (Hallgató, Vállalati Adminisztrátor, HR, Mentor, Oktató, Rendszeradminisztrátor).

Az architektúra fő prioritásai:

- **Skálázhatóság**: Funkció-alapú (Feature-Based) mappastruktúra alkalmazásával.
- **Típusbiztonság**: A TypeScript interfészek kiterjedt használatával az API válaszok és komponens prop-ok terén.
- **Karbantarthatóság**: Megosztott UI komponensek és centralizált API logika révén.
- **Mobil-first**: Reszponzív design minden eszközön optimális felhasználói élménnyel.

## Funkció-Alapú Architektúra (Feature-Based Architecture - FBA)

A hagyományos réteg-alapú (controller/view) felosztás helyett **Funkció-Alapú Architektúrát** (FBA) alkalmazunk. Ez azt jelenti, hogy a kódbázis nem technikai funkciók, hanem az "üzleti domain" vagy funkciók szerint van szervezve.

### Könyvtárszerkezet Racionálé

- `src/features/`: Az alkalmazás magja. Itt minden mappa egy különálló üzleti domaint képvisel (pl. `auth` - hitelesítés, `companies` - vállalatok, `applications` - jelentkezések).
  - **Enkapszuláció**: Minden, ami egy adott funkcióhoz tartozik (komponensek, hook-ok, segédfüggvények, típusok), az adott funkció mappáján belül marad.
  - **Publikus API**: A funkciók ideális esetben csak a szükséges elemeket exportálják egy `index.ts` fájlon keresztül, belső implementációs részleteiket elrejtve (ezt jelenleg konvenciók biztosítják).

### Kulcsfontosságú Könyvtárak

- **`src/features/`**: Üzleti logika modulok (auth, companies, positions, applications, students, stb.).
- **`src/components/shared/`**: Megosztott, komplex UI komponensek (modális ablakok, táblázatok), amelyek funkció-függetlenek.
- **`src/components/ui/`**: Atomi, "buta" (dumb) UI komponensek (gombok, input mezők), amelyek funkció-függetlenek.
- **`src/pages/`**: A routing belépési pontjai. Az oldalak ideális esetben csak konténerek, amelyek a különböző feature komponenseket komponálják össze.
- **`src/lib/`**: API kliens konfigurációja és utility függvények (`api.ts`, `api-client.ts`).
- **`src/layouts/`**: Layout csomagolók, amelyek a perzisztens UI elemeket kezelik (Oldalsáv, Navigációs sáv) a különböző szerepkörökhöz.
- **`src/hooks/`**: Globális, újrafelhasználható custom hooks (`useModal`, `useToast`).
- **`src/types/`**: TypeScript type definíciók és interfészek.
- **`src/utils/`**: Tiszta utility függvények (formatting, validation).
- **`src/constants/`**: Alkalmazás-szintű konstansok és konfigurációk.

## Technológiai Stack Döntések

| Technológia         | Szerep           | Indoklás                                                                                                                                         |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **React 19**        | UI Keretrendszer | A legújabb párhuzamos (concurrent) funkciók és optimalizált renderelési ciklusok kihasználása.                                                   |
| **Vite**            | Build Eszköz     | Kiváló fejlesztői élmény (DevX), azonnali HMR (Hot Module Replacement) és hatékony ES modul build-ek miatt választva.                            |
| **TypeScript**      | Nyelv            | Szigorú típushatárokat kényszerít ki, jelentősen csökkentve a futásidejű hibákat és javítva a kód navigálhatóságát.                              |
| **Tailwind CSS**    | Stílusozás       | Utility-first megközelítés, amely lehetővé teszi a gyors UI fejlesztést és konzisztens design tokenek használatát stíluslap-túlcsordulás nélkül. |
| **Custom Hooks**    | Állapotkezelés   | Domain-specifikus hooks (`useCRUD`, `useAuth`, `usePositions`) az üzleti logika enkapszulálására.                                                |
| **React Router v7** | Routing          | Ipari sztenderd routing megoldás, robusztus támogatással a beágyazott layoutokhoz és védett útvonalakhoz.                                        |
| **Leaflet**         | Térképek         | Nyílt forráskódú térképes megjelenítés pozíciók földrajzi vizualizálásához.                                                                      |

## Adatfolyam (Data Flow)

1.  **UI Komponens**: Kezdeményez egy műveletet (pl. űrlap beküldése, lista lekérése).
2.  **Custom Hook**: (pl. `useAuth`, `useCRUD`, `usePositions`) Elkapja a műveletet és meghívja az API réteget.
3.  **API Réteg (`src/lib/api.ts`)**: Formázza a kérést, csatolja a JWT tokent, és elküldi a backendnek a megfelelő query paraméterekkel (pl. pagination).
4.  **API Client (`src/lib/api-client.ts`)**: Kezeli a HTTP kommunikációt, automatikusan unwrap-eli a `{ success, data }` válaszokat.
5.  **Backend**: Feldolgozza a kérést és JSON választ küld (általában `{ success, data, pagination }` formátumban).
6.  **API Client**: Automatikusan kicsomagolja a `data` mezőt, normalizálja a hibákat.
7.  **Custom Hook**: Frissíti a lokális state-et az új adatokkal.
8.  **UI Komponens**: Újra-renderelődik az új adatokkal.

### Pagination Flow

A pagination támogatás átlátszóan működik:

- Frontend: `api.positions.list({ limit: 100 })` hívás
- API Client: Query paraméterek hozzáadása az URL-hez: `/api/positions?limit=100`
- Backend: Paginated válasz: `{ success: true, data: [...], pagination: {...} }`
- API Client: Automatikus unwrapping, csak a `data` array-t adja vissza
- Komponens: Megkapja a `Position[]` array-t, nem kell tudnia a pagination struktúráról
