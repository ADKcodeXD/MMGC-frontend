import { ActivityVo } from 'Activity'
import _ from 'lodash'
import { getActivityDetail, getActivityList } from './apis/activity'
export const useActivityList = () => {
  const activityList = ref<PageResult<ActivityVo>>()
  let refreshFn = null
  const pageParams = reactive<PageParams>({
    page: 1,
    pageSize: 20
  })

  const getActivityListFn = async (pageParams: PageParams) => {
    const { data, refresh } = await getActivityList(pageParams)
    if (data) {
      activityList.value = data
      refreshFn = refresh
    }
  }

  onMounted(async () => {
    getActivityListFn(pageParams)
  })

  watchEffect(() => {
    getActivityListFn(pageParams)
  })

  return {
    activityList,
    refreshFn,
    pageParams
  }
}

export const useActivityDetail = (activityId: number) => {
  const activityData = ref<ActivityVo>()
  let refreshFn = null

  const getActivity = async (activityId: number) => {
    const { data, refresh } = await getActivityDetail(activityId)
    if (data) {
      activityData.value = data
      refreshFn = refresh
    }
  }

  watchEffect(async () => {
    await getActivity(activityId)
  })

  return {
    activityData,
    refreshFn,
    getActivity
  }
}
