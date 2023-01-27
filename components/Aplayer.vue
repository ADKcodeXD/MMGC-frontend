<template>
  <ClientOnly>
    <div>
      <video-player
        :src="videoUrl"
        controls
        :loop="true"
        :volume="0.6"
        :width="1200"
        :height="600"
      />
    </div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
let dp = ref()
const props = defineProps<{
  videoUrl: string
}>()
// const randomId = computed(() => {
//   return `dplayer${props.videoUrl}${Math.random() * 150}`
// })
// onBeforeUnmount(() => {})
// watch(props, props => {
//   if (dp.value) {
//     dp.value.switchVideo({
//       url: props.videoUrl,
//       type: 'auto'
//     })
//   }
// })
</script>
<style lang="scss">
.video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
