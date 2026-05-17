'use client';

import { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useDebounce } from '@/hooks/use-debounce';
import type { Booking, Car, User, PaginatedResponse } from '@/types';

type BookingFull = Booking & { car: Car | null; user: Omit<User, 'password'> | null };

const STATUSES = ['', 'pending', 'approved', 'renting', 'completed', 'cancelled'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  renting: 'Đang thuê',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export default function ManageBookingsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const debounced = useDebounce(search, 300);
  const params = useMemo(
    () => ({ search: debounced, status, page: String(page), pageSize: '10' }),
    [debounced, status, page]
  );

  const { data, isLoading } = useQuery<PaginatedResponse<BookingFull>>({
    queryKey: ['admin-bookings-list', params],
    queryFn: async () => {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/bookings?${qs}`);
      const json = await res.json();
      return json.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: number; newStatus: string }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái');
      qc.invalidateQueries({ queryKey: ['admin-bookings-list'] });
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã xóa đơn');
      qc.invalidateQueries({ queryKey: ['admin-bookings-list'] });
    },
    onError: () => toast.error('Xóa thất bại'),
  });

  const formatVND = (price: number) => (price * 25000).toLocaleString('vi-VN') + ' VNĐ';

  const getStatusColor = (s: string) => {
    const m: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-blue-100 text-blue-800 border-blue-300',
      renting: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return m[s] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 dark:bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold dark:text-white mb-8">Quản lý Đơn</h1>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-6 border dark:border-gray-700">
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
                placeholder="Tìm theo tên khách, email, xe..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {STATUSES.map((s) => (
                <option key={s || 'all'} value={s}>
                  {s ? STATUS_LABELS[s] : 'Tất cả trạng thái'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="p-4 font-semibold dark:text-gray-300">ID</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Khách hàng</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Xe</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Thời gian</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Tổng tiền</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Trạng thái</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : data?.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Chưa có đơn
                    </td>
                  </tr>
                ) : (
                  data?.items.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                    >
                      <td className="p-4 dark:text-gray-300">{b.id}</td>
                      <td className="p-4">
                        <div className="font-medium dark:text-white">{b.user?.name}</div>
                        <div className="text-xs text-gray-500">{b.user?.email}</div>
                        <div className="text-xs text-gray-500">{b.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium dark:text-white">{b.car?.name}</div>
                        <div className="text-xs text-gray-500">
                          {b.car?.brand} {b.car?.model}
                        </div>
                      </td>
                      <td className="p-4 text-sm dark:text-gray-300">
                        <div>{new Date(b.startDate).toLocaleDateString('vi-VN')}</div>
                        <div>đến {new Date(b.endDate).toLocaleDateString('vi-VN')}</div>
                      </td>
                      <td className="p-4 font-medium text-primary-600 dark:text-primary-400">
                        {formatVND(b.totalPrice)}
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            updateStatus.mutate({ id: b.id, newStatus: e.target.value })
                          }
                          className={`text-sm rounded-md p-1.5 border font-medium cursor-pointer ${getStatusColor(b.status)}`}
                        >
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            if (confirm('Xóa đơn này?')) deleteBooking.mutate(b.id);
                          }}
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border disabled:opacity-50 dark:text-white"
            >
              Trước
            </button>
            <span className="dark:text-gray-300">
              Trang {data.page} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="px-4 py-2 rounded-lg border disabled:opacity-50 dark:text-white"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
