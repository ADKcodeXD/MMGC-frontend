<template>
  <div class="main" ref="fullpageEl">
    <!-- 全屏滚动 -->
    <div class="fullpage-container" ref="container" @mousewheel="onMouseWheel">
      <div class="video-container">
        <Transition :name="currentAnime" mode="out-in">
          <div class="video-content" v-if="movies.length">
            <Transition name="left-to-right" mode="out-in">
              <div v-if="activeVideo" class="flex-1" :key="activeVideo.movieId">
                <MovieShowItem :movie-item="activeVideo" />
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
                      <p class="sub-title max-w-3/5">
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
          <p class="title" v-else-if="movies.length === 0 && !isLoading">
            {{ $t('notFoundDays') }}
          </p>
          <MyCustomLoading v-else />
        </Transition>
      </div>
      <div class="nav">
        <Icon
          name="ant-design:caret-left-filled"
          cursor="pointer"
          class="arrow"
          @click="prevDay"
        ></Icon>
        <ElDropdown @command="handleSwitchDay" placement="top">
          <Transition :name="currentAnime" mode="out-in">
            <p class="text-light-50 text-4xl mx-2" :key="currentDay">Day {{ currentDay }}</p>
          </Transition>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem v-for="(day, index) in days" :key="index" :command="day.day"
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

    <div
      ref="background"
      class="background"
      v-if="currentDayItem"
      :style="{
        backgroundImage: `linear-gradient(to left,#000,transparent),url(${coverzip})`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { DayVo } from 'Activity'
import { MovieVo } from 'Movie'
import { getActivityDays } from '~~/composables/apis/activity'
import { getMovieByActivityId } from '~~/composables/apis/movie'
import { useGlobalStore } from '~~/stores/global'
import { calcZip } from '~~/utils'
definePageMeta({
  key: route => route.fullPath
})

const props = defineProps<{
  activityId: number
}>()

const days = ref<DayVo[]>()
const movies = ref<MovieVo[]>([])
const isLoading = ref(false)
const currentDay = ref(0)
const activeVideo = ref<Partial<MovieVo>>({})
const players = ref<any>([])
const background = ref<HTMLElement>()
const currentAnime = ref('left-ro-right')

const { locale } = useCurrentLocale()
const { unloading } = useGlobalStore()
const route = useRoute()
const router = useRouter()
const localeRoute = useLocaleRoute()

const day = computed(() => {
  return parseInt(route.query.day?.toString() || '') || -1
})

const currentDayItem = computed(() => {
  return days.value?.find(item => item.day === currentDay.value) || null
})

const coverzip = computed(() => {
  if (currentDayItem.value) {
    return calcZip(currentDayItem.value.themeCover || '', '0.8x')
  }
})

const handleSwitchDay = (day: number) => {
  currentDay.value = day
}

const nextDay = () => {
  if (days.value && days.value.length > 0) {
    const targetIndex = days.value.findIndex(target => target.day === currentDay.value)
    if (targetIndex === -1) return
    if (targetIndex === days.value.length - 1) {
      currentDay.value = days.value[0].day as any
    } else {
      currentDay.value = days.value[targetIndex + 1].day as any
    }
  }
}

const prevDay = () => {
  if (days.value && days.value.length > 0) {
    const targetIndex = days.value.findIndex(target => target.day === currentDay.value)
    if (targetIndex === -1) return
    if (targetIndex === 0) {
      currentDay.value = days.value[days.value.length - 1].day as any
    } else {
      currentDay.value = days.value[targetIndex - 1].day as any
    }
  }
}

const getDays = async () => {
  isLoading.value = true
  try {
    const { data } = await getActivityDays(props.activityId)
    if (data && data.length > 0) {
      days.value = data
      if (day.value && day.value !== -1) {
        currentDay.value = day.value
        return
      } else {
        if (days.value[0].day) {
          currentDay.value = days.value[0].day
          const locale = localeRoute(route.fullPath)
          router.replace({ path: locale?.fullPath, query: { day: days.value[0].day } })
        }
      }
    }
  } finally {
    isLoading.value = false
  }
}

const getVideoByDay = async (day: number) => {
  isLoading.value = true
  const { data } = await getMovieByActivityId(props.activityId, day)
  movies.value = data?.result || []
  activeVideo.value = (movies.value && movies.value[0]) || {}
  players.value = []
  isLoading.value = false
}

watchEffect(async () => {
  await getDays()
  await getVideoByDay(currentDay.value)
  unloading()
})

watch(
  currentDay,
  (newVal, oldVal) => {
    if (oldVal > newVal) currentAnime.value = 'right-to-left'
    else currentAnime.value = 'left-to-right'
    getVideoByDay(currentDay.value)
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
</style>
