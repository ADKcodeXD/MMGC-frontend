import type { StatisticsModel } from 'Statistics'

export const getRankList = async (pageParams: PageParams) => {
  const { data, refresh } = await xFetch<PageResult<StatisticsModel>>(
    '/api/statistics/getAuthorRank',
    'post',
    pageParams
  )
  return {
    data: data && data.data,
    refresh
  }
}
