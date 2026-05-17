import type { User, Car, Booking } from '@/types';

// bcrypt hash of '123456' (cost 10) — demo accounts only
const SEED_PASSWORD_HASH = '$2b$10$92G95YAiPPtvm2EAox8MQuCq00xcvyvOuxRCp7OgM3A2Zuc10ELzG';

const SEED_USERS: User[] = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@admin.com',
    password: SEED_PASSWORD_HASH,
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Nguyễn Văn A',
    email: 'user@test.com',
    password: SEED_PASSWORD_HASH,
    role: 'user',
    createdAt: '2024-02-15T00:00:00.000Z',
  },
];

const SEED_CARS: Car[] = [
  {
    id: 1,
    name: 'Mercedes-Benz S-Class',
    brand: 'Mercedes',
    model: 'S 500',
    seats: 4,
    fuelType: 'Xăng',
    transmission: 'Tự động',
    pricePerDay: 150,
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop',
    description: 'Trải nghiệm sự sang trọng bậc nhất.',
    status: 'available',
  },
  {
    id: 2,
    name: 'BMW M4 Competition',
    brand: 'BMW',
    model: 'M4',
    seats: 4,
    fuelType: 'Xăng',
    transmission: 'Tự động',
    pricePerDay: 180,
    image:
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=2069&auto=format&fit=crop',
    description: 'Cảm giác lái thể thao tuyệt đỉnh.',
    status: 'available',
  },
  {
    id: 3,
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    seats: 5,
    fuelType: 'Điện',
    transmission: 'Tự động',
    pricePerDay: 100,
    image:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop',
    description: 'Xe điện thông minh.',
    status: 'available',
  },
  {
    id: 4,
    name: 'Toyota Camry 2024',
    brand: 'Toyota',
    model: 'Camry',
    seats: 5,
    fuelType: 'Hybrid',
    transmission: 'Tự động',
    pricePerDay: 70,
    image: 'https://i.pinimg.com/736x/12/4c/3a/124c3a58222e53bc4b47ef54c67ef0dd.jpg',
    description: 'Sedan hạng D quốc dân bền bỉ.',
    status: 'available',
  },
  {
    id: 5,
    name: 'Porsche 911 Carrera',
    brand: 'Porsche',
    model: '911',
    seats: 2,
    fuelType: 'Xăng',
    transmission: 'Tự động',
    pricePerDay: 250,
    image: 'https://i.pinimg.com/736x/26/6a/4c/266a4c0870189a36dffd0a0c9194ddc5.jpg',
    description: 'Biểu tượng xe thể thao.',
    status: 'available',
  },
  {
    id: 6,
    name: 'Ford Ranger Raptor',
    brand: 'Ford',
    model: 'Ranger',
    seats: 5,
    fuelType: 'Dầu',
    transmission: 'Tự động',
    pricePerDay: 120,
    image:
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2070&auto=format&fit=crop',
    description: 'Bán tải hầm hố chinh phục mọi địa hình.',
    status: 'available',
  },
  {
    id: 7,
    name: 'Audi Q8',
    brand: 'Audi',
    model: 'Q8',
    seats: 5,
    fuelType: 'Xăng',
    transmission: 'Tự động',
    pricePerDay: 160,
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2070&auto=format&fit=crop',
    description: 'SUV hạng sang cỡ lớn.',
    status: 'available',
  },
  {
    id: 8,
    name: 'Hyundai Santa Fe',
    brand: 'Hyundai',
    model: 'Santa Fe',
    seats: 7,
    fuelType: 'Dầu',
    transmission: 'Tự động',
    pricePerDay: 80,
    image: 'https://i1-e.pinimg.com/736x/61/42/3d/61423d330ab20ed72892654d4220aabf.jpg',
    description: 'Xe gia đình 7 chỗ rộng rãi.',
    status: 'available',
  },
  {
    id: 9,
    name: 'Honda Civic RS',
    brand: 'Honda',
    model: 'Civic',
    seats: 5,
    fuelType: 'Xăng',
    transmission: 'Tự động',
    pricePerDay: 65,
    image:
      'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=2070&auto=format&fit=crop',
    description: 'Sedan thể thao cá tính.',
    status: 'available',
  },
  {
    id: 10,
    name: 'VinFast VF8',
    brand: 'VinFast',
    model: 'VF8',
    seats: 5,
    fuelType: 'Điện',
    transmission: 'Tự động',
    pricePerDay: 110,
    image:
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2070&auto=format&fit=crop',
    description: 'SUV điện Việt Nam.',
    status: 'available',
  },
];

