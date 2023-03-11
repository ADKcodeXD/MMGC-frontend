import { storeToRefs } from 'pinia'
import { useGlobalStore } from '~~/stores/global'

export const useCurrentLocale = () => {
  const { localeState } = storeToRefs(useGlobalStore())
  const locale = computed(() => localeState.value) as unknown as keyof I18N

  return {
    locale
  }
}
