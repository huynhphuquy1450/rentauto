# Sprint 1 — Setup + Architecture base

**Mục tiêu:** Khởi tạo Next.js App Router + TypeScript, port layout + home, thiết lập tooling.

## Hoàn thành

- Migrate Vite SPA sang Next.js 14 App Router + TypeScript
- `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- ESLint (next/core-web-vitals) + Prettier + Husky + lint-staged
- `.env.example`, `.env.local`
- Cấu trúc `src/{app,components,features,hooks,lib,types,utils}`
- Layout root với Inter font, Navbar + Footer port sang TS
- `Providers`: QueryClient + AuthProvider + SettingsProvider + ToastContainer
- Mock data + types trong `src/lib/db.ts` và `src/types/index.ts`

## Risks gặp phải

- Vite assets/`localStorage` trong server components → fix bằng split server/client.

## Demo

`npm run dev` → http://localhost:3000 hiển thị home page với hero + 3 features.
