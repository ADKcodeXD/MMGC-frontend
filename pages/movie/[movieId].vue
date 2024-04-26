<template>
  <div class="body" ref="body">
    <MMGCHeader class="flex-shrink-0" />
    <div class="all-wrapper" v-if="movieDetail">
      <div class="movie-header flex flex-row items-center justify-between w-full">
        <div class="flex items-center">
          <img
            src="@/assets/img/left-arrow.png"
            style="width: 60px"
            class="left-arrow mr-4 cursor-pointer"
            @click="backToMain(false)"
          />
          <div class="right-title">
            <div class="flex flex-col">
              <p class="movie-title">
                {{ movieDetail?.movieName[locale] || movieDetail?.movieName['cn'] }}
              </p>
              <div class="flex">
                <div class="tag-primary" v-if="movieDetail.activityVo">
                  {{ $t('activityMovie', [movieDetail.activityVo.activityId]) }}
                </div>
                <div class="tag-day" v-if="movieDetail.activityVo">
                  {{ $t('dayXmovie', [movieDetail.day]) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-end self-end justify-end">
          <p class="sub-title mr-4">
            {{ $t('author') }}:{{ movieDetail?.authorName || movieDetail?.author?.memberName }}
          </p>
          <MemberPop :member-vo="movieDetail?.author" v-if="movieDetail?.author" :size="36" />
        </div>
      </div>
      <div class="under flex w-full">
        <div class="underleft">
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
                <div v-if="movieDetail.movieDownloadLink">
                  <el-popover
                    placement="top-start"
                    :width="160"
                    trigger="click"
                    popper-class="popover"
                    transition="popshow"
                  >
                    <template #reference>
                      <p class="tag-day cursor-pointer">Download</p>
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
                        v-if="movieDetail?.movieDownloadLink?.other"
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
            <div class="infomation flex mt-2 ml-2">
              <p class="sub-title">{{ $t('uploadAt') }}:{{ movieDetail.createTime }}</p>
              <p class="sub-title mx-2" v-if="movieDetail.realPublishTime">
                {{ $t('firstViewTime') }}:{{ movieDetail.realPublishTime }}
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
        </div>
        <div class="underright">
          <div class="movie-comment-area ml-4">
            <p class="comment-area-title text-light-50 flex items-center mb-2">
              <span class="mark block"></span>{{ $t('comment-area') }} ({{ total }})
            </p>
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
              <ElInput
                :placeholder="$t('enterreview')"
                :rows="2"
                v-model="content"
                type="textarea"
                resize="none"
                @focus="isFocus = true"
                @blur="isFocus = false"
              ></ElInput>
              <ElButton type="danger" @click="sentComment" size="small" class="button">{{
                $t('ping')
              }}</ElButton>
            </div>
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

const { locale } = useCurrentLocale()
const { t } = useI18n()
const { unloading } = useGlobalStore()
const { pollMovie, likeOrUnLike } = useMovieOperate()

watchEffect(() => {
  getMovieDetail(movieId.value).then(async () => {
    await getVideoByDay()
    unloading()
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
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url(@/assets/img/bg.png);
    background-color: black;
    background-size: cover;
    background-attachment: fixed;
    filter: brightness(0.8);
    min-width: 320px;
    .all-wrapper {
      width: 94%;
      height: calc(100% - 128px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: auto;
      .under {
        height: calc(100% - 80px);
        .underleft {
          width: 75%;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .movie-play {
            border-radius: 20px;
            overflow: hidden;
            width: 100%;
            height: 80%;
            flex: 1;
          }
        }
        .underright {
          flex: 1;
          .movie-comment-area {
            height: 100%;
            border-radius: 20px;
            background-color: #131313;
            padding: 16px;
            display: flex;
            flex-direction: column;
            .review-area {
              max-height: calc(100% - 120px);
              flex: 1;
              overflow: auto;
            }
            .mark {
              background-color: #ffacac;
              border-radius: 20px;
              width: 15px;
              height: 10px;
              margin-right: 4px;
            }
            .button {
              position: absolute;
              right: 8px;
              bottom: 5px;
            }
          }
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
}

:deep(.el-textarea__inner) {
  border-radius: 14px;
}
</style>
