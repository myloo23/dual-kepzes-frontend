# Duális Képzés Platform - Frontend

## Projekt Címe és Rövid Leírása

Ez a projekt a Duális Képzés Platform frontend alkalmazása, amely egy React-alapú webes felületet biztosít. A platform célja, hogy összekösse a duális képzésben részt vevő diákokat, a képzőhelyeket kínáló cégeket, valamint az oktatási intézmények képviselőit (tanárokat, mentorokat). A rendszer különböző szerepköröket kezel (admin, diák, céges HR, mentor, tanár), és lehetővé teszi a cégek számára, hogy pozíciókat hirdessenek, a diákoknak pedig, hogy jelentkezzenek ezekre.

## Technológiai Stack

A projekt az alábbi technológiákra épül:

-   **Nyelv:** TypeScript
-   **Keretrendszer:** React (v19)
-   **Build eszköz:** Vite
-   **Routing:** React Router DOM
-   **Stílusozás:** Tailwind CSS
-   **Térképmegjelenítés:** Leaflet & React-Leaflet
-   **Ikonok:** Lucide React
-   **Linting:** ESLint

## Előfeltételek

A projekt futtatásához az alábbiakra van szükség:

-   **Node.js:** v20.x vagy újabb
-   **Csomagkezelő:** npm (a `package-lock.json` miatt)

## Telepítés és Futtatás

1.  **Repository klónozása:**
    ```bash
    git clone <repository-url>
    cd dual-kepzes-frontend
    ```

2.  **Függőségek telepítése:**
    ```bash
    npm install
    ```

3.  **Környezeti változók beállítása:**
    Hozzon létre egy `.env` fájlt a projekt gyökérkönyvtárában a `.env.example` (ha létezik) vagy az alábbi minta alapján, és adja meg a backend API elérhetőségét.
    ```env
    VITE_API_URL=http://localhost:8000/api
    ```

4.  **Fejlesztői szerver indítása:**
    ```bash
    npm run dev
    ```
    Az alkalmazás alapértelmezetten a `http://localhost:5173` címen lesz elérhető.

## Projekt Struktúra

A projekt főbb mappái és fájljai a `src` könyvtáron belül helyezkednek el:

```
src/
├── assets/         # Statikus erőforrások (képek, logók)
├── components/     # Újrafelhasználható UI komponensek
│   ├── layout/     # Oldalelrendezési komponensek (Navbar, Footer, stb.)
│   └── ui/         # Alapvető UI elemek (Button, Card, Input)
├── layouts/        # Szerepkör-specifikus oldalelrendezések (Admin, Student, stb.)
├── lib/            # Segédfüggvények és API hívások
│   ├── api.ts      # Backend API kommunikáció
│   └── cn.ts       # Tailwind class-nevek összefűzésére szolgáló segédfüggvény
├── pages/          # Az egyes oldalak komponensei, szerepkörök szerint csoportosítva
│   ├── admin/      # Adminisztrátori felület oldalai
│   ├── auth/       # Authentikációs oldalak (regisztráció, jelszó-emlékeztető)
│   ├── landing/    # Főoldal, pozíciók listázása, térképes kereső
│   └── ...         # További szerepkörök (hr, mentor, student, teacher)
├── App.tsx         # A fő alkalmazás komponens, itt történik a routing
├── main.tsx        # Az alkalmazás belépési pontja
└── index.css       # Globális stílusok és Tailwind importok
```

## Konfiguráció

A projekt egyetlen környezeti változót használ, amelyet a `.env` fájlban kell definiálni:

-   `VITE_API_URL`: A backend API végpontjának címe. Ez az a cím, ahol a frontend megpróbálja elérni a szerveroldali logikát.

Példa `.env` fájl:
```env
VITE_API_URL=http://localhost:8000/api
```

## Főbb Funkciók

-   **Szerepkör-alapú hozzáférés:** A rendszer megkülönbözteti az adminisztrátorokat, cégek képviselőit (HR), mentorokat, diákokat és tanárokat. Minden szerepkör a saját, személyre szabott felületét látja.
-   **Pozíciók Böngészése:** A látogatók és diákok böngészhetnek a cégek által meghirdetett duális képzési pozíciók között.
-   **Térképes Kereső:** A `MapPage` lehetővé teszi a pozíciók földrajzi hely alapján történő keresését egy interaktív térképen (Leaflet implementáció).
-   **Adminisztrációs Felület:** Az adminisztrátorok kezelhetik a felhasználókat, cégeket, pozíciókat és egyéb rendszerbeállításokat.
-   **Dinamikus Oldalelrendezés:** A `layouts` mappában definiált komponensek biztosítják, hogy az egyes szerepkörök csak a számukra releváns menüpontokat és funkciókat érjék el.
