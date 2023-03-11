<template>
  <div></div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  activityId: number
}>()

onBeforeMount(() => {
  const localeRoute = useLocaleRoute()
  const router = useRouter()
  const route = localeRoute(`/activity/${props.activityId}/about`)
  router.replace(route?.fullPath || '/')
})
</script>
