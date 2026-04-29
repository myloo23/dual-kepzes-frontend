# Duális Képzés Frontend - Részletes Projekt Struktúra és Architektúra

> Note: This document may contain older generated notes. For current handoff information, verify against README.md, backendreadme.md, package.json, AGENTS.md, and src/App.tsx.

Ez a dokumentum a projekt könyvtárszerkezetét, tervezési elveit és a fejlesztés során követendő szabályokat tartalmazza részletesen. A projekt **Feature-Based Architecture** (Funkció Alapú Architektúra) elvet követi.

---

## 🏗️ Alapelvek

1.  **Funkció > Típus:** A fájlokat nem aszerint csoportosítjuk, hogy mik (hook, komponens), hanem hogy **melyik üzleti folyamathoz** tartoznak.
2.  **Thin Pages (Vékony Oldalak):** Az oldalak csak "összerakják" a UI-t, nem tartalmaznak bonyolult logikát.
3.  **Típusbiztonság:** Mindent TypeScript interfészekkel írunk le (`src/types/`).
4.  **Szeparáció:**
    - `features/`: Üzleti logika.
    - `components/`: Buta UI elemek.
    - `lib/`: Infrastruktúra (API).

---

## 📁 `src/features/` (A Rendszer Szíve)

Itt található az alkalmazás üzleti logikájának 90%-a.

### Miért így?

Ha módosítani kell a "Cégek" működését, nem kell 5 különböző globális mappában keresgélni. Minden egy helyen van: `src/features/companies`.

### Struktúra (`features/[featureName]/`)

- **`components/`**: Kizárólag ehhez a funkcióhoz tartozó UI.
  - _Példák:_ `CompanyProfileForm.tsx`, `CompanyEmployeeList.tsx`.
- **`hooks/`**: React hook-ok, amelyek az állapotot és logikát kezelik.
  - _Példa:_ `useCompanyExport.ts` (Excel export logika).
- **`types/`**: (Opcionális) Helyi típusok, amik máshol nem kellenek.
- **`index.ts`**: **Publikus API**. Csak azt exportálja, amit más modulok használhatnak. (Encapsulation).

### Modulok listája

- **`auth`**: Bejelentkezés, token kezelés, `AuthContext`.
- **`users`**: Profilkezelés (Diák, Admin, Cégadmin).
- **`companies`**: Partnercégek menedzselése.
- **`positions`**: Álláshirdetések kezelése.
- **`notifications`**: Értesítési rendszer.

> **Ökölszabály:** Ha egy kódrészletet **csak** a Cégek kezeléséhez használunk, akkor a `features/companies` mappába kerül. Ha általános (pl. egy Gomb), akkor a `components/shared` mappába.

---

## 📁 `src/pages/` (Útvonalak / Routing)

Az oldalak szerepe a **Routing** és a **Nézet összeállítása**.

### "Thin Page" Architektúra

Egy oldal ideális esetben így néz ki:

1.  Meghív egy feature hook-ot az adatokért.
2.  Megjelenít egy Layout-ot.
3.  Beleteszi a feature komponenseket.

_Nem tartalmaz közvetlen API hívást (`fetch`), és bonyolult logikát._

### Mappák

- `landing/`: Publikus oldalak (Home, Állások listája).
- `auth/`: Login, Register.
- `admin/`, `student/`, `hr/`: Szerepkör-specifikus vezérlőpultok, amelyek az URL struktúrát tükrözik.

---

## 📁 `src/hooks/` (Globális Utility Hook-ok)

Olyan segédfüggvények, amelyek **bárhol** használhatóak és nem kötődnek üzleti logikához.

- **`useCRUD.ts` (KRITIKUS):**
  - _Mit csinál:_ Kezeli az adatbetöltés unalmas részeit (loading state, error handling, success messages).
  - _Használat:_ Admin oldalakon a listázáshoz/törléshez. Így nem kell mindenhol kézzel írni a `try-catch` blokkokat.
- **`useModal.ts`:**
  - _Mit csinál:_ Kezeli a felugró ablakok nyitását/zárását és az adatátadást (pl. szerkesztésnél a sor adatait).
