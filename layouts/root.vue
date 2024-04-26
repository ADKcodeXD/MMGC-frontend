<template>
  <div class="bg-black w-full h-full">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const getToolBarheight = () => {
  if (window) {
    const heightPx = window.outerHeight - window.innerHeight
    document.body.style.height = heightPx + 'px'
  }
}
</script>
