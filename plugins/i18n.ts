import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
import jp from '@/locales/jp.json'
const message = { zh, en, jp }
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  warnHtmlMessage: false,
  messages:message
})
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(i18n)
})
