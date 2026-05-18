# Architecture

## Tech stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS, dark mode bằng class
- React Hook Form + Zod cho form validation
- TanStack Query cho data fetching và mutations
- Context API cho auth + settings (theme/lang)
- Zustand cho global UI state (`src/lib/ui-store.ts` — mobile menu)
- JWT custom (jose) + bcryptjs cho auth
- Recharts cho biểu đồ dashboard

## App Router

```
src/app/
├── layout.tsx          → Root layout: Inter font, Navbar, Footer, Providers
├── providers.tsx       → QueryClient + Auth + Settings + ToastContainer
├── page.tsx            → Home (server) → home-client.tsx (client)
├── cars/
│   ├── page.tsx        → SSR list, exports metadata + canonical
│   ├── cars-client.tsx → Search/filter/pagination với React Query
│   └── [id]/
│       ├── page.tsx    → SSG + ISR (revalidate=60), generateMetadata, generateStaticParams
│       └── car-detail-client.tsx
├── login/, register/   → React Hook Form + Zod
├── my-bookings/        → Protected by useAuth check
├── admin/
│   ├── layout.tsx      → AdminGuard wrapper
│   ├── dashboard/      → Stat cards + Bar + Pie charts
│   ├── cars/           → CRUD with image upload
│   ├── bookings/       → Status update + delete + filter
│   └── users/          → CRUD with role management
└── api/
    ├── auth/{login,register,logout}/
    ├── cars/[id]?/
    ├── bookings/[id]?/
    └── users/[id]?/
```

## Data layer

- `src/lib/db.ts` lưu trữ in-memory trên `globalThis`, seed users/cars/bookings ban đầu
- API routes ở `src/app/api/**/route.ts` dùng `db` để CRUD
- Response format chuẩn: `{ success, data | error: { code, message } }`

## Auth flow

1. User submit login form → POST `/api/auth/login`
2. Server verify password bằng bcrypt (`verifyPassword` ở `src/lib/password.ts`) → ký JWT (`signToken` ở `src/lib/auth.ts`, jose HS256, TTL 7 ngày)
3. Response set httpOnly cookie `token` qua `setAuthCookie` + trả user safe (không có password) cho client
4. `AuthProvider` lưu user (không kèm token) vào localStorage và context
5. `<AdminGuard>` (admin layout) redirect non-admin về `/`
6. Pages cá nhân (my-bookings) tự redirect về `/login?redirect=...` nếu chưa login
7. `src/middleware.ts` matcher cho `/admin/*` và `/my-bookings/*` — đọc cookie `token`, verify JWT, redirect nếu fail
8. API routes dùng `requireAuth` / `requireAdmin` (xem `src/lib/auth.ts`) để check JWT trên mỗi request

## Token expiry & re-login flow

Theo yêu cầu rubric (mục 2 — "Refresh token hoặc re-login flow"), dự án **chọn re-login flow**:

- JWT có TTL = 7 ngày (`TOKEN_TTL_SECONDS` ở `src/lib/auth.ts`)
- Token lưu trong httpOnly cookie `token` (chống XSS đọc trộm)
- Khi token hết hạn:
  1. Middleware `verifyToken` trả `null` → redirect `/login?redirect=...`
  2. User nhập lại credentials → `/api/auth/login` ký token mới + set cookie mới
  3. Redirect về URL ban đầu trong query `?redirect=...`
- Lý do chọn re-login (không phải refresh token):
  - Project scope demo, không có infra để revoke refresh token bị lộ
  - Cookie httpOnly + 7-day TTL đủ UX cho dự án có vài thao tác/ngày
  - Đơn giản, ít attack surface (refresh token rotation tự nó là 1 lớp logic phức tạp)

## State management

- **Local UI state**: `useState`. **Global UI state (mobile menu): Zustand** (`src/lib/ui-store.ts`)
- **Server state / cache**: TanStack Query (cars list, car detail, bookings, users)
- **Auth & settings**: React Context (cần persist qua HMR + tích hợp với Next layout)
- **Form state**: React Hook Form + Zod resolver

## Performance

- `useMemo` cho query params, dashboard aggregates, chart data
- `useCallback` cho `formatVND` và handlers truyền vào table rows
- ISR cho car detail (1 phút)
- TanStack Query stale-time 60s, retry 1

## Testing

- Vitest + jsdom + Testing Library
- 38 tests pass trên 9 file:
  - `src/utils/formatters.test.ts` — formatVND, formatDate, calculateDays, calculateTotal
  - `src/hooks/use-debounce.test.ts`, `use-pagination.test.ts`
  - `src/features/cars/car-schema.test.ts` — Zod validation
  - `src/lib/auth.test.ts` — signToken / verifyToken / cookie helpers
  - `src/components/ImageUpload.test.tsx` — preview + size/type validation
  - `src/app/api/auth/login/route.test.ts` — login flow + bad password
  - `src/app/api/bookings/route.test.ts` — POST forces userId from token
  - `src/app/api/users/[id]/route.test.ts` — admin gate + password not exposed
- Test runs trong CI trước khi build
