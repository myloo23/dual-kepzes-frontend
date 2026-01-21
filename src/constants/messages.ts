/**
 * User-facing messages (errors, success, labels)
 * Centralized for easy i18n implementation in the future
 */

// ============= Error Messages =============
export const ERROR_MESSAGES = {
    // Generic
    GENERIC: 'Hiba történt. Kérjük, próbáld újra később.',
    NETWORK: 'Hálózati hiba. Ellenőrizd az internetkapcsolatot.',
    UNAUTHORIZED: 'Nincs jogosultságod ehhez a művelethez.',
    NOT_FOUND: 'A keresett elem nem található.',

    // Data fetching
    FETCH_FAILED: 'Az adatok betöltése sikertelen volt.',
    FETCH_USERS: 'Hiba a felhasználók lekérésénél.',
    FETCH_COMPANIES: 'Hiba a cégek lekérésénél.',
    FETCH_POSITIONS: 'Hiba a pozíciók lekérésénél.',
    FETCH_NEWS: 'Hiba a hírek lekérésénél.',
    FETCH_APPLICATIONS: 'Hiba a jelentkezések lekérésénél.',

    // CRUD operations
    CREATE_FAILED: 'Létrehozás sikertelen.',
    UPDATE_FAILED: 'Frissítés sikertelen.',
    DELETE_FAILED: 'Törlés sikertelen.',

    // Validation
    REQUIRED_FIELD: 'Ez a mező kötelező.',
    INVALID_EMAIL: 'Érvénytelen email cím.',
    INVALID_PHONE: 'Érvénytelen telefonszám.',
    INVALID_DATE: 'Érvénytelen dátum.',
    MISSING_ID: 'Hiányzó azonosító.',

    // Auth
    LOGIN_FAILED: 'Bejelentkezés sikertelen. Ellenőrizd az email címet és a jelszót.',
    REGISTER_FAILED: 'Regisztráció sikertelen.',
    SESSION_EXPIRED: 'A munkamenet lejárt. Kérjük, jelentkezz be újra.',

    // Specific
    NO_COMPANY_DATA: 'Nincs elérhető céginformáció.',
    COMPANY_NOT_FOUND: 'Nem található a cég profilja.',
    POSITION_NOT_FOUND: 'Nem található a pozíció.',
    USER_NOT_FOUND: 'Nem található a felhasználó.',
    SEARCH_NOT_SUPPORTED: 'Keresés ebben a kategóriában nem támogatott ID alapján.',
    INACTIVE_USER_DELETE: 'Inaktív felhasználók végleges törlése funkció még nincs implementálva.',
    INACTIVE_USER_EDIT: 'Inaktív felhasználó szerkesztése nem támogatott.',
} as const;

// ============= Success Messages =============
export const SUCCESS_MESSAGES = {
    // Generic
    SAVED: 'Sikeresen mentve.',
    CREATED: 'Sikeresen létrehozva.',
    UPDATED: 'Sikeresen frissítve.',
    DELETED: 'Sikeresen törölve.',

    // Specific
    USER_CREATED: 'Felhasználó létrehozva.',
    USER_UPDATED: 'Felhasználó frissítve.',
    USER_DELETED: 'Felhasználó törölve.',
    USER_REACTIVATED: 'Felhasználó újraaktiválva.',

    COMPANY_CREATED: 'Cég létrehozva.',
    COMPANY_UPDATED: 'Cég frissítve.',
    COMPANY_DELETED: 'Cég törölve.',

    POSITION_CREATED: 'Pozíció létrehozva.',
    POSITION_UPDATED: 'Pozíció frissítve.',
    POSITION_DELETED: 'Pozíció törölve.',
    POSITION_DEACTIVATED: 'Pozíció deaktiválva.',

    NEWS_CREATED: 'Hír létrehozva.',
    NEWS_UPDATED: 'Hír frissítve.',
    NEWS_DELETED: 'Hír törölve.',
    NEWS_ARCHIVED: 'Hír archiválva.',
    NEWS_UNARCHIVED: 'Hír visszaállítva.',

    APPLICATION_SUBMITTED: 'Sikeres jelentkezés! Hamarosan értesítünk a válaszról.',

    STUDENT_UPDATED: 'Hallgató frissítve.',
    DATA_SAVED: 'Adatok mentve.',
    ITEM_LOADED: 'Találat betöltve.',
} as const;

