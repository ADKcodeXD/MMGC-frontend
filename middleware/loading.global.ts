import { storeToRefs } from 'pinia'
import { useGlobalStore } from '~~/stores/global'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const state = storeToRefs(useGlobalStore())
  state.documentReadyState.value = false
  return
})
