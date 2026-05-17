// @vitest-environment node
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { POST as loginPOST } from './route';

describe('POST /api/auth/login', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-do-not-use-in-prod';
  });
  beforeEach(() => {
    // reset in-memory db so seeded passwords are re-applied
    for (const key of Object.keys(globalThis as Record<string, unknown>)) {
      if (key.startsWith('__db_')) {
        delete (globalThis as Record<string, unknown>)[key];
      }
    }
  });

  function makeReq(body: unknown) {
    return new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('rejects missing email with 400', async () => {
    const res = await loginPOST(makeReq({ password: '123456' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe('INVALID_INPUT');
  });

  it('rejects wrong password with 401', async () => {
    const res = await loginPOST(makeReq({ email: 'admin@admin.com', password: 'wrong' }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns user + token + httpOnly cookie on success', async () => {
    const res = await loginPOST(makeReq({ email: 'admin@admin.com', password: '123456' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.email).toBe('admin@admin.com');
    expect(json.data.role).toBe('admin');
    expect(typeof json.data.token).toBe('string');
    expect(json.data.password).toBeUndefined();

    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toMatch(/token=/);
    expect(setCookie.toLowerCase()).toContain('httponly');
  });
});
