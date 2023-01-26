<template>
  <div class="container flex items-center justify-center">
    <div class="box">
      <img :src="Mirai" alt="loading" class="imgset" v-if="needImg" />
      <div class="loading my-5">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- <p class="font1">玩命加载中~~~</p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import Mirai from '~~/assets/img/mirai.png'
withDefaults(
  defineProps<{
    needImg?: boolean
  }>(),
  {
    needImg: false
  }
)
</script>

<style lang="scss" scoped>
.box {
  width: 60%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $themeColor;
}
.imgset {
  width: 100%;
  height: 100%;
  animation: jello-horizontal infinite ease 2s 2s;
}
.font1 {
  animation: tracking-in-contract ease 2s alternate-reverse infinite;
}
@-webkit-keyframes jello-horizontal {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
@keyframes jello-horizontal {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@-webkit-keyframes tracking-in-contract {
  0% {
    letter-spacing: 1em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    letter-spacing: normal;
    opacity: 1;
  }
}
@keyframes tracking-in-contract {
  0% {
    letter-spacing: 1em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    letter-spacing: normal;
    opacity: 1;
  }
}
</style>

<style scoped>
.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  color: #ffc962;
}

.loading.la-dark {
  color: rgb(55, 196, 252);
}

.loading > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 8px;
  height: 8px;
}

.loading > div {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  animation: ball-fussion-ball1 1s 0s ease infinite;
}

.loading > div:nth-child(1) {
  top: 0;
  left: 50%;
  z-index: 1;
}

.loading > div:nth-child(2) {
  top: 50%;
  left: 100%;
  z-index: 2;
  animation-name: ball-fussion-ball2;
}

.loading > div:nth-child(3) {
  top: 100%;
  left: 50%;
  z-index: 1;
  animation-name: ball-fussion-ball3;
}

.loading > div:nth-child(4) {
  top: 50%;
  left: 0;
  z-index: 2;
  animation-name: ball-fussion-ball4;
}

.loading.la-sm {
  width: 4px;
  height: 4px;
}

.loading.la-sm > div {
  width: 6px;
  height: 6px;
}

.loading.la-2x {
  width: 16px;
  height: 16px;
}

.loading.la-2x > div {
  width: 24px;
  height: 24px;
}

.loading.la-3x {
  width: 24px;
  height: 24px;
}

.loading.la-3x > div {
  width: 36px;
  height: 36px;
}

@keyframes ball-fussion-ball2 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: 200%;
    left: 200%;
    opacity: 1;
  }

  100% {
    top: 100%;
    left: 50%;
    z-index: 1;
    opacity: 0.35;
  }
}

@keyframes ball-fussion-ball1 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: -100%;
    left: 200%;
    opacity: 1;
  }

  100% {
    top: 50%;
    left: 100%;
    z-index: 2;
    opacity: 0.35;
  }
}

@keyframes ball-fussion-ball3 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: 200%;
    left: -100%;
    opacity: 1;
  }

  100% {
    top: 50%;
    left: 0;
    z-index: 2;
    opacity: 0.35;
  }
}

@keyframes ball-fussion-ball4 {
  0% {
    opacity: 0.35;
  }

  50% {
    top: -100%;
    left: -100%;
    opacity: 1;
  }

  100% {
    top: 0;
    left: 50%;
    z-index: 1;
    opacity: 0.35;
  }
}
</style>
