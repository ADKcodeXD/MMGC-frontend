<template>
  <div class="video-container-inner">
    <div class="flex-1 topPannel">
      <Aplayer
        v-if="movieItem.moviePlaylink"
        :video-url="movieItem.moviePlaylink"
        :cover="movieItem.movieCover"
        :ref="setItemRefs"
        @on-play="canAutoPlay = false"
        @on-pause="canAutoPlay = true"
      />
      <div v-else class="w-full h-full">
        <MyCustomImage :img="movieItem.movieCover"></MyCustomImage>
      </div>
    </div>

    <div class="desc-pannel">
      <p class="desc-title">{{ movieItem.movieName[locale] || movieItem.movieName['cn'] }}</p>
      <div class="flex justify-between">
        <div class="flex items-end">
          <MemberPop v-if="movieItem.author" :member-vo="movieItem.author" :size="30" />
          <p class="text-light-50 break-words text-xl">
            {{ movieItem.author?.memberName || movieItem.authorName }}
          </p>
          <p class="sub-title ml-4">
            {{ movieItem.movieDesc[locale] || movieItem.movieDesc['cn'] }}
          </p>
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
      <div class="flex flex-col items-center my-4 operitem" @click="pollMovie(movieItem)">
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
</template>

<script setup lang="ts">
import { MovieVo } from 'Movie'
defineProps<{
  movieItem: MovieVo
}>()

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
    display: flex;
    justify-items: center;
    align-items: center;
    backdrop-filter: blur(4px);
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