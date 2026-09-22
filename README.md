# The Appraiser's Desk & Loupe API

This repository contains the Node.js/Express backend for The Appraiser's Desk & Loupe app.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

The API will run on the port defined in `.env` (default: `5000`).

## Available endpoints

- `GET /` — API welcome message
- `GET /api/health` — health check
- `GET /api/status` — basic app status
