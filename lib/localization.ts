// import the original type declarations
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// import all namespaces (for the default language, only)
import fiFI from '../lang/fi-FI.json'
import enGB from '../lang/en-GB.json'

const resources = {
  'fi-FI': {
    ...fiFI
  },
  'en-GB': {
    ...enGB
  }
} as const

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'fi-FI',
    fallbackLng: 'en-GB',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  }).catch((error: any) => {
    console.log(error.message)
  })

export default i18n
