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

```
dual-kepzes-frontend/
├── public/
│   └── leaflet/              # Leaflet marker icons
├── src/
│   ├── assets/               # Static assets (logos, images)
│   ├── components/           # Reusable UI components
│   │   ├── applications/     # Application-related components
│   │   ├── company-profile/  # Company profile components
│   │   ├── landing/          # Landing page components
│   │   ├── layout/           # Layout components
│   │   ├── positions/        # Position listing components
│   │   ├── shared/           # Shared utility components
│   │   ├── student/          # Student-specific components
│   │   └── ui/               # Base UI components
│   ├── layouts/              # Page layouts for different roles
│   ├── lib/                  # Utilities and API layer
│   ├── pages/                # Page components (route targets)
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── auth/             # Authentication pages
│   │   ├── hr/               # HR dashboard pages
│   │   ├── landing/          # Public landing pages
│   │   ├── mentor/           # Mentor dashboard pages
│   │   ├── student/          # Student dashboard pages
│   │   └── teacher/          # Teacher dashboard pages
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
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
Components
    ↓
lib/api.ts (API Layer)
    ↓
Backend REST API
```

---

## 📚 Komponens Dokumentáció

### 🧩 `src/components/`

#### **applications/**
- `ApplicationModal.tsx` - Jelentkezési modal pozíciókra (motivációs levél + térkép)
- `ApplicationsList.tsx` - Hallgatói jelentkezések listája
- `LocationMap.tsx` - Interaktív térkép cég és felhasználó helyzetével

#### **company-profile/**
- `CompanyProfileDisplay.tsx` - Cég profil megjelenítése
- `CompanyProfileForm.tsx` - Cég profil szerkesztő form
- `ErrorAlert.tsx` - Hibaüzenet komponens

#### **landing/**
- `HowItWorksSection.tsx` - "Hogyan működik" szekció
- `LoginCard.tsx` - Bejelentkezési kártya

#### **layout/**
- `DashboardLayout.tsx` - Dashboard közös layout (navbar + content + footer)
- `Navbar.tsx` - Fő navigációs sáv
- `Footer.tsx` - Alsó lábléc
- `PlaceholderPage.tsx` - Placeholder még nem implementált oldalakhoz

#### **positions/**
- `FilterSidebar.tsx` - Pozíciók szűrő sidebar (város, cég, címkék, határidő)
- `PositionCard.tsx` - Pozíció kártya komponens

#### **shared/**
- `ChipButton.tsx` - Chip/tag gomb komponens
- `PasswordInput.tsx` - Jelszó input show/hide funkcióval

#### **student/**
- `NewsCard.tsx` - Hír kártya komponens
- `NewsFilter.tsx` - Hírek szűrő komponens

#### **ui/**
- `Button.tsx` - Alap gomb komponens
- `Card.tsx` - Alap kártya komponens
- `Input.tsx` - Alap input komponens

#### **Root Components**
- `CompanyInfoModal.tsx` - Cég információs modal
- `CompanyProfileModal.tsx` - Cég profil modal

---

### 📄 `src/pages/`

#### **admin/** - Admin Dashboard
- `AdminDashboard.tsx` - Admin főoldal (statisztikák)
- `AdminPositions.tsx` - Pozíciók kezelése (CRUD, deaktiválás)
- `AdminCompanies.tsx` - Cégek kezelése
- `AdminUsers.tsx` - Felhasználók kezelése
- `AdminNews.tsx` - Hírek kezelése
- `AdminTags.tsx` - Címkék kezelése
- `AdminSettings.tsx` - Rendszerbeállítások

#### **auth/** - Autentikáció
- `StudentRegisterPage.tsx` - Hallgatói regisztráció (részletes form)
- `ForgotPasswordPage.tsx` - Elfelejtett jelszó
- `ResetPasswordPage.tsx` - Jelszó visszaállítás