- **`useToast.ts`:**
  - _Mit csinál:_ `toasts.success("Siker!")` vagy `toasts.error("Hiba")` hívások.
- **`useGlobalSearch.ts`:** A `Ctrl+K` parancsmenü vezérlése.

---

## 📁 `src/lib/` (Infrastruktúra)

A "vízvezeték szerelés". Nem tartalmaz UI-t, csak adatmozgatást.

1.  **`api-client.ts` (A Motor):**
    - A `fetch` API wrapperje.
    - Automatikusan csatolja a `Bearer` tokent.
    - Automatikusan dob hibát 401/500 esetén.
    - Így nem kell minden hívásnál `headers`-t írni.
2.  **`api.ts` (Az Étlap):**
    - Felsorolja a rendszer **összes** API végpontját.
    - Használat: `api.companies.list()` vagy `api.auth.login()`.
3.  **`auth-token.ts`:**
    - Kis utility a token `localStorage`-ba mentéséhez.

> **Szabály:** Soha ne használj `fetch()`-et komponensben. Mindig használd az `api.ts`-t.

---

## 📁 `src/components/` (Megosztott UI)

- **`ui/` (Atomok):**
  - Buta komponensek. Pl.: `Button.tsx`.
  - Nem tudnak semmit az üzleti logikáról.
- **`shared/` (Molekulák):**
  - Komplexebb, de még mindig újrahasznosítható elemek.
  - Pl.: `ExportButton.tsx` (Excel ikonnal), `GlobalSearch.tsx` (Keresőmező).

---

## 📁 `src/layouts/` (Keretrendszer)

Meghatározza az oldalak vázát (Sidebar, Header).

- **`DashboardLayout.tsx` (A Mester Sablon):**
  - Tartalmazza a Sidebart és a tartalom területet (`Outlet`).
  - Ez a szülője az összes többi layoutnak.
- **Szerepkör Layoutok (`AdminLayout`, `StudentLayout`):**
  - Ezek csak "konfigurálják" a `DashboardLayout`-ot.
  - Megmondják, milyen menüpontok legyenek az oldalsávban (pl. Admin látja a "Felhasználókat", de a Diák nem).

---

## 📁 `src/utils/` (Segédfüggvények)

Tiszta függvények (Pure Functions). Bemenet -> Kimenet, mellékhatás nélkül.

- **`cn.ts` (Stylist):**
  - Tailwind osztályok összefűzése.
  - _Példa:_ `cn("p-4 bg-red-500", isActive && "bg-green-500")` -> Kezeli az ütközéseket.
- **`export.ts`:**
  - Excel fájl generálása JSON tömbből. A hook-ok ezt hívják meg a háttérben.
- **`validation-utils.ts`:**
  - Validátorok: `isValidEmail()`, `validatePassword()`.
- **`city-coordinates.ts`:**
  - Statikus adatbázis magyar városok koordinátáival a térképhez (így nem kell Google Maps API hívás).

---

## 📁 `src/types/` (Szótár)

Az adatok formátumának központi definíciója.

- **`api.types.ts`:** A Backend és Frontend közötti "Szerződés".
  - Itt vannak az interfészek: `Company`, `Position`, `User`.
- **`common.types.ts`:** Általános típusok (`Id`, `ApiErrorBody`).
- **`ui.types.ts`:** UI specifikus típusok (pl. Tab opciók).

---

## 📁 `src/constants/` vs `src/config/`

Mi a különbség?

- **`constants/` (Amit a User lát - Tartalom):**
  - Szövegek, Címkék, Üzenetek (`messages.ts`).
  - URL Útvonalak (`routes.ts`).
  - Színek, UI méretek (`ui.ts`).
  - _Cél:_ Ha fordítani kell (i18n), vagy átírni a "Mentés" gombot "Rögzít"-re, itt kell módosítani.

- **`config/` (Amit a Kód használ - Technikai):**
  - `navigation.ts`: Melyik szerepkör hova navigáljon login után.
  - `app.config.ts`: API URL, Feature Flag-ek (pl. `ENABLE_MAP_VIEW`).
