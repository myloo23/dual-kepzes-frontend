> Updated for handoff. Verify against README.md, backendreadme.md, package.json, and current source code before production changes.

# Authentication And Security

Authentication is JWT-based. The backend issues a token on login, and the frontend stores the session state in `localStorage`.

## Login

There is no standalone `/login` route wired in `src/App.tsx`. Login is currently exposed through the public home UI.

Frontend login calls:

```ts
api.login(email, password)
```

This maps to:

```text
POST /api/auth/login
```

Do not document `api.auth.login` unless the source code is changed to provide that API shape.

## Stored Session Data

`AuthContext` currently stores these keys in `localStorage`:

- `token`
- `user`
- `role`

Logout removes those keys, clears auth context state, and redirects to `/`.

## Role Guards And Redirects

`src/features/auth/components/ProtectedRoute.tsx` is the client-side role guard.

- Unauthenticated users are redirected to `/`.
- Authenticated users without an allowed role are redirected to `/`.
- Protected routes in `src/App.tsx` pass `allowedRoles`, such as `STUDENT`, `COMPANY_ADMIN`, `SYSTEM_ADMIN`, `UNIVERSITY_USER`, `TEACHER`, and `MENTOR`.
- Role-specific post-login redirects are handled by the login UI/context flow and route configuration; verify current behavior in source before changing it.

Client-side guards are not a security boundary by themselves. Backend routes must still validate JWT and roles.

## Forgot And Reset Password

Forgot password route:

```text
/forgot-password
```

It calls:

```text
POST /api/auth/request-password-reset
```

Reset password route:

```text
/reset-password
```

It reads the reset token from the first available query parameter:

- `token`
- `code`
- `resetToken`

It calls:

```text
POST /api/auth/reset-password
```

Acceptance testing depends on backend email/token infrastructure being configured in the target environment.

## Handoff Caveats

- Teacher routes are mostly placeholders; only the guide page is implemented.
- Mentor routes are partial; partnerships and guide exist, while several sections are placeholders.
- Do not present placeholder routes as complete authenticated product surfaces.
- Keep role documentation aligned with `src/App.tsx` and `backendreadme.md`.
