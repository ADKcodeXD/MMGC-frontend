<template>
  <div class="bg">
    <div class="logo">
      <div class="logo1">
        <MyCustomImage :img="logodefault" />
      </div>
      <div class="logo2">
        <MyCustomImage :img="logodefault2" />
      </div>
    </div>
  </div>
  <div class="oper-items">
    <p class="item" @click="goActivity">{{ $t('enterMatch') }}</p>
    <p class="sub item" @click="() => {}">往届赛事</p>
  </div>
</template>
<script setup lang="ts">
import logodefault from '@/assets/img/hjj2022 logo.png'
import logodefault2 from '@/assets/img/2022MMT.png'

const goActivity = () => {
  navigateTo('/activity/2022')
}
</script>
<style lang="scss" scoped>
@keyframes move {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -100%;
  }
}
.bg {
  width: 100vw;
  height: 100vh;
  background-image: url(@/assets/img/bg2.png);
  background-size: 100% 100% cover;
  min-width: 1024px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: move 120s infinite;
  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    height: 60%;
    &1 {
      width: 100%;
      height: 80%;
    }
    &2 {
      width: 286px;
      height: 89px;
    }
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
</style>
