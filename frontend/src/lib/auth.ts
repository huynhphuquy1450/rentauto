import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '@/types';

const TOKEN_COOKIE = 'token';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export interface AuthPayload {
  sub: number;
  role: UserRole;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(payload.sub))
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = Number(payload.sub);
    const role = payload.role as UserRole | undefined;
    if (!Number.isInteger(sub) || (role !== 'admin' && role !== 'user')) return null;
    return { sub, role };
  } catch {
    return null;
  }
}

function readTokenFromHeaders(headers: Headers): string | null {
  const cookie = headers.get('cookie');
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  const auth = headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function getAuthFromRequest(request: Request): Promise<AuthPayload | null> {
  const token = readTokenFromHeaders(request.headers);
  if (!token) return null;
  return verifyToken(token);
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export async function requireAuth(request: Request): Promise<AuthPayload> {
  const auth = await getAuthFromRequest(request);
  if (!auth) throw new HttpError(401, 'UNAUTHORIZED', 'Cần đăng nhập');
  return auth;
}

export async function requireAdmin(request: Request): Promise<AuthPayload> {
  const auth = await requireAuth(request);
  if (auth.role !== 'admin') throw new HttpError(403, 'FORBIDDEN', 'Yêu cầu quyền admin');
  return auth;
}

export function apiError(code: string, message: string, status: number) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export function handleError(err: unknown) {
  if (err instanceof HttpError) return apiError(err.code, err.message, err.status);
  console.error('Unhandled API error:', err);
  return apiError('INTERNAL_ERROR', 'Lỗi máy chủ', 500);
}

export function parseIdParam(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_TTL_SECONDS,
    path: '/',
  });
  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set(TOKEN_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
  return response;
}

export const TOKEN_COOKIE_NAME = TOKEN_COOKIE;
