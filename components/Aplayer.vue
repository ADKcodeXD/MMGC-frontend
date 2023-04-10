<template>
  <ClientOnly>
    <div class="w-full h-full">
      <video-player
        :src="sources.find(item => item.label === locale)?.src || sources[0].src"
        :loop="false"
        controls
        :volume="0.6"
        :playback-rates="[0.5, 1, 1.5, 2]"
        style="width: 100%; height: 100%"
        :poster="cover || ''"
        :on-play="onPlay"
        :playsinline="true"
        @abort="onAbort"
        @play="onPlay"
        @pause="onPause"
        @mounted="handleMounted"
      >
      </video-player>
    </div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'

const player = ref()
const props = defineProps<{
  videoUrl: string | any[]
  cover?: string
}>()

const { locale } = useCurrentLocale()

const sources = computed(() => {
  if (Array.isArray(props.videoUrl)) {
    return props.videoUrl.map(item => {
      return {
        src: item.url,
        type: 'video/mp4',
        label: item.label
      }
    })
  } else {
    return [
      {
        src: props.videoUrl,
        type: 'video/mp4',
        label: 'current'
      }
    ]
  }
})
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
  const buttom = getButton(payload.player, sources.value)
  payload.player.controlBar.addChild(buttom, {}, 6)
}
const getButton = (player: videojs.Player, videoList: Array<any>): videojs.MenuButton => {
  const MenuButton = videojs.getComponent('MenuButton')
  const Menu = videojs.getComponent('Menu')
  const MenuItem = videojs.getComponent('MenuItem')
  const myMenu = new Menu(player)
  const myMenuItemList: any[] = []
  const { t } = useI18n()
  videoList.forEach((item, index) => {
    myMenuItemList.push(new MenuItem(player, { label: t(item.label) }))
    myMenuItemList[index].on('click', () => {
      player.src(item.src)
      player.load()
      player.play()
    })
    myMenu.addItem(myMenuItemList[index])
  })
  const myMenuButton = new MenuButton(player)
  myMenuButton.addChild(myMenu)
  myMenuButton.controlText(t('switchSource'))
  myMenuButton.addClass('my-menu-button')
  return myMenuButton
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

.my-menu-button > .vjs-button > .vjs-icon-placeholder {
  font-family: VideoJS;
  font-weight: normal;
  font-style: normal;
  &::before {
    content: '\f10e';
  }
}
</style>
