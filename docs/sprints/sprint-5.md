# Sprint 5 — Dashboard + SEO + Performance

## Hoàn thành

- Dashboard `/admin/dashboard`:
  - 4 stat cards (totalCars, totalBookings, totalRevenue, activeRentals)
  - Bar chart doanh thu theo ngày (Recharts)
  - Pie chart đơn theo trạng thái (Recharts)
  - 3 admin shortcut links
- SEO:
  - Root metadata + open graph + locale vi_VN
  - Per-page metadata cho `/cars`, `/cars/[id]`
  - Canonical URLs
- Performance:
  - `useMemo` cho query params, dashboard aggregates, chart data
  - `useCallback` cho `formatVND` và handlers truyền vào table
  - ISR (`revalidate=60`) cho car detail

## Demo

- `/admin/dashboard` hiển thị biểu đồ realtime từ booking data
- View source `/cars/[id]` thấy meta title/description đúng
