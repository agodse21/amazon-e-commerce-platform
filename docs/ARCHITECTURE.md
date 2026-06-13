# Architecture

## What I built

A shopping flow: browse → search → product detail → cart → checkout → order confirmation. Save items to a wishlist along the way.

UI follows Amazon patterns (navy header, yellow Add to Cart, buy box on PDP). Layout is responsive across mobile, tablet, and desktop.

## How it runs

```
Browser (React SPA)
    │  /api/*  + cookies
    ▼
Express (api/index.ts → backend/dist on Vercel, server.ts locally)
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

Session identity: `sessionMiddleware` sets `amazon_session_id` cookie → `req.sessionId` → cart, wishlist, and order queries.

## Frontend layers

```
route (page) → hook (TanStack Query) → component
```

Zustand for cart drawer + badge count, and wishlist item count in the navbar. Server data stays in Query.

Search suggestions use a plain debounced fetch (`useSearchSuggestions`) — not Query, because it's typeahead noise.

## Buy Now vs Add to Cart

- **Add to Cart** — saves to session cart, opens cart sheet  
- **Buy Now** — `/checkout?productId=&quantity=`, sends `items[]` on order POST, doesn't touch saved cart

## Wishlist

Session-based (same cookie as cart). No login required.

- **API:** `GET/POST/DELETE /api/wishlist/*` — see `docs/API.md`
- **Backend:** `wishlistService` keyed by `sessionId` + `productId`
- **Frontend:** `useWishlist` hook, `WishlistButton` on product cards and PDP image, `/wishlist` page with add-to-cart + remove

## Responsive UI

Tailwind breakpoints: `sm` 640px, `md` 768px, `lg` 1024px.

| Area | Mobile | Tablet+ | Desktop |
|------|--------|---------|---------|
| Navbar | Hamburger + mobile menu sheet | Category dropdowns in sub-nav | Full account / orders links |
| Product grid | 2 columns | 3–4 columns | 5 columns |
| PDP | Stacked layout; heart on image | 2-column grid | 3-column + sticky buy box |
| Cart / checkout | Stacked summary below items | — | Side-by-side summary (`lg:`) |
| Cart sheet | Full-width stacked CTA buttons | — | — |

Shared utilities: `.page-container`, `.scrollbar-hide`, `min-w-0` on flex children.

## Database

Schema in `backend/prisma/schema.prisma`. Seed pulls categories + products from DummyJSON.

Main tables: `categories`, `products`, `product_images`, `carts`, `cart_items`, `orders`, `order_items`, `wishlists`. `users` reserved for future auth.

Full design: [docs/DATABASE.md](DATABASE.md).

## Not built yet

- Login/signup (routes stubbed under `_authenticated/`)
- Real payments
- Product reviews, admin panel
