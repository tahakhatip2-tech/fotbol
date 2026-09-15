import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Fotbol",
      "matches": "Matches",
      "wallet": "Wallet",
      "login": "Login",
      "register": "Register",
      // ... more translations to follow
    }
  },
  ar: {
    translation: {
      "welcome": "مرحباً بكم في فوتبول",
      "matches": "المباريات",
      "wallet": "المحفظة",
      "login": "تسجيل الدخول",
      "register": "إنشاء حساب",
      // ... more translations to follow
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
