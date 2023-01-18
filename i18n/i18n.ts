import zh from './locales/zh.json'
import en from './locales/en.json'
import jp from './locales/jp.json'

export const message = { zh, en, jp }

export const i18n = {
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  warnHtmlMessage: false,
  messages: message
}
