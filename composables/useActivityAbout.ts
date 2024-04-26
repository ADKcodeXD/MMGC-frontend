import _ from 'lodash'
import { useGlobalStore } from '~~/stores/global'

export const useAboutPage = () => {
  const attrs: { activityId: number } = useAttrs() as any
  const { activityData, isLoading } = useActivityDetail(attrs.activityId)
  const { unloading } = useGlobalStore()

  const currentCMIndex = ref(0)
  const isPrev = ref(false)

  const prevCm = () => {
    if (currentCMIndex.value === 0) return
    isPrev.value = true
    currentCMIndex.value--
  }

  const nextCm = () => {
    if (currentCMIndex.value === activityData.value!.activityCM!.length - 1) return
    isPrev.value = false
    currentCMIndex.value++
  }

  const currentItem = computed(() => {
    if (activityData.value) {
      if (activityData.value.activityCM) {
        return activityData.value.activityCM[currentCMIndex.value]
      }
    }
    return null
  })

  watchEffect(() => {
    if (!isLoading.value) {
      unloading()
    }
  })

  return {
    activityData,
    currentItem,
    nextCm,
    prevCm,
    currentCMIndex,
    isLoading,
    isPrev
  }
}
