'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, Menu, X, LogOut, User, Sun, Moon, Globe } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';
import { useSettings } from '@/lib/settings-context';
import { useUIStore } from '@/lib/ui-store';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, lang, toggleLang, t } = useSettings();
  const router = useRouter();
  const pathname = usePathname();
  const { mobileMenuOpen: isOpen, toggleMobileMenu } = useUIStore();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const linkClass = (href: string) =>
    `font-medium transition-colors ${
      pathname === href
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500'
    }`;

  return (
    <nav className="bg-white dark:bg-dark shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-primary-600 dark:text-primary-500 font-bold text-xl"
            >
              <Car className="h-8 w-8 mr-2" />
              RentAuto
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={linkClass('/')}>
              {t('home')}
            </Link>
            <Link href="/cars" className={linkClass('/cars')}>
              {t('cars')}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                    {t('dashboard')}
                  </Link>
                )}
                <Link href="/my-bookings" className={linkClass('/my-bookings')}>
                  {t('myBookings')}
                </Link>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <User className="h-5 w-5 mr-1" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className={linkClass('/login')}>
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-5 py-2 rounded-full font-medium hover:bg-primary-500 transition-colors"
                >
                  {t('signUp')}
                </Link>
              </div>
            )}

            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors p-2 rounded-full"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleLang}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 font-medium transition-colors p-2 rounded-full"
              >
                <Globe className="w-5 h-5 mr-1" />
                {lang.toUpperCase()}
              </button>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => toggleMobileMenu()}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark border-t dark:border-gray-800 pb-4">
          <div className="px-2 pt-2 space-y-1">
            <div className="flex space-x-4 px-3 py-2 border-b dark:border-gray-800 mb-2">
              <button
                onClick={toggleTheme}
                className="flex items-center text-gray-600 dark:text-gray-300"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 mr-2" />
                ) : (
                  <Moon className="w-5 h-5 mr-2" />
                )}
                {t('theme')}
              </button>
              <button
                onClick={toggleLang}
                className="flex items-center text-gray-600 dark:text-gray-300"
              >
                <Globe className="w-5 h-5 mr-2" />
                {t('language')} ({lang.toUpperCase()})
              </button>
            </div>
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300"
            >
              {t('home')}
            </Link>
            <Link
              href="/cars"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300"
            >
              {t('cars')}
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('dashboard')}
                  </Link>
                )}
                <Link
                  href="/my-bookings"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('myBookings')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-500"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-primary-600"
                >
                  {t('signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
