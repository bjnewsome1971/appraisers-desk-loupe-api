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

## Environment variables

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=change-me-in-production
DB_URI=mongodb://localhost:27017/appraisers-desk-loupe
```

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

## Auth examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "StrongPass1!"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "StrongPass1!"
  }'
```

### Get current user

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_HERE"
```

## Property examples

### Create a property

```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_HERE" \
  -d '{
    "address": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "parcelNumber": "ABC123",
    "legalDescription": "Lot 12, Block 4, Subdivision A",
    "propertyType": "single-family",
    "squareFootage": 1800,
    "bedrooms": 3,
    "bathrooms": 2,
    "yearBuilt": 2005,
    "lotSize": 4200,
    "notes": "Owner occupied property."
  }'
```

### List properties

```bash
curl http://localhost:5000/api/properties \
  -H "Authorization: Bearer YOUR_JWT_HERE"
```

## Appraisal examples

### Create an appraisal

```bash
curl -X POST http://localhost:5000/api/appraisals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_HERE" \
  -d '{
    "propertyAddress": "123 Main St",
    "propertyType": "single-family",
    "clientName": "Jane Doe",
    "loanPurpose": "purchase",
    "estimatedValue": 350000,
    "status": "draft",
    "notes": "Initial review notes."
  }'
```

### List appraisals

```bash
curl http://localhost:5000/api/appraisals \
  -H "Authorization: Bearer YOUR_JWT_HERE"
```

## Admin seed

```bash
npm run seed:admin
```

This creates a default admin account for local development:

- email: `admin@appraisersdesk.com`
- password: `Admin123!`
