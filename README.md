# The Appraiser's Desk & Loupe API

This repository contains the Node.js/Express backend for The Appraiser's Desk & Loupe app.

## Overview

The API is built with Express and is structured as a starter backend for the app, with room to grow into:

- appraisals and valuation endpoints
- property and lender data management
- user authentication and role-based access
- database integration for persistence

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

## Project structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  routes/
```
