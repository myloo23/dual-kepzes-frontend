# Features & Modules

The application is divided into several business modules located in `src/features/`.

## Core Features

### 🔐 Authentication (`auth/`)
Handles all user identity operations.
- **Context**: `AuthContext` provides global access to the current user (User object) and authentication status.
- **Token Management**: JWT tokens are stored in `localStorage` and automatically injected into API requests.
- **Components**: Login forms, Password reset flows.

### 🏢 Companies (`companies/`)
Manages company profiles and data.
- **Public**: Searchable company profiles for students.
- **HR/Admin**: Interfaces for companies to update their details, logo, and description.

### 💼 Positions (`positions/`)
The job board component of the application.
- **Listing**: Filters for "Dual" vs "Standard" positions.
- **Management**: HR admins can create, edit, close, and re-open job postings.
- **Application**: Connects students to these positions.

### 📋 Applications (`applications/`)
Tracks the lifecycle of a student applying to a position.
- **Flow**: Student applies -> Company (HR) evaluates -> Acceptance/Rejection.
- **Status Tracking**: Visual indicators for application status (Pending, Interview, Accepted, Rejected).

### 🤝 Partnerships (`partnerships/`)
Manages the formal relationships in the dual education system.
- **Mentor Assignment**: Linking a company mentor to a student.
- **University Oversight**: Tools for university staff to monitor these partnerships.

### 📰 News (`news/`)
A CMS-like feature for announcements.
- **Targeting**: News can be targeted to specific roles (e.g., "Only Students", "Only Mentors").
- **Admin**: internal editor for creating and publishing news items.

## Shared Infrastructure (`components/`)

### Layouts
- **`AdminLayout`**: Sidebar navigation for system administrators.
- **`HrLayout`**: Dashboard view for Company HR representatives.
- **`StudentLayout`**: User-centric view for students.

### UI Components
We use a custom design system built with Tailwind CSS.
- **`Button`**: Standardized variants (primary, secondary, danger, ghost).
- **`Modal`**: Accessible dialogs for forms and confirmations.
- **`Card`**: Container style for lists and dashboards.
