# API Spec

Tất cả response theo format:

```json
{ "success": true, "data": <T> }
{ "success": false, "error": { "code": "STRING", "message": "..." } }
```

## Auth

### POST `/api/auth/login`

Request:
```json
{ "email": "admin@admin.com", "password": "123456" }
```

Response 200:
```json
{ "success": true, "data": { "id": 1, "name": "Admin", "email": "...", "role": "admin", "token": "<JWT HS256, 7-day TTL>" } }
```

Server cũng set httpOnly cookie `token` (cùng giá trị) — middleware/API verify từ cookie, client KHÔNG được phép đọc.

Errors: 400 `INVALID_INPUT`, 401 `INVALID_CREDENTIALS`.

### POST `/api/auth/register`

Request:
```json
{ "name": "Nguyễn A", "email": "a@x.com", "password": "abcdef" }
```

Response 201: tương tự login (user + token + httpOnly cookie set).
Errors: 400, 409 `EMAIL_EXISTS`.

### POST `/api/auth/logout`

Không có request body. Response 200: `{ "success": true }` và clear cookie `token`.

## Cars

### GET `/api/cars?search=&brand=&fuelType=&page=1&pageSize=6`

Response: `PaginatedResponse<Car>` với `items`, `total`, `page`, `pageSize`, `totalPages`.

### POST `/api/cars`

Request: `Omit<Car, 'id'>`. Response 201: car mới.

### GET `/api/cars/[id]` / PUT / DELETE

Standard CRUD. 404 `NOT_FOUND` nếu không tồn tại.

## Bookings

### GET `/api/bookings?userId=&status=&search=&page=&pageSize=`

Response: `PaginatedResponse<Booking & { user, car }>`.

### POST `/api/bookings`

Request:
```json
{ "userId": 2, "carId": 1, "startDate": "2025-01-01", "endDate": "2025-01-03", "phone": "...", "address": "...", "totalPrice": 300 }
```

### PUT `/api/bookings/[id]`

Update bất kỳ field nào (thường là `{ "status": "approved" }`).

### DELETE `/api/bookings/[id]`

## Users

### GET `/api/users?search=&role=&page=&pageSize=`

### POST `/api/users`

### GET / PUT / DELETE `/api/users/[id]`

Password loại khỏi response.

## Status codes

| Code | Mô tả |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | INVALID_INPUT, WEAK_PASSWORD |
| 401 | INVALID_CREDENTIALS |
| 404 | NOT_FOUND |
| 409 | EMAIL_EXISTS |
