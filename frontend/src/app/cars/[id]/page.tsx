import { Metadata } from 'next';
import { db } from '@/lib/db';
import CarDetailClient from './car-detail-client';

export const revalidate = 60;

export async function generateStaticParams() {
  const cars = db.cars.getAll();
  return cars.slice(0, 10).map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const car = db.cars.getById(parseInt(params.id));
  if (!car) {
    return { title: 'Xe không tồn tại' };
  }
  return {
    title: `${car.name} - ${car.brand} ${car.model}`,
    description: car.description || `Thuê ${car.name} với giá $${car.pricePerDay}/ngày`,
    openGraph: {
      title: `${car.name} | RentAuto`,
      description: car.description,
      images: car.image ? [car.image] : [],
    },
    alternates: {
      canonical: `/cars/${car.id}`,
    },
  };
}

export default function CarDetailPage() {
  return <CarDetailClient />;
}
