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

// 添加重定向标志，防止无限循环
const hasRedirected = ref(false)

watch(
  activityData,
  () => {
    // 确保只重定向一次，且 activityData 存在且有效
    if (!hasRedirected.value && activityData.value?.activityId) {
      hasRedirected.value = true
      const route = localeRoute(`/activity/${activityData.value.activityId}/about`)
      if (route?.fullPath) {
        navigateTo(route.fullPath)
      }
    }
  },
  { immediate: true }
)

// 如果 5 秒后还没有 activityData，显示错误或默认内容
onMounted(() => {
  setTimeout(() => {
    if (!activityData.value?.activityId && !hasRedirected.value) {
      console.warn('Activity data not loaded, staying on welcome page')
    }
  }, 5000)
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
