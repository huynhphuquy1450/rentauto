'use client';

import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '@/lib/settings-context';

export function Footer() {
  const { t } = useSettings();

  return (
    <footer className="bg-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <div className="flex items-center text-white font-bold text-2xl mb-4">
              <Car className="h-8 w-8 mr-2 text-primary-500" />
              RentAuto
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Dịch vụ cho thuê xe cao cấp cho chuyến đi tiếp theo của bạn. Tìm chiếc xe hoàn hảo phù
              hợp với phong cách và ngân sách của bạn.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-primary-500 transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-primary-500 transition-colors">
                  Tìm Xe Thuê
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Dịch Vụ</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  Thuê xe đi city
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  Đưa đón sân bay
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  Xe đi sự kiện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  Xe Cưới
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Thông Tin Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>Phan Văn Trị, An Nhơn, Thành phố Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary-500" />
                <span>+84 328 288 177</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary-500" />
                <span>Nexus149232@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} RentAuto. {t('allRightsReserved')}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              {t('privacyPolicy')}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t('termsOfService')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
