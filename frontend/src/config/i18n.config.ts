import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/en.json';
import tamazight from '../locales/tamazight.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: es },
    ar: { translation: tamazight },
  },
  lng: localStorage.getItem('lang') || 'en', // Set default language (or use stored language)
  fallbackLng: 'en', // Fallback language if selected language is not available
  interpolation: {
    escapeValue: false, // React already escapes values by default
  },
});

export default i18n;
