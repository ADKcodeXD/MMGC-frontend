<template>
  <div
    class="body"
    :style="{
      backgroundImage: `url(${activityData?.activityBackgroundImg})`
    }"
  >
    <MMGCHeader class="flex-shrink-0" :activityData="activityData" />
    <div class="flex items-center justify-center" style="height: 79%">
      <NuxtPage :activityId="activityId" />
    </div>
    <MMGCFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activityId = parseInt(route.params.activityId.toString())
const { activityData } = useActivityDetail(activityId)
</script>
<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(@/assets/img/bg.png); // TODO:后期可以做成动态的背景
  background-size: 110% 110%;
  filter: brightness(0.8);
  min-width: 1024px;
}
</style>
