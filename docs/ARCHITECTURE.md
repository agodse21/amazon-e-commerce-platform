# Architecture

## What I built

A shopping flow: browse → search → product detail → cart → checkout → order confirmation.

UI follows Amazon patterns (navy header, yellow Add to Cart, buy box on PDP). Not pixel-perfect — close enough for the assignment.

## How it runs

```
Browser (React SPA)
    │  /api/*  + cookies
    ▼
Express (api/index.ts on Vercel, server.ts locally)
    │
    ▼
PostgreSQL (Docker locally, Neon in prod)
```

**Local:** Vite :5173, Express :3001, Postgres :5432  
**Prod:** Vercel serves `dist/` + serverless API from same domain

## Backend layers

```
routes → controllers → services → Prisma
```

Middleware: CORS, session cookie, Zod validation, error handler, rate limit (prod).

Session cart: `sessionMiddleware` sets `amazon_session_id` cookie → `req.sessionId` → cart/order queries.

## Frontend layers

```
route (page) → hook (TanStack Query) → component
```

Zustand only for cart drawer + badge count. Server data stays in Query.

Search suggestions use a plain debounced fetch (`useSearchSuggestions`) — not Query, because it's typeahead noise.

## Buy Now vs Add to Cart

- **Add to Cart** — saves to session cart, opens cart sheet  
- **Buy Now** — `/checkout?productId=&quantity=`, sends `items[]` on order POST, doesn't touch saved cart

## Database

Schema in `backend/prisma/schema.prisma`. Seed pulls categories + products from DummyJSON.

Main tables: `categories`, `products`, `product_images`, `carts`, `cart_items`, `orders`, `order_items`. `users` / `wishlists` exist for future auth.

## Not built yet

- Login/signup (routes stubbed under `_authenticated/`)
- Wishlist API wired up
- Real payments
- Product reviews, admin panel
