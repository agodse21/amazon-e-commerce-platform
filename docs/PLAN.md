# Plan

## Done

1. **Scaffold** — pnpm monorepo, Docker Postgres, Prisma, Vercel entry  
2. **Backend** — products, categories, cart, orders APIs + DummyJSON seed  
3. **Catalog UI** — home grid, category filter, sort, navbar/footer  
4. **PDP** — carousel, buy box, specs, Add to Cart / Buy Now  
5. **Cart** — session cart, cart page, cart sheet  
6. **Checkout** — address form, place order, confirmation, order list  
7. **Search + polish** — live search suggestions, category nav dropdowns, Amazon styling  

## Left (if I continue)

- Auth (login/signup, protect `_authenticated/` routes)
- Wishlist CRUD + PDP button
- PDP quantity selector, mobile pass
- Deploy smoke test on Vercel + Neon

## How I add features

**API:** service → controller → route → register in `app.ts` → update `docs/API.md`  
**UI:** types → hook → component → route file

See `docs/CONVENTIONS.md` and `.cursor/rules/`.
