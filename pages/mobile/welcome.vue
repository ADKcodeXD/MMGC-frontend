<template>
  <div class="w-full h-full">
    <div class="bg"></div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
const localeRoute = useLocaleRoute()
const globalState = useGlobalStore()
const { activityData } = useActivityDetail(globalState.config!.currentActivityId)

watch(activityData, () => {
  const route = localeRoute(`/mobile/activity/${activityData.value?.activityId}/about`)
  navigateTo(route?.fullPath || '/')
})
</script>

<style lang="scss" scoped>
.bg {
  width: 100vw;
  height: 100%;
  min-width: 320px;
  overflow: hidden;
  background-image: url(@/assets/2024/newbg.jpg);
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style>
