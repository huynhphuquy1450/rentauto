// @vitest-environment node
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { PUT } from './route';
import { signToken } from '@/lib/auth';
import { db } from '@/lib/db';

describe('PUT /api/users/[id] — privilege escalation guard', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-do-not-use-in-prod';
  });
  beforeEach(() => {
    for (const key of Object.keys(globalThis as Record<string, unknown>)) {
      if (key.startsWith('__db_')) delete (globalThis as Record<string, unknown>)[key];
    }
  });

  async function call(id: number, body: unknown, token: string) {
    const req = new Request(`http://localhost/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return PUT(req, { params: { id: String(id) } });
  }

  it('blocks regular user from setting role=admin on themselves', async () => {
    const token = await signToken({ sub: 2, role: 'user' });
    const res = await call(2, { role: 'admin', name: 'X' }, token);
    expect(res.status).toBe(400);
    const after = db.users.getById(2);
    expect(after?.role).toBe('user');
  });

  it('blocks regular user from editing another user', async () => {
    const token = await signToken({ sub: 2, role: 'user' });
    const res = await call(1, { name: 'Hacked' }, token);
    expect(res.status).toBe(403);
  });

  it('allows regular user to update their own name', async () => {
    const token = await signToken({ sub: 2, role: 'user' });
    const res = await call(2, { name: 'New Name' }, token);
    expect(res.status).toBe(200);
    expect(db.users.getById(2)?.name).toBe('New Name');
  });

  it('allows admin to change role', async () => {
    const token = await signToken({ sub: 1, role: 'admin' });
    const res = await call(2, { role: 'admin' }, token);
    expect(res.status).toBe(200);
    expect(db.users.getById(2)?.role).toBe('admin');
  });

  it('rejects unauthenticated requests', async () => {
    const req = new Request('http://localhost/api/users/2', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X' }),
    });
    const res = await PUT(req, { params: { id: '2' } });
    expect(res.status).toBe(401);
  });
});
