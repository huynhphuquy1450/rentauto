'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, Fuel, GitBranch, Calendar, CheckCircle, Shield, Phone, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '@/features/auth/auth-context';
import { useSettings } from '@/lib/settings-context';
import type { Car } from '@/types';

export default function CarDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useSettings();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const { data: car, isLoading } = useQuery<Car>({
    queryKey: ['car', id],
    queryFn: async () => {
      const res = await fetch(`/api/cars/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message);
      return json.data;
    },
  });

  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setTotalPrice(days * car.pricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, car]);

  const formatVND = useCallback(
    (price: number) => (price * 25000).toLocaleString('vi-VN') + ' VNĐ',
    []
  );

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info(t('pleaseLogin'));
      router.push('/login');
      return;
    }
    if (!startDate || !endDate) {
      toast.error(t('selectDates'));
      return;
    }
    if (!phone || !address) {
      toast.error(t('enterContactInfo'));
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          carId: car!.id,
          startDate,
          endDate,
          phone,
          address,
          totalPrice,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message);
      toast.success(t('bookingSuccess'));
      router.push('/my-bookings');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('bookingFailed'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 bg-gray-50 dark:bg-dark min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-20 dark:text-white bg-gray-50 dark:bg-dark min-h-screen">
        {t('carNotFound')}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row border dark:border-gray-700">
          <div className="w-full md:w-2/3">
            <div className="h-64 md:h-96 relative">
              <img
                src={
                  car.image ||
                  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
                }
                alt={car.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h1 className="text-3xl font-bold dark:text-white mb-2">{car.name}</h1>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {car.brand} {car.model}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatVND(car.pricePerDay)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{t('perDay')}</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-white">
                {t('specifications')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <Spec
                  icon={<Users className="w-6 h-6 text-primary-500 mb-2" />}
                  label={t('seats')}
                  value={String(car.seats)}
                />
                <Spec
                  icon={<Fuel className="w-6 h-6 text-primary-500 mb-2" />}
                  label={t('fuel')}
                  value={car.fuelType}
                />
                <Spec
                  icon={<GitBranch className="w-6 h-6 text-primary-500 mb-2" />}
                  label={t('transmission')}
                  value={car.transmission}
                />
                <Spec
                  icon={<CheckCircle className="w-6 h-6 text-primary-500 mb-2" />}
                  label={t('status')}
                  value={t('availableStatus')}
                  valueClass="text-green-600 dark:text-green-400"
                />
              </div>

              <h3 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-white">
                {t('description')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {car.description || t('noDescriptionAvailable')}
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-900/30 p-8 border-l dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('bookThisCarLabel')}</h2>
            <form onSubmit={handleBooking} className="space-y-5">
              <FormField icon={<Calendar className="w-4 h-4 mr-2" />} label={t('pickUpDateLabel')}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </FormField>
              <FormField icon={<Calendar className="w-4 h-4 mr-2" />} label={t('returnDateLabel')}>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  min={startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </FormField>
              <FormField icon={<Phone className="w-4 h-4 mr-2" />} label={t('phoneContactLabel')}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('enterPhone')}
                  className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </FormField>
              <FormField icon={<MapPin className="w-4 h-4 mr-2" />} label={t('addressLabel')}>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('enterAddress')}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                  required
                />
              </FormField>

              {totalPrice > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-600">
                  <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {formatVND(car.pricePerDay)} x{' '}
                      {Math.ceil(
                        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{' '}
                      {t('day')}
                    </span>
                    <span>{formatVND(totalPrice)}</span>
                  </div>
                  <div className="border-t dark:border-gray-700 my-2 pt-2 flex justify-between font-bold text-lg dark:text-white">
                    <span>{t('total')}</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      {formatVND(totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 rounded-xl transition-colors disabled:bg-gray-400"
                disabled={car.status !== 'available'}
              >
                {car.status === 'available' ? t('confirmBookingLabel') : t('carNotAvailable')}
              </button>
            </form>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center flex items-center justify-center">
              <Shield className="w-4 h-4 mr-1" />
              {t('paymentSecure')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
  valueClass = 'dark:text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      {icon}
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function FormField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
