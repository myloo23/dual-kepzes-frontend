# Architektúra Áttekintés

## Magas Szintű Tervezés

A **Dual Képzés Frontend** egy modern alkalmazás (SPA), amely **React** és **TypeScript** alapokon nyugszik. Ez a rendszer szolgál elsődleges felületként a duális képzési együttműködések kezelésére az egyetemek, vállalatok és hallgatók között. Az alkalmazás **szerepkör-alapú** (Role-Based), ami azt jelenti, hogy a felhasználói felület és az elérhető funkciók dinamikusan alkalmazkodnak a bejelentkezett felhasználó szerepköréhez (Hallgató, Vállalati Adminisztrátor, HR, Mentor, Oktató, Rendszeradminisztrátor).

Az architektúra fő prioritásai:

- **Skálázhatóság**: Funkció-alapú (Feature-Based) mappastruktúra alkalmazásával.
- **Típusbiztonság**: A TypeScript interfészek kiterjedt használatával az API válaszok és komponens prop-ok terén.
- **Karbantarthatóság**: Megosztott UI komponensek és centralizált API logika révén.

## Funkció-Alapú Architektúra (Feature-Based Architecture - FBA)

A hagyományos réteg-alapú (controller/view) felosztás helyett **Funkció-Alapú Architektúrát** (FBA) alkalmazunk. Ez azt jelenti, hogy a kódbázis nem technikai funkciók, hanem az "üzleti domain" vagy funkciók szerint van szervezve.

### Könyvtárszerkezet Racionálé

- `src/features/`: Az alkalmazás magja. Itt minden mappa egy különálló üzleti domaint képvisel (pl. `auth` - hitelesítés, `companies` - vállalatok, `applications` - jelentkezések).
  - **Enkapszuláció**: Minden, ami egy adott funkcióhoz tartozik (komponensek, hook-ok, segédfüggvények, típusok), az adott funkció mappáján belül marad.
  - **Publikus API**: A funkciók ideális esetben csak a szükséges elemeket exportálják egy `index.ts` fájlon keresztül, belső implementációs részleteiket elrejtve (ezt jelenleg konvenciók biztosítják).

### Kulcsfontosságú Könyvtárak

- **`src/features/`**: Üzleti logika modulok.
- **`src/components/`**: Megosztott, "buta" (dumb) UI komponensek (gombok, modális ablakok, input mezők), amelyek funkció-függetlenek.
- **`src/pages/`**: A routing belépési pontjai. Az oldalak ideális esetben csak konténerek, amelyek a különböző feature komponenseket komponálják össze.
- **`src/lib/`**: Harmadik féltől származó könyvtárak konfigurációja (Axios, Utility függvények).
- **`src/layouts/`**: Layout csomagolók, amelyek a perzisztens UI elemeket kezelik (Oldalsáv, Navigációs sáv) a különböző szerepkörökhöz.

## Technológiai Stack Döntések

| Technológia                    | Szerep           | Indoklás                                                                                                                                            |
| ------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 19**                   | UI Keretrendszer | A legújabb párhuzamos (concurrent) funkciók és optimalizált renderelési ciklusok kihasználása.                                                      |
| **Vite**                       | Build Eszköz     | Kiváló fejlesztői élmény (DevX), azonnali HMR (Hot Module Replacement) és hatékony ES modul build-ek miatt választva.                               |
| **TypeScript**                 | Nyelv            | Szigorú típushatárokat kényszerít ki, jelentősen csökkentve a futásidejű hibákat és javítva a kód navigálhatóságát.                                 |
| **Tailwind CSS**               | Stílusozás       | Utility-first megközelítés, amely lehetővé teszi a gyors UI fejlesztést és konzisztens design tokenek használatát stíluslap-túlcsordulás nélkül.    |
| **React Query / Custom Hooks** | Állapotkezelés   | _Megjegyzés: Jelenleg szigorúan egyedi hook-okat (`useCRUD`) és `useEffect`-et használunk, de az architektúra készen áll a React Query migrációra._ |
| **React Router v7**            | Routing          | Ipari sztenderd routing megoldás, robusztus támogatással a beágyazott layoutokhoz és védett útvonalakhoz.                                           |

## Adatfolyam (Data Flow)

1.  **UI Komponens**: Kezdeményez egy műveletet (pl. űrlap beküldése).
2.  **Custom Hook**: (pl. `useAuth`, `useCRUD`) Elkapja a műveletet.
3.  **API Réteg (`src/lib/api.ts`)**: Formázza a kérést, csatolja a JWT tokent, és elküldi a backendnek.
4.  **Backend**: Feldolgozza a kérést és JSON választ küld.
5.  **API Réteg**: Normalizálja a logikát (hibakezelés) és visszaadja az adatot a hook-nak.
6.  **UI Komponens**: Újra-renderelődik az új adatokkal.
