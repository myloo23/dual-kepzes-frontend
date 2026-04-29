> Updated for handoff. Verify against README.md, backendreadme.md, package.json, and current source code before production changes.

# API And Data Flow

Backend/API source of truth is `backendreadme.md`, plus Swagger/backend implementation when available. Never invent endpoints. If a route is not documented or implemented, keep the related UI disabled/hidden or document the gap.

## HTTP Layer

`src/lib/api-client.ts` uses the native browser `fetch` API, not Axios.

The client:

- prefixes requests with `VITE_API_URL`
- attaches `Authorization: Bearer <token>` when `src/lib/auth-token.ts` returns a token
- sends JSON for POST/PUT/PATCH helpers
- serializes query params with `URLSearchParams`
- throws normalized `Error` objects for non-2xx responses
- unwraps `{ success: true, data }` responses to `data`
- unwraps paginated `{ data, pagination }` responses to the `data` array

## API Organization

- `src/lib/api.ts` exports the central `api` object used by much of the app.
- `src/lib/api-client.ts` provides `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, and form-data helpers.
- Feature-specific services exist where a module owns more detailed behavior, for example companies, students, gallery, guide materials, and stats services.
- `src/types/api.types.ts` contains the main API request/response types.

## Current Confirmed Endpoints

These endpoints are wired and should be treated as real for handoff:

```text
POST /api/auth/request-password-reset
POST /api/auth/reset-password
GET /api/search?q=<query>
```

Other API calls exist in frontend services, but verify each one against `backendreadme.md`, Swagger, or backend source before expanding docs or UI behavior.

## Safer Typing

Do not add examples using `Record<string, any>` or `as any`. Prefer existing types from `src/types/api.types.ts`, feature-specific types, or narrow unknown data before use.

Example query shape:

```ts
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;
```

Example API usage:

```ts
import { apiGet } from "@/lib/api-client";
import type { SearchApiResponse } from "@/types/api.types";

const results = await apiGet<SearchApiResponse>("/api/search", { q: "mernok" });
```

## Adding Or Changing Calls

Before adding a call:

1. Check `backendreadme.md`.
2. Check Swagger or backend route implementation.
3. Check existing frontend services for an existing wrapper.
4. Add or reuse precise request/response types.
5. Keep unavailable backend features visually safe instead of faking success.
