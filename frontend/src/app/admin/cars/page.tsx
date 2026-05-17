'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ImageUpload } from '@/components/ImageUpload';
import { useDebounce } from '@/hooks/use-debounce';
import { carFormSchema, type CarFormValues } from '@/features/cars/car-schema';
import type { Car, PaginatedResponse } from '@/types';

export default function ManageCarsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Car | null>(null);

  const debounced = useDebounce(search, 300);
  const params = useMemo(
    () => ({ search: debounced, page: String(page), pageSize: '8' }),
    [debounced, page]
  );

  const { data, isLoading } = useQuery<PaginatedResponse<Car>>({
    queryKey: ['admin-cars-list', params],
    queryFn: async () => {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/cars?${qs}`);
      const json = await res.json();
      return json.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: '',
      brand: '',
      model: '',
      seats: 4,
      fuelType: 'Xăng',
      transmission: 'Tự động',
      pricePerDay: 0,
      image: '',
      description: '',
      status: 'available',
    },
  });

  const imageValue = watch('image');

  const saveMutation = useMutation({
    mutationFn: async (values: CarFormValues) => {
      if (editing) {
        const res = await fetch(`/api/cars/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        return res.json();
      }
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success(editing ? 'Cập nhật xe thành công' : 'Thêm xe thành công');
      qc.invalidateQueries({ queryKey: ['admin-cars-list'] });
      qc.invalidateQueries({ queryKey: ['cars'] });
      qc.invalidateQueries({ queryKey: ['admin-cars'] });
      handleClose();
    },
    onError: () => toast.error('Thao tác thất bại'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã xóa xe');
      qc.invalidateQueries({ queryKey: ['admin-cars-list'] });
      qc.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: () => toast.error('Xóa thất bại'),
  });

  const handleOpen = (car: Car | null) => {
    setEditing(car);
    if (car) {
      reset(car as CarFormValues);
    } else {
      reset({
        name: '',
        brand: '',
        model: '',
        seats: 4,
        fuelType: 'Xăng',
        transmission: 'Tự động',
        pricePerDay: 0,
        image: '',
        description: '',
        status: 'available',
      });
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa xe này?')) deleteMutation.mutate(id);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Xe</h1>
          <button
            onClick={() => handleOpen(null)}
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            <Plus className="w-5 h-5 mr-2" /> Thêm Xe
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-6 border dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên, hãng, model..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="p-4 font-semibold dark:text-gray-300">ID</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Thông tin xe</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Giá/Ngày</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Trạng thái</th>
                  <th className="p-4 font-semibold dark:text-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : data?.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Không có xe
                    </td>
                  </tr>
                ) : (
                  data?.items.map((car) => (
                    <tr
                      key={car.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                    >
                      <td className="p-4 dark:text-gray-300">{car.id}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-12 h-8 bg-gray-200 rounded overflow-hidden mr-3">
                            {car.image && (
                              <img
                                src={car.image}
                                alt={car.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-bold dark:text-white">{car.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {car.brand} {car.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium dark:text-gray-300">${car.pricePerDay}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${car.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {car.status === 'available' ? 'Sẵn sàng' : 'Không khả dụng'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpen(car)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b dark:border-gray-700 flex justify-between sticky top-0 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-bold dark:text-white">
                  {editing ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
                </h2>
                <button onClick={handleClose} className="text-gray-500">
                  &times;
                </button>
              </div>
              <form
                onSubmit={handleSubmit((v) => saveMutation.mutate(v))}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tên xe" error={errors.name?.message}>
                    <input
                      {...register('name')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </Field>
                  <Field label="Hãng xe" error={errors.brand?.message}>
                    <input
                      {...register('brand')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </Field>
                  <Field label="Model" error={errors.model?.message}>
                    <input
                      {...register('model')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </Field>
                  <Field label="Giá/Ngày (USD)" error={errors.pricePerDay?.message}>
                    <input
                      type="number"
                      step="0.01"
                      {...register('pricePerDay')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </Field>
                  <Field label="Số chỗ" error={errors.seats?.message}>
                    <input
                      type="number"
                      {...register('seats')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </Field>
                  <Field label="Nhiên liệu">
                    <select
                      {...register('fuelType')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option>Xăng</option>
                      <option>Dầu</option>
                      <option>Điện</option>
                      <option>Hybrid</option>
                    </select>
                  </Field>
                  <Field label="Hộp số">
                    <select
                      {...register('transmission')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option>Tự động</option>
                      <option>Số tay</option>
                    </select>
                  </Field>
                  <Field label="Trạng thái">
                    <select
                      {...register('status')}
                      className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="available">Sẵn sàng</option>
                      <option value="unavailable">Không khả dụng</option>
                    </select>
                  </Field>
                </div>

                <Field label="Ảnh xe" error={errors.image?.message}>
                  <ImageUpload
                    value={imageValue}
                    onChange={(v) => setValue('image', v, { shouldValidate: true })}
                  />
                </Field>

                <Field label="Mô tả">
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input-field w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </Field>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 rounded-md dark:text-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saveMutation.isPending ? '...' : editing ? 'Cập nhật xe' : 'Lưu xe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm mb-1 dark:text-gray-300">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
