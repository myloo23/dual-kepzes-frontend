# API és Adatfolyam

Az alkalmazás egy RESTful backenddel kommunikál, melyhez egy központosított API réteg biztosítja a kapcsolatot a `src/lib/api.ts` fájlban.

## Az `api` Objektum

Egyetlen globális `api` objektumot exportálunk, amely domainek (szakterületek) szerint csoportosítja a végpontokat. Ez biztosítja a kódkiegészítést és a típusbiztonságot az egész alkalmazásban.

**Használati Példa:**

```typescript
import { api } from '@/lib/api';

// Vállalatok lekérése
const companies = await api.companies.list();

// Pozíció létrehozása
await api.positions.create({ title: "DevOps Gyakornok", ... });
```

## Kérés Kezelés (Request Handling)

A háttérben az `api.ts` egy testreszabott `fetch` csomagolót (vagy Axios példányt) használ, amely a következőket kezeli:

1.  **Alap URL**: Automatikusan elé fűzi a `VITE_API_URL` változót a kérésekhez.
2.  **Autorizáció**: Ellenőrzi a `localStorage`-ot a JWT tokenért (`auth_token`), és minden hitelesített kéréshez hozzáadja az `Authorization: Bearer <token>` fejlécet.
3.  **Content-Type**: Beállítja az `application/json` típust a POST/PUT/PATCH kéréseknél.
4.  **Hiba Normalizálás**:
    - Elkapja a HTTP hibákat (4xx, 5xx).
    - Értelmezi a backend hibaüzenetét.
    - Egy szabványos JavaScript `Error` objektumot dob felhasználóbarát üzenettel, amelyet a UI komponensek vagy Toast értesítések elkaphatnak.

## Típusbiztonság

Minden API választ TypeScript interfészek definiálnak a `src/types/api.types.ts` fájlban.

- **Generikusok**: Az `apiGet<T>`, `apiPost<T>` stb. segédfüggvények biztosítják, hogy a visszatérési érték megfeleljen a várt interfésznek.

```typescript
// Definíció
function apiGet<T>(path: string): Promise<T> { ... }

// Használat
api.students.get(id) // Promise<StudentProfile> típusú választ ad
```

## Új Végpontok Hozzáadása

Új API végpont hozzáadásának lépései:

1.  Definiálja a válasz és a payload típusokat a `src/types/api.types.ts` fájlban.
2.  Adja hozzá az útvonal konstansát a `PATHS` objektumhoz a `src/lib/api.ts`-ben (opcionális, de ajánlott a "magic strings" elkerülése végett).
3.  Adjon hozzá egy új metódust az `api` objektumhoz a `src/lib/api.ts` fájlban, a megfelelő segédfüggvény (`apiGet`, `apiPost`, stb.) használatával.
