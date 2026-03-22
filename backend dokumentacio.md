Duális Képzés Backend API
Ez a repository a Duális Képzés rendszer backend szolgáltatását tartalmazza. Az alkalmazás célja a hallgatók, cégek, egyetemi szereplők és a duális képzés adminisztrációjának támogatása egy robusztus, biztonságos és skálázható REST API-n keresztül.

Technológia Stack
A projekt modern, iparági sztenderd technológiákra épül:

Runtime: Node.js (v18+) - Skálázható, eseményvezérelt futtatókörnyezet a szerveroldali logika végrehajtásához.
Nyelv: TypeScript (v5.0+) - Szigorú típusbiztonság a teljes vertikumban (Service-tők a Controller-ekig), minimalizálva a runtime hibákat.
Keretrendszer: Express - Minimalista webes keretrendszer a REST API végpontok és a HTTP kérések hatékony kezelésére.
Adatbázis: PostgreSQL - Megbízható, nyílt forráskódú relációs adatbázis-kezelő a strukturált adatok tárolására.
ORM: Prisma - Modern adatbázis-hozzáférési réteg, amely egyszerűsíti az adatmodellezést és típusbiztos lekérdezéseket biztosít.
Validáció: Zod - TypeScript-first séma validáció, amely garantálja a bejövő adatok integritását és automatikus típus-inferenciát biztosít a backend rétegek számára.
Autentikáció: JSON Web Token (JWT) + Bcrypt - Biztonságos token alapú azonosítás és jelszóhashelés a felhasználói fiókok védelmére.
Háttérfolyamatok: BullMQ (Redis alapú queue) - Nagy teljesítményű üzenetsor-kezelő az aszinkron feladatok és háttérműveletek megbízható végrehajtásához.
Email: Nodemailer (SMTP) - Moduláris email küldő szolgáltatás a rendszerüzenetek és értesítések kézbesítésére.
Tesztelés: Jest & Supertest - Unit és integrációs tesztek a megbízhatóság érdekében.
Dokumentáció: Swagger/OpenAPI - Interaktív API dokumentáció és végpont tesztelési felület.
Előfeltételek
A fejlesztői környezet futtatásához szükséges szoftverek:

Node.js: Legalább v18.x verzió.
npm: Csomagkezelő (általában a Node.js része).
PostgreSQL: Helyi adatbázis szerver vagy Docker konténer.
Redis: Opcionális, de ajánlott a háttérfolyamatokhoz (BullMQ).
Telepítés és Indítás
Repository klónozása

git clone https://github.com/DrozsdikAdam/dual-kepzes-backend.git
cd dual-kepzes-backend
Függőségek telepítése

npm install
Környezeti változók beállítása Másold a példa konfigurációt (vagy hozd létre manuálisan) egy .env fájlba a gyökérkönyvtárban:

# Szerver

PORT=3000
NODE_ENV="development"

# Adatbázis

DATABASE_URL="postgresql://user:password@localhost:5432/dual_db?schema=public"

# Ha szükséges (pl. Supabase): DIRECT_URL="..."

# Biztonság

JWT_SECRET="szuper_titkos_kulcs_min_32_karakter"

# Frontend URL (jelszó visszaállító linkhez)

FRONTEND_URL="http://localhost:3000"

# Email (Mailtrap példa)

MAILTRAP_USER="your_user"
MAILTRAP_PASS="your_pass"

# Redis (Opcionális, BullMQ-hoz)

REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_ENABLED="false" # Állítsd true-ra a háttérfolyamatok engedélyezéséhez
Adatbázis szinkronizáció Hozd létre a táblákat a Prisma séma alapján:

npm run prisma:push
Szerver indítása (Fejlesztői mód)

npm run dev
A szerver elindul a http://localhost:3000 címen.

Elérhető Szkriptek
A package.json-ben definiált főbb parancsok:

