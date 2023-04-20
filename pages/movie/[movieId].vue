<template>
  <div class="body" ref="body">
    <MMGCHeader class="flex-shrink-0" />
    <div class="movie-content" v-if="movieDetail">
      <div class="flex justify-start w-full">
        <el-button @click="backToMain">{{ $t('backToMain') }}</el-button>
      </div>
      <div class="movie-header">
        <div class="flex items-center">
          <p class="movie-title">
            {{ movieDetail?.movieName[locale] || movieDetail?.movieName['cn'] }}
          </p>
        </div>
        <div>
          <MemberPop :member-vo="movieDetail?.author" v-if="movieDetail?.author" :size="48" />
          <p class="sub-title" v-else>{{ $t('author') }}:{{ movieDetail?.authorName }}</p>
        </div>
      </div>
      <div class="movie-tag">
        <div class="tag-primary" v-if="movieDetail.activityVo">
          {{ $t('activityMovie', [movieDetail.activityVo.activityId]) }}
        </div>
        <div class="tag-day" v-if="movieDetail.activityVo">
          {{ $t('dayXmovie', [movieDetail.day]) }}
        </div>
      </div>
      <div class="movie-info">
        <p class="sub-title">{{ $t('uploadAt') }}:{{ movieDetail.createTime }}</p>
        <p class="sub-title mx-2" v-if="movieDetail.realPublishTime">
          {{ $t('firstViewTime') }}:{{ movieDetail.realPublishTime }}
        </p>
        <div class="flex text-gray-200">
          <div class="mx-2 info-center">
            <Icon name="ant-design:like-outlined" />
            <span>{{ movieDetail.likeNums }}</span>
          </div>
          <div class="mx-2 info-center">
            <Icon name="ant-design:comment-outlined" />
            <span>{{ movieDetail.commentNums }}</span>
          </div>
          <div class="mx-2 info-center">
            <Icon name="ant-design:profile-outlined" />
            <span>{{ movieDetail.pollNums }}</span>
          </div>
          <div class="mx-2 info-center">
            <Icon name="ant-design:eye-outlined" />
            <span>{{ movieDetail.viewNums }}</span>
          </div>
        </div>
      </div>
      <div class="movie-play">
        <Aplayer
          :video-url="playSource"
          v-if="movieDetail?.moviePlaylink"
          :cover="movieDetail.movieCover"
        ></Aplayer>
      </div>
      <div class="movie-oper">
        <div class="flex">
          <div class="flex items-center operitem" @click="likeOrUnLike">
            <template v-if="movieDetail.loginVo?.isLike">
              <Icon name="ant-design:like-filled" class="text-3xl" />
              <p class="operitem-font">{{ movieDetail.likeNums }}</p>
            </template>
            <template v-else>
              <Icon name="ant-design:like-outlined" class="text-3xl" />
              <p class="operitem-font">{{ $t('like') }}</p>
            </template>
          </div>
          <div class="flex items-center mx-2 operitem" @click="pollMovie">
            <template v-if="movieDetail.loginVo?.isPoll">
              <Icon name="ant-design:profile-filled" class="text-3xl" />
              <p class="operitem-font">{{ movieDetail.pollNums }}</p>
            </template>
            <template v-else>
              <Icon name="ant-design:profile-outlined" class="text-3xl" />
              <p class="operitem-font">{{ $t('polls') }}</p>
            </template>
          </div>
        </div>
        <div class="flex">
          <div
            class="flex items-center mr-4 justify-center"
            v-if="movieDetail.movieLink && snsSites.length > 0"
          >
            <p class="mr-2">{{ $t('otherView') }}</p>
            <div>
              <div class="flex flex-wrap">
                <div
                  v-for="item in snsSites"
                  :key="item.value"
                  class="cursor-pointer"
                  :title="`${$t('clickJump')} ${item.value}`"
                  @click="openlink(item.value)"
                >
                  <Icon :name="item.icon" :style="{ color: item.color }" size="24px" class="mr-1" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="movieDetail.movieDownloadLink">
            <el-popover
              placement="top-start"
              :width="160"
              trigger="click"
              popper-class="popover"
              transition="popshow"
            >
              <template #reference>
                <p class="download">Download</p>
              </template>
              <div class="download-list flex flex-wrap justify-between items-center">
                <div
                  v-if="movieDetail?.movieDownloadLink?.google"
                  class="down-item down-google text-5xl cursor-pointer mx-2"
                  :title="$t('googleDownload', [movieDetail.movieDownloadLink.google])"
                  @click="openlink(movieDetail?.movieDownloadLink?.google || '')"
                >
                  <Icon name="logos:google-drive" />
                </div>
                <div
                  v-if="movieDetail?.movieDownloadLink?.baidu"
                  class="down-item down-google text-5xl cursor-pointer mx-2"
                  :title="$t('baiduDownload', [movieDetail.movieDownloadLink.baidu])"
                  @click="openlink(movieDetail?.movieDownloadLink?.baidu || '')"
                >
                  <Icon name="simple-icons:baidu" class="text-blue-600" />
                </div>
                <div
                  v-if="movieDetail?.movieDownloadLink?.onedrive"
                  class="down-item down-google text-5xl cursor-pointer mx-2"
                  :title="$t('microsoftDownload', [movieDetail.movieDownloadLink.onedrive])"
                  @click="openlink(movieDetail?.movieDownloadLink?.onedrive || '')"
                >
                  <Icon name="logos:microsoft-onedrive" />
                </div>
                <div
                  v-if="movieDetail?.movieDownloadLink?.google"
                  class="down-item down-google text-5xl cursor-pointer mx-2"
                  :title="$t('otherDownload', [movieDetail.movieDownloadLink.other])"
                  @click="openlink(movieDetail?.movieDownloadLink?.other || '')"
                >
                  <Icon name="material-symbols:link-rounded" class="text-green-600" />
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="movie-desc">
        <div class="left">
          <p class="title">{{ $t('detailInfo') }}</p>
          <p class="desc my-2">
            {{ $t('desc') }}:{{ movieDetail.movieDesc[locale] || movieDetail.movieDesc['cn'] }}
          </p>
          <p class="sub-title">
            {{ $t('belongMatch') }}:{{
              movieDetail.activityVo?.activityName[locale] ||
              movieDetail.activityVo?.activityName.cn
            }}
          </p>
          <p class="sub-title">
            {{ $t('author') }}:{{
              movieDetail.author ? movieDetail.author.memberName : movieDetail.authorName || ''
            }}
          </p>
        </div>
      </div>
      <div class="movie-activity-other" v-if="movieDetail.activityVo && movies.length > 0">
        <p class="title">{{ $t('otherMovie', [movieDetail.day]) }}</p>
        <div class="movie-list">
          <div v-for="item in movies" :key="item.movieId" class="flex-shrink-0 w-96 mr-3">
            <MovieListCard :movie-item="item" />
          </div>
        </div>
      </div>
      <div class="movie-comment">
        <p class="title">{{ $t('commentArea') }}</p>
        <ElInput
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          show-word-limit
          maxlength="512"
          :placeholder="$t('sentCommentin')"
          v-model:model-value="content"
        />
        <ElButton
          type="primary"
          class="self-end mt-2"
          @click="sentComment"
          :disabled="!userInfo?.memberId || !content || content.length > 512"
          >{{ $t('sendComment') }}</ElButton
        >
      </div>
      <div class="movie-comment-area">
        <ElEmpty :description="$t('noComment')" v-if="comments.length === 0" />
        <template v-else>
          <CommentItem
            v-for="comment in comments"
            :key="comment.commentId"
            :movie-detail="movieDetail"
            :comment="comment"
            :topPrarentId="comment.commentId"
            :level="1"
            @refresh="getComment"
            @sent-reply="getComment"
          >
          </CommentItem>
        </template>
        <ElPagination
          layout="prev, pager, next"
          :total="total"
          v-model:page-size="pageParam.pageSize"
          v-model:current-page="pageParam.page"
        />
      </div>
    </div>
    <p class="title" v-else>{{ $t('noOpen') }}</p>
  </div>