// ============= Confirmation Messages =============
export const CONFIRM_MESSAGES = {
    DELETE_USER: 'Biztos törlöd/deaktiválod ezt a felhasználót?',
    DELETE_COMPANY: 'Biztos törlöd ezt a céget?',
    DELETE_POSITION: 'Biztos törlöd ezt a pozíciót?',
    DELETE_NEWS: 'Biztos törlöd ezt a hírt?',
    DEACTIVATE_POSITION: 'Biztos deaktiválod ezt a pozíciót?',
    ARCHIVE_NEWS: 'Biztos archiválod ezt a hírt?',
} as const;

// ============= UI Labels =============
export const LABELS = {
    // Common actions
    CREATE: 'Létrehozás',
    EDIT: 'Szerkesztés',
    DELETE: 'Törlés',
    SAVE: 'Mentés',
    CANCEL: 'Mégse',
    CLOSE: 'Bezárás',
    SEARCH: 'Keresés',
    FILTER: 'Szűrés',
    SORT: 'Rendezés',
    REFRESH: 'Frissítés',
    RESET: 'Visszaállítás',
    APPLY: 'Alkalmazás',
    SUBMIT: 'Beküldés',
    ACTIVATE: 'Aktiválás',
    DEACTIVATE: 'Deaktiválás',
    ARCHIVE: 'Archiválás',

    // Entities
    USER: 'Felhasználó',
    USERS: 'Felhasználók',
    STUDENT: 'Hallgató',
    STUDENTS: 'Hallgatók',
    COMPANY: 'Cég',
    COMPANIES: 'Cégek',
    POSITION: 'Pozíció',
    POSITIONS: 'Pozíciók',
    APPLICATION: 'Jelentkezés',
    APPLICATIONS: 'Jelentkezések',
    NEWS: 'Hír',
    NEWS_PLURAL: 'Hírek',

    // States
    LOADING: 'Betöltés…',
    NO_DATA: 'Nincs adat.',
    NO_RESULTS: 'Nincs a szűrési feltételeknek megfelelő pozíció.',
    EMPTY_CATEGORY: 'Nincs adat ebben a kategóriában.',

    // Placeholders
    SEARCH_BY_ID: 'Keresés ID alapján...',
    SEARCH_COMPANY_BY_ID: 'Cég keresése ID alapján...',
    SEARCH_USER_BY_ID: 'Keresés ID alapján...',
} as const;

// ============= Page Titles =============
export const PAGE_TITLES = {
    ADMIN_DASHBOARD: 'Admin Irányítópult',
    ADMIN_USERS: 'Felhasználók kezelése',
    ADMIN_COMPANIES: 'Cégek',
    ADMIN_POSITIONS: 'Pozíciók',
    ADMIN_NEWS: 'Hírek',
    ADMIN_SETTINGS: 'Beállítások',

    STUDENT_DASHBOARD: 'Hallgatói Irányítópult',
    STUDENT_NEWS: 'Hírek',

    POSITIONS: 'Elérhető állások',
    COMPANY_PROFILE: 'Cég profilja',
} as const;

// ============= Page Descriptions =============
export const PAGE_DESCRIPTIONS = {
    ADMIN_USERS: 'Különböző szerepkörű felhasználók listázása és szerkesztése.',
    ADMIN_COMPANIES: 'Összes cég, cég létrehozás / módosítás / törlés.',
    ADMIN_POSITIONS: 'Összes pozíció kezelése.',
    POSITIONS: 'A jelenleg elérhető pozíciók a backendből töltődnek be.',
} as const;
