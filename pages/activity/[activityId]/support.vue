<template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="nav" v-if="activityData">
      <div class="flex items-center my-4" @click="currentActive = 0">
        <div class="dot" :class="{ active: currentActive === 0 }"></div>
        <p class="title-dot" :class="{ active: currentActive === 0 }">{{ $t('aboutM') }}</p>
      </div>
      <div
        class="flex items-center my-4"
        v-for="(item, index) in activityData.sponsorListVo"
        :key="index"
        @click="
          () => {
            currentActive = item.sposorId
            currentActiveSponsor = item
          }
        "
      >
        <div class="dot" :class="{ active: currentActive === item.sposorId }"></div>
        <p class="title-dot" :class="{ active: currentActive === item.sposorId }">
          {{ item.sponsorName[locale] || item.sponsorName['cn'] }}
        </p>
      </div>
    </div>
    <Transition mode="out-in">
      <template v-if="currentActive === 0">
        <div class="desc">
          <div class="M-desc">
            <div class="title">{{ $t('aboutM') }}</div>
            <p class="my-2">{{ $t('MDesc') }}</p>
            <p class="my-2">{{ $t('MDesc2') }}</p>
            <p class="my-2">{{ $t('MDesc3') }}</p>
          </div>
          <p class="my-2">{{ $t('contact-us') }}</p>
          <div class="contact-me flex text-light-50">
            <var-button
              type="primary"
              round
              class="mx-2"
              @click="jumpToUrl('https://space.bilibili.com/523239')"
            >
              <Icon name="ri:bilibili-line" size="20" />
            </var-button>
            <var-button
              type="primary"
              round
              class="mx-2"
              @click="jumpToUrl('https://www.nicovideo.jp/user/96755145')"
            >
              <Icon name="arcticons:niconico" size="20" />
            </var-button>
            <var-button
              type="primary"
              round
              class="mx-2"
              @click="jumpToUrl('https://www.youtube.com/channel/UCdFdBrjDrHGlDg-O67PbQYw')"
            >
              <Icon name="ri:youtube-line" size="20" />
            </var-button>
            <var-button
              type="primary"
              round
              class="mx-2"
              @click="jumpToUrl('https://twitter.com/Mirai_MAD_Team')"
            >
              <Icon name="ri:twitter-x-line" size="20" />
            </var-button>
          </div>
        </div>
      </template>
      <div v-else-if="currentActiveSponsor" class="w-full h-full flex items-center justify-center">
        <div class="w-4/5 flex flex-col items-center justify-center text-center">
          <div style="max-height: 400px">
            <MyCustomImage :img="currentActiveSponsor.sponsorLogo" />
          </div>
          <div class="title">
            {{ currentActiveSponsor.sponsorName[locale] || currentActiveSponsor.sponsorName['cn'] }}
          </div>
          <div
            class="sub-title-no-line"
            v-html="
              currentActiveSponsor.sponsorDesc[locale] || currentActiveSponsor.sponsorDesc['cn']
            "
          />
        </div>
      </div>
      <MyCustomLoading v-else />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useGlobalStore } from '~~/stores/global'

const currentActive = ref(0)
const currentActiveSponsor = ref<any>(undefined)

const attrs: { activityId: number } = useAttrs() as any
const { locale } = useCurrentLocale()
const { activityData, getActivity } = useActivityDetail(attrs.activityId)
const { unloading } = useGlobalStore()

await getActivity(attrs.activityId)
const jumpToUrl = (url: string) => {
  window.open(url, '_blank')
}

unloading()
</script>

<style lang="scss" scoped>
.nav {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  .dot {
    width: 6px;
    border-radius: 12px;
    height: 12px;
    background-color: rgb(199, 199, 199);
    margin-right: 1rem;
    transition: all ease 0.3s;
    &.active {
      height: 14px;
      background-color: $themeColor;
    }
  }
  .title-dot {
    font-size: 1.3rem;
    color: rgb(199, 199, 199);
    transition: all ease 0.3s;
    cursor: pointer;
    &:hover {
      color: $themeColor;
      .dot {
        background-color: $themeColor;
        height: 16px;
      }
    }
    &.active {
      color: $themeColor;
    }
  }
}

.desc {
  width: 60%;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