Parancs Leírás
npm run dev Fejlesztői szerver indítása watch módban (nodemon + tsx).
npm start A lefordított (dist) kód futtatása éles környezetben.
npm run build TypeScript kód fordítása JavaScriptre a dist mappába.
npm run prisma:push Adatbázis séma szinkronizálása a schema.prisma alapján (fejlesztéshez).
npm run prisma:format Prisma fájlok formázása.
npm run prisma:studio Adatbázis GUI megnyitása a böngészőben.
npm run test Unit és integrációs tesztek futtatása.
npm run lint Kódminőség ellenőrzése (ESLint v9).
npm run format Kód automatikus formázása (Prettier).
npx prisma db seed Adatbázis feltöltése tesztadatokkal (prisma/seed.ts).
Projekt Struktúra
src/
├── config/ # App konfigurációk (DB, Redis, Email)
├── controllers/ # Üzleti logika (Request/Response kezelés)
├── middlewares/ # Express middleware-ek (Auth, Validáció, RateLimit)
├── routes/ # API végpontok definíciói
├── schemas/ # Zod validációs definíciók
├── services/ # Komplex üzleti logika (opcionális réteg - Auth, Anonymize, stb.)
├── utils/ # Segédfüggvények (Logger, Token, Mapper)
└── app.ts # Express App inicializálás
prisma/
├── schema.prisma # Adatbázis modellek
└── seed.ts # Kezdeti adatfeltöltő szkript
Minden végpont a /api prefix alatt érhető el. A legtöbb végponthoz érvényes Authorization: Bearer <token> fejléc szükséges.

API Dokumentáció
Az összes API végpont teljes dokumentációja interaktív Swagger felületen keresztül érhető el:

Helyi fejlesztés: http://localhost:3000/api-docs
Production: https://dual-kepzes-backend-production-7c45.up.railway.app/api-docs

A Swagger UI lehetőséget ad:

Végpontok részletes leírásának megtekintésére
Sémák és válaszok vizuális megjelenítésére
Interaktív tesztelésre (Try it out!)
Autentikációs token használatára
Lapozás (Pagination)
A listázó végpontok egységes válaszstruktúrát és lekérdezési paramétereket használnak. Részleteket az API_PAGINATION.md fájlban találsz.

Szerepkörök és Jogosultságok
Szerepkör Leírás Főbb jogosultságok
STUDENT Hallgató Saját profil, jelentkezések, partnerségek megtekintése, egyetemi profilra váltás.
MENTOR Céges munkavállaló/Mentor Cég pozíciói, jelentkezések megtekintése, mentor funkciók.
COMPANY_ADMIN Cégadmin Teljes cégkezelés, jelentkezések értékelése, pozíciók és munkavállalók kezelése. (Regisztráció után rendszeradminisztrátori jóváhagyásra vár).
UNIVERSITY_USER Egyetemi kapcsolattartó Partnerségek jóváhagyása, hallgatók felügyelete.
SYSTEM_ADMIN Rendszergazda Teljes rendszer adminisztráció, minden entitás kezelése. (Email policy: Csak biztonsági emaileket kap).
Adatbázis Séma Áttekintés
A rendszer fő entitásai és kapcsolataik:

Részletes sémát lásd: prisma/schema.prisma vagy Prisma Studio (npm run prisma:studio)

Rendszer Architektúra
A backend alkalmazás rétegelt architektúrát követ:

Request Processing Flow
Egy tipikus API kérés feldolgozásának menete:

Autentikációs Flow
JWT token alapú autentikáció működése:

Partnership Status Flow
A duális partnerség életciklusa (státusz átmenetek):

Application Status Flow
A jelentkezés folyamata és lehetséges állapotai:

Application to Partnership Process
A jelentkezéstől a partnerségig vezető üzleti folyamat:

GDPR-Kompatibilis Fájlfeltöltési Folyamat
A CV és motivációs levél feltöltése pass-through módon működik - a fájlok nem kerülnek tárolásra a szerveren:

