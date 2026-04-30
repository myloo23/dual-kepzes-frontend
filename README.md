# NJE Dual Training Frontend

Frontend application for the Neumann János University dual training system. The app supports public visitors, students, company/HR users, university users, mentors, teachers, and system administrators through a role-based React single-page application.

This README is written for a new developer taking over the frontend. For backend routes, request/response shapes, auth behavior, and API caveats, use [backendreadme.md](./backendreadme.md) as the backend/API reference. Do not invent frontend API calls for endpoints that are not documented or already implemented.

## Current Status

The project is in client-preview / handoff state, not a fully finished production handover.

- Core public, student, HR/company, university, and admin surfaces exist.
- Teacher and Mentor route groups exist, but they are not fully implemented. Several pages intentionally render placeholders.
- Gallery seed images still use `picsum.photos` until real institutional media assets are provided.
- `LEVELEZO` / `LEVELEZŐ` study mode is intentionally disabled in student registration and shown as "hamarosan".
- Build status must be verified during handoff with `npm run build`; do not assume a clean build unless it has just been run.
- Lint debt may remain, including 12 known warnings across React hooks/compiler categories and `console.error` / `console.warn` used for real error handling.

## Tech Stack

Source of truth: [package.json](./package.json).

- React 19
- React DOM 19
- TypeScript 5.9
- Vite 7
- React Router DOM 7
- Tailwind CSS 3
- Leaflet and React Leaflet
- Lucide React
- SheetJS / `xlsx`
- ESLint 9 with TypeScript ESLint and React hooks rules
- Utility helpers: `clsx`, `tailwind-merge`

The HTTP layer uses the native browser `fetch` API through [src/lib/api-client.ts](./src/lib/api-client.ts), not Axios.

## Setup

Prerequisites:

- Node.js 20 or newer
- npm
- A running backend API. The default local URL is `http://localhost:3000`.

Current Vite 7 and React Router DOM 7 dependency requirements are compatible with Node 20+.

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

Run a production build:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Only one project-specific `VITE_*` variable is currently used by source code:

| Variable       | Required    | Default                 | Purpose                                                                              |
| -------------- | ----------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `VITE_API_URL` | Required | none | Backend API base URL used by `src/config/app.config.ts` and `src/lib/api-client.ts`. |

Vite built-ins such as `import.meta.env.DEV`, `import.meta.env.PROD`, and `import.meta.env.MODE` are also used for app configuration flags.

## NPM Scripts

| Script            | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Start Vite dev server.                                  |
| `npm run build`   | Run TypeScript project build and Vite production build. |
| `npm run lint`    | Run ESLint over the project.                            |
| `npm run preview` | Preview the built app locally.                          |

## Project Structure

```text
src/
  pages/        Route-level page components.
  features/     Feature modules with components, hooks, services, data, and types.
  components/   Shared UI, layout, and cross-feature components.
  layouts/      Role-specific dashboard shells.
  lib/          API client, central API object, token helpers, media URL helpers.
  types/        Shared TypeScript API, UI, form, notification, and common types.
  hooks/        App-level reusable hooks.
  utils/        General utilities such as class merging, validation, export helpers.
  config/       App config and role navigation config.
  constants/    Routes, filters, messages, and UI constants.
  assets/       Logos, reference images, documents, video, and static data assets.
```

The codebase follows a feature-oriented structure. Route components in `src/pages` should stay thin where practical, with domain behavior living under `src/features`.

## Routing And Roles

Routes are defined in [src/App.tsx](./src/App.tsx). Protected route access is handled by [src/features/auth/components/ProtectedRoute.tsx](./src/features/auth/components/ProtectedRoute.tsx).

### Public Routes

- `/` - home and public landing entry.
- `/positions` - public position listing.
- `/gallery` - public gallery.
- `/help` - public help page.
- `/companies/:id` - public company profile.

### Auth Routes

- `/register` - student registration.
- `/register-company-partner` - company partner registration with admin.
- `/forgot-password` - password reset request.
- `/reset-password` - password reset form.

There is no standalone `/login` route wired in `App.tsx`; login is currently exposed through the public UI.

### Student Routes

Allowed role: `STUDENT`.

- `/student`
- `/student/news`
- `/student/partnerships`
- `/student/guide`

These currently route through `StudentDashboardPage`, with tab/section behavior handled inside that page.

### HR / Company Routes

Allowed role: `COMPANY_ADMIN`.

- `/hr`
- `/hr/job-postings`
- `/hr/applications`
- `/hr/students`
- `/hr/partnerships`
- `/hr/employees`
- `/hr/company-profile`
- `/hr/news`
- `/hr/profile`
- `/hr/guide`

Most HR sections route through `HrDashboardPage`; the guide page uses `HrGuidePage`.

### Admin Routes

Allowed role: `SYSTEM_ADMIN`.

