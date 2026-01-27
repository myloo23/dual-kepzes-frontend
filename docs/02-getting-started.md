# Kezdeti Lépések

## Előfeltételek

Mielőtt hozzálátna, győződjön meg arról, hogy a következő szoftverek telepítve vannak a rendszerén:

- **Node.js** (v18.0.0 vagy újabb verzió ajánlott)
- **npm** (a Node.js részeként települ)
- **Git**

## Telepítés

1.  **Repository Klónozása**

    ```bash
    git clone https://github.com/myloo23/dual-kepzes-frontend.git
    cd dual-kepzes-frontend
    ```

2.  **Függőségek Telepítése**
    ```bash
    npm install
    ```

## Környezeti Konfiguráció

Az alkalmazás környezeti változókat használ az API kapcsolatok kezelésére.

1.  Hozzon létre egy `.env` fájlt a projekt gyökérkönyvtárában (másolja át a tartalmát a `.env.example` fájlból, ha létezik, egyébként hozzon létre egy újat).
2.  Adja hozzá a következő változót:
    ```env
    VITE_API_URL=http://localhost:8000
    ```
    _Megjegyzés: Módosítsa ezt az URL-t, ha a backend szervere eltérő porton vagy hoszton fut._

## Fejlesztői Szerver Indítása

A helyi fejlesztői szerver indítása Hot Module Replacement (HMR) funkcióval:

```bash
npm run dev
```

Az alkalmazás a `http://localhost:5173` címen érhető el.

## Production Build

Optimalizált éles (production) build létrehozása:

1.  **Build**

    ```bash
    npm run build
    ```

    Ez a parancs lefordítja a TypeScript kódot és összecsomagolja (bundle) az eszközöket a `dist/` mappába.

2.  **Előnézet (Preview)**
    ```bash
    npm run preview
    ```
    Ez egy helyi statikus szervert indít, amely a `dist/` mappa tartalmát szolgálja ki, így lehetőség nyílik az éles verzió helyi tesztelésére.

## Linting

A kódminőség ellenőrzése és a potenciális hibák felderítése:

```bash
npm run lint
```
