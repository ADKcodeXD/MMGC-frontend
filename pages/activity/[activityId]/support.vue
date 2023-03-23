<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="fullpage" ref="fullpageEl" v-if="activityData">
      <div class="fullpage-container" ref="container" @mousewheel="onMouseWheel">
        <!-- CM -->
        <div class="section desc relative">
          <table width="100%" border="0" cellpadding="0" cellspacing="10px">
            <tr>
              <td class="title">{{ $t('aboutM') }}</td>
            </tr>
            <tr>
              <td class="M-desc">
                <p class="my-2">{{ $t('MDesc') }}</p>
                <p class="my-2">{{ $t('MDesc2') }}</p>
                <p class="my-2">{{ $t('MDesc3') }}</p>
              </td>
            </tr>
            <tr>
              <td style="color: white; font-weight: normal">
                <span style="color: black; background-color: #ffc962; border-radius: 4px"
                  >&nbsp;&nbsp;BiliBili：</span
                >&nbsp;<a href="https://space.bilibili.com/523239"
                  >https://space.bilibili.com/523239</a
                >
              </td>
            </tr>
            <tr>
              <td style="color: white; font-weight: normal">
                <span style="color: black; background-color: #ffc962; border-radius: 4px"
                  >&nbsp;&nbsp;Twitter：</span
                >&nbsp;<a href="https://twitter.com/Mirai_MAD_Team"
                  >https://twitter.com/Mirai_MAD_Team</a
                >
              </td>
            </tr>
            <tr>
              <td style="color: white; font-weight: normal">
                <span style="color: black; background-color: #ffc962; border-radius: 4px"
                  >&nbsp;&nbsp;Niconico：</span
                >&nbsp;<a href="https://www.nicovideo.jp/user/96755145"
                  >https://www.nicovideo.jp/user/96755145</a
                >
              </td>
            </tr>
            <tr>
              <td style="color: white; font-weight: normal">
                <span style="color: black; background-color: #ffc962; border-radius: 4px"
                  >&nbsp;&nbsp;Youtube：</span
                >&nbsp;<a href="https://www.youtube.com/channel/UCdFdBrjDrHGlDg-O67PbQYw"
                  >https://www.youtube.com/channel/UCdFdBrjDrHGlDg-O67PbQYw</a
                >
              </td>
            </tr>
          </table>
        </div>
        <div
          class="section sponsor"
          v-for="(item, index) in activityData.sponsorListVo"
          :key="index"
        >
          <div class="w-96">
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
import { ActivityVo } from 'Activity'
import _ from 'lodash'
const attrs: { activityId: number } = useAttrs() as any
const { locale } = useCurrentLocale()
const { activityData, getActivity } = useActivityDetail(attrs.activityId)
await getActivity(attrs.activityId)
const achorList = ref<any>([])

const { fullpageEl, container, pageState, move, onMouseWheel } = useFullPageWheel(1)
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

watchEffect(() => {
  const len = length(activityData.value || {})
  pageState.len = len
})
</script>

<style lang="scss" scoped>
.fullpage {
  height: 100%;
  width: 80%;
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
    .desc {
      display: flex;
      align-items: center;
      justify-content: center;
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
    }
  }
  .section {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
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
</style>
