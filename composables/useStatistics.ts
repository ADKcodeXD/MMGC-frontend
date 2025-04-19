import type { StatisticsModel } from 'Statistics'
import { getRankList } from '~/composables/apis/statistics'
import _ from 'lodash'

export const useStatistics = () => {
  const rankList = ref<StatisticsModel[]>([])
  const total = ref(0)
  const showType = ref('platinum')
  const orderCondition = ref<'' | 'reverse'>('')
  const orderField = ref('participateTimes')
  const isLoading = ref(false)
  const body = ref()
  const pageParams = ref({
    page: 1,
    pageSize: 10,
    keyword: undefined
  })

  const goldAuthors = computed(() => {
    return rankList.value.filter(item => item.authorType === 'gold')
  })

  const platinumAuthors = computed(() => {
    return rankList.value.filter(item => item.authorType === 'platinum')
  })

  const getRankListFn = _.debounce(async () => {
    if (isLoading.value) return
    if (total.value > 0 && rankList.value.length >= total.value) {
      return
    }
    try {
      isLoading.value = true
      const data = await getRankList({
        orderRule: orderCondition.value,
        sortRule: orderField.value,
        ...pageParams.value
      })
      if (!data.data) return
      if (rankList.value.length === 0) {
        rankList.value = data.data.result || []
      } else {
        if (data.data.result.length === 0) return
        rankList.value = _.uniqBy([...rankList.value, ...data.data.result], '_id')
      }
      total.value = data.data.total
    } finally {
      isLoading.value = false
    }
  }, 300)

  const isActive = (field: string, order: string) => {
    return field === orderField.value && order === orderCondition.value
  }

  const changeFields = (field: string, order: string) => {
    pageParams.value.page = 1
    pageParams.value.keyword = undefined
    rankList.value = []
    orderField.value = field
    orderCondition.value = order as any
  }

  const handleScroll = _.debounce(() => {
    const bottomOfWindow =
      body.value.scrollTop + body.value.clientHeight >= body.value.scrollHeight - 10
    const notLoad = total.value > 0 && rankList.value.length >= total.value
    if (bottomOfWindow && !isLoading.value && !notLoad) {
      pageParams.value.page++
      getRankListFn()
    }
  }, 300)

  watch([() => pageParams.value.keyword, orderField, orderCondition], () => {
    pageParams.value.page = 1
    rankList.value = []
    getRankListFn()
  })

  onMounted(() => {
    const initBody = () => {
      body.value = document.getElementById('freeBody')
      if (body.value) {
        body.value.addEventListener('scroll', handleScroll)
        body.value.addEventListener('touchmove', handleScroll)
      } else {
        setTimeout(initBody, 100)
      }
    }
    initBody()
    getRankListFn()
  })

  onUnmounted(() => {
    if (body.value) {
      body.value.removeEventListener('scroll', handleScroll)
      body.value.removeEventListener('touchmove', handleScroll)
    }
  })

  return {
    rankList,
    total,
    showType,
    orderCondition,
    orderField,
    isLoading,
    pageParams,
    goldAuthors,
    platinumAuthors,
    getRankListFn,
    isActive,
    changeFields,
    handleScroll
  }
}