</template>
<script setup lang="ts">
import { MovieVo } from 'Movie'
import { getMovieByActivityId, getMovieDetailById } from '~~/composables/apis/movie'
import { likeVideo, cancelVideoLike, pollVideo } from '~~/composables/apis/oper'
import { addComment, getCommentList } from '~~/composables/apis/comment'
import { useGlobalStore } from '~~/stores/global'
import { useUserStore } from '~~/stores/user'
import { CommentVo } from 'Comment'
import _ from 'lodash'

const route = useRoute()
const movieDetail = ref<MovieVo>()
const movies = ref<MovieVo[]>([])
const openlink = useOpenLink()
const snsSites = ref()
const body = ref()
const isLike = ref(false)
const content = ref('')
const movieId = computed(() => {
  return parseInt(route.params.movieId.toString()) || 0
})
const { locale } = useCurrentLocale()
const { t } = useI18n()
const { userInfo } = useUserStore()
const localeNaviGate = useLocaleNavigate()
const { currentActivityData } = useGlobalStore()

const pageParam = reactive<any>({
  page: 1,
  pageSize: 10,
  movieId: movieId.value
})

const total = ref(0)
const comments = ref<CommentVo[]>([])
const playSource = ref<any[]>([])

const getMovieDetail = async (movieId: number) => {
  const { data } = await getMovieDetailById(movieId)
  if (data) {
    movieDetail.value = data
    const keys = _.keys(movieDetail.value.moviePlaylink) as any
    keys.forEach((key: keyof I18N) => {
      if (movieDetail.value && movieDetail.value.moviePlaylink[key]) {
        if (movieDetail.value.moviePlaylink[key]) {
          playSource.value.push({ url: movieDetail.value.moviePlaylink[key], label: key })
        }
      }
    })
    snsSites.value = useSnsSites(data.movieLink)
  }
}

