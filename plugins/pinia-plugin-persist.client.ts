import piniaPersist from 'pinia-plugin-persist'

export default defineNuxtPlugin((nuxtApp: any) => {
  nuxtApp.$pinia.use(piniaPersist)
})
