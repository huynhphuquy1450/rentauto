'use client';

import { useState, useMemo } from 'react';
import { Search, Trash2, Plus, Edit2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useDebounce } from '@/hooks/use-debounce';
import type { User, PaginatedResponse, UserRole } from '@/types';

type SafeUser = Omit<User, 'password'>;

const userSchema = z.object({
  name: z.string().min(2, 'Họ tên >= 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu >= 6 ký tự').optional().or(z.literal('')),
  role: z.enum(['admin', 'user']),
});

type UserForm = z.infer<typeof userSchema>;

export default function ManageUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'' | UserRole>('');
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SafeUser | null>(null);

  const debounced = useDebounce(search, 300);
  const params = useMemo(
    () => ({ search: debounced, role, page: String(page), pageSize: '10' }),
    [debounced, role, page]
  );

  const { data, isLoading } = useQuery<PaginatedResponse<SafeUser>>({
    queryKey: ['admin-users-list', params],
    queryFn: async () => {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/users?${qs}`);
      const json = await res.json();
      return json.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>({ resolver: zodResolver(userSchema) });

  const saveMutation = useMutation({
    mutationFn: async (values: UserForm) => {
      const url = editing ? `/api/users/${editing.id}` : '/api/users';
      const method = editing ? 'PUT' : 'POST';
      const body = editing && !values.password ? { ...values, password: undefined } : values;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message);
      return json;
    },
    onSuccess: () => {
      toast.success(editing ? 'Cập nhật thành công' : 'Thêm thành công');
      qc.invalidateQueries({ queryKey: ['admin-users-list'] });
      setIsOpen(false);
      setEditing(null);
    },
    onError: (err: Error) => toast.error(err.message || 'Thao tác thất bại'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      return res.json();
    },
    onSuccess: () => {
      toast.success('Đã xóa');
      qc.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
    onError: () => toast.error('Xóa thất bại'),
  });

  const handleOpen = (user: SafeUser | null) => {
    setEditing(user);
    if (user) {
      reset({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      reset({ name: '', email: '', password: '', role: 'user' });
    }
    setIsOpen(true);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Quản lý Người dùng</h1>
          <button
            onClick={() => handleOpen(null)}
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            <Plus className="w-5 h-5 mr-2" /> Thêm User
          </button>
        </div>

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
                placeholder="Tìm theo tên, email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none"
              />
            </div>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as '' | UserRole);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border dark:border-gray-700">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <th className="p-4 font-semibold dark:text-gray-300">ID</th>
                <th className="p-4 font-semibold dark:text-gray-300">Tên</th>
                <th className="p-4 font-semibold dark:text-gray-300">Email</th>
                <th className="p-4 font-semibold dark:text-gray-300">Vai trò</th>
                <th className="p-4 font-semibold dark:text-gray-300">Tạo lúc</th>
                <th className="p-4 font-semibold dark:text-gray-300">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                data?.items.map((u) => (
                  <tr key={u.id} className="border-b dark:border-gray-700">
                    <td className="p-4 dark:text-gray-300">{u.id}</td>
                    <td className="p-4 font-medium dark:text-white">{u.name}</td>
                    <td className="p-4 dark:text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpen(u)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Xóa user này?')) deleteMutation.mutate(u.id);
                          }}
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b dark:border-gray-700 flex justify-between">
                <h2 className="text-xl font-bold dark:text-white">
                  {editing ? 'Sửa user' : 'Thêm user'}
                </h2>
                <button onClick={() => setIsOpen(false)}>&times;</button>
              </div>
              <form
                onSubmit={handleSubmit((v) => saveMutation.mutate(v))}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm mb-1 dark:text-gray-300">Họ tên</label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-gray-300">
                    Mật khẩu {editing && '(để trống nếu giữ nguyên)'}
                  </label>
                  <input
                    type="password"
                    {...register('password')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1 dark:text-gray-300">Vai trò</label>
                  <select
                    {...register('role')}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border rounded-md dark:text-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saveMutation.isPending ? '...' : editing ? 'Cập nhật' : 'Thêm'}
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
