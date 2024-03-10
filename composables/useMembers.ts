import type { MemberVo } from 'Member'
import { useOpenLink } from './useLink'

export const useMemberPop = (memberVO: any) => {
  const noAvatar = computed(() => {
    if (!memberVO.avatar && !memberVO.memberName) {
      return 'Null'
    }
    if (!memberVO.avatar) {
      return memberVO.memberName.slice(0, 1)
    }
    return undefined
  })

  const snsSites = computed(() => {
    return useSnsSites(memberVO.snsSite)
  })

  const openlink = useOpenLink()
  return {
    openlink,
    snsSites,
    noAvatar
  }
}
