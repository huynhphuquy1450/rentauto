import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'user']);

export const createUserSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: userRoleSchema.optional(),
  avatar: z.string().optional(),
});

export const updateUserSelfSchema = z
  .object({
    name: z.string().min(2).optional(),
    avatar: z.string().optional(),
  })
  .strict();

export const updateUserAdminSchema = z
  .object({
    name: z.string().min(2).optional(),
    avatar: z.string().optional(),
    email: z.string().email().optional(),
    role: userRoleSchema.optional(),
    password: z.string().min(6).optional(),
  })
  .strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserSelfInput = z.infer<typeof updateUserSelfSchema>;
export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;
