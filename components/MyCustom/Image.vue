<template>
  <ElImage :fit="fit" :lazy="isLazy" :src="isAdd ? quatily : img || ''">
    <template #placeholder>
      <div class="gray">
        <MyCustomLoading />
      </div>
    </template>
    <template #error>
      <div class="gray">
        <img src="@/assets/img/2022logo.png" />
      </div>
    </template>
  </ElImage>
</template>
<script setup lang="ts">
import { calcZip } from '~~/utils'

interface MyElimageProp {
  img?: string | null // 图片的链接
  isLazy?: boolean // 是否懒加载
  fit?: '' | 'fill' | 'none' | 'contain' | 'cover' | 'scale-down'
  zip?: 'none' | '0.8x' | '0.6x' | '0.4x' | '0.2x'
}
const props = withDefaults(defineProps<MyElimageProp>(), {
  img: '',
  isLazy: false,
  fit: 'contain',
  zip: '0.6x'
})

const quatily = computed(() => {
  return calcZip(props.img || '', props.zip)
})

/**
 * 判断是否是oss图片 如果是才加上压缩参数
 */
const isAdd = computed(() => {
  let Reg = new RegExp(/^http(s|):\/\/.*\/[0-9a-zA-Z-]*.(jpeg|jpg|png|webp)$/, 'i')
  if (Reg.test(props.img || '')) {
    return true
  } else return false
})
</script>

<style lang="scss" scoped>
.gray {
  background-color: rgba(2, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.el-image {
  width: 100%;
  height: 100%;
  min-height: inherit;
  display: inline-flex;
}
</style>
