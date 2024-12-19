import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';
import tamazight from '../locales/tamazight.json';
// import apiClient from '@/api/apiClient';

// Function to fetch the language from the backend
// const fetchLanguage = async () => {
//   try {
//     const response = await apiClient.get('/get-language/');
//     console.log("Language get successfully:", response.data.language);
//     return response.data.language;
//   } catch (error) {
//     console.error("Error fetching language:", error);
//     return 'en';
//   }
// };

const initializeI18n = async () => {
  // const lang = await fetchLanguage();

  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      zgh: { translation: tamazight },
    },
    lng: 'en',  // Set the language dynamically
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initializeI18n();  // Initialize i18n with the fetched language

export default i18n;
