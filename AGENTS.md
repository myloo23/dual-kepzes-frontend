# AGENTS.md

Guidance for AI agents working in this repository.

## Before Making Changes

- Read **README.md** as the frontend project reference: stack, setup, structure, routing, architecture, caveats, and available commands.
- Read **backendreadme.md** as the backend/API source of truth: endpoints, request/response shapes, auth, and backend behavior.

## API and Backend Rules

- **Never invent endpoints.** Only use routes that exist in backendreadme.md. If an endpoint is missing, state that explicitly instead of guessing.
- **Never fake API success.** Do not mock API responses, hardcode data, or skip actual API calls to simulate working UI.
- **Unavailable features must stay visually safe.** If a backend feature does not exist yet, disable or hide the UI element — do not wire it to a non-existent endpoint or return placeholder truthy values.

## TypeScript Rules

- **No `any` or `as any`.** Use proper types from `src/types/api.types.ts` or define new ones.
- **Use `unknown` in catch blocks**, then narrow with type guards. Never cast caught errors to `any`.
- **Do not broaden types to work around errors.** Fix the underlying type mismatch instead.

## Scope Rules

- **Styling and type tasks must not change business logic.** If a fix requires touching logic, call it out explicitly before proceeding.
- **Broad refactors require explicit approval.** Do not restructure files, rename exports, or reorganize features unless directly asked.
- **Dark mode must not regress.** Every UI change must preserve `dark:` Tailwind variants. Check both light and dark classes when editing components.

## After Every Code Change

1. Run `npm run build` and confirm it exits without errors.
2. Report all modified files.
3. Report the build result (success or the exact error).

If the build fails, fix the errors before considering the task done.
