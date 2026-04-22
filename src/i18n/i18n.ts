import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./locales/en/common.json"
import ro from "./locales/ro/common.json"
import ru from "./locales/ru/common.json"

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    fallbackLng: "ro",
    lng: "ro",
    resources: {
      en: { translation: en },
      ro: { translation: ro },
      ru: { translation: ru }
    },
    interpolation: {
      escapeValue: false,
    },
  })
}

export default i18n
