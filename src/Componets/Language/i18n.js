import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en1 from '../../locales/en.json';
import es1 from '../../locales/es.json';
import hi1 from '../../locales/hi.json';
import pt1 from '../../locales/pt.json';
import zh1 from '../../locales/zh.json';
import fr1 from '../../locales/fr.json';

import LanguageDetector from 'i18next-browser-languagedetector';
i18n 
.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en1},
      es: { translation: es1 },
      hi: { translation: hi1 },
      pt: { translation: pt1 },
      zh: { translation: zh1 },
      fr: { translation: fr1 }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
