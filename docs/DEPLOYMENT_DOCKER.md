# Docker Deployment Handoff

This Docker setup builds the NJE Dual Training React + Vite + TypeScript frontend and serves the generated static files with Nginx.

## Requirements

- Docker
- Docker Compose
- Backend API reachable from users' browsers at the configured `VITE_API_URL`

This is frontend-only Docker. Backend, database, Redis, SMTP, and other backend infrastructure are not included unless backend/database compose files are added later.

## Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Set the frontend API base URL:

```env
VITE_API_URL=http://localhost:3000
```

For production, replace it with the public backend API URL that browsers should call.

Important: because this is a Vite app, `VITE_API_URL` is baked into the frontend bundle at build time. Changing `VITE_API_URL` requires rebuilding the Docker image.

## Build And Start

```bash
docker compose up -d --build
```

The frontend is exposed on:

```text
http://localhost:8080
```

The container serves the built `dist/` output with Nginx on port `80`.

## Stop

```bash
docker compose down
```

## Logs

```bash
docker compose logs -f
```

## SPA Routing

Nginx is configured with:

```nginx
try_files $uri $uri/ /index.html;
```

This supports React Router refreshes and direct deep links.

## Build Notes

- Build stage: `node:20-alpine`
- Install command: `npm ci`
- Build command: `npm run build`
- Production stage: `nginx:alpine`
- Static output copied from `dist/` to `/usr/share/nginx/html`
- Container port: `80`
