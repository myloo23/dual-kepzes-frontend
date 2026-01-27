# 🎓 Dual Képzés Frontend - Projekt Dokumentáció

Ez a dokumentum a **Dual Képzés Frontend** projekt technikai dokumentációjának központi hubja.

A projekt célja egy modern, skálázható és felhasználóbarát platform biztosítása a duális képzésben résztvevő szereplők – egyetemek, vállalatok és hallgatók – közötti együttműködés támogatására.

---

## 🌟 Főbb Jellemzők

- **Szerepkör-alapú hozzáférés**: Hallgatók, vállalati HR-esek, mentorok, oktatók, egyetemi koordinátorok és rendszeradminisztrátorok számára
- **Pozíció menedzsment**: Duális és nem-duális állások kezelése térképes megjelenítéssel
- **Jelentkezéskezelés**: Hallgatói jelentkezések nyomon követése és kezelése
- **Haladási napló**: Hallgatói munka dokumentálása és mentor jóváhagyás
- **Vállalati profilok**: Nyilvános cégprofilok pozíciókkal és kapcsolattartási információkkal
- **Mobil-optimalizált**: Teljesen reszponzív design minden eszközön
- **Modern UI/UX**: Tailwind CSS alapú, tiszta és intuitív felület

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

Az `api.ts` réteg részletes magyarázata, kérések kezelése, automatikus válasz-unwrapping, pagination támogatás és hiba-normalizálás.

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
cd dual-kepzes-frontend

# 2. Telepítés
npm install

# 3. API Konfiguráció
# Hozzon létre egy .env fájlt a következő tartalommal:
echo "VITE_API_URL=http://localhost:8000" > .env

# 4. Futtatás
npm run dev
```

Az alkalmazás elérhető lesz a `http://localhost:5173` címen.

Részletesebb információkért, kérjük, tekintse meg a [Kezdeti Lépések](./docs/02-getting-started.md) útmutatót.

---

## 🔄 Legutóbbi Frissítések

### API Pagination Támogatás

- Automatikus válasz-unwrapping a `{ success, data, pagination }` struktúrához
- Query paraméterek támogatása (`page`, `limit`) az összes list endpointon
- Backward compatibility meglévő komponensekkel

### Mobil Optimalizációk

- Javított reszponzivitás a DualInfoSection komponensben
- Optimalizált padding és szövegméretek mobil eszközökön
- Horizontal overflow javítások

### UI/UX Fejlesztések

- Javított cégprofil megjelenítés tiszta vizuális hierarchiával
- Optimalizált pozíció megjelenítés térképes nézettel
- Továbbfejlesztett navigáció és layout minden szerepkörhöz

---

## 🛠️ Technológiai Stack

- **React 19** - Modern UI keretrendszer
- **TypeScript** - Típusbiztonság
- **Vite** - Gyors build eszköz
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Routing
- **Leaflet** - Térképes megjelenítés
- **Lucide React** - Ikonok

---

## 📝 Licensz

Ez a projekt a Neumann János Egyetem Duális Képzési Központja számára készült.
