import VueVideoPlayer from '@videojs-player/vue'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(VueVideoPlayer as any)
})
