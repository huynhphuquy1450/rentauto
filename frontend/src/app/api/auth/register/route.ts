import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, setAuthCookie, signToken } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { registerSchema } from '@/features/auth/auth-schemas';

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const code = issue.path[0] === 'password' ? 'WEAK_PASSWORD' : 'INVALID_INPUT';
      return apiError(code, issue.message, 400);
    }
    const { name, email, password } = parsed.data;

    if (db.users.getByEmail(email)) {
      return apiError('EMAIL_EXISTS', 'Email đã tồn tại', 409);
    }

    const newUser = db.users.create({
      name,
      email,
      password: await hashPassword(password),
      role: 'user',
    });
    const token = await signToken({ sub: newUser.id, role: newUser.role });
    const { password: _pw, ...userSafe } = newUser;

    const response = NextResponse.json(
      { success: true, data: { ...userSafe, token } },
      { status: 201 }
    );
    return setAuthCookie(response, token);
  } catch (err) {
    return handleError(err);
  }
}
