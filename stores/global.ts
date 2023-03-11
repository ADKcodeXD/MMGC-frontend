import { ActivityVo } from 'Activity'
import { defineStore } from 'pinia'
import { getActivityDetail } from '~~/composables/apis/activity'
import { getConfig } from '~~/composables/apis/config'
export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      localeState: useCookie('locale').value || 'cn',
      documentReadyState: true,
      config: null,
      currentActivityData: null
    } as {
      localeState: 'cn' | 'en' | 'jp'
      documentReadyState: boolean
      config: ConfigVo | null
      currentActivityData: ActivityVo | null
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
    async setConfig() {
      const { data } = await getConfig()
      this.config = data
    },
    async setCurrentActivity() {
      if (this.config && this.config.currentActivityId) {
        const { data } = await getActivityDetail(this.config.currentActivityId)
        this.currentActivityData = data || null
      }
    }
  }
})
