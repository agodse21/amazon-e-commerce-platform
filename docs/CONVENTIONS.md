# Conventions

Quick reference for how I structure this repo.

## Monorepo

- `frontend/` and `backend/` never import each other
- Root `.env` — backend loads it via `loadEnv.ts` / `dotenv -e ../.env`
- Commands from root: `pnpm run dev`, `pnpm run prisma:migrate`, etc.

## Backend

```
routes → controllers → services → Prisma
```

- Zod validation on routes
- Responses via `utils/response.ts` — no raw `res.json({ error })`
- Prisma only in services
- Multi-step writes in `$transaction` (orders, stock)

## Frontend

- API calls in hooks (`useProducts`, `useCart`, `useWishlist`, …) — not in components
- TanStack Query for server state, Zustand for cart drawer + wishlist badge count
- Routes under `_public/` or `_authenticated/`
- `@/` alias → `frontend/src/`

## UI

Amazon tokens in `tailwind.config.ts` + `index.css`. Yellow Add to Cart, red prices, `#EAEDED` page bg.

Use `ProductImage` for thumbnails. Toasts via `sonner`.

**Responsive:** mobile-first Tailwind (`sm` / `md` / `lg`). Use `.page-container`, `.scrollbar-hide`, `min-w-0` on flex children. Stack sidebars and form grids on small screens; sticky panels only at `lg:`.

**Wishlist:** `WishlistButton` for toggle, `useWishlist` for data, page at `routes/_authenticated/wishlist.tsx` (guest-accessible until auth guard is added).

## Cursor

- Rules: `.cursor/rules/*.mdc`
- Skills: `.cursor/skills/` — code review, Prisma/seed

When I add an endpoint I update `docs/API.md`.