#### **hr/** - HR Dashboard
- `CompanyProfilePage.tsx` - Cég profil kezelése

#### **landing/** - Publikus Oldalak
- `HomePage.tsx` - Főoldal (landing page)
- `PositionsPage.tsx` - Elérhető pozíciók listája (szűrés, jelentkezés)
- `MapPage.tsx` - Pozíciók térképes megjelenítése

#### **student/** - Hallgatói Dashboard
- `StudentDashboardPage.tsx` - Hallgatói főoldal (hírek, jelentkezések)

#### **mentor/** & **teacher/**
- Placeholder oldalak (jövőbeli fejlesztés)

---

### 🎨 `src/layouts/`

Szerepkör-specifikus layoutok:

- `AdminLayout.tsx` - Admin felület layout
- `StudentLayout.tsx` - Hallgatói felület layout
- `HrLayout.tsx` - HR felület layout
- `MentorLayout.tsx` - Mentor felület layout
- `TeacherLayout.tsx` - Oktató felület layout

Minden layout tartalmazza:
- Navigációs menüt (szerepkör-specifikus)
- Oldal tartalmat
- Kijelentkezés funkciót

---

### 🧠 `src/lib/` - Utilities

#### **api.ts** - API Layer
Központi API kommunikációs réteg:

```typescript
// Példa használat
import { api } from './lib/api';

// Pozíciók lekérése
const positions = await api.positions.listPublic();

// Jelentkezés
await api.applications.submit({ positionId, studentNote });

// Cégek lekérése
const companies = await api.companies.list();
```

**Főbb API csoportok:**
- `auth` - Bejelentkezés, regisztráció
- `positions` - Pozíciók CRUD
- `companies` - Cégek CRUD
- `students` - Hallgatók kezelése
- `applications` - Jelentkezések
- `news` - Hírek
- `stats` - Statisztikák

#### **city-coordinates.ts** - Geocoding Cache
62 magyar város előre geocoding-olt koordinátái:
- Gyorsítja a térkép betöltést
- Csökkenti az API hívásokat
- Fallback Photon API előtt

#### **positions-utils.ts** - Position Utilities
Pozíció-specifikus helper függvények:
- `isExpired()` - Határidő ellenőrzés
- `parseDate()` - Dátum parsing
- `toTagName()` - Címke név kinyerés
- `norm()`, `lower()` - Szöveg normalizálás

#### **validation-utils.ts** - Validation Helpers
Form validációs függvények:
- Email validáció
- Jelszó erősség ellenőrzés
- Telefonszám validáció

#### **cn.ts** - Class Name Utility
Tailwind className összefűzés:
```typescript
cn("base-class", condition && "conditional-class")
```

---

## 🗺️ Térképes Funkciók

### Photon API Geocoding

Az alkalmazás a **Photon API**-t használja geocoding-hoz:
- **Ingyenes** - Nincs API key szükséges
- **Gyors** - 200ms rate limiting
- **Megbízható** - OpenStreetMap alapú

### Geocoding Stratégia

1. **localStorage cache** - Már geocoding-olt címek (azonnal)
2. **Pre-geocoded cities** - 62 város koordinátái (azonnal)
3. **Photon API** - Új címek geocoding-ja (200ms késleltetéssel)

### Térképek

#### MapPage (Pozíciók térképe)
- Összes aktív pozíció megjelenítése
- Felhasználó helyzete (piros marker)
- Kattintható markerek popup-pal
- "Megnézem az állást" gomb → jelentkezési modal

#### LocationMap (Jelentkezési térkép)
- Cég helyszíne (kék marker)
- Felhasználó helyzete (piros marker)
- Távolság számítás és megjelenítés
- Automatikus térképközép és zoom

---

## 🎨 Styling

### Tailwind CSS

Az alkalmazás **Tailwind CSS**-t használ:
- Utility-first approach
- Responsive design
- Dark mode ready (jövőbeli)
- Custom color palette

### Design System

