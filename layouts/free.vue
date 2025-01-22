<template>
  <div class="body" :key="$route.fullPath" ref="body">
    <ClientOnly>
      <MMGCHeader class="flex-shrink-0" />
    </ClientOnly>
    <div class="flex items-center justify-center flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'

const globalState = useGlobalStore()
const { currentActivityData } = globalState
const body = ref()

watchEffect(async () => {
  setTimeout(() => {
    const bg = new Image()
    const { config } = useGlobalStore()
    bg.src = (config?.otherSettings as any)?.bgStatistics || ''
    bg.onload = () => {
      if (body.value && currentActivityData) {
        body.value.style.backgroundImage = `url(${bg.src})`
        body.value.style.backgroundAttachment = 'fixed'
        body.value.style.backgroundSize = 'cover'
        body.value.style.width = '100%'
        body.value.style.overflowX = 'hidden'
        body.value.style.backgroundColor = 'rgba(0, 0, 0, 0.9)' // Add a semi-transparent black background
      }
    }
  }, 0)
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .body {
    width: 100%;
    display: flex;
    flex-direction: column;
    min-width: 320px;
  }
}

@media screen and (min-width: 1024px) {
  .body {
    min-width: 1024px;
  }
}
</style>
