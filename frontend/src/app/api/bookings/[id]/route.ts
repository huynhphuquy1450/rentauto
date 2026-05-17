import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, parseIdParam, requireAdmin, requireAuth } from '@/lib/auth';
import {
  updateBookingAdminSchema,
  updateBookingSelfSchema,
} from '@/features/bookings/booking-schema';

function userSafe(u: { password: string } | undefined | null) {
  if (!u) return null;
  const { password: _pw, ...rest } = u;
  return rest;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    const id = parseIdParam(params.id);
    if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);
    const booking = db.bookings.getById(id);
    if (!booking) return apiError('NOT_FOUND', 'Đơn không tồn tại', 404);
    if (auth.role !== 'admin' && auth.sub !== booking.userId) {
      return apiError('FORBIDDEN', 'Không có quyền truy cập', 403);
    }
    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        user: userSafe(db.users.getById(booking.userId)),
        car: db.cars.getById(booking.carId) ?? null,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    const id = parseIdParam(params.id);
    if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);
    const booking = db.bookings.getById(id);
    if (!booking) return apiError('NOT_FOUND', 'Đơn không tồn tại', 404);

    const isAdmin = auth.role === 'admin';
    const isOwner = auth.sub === booking.userId;
    if (!isAdmin && !isOwner) {
      return apiError('FORBIDDEN', 'Không có quyền chỉnh sửa', 403);
    }

    const body = await request.json().catch(() => ({}));
    const schema = isAdmin ? updateBookingAdminSchema : updateBookingSelfSchema;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', parsed.error.issues[0].message, 400);
    }
    if (!isAdmin && booking.status !== 'pending') {
      return apiError('FORBIDDEN', 'Chỉ có thể huỷ đơn đang chờ duyệt', 403);
    }

    const updated = db.bookings.update(id, parsed.data);
    if (!updated) return apiError('NOT_FOUND', 'Đơn không tồn tại', 404);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request);
    const id = parseIdParam(params.id);
    if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);
    const deleted = db.bookings.delete(id);
    if (!deleted) return apiError('NOT_FOUND', 'Đơn không tồn tại', 404);
    return NextResponse.json({ success: true, data: { message: 'Đã xóa đơn' } });
  } catch (err) {
    return handleError(err);
  }
}
