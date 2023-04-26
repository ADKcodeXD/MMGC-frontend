<template>
  <div class="main" ref="fullpageEl">
    <!-- 全屏滚动 -->
    <div class="fullpage-container" ref="container" @mousewheel="onMouseWheel">
      <div class="video-container">
        <Transition mode="out-in">
          <el-carousel
            class="movie-content"
            :interval="4000"
            :autoplay="canAutoPlay"
            v-if="movies.length > 0 && !isLoading"
            height="100%"
            @change="pauseItem"
          >
            <el-carousel-item class="kanban" v-for="item in movies" :key="item.movieId">
              <div class="video-content">
                <Aplayer
                  v-if="item.moviePlaylink"
                  :video-url="item.moviePlaylink[locale] || item.moviePlaylink['cn']"
                  :cover="item.movieCover"
                  :ref="setItemRefs"
                  @on-play="canAutoPlay = false"
                  @on-pause="canAutoPlay = true"
                />
                <MyCustomImage v-else :img="item.movieCover" />
              </div>
              <div class="descinfo">
                <div class="left">
                  <div>
                    <p class="title-movie">{{ item.movieName[locale] || item.movieName['cn'] }}</p>
                    <p class="sub-title">{{ item.movieDesc[locale] || item.movieDesc['cn'] }}</p>
                  </div>

                  <div class="flex">
                    <div class="flex items-center operitem" @click="likeOrUnLike(item)">
                      <template v-if="item.loginVo?.isLike">
                        <Icon name="ant-design:like-filled" class="text-3xl" />
                        <p class="operitem-font">{{ item.likeNums }}</p>
                      </template>
                      <template v-else>
                        <Icon name="ant-design:like-outlined" class="text-3xl" />
                        <p class="operitem-font">{{ $t('like') }}</p>
                      </template>
                    </div>
                    <div class="flex items-center mx-2 operitem" @click="pollMovie(item)">
                      <template v-if="item.loginVo?.isPoll">
                        <Icon name="ant-design:profile-filled" class="text-3xl" />
                        <p class="operitem-font">{{ item.pollNums }}</p>
                      </template>
                      <template v-else>
                        <Icon name="ant-design:profile-outlined" class="text-3xl" />
                        <p class="operitem-font">{{ $t('polls') }}</p>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <div class="flex items-center mt-3">
                    <p class="text-light-50 mr-3">{{ $t('author') }}</p>
                    <MemberPop v-if="item.author" :member-vo="item.author" />
                    <p v-else class="text-light-50 text" :title="item.authorName">
                      {{ item.authorName }}
                    </p>
                  </div>
                  <ElButton type="primary" @click="goToMovieDetail(item.movieId)">{{
                    $t('viewDetail')
                  }}</ElButton>
                </div>
              </div>
              <div class="text h-4"></div>
            </el-carousel-item>
          </el-carousel>
          <p class="title" v-else-if="movies.length === 0 && !isLoading">
            {{ $t('notFoundDays') }}
          </p>
          <MyCustomLoading v-else />
        </Transition>
      </div>

      <div class="video-list">
        <p class="self-start movie-title">{{ $t('movieList') }}</p>
        <Transition mode="out-in">
          <div class="movie-item-container relative" v-if="!isLoading">
            <div v-for="item in movies" :key="item.movieId" class="movieCard">
              <MovieListCard :movie-item="item" />
            </div>
          </div>
          <div v-else class="h-full w-4/5 items-center">
            <MyCustomLoading />
          </div>
        </Transition>
      </div>
    </div>
    <!-- 导航 -->
    <div class="nav-arrow nav-prev" @click="prevDay">
      <Icon name="ant-design:arrow-left-outlined" />
    </div>
    <div class="nav">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="relative day-item"
        :style="clalTransform(index)"
        @click="handleSwitchDay(day.day || 0)"
      >
        <p
          class="title-click"
          :class="{ active: currentDay === day.day }"
          :title="day.themeName![locale] || day.themeName!['cn']"
        >
          Day {{ index + 1 }} {{ day.themeName![locale] || day.themeName!['cn'] }}
        </p>
        <p
          class="sub-title"
          :class="{ active: currentDay === day.day }"
          :title="day.themeDesc![locale] || day.themeDesc!['cn']"
        >
          {{ day.themeDesc![locale] || day.themeDesc!['cn'] }}
        </p>
      </div>
    </div>
    <div class="nav-arrow nav-next" @click="nextDay">
      <Icon name="ant-design:arrow-right-outlined" />
    </div>
    <!-- 滚轮滑动 -->
    <Transition>
      <div class="mouse-roll" v-if="pageState.current === 1">
        <div>
          <Icon name="mingcute:mouse-fill" />
          <Icon name="material-symbols:keyboard-double-arrow-down-rounded" class="anime" />
        </div>
        <p class="text-xs mt-3">{{ $t('wheelMouse') }}</p>
      </div>
    </Transition>
    <Transition>
      <div class="click-roll" v-if="pageState.current === 1" @click="move(2)">
        <div>
          <Icon name="material-symbols:keyboard-double-arrow-down-rounded" class="anime" />
        </div>
        <p class="text-xs mt-1">{{ $t('clickDown') }}</p>
      </div>
      <div class="click-roll" v-else @click="move(1)">
        <div>
          <Icon name="material-symbols:keyboard-double-arrow-up-rounded" class="anime-up" />
        </div>
        <p class="text-xs mt-1">{{ $t('clickup') }}</p>
      </div>
    </Transition>
    <!-- 背景 -->
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
import { cancelVideoLike, likeVideo, pollVideo } from '~~/composables/apis/oper'
import getMovieDetail from '~~/server/api/movie/getMovieDetail'
import { calcZip } from '~~/utils'
definePageMeta({
  key: route => route.fullPath
})

