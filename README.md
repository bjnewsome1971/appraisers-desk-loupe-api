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
- `POST /api/auth/register` — create a user
- `POST /api/auth/login` — sign in and receive a JWT
- `GET /api/auth/me` — fetch current user profile
- `GET /api/appraisals` — list appraisals for current user
- `POST /api/appraisals` — create appraisal
- `GET /api/properties` — list properties for current user
- `POST /api/properties` — create property
- `GET /api/users` — admin-only user list

## Admin seed

```bash
npm run seed:admin
```

This creates a default admin account for local development:

- email: `admin@appraisersdesk.com`
- password: `Admin123!`
