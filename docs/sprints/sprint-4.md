# Sprint 4 — Bookings + Users + Search/Filter/Pagination

## Hoàn thành

- Bookings CRUD: user create từ `/cars/[id]`, xem `/my-bookings`, admin manage `/admin/bookings`
- Users CRUD: admin tạo/sửa/xóa, đổi role admin/user
- Search + filter + pagination thống nhất trên cars (search, brand, fuelType), bookings (search, status), users (search, role)
- `useDebounce` áp dụng cho input search → giảm fetch redundant
- React Query keys phụ thuộc params → tự refetch

## Demo

- `/cars`: gõ "Tesla" → debounce 300ms → list filter
- `/admin/bookings`: filter "renting" → chỉ hiển thị đơn đang thuê
- Phân trang client-side đồng bộ với API
