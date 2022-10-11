<template>
  <div class="body">
    <MMGCHeader :activityId="activityId" />
    <slot></slot>
    <MMGCFooter />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  activityId?: number
}>()
</script>
<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-image: url(@/assets/img/bg.png); // TODO:后期可以做成动态的背景
  background-size: cover;
  background-position: 20% 40%;
  min-width: 1024px;
  max-width: 1920px;
}
</style>
