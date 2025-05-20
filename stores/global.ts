import { defineStore } from 'pinia'
import { getActivityDetail } from '~~/composables/apis/activity'
import { getConfig } from '~~/composables/apis/config'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    localeState: 'cn',
    config: {
      currentActivityId: 2025
    },
    currentActivityData: null,
    isLoadingState: false
  }),
  actions: {
    initLocale() {
      const route = useRoute()
      const urlLocale = route.fullPath.split('/')[1]
      const { $i18n } = useNuxtApp()
      const locale = useCookie('locale', { maxAge: 3600 * 3600 })
      if (urlLocale === 'en' || urlLocale === 'jp') {
        $i18n.setLocale(urlLocale)
        locale.value = urlLocale
        this.localeState = urlLocale
      } else {
        $i18n.setLocale('cn')
        locale.value = 'cn'
        this.localeState = 'cn'
      }
    },
    async setConfig() {
      const { data } = await getConfig()
      if (!data) return
      if (data.otherSettings && typeof data.otherSettings === 'string')
        data.otherSettings = JSON.parse(data?.otherSettings || '{}')
      this.config = data
    },
    unloading() {
      this.isLoadingState = false
    },
    loading() {
      this.isLoadingState = true
    },
    setLocale(newLocale: 'cn' | 'en' | 'jp') {
      const { $i18n } = useNuxtApp()
      $i18n.setLocale(newLocale)
      const locale = useCookie('locale', {
        maxAge: 3600 * 3600
      })
      locale.value = newLocale
      this.localeState = newLocale
    },
    async setCurrentActivity() {
      if (this.config && this.config.currentActivityId) {
        try {
          const { data } = await getActivityDetail(this.config.currentActivityId)
          this.currentActivityData = data || null
        } catch (error) {
          this.currentActivityData = null
        }
      }
    }
  }
})
