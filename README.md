# 🎓 Dual Képzés Frontend - Project Documentation

This document serves as the central hub for the technical documentation of the **Dual Képzés Frontend** project.

## 📚 Documentation Index

We have organized the documentation into detailed sections to help you navigate specific topics:

### 🏗️ [Architecture Overview](./docs/01-architecture.md)
Understanding the high-level design, File Structure, Tech Stack choices, and Data Flow.

### 🚀 [Getting Started](./docs/02-getting-started.md)
Step-by-step guide to setting up your development environment, installing dependencies, and running the app locally.

### 🧩 [Features & Modules](./docs/03-features-and-modules.md)
Deep dive into the modular "Feature-Based Architecture", explaining the purpose of each directory in `src/features/` (Auth, Companies, Positions, etc.).

### 🔌 [API & Data Flow](./docs/04-api-and-data-flow.md)
Detailed explanation of the `api.ts` layer, how requests are handled, error normalization, and how to add new endpoints.

### 🔐 [Authentication & Security](./docs/05-authentication-and-security.md)
How the login flow works, simple JWT management, and Role-Based Access Control (RBAC) implementation in Routing.

### ☁️ [Deployment](./docs/06-deployment.md)
Strategies for deploying to production, specifically tailored for Vercel or standard static hosting.

---

## ⚡ Quick Start

For those who just want to get running immediately:

```bash
# 1. Clone
git clone https://github.com/myloo23/dual-kepzes-frontend.git

# 2. Install
npm install

# 3. Configure API
# Create .env file with: VITE_API_URL=http://localhost:8000

# 4. Run
npm run dev
```

For more details, please refer to the [Getting Started](./docs/02-getting-started.md) guide.
