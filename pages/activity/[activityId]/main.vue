<template>
  <div class="main" ref="fullpageEl">
    <div class="fullpage-container" ref="container">
      <div class="video-container">
        <Transition :name="currentAnime" mode="out-in">
          <div class="video-content" v-if="movies.length">
            <Transition :name="currentAnime" mode="out-in">
              <div v-if="activeVideo" class="flex-1" :key="activeVideo.movieId">
                <MovieShowItem
                  :movie-item="activeVideo"
                  :day-poll-link="currentDayItem?.dayPollLink"
                />
              </div>
              <ElEmpty v-else />
            </Transition>
            <ElScrollbar>
              <div class="list-wrapper">
                <div
                  class="movie-list-card my-2"
                  :class="{ active: activeVideo.movieId === movieItem.movieId }"
                  v-for="movieItem in movies"
                  :key="movieItem.movieId"
                  @click="activeVideo = movieItem"
                >
                  <div class="movie-cover">
                    <MyCustomImage :img="movieItem.movieCover" />
                  </div>
                  <div class="flex justify-between items-center mt-2">
                    <ElTooltip
                      :content="movieItem['movieName'][locale] || movieItem['movieName']['cn']"
                      placement="top"
                    >
                      <p class="sub-title max-w-2/3">
                        {{ movieItem['movieName'][locale] || movieItem['movieName']['cn'] }}
                      </p>
                    </ElTooltip>

                    <MemberPop
                      class="flex-shrink-0"
                      :member-vo="movieItem.author"
                      v-if="movieItem.author"
                    />
                    <p class="sub-title" v-else>{{ movieItem['authorName'] }}</p>
                  </div>
                </div>
              </div>
            </ElScrollbar>
          </div>
          <div class="flex flex-col" v-else-if="movies.length === 0 && !isLoading">
            <div class="h-48">
              <MyCustomImage :img="Image404" />
            </div>
            <p class="title">{{ $t('notFoundDays') }}</p>
          </div>
          <MyCustomLoading v-else />
        </Transition>
      </div>
      <div class="nav" v-if="days?.length">
        <Icon
          name="ant-design:caret-left-filled"
          cursor="pointer"
          class="arrow"
          @click="prevDay"
        ></Icon>
        <ElDropdown @command="handleSwitchDay" placement="top">
          <Transition :name="currentAnime" mode="out-in">
            <p class="text-light-50 text-4xl mx-2 fadeout" :key="currentDay">
              Day {{ currentDay }}
            </p>
          </Transition>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem v-for="(day, index) in days" :key="index" :command="day.day || 0"
                >Day {{ day.day }}
                {{
                  day.themeName && (day.themeName[locale] || day.themeName['cn'])
                }}</ElDropdownItem
              >
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <Icon
          name="ant-design:caret-right-filled"
          cursor="pointer"
          class="arrow"
          @click="nextDay"
        ></Icon>
        <Transition :name="currentAnime" mode="out-in">
          <p class="ml-4 text-2xl text-light-50" :key="currentDay">
            {{
              currentDayItem &&
              currentDayItem?.themeName &&
              (currentDayItem.themeName[locale] || currentDayItem.themeName['cn'])
            }}
          </p>
        </Transition>
      </div>
    </div>
    <Transition mode="out-in">
      <div
        ref="background"
        class="background"
        v-if="currentDayItem"
        :key="coverzip"
        :style="{
          transition: 'all ease 0.4s',
          backgroundImage: `linear-gradient(to left,#000,transparent),url(${coverzip})`
        }"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '~~/stores/global'
import Image404 from '@/assets/img/NotFound.png'
import { useRouter } from 'vue-router'

definePageMeta({
  key: route => route.fullPath
})

const props = defineProps<{
  activityId: number
}>()

const router = useRouter()
const { unloading } = useGlobalStore()

const {
  days,
  movies,
  isLoading,
  currentDay,
  activeVideo,
  players,
  background,
  currentAnime,
  day,
  locale,
  currentDayItem,
  coverzip,
  handleSwitchDay,
  nextDay,
  prevDay,
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
  await getDays(props.activityId)
  await getVideoByDay(currentDay.value, props.activityId)
  unloading()
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
@media screen and (min-width: 320px) {
  .main {
    min-width: 320px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .fullpage-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all ease 0.5s;
      .video-container {
        height: 90%;
        width: 100%;
        display: flex;
        justify-content: center;
        .video-content {
          width: 100%;
          height: 100%;
          display: flex;
          .list-wrapper {
            display: flex;
            flex-direction: column;
            margin-left: 24px;
            height: 100%;
            flex-shrink: 0;
            width: 260px;
            .movie-list-card {
              width: 100%;
              border-radius: 6px;
              padding: 8px 8px 4px 8px;
              cursor: pointer;
              border: 2px solid transparent;
              transition: all 0.2s ease-in-out;
              &:hover {
                background-color: rgb(59, 59, 59);
              }
              &.active {
                border: 2px solid $themeColor;
                box-shadow: 0 0 8px $themeColorBackShadow;
              }
              .movie-cover {
                width: 100%;
                background-color: $themeColorBackShadow;
                border-radius: 6px;
                height: 100px;
                border: $themeColor 2px solid;
                outline: #fff 2px solid;
              }
            }
          }
        }
      }
      .nav {
        display: flex;
        align-items: center;
        margin-top: 1rem;
        .arrow {
          color: #fff;
          transition: all 0.2s ease-in-out;
          font-size: 36px;
          &:hover {
            color: $themeColor;
            font-size: 40px;
          }
        }
      }
    }

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -10;
      filter: brightness(0.6) blur(3px);
      // background-color: rgb(0, 7, 17);
      background-size: cover;
      transition: all ease 0.5s;
    }
    :deep(.el-carousel__item) {
      border-radius: 25px;
    }
  }
}

@media screen and (min-width: 1440px) {
  .main {
    width: 90%;
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
  transition: all 0.2s ease-in-out;
  background-color: $themeColor;
  border-color: $themeColor;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 10px rgba($themeColor, 0.6);
  }
}
</style>
