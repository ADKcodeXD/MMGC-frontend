<template>
  <div class="main">
    <ClientOnly>
      <div class="video-container">
        <var-menu-select
          placement="bottom"
          :model-value="currentDay"
          @update:model-value="v => handleSwitchDay(v)"
          v-if="days && days?.length"
        >
          <div class="px-4 pt-2 flex items-center">
            <p class="text-light-50 text-xl" v-if="currentDayItem">
              Day {{ currentDayItem.day }}
              {{
                currentDayItem.themeName &&
                (currentDayItem.themeName[locale] || currentDayItem.themeName['cn'])
              }}
            </p>
            <Icon name="ant-design:down-outlined" size="18" class="text-light-50 ml-2"></Icon>
          </div>
          <template #options>
            <var-menu-option
              :label="`Day ${day.day} ${
                day.themeName && (day.themeName[locale] || day.themeName['cn'])
              }`"
              v-for="day in days"
              :value="day.day"
              :key="day.day"
            />
          </template>
        </var-menu-select>

        <div class="h-full p-4" v-if="movies.length">
          <div v-if="activeVideo && activeVideo.movieId" class="flex-1" :key="activeVideo.movieId">
            <MovieShowItemMobile
              :movie-item="activeVideo"
              :day-poll-link="currentDayItem?.dayPollLink"
            />
          </div>
          <div v-else></div>
          <p class="title">Day {{ currentDay }}{{ $t('works') }}</p>
          <div class="flex overflow-auto py-2">
            <div
              class="movie-list-card mx-2 flex-shrink-0"
              :class="{ active: activeVideo.movieId === movieItem.movieId }"
              v-for="movieItem in movies"
              :key="movieItem.movieId"
              @click="activeVideo = movieItem"
            >
              <div class="h-24">
                <MyCustomImage :img="movieItem.movieCover" />
              </div>
              <div class="flex justify-between items-center mt-2">
                <p style="max-width: 75%; margin-right: 8px" class="sub-title">
                  {{ movieItem['movieName'][locale] || movieItem['movieName']['cn'] }}
                </p>
                <MemberPop
                  class="flex-shrink-0"
                  :member-vo="movieItem.author"
                  v-if="movieItem.author"
                  :size="24"
                />
                <p class="sub-title" v-else>{{ movieItem['authorName'] }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col p-4" v-else-if="movies.length === 0 && !isLoading">
          <div class="h-48">
            <MyCustomImage :img="Image404" />
          </div>
          <p class="title">{{ $t('notFoundDays') }}</p>
        </div>
        <MyCustomLoading v-else />
      </div>
    </ClientOnly>

    <Transition mode="out-in">
      <div
        ref="background"
        class="background"
        v-if="currentDayItem"
        :key="coverzip"
        :style="{
          transition: 'all ease 0.4s',
          backgroundImage: `url(${coverzip})`
        }"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
import Image404 from '@/assets/img/NotFound.png'
import type { MovieVo } from 'Movie'
import { useRouter } from 'vue-router'

const pollDialogShow = ref(false)
const router = useRouter()

definePageMeta({
  key: route => route.fullPath
})

const props = defineProps<{
  activityId: number
}>()

const { unloading } = useGlobalStore()

const {
  days,
  movies,
  isLoading,
  currentDay,
  activeVideo,
  background,
  currentAnime,
  day,
  locale,
  currentDayItem,
  coverzip,
  handleSwitchDay,
  getDays,
  getVideoByDay
} = useActivityMain()

// Get activity list for dropdown
const { activityList: activityListData } = useActivityList()
const activityList = ref<any[]>([])

// Update activity list when data changes
watch(
  activityListData,
  newVal => {
    if (newVal && Array.isArray(newVal)) {
      activityList.value = newVal
    } else if (
      newVal &&
      typeof newVal === 'object' &&
      'records' in newVal &&
      Array.isArray(newVal.records)
    ) {
      activityList.value = newVal.records
    } else {
      activityList.value = []
    }
  },
  { immediate: true }
)

// Navigate to selected activity
const gotoActivity = (path: string) => {
  router.push(path)
}

watchEffect(async () => {
  currentDay.value = day.value
  getDays(props.activityId).then(() => {
    getVideoByDay(currentDay.value, props.activityId).then(unloading)
  })
})

watch(
  currentDay,
  (newVal, oldVal) => {
    if (oldVal > newVal) currentAnime.value = 'right-to-left'
    else currentAnime.value = 'left-to-right'
    getVideoByDay(currentDay.value, props.activityId)
  },
  { immediate: false }
)
</script>

<style lang="scss" scoped>
.main {
  min-width: 320px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    filter: blur(3px);
    background-size: cover;
    transition: all ease 0.5s;
  }

  .movie-list-card {
    width: 60%;
    border-radius: 12px;
    border: 1px solid var(--el-border-color-light);
    display: flex;
    flex-direction: column;
    padding: 8px;
    &.active {
      border: 1px solid $themeColor;
    }
  }
}

@keyframes down {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

@keyframes up {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}

.fadeout {
  transition: 0.3s all ease-in-out;
  &:hover {
    color: $themeColor;
    transform: translateY(-2px);
  }
}

.activity-link {
  background-color: $themeColor;
  border-color: $themeColor;
}

.activity-menu {
  max-height: 50vh;
  overflow-y: auto;
  width: 280px;
  background-color: #2c2c2c;
  border-radius: 8px;

  :deep(.var-cell) {
    color: #fff;
    padding: 12px 16px;

    &:active {
      background-color: rgba($themeColor, 0.2);
    }
  }
}
</style>