const coverzip = computed(() => {
  if (currentDayItem.value) {
    return calcZip(currentDayItem.value.themeCover || '', '0.8x')
  }
})

const { locale } = useCurrentLocale()
const props = defineProps<{
  activityId: number
}>()
const days = ref<DayVo[]>()
const movies = ref<MovieVo[]>([])
const isLoading = ref(false)
const currentDay = ref(0)
const canAutoPlay = ref(true)
const players = ref<any>([])
const background = ref<HTMLElement>()
const { t } = useI18n()

const setItemRefs = (el: any) => {
  if (el) {
    players.value.push(el)
  }
}

const localeNaviGate = useLocaleNavigate()

const goToMovieDetail = (movieId: number) => {
  localeNaviGate(`/movie/${movieId}`)
}

const pauseItem = () => {
  players.value.forEach((player: any) => {
    player.pause()
  })
}

const currentDayItem = computed(() => {
  return days.value?.find(item => item.day === currentDay.value) || null
})
const { fullpageEl, container, onMouseWheel, pageState, move } = useFullPageWheel(2)

const route = useRoute()
const router = useRouter()
const localeRoute = useLocaleRoute()
const isLike = ref(false)
const day = computed(() => {
  return parseInt(route.query.day?.toString() || '') || -1
})

const clalTransform = (index: number) => {
  if (days.value && days.value.length > 0) {
    const targetIndex = days.value.findIndex(target => target.day === currentDay.value)
    if (targetIndex === -1) return ''
    const dis = index - targetIndex
    return `transform: translateX(${dis * 250}px) scale(${1 - Math.abs(dis) * 0.2});opacity: ${
      1 - Math.abs(dis) * 0.3
    };`
  }
  return ''
}

const getDays = async () => {
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
}

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

const getVideoByDay = async (day: number) => {
  isLoading.value = true
  const { data } = await getMovieByActivityId(props.activityId, day)
  movies.value = data?.result || []
  players.value = []
  isLoading.value = false
}

const likeOrUnLike = async (movieItem: MovieVo) => {
  if (isLike.value) return
  isLike.value = true
  if (movieItem && movieItem.loginVo?.isLike) {
    await cancelVideoLike(movieItem.movieId)
    ElMessage.success(t('cancelLike'))
    movieItem.likeNums--
    movieItem.loginVo.isLike = !movieItem.loginVo?.isLike
  } else if (movieItem) {
    const { data } = await likeVideo(movieItem.movieId)
    if (data?.code === 200) {
      ElMessage.success(t('likeSuccess'))
    }
    if (movieItem.loginVo) movieItem.loginVo.isLike = !movieItem.loginVo?.isLike
    movieItem.likeNums++
  }
  isLike.value = false
}

const pollMovie = (movieItem: MovieVo) => {
  if (movieItem && movieItem?.loginVo?.isPoll) {
    ElMessage.warning(t('pollLimit'))
  } else {
    ElMessageBox.confirm(t('pollTip'), '提示').then(async () => {
      const { data } = await pollVideo(movieItem.movieId)
      if (data?.code === 200) {
        if (movieItem.loginVo) movieItem.loginVo.isPoll = true
        ElMessage.success(t('pollSuccess'))
        movieItem.pollNums++
      }
    })
  }
}

watchEffect(async () => {
  await getDays()
  await getVideoByDay(currentDay.value)
})

