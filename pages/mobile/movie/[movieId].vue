<template>
  <div class="body" ref="body">
    <var-app-bar round color="rgb(157 89 0)" text-color="#fff" style="--app-bar-height: 64px">
      <template #default>
        <div class="flex flex-col justify-start items-start ml-2" v-if="movieDetail">
          <p class="desc-title mr-4 font-bold">
            {{ movieDetail?.movieName[locale] || movieDetail?.movieName['cn'] }}
          </p>
          <div class="flex">
            <span class="tag-primary">
              {{ $t('activityMovies', [movieDetail?.activityVo?.activityId]) }}
            </span>
            <div class="tag-day">
              {{ $t('dayXmovie', [movieDetail?.day]) }}
            </div>
          </div>
        </div>
      </template>
      <template #left>
        <var-button color="transparent" text-color="#fff" round text @click="goHome">
          <var-icon name="home" :size="28" />
        </var-button>
      </template>

      <template #right>
        <var-menu-select
          :modelValue="locale"
          @update:model-value="handleLocale"
          size="large"
          placement="top"
        >
          <var-button round text color="transparent" text-color="#fff">
            <Icon name="ion:language-sharp" size="24"></Icon>
          </var-button>
          <template #options>
            <var-menu-option label="中文" value="cn" />
            <var-menu-option label="English" value="en" />
            <var-menu-option label="日本語" value="jp" />
          </template>
        </var-menu-select>

        <var-button
          round
          text
          color="transparent"
          text-color="#fff"
          @click="goLogin"
          v-if="!isUserInfo"
        >
          <Icon name="ant-design:user-outlined" size="24"></Icon>
        </var-button>
        <MemberPop v-else :member-vo="userInfo" />
      </template>
    </var-app-bar>
    <div class="my-2">
      <VarButton text type="primary" @click="() => backToMain(true)">{{
        $t('backToMain')
      }}</VarButton>
    </div>
    <div class="all-wrapper" v-if="movieDetail">
      <div class="flex flex-col w-full">
        <div class="movie-play" v-if="movieDetail">
          <Aplayer
            :video-url="playSource"
            v-if="movieDetail?.moviePlaylink"
            :cover="movieDetail.movieCover"
          ></Aplayer>
        </div>
        <div class="flex flex-col">
          <div class="movie-oper">
            <div class="flex">
              <div class="operitem">
                <Icon name="ant-design:eye-outlined" class="text-3xl" />
                <span class="operitem-font">{{ movieDetail.viewNums }}</span>
              </div>
              <div class="mx-2 operitem">
                <Icon name="ant-design:comment-outlined" class="text-3xl" />
                <span class="operitem-font">{{ movieDetail.commentNums }}</span>
              </div>
              <div class="flex items-center operitem" @click="likeOrUnLike(movieDetail)">
                <Icon
                  :name="
                    movieDetail.loginVo?.isLike
                      ? 'ant-design:like-filled'
                      : 'ant-design:like-outlined'
                  "
                  class="text-3xl"
                />
                <p class="operitem-font">{{ movieDetail.likeNums }}</p>
              </div>
              <div class="flex items-center mx-2 operitem" @click="pollMovie(movieDetail)">
                <Icon
                  :name="
                    movieDetail.loginVo?.isPoll
                      ? 'ant-design:profile-filled'
                      : 'ant-design:profile-outlined'
                  "
                  class="text-3xl"
                />
                <p class="operitem-font">{{ movieDetail.pollNums }}</p>
              </div>
            </div>
            <div class="download-or-other">
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
                      <Icon
                        :name="item.icon"
                        :style="{ color: item.color }"
                        size="24px"
                        class="mr-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="movieDetail.movieDownloadLink" @click="center = true">
                <p class="tag-day cursor-pointer" v-ripple>Download</p>
              </div>
              <ClientOnly>
                <var-popup v-model:show="center" overlay-class="custom-popclass">
                  <div class="p-4">
                    <p class="text-xl">下载地址</p>
                    <div class="flex flex-col">
                      <div
                        v-if="movieDetail?.movieDownloadLink?.google"
                        class="flex flex-col cursor-pointer my-2"
                        :title="$t('googleDownload', [movieDetail.movieDownloadLink.google])"
                        @click="openlink(movieDetail?.movieDownloadLink?.google || '')"
                      >
                        <div class="flex items-center">
                          <Icon name="logos:google-drive" size="36" />
                          <p class="ml-4">{{ $t('googleDownloadLink') }}</p>
                        </div>
                        <a
                          :href="movieDetail.movieDownloadLink.google"
                          target="_blank"
                          class="break-all text-blue-600 mt-2"
                          >{{ movieDetail.movieDownloadLink.google }}</a
                        >
                      </div>
                      <div
                        v-if="movieDetail?.movieDownloadLink?.baidu"
                        class="flex flex-col cursor-pointer my-2"
                        :title="$t('baiduDownload', [movieDetail.movieDownloadLink.baidu])"
                        @click="openlink(movieDetail?.movieDownloadLink?.baidu || '')"
                      >
                        <div class="flex items-center">
                          <Icon name="simple-icons:baidu" size="36" class="text-blue-600" />
                          <p class="ml-4">{{ $t('baiduDownloadLnk') }}</p>
                        </div>
                        <a
                          :href="movieDetail.movieDownloadLink.baidu"
                          target="_blank"
                          class="break-all text-blue-600 mt-2"
                          >{{ movieDetail.movieDownloadLink.baidu }}</a
                        >
                      </div>
                      <div
                        v-if="movieDetail?.movieDownloadLink?.onedrive"
                        class="flex flex-col cursor-pointer my-2"
                        :title="$t('microsoftDownload', [movieDetail.movieDownloadLink.onedrive])"
                        @click="openlink(movieDetail?.movieDownloadLink?.onedrive || '')"
                      >
                        <div class="flex items-center">
                          <Icon name="logos:microsoft-onedrive" size="36" class="text-blue-600" />
                          <p class="ml-4">{{ $t('weiruandownload') }}</p>
                        </div>
                        <a
                          :href="movieDetail.movieDownloadLink.onedrive"
                          target="_blank"
                          class="break-all text-blue-600 mt-2"
                          >{{ movieDetail.movieDownloadLink.onedrive }}</a
                        >
                      </div>
                      <div
                        v-if="movieDetail?.movieDownloadLink?.other"
                        class="flex flex-col cursor-pointer my-2"
                        :title="$t('otherDownload', [movieDetail.movieDownloadLink.other])"
                        @click="openlink(movieDetail?.movieDownloadLink?.other || '')"
                      >
                        <div class="flex items-center">
                          <Icon
                            name="material-symbols:link-rounded"
                            size="36"
                            class="text-green-600"
                          />
                          <p class="ml-4">{{ $t('otherDownloadlink') }}</p>
                        </div>
                        <a
                          :href="movieDetail.movieDownloadLink.other"
                          target="_blank"
                          class="break-all text-blue-600 mt-2"
                          >{{ movieDetail.movieDownloadLink.other }}</a
                        >
                      </div>
                    </div>
                  </div>
                </var-popup>
              </ClientOnly>
            </div>
          </div>
          <div class="infomation flex mt-2 ml-2">
            <p class="sub-title">{{ $t('uploadAt') }}:{{ movieDetail.createTime }}</p>
            <p class="sub-title mx-2" v-if="movieDetail.realPublishTime">
              {{ $t('firstViewTime') }}:{{ movieDetail.realPublishTime }}
            </p>
          </div>
          <div class="flex my-4 items-center">
            <MemberPop :member-vo="movieDetail?.author" v-if="movieDetail?.author" :size="36" />
            <p class="sub-title mr-4">
              {{ $t('author') }}:{{ movieDetail?.authorName || movieDetail?.author?.memberName }}
            </p>
          </div>
          <p
            class="ml-2 text-light-50 break-all overflow-auto"
            :title="movieDetail.movieDesc[locale] || movieDetail.movieDesc['cn']"
          >
            {{ t('descriable') }}：{{
              movieDetail.movieDesc[locale] || movieDetail.movieDesc['cn']
            }}
          </p>
        </div>
        <p class="comment-area-title text-light-50 flex items-center mt-4">
          <span class="mark block"></span>{{ $t('comment-area') }} ({{ total }})
        </p>
        <div class="movie-comment-area">
          <div class="flex-1 overflow-auto review-area">
            <ElEmpty :description="$t('noComment')" v-if="comments.length === 0" />
            <template v-else>
              <ReviewItem
                v-for="comment in comments"
                :key="comment.commentId"
                :movie-detail="movieDetail"
                :comment="comment"
                :topPrarentId="comment.commentId"
                :level="1"
                @refresh="getCommentList"
              >
              </ReviewItem>
            </template>
          </div>
          <ElPagination
            layout="prev, pager, next"
            :total="total"
            v-model:page-size="pageParam.pageSize"
            v-model:current-page="pageParam.page"
          />
          <div class="relative">
            <var-input :placeholder="$t('enterreview')" textarea v-model="content" />
            <VarButton type="danger" @click="sentComment" size="small" class="button">{{
              $t('ping')
            }}</VarButton>
          </div>
        </div>
      </div>
    </div>
    <p class="title" v-else>{{ $t('noOpen') }}</p>
  </div>
