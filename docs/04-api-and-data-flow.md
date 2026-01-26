# API & Data Flow

The application communicates with a RESTful backend using a centralized API layer located in `src/lib/api.ts`.

## The `api` Object
We export a single global `api` object that groups endpoints by domain. This provides autocompletion and type safety throughout the app.

**Example Usage:**
```typescript
import { api } from '@/lib/api';

// Fetching companies
const companies = await api.companies.list();

// Creating a position
await api.positions.create({ title: "DevOps Intern", ... });
```

## Request Handling
Under the hood, `api.ts` uses a customized `fetch` wrapper (or Axios instance if migrated) that handles:

1.  **Base URL**: Automatically prepends `VITE_API_URL` to requests.
2.  **Authorization**: Checks `localStorage` for a JWT token (`auth_token`) and adds the `Authorization: Bearer <token>` header to every authenticated request.
3.  **Content-Type**: Sets `application/json` for POST/PUT/PATCH requests.
4.  **Error Normalization**:
    - Catches HTTP errors (4xx, 5xx).
    - Parses the backend error response body.
    - Throws a standard JavaScript `Error` object with a user-friendly message, which can be caught by UI components or Toasts.

## Type Safety
All API responses are typed using TypeScript interfaces defined in `src/types/api.types.ts`.
- **Generics**: The helper functions `apiGet<T>`, `apiPost<T>` etc. ensure that the return value matches the expected interface.

```typescript
// Definition
function apiGet<T>(path: string): Promise<T> { ... }

// Usage
api.students.get(id) // Returns Promise<StudentProfile>
```

## Adding New Endpoints
To add a new API endpoint:
1.  Define the response and payload types in `src/types/api.types.ts`.
2.  Add the route constant to `PATHS` in `src/lib/api.ts` (optional but recommended for magic string avoidance).
3.  Add a new method to the `api` object in `src/lib/api.ts`, using the appropriate helper (`apiGet`, `apiPost`, etc.).
