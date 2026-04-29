> Updated for handoff. Verify against README.md, backendreadme.md, package.json, and current source code before production changes.

# Advanced Features

This page documents current advanced frontend behavior and known post-handoff debt. Planned items are marked as future work.

## Global Search

Global search is already wired to a real API call:

```text
GET /api/search?q=<query>
```

No mock replacement is needed for the current implementation. Verify the backend route in `backendreadme.md`, Swagger, or backend source before changing the contract.

Current behavior:

- opens from the global search UI / keyboard shortcut flow
- waits for at least 2 non-space characters before searching
- debounces requests
- groups/maps backend results for positions, companies, and news
- clears results and shows a friendly error state when search fails
- stores recent searches in localStorage in the app-level implementation

There are currently two search implementations:

- `src/components/shared/GlobalSearch.tsx`, mounted at app level through `src/App.tsx`
- `src/features/search/components/GlobalSearch.tsx`, used by the navbar search feature flow

Consolidating these implementations is technical debt. Do not remove one without confirming the intended product behavior.

## Export Utilities

Export helpers live in:

```text
src/utils/export.ts
```

Current capabilities include:

- CSV export
- Excel `.xlsx` export through `xlsx`
- PDF/table print export through the browser print flow
- date-based export filenames

Known debt:

- `src/utils/export.ts` still uses generic `any` constraints. Replace with safer generic constraints in a dedicated type-cleanup pass.
- Large exports should be reviewed for performance and user feedback before production use.

## Future Work

These are planned or optional improvements, not current completed behavior:

- consolidate the two GlobalSearch implementations
- add search filters such as type/date range
- add fuzzy search or analytics if product needs them
- replace gallery seed media with approved real assets
- improve export typing and large-data handling
- add custom PDF/Excel formatting templates if required

Do not describe future items as shipped features in handoff or production documentation.
