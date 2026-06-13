# Decisions

Short notes on why I built it this way.

## Stack

**React + Vite** — SPA fits Vercel static deploy; faster dev than Next for this scope.  
**TanStack Router** — file-based routes, type-safe search params.  
**TanStack Query** — server state + cache; cart/wishlist stay on API, not duplicated in Zustand.  
**Express** — simple REST API; `api/index.ts` imports compiled `backend/dist` on Vercel.  
**Prisma + PostgreSQL** — typed DB access; Neon in prod, Docker locally.  
**pnpm workspaces** — one repo, shared scripts, clean dependency isolation.

## Architecture

**Monorepo, no cross-imports** — frontend and backend only talk over `/api/*`.  
**Layered backend** — routes → controllers → services → Prisma. Keeps controllers thin.  
**Session cookie identity** — no auth for MVP; `amazon_session_id` ties cart, wishlist, and orders to browser.  
**Single Vercel project** — `dist/` SPA + `api/index.ts` serverless, same origin = no CORS pain.

## Data

**DummyJSON seed** — real-ish catalog without hand-writing 200 products.  
**Flat categories in DB** — navbar groups are UI-only in `categoryGroups.ts`.  
**Buy Now via `items[]`** — checkout one product without polluting saved cart.  
**Wishlist by session** — `wishlists.session_id` + unique `(session_id, product_id)`; `userId` nullable for future auth.

## UI

**Mobile-first Tailwind** — progressive disclosure in navbar; grids and sidebars stack until `lg:`.  
**Wishlist heart on image** — PDP button overlays carousel, not buy box (keeps CTAs full-width).  
**Cart sheet links** — `Button asChild` + `Link` for full-width stacked footer buttons.

## Deferred

Auth, payments, product reviews — schema/routes stubbed where useful.
