<template>
  <div v-if="movieItem" @click="goToMovieDetail(movieItem.movieId)">
    <div class="movie-item relative">
      <div class="desc-info-detail">
        <div>
          <p class="title-2">{{ movieItem.movieName.cn }}</p>
          <p class="sub">{{ movieItem.movieDesc.cn }}</p>
        </div>

        <div class="flex w-full justify-between items-center">
          <div class="info">
            <div class="mx-2 info-center">
              <Icon name="ant-design:like-outlined" />
              <span>{{ movieItem.likeNums }}</span>
            </div>
            <div class="mx-2 info-center">
              <Icon name="ant-design:comment-outlined" />
              <span>{{ movieItem.commentNums }}</span>
            </div>
            <div class="mx-2 info-center">
              <Icon name="ant-design:profile-outlined" />
              <span>{{ movieItem.pollNums }}</span>
            </div>
            <div class="mx-2 info-center">
              <Icon name="ant-design:eye-outlined" />
              <span>{{ movieItem.viewNums }}</span>
            </div>
          </div>
          <div class="flex items-center mt-3">
            <p class="text-light-50 mr-3">作者:</p>
            <MemberPop v-if="movieItem.author" :member-vo="movieItem.author" :size="30" />
            <p v-else>{{ movieItem.authorName }}</p>
          </div>
        </div>
      </div>
      <div class="w-full h-full bg-black">
        <MyCustomImage :img="movieItem.movieCover" />
      </div>
    </div>
    <div>
      <p class="title-click">{{ movieItem.movieName.cn }}</p>
      <div class="info text-xl">
        <Icon
          name="fa6-brands:bilibili"
          class="cursor-pointer"
          v-if="movieItem.movieLink?.bilibili"
          @click="openlink(movieItem.movieLink?.bilibili || '')"
        />
        <Icon
          name="ph:youtube-logo-bold"
          class="cursor-pointer"
          v-if="movieItem.movieLink?.youtube"
          @click="openlink(movieItem.movieLink?.youtube || '')"
        /><Icon
          name="simple-icons:niconico"
          class="cursor-pointer"
          v-if="movieItem.movieLink?.niconico"
          @click="openlink(movieItem.movieLink?.niconico || '')"
        /><Icon
          name="ant-design:twitter-circle-filled"
          class="cursor-pointer"
          v-if="movieItem.movieLink?.twitter"
          @click="openlink(movieItem.movieLink?.twitter || '')"
        /><Icon
          name="ant-design:smile-twotone"
          class="cursor-pointer"
          v-if="movieItem.movieLink?.personalWebsite"
          @click="openlink(movieItem.movieLink?.personalWebsite || '')"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { MovieVo } from 'Movie'

defineProps<{
  movieItem: MovieVo
}>()
const openlink = useOpenLink()
const localeNaviGate = useLocaleNavigate()

const goToMovieDetail = (movieId: number) => {
  localeNaviGate(`/movie/${movieId}`)
}
</script>
<style lang="scss" scoped>
.movie-item {
  width: 100%;
  height: 200px;
  background-color: #fff;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all ease 0.4s;
  &:hover {
    transform: translateY(-10px) scale(1.05);
    .desc-info-detail {
      transform: translateY(0);
    }
  }
  .desc-info-detail {
    position: absolute;
    z-index: 1;
    background-color: rgba(20, 1, 1, 0.801);
    width: 100%;
    height: 100%;
    padding: 14px 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateY(100%);
    transition: all ease 0.4s;
    .title-2 {
      color: $themeColor;
      font-size: $bigFontSize;
      @include showLine(2);
    }
    .sub {
      color: $tipColor;
      font-size: $normalFontSize;
      @include showLine(2);
    }
  }
}
</style>
