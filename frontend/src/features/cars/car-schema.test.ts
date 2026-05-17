import { describe, expect, it } from 'vitest';
import { carFormSchema } from './car-schema';

describe('carFormSchema', () => {
  const valid = {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: '3',
    seats: 5,
    fuelType: 'Điện',
    transmission: 'Tự động',
    pricePerDay: 100,
    image: 'data:image/png;base64,xxx',
    description: 'Xe điện',
    status: 'available' as const,
  };

  it('accepts a valid car payload', () => {
    expect(carFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty name', () => {
    const r = carFormSchema.safeParse({ ...valid, name: '' });
    expect(r.success).toBe(false);
  });

  it('rejects negative price', () => {
    const r = carFormSchema.safeParse({ ...valid, pricePerDay: -1 });
    expect(r.success).toBe(false);
  });

  it('coerces string seats to number', () => {
    const r = carFormSchema.safeParse({ ...valid, seats: '7' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.seats).toBe(7);
  });

  it('rejects unknown status', () => {
    const r = carFormSchema.safeParse({ ...valid, status: 'broken' });
    expect(r.success).toBe(false);
  });
});
