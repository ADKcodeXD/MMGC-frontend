<template>
  <div class="video-container-inner">
    <div class="flex-1 topPannel">
      <Aplayer
        v-if="movieItem.moviePlaylink"
        :video-url="movieItem.moviePlaylink"
        :cover="movieItem.movieCover"
      />
      <div v-else class="w-full h-full">
        <MyCustomImage :img="movieItem.movieCover"></MyCustomImage>
      </div>
    </div>

    <div class="desc-pannel">
      <p class="desc-title">{{ movieItem.movieName[locale] || movieItem.movieName['cn'] }}</p>
      <div class="flex justify-between">
        <div class="flex items-end max-w-11/12">
          <MemberPop v-if="movieItem.author" :member-vo="movieItem.author" :size="30" />
          <p class="text-light-50 text-xl whitespace-nowrap">
            {{ (movieItem.author && movieItem.author?.memberName) || movieItem.authorName }}
          </p>
          <ElTooltip
            placement="top"
            :enterable="true"
            popper-class="maxwidth"
            :content="movieItem.movieDesc[locale] || movieItem.movieDesc['cn']"
          >
            <p class="sub-title ml-4">
              {{ movieItem.movieDesc[locale] || movieItem.movieDesc['cn'] }}
            </p>
          </ElTooltip>
        </div>
        <ElButton
          link
          type="primary"
          @click="goToMovieDetail(movieItem.movieId)"
          v-if="movieItem.moviePlaylink"
        >
          {{ $t('more') }}
        </ElButton>
      </div>
    </div>
    <div class="flex flex-col veta-oper" v-if="movieItem.isPublic && movieItem.moviePlaylink">
      <div class="flex items-center operitem flex-col" @click="likeOrUnLike(movieItem)">
        <template v-if="movieItem.loginVo?.isLike">
          <Icon name="ant-design:like-filled" class="text-xl" />
          <p class="operitem-font">{{ movieItem.likeNums }}</p>
        </template>
        <template v-else>
          <Icon name="ant-design:like-outlined" class="text-xl" />
          <p>{{ $t('like') }}</p>
        </template>
      </div>
      <div
        class="flex flex-col items-center my-4 operitem"
        @click="pollByLink(movieItem, dayPollLink)"
      >
        <template v-if="movieItem.loginVo?.isPoll">
          <Icon name="ant-design:profile-filled" class="text-xl" />
          <p class="operitem-font">{{ movieItem.pollNums }}</p>
        </template>
        <template v-else>
          <Icon name="ant-design:profile-outlined" class="text-xl" />
          <p>{{ $t('polls') }}</p>
        </template>
      </div>
    </div>
  </div>
  <el-dialog v-model="pollDialogShow" :title="$t('PollLink')" width="400" draggable>
    <div class="p-4">
      <div>
        <p v-if="dayPollLink?.bilibili">
          <Icon name="ri:bilibili-line" size="20" class="mr-2" />{{ $t('bilibiliPoll') }}
          <a :href="dayPollLink?.bilibili" target="_blank" style="color: #abf7ff">{{
            $t('clickJump')
          }}</a>
        </p>
        <p v-if="dayPollLink?.twitter" class="my-4">
          <Icon name="ri:twitter-x-line" size="20" class="mr-2" />{{ $t('pollTwitter') }}
          <a :href="dayPollLink?.twitter" target="_blank" style="color: #abf7ff">{{
            $t('clickJump')
          }}</a>
        </p>
        <p v-if="dayPollLink?.personalWebsite" class="my-4">
          <Icon name="ri:twitter-x-line" size="20" class="mr-2" />{{ $t('pollByCustom') }}
          <a :href="dayPollLink?.personalWebsite" target="_blank" style="color: #abf7ff">{{
            $t('clickJump')
          }}</a>
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { MovieVo } from 'Movie'
defineProps<{
  movieItem: MovieVo | any
  dayPollLink?: Sns | null
}>()
const pollDialogShow = ref(false)

const pollByLink = (movie: MovieVo, dayPollLink?: Sns | null) => {
  if (dayPollLink && (dayPollLink.bilibili || dayPollLink.twitter || dayPollLink.personalWebsite)) {
    pollDialogShow.value = true
  } else {
    pollMovie(movie)
  }
}

const { locale } = useCurrentLocale()
const { pollMovie, likeOrUnLike, goToMovieDetail } = useMovieOperate()
</script>

<style lang="scss" scoped>
.video-container-inner {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: $shadowColor;
  box-shadow: 0 0 16px $themeColorBackShadow;
  backdrop-filter: blur(4px);
  .topPannel {
    height: calc(100% - 6rem);
    background-color: #3d1e0184;
  }
  .desc-pannel {
    height: 6rem;
    padding: 1rem 0.6rem;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    background-color: #3d1e0107;
    z-index: 2;
    .desc-title {
      font-size: $midFontSize;
      color: white;
      margin-bottom: 0.5rem;
    }
  }
  &:hover {
    .veta-oper {
      opacity: 1;
    }
  }
  .veta-oper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 4rem;
    height: 300px;
    display: flex;
    justify-items: center;
    align-items: center;
    opacity: 0;
    padding: 12px 0;
    z-index: 1;
    transition: opacity ease 0.4s;

    .operitem {
      color: $themeColor;
      border-radius: 50%;
      height: 3rem;
      width: 3rem;
      padding: 6px;
      font-size: x-small;
      cursor: pointer;
      transition: background-color 0.4s ease;
      &:hover {
        background-color: #3d1e01;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.maxwidth {
  max-width: 500px;
  word-wrap: break-word;
}
</style>
