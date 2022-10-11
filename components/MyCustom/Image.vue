<template>
  <ElImage fit="cover" :lazy="isLazy" :src="img">
    <template #placeholder>
      <div class="gray">
        <ElIcon :size="20" color="#ffc962">
          <Loading />
        </ElIcon>
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
import { ElImage, ElIcon } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
interface MyElimageProp {
  img?: string // 图片的链接
  isLazy?: boolean // 是否懒加载
}
withDefaults(defineProps<MyElimageProp>(), {
  img: '',
  isLazy: false
})
</script>

<style lang="scss" scoped>
.gray {
  background-color: rgb(31, 0, 0);
  height: 100%;
  width: 100%;
}

.el-image {
  width: 100%;
  height: 100%;
  min-height: inherit;
}
</style>
