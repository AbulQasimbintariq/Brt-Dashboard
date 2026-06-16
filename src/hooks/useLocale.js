import { useEffect, useState, useMemo } from 'react';

const translations = {
  en: {
    title: 'BRT DASHBOARD',
    subtitle: 'Real-time transit intelligence system',
    completeInfo: 'Complete Info',
    exportPDF: 'Export PDF',
    lastUpdated: 'Last updated',
    busDetails: 'Bus Details',
    close: 'Close Details',
    totalBuses: 'Total Buses',
    avgSpeed: 'Avg Speed',
    passengers: 'Passengers',
  },
  ur: {
    title: 'بی آر ٹی ڈیش بورڈ',
    subtitle: 'حقیقی وقت ٹرانزٹ انٹیلیجنس سسٹم',
    completeInfo: 'مکمل معلومات',
    exportPDF: 'پی ڈی ایف برآمد کریں',
    lastUpdated: 'آخری تازہ کاری',
    busDetails: 'بس کی تفصیلات',
    close: 'تفصیلات بند کریں',
    totalBuses: 'کل بسیں',
    avgSpeed: 'اوسط رفتار',
    passengers: 'مسافروں کی تعداد',
  },
  ar: {
    title: 'لوحة معلومات BRT',
    subtitle: 'نظام معلومات النقل في الزمن الفعلي',
    completeInfo: 'معلومات كاملة',
    exportPDF: 'تصدير PDF',
    lastUpdated: 'آخر تحديث',
    busDetails: 'تفاصيل الحافلة',
    close: 'إغلاق التفاصيل',
    totalBuses: 'إجمالي الحافلات',
    avgSpeed: 'متوسط السرعة',
    passengers: 'الركاب',
  },
  es: {
    title: 'PANEL BRT',
    subtitle: 'Sistema de inteligencia de tránsito en tiempo real',
    completeInfo: 'Información completa',
    exportPDF: 'Exportar PDF',
    lastUpdated: 'Última actualización',
    busDetails: 'Detalles del autobús',
    close: 'Cerrar detalles',
    totalBuses: 'Autobuses totales',
    avgSpeed: 'Velocidad promedio',
    passengers: 'Pasajeros',
  },
};

const rtlLangs = new Set(['ar', 'he', 'fa', 'ur']);

export function useLocale(defaultLocale = null) {
  const [locale, setLocale] = useState(() => {
    if (defaultLocale) return defaultLocale;
    if (typeof navigator !== 'undefined') return navigator.language.split('-')[0];
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtlLangs.has(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  const dir = useMemo(() => (rtlLangs.has(locale) ? 'rtl' : 'ltr'), [locale]);

  function t(key) {
    return (translations[locale] && translations[locale][key]) || translations.en[key] || key;
  }

  function formatNumber(value, opts = {}) {
    try {
      return new Intl.NumberFormat(locale, opts).format(value);
    } catch (e) {
      return String(value);
    }
  }

  function formatDateTime(date = new Date()) {
    try {
      return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(date));
    } catch (e) {
      return new Date(date).toLocaleTimeString();
    }
  }

  return { locale, setLocale, dir, t, formatNumber, formatDateTime };
}

export default useLocale;
