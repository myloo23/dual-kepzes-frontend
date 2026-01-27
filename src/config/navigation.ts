export const ROLE_NAVIGATION_PATHS = {
  STUDENT: {
    news: "/student/news",
    dashboard: "/student",
  },
  ADMIN: {
    news: "/admin/news",
    dashboard: "/admin",
  },
  SYSTEM_ADMIN: {
    news: "/admin/news",
    dashboard: "/admin",
  },
  SUPER_ADMIN: {
    news: "/admin/news",
    dashboard: "/admin",
  },
  TEACHER: {
    news: "/teacher/news", // Placeholder based on logic
    dashboard: "/teacher",
  },
  UNIVERSITY_USER: {
    news: "/university/news",
    dashboard: "/university",
  },
  MENTOR: {
    news: "/mentor/news", // Placeholder based on logic
    dashboard: "/mentor",
  },
  HR: {
    news: "/hr/news", // Placeholder based on logic
    dashboard: "/hr",
  },
  COMPANY_ADMIN: {
    news: "/hr/news", // Placeholder based on logic
    dashboard: "/hr",
  },
} as const;

export type UserRole = keyof typeof ROLE_NAVIGATION_PATHS;
