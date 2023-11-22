<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="fullpage" ref="fullpageEl" v-if="activityData">
      <div class="fullpage-container" ref="container" @mousewheel="onMouseWheel">
        <!-- CM -->
        <div class="section desc relative">
          <div class="M-desc">
            <div class="title">{{ $t('aboutM') }}</div>

            <p class="my-2">{{ $t('MDesc') }}</p>
            <p class="my-2">{{ $t('MDesc2') }}</p>
            <p class="my-2">{{ $t('MDesc3') }}</p>
          </div>
          <div class="contact-me flex flex-col text-light-50">
            <div class="contact">
              <div class="wrapper">
                <p class="label">BiliBili</p>
              </div>
              <a href="https://space.bilibili.com/523239">https://space.bilibili.com/523239</a>
            </div>
            <div class="contact">
              <div class="wrapper">
                <p class="label">Niconico</p>
              </div>
              <a href="https://www.nicovideo.jp/user/96755145"
                >https://www.nicovideo.jp/user/96755145</a
              >
            </div>
            <div class="contact">
              <div class="wrapper">
                <p class="label">Youtube</p>
              </div>
              <a href="https://www.youtube.com/channel/UCdFdBrjDrHGlDg-O67PbQYw"
                >https://www.youtube.com/channel/UCdFdBrjDrHGlDg-O67PbQYw</a
              >
            </div>
            <div class="contact">
              <div class="wrapper">
                <p class="label">Twitter</p>
              </div>
              <a href="https://twitter.com/Mirai_MAD_Team">https://twitter.com/Mirai_MAD_Team</a>
            </div>
          </div>
        </div>
        <div
          class="section sponsor"
          v-for="(item, index) in activityData.sponsorListVo"
          :key="index"
        >
          <div :style="{ maxHeight: item.sponsorName.cn ? '400px' : '500px' }">
            <MyCustomImage :img="item.sponsorLogo" />
          </div>
          <div class="title">
            {{ item.sponsorName[locale] || item.sponsorName['cn'] }}
          </div>
          <div
            class="sub-title-no-line"
            v-html="item.sponsorDesc[locale] || item.sponsorDesc['cn']"
          />
        </div>
      </div>
    </div>
    <MyCustomLoading v-else />
    <AchorList :page-state="pageState" @move="move" :achor-list="achorList" />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useGlobalStore } from '~~/stores/global'
const achorList = ref<any>([])

const attrs: { activityId: number } = useAttrs() as any
const { locale } = useCurrentLocale()
const { activityData, getActivity } = useActivityDetail(attrs.activityId)
const { fullpageEl, container, pageState, move, onMouseWheel } = useFullPageWheel(1)
const { unloading } = useGlobalStore()

const length = (activityData: any) => {
  let len = 1
  const list: { name: string }[] = []
  list.push({ name: 'oranganDesc' })
  if (activityData.sponsorListVo && activityData.sponsorListVo.length > 0) {
    activityData.sponsorListVo?.forEach((item: any) => {
      len++
      list.push({ name: item.sponsorName[locale] || item.sponsorName['cn'] })
    })
  }
  achorList.value = list
  return len
}

await getActivity(attrs.activityId)
unloading()

watchEffect(() => {
  const len = length(activityData.value || {})
  pageState.len = len
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .fullpage {
    height: 100%;
    width: 95%;
    overflow: hidden;
    &-container {
      height: 100%;
      width: 100%;
      transition: all ease 0.5s;
      .sponsor {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
      }
    }
    .section {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
      overflow: auto;
      &.desc {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .M-desc {
          display: inline-flex;
          flex-direction: column;
          max-width: 900px;
          word-wrap: break-word;
          word-break: normal;
          font-size: $midFontSize;
          color: $textColor;
          line-height: 24px;
        }
        .contact {
          display: flex;
          align-items: center;
          margin: 4px 0;
          a {
            max-width: 75%;
            word-break: break-all;
          }
          .wrapper {
            width: 100px;
            .label {
              width: 80px;
              padding: 0 5px;
              background-color: $themeColor;
              border-radius: 4px;
              margin-right: 4px;
              color: $backgroundColor;
            }
          }
        }
      }
    }
    .cm-section {
      width: 100%;
      height: 100%;
      display: flex;
      overflow-x: hidden;
      justify-content: flex-start;
      .video-cm {
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        display: flex;
        .inner-container {
          display: flex;
          flex-direction: column;
          width: 80%;
          height: 100%;
          .set {
            color: $themeNotActiveColor;
            font-size: $bigFontSize;
            margin-left: 5px;
            &:hover {
              color: $themeColor;
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1440px) {
  .fullpage {
    width: 80%;
    .section {
      overflow: hidden;
      justify-content: center;
    }
  }
}
</style>
