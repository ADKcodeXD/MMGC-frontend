<template>
  <div class="w-full h-full">
    <div class="bg">
      <div class="logo1">
        <MyCustomImage :img="activityData?.activityCover" @load="loadCount++" />
      </div>
      <div class="logo2">
        <MyCustomImage :img="activityData?.activityLogo" @load="loadCount++" />
      </div>
      <div class="denglong">
        <MyCustomImage :img="Denglong" @load="loadCount++" />
      </div>
      <div class="border-img">
        <MyCustomImage :img="BorderImg" fit="cover" @load="loadCount++" />
      </div>
      <div class="xinfeng">
        <MyCustomImage :img="Xinfeng" fit="cover" @load="loadCount++" />
      </div>
      <div class="xinfeng-second">
        <MyCustomImage :img="Paper" fit="cover" @load="loadCount++" />
        <div class="gif">
          <MyCustomImage :img="Gif" fit="cover" @load="loadCount++" />
        </div>
      </div>
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3" id="mask-circle"></div>
      <div class="circle4"></div>
    </div>
    <div class="oper-items">
      <p class="item" @click="goActivity">{{ $t('enterMatch') }}</p>
      <p class="sub item" @click="goHistory">{{ $t('history') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
import Denglong from '~~/assets/2024/denglong.png'
import BorderImg from '~~/assets/2024/border.png'
import Xinfeng from '~~/assets/2024/xinfeng.png'
import Paper from '~~/assets/2024/paper.png'
import Gif from '~~/assets/2024/123456.gif'

const localeRoute = useLocaleRoute()
const globalState = useGlobalStore()
const loadCount = ref(0)
const { activityData } = useActivityDetail(globalState.config!.currentActivityId)
const goActivity = () => {
  const route = localeRoute(`/activity/${activityData.value?.activityId}`)
  navigateTo(route?.fullPath || '/')
}
const goHistory = () => {
  const route = localeRoute(`/activity/${activityData.value?.activityId}/history`)
  navigateTo(route?.fullPath || '/')
}

watchEffect(() => {
  if (loadCount.value === 6) globalState.unloading()
})
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

@media screen and (min-width: 320px) {
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
    .logo {
      &1 {
        position: absolute;
        height: 60%;
        width: 60%;
        z-index: 5;
        filter: drop-shadow(0px 0px 15px $themeColor) brightness(1);
        animation: background-image-shin 10s infinite linear;
      }
      &2 {
        position: absolute;
        bottom: 30px;
        width: 286px;
        height: 89px;
        z-index: 5;
        filter: drop-shadow(0px 0px 15px $themeColor);
        animation: background-image-shin 10s infinite linear;
      }
    }
    .denglong {
      position: absolute;
      width: 50rem;
      z-index: 0;
      opacity: 0.1;
      left: -26px;
      animation: move-diagonally 20s ease-in-out infinite;
    }

    .border-img {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 2;
    }
    .xinfeng {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }

    .xinfeng-second {
      position: absolute;
      width: 45%;
      z-index: 3;
      animation: rotate-back-and-forth 15s ease-in-out infinite;
      .gif {
        position: absolute;
        top: 48px;
        left: 618px;
        background-blend-mode: color-dodge;
        mix-blend-mode: multiply;
        transform: scale(1.6);
      }
    }
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
  .oper-items {
    position: absolute;
    bottom: 50px;
    right: 10px;
    font-size: $veryBigFontSize;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    z-index: 10;
    .item {
      color: $themeNotActiveColor;
      transition: 0.4s all ease;
      margin-bottom: 10px;
    }
    .item:hover {
      color: #fff;
      cursor: pointer;
      transform: translateX(-10px);
      background-color: $themeColor;
      padding: 0 5px 0 20px;
    }
    .sub {
      font-size: $normalFontSize;
    }
  }
}

@media screen and (min-width: 1024px) {
  .bg {
    min-width: 1024px;
  }
}
</style>
