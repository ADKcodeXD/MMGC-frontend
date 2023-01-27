<template>
  <div class="body">
    <MMGCHeader class="flex-shrink-0" />
    <div class="flex items-center justify-center" style="height: 79%">
      <slot></slot>
    </div>
    <MMGCFooter />
  </div>
</template>
<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(@/assets/img/bg.png); // TODO:后期可以做成动态的背景
  background-size: cover;
  background-position: 20% 40%;
  min-width: 1024px;
}
</style>
