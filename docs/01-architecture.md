# Architecture Overview

## High-Level Design
The **Dual Képzés Frontend** is a modern, single-page application (SPA) built with **React** and **TypeScript**. It serves as the primary interface for managing dual education partnerships between universities, companies, and students. The application is designed to be **role-based**, meaning the user interface and available features adapt dynamically based on the logged-in user's role (Student, Company Admin, HR, Mentor, Teacher, System Admin).

The architecture prioritizes:
- **Scalability**: By using a feature-based folder structure.
- **Type Safety**: Extensive use of TypeScript interfaces for API responses and component props.
- **Maintainability**: Shared UI components and centralized API logic.

## Feature-Based Architecture
We utilize a **Feature-Based Architecture** (FBA) rather than a layer-based one (controllers/views). This means that code is organized by the "business domain" or feature it belongs to, rather than its technical function.

### Directory Structure Rationale
- `src/features/`: This is the core of the application. Each folder here represents a distinct business domain (e.g., `auth`, `companies`, `applications`).
  - **Encapsulation**: Everything related to a feature (components, hooks, utils, types) stays within that feature's folder.
  - **Public API**: Features should ideally expose only what's necessary via an `index.ts` file, keeping internal implementation details private (though currently enforced by convention).

### Key Directories
- **`src/features/`**: Business logic modules.
- **`src/components/`**: Shared "dumb" UI components (buttons, modals, inputs) that are feature-agnostic.
- **`src/pages/`**: The entry points for routing. Pages ideally serve as containers that compose feature components together.
- **`src/lib/`**: Configuration for third-party libraries (Axios, Utility functions).
- **`src/layouts/`**: Layout wrappers that handle persistent UI elements (Sidebar, Navbar) for different roles.

## Technical Stack Decisions

| Technology | Role | Rationale |
|------------|------|-----------|
| **React 19** | UI Framework | Utilizes the latest concurrent features and optimized render cycles. |
| **Vite** | Build Tool | selected for superior DevX, instant HMR (Hot Module Replacement), and efficient efficient ES module builds. |
| **TypeScript** | Language | Enforces strict type boundaries, significantly reducing runtime errors and improving code navigation. |
| **Tailwind CSS** | Styling | Utility-first approach allowing for rapid UI development and consistent design tokens without style sheet bloat. |
| **React Query / Custom Hooks** | State Management | *Note: Currently strictly using custom hooks (`useCRUD`) and `useEffect`, but architecture is ready for React Query migration.* |
| **React Router v7** | Routing | Standard industry routing solution with robust support for nested layouts and protected routes. |

## Data Flow
1.  **UI Component**: Triggers an action (e.g., form submission).
2.  **Custom Hook**: (e.g., `useAuth`, `useCRUD`) Intercepts the action.
3.  **API Layer (`src/lib/api.ts`)**: Formats the request, attaches the JWT token, and sends it to the backend.
4.  **Backend**: Processes request and returns JSON.
5.  **API Layer**: Normalizes logic (error handling) and returns data to the hook.
6.  **UI Component**: Re-renders with new data.
