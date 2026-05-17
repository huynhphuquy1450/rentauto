export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  seats: number;
  fuelType: string;
  transmission: string;
  pricePerDay: number;
  image: string;
  description: string;
  status: 'available' | 'unavailable';
}

export interface Booking {
  id: number;
  userId: number;
  carId: number;
  startDate: string;
  endDate: string;
  phone: string;
  address: string;
  totalPrice: number;
  status: 'pending' | 'approved' | 'renting' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
