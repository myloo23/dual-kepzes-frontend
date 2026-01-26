# Authentication & Security

## Overview
Authentication is handled via **JWT (JSON Web Tokens)**. The backend issues a token upon successful login, which the frontend stores and uses to authenticate subsequent requests.

## Authentication Flow
1.  **Login**: User enters credentials on `/login`.
2.  **Request**: `api.auth.login(email, password)` is called.
3.  **Response**: Backend checks credentials and returns a JWT.
4.  **Storage**: The `AuthContext` (or `api.ts` utility) saves this token to `localStorage` under the key `auth_token`.
5.  **State Update**: The `AuthContext` updates the `user` state, triggering a re-render that redirects the user to their dashboard.

## Role-Based Access Control (RBAC)
The application differentiates between multiple user roles. This is enforced at two levels:

### 1. Routing Level (Client-Side)
React Router protects sensitive routes using layout guards. For example, `AdminLayout` likely checks if `user.role === 'admin'`. If not, it redirects to the login page or a forbidden page.

| Role | Access Scope |
|------|--------------|
| **Student** | Can apply to jobs, view own applications, edit profile. |
| **HR / Company Admin** | Can manage company profile, post jobs, evaluate applicants. |
| **Mentor** | Can view assigned students, log progress. |
| **Teacher / University** | Oversight of all partnerships and stats. |
| **System Admin** | Full access to users, news, and global settings. |

### 2. API Level (Server-Side)
The frontend UI hiding a button does not secure the app. The backend validates the JWT on every request to ensure the user actually has permission to perform the action.

## Token Persistence
- **LocalStorage**: We currently use `localStorage` for persistence.
  - *Pros*: Easy to implement, persistent across tabs/restarts.
  - *Cons*: Vulnerable to XSS (Cross-Site Scripting) if the app has security flaws.
- *Future Improvement*: Consider moving to `HttpOnly` cookies for better security against XSS.

## Logout
Logout clears the token from storage and resets the `AuthContext` state, immediately redirecting the user to the public landing page.