GDPR megfelelőség: A fájlok csak a memóriában (RAM) tárolódnak a feldolgozás idejére. Az email küldés után a JavaScript garbage collection automatikusan törli a buffer-eket. Semmilyen fájl nem kerül lemezre vagy adatbázisba.

Optimalizált Képfeltöltési és Galéria Folyamat
A rendszer két független képgalériát biztosít: Rendszerszintű "Albumokat" a fő adminisztrátornak, és dedikált Céges galériákat a partnereknek. Mivel ezek a képek minden felhasználó (publikum) számára letölthetővé válnak a frontendről, a feltöltés egy szigorú és teljesítmény-optimalizált (memória -> libvips C++ -> lemez) folyamaton megy keresztül a sharp és multer könyvtárak alkalmazásával.

Miért így csináljuk? Mi történik és miért? Ezzel a folyamattal biztosítjuk, hogy az esetenként hatalmas méretű és felbontású (akár 10 MB-os) fájlok letisztított és web-barát tömörítésű (.webp) képekké legyenek konvertálva még a fizikai lementés előtt (kb. 100-300KB-os méretűre). Ez drasztikusan lecsökkenti a szerveren szükséges tárhelyigényt (A Render környezetében különösen spórolva a szűkös Storage hellyel), meggátolja a képekkel hordozható esetleges memóriavírusok lemezre kerülését, és biztosítja, hogy a böngészők a lehető leggyorsabban betöltsék a képeket, jelentős mobiladat-forgalmat is megtakarítva a végfelhasználóknak.

Deployment Architecture
Éles környezet (Railway) architektúrája:

Hibakezelés
Hibakódok
HTTP Státusz Hibakód Leírás
400 INVALID_INPUT Hibás bemeneti adatok (validációs hiba)
400 BAD_REQUEST Érvénytelen kérés (pl. hibás JSON formátum)
401 UNAUTHORIZED Hiányzó vagy érvénytelen token
403 FORBIDDEN Nincs jogosultság a művelethez (pl. CORS hiba)
404 NOT_FOUND A keresett erőforrás nem található
409 CONFLICT Ütköző művelet (pl. duplikált email)
500 INTERNAL_ERROR Belső szerverhiba
Hibák formátuma
{
"success": false,
"message": "Hiba rövid leírása",
"error": {
"code": "INVALID_INPUT",
"message": "Részletes hibaüzenet",
"details": { /_ Opcionális részletek _/ }
}
}
Biztonsági Funkciók
A rendszer robusztus, több rétegű biztonsági architektúrát alkalmaz:

1. Role-Based Access Control (RBAC)
   Minden API végpont szerepkör-alapú hozzáférés-vezérléssel van ellátva. A requireRole middleware és az előre definiált helper-ek (isStudent, isCompanyAdmin, isCompanyEmployee, isMentor, isUniversityUser, isUniversityStaff, isSystemAdmin, isStaff) biztosítják, hogy csak a megfelelő jogosultsággal rendelkező felhasználók férhessenek hozzá az adott végpontokhoz.

2. Szerveroldali Validáció (Zod)
   Minden bejövő kérés szigorú séma-alapú validáción esik át. A kliens által küldött felesleges vagy tiltott mezők automatikusan eltávolításra kerülnek.

3. Magic Bytes Fájlvalidáció
   A fájlfeltöltéseknél nem bízunk a kliens által küldött MIME típusban. A rendszer elemezni tudja a fájlok tényleges tartalmát (magic bytes), megelőzve ezzel a rosszindulatú fájlok feltöltését.

4. Ownership Middleware
   Általános jogosultságkezelő réteg, amely biztosítja, hogy a felhasználók csak a saját erőforrásaikat (jelentkezések, profilok, értesítések stb.) módosíthassák vagy törölhessék.

