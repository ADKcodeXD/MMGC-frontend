import { useGlobalStore } from '~~/stores/global'
import _ from 'lodash'
const map = new Map()
export default defineNuxtRouteMiddleware(async (to, from) => {
  const state = useGlobalStore()
  if ((!_.has(to.meta, 'needLoading') || to.meta.needLoading) && !map.has(to.fullPath)) {
    state.loading()
    map.set(to.fullPath, true)
  } else {
    state.unloading()
  }
  return
})