const SEED_BOOKINGS: Booking[] = [
  {
    id: 1,
    userId: 2,
    carId: 1,
    startDate: '2024-12-01T00:00:00.000Z',
    endDate: '2024-12-03T00:00:00.000Z',
    phone: '0328288177',
    address: 'Quận 7, TP.HCM',
    totalPrice: 450,
    status: 'completed',
    createdAt: '2024-11-28T00:00:00.000Z',
  },
  {
    id: 2,
    userId: 2,
    carId: 3,
    startDate: '2024-12-10T00:00:00.000Z',
    endDate: '2024-12-12T00:00:00.000Z',
    phone: '0328288177',
    address: 'Quận 1, TP.HCM',
    totalPrice: 300,
    status: 'completed',
    createdAt: '2024-12-08T00:00:00.000Z',
  },
  {
    id: 3,
    userId: 2,
    carId: 5,
    startDate: '2025-01-05T00:00:00.000Z',
    endDate: '2025-01-07T00:00:00.000Z',
    phone: '0328288177',
    address: 'Bình Thạnh, TP.HCM',
    totalPrice: 750,
    status: 'renting',
    createdAt: '2025-01-03T00:00:00.000Z',
  },
];

function getStore<T>(key: string, seed: T[]): T[] {
  if (typeof globalThis !== 'undefined' && (globalThis as Record<string, unknown>)[`__db_${key}`]) {
    return (globalThis as Record<string, unknown>)[`__db_${key}`] as T[];
  }
  (globalThis as Record<string, unknown>)[`__db_${key}`] = [...seed];
  return (globalThis as Record<string, unknown>)[`__db_${key}`] as T[];
}

function saveStore<T>(key: string, data: T[]) {
  (globalThis as Record<string, unknown>)[`__db_${key}`] = data;
}

export const db = {
  users: {
    getAll: () => getStore<User>('users', SEED_USERS),
    getById: (id: number) => db.users.getAll().find((u) => u.id === id),
    getByEmail: (email: string) => db.users.getAll().find((u) => u.email === email),
    create: (user: Omit<User, 'id' | 'createdAt'>) => {
      const all = db.users.getAll();
      const newUser: User = {
        ...user,
        id: Math.max(0, ...all.map((u) => u.id)) + 1,
        createdAt: new Date().toISOString(),
      };
      all.push(newUser);
      saveStore('users', all);
      return newUser;
    },
    update: (id: number, data: Partial<User>) => {
      const all = db.users.getAll();
      const idx = all.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data };
      saveStore('users', all);
      return all[idx];
    },
    delete: (id: number) => {
      const all = db.users.getAll();
      const filtered = all.filter((u) => u.id !== id);
      saveStore('users', filtered);
      return filtered.length < all.length;
    },
  },
  cars: {
    getAll: () => getStore<Car>('cars', SEED_CARS),
    getById: (id: number) => db.cars.getAll().find((c) => c.id === id),
    create: (car: Omit<Car, 'id'>) => {
      const all = db.cars.getAll();
      const newCar: Car = { ...car, id: Math.max(0, ...all.map((c) => c.id)) + 1 };
      all.push(newCar);
      saveStore('cars', all);
      return newCar;
    },
    update: (id: number, data: Partial<Car>) => {
      const all = db.cars.getAll();
      const idx = all.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data };
      saveStore('cars', all);
      return all[idx];
    },
    delete: (id: number) => {
      const all = db.cars.getAll();
      const filtered = all.filter((c) => c.id !== id);
      saveStore('cars', filtered);
      return filtered.length < all.length;
    },
  },
  bookings: {
    getAll: () => getStore<Booking>('bookings', SEED_BOOKINGS),
    getById: (id: number) => db.bookings.getAll().find((b) => b.id === id),
    getByUserId: (userId: number) => db.bookings.getAll().filter((b) => b.userId === userId),
    create: (booking: Omit<Booking, 'id' | 'createdAt'>) => {
      const all = db.bookings.getAll();
      const newBooking: Booking = {
        ...booking,
        id: Math.max(0, ...all.map((b) => b.id)) + 1,
        createdAt: new Date().toISOString(),
      };
      all.push(newBooking);
      saveStore('bookings', all);
      return newBooking;
    },
    update: (id: number, data: Partial<Booking>) => {
      const all = db.bookings.getAll();
      const idx = all.findIndex((b) => b.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data };
      saveStore('bookings', all);
      return all[idx];
    },
    delete: (id: number) => {
      const all = db.bookings.getAll();
      const filtered = all.filter((b) => b.id !== id);
      saveStore('bookings', filtered);
      return filtered.length < all.length;
    },
  },
};
