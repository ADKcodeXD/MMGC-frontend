import { useGlobalStore } from '~~/stores/global'
import _ from 'lodash'
export default defineNuxtRouteMiddleware(async (to, from) => {
  const state = useGlobalStore()
  if (!_.has(to.meta, 'needLoading') || to.meta.needLoading) {
    state.loading()
  } else {
    state.unloading()
  }
  return
})
