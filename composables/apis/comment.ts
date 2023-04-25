import { CommentParams, CommentVo } from 'Comment'

export const getCommentList = async (pageParams: PageParams & { movieId: number }) => {
  const { data, refresh } = await xFetch<PageResult<CommentVo>>(
    '/api/comment/getCommentList',
    'get',
    pageParams
  )
  return {
    data: data && data.data,
    refresh
  }
}

export const addComment = async (commmentParams: CommentParams) => {
  const { data, refresh } = await xFetch<null>('/api/comment/addComment', 'post', commmentParams)
  return {
    data: data,
    refresh
  }
}

export const deleteComment = async (commentId: number) => {
  const { data, refresh } = await xFetch<null>(`/api/comment/deleteComment/${commentId}`, 'delete')
  return {
    data: data && data.data,
    refresh
  }
}
