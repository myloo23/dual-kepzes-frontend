# API és Adatfolyam

Az alkalmazás egy RESTful backenddel kommunikál, melyhez egy központosított API réteg biztosítja a kapcsolatot a `src/lib/api.ts` és `src/lib/api-client.ts` fájlokban.

## Az `api` Objektum

Egyetlen globális `api` objektumot exportálunk, amely domainek (szakterületek) szerint csoportosítja a végpontokat. Ez biztosítja a kódkiegészítést és a típusbiztonságot az egész alkalmazásban.

**Használati Példa:**

```typescript
import { api } from '@/lib/api';

// Vállalatok lekérése
const companies = await api.companies.list();

// Vállalatok lekérése pagination paraméterekkel
const companies = await api.companies.list({ page: 1, limit: 50 });

// Pozíció létrehozása
await api.positions.create({ title: "DevOps Gyakornok", ... });
```

## Pagination Támogatás

A backend API támogatja a pagination-t a list endpointokon keresztül. Az API automatikusan kezeli a paginated válaszokat.

### Query Paraméterek

A legtöbb list endpoint támogatja a következő opcionális paramétereket:

- `page`: Az oldal száma (1-től kezdődik)
- `limit`: Elemek száma oldalanként (alapértelmezett: 10)

**Példa:**

```typescript
// Első 100 pozíció lekérése
const positions = await api.positions.list({ limit: 100 });

// Második oldal lekérése, 20 elemmel
const companies = await api.companies.list({ page: 2, limit: 20 });
```

### Automatikus Response Unwrapping

Az `api-client.ts` automatikusan unwrap-eli a backend válaszokat:

**Backend válasz formátum:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

**Frontend által kapott adat:**

```typescript
const positions = await api.positions.list(); // Position[] típus
// A 'data' array automatikusan kicsomagolásra kerül
```

Ez biztosítja a backward compatibility-t a meglévő komponensekkel, amelyek közvetlenül array-t várnak.

## Kérés Kezelés (Request Handling)

A háttérben az `api-client.ts` egy testreszabott `fetch` csomagolót használ, amely a következőket kezeli:

1.  **Alap URL**: Automatikusan elé fűzi a `VITE_API_URL` változót a kérésekhez.
2.  **Autorizáció**: Ellenőrzi a `localStorage`-ot a JWT tokenért (`auth_token`), és minden hitelesített kéréshez hozzáadja az `Authorization: Bearer <token>` fejlécet.
3.  **Content-Type**: Beállítja az `application/json` típust a POST/PUT/PATCH kéréseknél.
4.  **Query Paraméterek**: Automatikusan formázza a query paramétereket URL query string-gé.
5.  **Válasz Unwrapping**: Automatikusan kicsomagolja a `{ success, data }` struktúrát.
6.  **Hiba Normalizálás**:
    - Elkapja a HTTP hibákat (4xx, 5xx).
    - Értelmezi a backend hibaüzenetét.
    - Egy szabványos JavaScript `Error` objektumot dob felhasználóbarát üzenettel, amelyet a UI komponensek vagy Toast értesítések elkaphatnak.

## Típusbiztonság

Minden API választ TypeScript interfészek definiálnak a `src/types/api.types.ts` fájlban.

- **Generikusok**: Az `apiGet<T>`, `apiPost<T>` stb. segédfüggvények biztosítják, hogy a visszatérési érték megfeleljen a várt interfésznek.
- **PaginationQuery**: Opcionális interface a pagination paraméterekhez.

```typescript
// Definíció
function apiGet<T>(path: string, query?: Record<string, any>): Promise<T> { ... }

// Használat
api.students.get(id) // Promise<StudentProfile> típusú választ ad

// Pagination paraméterekkel
api.positions.list({ limit: 100 }) // Promise<Position[]> típusú választ ad
```

## Új Végpontok Hozzáadása

Új API végpont hozzáadásának lépései:

1.  Definiálja a válasz és a payload típusokat a `src/types/api.types.ts` fájlban.
2.  Adja hozzá az útvonal konstansát a `PATHS` objektumhoz a `src/lib/api.ts`-ben (opcionális, de ajánlott a "magic strings" elkerülése végett).
3.  Adjon hozzá egy új metódust az `api` objektumhoz a `src/lib/api.ts` fájlban, a megfelelő segédfüggvény (`apiGet`, `apiPost`, stb.) használatával.
4.  Ha a végpont támogatja a pagination-t, adja hozzá a `PaginationQuery` paramétert.

**Példa:**

```typescript
// 1. Típus definíció (api.types.ts)
export interface NewsItem {
  id: number;
  title: string;
  content: string;
}

// 2. & 3. Végpont hozzáadása (api.ts)
export const api = {
  // ... más végpontok
  news: {
    list: (params?: PaginationQuery) => apiGet<NewsItem[]>(PATHS.news, params),
    get: (id: string) => apiGet<NewsItem>(`${PATHS.news}/${id}`),
    create: (data: Partial<NewsItem>) => apiPost<NewsItem>(PATHS.news, data),
  },
};
```
