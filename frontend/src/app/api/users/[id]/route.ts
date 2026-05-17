import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, parseIdParam, requireAdmin, requireAuth } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { updateUserAdminSchema, updateUserSelfSchema } from '@/features/users/user-schema';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    const id = parseIdParam(params.id);
    if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);
    if (auth.role !== 'admin' && auth.sub !== id) {
      return apiError('FORBIDDEN', 'Không có quyền truy cập', 403);
    }
    const user = db.users.getById(id);
    if (!user) return apiError('NOT_FOUND', 'Người dùng không tồn tại', 404);
    const { password: _pw, ...userSafe } = user;
    return NextResponse.json({ success: true, data: userSafe });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request);
    const id = parseIdParam(params.id);
    if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);

    const isAdmin = auth.role === 'admin';
    if (!isAdmin && auth.sub !== id) {
      return apiError('FORBIDDEN', 'Không có quyền chỉnh sửa', 403);
    }

    const body = await request.json().catch(() => ({}));
    const schema = isAdmin ? updateUserAdminSchema : updateUserSelfSchema;
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', parsed.error.issues[0].message, 400);
    }

    const data: Record<string, unknown> = { ...parsed.data };
    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password);
    }
    if (typeof data.email === 'string') {
      const existing = db.users.getByEmail(data.email);
      if (existing && existing.id !== id) {
        return apiError('EMAIL_EXISTS', 'Email đã tồn tại', 409);
      }
    }

    const updated = db.users.update(id, data);
    if (!updated) return apiError('NOT_FOUND', 'Người dùng không tồn tại', 404);
    const { password: _pw, ...userSafe } = updated;
    return NextResponse.json({ success: true, data: userSafe });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request);
    const id = parseIdParam(params.id);
    if (id === null) return apiError('INVALID_INPUT', 'ID không hợp lệ', 400);
    const deleted = db.users.delete(id);
    if (!deleted) return apiError('NOT_FOUND', 'Người dùng không tồn tại', 404);
    return NextResponse.json({ success: true, data: { message: 'Đã xóa người dùng' } });
  } catch (err) {
    return handleError(err);
  }
}
