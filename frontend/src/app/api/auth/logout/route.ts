import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, data: { message: 'Đã đăng xuất' } });
  return clearAuthCookie(response);
}
