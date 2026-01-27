# Telepítés (Deployment)

## Stratégia

Ez az alkalmazás buildelés után egy **Statikus Oldal** (SPA - Single Page Application). Bármilyen statikus fájlszerveren hosztolható (Nginx, Apache, AWS S3, Vercel, Netlify).

## Vercel Telepítés (Ajánlott)

A projekt tartalmaz egy `vercel.json` konfigurációs fájlt, így készen áll az azonnali Vercel telepítésre.

1.  Csatlakoztassa GitHub repóját a Vercelhez.
2.  A Vercel automatikusan felismeri a `vite`-ot és konfigurálja a build beállításokat.
    - **Build Parancs**: `npm run build`
    - **Kimeneti Könyvtár**: `dist`
3.  **Környezeti Változók**: Adja hozzá a `VITE_API_URL` változót a Vercel dashboard beállításainál, amely az éles backendre mutat.

## Manuális / Docker Telepítés

Kézi hosztolás esetén (pl. Nginx-szel):

1.  **Build**
    ```bash
    npm run build
    ```
2.  **Kiszolgálás**
    Másolja a `dist/` könyvtár tartalmát a webszerver gyökérkönyvtárába (pl. `/var/www/html`).
3.  **SPA Konfiguráció**
    Győződjön meg arról, hogy a szerver minden 404-es kérést az `index.html`-re irányít át. Ez szükséges ahhoz, hogy a React Router kezelni tudja a mélyhivatkozásokat (Kliens-oldali Routing).

    **Nginx Példa:**

    ```nginx
    location / {
      try_files $uri $uri/ /index.html;
    }
    ```

## CI/CD Pipeline (Példa)

Automatizált telepítés GitHub Actions használatával:

1.  **Indító esemény (Trigger)**: Push a `main` ágra.
2.  **Lépések**:
    - Kód letöltése (Checkout).
    - Node.js `v18` telepítése.
    - `npm install`.
    - `npm run lint` (Megszakítás hiba esetén).
    - `npm run build`.
    - `dist/` artifact feltöltése a tárhelyszolgáltatóhoz.
