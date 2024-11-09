<template>
  <div class="video-container-inner">
    <div class="content-area">
      <p class="title">{{ movieItem.movieName[locale] || movieItem.movieName['cn'] }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <MemberPop v-if="movieItem.author" :member-vo="movieItem.author" :size="30" />
          <p class="text-light-50 text-xl whitespace-nowrap ml-4">
            {{ (movieItem.author && movieItem.author?.memberName) || movieItem.authorName }}
          </p>
        </div>
        <ElButton
          link
          type="primary"
          v-if="movieItem.moviePlaylink"
          @click="() => goToMovieDetailMobile(movieItem.movieId)"
          >{{ $t('enterDetail') }}</ElButton
        >
      </div>
    </div>

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

    <div class="flex">
      <var-ellipsis :line-clamp="2" class="text-light-800">
        {{ movieItem.movieDesc[locale] || movieItem.movieDesc['cn'] }}
      </var-ellipsis>
    </div>

    <div class="flex items-center mt-4" v-if="movieItem.isPublic && movieItem.moviePlaylink">
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
      <div class="flex flex-col items-center operitem" @click="pollByLink(movieItem, dayPollLink)">
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
const { pollMovie, likeOrUnLike, goToMovieDetailMobile } = useMovieOperate()
</script>

<style lang="scss" scoped>
.topPannel {
  height: 14rem;
  border-radius: 28px;
  overflow: hidden;
  margin: 4px 0;
}

.operitem {
  margin-right: 12px;
  color: $themeColor;
}

.title {
  @include showLine(2);
}
</style>