5. Idempotency Kulcsok
   A kritikus műveletek (pl. jelentkezés leadása, pozíció létrehozása) védve vannak a véletlen dupla beküldés ellen. A kliens egy egyedi kulcsot küldhet, amellyel a szerver azonosítani tudja az ismételt kéréseket.

6. Audit és Biztonsági Naplózás
   Minden kritikus esemény és jogosultsági hiba (401, 403) automatikusan naplózásra kerül az adatbázisba, lehetővé téve a biztonsági auditokat és a rendellenes viselkedés észlelését.

7. Anonimizáló Szolgáltatás (GDPR)
   A rendszer rendelkezik egy központosított AnonymizeService-szel, amely lehetővé teszi a hallgatók, cégek és munkavállalók adatainak végleges anonimizálását. A funkció törli a PII adatokat, miközben az adatbázis integritását (pl. egyedi email kényszer) placeholder értékekkel tartja fenn.

Quick Start - API Használat

1. Regisztráció és bejelentkezés

# Regisztráció (Hallgató, Mentor, Egyetemi felhasználó)

curl -X POST http://localhost:3000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{
"email": "hallgato@pelda.hu",
"password": "Jelszo123!",
"fullName": "Teszt Hallgató",
"role": "STUDENT"
}'

# Regisztráció (Cégadmin)

curl -X POST http://localhost:3000/api/auth/register/company-admin \
 -H "Content-Type: application/json" \
 -d '{
"email": "admin@ceg.hu",
"password": "Jelszo123!",
"fullName": "Cégvezető Elek",
"companyId": "uuid-a-ceghez",
"jobTitle": "Ügyvezető"
}'

# Email megerősítés (A kapott tokennel)

curl -X POST http://localhost:3000/api/auth/verify-email \
 -H "Content-Type: application/json" \
 -d '{
"token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
}'

# Bejelentkezés

curl -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "hallgato@pelda.hu",
"password": "Jelszo123!"
}' 2. Védett végpont hívása

# Saját profil lekérése (helyettesítsd be a kapott tokent)

curl http://localhost:3000/api/students/me \
 -H "Authorization: Bearer <your_token_here>"
Tipp: A teljes API végpontokat és sémákat a Swagger UI-n keresztül is kipróbálhatod!

API Végpontok Referencia
Autentikáció (/api/auth)
Metódus Végpont Leírás
POST /register Új felhasználó regisztrációja (STUDENT, MENTOR, UNIVERSITY_USER).
POST /register/company-admin Dedikált regisztráció cégadminisztrátoroknak.
POST /register/system-admin Dedikált regisztráció rendszeradminisztrátoroknak.
POST /login Bejelentkezés és JWT token igénylése.
POST /verify-email Email cím megerősítése tokennel.
POST /resend-verification Megerősítő email újraküldése.
POST /request-password-reset Jelszó visszaállítás kérése email címmel.
POST /reset-password Új jelszó beállítása tokennel.
Hallgatók (/api/students)
Metódus Végpont Leírás Jogosultság
GET / Összes hallgató listázása. UniversityStaff
GET /available Munkakeresésre jelentkezett hallgatók listázása (Publikus adatokkal). Staff
GET /me Saját hallgatói profil lekérése. Student
PATCH /me Saját profil frissítése. Student
PATCH /me/university-transition Átváltás középiskolai profilról egyetemire (Neptun kód, Szak). Student
PATCH /me/toggle-availability Munkakeresési elérhetőség ki-/bekapcsolása (isAvailableForWork toggle). Student
POST /:id/interest Érdeklődés kifejezése egy hallgató iránt (Értesítést küld). Staff
DELETE /me Saját profil törlése. Student
GET /:id Hallgató lekérése ID alapján. Staff
PATCH /:id Hallgató módosítása (Admin). SystemAdmin
DELETE /:id Hallgató törlése (Soft delete). SystemAdmin
Cégek (/api/companies)
A cégek kezelése, beleértve a státuszkezelést és a munkavállalókat.

