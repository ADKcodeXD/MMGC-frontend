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
.achor {
  position: absolute;
  top: 40%;
  right: 0;
  width: 300px;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  color: $themeNotActiveColor;
  &-item {
    position: absolute;
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    transition: all ease 0.5s;
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
</style>