**Színek:**
- Primary: Blue (`blue-600`, `blue-700`)
- Success: Green (`green-50`, `green-600`)
- Warning: Amber (`amber-50`, `amber-800`)
- Error: Red (`red-50`, `red-600`)
- Neutral: Slate (`slate-50` - `slate-900`)

**Komponensek:**
- Rounded corners: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-sm`, `shadow-lg`
- Borders: `border`, `border-2`
- Spacing: `gap-*`, `space-y-*`, `p-*`, `m-*`

---

## 🔐 Autentikáció

### Token Kezelés

```typescript
// Token tárolás
auth.setToken(token);

// Token lekérés
const token = auth.getToken();

// Kijelentkezés
auth.clearToken();
```

### Protected Routes

A védett útvonalak layout-ok által vannak kezelve:
- `AdminLayout` - Admin jogosultság szükséges
- `StudentLayout` - Hallgatói jogosultság szükséges
- `HrLayout` - HR jogosultság szükséges

---

## 📊 State Management

### Local State
- `useState` - Komponens szintű state
- `useEffect` - Side effects (API calls, subscriptions)
- `useMemo` - Computed values (filtering, sorting)

### Global State
- `sessionStorage` - Pozíció ID tárolás (map → positions navigation)
- `localStorage` - Geocoding cache, auth token

---

## 🚀 Deployment

### Vercel

A projekt Vercelre optimalizált (`vercel.json`).

**Environment Variables:**
```
VITE_API_URL=https://your-backend-api.com
```

**Deploy:**
```bash
# Automatikus deploy git push-ra
git push origin main

# Vagy manuálisan
vercel --prod
```

---

## 🧪 Development Best Practices

### Komponens Struktúra

```tsx
// 1. Imports
import { useState } from "react";
import { api } from "../../lib/api";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Component
export default function MyComponent({ title, onSubmit }: MyComponentProps) {
  // 4. State
  const [loading, setLoading] = useState(false);
  
  // 5. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 6. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 7. Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### File Naming

- Components: `PascalCase.tsx` (pl. `StudentDashboard.tsx`)
- Utilities: `kebab-case.ts` (pl. `api-utils.ts`)
- Styles: `kebab-case.css`

### Code Organization

- **Komponensek**: Kis, újrafelhasználható darabok
- **Oldalak**: Üzleti logika, API hívások
- **Layouts**: Közös szerkezet
- **Lib**: Tiszta függvények, nincs UI

---

## 📝 API Integration

### Error Handling

```typescript
try {
  const data = await api.positions.list();
  // Success
} catch (error) {
  // Error message from backend
  console.error(error.message);
}
```

### Loading States

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.positions.list();
      setPositions(data);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

---

## 🐛 Debugging

### Console Logs

Az alkalmazás részletes console log-okat használ:
- 🔄 API hívások
- 📦 Adatok betöltése
- 🗺️ Geocoding folyamat
- ✅ Sikeres műveletek
- ❌ Hibák

### Browser DevTools

- **React DevTools** - Komponens hierarchia
- **Network Tab** - API hívások
- **Console** - Log üzenetek
- **Application** - localStorage, sessionStorage

---

## 🔮 Jövőbeli Fejlesztések

- [ ] Dark mode támogatás
- [ ] Többnyelvűség (i18n)
- [ ] PWA funkciók
- [ ] Real-time értesítések (WebSocket)
- [ ] Advanced filtering (faceted search)
- [ ] Export funkciók (PDF, Excel)
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## 📞 Support

Ha kérdésed van vagy problémába ütközöl:

1. Ellenőrizd a console log-okat
2. Nézd meg a Network tab-ot
3. Ellenőrizd a backend kapcsolatot
4. Nézd meg a README-t

---

## 📄 License

MIT License - Szabad felhasználás és módosítás.

---

**Készítette:** Dual Képzés Fejlesztői Csapat  
**Utolsó frissítés:** 2026-01-17
