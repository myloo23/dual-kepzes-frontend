# Deployment

## Strategy
This application is a **Static Site** (SPA) once built. It can be hosted on any static file server (Nginx, Apache, AWS S3, Vercel, Netlify).

## Vercel Deployment (Recommended)
The project includes a `vercel.json` configuration file, making it ready for instant deployment on Vercel.

1.  Connect your GitHub repository to Vercel.
2.  Vercel will detect `vite` and automatically configure the build settings.
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
3.  **Environment Variables**: Add `VITE_API_URL` in the Vercel dashboard settings pointing to your production backend.

## Manual / Docker Deployment
To host it manually (e.g., via Nginx):

1.  **Build**
    ```bash
    npm run build
    ```
2.  **Serve**
    Copy the contents of the `dist/` directory to your web server's root (e.g., `/var/www/html`).
3.  **SPA Configuration**
    Ensure your server is configured to redirect all 404 requests to `index.html`. This is required for React Router to handle deep links (Client-Side Routing).

    **Nginx Example:**
    ```nginx
    location / {
      try_files $uri $uri/ /index.html;
    }
    ```

## CI/CD Pipeline (Example)
For automated deployments via GitHub Actions:
1.  **Trigger**: On push to `main` branch.
2.  **Steps**:
    - Checkout code.
    - Install Node.js `v18`.
    - `npm install`.
    - `npm run lint` (Fail if errors).
    - `npm run build`.
    - Upload `dist/` artifact to hosting provider.
