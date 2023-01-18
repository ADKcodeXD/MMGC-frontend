import { useHttp } from '~/composables/useHttp'

enum Api {
  getConfig = '/config/getConfig'
}

export const getConfig = async () => {
  return await useHttp.get<MMGCSysConfig>(Api.getConfig)
}
