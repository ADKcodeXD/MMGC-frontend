<template>
  <div class="body" :key="$route.fullPath">
    <MMGCHeader class="flex-shrink-0" />
    <div class="flex items-center justify-center" style="height: 79%">
      <slot></slot>
    </div>
    <div class="back">
      <MyCustomImage :img="currentActivityData?.activityBackgroundImg || placeHolder" />
    </div>
    <!-- <MMGCFooter /> -->
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
import placeHolder from '~/assets/img/bg.png'

const globalState = useGlobalStore()
const { currentActivityData } = globalState
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 1024px;
  overflow: hidden;
}
.back {
  position: absolute;
  width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  z-index: -11;
}
</style>
