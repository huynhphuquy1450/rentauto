# Sprint 3 — Cars CRUD + Upload

## Hoàn thành

- CRUD đầy đủ cho Cars qua `/api/cars` và `/api/cars/[id]`
- Admin page `/admin/cars`: list + search + pagination + modal create/edit + delete
- React Hook Form + Zod (`carFormSchema`)
- React Query mutation: invalidate cache khi create/update/delete
- Component `<ImageUpload>`: preview + check type (jpeg/png/webp) + check size (<=2MB)
- ISR + metadata cho `/cars/[id]` (`revalidate=60`, `generateMetadata`, `generateStaticParams`)

## Demo

- Login admin → `/admin/cars` → thêm xe mới → upload ảnh từ máy → xem trong `/cars`
- Edit/delete car và verify list refresh

## Test

- `car-schema.test.ts`: 5 test cases pass
