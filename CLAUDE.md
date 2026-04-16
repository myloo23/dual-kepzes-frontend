# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test suite is configured.

## Environment

The only required env variable is:

```
VITE_API_URL=https://dual-kepzes-backend.onrender.com
```

Defaults to `http://localhost:3000` when not set.

## Architecture

**Feature-based structure** under `src/features/`. Each feature (auth, companies, positions, applications, partnerships, students, users, news, notifications, stats, search, guide, gallery, majors) has its own `components/`, `hooks/`, `types.ts`, and an `index.ts` barrel export.

**API layer** (`src/lib/api-client.ts`) — thin wrappers around `fetch`: `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, `apiPostFormData`. All send a JWT `Authorization: Bearer` header read from `localStorage`. Responses in `{ success: true, data: T }` format are auto-unwrapped to `T`.

**Backend information** You can always read backendreadme.md for help about the backend structure.

**Auth** — JWT + user object stored in `localStorage`. `AuthProvider` (React Context) manages login/logout state. `ProtectedRoute` gates routes by `allowedRoles`. User roles: `STUDENT`, `COMPANY_ADMIN`, `UNIVERSITY_USER`, `SYSTEM_ADMIN`, `TEACHER`, `MENTOR`.

**Routing** (`src/App.tsx`) — React Router v7 with role-based layout nesting. All pages and layouts are lazy-loaded via a `lazyRetry` helper that auto-reloads the page once on chunk-fetch failure (handles stale deploys). Role → layout mapping:

- `/admin` → `AdminLayout` (SYSTEM_ADMIN)
- `/hr` → `HrLayout` (COMPANY_ADMIN)
- `/mentor` → `MentorLayout` (MENTOR)
- `/teacher` → `TeacherLayout` (TEACHER)
- `/university` → `UniversityLayout` (UNIVERSITY_USER)
- `/student` → `StudentDashboardPage` (STUDENT)

**Layouts** — Role-specific layouts (Admin, Hr, Mentor, Teacher, University) all compose `DashboardLayout` (`src/layouts/DashboardLayout.tsx`), which renders a responsive sidebar + `<Outlet>`.

**`useCRUD` hook** (`src/hooks/useCRUD.ts`) — generic hook for list/create/update/delete. Pass `listFn`, `createFn`, `updateFn`, `deleteFn` and get back `items`, `loading`, `error`, and action methods. Success/error messages are in Hungarian.

**Styling** — Tailwind CSS with dark mode. Use the `cn()` utility (`src/utils/cn.ts`, wraps `clsx` + `tailwind-merge`) for conditional class names. Dark mode variants use `dark:` prefix throughout.

**Types** (`src/types/api.types.ts`) — all shared API entities (User, Company, Position, Application, Partnership, NewsItem, etc.) live here and are re-exported from `src/types/index.ts`.

**UI language** — Hungarian throughout (labels, error messages, button text).
