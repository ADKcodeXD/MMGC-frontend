<template>
  <div class="page-index">
    <div>
      <NuxtLink :to="'/activity/2022'">2022</NuxtLink>
    </div>
  </div>
</template>

<style>
.page-index {
  padding-top: 60px;
  text-align: center;
}
</style>

<script setup lang="ts">
import { getConfig } from '~/server/api/config'

const runtimeConfig = useRuntimeConfig()
onMounted(async () => {
  const { data } = await getConfig()
  console.log(data)
})
</script>