- `/admin`
- `/admin/users`
- `/admin/partnerships`
- `/admin/companies`
- `/admin/positions`
- `/admin/tags`
- `/admin/settings`
- `/admin/news`
- `/admin/notifications`
- `/admin/guide`
- `/admin/gallery`
- `/admin/email-templates`

### University Routes

Allowed role: `UNIVERSITY_USER`.

- `/university`
- `/university/students`
- `/university/partnerships`
- `/university/news`
- `/university/profile`
- `/university/guide`

Dashboard-like routes currently reuse `UniversityDashboardPage`; the guide page uses `UniversityGuidePage`.

### Teacher Routes

Allowed role: `TEACHER`.

- `/teacher` - placeholder.
- `/teacher/students` - placeholder.
- `/teacher/companies` - placeholder.
- `/teacher/stats` - placeholder.
- `/teacher/guide` - implemented guide page.

Teacher routes are not fully implemented and should not be presented as complete.

### Mentor Routes

Allowed role: `MENTOR`.

- `/mentor` - placeholder.
- `/mentor/partnerships` - mentor partnerships page.
- `/mentor/messages` - placeholder.
- `/mentor/progress` - placeholder.
- `/mentor/reviews` - placeholder.
- `/mentor/profile` - placeholder.
- `/mentor/guide` - implemented guide page.

Mentor routes are partially implemented and should not be presented as complete.

## API Architecture

Backend/API reference: [backendreadme.md](./backendreadme.md).

- [src/lib/api-client.ts](./src/lib/api-client.ts) is the low-level native `fetch` wrapper.
- [src/lib/api.ts](./src/lib/api.ts) exports the central `api` object used by much of the app.
- Feature-specific services exist where a feature owns more detailed API behavior, for example:
  - [src/features/companies/services/companyApi.ts](./src/features/companies/services/companyApi.ts)
  - [src/features/students/services/studentsApi.ts](./src/features/students/services/studentsApi.ts)
  - [src/features/gallery/services/galleryApi.ts](./src/features/gallery/services/galleryApi.ts)
  - [src/features/guide/services/materialsApi.ts](./src/features/guide/services/materialsApi.ts)
  - [src/features/stats/services/statsApi.ts](./src/features/stats/services/statsApi.ts)
- [src/lib/auth-token.ts](./src/lib/auth-token.ts) centralizes token access.
- API calls are automatically prefixed with `VITE_API_URL`; the app fails fast if it is missing.
- Bearer tokens are attached from local storage when present.
- JSON responses using `{ success: true, data }` are unwrapped by the client.
- Paginated wrappers with `data` and `pagination` are also normalized to the `data` array.

Do not add API calls by guessing endpoint names. Check `backendreadme.md`, Swagger/backend implementation, or existing frontend services first. If an endpoint is missing, leave the UI disabled/hidden or document the gap.

## Auth Flows

### Login

Login calls `POST /api/auth/login` through `api.login`. On success, [AuthContext](./src/features/auth/context/AuthContext.tsx) stores:

- `token`
- `user`
- `role`

These are stored in `localStorage`, then exposed through the auth context.

### Role-Based Navigation And Redirects

- `ProtectedRoute` blocks protected pages when no authenticated user is available.
- Unauthorized users are redirected to `/`.
- Role-specific dashboard/news links are configured in [src/config/navigation.ts](./src/config/navigation.ts).
- Some navigation entries point to routes that are currently placeholders, especially Teacher, Mentor, and HR news links.

### Student Registration

Student registration uses `/register` and submits through `api.registerStudent`, which maps to `POST /api/auth/register`.

`LEVELEZŐ` study mode is disabled in the UI as "hamarosan"; do not document it as an active registration option.

### Company Registration

Company partner registration uses `/register-company-partner` and submits through company registration API paths already present in the frontend, including `/api/companies/with-admin`.

### Forgot Password

`/forgot-password` validates the email client-side and calls:

```text
POST /api/auth/request-password-reset
```

The UI displays a generic success state if the request succeeds.

### Reset Password

`/reset-password` reads the reset token from one of these query parameters:

- `token`
- `code`
- `resetToken`

It validates the new password and calls:

```text
POST /api/auth/reset-password
```

Password reset depends on backend email/token infrastructure. Confirm the target environment has email/reset delivery configured before client acceptance testing.

## Global Search

The frontend currently calls:

```text
GET /api/search?q=<query>
```

Behavior:

- Minimum query length is 2 characters.
- Search requests are debounced.
- Expected result groups are positions, companies, and news.
- Empty state shows either static navigation shortcuts or no results, depending on which search implementation is used.
- Errors are shown as a friendly search failure message and results are cleared.

There are two search implementations in the codebase:

- [src/features/search/components/GlobalSearch.tsx](./src/features/search/components/GlobalSearch.tsx) is used by the navbar.
- [src/components/shared/GlobalSearch.tsx](./src/components/shared/GlobalSearch.tsx) is still mounted at the app level through `App.tsx`.

Consolidating these is post-handoff technical debt unless a product decision requires both behaviors.

## UI, Styling, And Maps

