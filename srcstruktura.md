# Részletes Projekt Struktúra (`src`)

Ez a dokumentum a `dual-kepzes-frontend` teljes forráskód strukturáját írja le, mappáról mappára, mélységében tárgyalva a fájlok szerepét. A projekt **Feature-Based Architecture** (Funkció alapú architektúra) elvet követi.

## 📁 `src/` (Source Root)
A forráskód gyökérkönyvtára.

### 📁 `assets/`
Statikus fájlok tárolója. Nem vesznek részt a fordítási logikában, de importálhatóak.
*   **`reference-images/`**: A "Referenciák" szekcióban megjelenő személyek (oktatók, diákok) fotói.
    *   `*.jpg`: Portrék, pl. `SariB-V-199x300.jpg`, `Kiraly_I.jpg`.
*   **`documents/`**: Letölthető csatolmányok.
    *   `dkk_referensek.pdf`: Referencia lista PDF-ben.
*   **`logos/`**: Partner, egyetem és céges logók.
    *   `dkk_logos/`, `nje_logos/`: Szervezeti logók.

### 📁 `components/`
Általános, nem domain-specifikus UI komponensek.
*   **`layout/`**: Az oldal keretét adó komponensek.
    *   `Navbar.tsx`: Felső navigációs sáv (menü).
    *   `Footer.tsx`: Lábléc.
    *   `DashboardLayout.tsx`: Bejelentkezett felhasználók (Admin, Diák, HR) közös kerete (oldalsáv, fejléc).
*   **`shared/`**: Újrafelhasználható, alapvető UI elemek.
    *   `ChipButton.tsx`: Kicsi, címke-szerű gomb.
    *   `ImageModal.tsx`: Képek nagyítása kattintásra.
    *   `PasswordInput.tsx`: Jelszó mező szem ikonnal.
*   **`ui/`**: "Design System" - Az alkalmazás legkisebb építőkövei.
    *   `Button.tsx`: Stílusozott gomb.
    *   `Input.tsx`: Stílusozott beviteli mező.
    *   `Card.tsx`: Kerettel és árnyékkal ellátott tároló doboz.

### 📁 `config/`
*   `app.config.ts`: Globális konfiguráció, például az API végpont (`API_URL`) beállítása környezettől függően.

### 📁 `constants/`
*   `routes.ts`: Az alkalmazás összes URL útvonala egy helyen definiálva.
*   `messages.ts`: Felhasználónak megjelenő statikus üzenetek.
*   `filters.ts`: Szűrő feltételek alapértelmezett értékei.

### 📁 `features/` (Funkcionális modulok)
Ez a mappa tartalmazza az üzleti logikát és a kapcsolódó komponenseket témakörökre bontva. Ez a **"Single Source of Truth"** elv alapja.

*   **`auth/`**: Hitelesítés.
    *   `components/`: `LoginCard.tsx`.
*   **`applications/`**: Jelentkezések kezelése.
    *   `components/`: `ApplicationsList.tsx` (Jelentkezések listája), `ApplicationModal.tsx` (Jelentkezés részletei), `LocationMap.tsx` (Jelentkezés helyszíne).
*   **`companies/`**: Cégek logikája.
    *   `components/`: `CompanyProfileDisplay.tsx` (Adatlap), `CompanyProfileForm.tsx` (Szerkesztő).
    *   `components/modals/`: `CompanyFormModal.tsx` (Admin szerkesztő), `CompanyInfoModal.tsx` (Publikus infó).
*   **`landing/`**: A publikus főoldal (Landing Page) elemei.
    *   `components/`: `DualInfoSection.tsx`, `HowItWorksSection.tsx`, `MaterialsGallery.tsx`, `ReferencesSlider.tsx`.
*   **`news/`**: Hírek modul.
    *   `components/`: `NewsCard.tsx`, `NewsFilter.tsx`.
    *   `components/modals/`: `NewsFormModal.tsx`.
*   **`positions/`**: Álláshirdetések modul.
    *   `components/`: `PositionsList.tsx`, `PositionsMap.tsx`, `FilterSidebar.tsx`, `JobCard.tsx`, `JobSlider.tsx`, `PositionCard.tsx`.
    *   `components/modals/`: `PositionFormModal.tsx`.
*   **`users/`**: Felhasználókezelés.
    *   `components/modals/`: `AdminUserModal.tsx`, `StudentFormModal.tsx`.

### 📁 `hooks/` (Globális Hook-ok)
Általános célú és megosztott hook-ok gyűjteménye.
*   `useCRUD.ts`: Generikus adatműveletek (Create, Read, Update, Delete) kezelése.
*   `useModal.ts`: Modál ablakok állapotkezelése.
*   `useToast.ts`: Értesítések kezelése.
*   `useGeocoding.ts`, `useLocationGeocoding.ts`: Térképes koordináta konverziók.
*   `usePositionsFilters.ts`: Álláskereső szűrőlogikája (megosztott).

### 📁 `layouts/`
*   `StudentLayout.tsx`, `TeacherLayout.tsx`, `MentorLayout.tsx`, `HrLayout.tsx`, `AdminLayout.tsx`:
    Szerepkör-specifikus elrendezések definíciója.

### 📁 `lib/` (Könyvtárak és Segédek)
*   `api.ts`: Konfigurált `axios` példány, token kezeléssel.
*   `cn.ts`: CSS osztályok összefűzése (`clsx`, `tailwind-merge`).
*   `city-coordinates.ts`: Városok fix koordinátái.

### 📁 `pages/` (Oldalak - Routing)
Az alkalmazás végpontjai (Router Pages).
*   **`admin/`**: `AdminDashboard.tsx`, `AdminCompanies.tsx`, `AdminPositions.tsx`, `AdminUsers.tsx`, `AdminNews.tsx`.
*   **`auth/`**: `StudentRegisterPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`.
*   **`hr/`**: `CompanyProfilePage.tsx`.
*   **`landing/`**: `HomePage.tsx`, `PositionsPage.tsx`, `MapPage.tsx`, `PublicCompanyProfilePage.tsx`.
*   **`student/`**: `StudentDashboardPage.tsx`, `StudentNewsPage.tsx`.

### 📁 `types/` (TypeScript Definíciók)
*   `api.types.ts`: API adatmodellek (`User`, `Company`, `Position`, stb.).
*   `ui.types.ts`, `form.types.ts`: UI és űrlap típusdefiníciók.

### Gyökér fájlok
*   `App.tsx`: Routing konfiguráció.
*   `main.tsx`: Belépési pont.
*   `index.css`: Globális stílusok.