Metódus Végpont Leírás Jogosultság
GET / Aktív cégek listázása. Auth
POST / Új cég létrehozása. SystemAdmin
POST /with-admin Új cég és hozzá tartozó cégadmin létrehozása egy lépésben. Publikus
GET /inactive Inaktív (jóváhagyott, de deaktivált) cégek listázása. SystemAdmin
GET /pending Jóváhagyásra váró cégek listázása. SystemAdmin
GET /own-application Saját jelentkezési felülettel rendelkező cégek listázása. Auth
GET /:id Cég részletei. Auth
PATCH /:id Cég adatainak frissítése. CompanyAdmin / SystemAdmin
DELETE /:id Cég törlése (Soft delete). SystemAdmin
PATCH /:id/reactivate Cég újraaktiválása. SystemAdmin
PATCH /:id/deactivate Cég inaktiválása. SystemAdmin
PATCH /:id/approve Cég regisztrációjának jóváhagyása. SystemAdmin
PATCH /:id/reject Cég regisztrációjának elutasítása. SystemAdmin
Állások / Pozíciók (/api/jobs/positions)
Metódus Végpont Leírás Jogosultság
GET / Aktív pozíciók listázása. (Opcionális: ?isDual=true vagy false) Publikus
GET /dual Kizárólag duális pozíciók listázása. Publikus
GET /non-dual Kizárólag nem duális pozíciók listázása. Publikus
POST / Új pozíció létrehozása. CompanyAdmin
GET /:id Pozíció részletei. Publikus
PATCH /:id Pozíció frissítése. CompanyEmployee + Owner
DELETE /:id Pozíció törlése. CompanyEmployee + Owner
PATCH /:id/deactivate Pozíció inaktiválása. CompanyEmployee + Owner
GET /company/:companyId Egy adott cég pozíciói. Publikus
Jelentkezések (/api/applications)
Metódus Végpont Leírás Jogosultság
POST / Jelentkezés leadása. Student
GET / Saját jelentkezések megtekintése. Student
PATCH /:id/retract Jelentkezés visszavonása. Student
GET /company Céghez érkezett jelentkezések. Company
PATCH /company/:id/evaluate Jelentkezés értékelése. (ACCEPTED esetén automatikusan létrejön a partnerség). Company
PATCH /company/:id Értékelés módosítása. Company
GET /admin Összes jelentkezés (Admin nézet). Admin
GET /admin/:id Jelentkezés részletei. Admin
PATCH /admin/:id Jelentkezés módosítása. Admin
POST /submit-with-files [ÚJ] Jelentkezés CV és motivációs levél fájlok feltöltésével. GDPR-kompatibilis: a fájlok nem kerülnek tárolásra, csak emailben továbbítódnak a céges adminoknak. Student
Tananyagok (/api/materials)
Metódus Végpont Leírás Jogosultság
POST /complete Tananyag elvégzésének és értékelésének rögzítése. Student
GET /progress Saját előrehaladás (elvégzett anyagok) lekérése. Student
GET /statistics Összesített statisztika a tananyagokról. Admin/Mentor
Hírek (/api/news)
Metódus Végpont Leírás Jogosultság
GET / Hírek listázása (hallgatóknak/felhasználóknak). Szerepkör alapú szűréssel. Auth
GET /:id Hír részletei. Auth
POST /admin Hír létrehozása. Megcélozható vele mindenki (ALL) vagy konkrét szerepkörök. SystemAdmin
GET /admin Hírek kezelése (Admin lista). SystemAdmin
GET /admin/archived Archivált hírek. SystemAdmin
PATCH /admin/:id Hír szerkesztése. SystemAdmin
PATCH /admin/:id/archive Hír archiválása. SystemAdmin
PATCH /admin/:id/unarchive Hír visszaállítása. SystemAdmin
DELETE /admin/:id Hír végleges törlése vagy soft delete. SystemAdmin
Rendszerszintű Galéria (/api/galleries)
Metódus Végpont Leírás Jogosultság
GET / Nyilvános képcsoportok (albumok) és bennük lévő képeik lekérése. Publikus
POST / Új üres képcsoport létrehozása (pl. "Rendezvény 2026"). SystemAdmin
POST /:groupId/images Kép feltöltése és optimalizálása (sharp) egy létező csoportba. SystemAdmin
DELETE /:groupId Egész képcsoport és a benne lévő képek törlése a szerverről. SystemAdmin
DELETE /images/:imageId Egyedi kép törlése egy csoportból (fizikailag is törlődik). SystemAdmin
Céges Képek (/api/companies/:companyId/images)
A cégek saját bemutató képeinek (iroda, csapat) kezelésére. Végpontok a Company routerbe vannak beágyazva felülről.

