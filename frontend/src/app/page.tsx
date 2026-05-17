import Link from 'next/link';
import { Shield, Clock, MapPin } from 'lucide-react';
import { HomeClient } from './home-client';

export const metadata = {
  title: 'RentAuto - Thuê xe cao cấp',
  description:
    'Dịch vụ cho thuê xe cao cấp. Tìm chiếc xe hoàn hảo phù hợp với phong cách và ngân sách của bạn.',
};

export default function HomePage() {
  return <HomeClient />;
}
