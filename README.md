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

## API

- `GET /health` returns a lightweight process health response.
- `GET /api/status` returns application name, version, environment, uptime, and timestamp.

## Configuration

Copy `.env.example` to `.env` and set deployment-specific values. The application currently reads environment variables provided by the operating system; use your shell or deployment environment to supply them. Do not commit `.env` files.
