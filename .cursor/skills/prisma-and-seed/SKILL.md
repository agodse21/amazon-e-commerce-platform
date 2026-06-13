---
name: prisma-and-seed
description: Use when I touch the schema, run migrations, or fix seed data.
---

# Prisma

- Schema: `backend/prisma/schema.prisma`
- Seed: `backend/prisma/seed.ts` (pulls from DummyJSON, prices ×83 to INR)
- `DATABASE_URL` in root `.env`

```bash
pnpm run prisma:migrate
pnpm run prisma:seed
pnpm run prisma:studio
```

Seed wipes carts/orders and rebuilds the catalog — fine for dev, don't run blindly in prod.

Categories in DB are flat. Navbar groups are fake — `frontend/src/lib/categoryGroups.ts`.

After a schema change: migrate, then fix services + `frontend/src/types` if needed.

Prisma stays in services only (seed script is the exception).
