<template>
  <div class="achor">
    <div
      class="achor-item"
      v-for="(item, index) in achorList"
      :key="index"
      :class="{ current: pageState.current === index + 1 }"
      :style="clacTransform(index + 1)"
      @click="move(index + 1)"
    >
      <p class="decorate">#{{ index + 1 }}</p>
      <div class="circle"></div>
      <p class="text-xl font-bold pl-8">{{ $t(item.name) }}</p>
    </div>
    <div
      class="achor-item-mobile"
      v-for="(item, index) in achorList"
      :key="index"
      :class="{ current: pageState.current === index + 1 }"
      @click="move(index + 1)"
    >
      <p class="decorate">#{{ index + 1 }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  achorList: { name: string }[]
  pageState: any
}>()
const emit = defineEmits(['move'])
const clacTransform = (index: number) => {
  const pos = index - props.pageState.current
  const transformY = pos * 90 + 'px'
  const transformX = Math.abs(pos) * 15 + 'px'
  const scale = 1 - Math.abs(pos) * 0.25
  return `transform: translateY(${transformY}) translateX(${transformX}) scale(${scale});opacity: ${scale};`
}
const move = (index: number) => {
  emit('move', index)
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .achor {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    cursor: pointer;
    flex-direction: row;
    max-width: 100%;
    overflow-x: auto;
    color: $themeNotActiveColor;
    &-item {
      position: absolute;
      display: none;
      align-items: center;
      margin-bottom: 50px;
      transition: all ease 0.5s;
      &.current {
        color: $themeColor;
        text-shadow: 0 0 50px $themeColor;
      }
    }
    &-item-mobile {
      display: flex;
      margin: 0 10px;
      &.current {
        color: $themeColor;
        text-shadow: 0 0 50px $themeColor;
      }
    }
    .circle {
      position: absolute;
      top: -20px;
      left: -20px;
      width: 100px;
      height: 100px;
      border: 3px $themeNotActiveColor solid;
      border-radius: 50%;
    }
    .decorate {
      font-size: 48px;
      font-weight: 600;
    }
  }
}

@media screen and (min-width: 1440px) {
  .achor {
    position: absolute;
    top: 40%;
    right: 0;
    bottom: unset;
    left: unset;
    width: 300px;
    max-width: unset;
    overflow-x: unset;
    display: flex;
    cursor: pointer;
    flex-direction: column;
    color: $themeNotActiveColor;
    &-item {
      display: flex;
    }
    &-item-mobile {
      display: none;
    }
  }
}
</style>
