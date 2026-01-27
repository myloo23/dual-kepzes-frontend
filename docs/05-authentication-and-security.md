# Hitelesítés és Biztonság

## Áttekintés

A hitelesítés **JWT (JSON Web Token)** alapú. A backend sikeres bejelentkezéskor kiállít egy tokent, amelyet a frontend eltárol és a későbbi kérések hitelesítésére használ fel.

## Hitelesítési Folyamat

1.  **Bejelentkezés**: A felhasználó megadja az adatait a `/login` oldalon.
2.  **Kérés**: Meghívódik az `api.auth.login(email, password)` függvény.
3.  **Válasz**: A backend ellenőrzi az adatokat és visszaküld egy JWT-t.
4.  **Tárolás**: Az `AuthContext` (vagy `api.ts` segédprogram) elmenti ezt a tokent a `localStorage`-ba az `auth_token` kulcs alatt.
5.  **Állapot Frissítés**: Az `AuthContext` frissíti a `user` állapotot, ami kiváltja a UI frissítését és átirányítja a felhasználót a vezérlőpultra (dashboard).

## Szerepkör-Alapú Hozzáférés-Vezérlés (RBAC)

Az alkalmazás különbséget tesz több felhasználói szerepkör között. Ez két szinten valósul meg:

### 1. Routing Szint (Kliens-oldal)

A React Router layout őrökkel (guards) védi az érzékeny útvonalakat. Például az `AdminLayout` valószínűleg ellenőrzi, hogy `user.role === 'admin'`. Ha nem, átirányítja a felhasználót a bejelentkezési oldalra vagy egy "hozzáférés megtagadva" oldalra.

| Szerepkör                   | Hozzáférési Jogosultság                                                                |
| --------------------------- | -------------------------------------------------------------------------------------- |
| **Hallgató (Student)**      | Jelentkezhet állásokra, megtekintheti saját jelentkezéseit, szerkesztheti a profilját. |
| **HR / Vállalati Admin**    | Kezelheti a vállalati profilt, állásokat hirdethet, értékelheti a jelentkezőket.       |
| **Mentor**                  | Megtekintheti a hozzá rendelt hallgatókat, naplózhatja a haladást.                     |
| **Tanár / Egyetem**         | Felügyeletet gyakorol az összes partnerség és statisztika felett.                      |
| **Rendszer Adminisztrátor** | Teljes hozzáférés a felhasználókhoz, hírekhez és globális beállításokhoz.              |

### 2. API Szint (Szerver-oldal)

A frontend UI elemek elrejtése önmagában nem teszi biztonságossá az alkalmazást. A backend minden kérésnél validálja a JWT-t annak biztosítására, hogy a felhasználónak valóban van jogosultsága a művelet végrehajtására.

## Token Perzisztencia

- **LocalStorage**: Jelenleg a `localStorage`-ot használjuk a tárolásra.
  - _Előnyök_: Könnyen implementálható, perzisztens a fülek/böngésző újraindítása között.
  - _Hátrányok_: Sérülékeny XSS (Cross-Site Scripting) támadásokkal szemben, ha az alkalmazásban biztonsági rések vannak.
- _Jövőbeli Fejlesztés_: Megfontolandó az áttérés `HttpOnly` sütikre a jobb XSS elleni védelem érdekében.

## Kijelentkezés

A kijelentkezés törli a tokent a tárhelyről és visszaállítja az `AuthContext` állapotot, azonnal átirányítva a felhasználót a publikus kezdőlapra.