Metódus Végpont Leírás Jogosultság
GET / Egy konkrét cég összes regisztrált képének lekérése. Publikus
POST / Új kép feltöltése és automatikus formátum optimalizálása. CompanyAdmin
DELETE /:imageId Kép törlése a cég galériájából. CompanyAdmin
Értesítések (/api/notifications)
Metódus Végpont Leírás Jogosultság
GET / Olvasatlan/Aktív értesítések. Auth
GET /archived Archivált értesítések. Auth
GET /:id Értesítés részletei. Auth
GET /unread-count Olvasatlan értesítések száma. Auth
POST / Új értesítés létrehozása. SystemAdmin
PUT /read-all Minden megjelölése olvasottként. Auth
PUT /:id/read Egy elem olvasottnak jelölése. Auth
PUT /:id/archive Értesítés archiválása. Auth
PUT /:id/unarchive Értesítés visszaállítása. Auth
DELETE /:id Értesítés törlése. Auth
Statisztika (/api/stats)
Metódus Végpont Leírás Jogosultság
GET / Rendszerszintű statisztikák (felhasználók, cégek, pozíciók, partnerségek). SystemAdmin
GET /applications Jelentkezési statisztikák (státusz szerinti bontás, konverziós arány, átlag/pozíció, elmúlt 30 nap). SystemAdmin
GET /partnerships Partnerségi statisztikák (státusz és félév szerinti bontás, átlagos időtartam). SystemAdmin
GET /positions Pozíció statisztikák (7 napon belül lejáró, jelentkezés nélküli pozíciók). SystemAdmin
GET /trends Időbeli trendek (regisztrációk, jelentkezések, partnerségek az elmúlt 6 hónapban). SystemAdmin
Duális Partnerkapcsolatok (/api/partnerships)
A hallgatók és cégek közötti duális képzési szerződések kezelése. A partnerség automatikusan létrejön PENDING_MENTOR státusszal, amikor a cég elfogad egy jelentkezést (ACCEPTED).

Metódus Végpont Leírás Jogosultság
GET /student Hallgató saját partnerségeinek listázása. Student
GET /company Céghez tartozó partnerségek listázása. CompanyEmployee
GET /university Összes partnerség listázása (Egyetem). UniversityStaff
GET /:id Partnerkapcsolat részletei. Auth
PATCH /:id Partnerkapcsolat adatainak frissítése. UniversityStaff + Owner
PATCH /:id/assign-mentor Mentor hozzárendelése. CompanyAdmin
PATCH /:id/complete Partnerkapcsolat befejezetté tétele (FINISHED). UniversityStaff + Owner
PATCH /:id/assign-university-user Egyetemi felelős hozzárendelése. UniversityStaff
PATCH /:id/terminate Partnerkapcsolat megszakítása (Terminated státusz). UniversityStaff + Owner
DELETE /:id Partnerkapcsolat törlése (Soft delete). SystemAdmin + Owner
Szakok (/api/majors)
A képzési szakok (Major) kezelése. A hallgatói profil szakválasztáshoz kapcsolódik.

