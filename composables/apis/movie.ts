import type { MovieVo } from 'Movie'

export const getMovieByActivityId = async (activityId: number, day: number) => {
  const { data, refresh } = await xFetch<PageResult<MovieVo>>(
    '/api/movie/getMovieByActivityId',
    'get',
    {
      activityId,
      day
    }
  )
  return {
    data: data && data.data,
    refresh
  }
}

export const getMovieDetailById = async (movieId: number) => {
  const { data, refresh } = await xFetch<MovieVo>('/api/movie/getMovieDetail', 'get', {
    movieId
  })
  return {
    data: data && data.data,
    refresh
  }
}
