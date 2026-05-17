# Data Schema

## User

```ts
{
  id: number;
  name: string;
  email: string;       // unique
  password: string;    // not exposed via API
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;   // ISO
}
```

## Car

```ts
{
  id: number;
  name: string;
  brand: string;
  model: string;
  seats: number;
  fuelType: string;        // Xăng | Dầu | Điện | Hybrid
  transmission: string;    // Tự động | Số tay
  pricePerDay: number;     // USD
  image: string;           // URL or data URL
  description: string;
  status: 'available' | 'unavailable';
}
```

## Booking

```ts
{
  id: number;
  userId: number;          // → User.id
  carId: number;           // → Car.id
  startDate: string;       // ISO
  endDate: string;         // ISO
  phone: string;
  address: string;
  totalPrice: number;
  status: 'pending' | 'approved' | 'renting' | 'completed' | 'cancelled';
  createdAt: string;       // ISO
}
```

## Quan hệ

```
User (1) ──< Booking >── (1) Car
```

- 1 user có nhiều bookings.
- 1 car có nhiều bookings (theo thời gian).
- Booking tham chiếu user và car qua `userId`, `carId`.

## Lưu trữ

In-memory `globalThis.__db_*` ở `src/lib/db.ts`, seed dữ liệu ban đầu.
Có thể swap sang Prisma + Postgres bằng cách đổi `db.ts`, không cần đụng API routes.
