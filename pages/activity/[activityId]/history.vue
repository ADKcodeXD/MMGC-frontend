<template>
  <div class="wrapper">
    <div
      class="activity-content"
      v-for="activity in activityList?.result"
      :key="activity.activityId"
      @click="gotoActivity(`/activity/${activity.activityId}`)"
    >
      <div class="img">
        <MyCustomImage :img="activity.activityLogo" />
      </div>
      <div class="info px-2">
        <div class="info-header">
          <p class="title">
            {{ activity.activityName[locale] || activity.activityName['cn'] }}
          </p>
          <span class="tag-primary ml-2"> {{ $t('xxActivity', [activity.activityId]) }}</span>
          <span class="tag-day ml-2" v-if="config?.currentActivityId === activity.activityId">
            {{ $t('currentactivity') }}</span
          >
        </div>
        <p v-if="activity.startTime && activity.endTime">
          {{ $t('startAndEndTime') }}:{{ activity.startTime }} - {{ activity.endTime }}
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
@media screen and (min-width: 320px) {
  .wrapper {
    width: 97%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    justify-self: flex-start;
    align-self: self-start;
  }
  .activity-content {
    width: 100%;
    border: 1px solid $themeColor;
    height: 200px;
    overflow-y: hidden;
    margin-bottom: 10px;
    border-radius: 6px;
    padding: 3px;
    cursor: pointer;
    display: flex;
    .img {
      width: 40%;
      height: 100%;
      flex-shrink: 0;
    }
    &:hover {
      background-color: #2e1b01c7;
    }
    .info {
      color: $themeColor;
      .title {
        @include showLine(2);
        margin: 3px 0;
      }
      [class^='tag'] {
        margin: 0;
        margin-bottom: 5px;
      }
      .info-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
}

@media screen and (min-width: 1440px) {
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
    .img {
      width: 20%;
      height: 100%;
      flex-shrink: 0;
    }
    &:hover {
      background-color: #2e1b01c7;
    }
    .info {
      color: $themeColor;
      .title {
        @include showLine(1);
        margin: 10px 0;
      }
      [class^='tag'] {
        margin-bottom: 0;
        margin: 0 4px;
      }
      .info-header {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>
