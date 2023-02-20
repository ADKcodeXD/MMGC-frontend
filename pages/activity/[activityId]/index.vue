<script lang="ts" setup>
import { useGlobalStore } from '~~/stores/global'

const props = defineProps<{
  activityId: number
}>()

onBeforeMount(() => {
  const globalStore = useGlobalStore()
  const localeRoute = useLocaleRoute()
  const router = useRouter()
  const route = localeRoute(`/activity/${props.activityId}/about`)
  globalStore.setCurrentActivityId(props.activityId)
  router.replace(route?.fullPath || '/')
})
</script>
