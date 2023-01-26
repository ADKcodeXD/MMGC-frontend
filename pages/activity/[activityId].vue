<template>
  <NuxtLayout>
    <NuxtPage :activityId="activityId" />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const activityId = parseInt(route.params.activityId.toString())
</script>

