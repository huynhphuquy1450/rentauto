# Sprint 2 — Auth + Protected Routes

## Hoàn thành

- API routes: `POST /api/auth/login`, `POST /api/auth/register`
- `AuthProvider` (Context) lưu user vào localStorage, expose `login/register/logout`
- Login + Register form: React Hook Form + Zod, error inline
- `<AdminGuard>` trong `app/admin/layout.tsx` redirect non-admin
- `/my-bookings` redirect về `/login?redirect=...` nếu chưa login
- `src/middleware.ts` matcher cho `/admin/*` và `/my-bookings/*`
- Custom hook `useAuth`
- Auth: chọn JWT custom + middleware (`src/middleware.ts` + `src/lib/auth.ts`) thay vì NextAuth — kiểm soát rõ payload và TTL.

## Đầu vào / đầu ra

- Login: email + password → toast success/fail → redirect home hoặc redirect param
- Register: name + email + password (>=6) → tự login

## Demo

- Login với `admin@admin.com`/`123456` → vào `/admin/dashboard`
- Login với `user@test.com`/`123456` → vào `/my-bookings`
- Truy cập `/admin/*` không đủ quyền → redirect `/`
