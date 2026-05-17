'use client';

import Link from 'next/link';
import { Shield, Clock, MapPin } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export function HomeClient() {
  const { t } = useSettings();

  return (
    <div className="w-full bg-white dark:bg-dark transition-colors duration-300">
      <section className="relative bg-dark text-white pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop"
            alt="Hero background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('findPerfectRide')} <br />
            <span className="text-primary-500">{t('forAnyJourney')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/cars"
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30"
            >
              {t('browseCars')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('whyChooseUs')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('whyChooseUsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">{t('secureSafe')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('secureSafeDesc')}</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">{t('support')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('supportDesc')}</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">{t('locations')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('locationsDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
