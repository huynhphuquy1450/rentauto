import { z } from 'zod';

const isoDateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: 'Ngày không hợp lệ' });

export const bookingStatusSchema = z.enum([
  'pending',
  'approved',
  'renting',
  'completed',
  'cancelled',
]);

export const createBookingSchema = z.object({
  carId: z.coerce.number().int().positive('carId không hợp lệ'),
  startDate: isoDateString,
  endDate: isoDateString,
  phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  totalPrice: z.coerce.number().nonnegative(),
});

export const updateBookingAdminSchema = z
  .object({
    status: bookingStatusSchema.optional(),
    startDate: isoDateString.optional(),
    endDate: isoDateString.optional(),
    phone: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    totalPrice: z.coerce.number().nonnegative().optional(),
  })
  .strict();

export const updateBookingSelfSchema = z
  .object({
    status: z.literal('cancelled'),
  })
  .strict();

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingAdminInput = z.infer<typeof updateBookingAdminSchema>;
