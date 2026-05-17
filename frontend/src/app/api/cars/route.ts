import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiError, handleError, requireAdmin } from '@/lib/auth';
import { createCarSchema } from '@/features/cars/car-schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const brand = searchParams.get('brand') || '';
  const fuelType = searchParams.get('fuelType') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '6');

  let cars = db.cars.getAll();

  if (search) {
    const q = search.toLowerCase();
    cars = cars.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
    );
  }
  if (brand) cars = cars.filter((c) => c.brand === brand);
  if (fuelType) cars = cars.filter((c) => c.fuelType === fuelType);

  const total = cars.length;
  const totalPages = Math.ceil(total / pageSize);
  const items = cars.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({
    success: true,
    data: { items, total, page, pageSize, totalPages },
  });
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const parsed = createCarSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return apiError('INVALID_INPUT', parsed.error.issues[0].message, 400);
    }
    const newCar = db.cars.create(parsed.data);
    return NextResponse.json({ success: true, data: newCar }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
