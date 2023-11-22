<template>
  <Transition name="circle" mode="out-in">
    <div
      class="flex items-center justify-center flex-col fixed top-0 left-0 bottom-0 right-0 loadingwrapper"
      v-if="state.isLoadingState"
    >
      <div class="glow">
        <div class="logo2"></div>
      </div>
      <div class="quan">
        <div class="quan2" :style="{ width: `${loadingPencentage}%` }"></div>
      </div>
      <p class="sub-title mt-3">玩命加载中</p>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'

const loadingPencentage = ref(0)
const interval = ref<any>()
const timeout = ref<any>()
const state = useGlobalStore()
watch(
  () => state.isLoadingState,
  () => {
    if (!state.isLoadingState) {
      loadingPencentage.value = 100
    } else {
      loadingPencentage.value = 0
      if (process.client) {
        interval.value = setInterval(() => {
          if (!state.isLoadingState) loadingPencentage.value += 10
          if (loadingPencentage.value < 99) loadingPencentage.value++
          else clearInterval(interval.value)
        }, 40)
        timeout.value = setTimeout(() => {
          state.unloading()
          clearTimeout(timeout.value)
        }, 10000)
      }
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .loadingwrapper {
    background-color: #050505;
    z-index: 10000;
    border-radius: 50%;
    width: 120vh;
    height: 120vh;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }
  .glow {
    width: 300px;
    height: 100px;
    filter: drop-shadow(0 0 50px $themeColor);
  }
  .logo2 {
    width: 100%;
    height: 100px;
    background-color: #323232;
    mask-image: url(@/assets/img/mirai.png);
    background-image: url(@/assets/2024/test.png);
    background-repeat: repeat-x;
    mask-size: contain;
    mask-repeat: no-repeat;
    box-shadow: 0px 0px 50px $themeColor;
    animation: jello-vertical 1.2s infinite both, backimage-x-move 80s infinite forwards,
      backimage-move-y 2s infinite both alternate;
  }

  .quan {
    width: 200px;
    height: 16px;
    margin-top: 20px;
    background-color: rgb(61, 61, 61);
    border-radius: 10px;
    background-image: url(@/assets/2024/霓虹.png);
    animation: backimage-move-y-2 60s infinite;
    position: relative;
    border: 2px solid $themeColor;
    filter: drop-shadow(0 0 10px $themeColor);
    &2 {
      position: absolute;
      left: 0;
      right: 0;
      height: 100%;
      z-index: 1;
      border-radius: 10px;
      filter: drop-shadow(0 0 5px rgba(239, 126, 27, 0.689));
      background-color: rgba(239, 126, 27, 0.689);
    }
  }
}

@media screen and (min-width: 1440px) {
  .loadingwrapper {
    width: 120vw;
    height: 120vw;
  }
  .glow {
    width: 500px;
  }
}

@keyframes backimage-move-y {
  0% {
    background-position-y: -40px;
  }
  100% {
    background-position-y: -200px;
  }
}

@keyframes backimage-move-y-2 {
  0% {
    background-position-y: 0;
  }
  100% {
    background-position-y: -500px;
  }
}

@keyframes backimage-x-move {
  0% {
    background-position-x: 0px;
  }
  100% {
    background-position-x: 5000px;
  }
}

@-webkit-keyframes jello-vertical {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  30% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  40% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  50% {
    -webkit-transform: scale3d(0.85, 1.15, 1);
    transform: scale3d(0.85, 1.15, 1);
  }
  65% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  75% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
@keyframes jello-vertical {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  30% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  40% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  50% {
    -webkit-transform: scale3d(0.85, 1.15, 1);
    transform: scale3d(0.85, 1.15, 1);
  }
  65% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  75% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

.circle-enter-active,
.circle-leave-active {
  transition: width 0.6s cubic-bezier(0, 0.99, 0.27, 0.98),
    height 0.6s cubic-bezier(0, 0.99, 0.27, 0.98), filter 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.circle-enter-from,
.circle-leave-to {
  width: 0;
  height: 0;
  filter: blur(5px);
  opacity: 0;
}
</style>
