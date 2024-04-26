import { storeToRefs } from 'pinia'
import { useGlobalStore } from '~~/stores/global'

export const useCurrentLocale = () => {
  const { localeState } = storeToRefs(useGlobalStore())
  const locale = computed(() => localeState.value) as unknown as Ref<keyof I18N>

  return {
    locale
  }
}

export const useGoMobile = () => {
  const localeRoute = useLocaleRoute()
  const switchLocalePath = useSwitchLocalePath()
  const store = useGlobalStore()

  const goHome = () => {
    const route = localeRoute(`/mobile/welcome`)
    navigateTo(route?.fullPath || '/')
  }

  const goLogin = () => {
    const route = localeRoute(`/mobile/login`)
    navigateTo(route?.fullPath || '/')
  }

  const handleLocale = (command: 'cn' | 'jp' | 'en') => {
    store.setLocale(command)
    switchLocalePath(command)
  }

  return {
    goHome,
    goLogin,
    handleLocale
  }
}
