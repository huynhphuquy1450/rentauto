import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, requireAdmin } from '@/lib/auth';
import { createUserSchema } from '@/features/users/user-schema';
import { hashPassword } from '@/lib/password';

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    let users = db.users.getAll().map(({ password: _pw, ...u }) => u);

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (role) users = users.filter((u) => u.role === role);

    const total = users.length;
    const totalPages = Math.ceil(total / pageSize);
    const items = users.slice((page - 1) * pageSize, page * pageSize);

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
    await requireAdmin(request);
    const parsed = createUserSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return apiError('INVALID_INPUT', parsed.error.issues[0].message, 400);
    }
    const { name, email, password, role, avatar } = parsed.data;

    if (db.users.getByEmail(email)) {
      return apiError('EMAIL_EXISTS', 'Email đã tồn tại', 409);
    }

    const newUser = db.users.create({
      name,
      email,
      password: await hashPassword(password),
      role: role ?? 'user',
      ...(avatar ? { avatar } : {}),
    });
    const { password: _pw, ...userSafe } = newUser;
    return NextResponse.json({ success: true, data: userSafe }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
