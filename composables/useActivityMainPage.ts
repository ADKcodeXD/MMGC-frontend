import type { DayVo } from 'Activity'
import type { MovieVo } from 'Movie'
import { getActivityDays } from '~~/composables/apis/activity'
import { getMovieByActivityId } from '~~/composables/apis/movie'
import { calcZip } from '~~/utils'

export const useActivityMain = () => {
  const days = ref<DayVo[]>()
  const movies = ref<MovieVo[]>([])
  const isLoading = ref(false)
  const currentDay = ref(0)
  const activeVideo = ref<Partial<MovieVo>>({})
  const players = ref<any>([])
  const background = ref<HTMLElement>()
  const currentAnime = ref('left-ro-right')

  const { locale } = useCurrentLocale()
  const route = useRoute()
  const router = useRouter()
  const localeRoute = useLocaleRoute()

  const day = computed(() => {
    return parseInt((route?.query.day && route?.query.day?.toString()) || '') || -1
  })

  const currentDayItem = computed(() => {
    return days.value?.find(item => item.day === currentDay.value) || null
  })

  const coverzip = computed(() => {
    if (currentDayItem.value) {
      return calcZip(currentDayItem.value.themeCover || '', '0.8x')
    }
    return ''
  })

  const updateQueryParam = (param: string, newValue: any) => {
    const url = new URL(window.location.href)
    url.searchParams.set(param, newValue) // 设置新的参数值
    window.history.pushState({}, '', url)
  }

  const handleSwitchDay = (day: number) => {
    currentDay.value = day
    updateQueryParam('day', currentDay.value)
  }

  const nextDay = () => {
    if (days.value && days.value.length > 0) {
      const targetIndex = days.value.findIndex(target => target.day === currentDay.value)
      if (targetIndex === -1) return
      if (targetIndex === days.value.length - 1) {
        currentDay.value = days.value[0].day as any
      } else {
        currentDay.value = days.value[targetIndex + 1].day as any
      }

      updateQueryParam('day', currentDay.value)
    }
  }

  const prevDay = () => {
    if (days.value && days.value.length > 0) {
      const targetIndex = days.value.findIndex(target => target.day === currentDay.value)
      if (targetIndex === -1) return
      if (targetIndex === 0) {
        currentDay.value = days.value[days.value.length - 1].day as any
      } else {
        currentDay.value = days.value[targetIndex - 1].day as any
      }
    }
  }

  const getDays = async (activityId: number) => {
    isLoading.value = true
    try {
      const { data } = await getActivityDays(activityId)
      if (data && data.length > 0) {
        days.value = data.sort((a: any, b: any) => a.sortIndex - b.sortIndex)
        if (day.value && day.value !== -1) {
          currentDay.value = day.value
          return
        } else {
          if (days.value[0].day) {
            currentDay.value = days.value[0].day
            const locale = localeRoute(route.fullPath)
            router.replace({ path: locale?.fullPath, query: { day: days.value[0].day } })
          }
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const getVideoByDay = async (day: number, activityId: number) => {
    isLoading.value = true
    const { data } = await getMovieByActivityId(activityId, day)
    movies.value = data?.result.sort((a, b) => (a.sortIndex || 0) - (b.sortIndex || 0)) || []
    activeVideo.value = (movies.value && movies.value[0]) || null
    players.value = []
    isLoading.value = false
  }

  return {
    days,
    movies,
    isLoading,
    currentDay,
    activeVideo,
    players,
    background,
    currentAnime,
    day,
    currentDayItem,
    coverzip,
    handleSwitchDay,
    nextDay,
    prevDay,
    getDays,
    getVideoByDay,
    locale
  }
}
