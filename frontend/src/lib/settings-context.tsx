'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'vi' | 'en';
type Theme = 'light' | 'dark';

interface SettingsContextType {
  lang: Lang;
  theme: Theme;
  toggleTheme: () => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    home: 'Home',
    cars: 'Cars',
    dashboard: 'Dashboard',
    myBookings: 'My Bookings',
    login: 'Login',
    logout: 'Logout',
    signUp: 'Sign Up',
    findPerfectRide: 'Find Your Perfect Ride',
    forAnyJourney: 'For Any Journey',
    heroDesc:
      'Experience premium comfort and unmatched reliability with our wide selection of luxury, sports, and family vehicles.',
    browseCars: 'Browse Cars',
    whyChooseUs: 'Why Choose RentAuto?',
    whyChooseUsDesc:
      'We provide the best car rental experience with our premium fleet and exceptional customer service.',
    secureSafe: 'Secure & Safe',
    secureSafeDesc:
      'All our vehicles undergo strict maintenance and safety checks to ensure your peace of mind.',
    support: '24/7 Support',
    supportDesc:
      'Our dedicated team is available around the clock to assist you with any questions or issues.',
    locations: 'Many Locations',
    locationsDesc:
      'Pick up and drop off your rental car at convenient locations across the country.',
    ourFleet: 'Our Fleet',
    fleetDesc: 'Choose from our wide selection of premium vehicles',
    viewDetails: 'View Details',
    bookThisCar: 'Book this Car',
    pickUpDate: 'Pick-up Date',
    returnDate: 'Return Date',
    confirmBooking: 'Confirm Booking',
    notAvailable: 'Not Available',
    totalAmount: 'Total Amount',
    specifications: 'Specifications',
    description: 'Description',
    seats: 'Seats',
    fuel: 'Fuel',
    transmission: 'Transmission',
    status: 'Status',
    signInTitle: 'Sign in to your account',
    createAccount: 'create a new account',
    emailAddress: 'Email address',
    password: 'Password',
    fullName: 'Full Name',
    alreadyAccount: 'Already have an account?',
    signIn: 'Sign in',
    noBookings: "You don't have any bookings yet.",
    totalCars: 'Total Cars',
    totalBookings: 'Total Bookings',
    totalRevenue: 'Total Revenue',
    activeRentals: 'Active Rentals',
    manageCars: 'Manage Cars',
    manageBookings: 'Manage Bookings',
    manageUsers: 'Manage Users',
    or: 'Or',
    loginSuccess: 'Logged in successfully!',
    registrationSuccess: 'Registered successfully!',
    bookingSuccess: 'Booking request sent successfully!',
    pleaseLogin: 'Please login to book a car',
    selectDates: 'Please select pick-up and return dates',
    enterContactInfo: 'Please enter phone number and address/message',
    bookingFailed: 'Booking failed',
    carNotFound: 'Car not found',
    noCarAvailable: 'No cars available at the moment.',
    day: 'day',
    days: 'days',
    total: 'Total',
    confirmBookingLabel: 'Confirm Booking',
    carNotAvailable: 'Car not available',
    paymentSecure: 'Secure Payment & Protected',
    pickUpDateLabel: 'Pick-up Date',
    returnDateLabel: 'Return Date',
    phoneContactLabel: 'Contact Phone',
    addressLabel: 'Delivery Address / Message',
    enterPhone: 'Enter your phone number...',
    enterAddress: 'Enter delivery address or message for us...',
    perDay: '/ day',
    bookThisCarLabel: 'Book this car',
    noDescriptionAvailable: 'No description available for this car.',
    availableStatus: 'Available',
    rentedStatus: 'Rented',
    maintenanceStatus: 'Maintenance',
    theme: 'Theme',
    language: 'Language',
    quickLinks: 'Quick Links',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    allRightsReserved: 'All rights reserved.',
    search: 'Search',
    searchPlaceholder: 'Search by name, brand...',
    filter: 'Filter',
    allBrands: 'All Brands',
    allFuelTypes: 'All Fuel Types',
    priceRange: 'Price Range',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },
  vi: {
    home: 'Trang chủ',
    cars: 'Danh sách xe',
    dashboard: 'Bảng điều khiển',
    myBookings: 'Đơn của tôi',
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    signUp: 'Đăng ký',
    findPerfectRide: 'Tìm Chiếc Xe Hoàn Hảo',
    forAnyJourney: 'Cho Mọi Hành Trình',
    heroDesc:
      'Trải nghiệm sự thoải mái tuyệt đối và độ tin cậy vượt trội với bộ sưu tập xe sang, thể thao và gia đình của chúng tôi.',
    browseCars: 'Xem Danh Sách Xe',
    whyChooseUs: 'Vì Sao Chọn RentAuto?',
    whyChooseUsDesc:
      'Chúng tôi cung cấp dịch vụ thuê xe tốt nhất với đội xe cao cấp và dịch vụ chăm sóc khách hàng xuất sắc.',
    secureSafe: 'An Toàn & Bảo Mật',
    secureSafeDesc: 'Tất cả các xe đều được bảo dưỡng định kỳ và kiểm tra an toàn nghiêm ngặt.',
    support: 'Hỗ Trợ 24/7',
    supportDesc: 'Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.',
    locations: 'Nhiều Địa Điểm',
    locationsDesc: 'Dễ dàng nhận và trả xe tại nhiều địa điểm thuận tiện trên toàn quốc.',
    ourFleet: 'Đội Xe Của Chúng Tôi',
    fleetDesc: 'Thoải mái lựa chọn từ bộ sưu tập xe cao cấp của chúng tôi',
    viewDetails: 'Xem Chi Tiết',
    bookThisCar: 'Đặt Chiếc Xe Này',
    pickUpDate: 'Ngày nhận xe',
    returnDate: 'Ngày trả xe',
    confirmBooking: 'Xác Nhận Đặt Xe',
    notAvailable: 'Đã Hết Chỗ',
    totalAmount: 'Tổng Tiền',
    specifications: 'Thông số kỹ thuật',
    description: 'Mô tả',
    seats: 'Chỗ ngồi',
    fuel: 'Nhiên liệu',
    transmission: 'Hộp số',
    status: 'Trạng thái',
    signInTitle: 'Đăng nhập vào tài khoản',
    createAccount: 'tạo tài khoản mới',
    emailAddress: 'Địa chỉ Email',
    password: 'Mật khẩu',
    fullName: 'Họ và tên',
    alreadyAccount: 'Đã có tài khoản?',
    signIn: 'Đăng nhập',
    noBookings: 'Bạn chưa có đơn đặt xe nào.',
    totalCars: 'Tổng số xe',
    totalBookings: 'Tổng số đơn',
    totalRevenue: 'Tổng doanh thu',
    activeRentals: 'Đang cho thuê',
    manageCars: 'Quản lý Xe',
    manageBookings: 'Quản lý Đơn',
    manageUsers: 'Quản lý Người dùng',
    or: 'hoặc',
    loginSuccess: 'Đăng nhập thành công!',
    registrationSuccess: 'Đăng ký thành công!',
    bookingSuccess: 'Gửi yêu cầu đặt xe thành công!',
    pleaseLogin: 'Vui lòng đăng nhập để đặt xe',
    selectDates: 'Vui lòng chọn ngày nhận và ngày trả',
    enterContactInfo: 'Vui lòng nhập số điện thoại và địa chỉ/lời nhắn',
    bookingFailed: 'Đặt xe thất bại',
    carNotFound: 'Xe không tìm thấy',
    noCarAvailable: 'Hiện không có xe nào khả dụng.',
    day: 'ngày',
    days: 'ngày',
    total: 'Tổng cộng',
    confirmBookingLabel: 'Xác nhận đặt xe',
    carNotAvailable: 'Xe không khả dụng',
    paymentSecure: 'Thanh toán an toàn & Bảo mật',
    pickUpDateLabel: 'Ngày nhận xe',
    returnDateLabel: 'Ngày trả xe',
    phoneContactLabel: 'Số điện thoại liên hệ',
    addressLabel: 'Địa chỉ nhận xe / Lời nhắn',
    enterPhone: 'Nhập số điện thoại của bạn...',
    enterAddress: 'Nhập địa chỉ giao xe hoặc lời nhắn cho chúng tôi...',
    perDay: '/ ngày',
    bookThisCarLabel: 'Đặt xe này',
    noDescriptionAvailable: 'Không có mô tả cho xe này.',
    availableStatus: 'Sẵn sàng',
    rentedStatus: 'Đã cho thuê',
    maintenanceStatus: 'Đang bảo trì',
    theme: 'Giao diện',
    language: 'Ngôn ngữ',
    quickLinks: 'Liên kết nhanh',
    privacyPolicy: 'Chính sách bảo mật',
    termsOfService: 'Điều khoản dịch vụ',
    allRightsReserved: 'Bản quyền được bảo lưu.',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm theo tên, hãng xe...',
    filter: 'Lọc',
    allBrands: 'Tất cả hãng',
    allFuelTypes: 'Tất cả nhiên liệu',
    priceRange: 'Khoảng giá',
    previous: 'Trước',
    next: 'Sau',
    page: 'Trang',
    of: '/',
  },
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('vi');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Lang | null;
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedLang) setLang(savedLang);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleLang = () => setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
  const t = (key: string) => translations[lang][key] || key;

  return (
    <SettingsContext.Provider value={{ lang, theme, toggleTheme, toggleLang, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
