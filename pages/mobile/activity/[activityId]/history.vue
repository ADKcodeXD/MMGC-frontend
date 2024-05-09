<template>
  <div class="flex flex-col items-center w-full h-full overflow-auto">
    <var-card
      :title="activity.activityName[locale] || activity.activityName['cn']"
      v-for="activity in activityList?.result"
      :key="activity.activityId"
      :src="activity.activityLogo"
      layout="row"
      ripple
      class="mb-2"
      style="height: 32rem"
      fit="contain"
      @click="gotoActivity(`/mobile/activity/${activity.activityId}/about`)"
    >
      <template #subtitle>
        <p class="text-light-50 text-xs subtitle" v-if="activity.desc">
          {{ stripHTML(activity.desc[locale] || activity.desc['cn']) }}
        </p>
      </template>
      <template #extra>
        <div class="extra flex items-center text-light-50">
          <div class="ongoing mr-4">
            <p v-if="isOngoing(activity.startTime, activity.endTime)" class="flex items-center">
              <ElImage :src="loading" class="mr-2 h-4"></ElImage>
              {{ $t('progress') }}
            </p>
            <p v-else class="flex items-center"><span class="dot"></span>{{ $t('owaru') }}</p>
          </div>
          <p>
            {{ $dayjs(activity.startTime).format('MM-DD') }} -
            {{ $dayjs(activity.endTime).format('MM-DD') }}
          </p>
        </div>
      </template>
    </var-card>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
import { useDayjs } from '#dayjs'
import loading from '@/assets/img/1_1.gif'
const { activityList, isLoading } = useActivityList()
const { unloading } = useGlobalStore()
const { locale } = useCurrentLocale()
const gotoActivity = useLocaleNavigate()
const dayjs = useDayjs()

const isOngoing = (dateStr1: any, dateStr2: any) => {
  if (!dateStr1 || !dateStr2) return false
  const dateRange1 = dayjs(dateStr1).toDate().getTime()
  const dateRange2 = dayjs(dateStr2).toDate().getTime()
  const date = new Date().getTime()
  if (date < dateRange1) return true
  return date < dateRange2 && date > dateRange1
}

const stripHTML = (input: string) => {
  return input
    .replace(
      /<\/?(div|p|h[1-6]|ul|ol|li|blockquote|pre|table|tr|td|th|section|article|aside|header|footer|nav|figure|figcaption)[^>]*>/gi,
      ' '
    )
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

watchEffect(() => {
  if (!isLoading.value) unloading()
})
</script>

<style lang="scss" scoped>
.subtitle {
  @include showLine(3);
}
.line {
  position: absolute;
  width: 5px;
  border-radius: 6px;
  background-color: $themeColor;
  height: 90%;
  top: 150px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  right: 0;
}

.ball {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transition: all ease 0.2s;
  cursor: pointer;
  &:hover {
    outline: rgb(255, 55, 0) 2px solid;
    transform: translateX(-50%) scale(1.1);
  }
}

.left-time {
  position: absolute;
  left: 50%;
  transform: translateX(-110%);
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.right-logo {
  position: absolute;
  right: 50%;
  transform: translateX(105%);
  display: flex;
  align-items: center;
  width: 50%;
  .activity-title {
    font-size: 2rem;
    color: $themeColor;
    font-weight: bold;
  }
  .img {
    width: 150px;
    min-width: 150px;
    margin-right: 2rem;
  }
}
.ongoing {
  font-size: 1rem;
  .dot {
    display: block;
    width: 12px;
    height: 12px;
    background-color: rgb(47, 248, 7);
    border-radius: 50%;
    margin-right: 4px;
  }
}
</style>