watch(
  currentDay,
  () => {
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
      transition: all ease 0.5s;
      .video-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        .movie-content {
          height: 80%;
          width: 95%;
          overflow: hidden;
          .kanban {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-radius: 25px;
            background-color: rgb(36, 1, 1);
            .video-content {
              width: 100%;
              height: 60%;
            }
            .descinfo {
              padding: 10px;
              display: flex;
              flex: 1;
              justify-content: space-between;
              width: 100%;
              .right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                flex: 1;
                flex-shrink: 0;
                justify-content: space-between;
                height: 100%;
                .text {
                  @include showLine(2);
                }
              }
              .left {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .operitem {
                  color: $themeColor;
                  border-radius: 35px;
                  font-size: $smallFontSize;
                  padding: 4px 8px;
                  cursor: pointer;
                  width: 90px;
                  position: relative;
                  transition: all ease 0.3s;
                  &:hover {
                    color: $whiteColor;
                    background-color: $secondryColor;
                    width: 100px;
                    .operitem-font {
                      opacity: 1;
                      left: 60px;
                    }
                  }
                  &.active {
                    color: $whiteColor;
                    background-color: $secondryColor;
                  }
                }
              }

              .title-movie {
                color: $themeColor;
                font-size: $bigFontSize;
                margin: 5px 0;
                @include showLine(2);
              }
              .sub-title {
                @include showLine(2);
              }
            }
          }
        }
      }
      .video-list {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        z-index: 1;
        .movie-title {
          margin-left: 5%;
          margin-bottom: 10px;
          font-size: $bigFontSize;
          color: $themeColor;
        }
        .movie-item-container {
          width: 100%;
          display: grid;
          height: 85%;
          grid-template-columns: repeat(2, 50%);
          overflow-y: auto;
          align-items: center;
          justify-items: center;
          .movieCard {
            width: 95%;
          }
        }
      }
    }
    .nav {
      position: absolute;
      left: 50%;
      bottom: 20px;
      width: 400px;
      height: 150px;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      .day-item {
        display: flex;
        position: absolute;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all 0.4s ease;
        .sub-title {
          font-size: $smallFontSize;
          max-width: 200px;
          display: none;
          text-align: center;
          &.active {
            max-width: 200px;
            color: $tipColor;
            font-size: $normalFontSize;
            @include showLine(2);
          }
        }
        .active {
          color: $themeColor;
          font-size: $bigFontSize;
          text-shadow: 0 0 10px $themeColor;
        }
      }
    }
    .nav-arrow {
      position: absolute;
      font-size: $bigFontSize;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 40px;
      height: 40px;
      z-index: 1;
      border-radius: 50%;
      border: $textColor 1px solid;
      bottom: 5%;
      &:hover {
        background-color: $shadowColor;
      }
      &.nav-prev {
        left: 10%;
        color: $textColor;
      }
      &.nav-next {
        right: 10%;
        color: $textColor;
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
    .mouse-roll {
      display: none;
      position: absolute;
      bottom: 100px;
      right: 50px;
      transform: translateX(-50%);
      color: #fff;
      flex-direction: column;
      align-items: flex-end;
      font-size: $veryBigFontSize;
      width: 100px;
      .anime {
        animation: down 3s infinite;
      }
    }
    .click-roll {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
      color: #fff;
      font-size: $veryBigFontSize;
      width: 100px;
      .anime {
        animation: down 3s infinite;
      }
      .anime-up {
        animation: up 3s infinite;
      }
    }
    :deep(.el-carousel__item) {
      border-radius: 25px;
    }
  }
}

@media screen and (min-width: 1440px) {
  .main {
    width: 90%;
    .fullpage-container {
      .video-container {
        .movie-content {
          height: 90%;
          width: 80%;
          overflow: hidden;
          .kanban {
            .video-content {
              width: 100%;
              height: 75%;
            }
          }
        }
      }
      .video-list {
        .movie-title {
          margin-left: 13%;
        }
        .movie-item-container {
          height: unset;
          width: 80%;
          grid-template-columns: repeat(3, 33%);
          grid-auto-flow: row;
        }
      }
    }
    .mouse-roll {
      display: flex;
    }
    .nav {
      left: 50%;
      .day-item {
        .sub-title {
          display: block;
          &.active {
            max-width: 400px;
          }
        }
        .active {
          font-size: $veryBigFontSize;
        }
      }
    }
    .click-roll {
      display: none;
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
:deep(.el-carousel__indicators--horizontal) {
  position: absolute;
  width: 100%;
  left: 50%;
  margin-left: 16px;
}
</style>
