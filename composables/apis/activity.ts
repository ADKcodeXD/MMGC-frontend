import type { ActivityVo, DayVo } from 'Activity'

export const getActivityDetail = async (activityId: number) => {
  const { data, refresh } = await xFetch<ActivityVo>(
    `/api/activity/getActivityDetail/${activityId}`
  )
  return {
    data: data && data.data,
    refresh
  }
}

export const getActivityList = async (pageParams: PageParams) => {
  const { data, refresh } = await xFetch<PageResult<ActivityVo>>(
    '/api/activity/getActivityList',
    'get',
    pageParams
  )
  return {
    data: data && data.data,
    refresh
  }
}

export const getActivityDays = async (activityId: number) => {
  const { data, refresh } = await xFetch<DayVo[]>('/api/activity/getDays', 'get', {
    activityId
  })
  return {
    data: data && data.data,
    refresh
  }
}