- Tailwind CSS is the styling foundation.
- `tailwind.config.js` uses `darkMode: "class"`.
- `useTheme` applies `light` or `dark` classes to the document root and can follow the system preference.
- Preserve `dark:` variants when editing UI.
- Shared UI lives under `src/components/ui` and `src/components/shared`.
- Toasts are handled through `useToast` and `ToastContainer`.
- Modal and loading patterns include shared modal, image modal, skeletons, and page loaders.
- Icons are primarily Lucide React.

Maps use Leaflet and React Leaflet. Marker assets are stored in [public/leaflet](./public/leaflet). Map-related components and helpers include:

- landing company maps
- positions map
- application location map
- geocoding hooks
- city coordinate utilities

## Known Intentional Placeholders And Caveats

- Teacher dashboard routes are mostly placeholders; only the guide page is implemented.
- Mentor routes are partial; partnerships and guide exist, while several sections are placeholders.
- Gallery seed images use `https://picsum.photos/...` until real NJE/client media assets are supplied.
- `LEVELEZŐ` study mode is disabled as "hamarosan".
- `console.error` and `console.warn` are present in parts of the app for real error handling and should not be removed blindly.
- Lint backlog may remain, including 12 known warnings, especially React hooks/compiler-related findings.
- AGENTS.md contains rules and guardrails for AI coding agents working on this repository.
- Some route constants in `src/constants/routes.ts` do not exactly match the routes currently wired in `App.tsx`; use `App.tsx` as the practical routing source until constants are reconciled.

## Quality Status

Current verification expectation:

```bash
npm run build
npm run lint
```

For this handoff, treat build and lint status as time-sensitive. Record the command, date, and output whenever verification is run. Do not claim a clean build from stale documentation.

Do not fix unrelated lint backlog as part of documentation-only handoff work.

## Handoff Checklist

1. Install dependencies with `npm install`.
2. Configure `.env` with the correct `VITE_API_URL`.
3. Start the frontend with `npm run dev`.
4. Confirm the backend is running and matches `backendreadme.md`.
5. Test login with each available role.
6. Test student registration.
7. Test company registration.
8. Test forgot-password and reset-password flows with the target backend email/token setup.
9. Test global search with at least 2 characters.
10. Test role dashboards: student, HR/company, admin, university, teacher, mentor.
11. Verify which Teacher/Mentor routes are placeholders with the client.
12. Run `npm run build`.
13. Run `npm run lint` when lint backlog review is in scope.
14. Review gallery media expectations and replace `picsum.photos` seed images when real assets are available.
15. Review this caveat list with the client before calling the project production-ready.

## Post-Handoff Technical Debt

- Work through the React hooks/compiler lint backlog.
- Consolidate duplicate GlobalSearch implementations if one shared behavior is desired.
- Replace gallery seed images with approved real media assets.
- Implement the unfinished Teacher pages.
- Complete or explicitly descope unfinished Mentor pages.
- Improve backend endpoint documentation if `backendreadme.md` is incomplete for frontend needs.
- Reconcile `src/constants/routes.ts` with `App.tsx`.
- Keep `AGENTS.md` aligned with the current handoff rules and repository documentation.
- Confirm production deployment configuration and final backend URL.

## Related Documentation

Some docs were generated earlier and may be outdated. Treat README.md, backendreadme.md, package.json, AGENTS.md, and src/App.tsx as the current source of truth.

### Current handoff sources of truth

- [README.md](./README.md) - frontend project reference and handoff notes.
- [backendreadme.md](./backendreadme.md) - backend/API reference.
- [AGENTS.md](./AGENTS.md) - repository rules and guardrails for AI coding agents.
- [package.json](./package.json) - dependency and script source of truth.
- [src/App.tsx](./src/App.tsx) - practical routing source of truth.

### Docs that should be updated before relying on them

- [docs/02-getting-started.md](./docs/02-getting-started.md)
- [docs/04-api-and-data-flow.md](./docs/04-api-and-data-flow.md)
- [docs/05-authentication-and-security.md](./docs/05-authentication-and-security.md)
- [docs/09-advanced-features.md](./docs/09-advanced-features.md)

### Reference / legacy docs

- [docs/01-architecture.md](./docs/01-architecture.md)
- [docs/03-features-and-modules.md](./docs/03-features-and-modules.md)
- [docs/06-deployment.md](./docs/06-deployment.md)
- [docs/07-ux-components.md](./docs/07-ux-components.md)
- [docs/08-performance.md](./docs/08-performance.md)
- [docs/FEJLESZTOI_SEGEDLET.md](./docs/FEJLESZTOI_SEGEDLET.md)
- [docs/FRONTEND_STRUKTURA.md](./docs/FRONTEND_STRUKTURA.md)
- [docs/WORKFLOW_VIZUALIZACIO.html](./docs/WORKFLOW_VIZUALIZACIO.html)

## Ownership

This project is for the Neumann János University Dual Training Center.
Created by: Takács Milán
