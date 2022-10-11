<template>
  <NuxtLayout :activityId="id">
    <p>welcome {{ id }}</p>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const id = ref(route.params.id)
watchEffect(() => {
  id.value = route.params.id
})
</script>

<style lang="scss" scoped></style>
