import _ from 'lodash'

interface SiteItem {
  value: string
  icon: string
  color: string
}

export const useOpenLink = () => {
  const openlink = (link: string) => {
    if (window) {
      window.open(link, '_blank')
    }
  }
  return openlink
}

export const useLocaleNavigate = () => {
  const goLocaleUrl = (url: string, query?: any) => {
    const localeRouter = useLocaleRoute()
    const localeRoute = localeRouter({ path: url, query })
    console.log('localeRoute', localeRoute?.query)

    navigateTo(localeRoute?.fullPath)
  }
  return goLocaleUrl
}

export const useSnsSites = (snsSite: Sns | null | undefined) => {
  if (snsSite) {
    const keys = _.keys(snsSite)
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
    return keys
      .map(item => {
        const temp = map[item]
        if (!temp) return null
        if (temp && (snsSite as any)[item]) {
          temp.value = (snsSite as any)[item]
          return temp
        }
        return null
      })
      .filter(item => item) as SiteItem[]
  }
  return [] as SiteItem[]
}
