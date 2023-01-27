import { MemberVo } from 'Member'
import _ from 'lodash'
interface SiteItem {
  value: string
  icon: string
  color: string
}
export const useMemberPop = (memberVO: MemberVo) => {
  const noAvatar = computed(() => {
    if (!memberVO.avatar) {
      return memberVO.memberName.slice(0, 1)
    }
    return undefined
  })
  const snsSites = computed<SiteItem[]>(() => {
    if (memberVO.snsSite) {
      const keys = _.keys(memberVO.snsSite)
      const map: Record<string, any> = {
        bilibili: {
          color: '#EC2775',
          icon: 'ri:bilibili-fill'
        },
        niconico: {
          color: '#D4DADA',
          icon: 'simple-icons:niconico'
        },
        youtube: { color: '#4664F0', icon: 'logos:youtube-icon' },
        twitter: { color: '#1D9BF0', icon: 'logos:twitter' },
        personalWebsite: { color: '#E57119', icon: 'material-symbols:broadcast-on-personal' }
      }
      return keys.map(item => {
        const temp = map[item]
        temp.value = (memberVO.snsSite as any)[item]
        return temp
      })
    }
    return []
  })
  const openlink = (link: string) => {
    if (window) {
      window.location.replace(link)
    }
  }
  return {
    openlink,
    snsSites,
    noAvatar
  }
}
