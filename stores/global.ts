import { defineStore } from 'pinia'
export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      localeState: useCookie('locale').value || 'cn',
      documentReadyState: true,
      currentActivityId: 2022
    } as {
      localeState: 'cn' | 'en' | 'jp'
      documentReadyState: boolean
      currentActivityId: number
    }
  },
  actions: {
    setLocale(newLocale: 'cn' | 'en' | 'jp') {
      const { $i18n } = useNuxtApp()
      $i18n.setLocale(newLocale)
      const locale = useCookie('locale', {
        maxAge: 3600 * 3600
      })
      locale.value = newLocale
      this.localeState = newLocale
    },
    setCurrentActivityId(activityId: number) {
      this.currentActivityId = activityId
    }
  }
})
