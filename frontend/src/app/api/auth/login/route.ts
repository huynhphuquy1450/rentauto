import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, setAuthCookie, signToken } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { loginSchema } from '@/features/auth/auth-schemas';

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return apiError('INVALID_INPUT', parsed.error.issues[0].message, 400);
    }
    const { email, password } = parsed.data;

    const user = db.users.getByEmail(email);
    if (!user || !(await verifyPassword(password, user.password))) {
      return apiError('INVALID_CREDENTIALS', 'Sai email hoặc mật khẩu', 401);
    }

    const token = await signToken({ sub: user.id, role: user.role });
    const { password: _pw, ...userSafe } = user;
    const response = NextResponse.json({
      success: true,
      data: { ...userSafe, token },
    });
    return setAuthCookie(response, token);
  } catch (err) {
    return handleError(err);
  }
}
