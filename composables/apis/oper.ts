export const likeVideo = async (movieId: number) => {
  const { data, refresh } = await xFetch<ResResult<null>>(
    '/api/oper/likeVideo',
    'post',
    {
      movieId
    },
    true
  )
  return {
    data: data,
    refresh
  }
}

export const pollVideo = async (movieId: number) => {
  const { data, refresh } = await xFetch<ResResult<null>>(
    '/api/oper/pollVideo',
    'post',
    {
      movieId
    },
    true
  )
  return {
    data: data,
    refresh
  }
}

export const cancelVideoLike = async (movieId: number) => {
  const { data, refresh } = await xFetch<ResResult<null>>(
    '/api/oper/cancelLikeVideo',
    'post',
    {
      movieId
    },
    true
  )
  return {
    data: data,
    refresh
  }
}
