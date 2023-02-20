<template>
  <div
    class="body"
    ref="body"
    :style="{
      backgroundImage: `onload url(${activityData?.activityBackgroundImg})`
    }"
  >
    <MMGCHeader class="flex-shrink-0" />
    <div class="flex items-center justify-center" style="height: 79%">
      <NuxtPage :activityId="activityId" :transition="{ name: 'page', mode: 'out-in' }" />
    </div>
    <!-- <MMGCFooter /> -->
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activityId = parseInt(route.params.activityId.toString())
const { activityData, getActivity } = useActivityDetail(activityId)
const body = ref<HTMLElement>()
onMounted(async () => {
  const bg = new Image()
  await getActivity(activityId)
  bg.src = activityData.value?.activityBackgroundImg || ''
  bg.onload = () => {
    if (body.value && activityData.value)
      body.value.style.backgroundImage = `url(${activityData.value.activityBackgroundImg})`
  }
})
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(@/assets/img/bg.png);
  background-size: cover;
  filter: brightness(0.8);
  min-width: 1024px;
}
</style>
