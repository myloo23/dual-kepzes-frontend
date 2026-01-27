/**
 * Validation utility functions for forms
 */

export function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizeNeptun(code: string) {
    return code.trim().toUpperCase();
}

export function validateNeptunOptional(code: string) {
    const c = normalizeNeptun(code);
    if (!c) return null; // üres => ok
    if (!/^[A-Z0-9]{6}$/.test(c)) return "A Neptun kód pontosan 6 karakter (A–Z, 0–9).";
    return null;
}

export function validatePassword(password: string, minLength: number = 12) {
    if (password.length < minLength) {
        return `A jelszó legyen legalább ${minLength} karakter.`;
    }
    return null;
}

export function validateRequired(value: string, fieldName: string) {
    if (!value.trim()) {
        return `${fieldName} megadása kötelező.`;
    }
    return null;
}

export function validateYear(year: number | "", fieldName: string = "Év") {
    if (year === "") return `${fieldName} megadása kötelező.`;
    if (typeof year === "number" && (year < 1950 || year > 2100)) {
        return `${fieldName} nem tűnik helyesnek.`;
    }
    return null;
}