</template>

<script setup lang="ts">
import { getCommentList } from '~~/composables/apis/comment'
import { useGlobalStore } from '~~/stores/global'
import _ from 'lodash'

const {
  total,
  playSource,
  pageParam,
  comments,
  movieDetail,
  movieId,
  openlink,
  snsSites,
  body,
  content,
  isFocus,
  getComment,
  sentComment,
  getVideoByDay,
  backToMain,
  getMovieDetail
} = useMovieDetail()
const center = ref(false)
const { locale } = useCurrentLocale()
const { t } = useI18n()
const { unloading } = useGlobalStore()
const { pollMovie, likeOrUnLike } = useMovieOperate()
const { goHome, goLogin, handleLocale } = useGoMobile()
const { logout, userInfo, isUserInfo } = useMyInfo()

const localeRoute = useLocaleRoute()

watchEffect(() => {
  getMovieDetail(movieId.value).then(async () => {
    await getVideoByDay()
    await getComment(pageParam)
    unloading()
  })
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
.body {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(@/assets/img/bg.png);
  background-color: black;
  background-size: cover;
  background-attachment: fixed;
  filter: brightness(0.8);
  .all-wrapper {
    height: calc(100% - 64px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: auto;
    padding: 12px;
    .movie-play {
      border-radius: 20px;
      overflow: hidden;
      width: 100%;
      height: 600px;
    }
    .mark {
      background-color: #ffacac;
      border-radius: 20px;
      width: 15px;
      height: 10px;
      margin-right: 4px;
    }
    .movie-comment-area {
      height: 100%;
      border-radius: 20px;
      background-color: #131313;
      padding: 16px;
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      .review-area {
        max-height: calc(100% - 120px);
        flex: 1;
        overflow: auto;
      }
      .button {
        position: absolute;
        right: 8px;
        bottom: 5px;
      }
    }

    .movie-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .movie-title {
        font-size: $bigFontSize;
        color: white;
        font-weight: 600;
      }
      .left-arrow {
        border-radius: 9px;
        background-color: $hintColor;
        &:hover {
          transition: all ease 0.2s;
          background-color: #ff5454;
        }
      }
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

    .popover {
      padding: 0;
    }
    .movie-oper {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: $midFontSize;
      color: $themeColor;
      .download-or-other {
        display: flex;
        align-items: center;
        .download {
          font-size: $bigFontSize;
          color: $themeColor;
          font-weight: 600;
          cursor: pointer;
        }
      }
      .operitem {
        border-radius: 35px;
        font-size: $smallFontSize;
        padding: 4px 8px;
        cursor: pointer;
        position: relative;
        transition: all ease 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        &:hover {
          background-color: $themeColor;
          color: white;
        }
        &-font {
          margin-left: 4px;
        }
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
  }
}

:deep(.el-textarea__inner) {
  border-radius: 14px;
}
</style>

<style>
.var-popup__content {
  border-radius: 12px;
  padding: 4px;
  width: 80%;
  background-color: rgb(157 78 3);
  color: #fff;
}
</style>
