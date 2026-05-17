# Sprint 6 — Testing + CI/CD + Docs

## Hoàn thành

- Vitest + Testing Library + jsdom config
- Unit tests:
  - `formatters.test.ts` — formatVND, formatDate, calculateDays, calculateTotal
  - `use-debounce.test.ts` — fake timers, debounce/cancel
  - `use-pagination.test.ts` — empty/middle/last page
  - `car-schema.test.ts` — Zod validation cho car form
- GitHub Actions CI (`.github/workflows/ci.yml`): lint → format check → test → build
- Husky pre-commit chạy `lint-staged`
- Docs:
  - `README.md` — đầy đủ tính năng, tech stack, setup, scripts, demo accounts
  - `docs/architecture.md` — kiến trúc + folder layout
  - `docs/api.md` — endpoints + response format
  - `docs/schema.md` — User/Car/Booking
  - `docs/sprints/sprint-1..6.md` — báo cáo từng sprint

## Deploy

Khuyến nghị Vercel: connect repo, set env vars, deploy.

**Deploy URL**: https://frontend-seven-mocha-62.vercel.app (Vercel, region iad1)

## Verification

```bash
npm run lint
npm run format:check
npm run test
npm run build
```
