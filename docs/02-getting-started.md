# Getting Started

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js)
- **Git**

## Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/myloo23/dual-kepzes-frontend.git
    cd dual-kepzes-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

## Environment Configuration
The application relies on environment variables for API connections.

1.  Create a `.env` file in the project root (copy from `.env.example` if it exists, otherwise create new).
2.  Add the following variable:
    ```env
    VITE_API_URL=http://localhost:8000
    ```
    *Note: Adjust this URL if your backend server is running on a different port or host.*

## Running Development Server
To start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```
Access the app at `http://localhost:5173`.

## Production Build
To create an optimized production build:

1.  **Build**
    ```bash
    npm run build
    ```
    This compiles TypeScript and bundles assets into the `dist/` folder.

2.  **Preview**
    ```bash
    npm run preview
    ```
    This starts a local static server serving the `dist/` folder, allowing you to test the production build locally.

## Linting
To check code quality and potential errors:

```bash
npm run lint
```
