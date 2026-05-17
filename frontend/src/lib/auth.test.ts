// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { signToken, verifyToken, parseIdParam } from './auth';
import { hashPassword, verifyPassword } from './password';

describe('auth helpers', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-do-not-use-in-prod';
  });

  it('hashes and verifies password (round-trip)', async () => {
    const hash = await hashPassword('hunter2');
    expect(hash).not.toBe('hunter2');
    expect(await verifyPassword('hunter2', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  it('signs and verifies a token', async () => {
    const token = await signToken({ sub: 42, role: 'admin' });
    const payload = await verifyToken(token);
    expect(payload).toEqual({ sub: 42, role: 'admin' });
  });

  it('returns null for tampered tokens', async () => {
    const token = await signToken({ sub: 1, role: 'user' });
    const broken = token.slice(0, -3) + 'aaa';
    expect(await verifyToken(broken)).toBeNull();
    expect(await verifyToken('not.a.jwt')).toBeNull();
  });

  it('parseIdParam accepts positive integers and rejects junk', () => {
    expect(parseIdParam('1')).toBe(1);
    expect(parseIdParam('42')).toBe(42);
    expect(parseIdParam('abc')).toBeNull();
    expect(parseIdParam('-1')).toBeNull();
    expect(parseIdParam('1.5')).toBeNull();
    expect(parseIdParam('')).toBeNull();
  });
});
