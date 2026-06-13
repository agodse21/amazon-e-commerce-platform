# Amazon Clone

Full-stack Amazon-inspired e-commerce app. Browse products, manage a cart, checkout — UI modeled after Amazon.in.

## Features

- Product catalog with search, category filter, and sort
- Live search suggestions in the navbar
- Product detail page — carousel, specs, buy box
- Session cart (persists across refreshes via cookie)
- Cart page + slide-over mini cart
- Checkout with address form and order summary
- Buy Now — checkout one item without touching saved cart
- Order confirmation and order history
- Amazon-style UI — navy header, product cards, yellow Add to Cart

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React, Vite, TypeScript, TanStack Router, TanStack Query, Zustand, shadcn/ui, Tailwind |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | PostgreSQL, Prisma |
| Deploy | Vercel (SPA + serverless API) |
| Tooling | pnpm workspaces, Docker Compose, GitHub Actions |

## Architecture

```
Browser (React SPA)
    │  HTTP /api/*  + session cookie
    ▼
Express API  ──►  PostgreSQL
    │
    ├── Local dev:  server.ts (:3001)
    └── Production: api/index.ts (Vercel serverless)
```

**Monorepo layout**

```
frontend/     React app (Vite dev :5173)
backend/      Express + Prisma
api/          Vercel entry point
```

Frontend and backend never import each other — communication is only through `/api/*`.

**Backend:** `routes → controllers → services → Prisma`  
**Frontend:** `route → hook (Query) → component` — Zustand for cart drawer UI only

Session cart uses an `amazon_session_id` cookie. No login required for MVP.

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Setup

**Prerequisites:** Node 20+, pnpm 9+, Docker

```bash
git clone <repo-url>
cd amazon-e-commerce-platform
pnpm install
cp .env.example .env
docker compose up -d
pnpm run prisma:migrate && pnpm run prisma:seed
pnpm run dev
```

| | URL |
|---|-----|
| App | http://localhost:5173 |
| API | http://localhost:3001/api/health |

Vite proxies `/api` to Express during development.

## Deployment

Single Vercel project — static frontend from `dist/` and API from `api/index.ts`.

1. Connect repo to Vercel
2. Set env vars: `DATABASE_URL` (Neon), `ALLOWED_ORIGINS`, `NODE_ENV=production`
3. Run migrations against production DB once
4. Deploy

```bash
vercel --prod
```

`vercel.json` routes `/api/*` to the serverless function and everything else to the SPA.

## Assumptions

- Auth and payments are mocked — cart/orders use session cookies, orders confirm instantly
- Catalog from DummyJSON (~194 products), prices shown in INR
- Tax 8% · free shipping on orders ≥ ₹499

## Docs

[Architecture](docs/ARCHITECTURE.md) · [API](docs/API.md) · [Plan](docs/PLAN.md) · [Conventions](docs/CONVENTIONS.md)
