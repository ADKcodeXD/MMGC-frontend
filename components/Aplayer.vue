<template>
  <ClientOnly>
    <div class="w-full h-full">
      <video-player
        :src="videoUrl"
        controls
        :loop="true"
        :volume="0.6"
        style="width: 100%; height: 100%"
        :poster="cover || ''"
        :on-play="onPlay"
        @abort="onAbort"
        @play="onPlay"
        @pause="onPause"
        @mounted="handleMounted"
      />
    </div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
const player = ref()
defineProps<{
  videoUrl: string
  cover?: string
}>()
const emit = defineEmits(['onPlay', 'onAbort', 'onPause'])
const onPlay = () => {
  emit('onPlay')
}
const onAbort = () => {
  emit('onAbort')
}
const onPause = () => {
  emit('onPause')
}
const handleMounted = (payload: any) => {
  player.value = payload.player
}

const pause = () => {
  if (player.value) {
    player.value.pause()
    emit('onPause')
  }
}
defineExpose({ pause })
</script>
<style lang="scss">
.video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
