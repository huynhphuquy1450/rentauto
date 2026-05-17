'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Users, Fuel, GitBranch, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/lib/settings-context';
import { useDebounce } from '@/hooks/use-debounce';
import type { Car, PaginatedResponse } from '@/types';

async function fetchCars(params: Record<string, string>): Promise<PaginatedResponse<Car>> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/api/cars?${query}`);
  const json = await res.json();
  return json.data;
}

export default function CarsPage() {
  const { t } = useSettings();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const params = useMemo(
    () => ({
      search: debouncedSearch,
      brand,
      fuelType,
      page: String(page),
      pageSize: '6',
    }),
    [debouncedSearch, brand, fuelType, page]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['cars', params],
    queryFn: () => fetchCars(params),
  });

  const formatVND = useCallback((price: number) => {
    return (price * 25000).toLocaleString('vi-VN') + ' VNĐ';
  }, []);

  const brands = [
    'Mercedes',
    'BMW',
    'Tesla',
    'Toyota',
    'Porsche',
    'Ford',
    'Audi',
    'Hyundai',
    'Honda',
    'VinFast',
  ];
  const fuelTypes = ['Xăng', 'Dầu', 'Điện', 'Hybrid'];

  return (
    <div className="bg-gray-50 dark:bg-dark min-h-screen py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('ourFleet')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('fleetDesc')}</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">{t('allBrands')}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <select
              value={fuelType}
              onChange={(e) => {
                setFuelType(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">{t('allFuelTypes')}</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.items.map((car) => (
                <div
                  key={car.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-transparent dark:border-gray-700"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        car.image ||
                        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary-700 dark:text-primary-400 shadow-sm">
                      {formatVND(car.pricePerDay)}/{t('day')}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {car.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {car.brand} {car.model}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {car.seats} {t('seats')}
                      </div>
                      <div className="flex items-center">
                        <Fuel className="w-4 h-4 mr-2 text-gray-400" />
                        {car.fuelType}
                      </div>
                      <div className="flex items-center">
                        <GitBranch className="w-4 h-4 mr-2 text-gray-400" />
                        {car.transmission}
                      </div>
                    </div>

                    <Link
                      href={`/cars/${car.id}`}
                      className="block w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 text-center font-medium text-primary-600 dark:text-primary-400 rounded-xl group-hover:bg-primary-600 group-hover:text-white dark:group-hover:bg-primary-600 dark:group-hover:text-white transition-colors"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {data && data.items.length === 0 && (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                {t('noCarAvailable')}
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                >
                  {t('previous')}
                </button>
                <span className="text-gray-600 dark:text-gray-300">
                  {t('page')} {data.page} {t('of')} {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                >
                  {t('next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
