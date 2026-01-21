/**
 * UI-related constants (colors, sizes, etc.)
 */

// ============= Table Configuration =============
export const TABLE_CONFIG = {
    MAX_HEIGHT: 600, // pixels
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    ID_DISPLAY_LENGTH: 8, // Show first 8 characters of ID
} as const;

// ============= Chip Display Limits =============
export const CHIP_DISPLAY_LIMITS = {
    MAX_CITIES: 10,
    MAX_COMPANIES: 10,
    MAX_TAGS: 20,
} as const;

// ============= Date/Time Formats =============
export const DATE_FORMATS = {
    HUNGARIAN: 'yyyy.MM.dd.',
    ISO: 'yyyy-MM-dd',
    DATETIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

// ============= Validation Limits =============
export const VALIDATION_LIMITS = {
    STUDENT_NOTE_MAX_LENGTH: 500,
    COMPANY_NOTE_MAX_LENGTH: 500,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 5000,
} as const;

// ============= Geolocation Configuration =============
export const GEOLOCATION_CONFIG = {
    ENABLE_HIGH_ACCURACY: true,
    TIMEOUT: 10000, // 10 seconds
    MAXIMUM_AGE: 0,
} as const;

// ============= Map Configuration =============
export const MAP_CONFIG = {
    DEFAULT_ZOOM: 12,
    DEFAULT_CENTER: {
        lat: 47.4979, // Budapest
        lng: 19.0402,
    },
} as const;

// ============= Animation Durations =============
export const ANIMATION_DURATIONS = {
    TOAST: 5000, // 5 seconds
    MODAL_TRANSITION: 300, // 300ms
    FADE: 200, // 200ms
} as const;

// ============= Breakpoints (matching Tailwind) =============
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
} as const;