const backToMain = () => {
  if (movieDetail.value?.activityVo?.activityId) {
    localeNaviGate(`/activity/${movieDetail.value?.activityVo?.activityId}/main`, {
      day: movieDetail.value.day
    })
  } else {
    localeNaviGate(`/activity/${currentActivityData?.activityId}/main`)
  }
}

const getVideoByDay = async () => {
  if (movieDetail.value?.activityVo && movieDetail.value.day) {
    const { data } = await getMovieByActivityId(
      movieDetail.value.activityVo.activityId,
      movieDetail.value.day
    )
    movies.value = data?.result.filter(item => item.movieId !== movieId.value) || []
  }
}

const likeOrUnLike = async () => {
  if (!userInfo || !userInfo?.memberId) {
    ElMessage.warning(t('loginFirst'))
    return
  }
  if (isLike.value) return
  isLike.value = true
  if (movieDetail.value && movieDetail.value.loginVo?.isLike) {
    await cancelVideoLike(movieDetail.value.movieId)
    ElMessage.success(t('cancelLike'))
    movieDetail.value.loginVo.isLike = !movieDetail.value.loginVo?.isLike
  } else if (movieDetail.value) {
    await likeVideo(movieDetail.value.movieId)
    ElMessage.success(t('likeSuccess'))
    if (movieDetail.value.loginVo)
      movieDetail.value.loginVo.isLike = !movieDetail.value.loginVo?.isLike
  }
  await getMovieDetail(movieId.value)
  isLike.value = false
}

