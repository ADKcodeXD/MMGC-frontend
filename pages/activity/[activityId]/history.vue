<template>
  <div class="flex flex-col items-center w-full">
    <div class="line"></div>
    <p class="absolute text-light-50 right-1/2 text-3xl top-36 mr-4">To Be Continue.....</p>
    <div
      class="activity-content h-40 relative flex items-center w-4/5 my-8"
      v-for="activity in activityList?.result"
      :key="activity.activityId"
    >
      <div class="ball w-4 h-4 rounded-full bg-yellow-400"></div>
      <div class="left-time">
        <p>
          {{ $dayjs(activity.startTime).format('YYYY-MM-DD') }} -
          {{ $dayjs(activity.endTime).format('YYYY-MM-DD') }}
        </p>
        <div class="ongoing">
          <p v-if="isOngoing(activity.startTime, activity.endTime)" class="flex items-center">
            <ElImage :src="loading" class="mr-2 h-4"></ElImage>
            进行中!
          </p>
          <p v-else class="flex items-center"><span class="dot"></span>已谢幕!</p>
        </div>
      </div>
      <div class="right-logo">
        <div class="img">
          <MyCustomImage :img="activity.activityLogo" />
        </div>
        <div class="flex flex-col ml-4 items-start">
          <p class="activity-title mb-2">
            {{ activity.activityName[locale] || activity.activityName['cn'] }}
          </p>
          <p
            class="desc text-light-50 text-xs"
            v-html="activity.desc && strictLength(activity.desc[locale] || activity.desc['cn'])"
          ></p>
          <ElButton
            link
            type="primary"
            class="mt-2"
            @click="gotoActivity(`/activity/${activity.activityId}`)"
            >{{ $t('gotoView') }}</ElButton
          >
        </div>
      </div>
    </div>
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

const strictLength = (htmlStr: string) => {
  return htmlStr && htmlStr.length > 600
    ? `${htmlStr.slice(0, 600)}...`
    : htmlStr.slice(0, 600) || '暂无介绍'
}

watchEffect(() => {
  if (!isLoading.value) unloading()
})
</script>

<style lang="scss" scoped>
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
