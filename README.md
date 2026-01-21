# 🎓 Dual Képzés Frontend

Modern, szerepkör-alapú webalkalmazás a duális képzési rendszer támogatására. Az alkalmazás lehetővé teszi a **hallgatók**, **adminisztrátorok**, **HR munkatársak**, **mentorok** és **oktatók** számára az együttműködést.

## 🧰 Tech Stack

- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet / React-Leaflet** - Interactive maps
- **Photon API** - Geocoding service
- **Lucide React** - Icon library
- **ESLint** - Code linting
- **Vercel** - Deployment platform

---

## 📦 Telepítés és Futtatás

### 1️⃣ Repository klónozása

```bash
git clone https://github.com/myloo23/dual-kepzes-frontend.git
cd dual-kepzes-frontend
```

### 2️⃣ Függőségek telepítése

```bash
npm install
```

### 3️⃣ Környezeti változók

Hozz létre egy `.env` fájlt a projekt gyökerében:

```env
VITE_API_URL=http://localhost:8000
```

### 4️⃣ Fejlesztői szerver indítása

```bash
npm run dev
```

A frontend elérhető lesz a `http://localhost:5173` címen.

### 5️⃣ Production build

```bash
npm run build
npm run preview
```

---

## 🗂️ Projektstruktúra

A projekt **Feature-Based Architecture** (Funkció alapú architektúra) elvet követi.

```
dual-kepzes-frontend/
├── public/                   # Public assets (markers, etc.)
├── src/
│   ├── assets/               # Statikus fájlok (képek, dokumentumok)
│   │   └── reference-images/ # Referencia személyek fotói
│   ├── components/           # Általános, megosztott UI komponensek
│   │   ├── layout/           # Keret komponensek (Navbar, Footer)
│   │   ├── shared/           # Újrafelhasználható elemek (Modals, Buttons)
│   │   └── ui/               # Design System (Base UI)
│   ├── config/               # App konfiguráció
│   ├── context/              # React Context (Auth)
│   ├── features/             # Üzleti logika témakörökre bontva (Single Source of Truth)
│   │   ├── applications/     # Jelentkezések kezelése
│   │   ├── auth/             # Hitelesítés
│   │   ├── companies/        # Cégek
│   │   ├── landing/          # Főoldali elemek
│   │   ├── news/             # Hírek
│   │   ├── positions/        # Álláshirdetések
│   │   └── users/            # Felhasználók
│   ├── hooks/                # Globális hook-ok (useCRUD, useToast)
│   ├── layouts/              # Szerepkör alapú elrendezések
│   ├── lib/                  # Könyvtárak és API réteg
│   ├── pages/                # Route target oldalak
│   ├── types/                # TypeScript definíciók
│   ├── App.tsx               # Fő komponens / Routing
│   └── main.tsx              # Belépési pont
```

---

## 🏗️ Architektúra

### Routing Flow

```
main.tsx
  ↓
App.tsx (Global Router)
  ├─ Public Routes
  │   ├─ HomePage (/)
  │   ├─ PositionsPage (/positions)
  │   ├─ MapPage (/map)
  │   └─ Auth Pages (/register, /login, etc.)
  │
  └─ Protected Routes (Role-based)
      ├─ AdminLayout (/admin/*)
      ├─ StudentLayout (/student/*)
      ├─ HrLayout (/hr/*)
      ├─ MentorLayout (/mentor/*)
      └─ TeacherLayout (/teacher/*)
```

### Data Flow

```
Feature Components (src/features/*)
    ↓
lib/api.ts (API Layer)
    ↓
Backend REST API
```

---

## 📚 Funkcionális Modulok (`src/features/`)

A projekt gerincét a **features** mappa adja. Minden modul tartalmazza a saját komponenseit, hook-jait és logikáját.

### 🔐 **auth/**
Bejelentkezési és regisztrációs folyamatok vizuális elemei (pl. `LoginCard`).

### 📋 **applications/**
Hallgatói jelentkezések kezelése.
- **Components**: `ApplicationsList` (Jelentkezések listázása), `LocationMap` (Térkép).

### 🏢 **companies/**
Céges profilok és adminisztráció.
- **Components**: `CompanyProfileDisplay` (Adatlap), `CompanyFormModal` (Szerkesztés).

### 🏠 **landing/**
A publikus főoldal építőkockái.
- **Components**: `HowItWorksSection`, `DualInfoSection`, `MaterialsGallery` (Szórólapok), `ReferencesSlider`.

### 📰 **news/**
Hírek és értesítések rendszere.
- **Components**: `NewsCard`, `NewsFilter`, `NewsFormModal`.

### 💼 **positions/**
Álláshirdetések böngészése és kezelése.
- **Components**: `PositionsList`, `PositionsMap`, `PositionCard`, `FilterSidebar`, `JobSlider`.
- **Utils**: Pozíció specifikus segédfüggvények.

### 👥 **users/**
Felhasználói fiókok kezelése (Admin/HR).
- **Components**: `AdminUserModal`, `StudentFormModal`.

---

## 📄 Oldalak (`src/pages/`)

Az oldalak kötik össze a funkciókat a routing-gal.

### **admin/** - Admin Dashboard
- `AdminDashboard.tsx` - Vezérlőpult
- `AdminPositions.tsx`, `AdminCompanies.tsx`, `AdminUsers.tsx`, `AdminNews.tsx` - CRUD felületek

### **auth/** - Autentikáció
- `StudentRegisterPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`

### **hr/** - HR Dashboard
- `CompanyProfilePage.tsx` - Saját cég adatainak kezelése

### **landing/** - Publikus Oldalak
- `HomePage.tsx` - Főoldal
- `PositionsPage.tsx` - Álláskereső
- `PublicCompanyProfilePage.tsx` - Cég publikus adatlapja

### **student/** - Hallgatói Dashboard
- `StudentDashboardPage.tsx` - Saját jelentkezések
- `StudentNewsPage.tsx` - Hírek

---

## 🧠 Utilitás és Hook-ok

### `src/hooks/`
- **`useCRUD`**: Általános adatkezelő hook (létrehozás, olvasás, frissítés, törlés).
- **`useToast`**: Visszajelző üzenetek kezelése.
- **`useModal`**: Modál ablakok vezérlése.
- **`useGeocoding`**: Címek koordinátává alakítása.

### `src/lib/`
- **`api.ts`**: Központi Axios példány beépített token kezeléssel és hibakezeléssel.
- **`cn.ts`**: Tailwind osztályok dinamikus összefűzése (`clsx`, `tailwind-merge`).

---

## 🎨 Styling

### Tailwind CSS
Az alkalmazás **Tailwind CSS**-t használ a stílusozáshoz.
- **Primary**: Blue (`blue-600`)
- **Success**: Green (`green-600`)
- **UI Elements**: `rounded-2xl`, `shadow-sm`, `border-slate-200`

---

## 🚀 Deployment

A projekt Vercelre optimalizált.

**Environment Variables:**
```
VITE_API_URL=https://your-backend-api.com
```

**Build:**
```bash
npm run build
```

---

##  License

MIT License - Szabad felhasználás és módosítás.

---

**Készítette:** Dual Képzés Fejlesztői Csapat  
**Utolsó frissítés:** 2026-01-21
