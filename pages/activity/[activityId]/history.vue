<template>
  <div class="wrapper">
    <div
      class="activity-content"
      v-for="activity in activityList?.result"
      :key="activity.activityId"
      @click="gotoActivity(`/activity/${activity.activityId}`)"
    >
      <div class="w-72 h-full">
        <MyCustomImage :img="activity.activityLogo" />
      </div>
      <div class="info px-2">
        <div class="flex items-center">
          <p class="title">
            {{ activity.activityName[locale] || activity.activityName['cn'] }}
          </p>
          <span class="tag-primary ml-2"> {{ activity.activityId }} 活动</span>
          <span class="tag-day ml-2" v-if="config?.currentActivityId === activity.activityId">
            当前活动</span
          >
        </div>
        <p v-if="activity.startTime && activity.endTime">
          开始结束时间:{{ activity.startTime }} - {{ activity.endTime }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'

const { activityList } = useActivityList()
const { config } = useGlobalStore()
const { locale } = useCurrentLocale()
const gotoActivity = useLocaleNavigate()
</script>

<style lang="scss" scoped>
.wrapper {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-self: flex-start;
  align-self: self-start;
}
.activity-content {
  width: 100%;
  border: 1px solid $themeColor;
  height: 140px;
  margin-bottom: 10px;
  border-radius: 6px;
  padding: 3px;
  cursor: pointer;
  display: flex;
  &:hover {
    background-color: #2e1b01c7;
  }
  .info {
    color: $themeColor;
  }
}
</style>
