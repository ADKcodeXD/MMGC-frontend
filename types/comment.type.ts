declare module 'Comment' {
  import type { MemberVo } from 'Member'
  interface CommentModel {
    commentId: number
    content: string // 评论内容
    createTime: number // 评论时间
    movieId: number // 评论的电影id
    memberId: number // 评论人id
    toMemberId: number | null
    parentId: number | null
  }

  interface CommentVo extends Omit<CommentModel, 'memberId' | 'toMemberId' | 'createTime'> {
    memberVo?: MemberVo | null
    toMemberVo?: MemberVo | null
    createTime: string
    children: Array<CommentVo>
  }

  interface CommentParams {
    content: string
    movieId: number
    toMemberId?: number
    parentId?: number
  }
}
