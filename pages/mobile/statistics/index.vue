<script lang="ts" setup>
import { useGlobalStore } from '~/stores/global'

const localeRoute = useLocaleRoute()
const globalState = useGlobalStore()
const { activityData } = useActivityDetail(globalState.config!.currentActivityId)

watch(activityData, () => {
  const route = localeRoute(`/activity/${activityData.value?.activityId}/statistics`)
  navigateTo(route?.fullPath || '/')
})
</script>
