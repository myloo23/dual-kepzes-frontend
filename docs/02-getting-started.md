> Updated for handoff. Verify against README.md, backendreadme.md, package.json, and current source code before production changes.

# Getting Started

Use this page as a quick local setup note only. For current frontend handoff details read `README.md`; for backend/API behavior read `backendreadme.md`; for agent guardrails read `AGENTS.md`.

## Prerequisites

- Node.js 20 or newer
- npm
- Git
- Running backend API matching `backendreadme.md`

The current local backend default is:

```text
http://localhost:3000
```

Do not use the older `http://localhost:8000` value unless the active environment configuration explicitly requires it.

## Setup

```bash
npm install
```

Create a project-root `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` is read by the frontend API client through the app configuration. Adjust it only when the backend is actually running elsewhere.

## Scripts

Source of truth: `package.json`.

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `npm run dev` starts the Vite development server.
- `npm run build` runs TypeScript build and Vite production build.
- `npm run lint` runs ESLint.
- `npm run preview` serves the built app locally.

## Practical Handoff Caveats

- Routes are defined in `src/App.tsx`; use that file as the practical routing source.
- Teacher and Mentor route groups exist, but several pages are placeholders. Do not present them as complete.
- Gallery seed images still use `picsum.photos` until real institutional media assets are provided.
- `LEVELEZO` / `LEVELEZŐ` study mode is intentionally disabled in student registration and shown as upcoming.
- Build status is time-sensitive. Run `npm run build` before claiming the handoff is build-clean.
