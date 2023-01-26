import cn from './locales/cn.json'
import en from './locales/en.json'
import jp from './locales/jp.json'

export const message = { cn, en, jp }
export const i18n = {
  legacy: false,
  globalInjection: true,
  locale: 'cn',
  warnHtmlMessage: false,
  messages: message
}
