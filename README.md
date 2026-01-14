# 🎓 Dual Képzés Frontend

Ez a repository a **Dual Képzési Rendszer frontend alkalmazását** tartalmazza.
A projekt célja egy modern, szerepkör-alapú webalkalmazás megvalósítása, amely lehetővé teszi a duális képzésben részt vevő **hallgatók**, **adminisztrátorok** és később **cégek / mentorok** számára az együttműködést.

Az alkalmazás **React + TypeScript + Vite** alapokon nyugszik, **Tailwind CSS**-sel stilizálva, és **REST API-n** keresztül kommunikál a backenddel.

---

## 🧰 Tech Stack

* **React 19**
* **TypeScript**
* **Vite**
* **React Router DOM**
* **Tailwind CSS**
* **Leaflet / React-Leaflet**
* **Lucide React (ikonok)**
* **ESLint**
* **Vercel** (deploy)

---

## 📦 Telepítés és futtatás

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
VITE_API_URL=http://localhost:8000/api
```

### 4️⃣ Fejlesztői szerver indítása

```bash
npm run dev
```

---

## 🗂️ Projektstruktúra – Áttekintés

```
dual-kepzes-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── App.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig*.json
├── eslint.config.js
├── vercel.json
└── package.json
```

---

## 🌍 `public/`

Statikus, build során nem feldolgozott fájlok.

```
public/
├── leaflet/
│   ├── marker-icon.png
│   ├── marker-icon-2x.png
│   └── marker-shadow.png
└── vite.svg
```

A `leaflet` mappa a **MapPage.tsx** által használt térképes ikonokat tartalmazza.

---

## 🚀 Alkalmazás belépési pontjai

### `src/main.tsx`

* React alkalmazás inicializálása
* `<App />` komponens renderelése

### `src/App.tsx`

* **Globális routing**
* Publikus és dashboard oldalak elkülönítése
* Layoutok betöltése

Ez az alkalmazás **irányító központja**.

---

## 🎨 `src/assets/`

Statikus erőforrások (képek, logók).

```
assets/
├── react.svg
└── logos/
    ├── abc-tech.jpg
    └── business-it.jpg
```

A logók megjelennek:

* landing oldalon
* pozíciók listájában
* térképes nézeten

---

## 🧩 `src/components/`

Újrafelhasználható UI és layout komponensek.

```
components/
└── layout/
    ├── DashboardLayout.tsx
    ├── Navbar.tsx
    ├── Footer.tsx
    └── PlaceholderPage.tsx
```

### 🔹 DashboardLayout.tsx

* Admin és Student oldalak közös kerete
* Tartalmazza:

  * Navbar
  * oldal tartalom
  * Footer

### 🔹 Navbar.tsx

* Fő navigációs sáv
* Később szerepkör-alapú menükre bővíthető

### 🔹 Footer.tsx

* Alsó információs sáv

### 🔹 PlaceholderPage.tsx

* Ideiglenes oldal még nem implementált funkciókhoz

---

## 🧠 `src/lib/` – Logikai réteg

```
lib/
├── api.ts
└── cn.ts
```

### 🔹 api.ts

Az **egyetlen hely**, ahol a frontend a backenddel kommunikál.

Feladata:

* API base URL kezelése (`VITE_API_URL`)
* REST hívások
* később: token, auth header, error handling

### 🔹 cn.ts

Tailwind utility:

* feltételes `className` összefűzés
* tisztább JSX

---

## 📄 `src/pages/` – Oldalak (role-alapú)

```
pages/
├── landing/
├── auth/
├── admin/
└── student/
```

---

### 🌍 `pages/landing/` – Publikus oldalak

```
HomePage.tsx
PositionsPage.tsx
MapPage.tsx
```

| Oldal         | Funkció                      |
| ------------- | ---------------------------- |
| HomePage      | Landing / bemutatkozás       |
| PositionsPage | Elérhető gyakorlati helyek   |
| MapPage       | Cégek térképes megjelenítése |

---

### 🔐 `pages/auth/` – Autentikáció

```
StudentRegisterPage.tsx
ForgotPasswordPage.tsx
ResetPasswordPage.tsx
```

Feladatuk:

* diák regisztráció
* jelszó visszaállítás

---

### 👑 `pages/admin/` – Admin felület

```
AdminDashboard.tsx
AdminPositions.tsx
AdminUsers.tsx
AdminTags.tsx
AdminSettings.tsx
```

| Oldal     | Funkció                    |
| --------- | -------------------------- |
| Dashboard | Áttekintés                 |
| Positions | Gyakorlati helyek kezelése |
| Users     | Felhasználók               |
| Tags      | Címkék                     |
| Settings  | Rendszerbeállítások        |

Minden admin oldal a **DashboardLayout**-be van ágyazva.

---

### 🎓 `pages/student/`

```
StudentDashboardPage.tsx
```

A bejelentkezett hallgatók fő oldala.

---

## 🧭 Architektúra – Kapcsolatok

```
main.tsx
  ↓
App.tsx
  ├─ Landing pages
  ├─ Auth pages
  └─ DashboardLayout
        ├─ Admin pages
        └─ Student pages
```

* `App.tsx` → routing
* `DashboardLayout` → közös keret
* `api.ts` → backend kommunikáció
* `pages` → üzleti logika

---

## 🚀 Deploy

A projekt **Vercelre optimalizált** (`vercel.json`).

Ajánlott:

* Environment variable beállítása Vercelben:

  * `VITE_API_URL`
