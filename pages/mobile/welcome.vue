<template>
  <div class="w-full h-full">
    <div class="bg">
      <div class="logo1">
        <MyCustomImage :img="activityData?.activityCover" @load="loadCount++" />
      </div>
      <p class="title cursor-pointer z-10" @click="goActivity">{{ $t('enterMatch') }}</p>
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3" id="mask-circle"></div>
      <div class="circle4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
const localeRoute = useLocaleRoute()
const globalState = useGlobalStore()
const loadCount = ref(0)
const { activityData } = useActivityDetail(
  (globalState.config && globalState.config.currentActivityId) || 2024
)

const goActivity = () => {
  const route = localeRoute(`/mobile/activity/${activityData.value?.activityId}/about`)
  navigateTo(route?.fullPath || '/')
}

onMounted(globalState.unloading)
</script>

<style lang="scss" scoped>
@keyframes move-diagonally {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-80px, 80px);
  }
}

@keyframes rotate-back-and-forth {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes background-image {
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 0px -400px;
  }
}

@keyframes background-image-shin {
  0%,
  100% {
    filter: drop-shadow(0px 0px 15px $themeColor) brightness(1.2);
  }
  50% {
    filter: drop-shadow(0px 0px 30px $themeColorBackShadow) brightness(0.7);
  }
}

.bg {
  width: 100vw;
  height: 100vh;
  min-width: 320px;
  overflow: hidden;
  background-image: url(@/assets/2024/newbg.jpg);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  .circle1,
  .circle2,
  .circle3 {
    position: absolute;
    z-index: 1;
    border-radius: 50%;
    border: 1px solid #6d6d6d;
  }
  .circle1 {
    width: 880px;
    height: 880px;
  }
  .circle2 {
    width: 950px;
    height: 950px;
  }
  .circle3 {
    width: 940px;
    height: 940px;
    border: 27px solid #6d6d6d;
  }
  .circle4 {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    background-image: url(@/assets/2024/霓虹.png);
    background-size: cover;
    background-position: 100px 100px;
    filter: grayscale(1);
    opacity: 0.6;
    mask: url(@/assets/2024/circle.png);
    mask-repeat: no-repeat;
    -webkit-mask-position: 50% 50%;
    mask-position: 50% 50%;
    -webkit-mask-size: 943px 943px;
    mask-size: 943px 943px;
    animation: background-image 30s linear infinite;
  }
}
</style>
