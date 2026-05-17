'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CreditCard, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/auth-context';
import { useSettings } from '@/lib/settings-context';
import type { Booking, Car, PaginatedResponse } from '@/types';

type BookingWithCar = Booking & { car: Car | null };

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const { t } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/my-bookings');
    }
  }, [user, loading, router]);

  const { data, isLoading } = useQuery<PaginatedResponse<BookingWithCar>>({
    queryKey: ['my-bookings', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/bookings?userId=${user!.id}&pageSize=50`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!user,
  });

  const formatVND = (price: number) => (price * 25000).toLocaleString('vi-VN') + ' VNĐ';

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      renting: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      renting: 'Đang thuê',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return map[status] || status;
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center py-20 bg-gray-50 dark:bg-dark min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const bookings = data?.items || [];

  return (
    <div className="bg-gray-50 dark:bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('myBookings')}</h1>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm text-center border dark:border-gray-700">
            <div className="text-gray-500 dark:text-gray-400 mb-4">{t('noBookings')}</div>
            <Link href="/cars" className="text-primary-600 hover:underline font-medium">
              {t('browseCars')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center border dark:border-gray-700"
              >
                <div className="w-full md:w-48 h-32 flex-shrink-0">
                  <img
                    src={
                      booking.car?.image ||
                      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={booking.car?.name || 'Xe'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="flex-grow w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold dark:text-white">
                      {booking.car?.name || 'Tên xe'}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(booking.status)}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    {booking.car?.brand} {booking.car?.model}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      {new Date(booking.startDate).toLocaleDateString('vi-VN')} -{' '}
                      {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-primary-500" />
                      {Math.ceil(
                        (new Date(booking.endDate).getTime() -
                          new Date(booking.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{' '}
                      ngày
                    </div>
                    <div className="flex items-center font-bold dark:text-white">
                      <CreditCard className="w-4 h-4 mr-2 text-primary-500" />
                      Tổng: {formatVND(booking.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
