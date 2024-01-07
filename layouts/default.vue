<template>
  <div class="body" :key="$route.fullPath">
    <ClientOnly>
      <MMGCHeader class="flex-shrink-0" />
    </ClientOnly>
    <div class="flex items-center justify-center" style="height: 79%">
      <slot></slot>
    </div>
    <div class="back">
      <MyCustomImage fit="cover" :img="currentActivityData?.activityBackgroundImg || placeHolder" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
import placeHolder from '~/assets/img/bg.png'

const globalState = useGlobalStore()
const { currentActivityData } = globalState
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 320px;
    overflow: hidden;
  }
  .back {
    position: absolute;
    width: 100vw;
    height: 100%;
    overflow: hidden;
    z-index: -11;
  }
}
@media screen and (min-width: 1024px) {
  .body {
    min-width: 1024px;
  }
}
</style>
