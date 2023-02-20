<template>
  <div class="body" ref="body">
    <MMGCHeader class="flex-shrink-0" />
    <div class="movie-content" v-if="movieDetail">
      <div class="movie-header">
        <div class="flex items-center">
          <div class="tag-primary" v-if="movieDetail.activityVo">
            {{ movieDetail.activityVo.activityId }}活动作品
          </div>
          <div class="tag-day" v-if="movieDetail.activityVo">Day{{ movieDetail.day }}作品</div>
          <p class="movie-title">{{ movieDetail?.movieName['cn'] }}</p>
        </div>
        <div>
          <MemberPop :member-vo="movieDetail?.author" v-if="movieDetail?.author" :size="48" />
          <p class="sub-title" v-else>作者:{{ movieDetail?.authorName }}</p>
        </div>
      </div>
      <div class="movie-info">
        <p class="sub-title">上传于:{{ movieDetail.createTime }}</p>
        <p class="sub-title mx-2" v-if="movieDetail.realPublishTime">
          首次公开时间:{{ movieDetail.realPublishTime }}
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
          :video-url="movieDetail?.moviePlaylink['cn'] || ''"
          v-if="movieDetail?.moviePlaylink"
          :cover="movieDetail.movieCover"
        ></Aplayer>
      </div>
      <div class="movie-oper">
        <div class="flex">
          <div class="flex items-center operitem">
            <Icon name="ant-design:like-outlined" class="text-4xl" />
            <p>点赞</p>
          </div>
          <div class="flex items-center mx-2 operitem">
            <Icon name="ant-design:profile-outlined" class="text-4xl" />
            <p>投票</p>
          </div>
        </div>
        <div class="flex" v-if="movieDetail.movieLink && snsSites.length > 0">
          <p>其他渠道观看</p>
          <div>
            <div class="flex flex-wrap">
              <div
                v-for="item in snsSites"
                :key="item.value"
                class="cursor-pointer"
                :title="`点击跳转 ${item.value}`"
                @click="openlink(item.value)"
              >
                <Icon :name="item.icon" :style="{ color: item.color }" size="24px" class="mr-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="movie-desc">
        <div class="left">
          <p class="title">详细信息</p>
          <p class="desc">简介:{{ movieDetail.movieDesc['cn'] }}</p>
          <p class="sub-title">所属赛事:{{ movieDetail.activityVo?.activityName.cn }}</p>
          <p class="sub-title">
            作者:{{
              movieDetail.author ? movieDetail.author.memberName : movieDetail.authorName || ''
            }}
          </p>
        </div>
        <div>
          <p class="download">Download</p>
        </div>
      </div>
      <div class="movie-activity-other" v-if="movieDetail.activityVo && movies.length > 0">
        <p class="title">Day{{ movieDetail.day }}其他作品</p>
        <div class="movie-list">
          <div class="w-96 mr-5 flex-shrink-0">
            <MovieListCard v-for="item in movies" :key="item.movieId" :movie-item="item" />
          </div>
        </div>
      </div>
      <div class="movie-comment" v-if="movieDetail.activityVo">
        <p class="title">评论区</p>
        <ElInput
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          placeholder="你可以在此处发表你的评论哦~"
        />
        <ElButton type="primary" class="self-end mt-2">发送评论</ElButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MovieVo } from 'Movie'
import { getMovieByActivityId, getMovieDetailById } from '~~/composables/apis/movie'

const route = useRoute()
const movieDetail = ref<MovieVo>()
const movies = ref<MovieVo[]>([])
const openlink = useOpenLink()

const snsSites = ref()
const movieId = computed(() => {
  return parseInt(route.params.movieId.toString()) || 0
})

const getMovieDetail = async (movieId: number) => {
  const { data } = await getMovieDetailById(movieId)
  if (data) {
    movieDetail.value = data
    snsSites.value = useSnsSites(data.movieLink)
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

watchEffect(() => {
  getMovieDetail(movieId.value).then(() => {
    getVideoByDay()
  })
})
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(@/assets/img/bg.png);
  background-size: cover;
  filter: brightness(0.8);
  min-width: 1024px;
  .movie-content {
    width: 70%;
    display: flex;
    flex-direction: column;

    .movie-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .movie-title {
        color: $themeColor;
        font-size: $veryBigFontSize;
        font-weight: 600;
      }
    }
    .movie-info {
      display: flex;
      align-items: center;
    }
    .movie-play {
      border-radius: 20px;
      overflow: hidden;
      height: 520px;
      margin-top: 10px;
      width: 100%;
    }
    .movie-oper {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: $midFontSize;
      color: $themeColor;
      .operitem {
        border-radius: 8px;
        padding: 4px;
        cursor: pointer;
        &:hover {
          color: $whiteColor;
          background-color: $secondryColor;
        }
        &.active {
          color: $whiteColor;
          background-color: $secondryColor;
        }
      }
    }
    .movie-list {
      overflow-x: auto;
      overflow-y: unset;
      display: flex;
    }
    .movie-desc {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .desc {
        color: $tipColor;
        font-size: $smallFontSize;
      }
      .download {
        font-size: $bigFontSize;
        color: $themeColor;
        font-weight: 600;
        cursor: pointer;
      }
    }
    .movie-comment {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
