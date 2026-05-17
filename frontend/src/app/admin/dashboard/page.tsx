'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Car, FileText, DollarSign, Activity, Users as UsersIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useSettings } from '@/lib/settings-context';
import type { Booking, Car as CarType, PaginatedResponse } from '@/types';

type BookingWithCar = Booking & { car: CarType | null };

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  approved: '#3b82f6',
  renting: '#6366f1',
  completed: '#10b981',
  cancelled: '#ef4444',
};

export default function DashboardPage() {
  const { t } = useSettings();

  const { data: carsData } = useQuery<PaginatedResponse<CarType>>({
    queryKey: ['admin-cars'],
    queryFn: async () => {
      const res = await fetch('/api/cars?pageSize=100');
      const json = await res.json();
      return json.data;
    },
  });

  const { data: bookingsData } = useQuery<PaginatedResponse<BookingWithCar>>({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings?pageSize=100');
      const json = await res.json();
      return json.data;
    },
  });

  const formatVND = (price: number) => (price * 25000).toLocaleString('vi-VN') + ' VNĐ';

  const stats = useMemo(() => {
    const cars = carsData?.items || [];
    const bookings = bookingsData?.items || [];
    const revenue = bookings
      .filter((b) => b.status === 'completed' || b.status === 'renting')
      .reduce((acc, b) => acc + Number(b.totalPrice || 0), 0);
    const active = bookings.filter((b) => b.status === 'renting').length;
    return {
      totalCars: cars.length,
      totalBookings: bookings.length,
      totalRevenue: revenue,
      activeRentals: active,
    };
  }, [carsData, bookingsData]);

  const statusChartData = useMemo(() => {
    const bookings = bookingsData?.items || [];
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ name: status, value: count }));
  }, [bookingsData]);

  const revenueChartData = useMemo(() => {
    const bookings = bookingsData?.items || [];
    const revenuePerDay: Record<string, number> = {};
    bookings
      .filter((b) => b.status === 'completed' || b.status === 'renting')
      .forEach((b) => {
        const day = new Date(b.startDate).toLocaleDateString('vi-VN');
        revenuePerDay[day] = (revenuePerDay[day] || 0) + Number(b.totalPrice || 0);
      });
    return Object.entries(revenuePerDay)
      .map(([date, revenue]) => ({ date, revenue: revenue * 25000 }))
      .slice(0, 10);
  }, [bookingsData]);

  return (
    <div className="bg-gray-50 dark:bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('dashboard')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            label={t('totalCars')}
            value={stats.totalCars}
            icon={<Car className="text-blue-600 w-6 h-6" />}
            bg="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            label={t('totalBookings')}
            value={stats.totalBookings}
            icon={<FileText className="text-purple-600 w-6 h-6" />}
            bg="bg-purple-100 dark:bg-purple-900/30"
          />
          <StatCard
            label={t('totalRevenue')}
            value={formatVND(stats.totalRevenue)}
            icon={<DollarSign className="text-green-600 w-6 h-6" />}
            bg="bg-green-100 dark:bg-green-900/30"
            valueClass="text-xl"
          />
          <StatCard
            label={t('activeRentals')}
            value={stats.activeRentals}
            icon={<Activity className="text-yellow-600 w-6 h-6" />}
            bg="bg-yellow-100 dark:bg-yellow-900/30"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Doanh thu theo ngày</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip formatter={(v: number) => v.toLocaleString('vi-VN') + ' VNĐ'} />
                <Bar dataKey="revenue" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Đơn theo trạng thái</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusChartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminLink
            href="/admin/cars"
            label={t('manageCars')}
            icon={<Car className="w-8 h-8" />}
          />
          <AdminLink
            href="/admin/bookings"
            label={t('manageBookings')}
            icon={<FileText className="w-8 h-8" />}
          />
          <AdminLink
            href="/admin/users"
            label={t('manageUsers')}
            icon={<UsersIcon className="w-8 h-8" />}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  bg,
  valueClass = 'text-3xl',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">{label}</h3>
        <div className={`${bg} p-3 rounded-xl`}>{icon}</div>
      </div>
      <div className={`${valueClass} font-bold dark:text-white`}>{value}</div>
    </div>
  );
}

function AdminLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-all group flex items-center justify-between"
    >
      <h2 className="text-xl font-bold dark:text-white">{label}</h2>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 dark:text-gray-300">
        {icon}
      </div>
    </Link>
  );
}
