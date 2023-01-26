<script lang="ts" setup>
const props = defineProps<{
  activityId: number
}>()
onMounted(() => {
  navigateTo(`/activity/${props.activityId}/about`)
})
</script>
