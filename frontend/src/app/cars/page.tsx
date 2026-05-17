import { Metadata } from 'next';
import CarsClient from './cars-client';

export const metadata: Metadata = {
  title: 'Danh sách xe',
  description: 'Khám phá đội xe cao cấp đa dạng từ sedan, SUV đến xe thể thao và xe điện.',
  alternates: { canonical: '/cars' },
  openGraph: {
    title: 'Danh sách xe | RentAuto',
    description: 'Khám phá đội xe cao cấp đa dạng từ sedan, SUV đến xe thể thao và xe điện.',
  },
};

export default function CarsPage() {
  return <CarsClient />;
}
