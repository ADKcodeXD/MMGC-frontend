<template>
  <NuxtPage />
</template>

<script setup>
import { ID_INJECTION_KEY } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from './stores/global'
provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0
})
const globalState = storeToRefs(useGlobalStore())

const readyState = globalState.documentReadyState

watchEffect(() => {
  if (process.client) readyState.value = document.readyState
})
</script>

<style lang="scss" scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
