# RentAuto

Web app cho thuê xe cao cấp xây bằng **Next.js 14 (App Router) + TypeScript + Tailwind**, có auth/phân quyền, CRUD đầy đủ, dashboard biểu đồ, search/filter/pagination, upload ảnh, và testing.

> Thuộc subproject "Phát triển giao diện ứng dụng" — HK2 2026.

## Tính năng

- Auth: đăng ký / đăng nhập / đăng xuất, phân quyền **admin** và **user**
- 3 module CRUD: **Cars**, **Bookings**, **Users**
- Search + filter + pagination cho cars (tên, hãng, nhiên liệu) và bookings (search, status)
- Dashboard admin: stat cards + biểu đồ doanh thu (Bar) + biểu đồ trạng thái đơn (Pie)
- Upload ảnh: preview, kiểm tra type (jpeg/png/webp), kiểm tra size (<= 2MB)
- Form: React Hook Form + Zod
- Data fetching: TanStack Query (cache + invalidate)
- App Router: SSR (cars list), SSG/ISR (`revalidate = 60` cho car detail), metadata + open graph + canonical
- Dark mode + đa ngôn ngữ (vi/en)
- Bảo vệ route: `<AdminGuard>` cho `/admin/*`, redirect `/login?redirect=...` cho route private
- 5+ API routes nội bộ: auth, cars, bookings, users

## Tech stack

| Lớp | Công nghệ |
|---|---|
| Framework | Next.js 14 (App Router) |
| Ngôn ngữ | TypeScript |
| UI | Tailwind CSS, lucide-react |
| Forms | React Hook Form + Zod |
| State | React Context + TanStack Query |
| Charts | Recharts |
| Notifications | react-toastify |
| Tests | Vitest + Testing Library |
| Lint/Format | ESLint (next/core-web-vitals) + Prettier |
| Hooks | Husky + lint-staged |

## Demo

- **Live URL**: https://frontend-seven-mocha-62.vercel.app
- **Repo**: https://github.com/huynhphuquy1450/rentauto

Thử nghiệm các tính năng:
- **Trang chủ**: Xem danh sách xe, search theo tên/hãng/nhiên liệu
- **Chi tiết xe**: Xem thông tin chi tiết, đặt xe (yêu cầu login)
- **Đăng ký / Đăng nhập**: Tạo tài khoản hoặc dùng tài khoản demo
- **Đơn đặt xe**: Xem lịch sử đặt xe, quản lý trạng thái
- **Admin dashboard**: Xem thống kê, biểu đồ doanh thu, quản lý xe/đơn/người dùng

## Tài khoản demo

| Role | Email | Password |
|---|---|---|
| Admin | `admin@admin.com` | `123456` |
| User | `user@test.com` | `123456` |

> **Lưu ý demo**: DB là in-memory (`globalThis`), serverless cold start trên Vercel sẽ reset state. Demo accounts ở bảng trên luôn tồn tại. User/booking tạo runtime có thể mất sau 5-10 phút không hoạt động — đây là giới hạn có chủ đích của bản demo, production sẽ swap sang Postgres + Prisma.

## Setup local

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Mở http://localhost:3000

## Scripts

```bash
npm run dev            # Dev server
npm run build          # Production build
npm run start          # Run prod build
npm run lint           # ESLint
npm run format         # Prettier write
npm run format:check   # Prettier check (CI)
npm run test           # Vitest run once
npm run test:watch     # Vitest watch
```

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes (auth, cars, bookings, users)
│   │   ├── admin/            # Admin pages (guard + dashboard, cars, bookings, users)
│   │   ├── cars/             # /cars (SSR list) + /cars/[id] (SSG/ISR)
│   │   ├── login/, register/, my-bookings/
│   │   ├── layout.tsx        # Root layout (Navbar, Footer, providers)
│   │   └── providers.tsx     # QueryClient, AuthProvider, SettingsProvider
│   ├── components/           # Navbar, Footer, ImageUpload
│   ├── features/             # auth/, cars/ (feature-scoped)
│   ├── hooks/                # use-debounce, use-pagination
│   ├── lib/                  # db (in-memory), settings-context
│   ├── types/                # User, Car, Booking, ApiResponse
│   ├── utils/                # formatters
│   └── middleware.ts         # Route matcher
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
└── package.json
```

## API endpoints

Xem `docs/api.md`.

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| GET/POST | `/api/cars` | List (search/filter/pagination) / Create |
| GET/PUT/DELETE | `/api/cars/[id]` | Detail / Update / Delete |
| GET/POST | `/api/bookings` | List / Create |
| GET/PUT/DELETE | `/api/bookings/[id]` | Detail / Update status / Delete |
| GET/POST | `/api/users` | List / Create |
| GET/PUT/DELETE | `/api/users/[id]` | Detail / Update / Delete |

## Deploy

Khuyến nghị Vercel:

1. Push lên GitHub
2. Connect repo trên Vercel
3. Set env vars (xem `.env.example`)
4. Deploy

**Deployed URL**: TBD (sẽ điền sau khi Vercel deploy xong)

## Lộ trình 6 sprint

Xem `docs/sprints/`.

## Tài liệu

- `docs/architecture.md` — Kiến trúc tổng quan
- `docs/api.md` — API spec
- `docs/schema.md` — Data schema (User, Car, Booking)
- `docs/sprints/sprint-*.md` — Báo cáo từng sprint
