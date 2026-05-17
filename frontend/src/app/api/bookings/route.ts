import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, requireAuth } from '@/lib/auth';
import { createBookingSchema } from '@/features/bookings/booking-schema';

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    let scopeUserId: number | null = null;
    if (userIdParam) {
      const requested = Number(userIdParam);
      if (!Number.isInteger(requested) || requested <= 0) {
        return apiError('INVALID_INPUT', 'userId không hợp lệ', 400);
      }
      if (auth.role !== 'admin' && auth.sub !== requested) {
        return apiError('FORBIDDEN', 'Không có quyền xem đơn của người khác', 403);
      }
      scopeUserId = requested;
    } else if (auth.role !== 'admin') {
      scopeUserId = auth.sub;
    }

    let bookings =
      scopeUserId !== null ? db.bookings.getByUserId(scopeUserId) : db.bookings.getAll();

    if (status) bookings = bookings.filter((b) => b.status === status);

    if (search) {
      const q = search.toLowerCase();
      const userMap = new Map(db.users.getAll().map((u) => [u.id, u]));
      const carMap = new Map(db.cars.getAll().map((c) => [c.id, c]));
      bookings = bookings.filter((b) => {
        const u = userMap.get(b.userId);
        const c = carMap.get(b.carId);
        return (
          u?.name.toLowerCase().includes(q) ||
          u?.email.toLowerCase().includes(q) ||
          c?.name.toLowerCase().includes(q)
        );
      });
    }

    const total = bookings.length;
    const totalPages = Math.ceil(total / pageSize);
    const slice = bookings.slice((page - 1) * pageSize, page * pageSize);

    const items = slice.map((b) => {
      const u = db.users.getById(b.userId);
      const userPart = u
        ? (() => {
            const { password: _pw, ...rest } = u;
            return rest;
          })()
        : null;
      return { ...b, user: userPart, car: db.cars.getById(b.carId) ?? null };
    });

    return NextResponse.json({
      success: true,
      data: { items, total, page, pageSize, totalPages },
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    const parsed = createBookingSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return apiError('INVALID_INPUT', parsed.error.issues[0].message, 400);
    }
    const { carId, startDate, endDate, phone, address, totalPrice } = parsed.data;

    if (!db.cars.getById(carId)) {
      return apiError('NOT_FOUND', 'Xe không tồn tại', 404);
    }

    const newBooking = db.bookings.create({
      userId: auth.sub,
      carId,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      phone,
      address,
      totalPrice,
      status: 'pending',
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
