import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: {
    default: 'RentAuto - Thuê xe cao cấp',
    template: '%s | RentAuto',
  },
  description:
    'Dịch vụ cho thuê xe cao cấp. Tìm chiếc xe hoàn hảo phù hợp với phong cách và ngân sách của bạn.',
  openGraph: {
    title: 'RentAuto - Thuê xe cao cấp',
    description:
      'Dịch vụ cho thuê xe cao cấp. Tìm chiếc xe hoàn hảo phù hợp với phong cách và ngân sách của bạn.',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
