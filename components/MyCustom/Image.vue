<template>
  <ElImage :fit="fit" :lazy="isLazy" :src="img || ''" v-bind="$attrs" v-on="$listeners">
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
interface MyElimageProp {
  img?: string | null // 图片的链接
  isLazy?: boolean // 是否懒加载
  fit?: '' | 'fill' | 'none' | 'contain' | 'cover' | 'scale-down'
}
withDefaults(defineProps<MyElimageProp>(), {
  img: '',
  isLazy: false,
  fit: 'contain'
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
