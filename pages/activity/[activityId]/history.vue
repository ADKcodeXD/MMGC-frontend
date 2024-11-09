<template>
  <div class="flex flex-col items-center w-full max-h-[calc(100vh-100px)] overflow-auto">
    <div class="line"></div>
    <p class="absolute text-light-50 right-3/4 text-3xl top-36 mr-4">To Be Continue.....</p>
    <div class="w-4/5 relative overflow-auto max-h-[calc(100vh-300px)]" ref="historyList">
      <div
        class="activity-content h-40 flex items-center my-12"
        v-for="activity in activityList?.result"
        :key="activity.activityId"
      >
        <div
          class="ball w-6 h-6 rounded-full flex items-center justify-center text-light-50"
          :class="{
            'bg-yellow-300': isOngoing(activity.startTime, activity.endTime),
            'bg-green-400': !isOngoing(activity.startTime, activity.endTime)
          }"
        >
          <Icon
            name="material-symbols:check-rounded"
            size="18"
            v-if="!isOngoing(activity.startTime, activity.endTime)"
          />
          <Icon name="material-symbols:av-timer-outline-rounded" size="18" v-else />
        </div>
        <div class="left-time">
          <p>
            {{ $dayjs(activity.startTime).format('YYYY-MM-DD') }} -
            {{ $dayjs(activity.endTime).format('YYYY-MM-DD') }}
          </p>
          <div class="ongoing">
            <p v-if="isOngoing(activity.startTime, activity.endTime)" class="flex items-center">
              <ElImage :src="loading" class="mr-2 h-4"></ElImage>
              {{ $t('progress') }}
            </p>
            <p v-else class="flex items-center"><span class="dot"></span>{{ $t('owaru') }}</p>
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
      <div
        class="activity-content h-40 flex items-center my-12"
        v-for="activity in activityList?.result"
        :key="activity.activityId"
      >
        <div
          class="ball w-6 h-6 rounded-full flex items-center justify-center text-light-50"
          :class="{
            'bg-yellow-300': isOngoing(activity.startTime, activity.endTime),
            'bg-green-400': !isOngoing(activity.startTime, activity.endTime)
          }"
        >
          <Icon
            name="material-symbols:check-rounded"
            size="18"
            v-if="!isOngoing(activity.startTime, activity.endTime)"
          />
          <Icon name="material-symbols:av-timer-outline-rounded" size="18" v-else />
        </div>
        <div class="left-time">
          <p>
            {{ $dayjs(activity.startTime).format('YYYY-MM-DD') }} -
            {{ $dayjs(activity.endTime).format('YYYY-MM-DD') }}
          </p>
          <div class="ongoing">
            <p v-if="isOngoing(activity.startTime, activity.endTime)" class="flex items-center">
              <ElImage :src="loading" class="mr-2 h-4"></ElImage>
              {{ $t('progress') }}
            </p>
            <p v-else class="flex items-center"><span class="dot"></span>{{ $t('owaru') }}</p>
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
    <Transition name="up-to-down" mode="out-in">
      <div
        class="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-light-50"
        v-if="hasScroll && !isDowned"
      >
        <Icon
          name="material-symbols-light:keyboard-double-arrow-down-rounded"
          size="32"
          class="fade-slide-content"
        />
        <span>{{ $t('scrollDown') }}</span>
      </div>
    </Transition>
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

const historyList = ref<HTMLElement | null>(null)
const hasScroll = ref(false)
const isDowned = ref(false)

const checkScroll = () => {
  if (historyList.value) {
    hasScroll.value = historyList.value.scrollHeight > historyList.value.clientHeight
    isDowned.value =
      historyList.value.scrollHeight - historyList.value.scrollTop <=
      historyList.value.clientHeight + 1
  }
}

watchEffect(() => {
  if (activityList.value) {
    nextTick(() => {
      checkScroll()
    })
  }
})

onMounted(() => {
  window.addEventListener('resize', checkScroll)
  historyList.value?.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll)
  historyList.value?.removeEventListener('scroll', checkScroll)
})

const isOngoing = (dateStr1: any, dateStr2: any) => {
  if (!dateStr1 || !dateStr2) return false
  const dateRange1 = dayjs(dateStr1).toDate().getTime()
  const dateRange2 = dayjs(dateStr2).toDate().getTime()
  const date = new Date().getTime()
  if (date < dateRange1) return true
  return date < dateRange2 && date > dateRange1
}

const strictLength = (htmlStr: string) => {
  return htmlStr && htmlStr.length > 350
    ? `${htmlStr.slice(0, 350)}...`
    : htmlStr.slice(0, 350) || '暂无介绍'
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
  left: 34%;
  transform: translateX(-50%);
  right: 0;
}

.ball {
  position: absolute;
  left: 30.15%;
  transform: translateX(-50%);
  transition: all ease 0.2s;
  cursor: pointer;
}

.left-time {
  position: absolute;
  left: 30%;
  transform: translateX(-110%);
  color: white;
  font-size: 1.5rem;
  font-weight: 350;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.right-logo {
  position: absolute;
  right: 70%;
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

.fade-slide-content {
  animation: fadeSlide 4s ease-in-out infinite;
}

@keyframes fadeSlide {
  0% {
    opacity: 0;
    transform: translateY(-60%);
  }
  20% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(60%);
  }
}
</style>
