import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import tr from './locales/tr';
import en from './locales/en';
import es from './locales/es';

// Dinamik dil yükleme fonksiyonu
export const loadLanguage = async (langCode: string) => {
  try {
    // Önce localStorage'dan kontrol et
    const savedTranslations = localStorage.getItem(`translations_${langCode}`);
    if (savedTranslations) {
      const translations = JSON.parse(savedTranslations);
      i18n.addResourceBundle(langCode, 'translation', translations, true, true);
      return translations;
    }

    // Sonra dosyadan yükle
    if (langCode === 'tr') {
      i18n.addResourceBundle('tr', 'translation', tr, true, true);
      return tr;
    } else if (langCode === 'en') {
      i18n.addResourceBundle('en', 'translation', en, true, true);
      return en;
    } else if (langCode === 'es') {
      i18n.addResourceBundle('es', 'translation', es, true, true);
      return es;
    } else {
      // Yeni dil için dinamik import dene
      try {
        const translationsModule = await import(`./locales/${langCode}`);
        const translations = translationsModule.default || {};
        i18n.addResourceBundle(langCode, 'translation', translations, true, true);
        return translations;
      } catch (error) {
        console.warn(`Language ${langCode} not found, using fallback`);
        // Fallback olarak Türkçe kullan
        i18n.addResourceBundle(langCode, 'translation', tr, true, true);
        return tr;
      }
    }
  } catch (error) {
    console.error(`Error loading language ${langCode}:`, error);
    return tr;
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: {
        translation: tr,
      },
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    fallbackLng: 'tr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Yeni dil ekleme fonksiyonu
export const addLanguage = async (langCode: string, translations: any) => {
  i18n.addResourceBundle(langCode, 'translation', translations, true, true);
  // localStorage'a kaydet
  localStorage.setItem(`translations_${langCode}`, JSON.stringify(translations));
};

export default i18n;

