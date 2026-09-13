# DevOps Deployment Dashboard

A lightweight Node.js and Express dashboard for displaying application runtime status. This is the application-only first phase; containerization, CI/CD, cloud infrastructure, and monitoring integrations are intentionally not included yet.

## Requirements

- Node.js 20 or newer

## Run locally

```bash
npm install
copy .env.example .env
npm start
```

Open `http://localhost:3000` for the dashboard.

## Commands

```bash
npm start  # run the application
npm run dev # run with Node watch mode
npm test   # run API tests
```

## Run with Docker

The Docker setup is production-oriented: it uses a small Node.js LTS image, installs production dependencies only, runs as a non-root user, and includes a container health check.

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

The local Compose service is available at `http://localhost:3000`. Configure `APP_VERSION`, `ENVIRONMENT`, and `LOG_LEVEL` through your shell or a local `.env` file used by Docker Compose. That file is excluded from the image build context and must not be committed.

The application is attached to an isolated `devops-dashboard-network`, ready for a future Nginx reverse-proxy service.

## API

- `GET /health` returns a lightweight process health response.
- `GET /api/status` returns application name, version, environment, uptime, and timestamp.

## Configuration

Copy `.env.example` to `.env` and set deployment-specific values. The application currently reads environment variables provided by the operating system; use your shell or deployment environment to supply them. Do not commit `.env` files.
