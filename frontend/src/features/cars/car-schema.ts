import { z } from 'zod';

export const carFormSchema = z.object({
  name: z.string().min(2, 'Tên xe phải có ít nhất 2 ký tự'),
  brand: z.string().min(1, 'Hãng xe là bắt buộc'),
  model: z.string().min(1, 'Model là bắt buộc'),
  seats: z.coerce.number().int().min(1).max(20),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  pricePerDay: z.coerce.number().min(0, 'Giá phải lớn hơn 0'),
  image: z.string().min(1, 'Ảnh là bắt buộc'),
  description: z.string().optional().default(''),
  status: z.enum(['available', 'unavailable']),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export const createCarSchema = carFormSchema;
export const updateCarSchema = carFormSchema.partial();

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