Metódus Végpont Leírás Jogosultság
GET / Összes szak listázása. Publikus
GET /:id Szak részletei ID alapján. Publikus
POST / Új szak létrehozása. SystemAdmin
PATCH /:id Szak frissítése. SystemAdmin
DELETE /:id Szak törlése. SystemAdmin
Helyszínek (/api/locations)
Az összes céghez tartozó helyszín listázása, a hozzájuk rendelt pozíciók számával.

Metódus Végpont Leírás Jogosultság
GET / Összes céghelyszín listázása (cím, cég, pozíciók száma). Auth
Cég Adminisztrátorok (/api/company-admins)
A cégek adminisztrátorainak kezelése.

Metódus Végpont Leírás Jogosultság
GET / Összes cégadmin listázása. SystemAdmin
GET /me Saját profil lekérése. CompanyAdmin
PATCH /me Saját profil frissítése. CompanyAdmin
DELETE /me Saját profil törlése. CompanyAdmin
GET /:id Cégadmin lekérése ID alapján. SystemAdmin
PATCH /:id Adatok frissítése. SystemAdmin
DELETE /:id Cégadmin törlése. SystemAdmin
PATCH /restore/:id Törölt cégadmin visszaállítása. SystemAdmin
Munkavállalók (/api/employees)
Céges munkavállalók (pl. mentorok) kezelése.

Metódus Végpont Leírás Jogosultság
GET / Céghez tartozó munkavállalók listázása. CompanyEmployee
GET /mentors Csak a mentorok listázása. CompanyEmployee
GET /me Saját profil lekérése. CompanyEmployee
PATCH /me Saját profil frissítése. CompanyEmployee
DELETE /me Saját profil törlése. CompanyEmployee
GET /me/students Mentorált hallgatók listázása. Mentor
GET /me/students/:id Mentorált hallgató/partnerség részletei. Mentor
GET /:id Munkavállaló lekérése ID alapján. CompanyEmployee
PATCH /:id Munkavállaló frissítése. CompanyAdmin
DELETE /:id Munkavállaló törlése. CompanyAdmin
Egyetemi Felhasználók (/api/university-users)
Egyetemi kapcsolattartók és adminisztrátorok.

Metódus Végpont Leírás Jogosultság
GET / Összes egyetemi felhasználó listázása. UniversityStaff
GET /me Saját profil lekérése. UniversityUser
PATCH /me Saját profil frissítése. UniversityUser
DELETE /me Saját profil törlése. UniversityUser
GET /:id Egyetemi felhasználó lekérése ID alapján. UniversityStaff
PATCH /:id Adatok frissítése. SystemAdmin
DELETE /:id Törlés. SystemAdmin
Rendszer Adminisztrátorok (/api/system-admins)
A platform üzemeltetői. Minden végpont SYSTEM_ADMIN jogosultságot igényel.

Metódus Végpont Leírás Jogosultság
GET / Összes rendszeradmin listázása. SystemAdmin
GET /admin-users Minden admin (Rendszer, Cég, Egyetem) listázása. SystemAdmin
GET /me Saját admin profil lekérése. SystemAdmin
PATCH /me Saját admin profil frissítése. SystemAdmin
DELETE /me Saját admin profil törlése. SystemAdmin
GET /:id Rendszeradmin lekérése ID alapján. SystemAdmin
PATCH /:id Adatok frissítése. SystemAdmin
DELETE /:id Admin törlése. SystemAdmin
Felhasználók (/api/users)
Általános felhasználókezelés (pl. inaktív fiókok). Minden végpont SYSTEM_ADMIN jogosultságot igényel.

Metódus Végpont Leírás Jogosultság
GET /inactive Inaktív felhasználók listázása. SystemAdmin
PATCH /:id/reactivate Felhasználó visszaállítása. SystemAdmin
PATCH /:id/deactivate Felhasználó felfüggesztése. SystemAdmin
Megjegyzés: Ez a dokumentáció a projekt 2026-03-15-i állapotát tükrözi. API változtatások esetén kérjük a dokumentáció frissítését.
