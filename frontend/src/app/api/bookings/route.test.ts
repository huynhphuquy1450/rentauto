// @vitest-environment node
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { signToken } from '@/lib/auth';
import { db } from '@/lib/db';

describe('/api/bookings', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-do-not-use-in-prod';
  });
  beforeEach(() => {
    for (const key of Object.keys(globalThis as Record<string, unknown>)) {
      if (key.startsWith('__db_')) delete (globalThis as Record<string, unknown>)[key];
    }
  });

  it('GET requires auth', async () => {
    const res = await GET(new Request('http://localhost/api/bookings'));
    expect(res.status).toBe(401);
  });

  it('POST forces userId from token (ignores body userId)', async () => {
    const token = await signToken({ sub: 2, role: 'user' });
    const req = new Request('http://localhost/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: 999,
        carId: 1,
        startDate: '2026-01-01',
        endDate: '2026-01-03',
        phone: '0123',
        address: 'HCM',
        totalPrice: 100,
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data.userId).toBe(2);
  });

  it('paginates correctly with many bookings', async () => {
    for (let i = 0; i < 25; i++) {
      db.bookings.create({
        userId: 2,
        carId: 1,
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-01-02T00:00:00.000Z',
        phone: '0',
        address: 'a',
        totalPrice: 1,
        status: 'pending',
      });
    }
    const token = await signToken({ sub: 1, role: 'admin' });
    const req = new Request('http://localhost/api/bookings?page=2&pageSize=10', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await GET(req);
    const json = await res.json();
    expect(json.data.items.length).toBe(10);
    expect(json.data.totalPages).toBe(Math.ceil(json.data.total / 10));
    for (const item of json.data.items) {
      expect(item.user).toBeTruthy();
      expect(item.car).toBeTruthy();
      expect(item.user.password).toBeUndefined();
    }
  });

  it('regular user only sees own bookings', async () => {
    db.bookings.create({
      userId: 1,
      carId: 1,
      startDate: '2026-01-01T00:00:00.000Z',
      endDate: '2026-01-02T00:00:00.000Z',
      phone: '0',
      address: 'a',
      totalPrice: 1,
      status: 'pending',
    });
    const token = await signToken({ sub: 2, role: 'user' });
    const req = new Request('http://localhost/api/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await GET(req);
    const json = await res.json();
    for (const item of json.data.items) {
      expect(item.userId).toBe(2);
    }
  });
});
