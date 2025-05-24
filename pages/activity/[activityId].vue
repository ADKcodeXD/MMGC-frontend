<template>
  <div class="bg-black body">
    <Suspense>
      <NuxtLayout>
        <NuxtPage :activityId="activityId" />
      </NuxtLayout>
      <template #fallback>
        <LoadingPage2 />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const activityId = parseInt(route.params.activityId.toString())
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .body {
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    background-image: url(@/assets/img/bg.png);
    background-size: cover;
    min-width: 320px;
    overflow: hidden;
  }
}

@media screen and (min-width: 1024px) {
  .bg {
    min-width: 1024px;
  }
}
</style>
