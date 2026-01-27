# 🎓 Dual Képzés Frontend - Projekt Dokumentáció

Ez a dokumentum a **Dual Képzés Frontend** projekt technikai dokumentációjának központi hubja.

A projekt célja egy modern, skálázható és felhasználóbarát platform biztosítása a duális képzésben résztvevő szereplők – egyetemek, vállalatok és hallgatók – közötti együttműködés támogatására.

---

## 📚 Dokumentációs Index

Részletes dokumentációt állítottunk össze, amely segít eligazodni a rendszer különböző aspektusaiban:

### 🏗️ [Architektúra Áttekintés](./docs/01-architecture.md)

Betekintés a magas szintű tervezésbe, fájlstruktúrába, technológiai döntésekbe és az adatfolyamok működésébe.

### 🚀 [Kezdeti Lépések](./docs/02-getting-started.md)

Lépésről lépésre útmutató a fejlesztői környezet beállításához, a függőségek telepítéséhez és az alkalmazás helyi futtatásához.

### 🧩 [Funkciók és Modulok](./docs/03-features-and-modules.md)

Mélyreható leírás a "Funkció-Alapú Architektúráról" (Feature-Based Architecture), bemutatva az `src/features/` könyvtár szerkezetét és az egyes modulok (Auth, Companies, Positions, stb.) célját.

### 🔌 [API és Adatfolyam](./docs/04-api-and-data-flow.md)

Az `api.ts` réteg részletes magyarázata, kérések kezelése, hiba-normalizálás és új végpontok hozzáadásának menete.

### 🔐 [Hitelesítés és Biztonság](./docs/05-authentication-and-security.md)

A bejelentkezési folyamat működése, JWT menedzsment, és a Szerepkör-Alapú Hozzáférés-Vezérlés (RBAC) implementációja a routing szintjén.

### ☁️ [Telepítés](./docs/06-deployment.md)

Stratégiák az éles környezetbe történő telepítéshez, kifejezetten Vercel vagy hagyományos statikus tárhelyek számára optimalizálva.

---

## ⚡ Gyors Indítás

Azok számára, akik azonnal szeretnék indítani a rendszert:

```bash
# 1. Klónozás
git clone https://github.com/myloo23/dual-kepzes-frontend.git

# 2. Telepítés
npm install

# 3. API Konfiguráció
# Hozzon létre egy .env fájlt a következő tartalommal: VITE_API_URL=http://localhost:8000

# 4. Futtatás
npm run dev
```

Részletesebb információkért, kérjük, tekintse meg a [Kezdeti Lépések](./docs/02-getting-started.md) útmutatót.
