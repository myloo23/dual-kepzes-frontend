/**
 * Application route constants
 */

// ============= Public Routes =============
export const PUBLIC_ROUTES = {
    HOME: '/',
    POSITIONS: '/positions',
    COMPANY_PROFILE: (id: string | number) => `/companies/${id}`,
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
} as const;

// ============= Admin Routes =============
export const ADMIN_ROUTES = {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    COMPANIES: '/admin/companies',
    POSITIONS: '/admin/positions',
    NEWS: '/admin/news',
    TAGS: '/admin/tags',
    SETTINGS: '/admin/settings',
} as const;

// ============= Student Routes =============
export const STUDENT_ROUTES = {
    DASHBOARD: '/student',
    PROFILE: '/student/profile',
    APPLICATIONS: '/student/applications',
    NEWS: '/student/news',
} as const;

// ============= HR/Company Routes =============
export const HR_ROUTES = {
    DASHBOARD: '/hr',
    PROFILE: '/hr/profile',
    POSITIONS: '/hr/positions',
    APPLICATIONS: '/hr/applications',
} as const;

// ============= Teacher Routes =============
export const TEACHER_ROUTES = {
    DASHBOARD: '/teacher',
} as const;

// ============= Mentor Routes =============
export const MENTOR_ROUTES = {
    DASHBOARD: '/mentor',
} as const;

// ============= All Routes Combined =============
export const ROUTES = {
    ...PUBLIC_ROUTES,
    ADMIN: ADMIN_ROUTES,
    STUDENT: STUDENT_ROUTES,
    HR: HR_ROUTES,
    TEACHER: TEACHER_ROUTES,
    MENTOR: MENTOR_ROUTES,
} as const;
