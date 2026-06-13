# Plan

## Done

1. **Scaffold** — pnpm monorepo, Docker Postgres, Prisma, Vercel entry  
2. **Backend** — products, categories, cart, orders, wishlist APIs + DummyJSON seed  
3. **Catalog UI** — home grid, category filter, sort, navbar/footer  
4. **PDP** — carousel, buy box, specs, Add to Cart / Buy Now  
5. **Cart** — session cart, cart page, cart sheet  
6. **Checkout** — address form, place order, confirmation, order list  
7. **Search + polish** — live search suggestions, category nav dropdowns, Amazon styling  
8. **Wishlist** — session API, heart toggle on cards/PDP, `/wishlist` page, navbar badge  
9. **Responsive** — mobile menu, adaptive grids, stacked cart/checkout/forms on small screens  

## Left (if I continue)

- Auth (login/signup, protect `_authenticated/` routes, migrate session cart/wishlist to user)
- PDP quantity selector
- Backend perf (Neon pooler, cache headers, composite indexes)
- Deploy smoke test on Vercel + Neon

## How I add features

**API:** service → controller → route → register in `app.ts` → update `docs/API.md`  
**UI:** types → hook → component → route file

See `docs/CONVENTIONS.md` and `.cursor/rules/`.
