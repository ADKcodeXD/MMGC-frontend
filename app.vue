<template>
  <NuxtLayout name="root">
    <template #default>
      <div :key="$route.path" class="w-full h-full">
        <NuxtPage />
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup>
import { ID_INJECTION_KEY } from 'element-plus'
import { useGlobalStore } from './stores/global'
provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0
})
const globalState = useGlobalStore()
await globalState.setConfig()
await globalState.setCurrentActivity()
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  filter: blur(1rem) brightness(0);
}
</style>