const pollMovie = () => {
  if (!userInfo || !userInfo?.memberId) {
    ElMessage.warning(t('loginFirst'))
    return
  }
  if (movieDetail.value && movieDetail.value?.loginVo?.isPoll) {
    ElMessage.warning(t('pollLimit'))
  } else {
    ElMessageBox.confirm('你确定要给该作品投票吗?（当日内的作品一个用户只能投一票）', '提示').then(
      async () => {
        await pollVideo(movieId.value)
        await getMovieDetail(movieId.value)
        ElMessage.success(t('pollSuccess'))
      }
    )
  }
}

const sentComment = async () => {
  if (!userInfo || !userInfo?.memberId) {
    ElMessage.warning(t('loginFirst'))
    return
  }
  if (!content.value || content.value.trim().length === 0) {
    ElMessage.warning(t('commentContentEmpty'))
    return
  }
  await addComment({
    content: content.value,
    movieId: movieId.value
  })
  await getComment()
  ElMessage.success(t('commentSuccess'))
  content.value = ''
}

const getComment = async (prams?: any) => {
  if (!prams) {
    pageParam.page = 1
    prams = pageParam
  }
  const { data } = await getCommentList(prams)
  if (data) {
    comments.value = data.result
    total.value = data.total
  }
}
watchEffect(() => {
  getMovieDetail(movieId.value).then(() => {
    getVideoByDay()
  })
})

watchEffect(() => {
  getComment(pageParam)
})

onMounted(async () => {
  const bg = new Image()
  const { currentActivityData } = useGlobalStore()
  bg.src = currentActivityData?.activityBackgroundImg || ''
  bg.onload = () => {
    if (body.value && currentActivityData)
      body.value.style.backgroundImage = `url(${currentActivityData.activityBackgroundImg})`
  }
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 120px) {
  .body {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url(@/assets/img/bg.png);
    background-color: black;
    background-size: cover;
    background-attachment: fixed;
    filter: brightness(0.8);
    min-width: 320px;
    .movie-content {
      width: 96%;
      display: flex;
      flex-direction: column;

      .movie-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .movie-title {
          color: $themeColor;
          font-size: $veryBigFontSize;
          font-weight: 600;
        }
      }
      .movie-tag {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 3px 0;
      }
      .movie-info {
        display: flex;
        align-items: center;
        flex-direction: column;
        .info-center {
          display: inline-flex;
          align-items: center;
        }
      }
      .movie-play {
        border-radius: 20px;
        overflow: hidden;
        height: 300px;
        margin-top: 10px;
        width: 100%;
      }
      .popover {
        padding: 0;
      }
      .movie-oper {
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        font-size: $midFontSize;
        color: $themeColor;
        .operitem {
          border-radius: 35px;
          font-size: $smallFontSize;
          padding: 4px 8px;
          cursor: pointer;
          width: 40px;
          position: relative;
          transition: all ease 0.3s;
          &-font {
            position: absolute;
            opacity: 0;
            left: 0;
            transition: all ease 0.3s;
          }
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
        .download {
          font-size: $bigFontSize;
          color: $themeColor;
          font-weight: 600;
          cursor: pointer;
        }
      }
      .movie-list {
        overflow-x: auto;
        display: flex;
      }
      .movie-desc {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 2rem;
        .desc {
          color: $tipColor;
          font-size: $smallFontSize;
        }
      }
      .movie-comment {
        display: flex;
        flex-direction: column;
        &-area {
          display: flex;
          flex-direction: column;
          margin-top: 20px;
          margin-bottom: 10px;
        }
      }
    }
  }
}

@media screen and (min-width: 1024px) {
  .body {
    min-width: 1024px;

    .movie-content {
      width: 70%;
      .movie-play {
        height: 600px;
      }
      .movie-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .movie-tag {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        margin: 3px 0;
      }
      .movie-info {
        display: flex;
        align-items: center;
        flex-direction: row;
        .info-center {
          display: inline-flex;
          align-items: center;
        }
      }
      .movie-oper {
        flex-direction: row;
      }
    }
  }
}
</style>
