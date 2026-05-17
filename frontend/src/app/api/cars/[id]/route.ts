import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, parseIdParam, requireAdmin } from '@/lib/auth';
import { updateCarSchema } from '@/features/cars/car-schema';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = parseIdParam(params.id);
  if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);
  const car = db.cars.getById(id);
  if (!car) return apiError('NOT_FOUND', 'Xe không tồn tại', 404);
  return NextResponse.json({ success: true, data: car });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request);
    const id = parseIdParam(params.id);
    if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);
    const parsed = updateCarSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return apiError('INVALID_INPUT', parsed.error.issues[0].message, 400);
    }
    const updated = db.cars.update(id, parsed.data);
    if (!updated) return apiError('NOT_FOUND', 'Xe không tồn tại', 404);
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
    const deleted = db.cars.delete(id);
    if (!deleted) return apiError('NOT_FOUND', 'Xe không tồn tại', 404);
    return NextResponse.json({ success: true, data: { message: 'Đã xóa xe' } });
  } catch (err) {
    return handleError(err);
  }
}
