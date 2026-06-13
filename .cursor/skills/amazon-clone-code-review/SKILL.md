---
name: amazon-clone-code-review
description: Use when reviewing my PRs, diffs, or asking if a change looks okay.
---

# Review checklist

I compare changes against `docs/CONVENTIONS.md`.

**Hard no:**
- Prisma outside services
- API calls inside React components
- importing across frontend/backend
- skipping Zod on API input
- secrets in code

**Also look for:**
- new routes documented in `docs/API.md`
- order/stock logic still in a transaction
- axios still has `withCredentials: true`
- diff stays focused — no random refactors

Run `pnpm run type-check && pnpm run lint` before calling it done.
