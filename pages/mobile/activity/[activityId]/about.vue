<template>
  <Transition mode="out-in">
    <div class="fullpage" v-if="activityData && !isLoading">
      <div class="section p-2" v-if="activityData.activityCM">
        <Transition mode="out-in" :name="isPrev ? 'right-to-left' : 'left-to-right'">
          <div class="inner-container" v-if="currentItem" :key="currentItem.link">
            <p class="title threeline" :title="currentItem.title || ''">{{ currentItem.title }}</p>
            <ClientOnly>
              <div class="h-64">
                <Aplayer :video-url="currentItem.link" />
              </div>
            </ClientOnly>
            <div class="flex justify-between items-end">
              <div class="flex flex-col">
                <p class="tip text-light-50 mb-2">{{ $t('author') }}:{{ currentItem.cmEditor }}</p>
                <p class="text-light-50" :title="currentItem.desc || ''">
                  {{ currentItem.desc }}
                </p>
              </div>
              <div class="flex">
                <p class="cursor-pointer set" @click="prevCm" v-if="currentCMIndex !== 0">
                  {{ $t('prev') }}
                </p>
                <p
                  class="cursor-pointer set"
                  @click="nextCm"
                  v-if="currentCMIndex !== activityData.activityCM.length - 1"
                >
                  {{ $t('next') }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <!-- desc 介绍 -->
      <div class="section">
        <div class="desc-like">
          <div>
            <p class="title">
              {{ activityData.activityName[locale] || activityData.activityName.cn }}
            </p>
            <div
              v-if="activityData.desc"
              v-html="activityData.desc[locale] || activityData.desc['cn']"
            />
          </div>
          <div v-if="activityData.staff" class="mt-2">
            <p class="title" v-if="activityData.staff.organizer">Staff</p>
            <div class="flex flex-col">
              <div class="flex items-center my-2" v-if="activityData.staff.organizer">
                <p class="my-2">{{ $t('organizer') }}:</p>
                <div v-if="activityData.staff && activityData.staff.organizer">
                  <MemberPop :member-vo="activityData.staff.organizer" />
                </div>
              </div>
              <div class="flex flex-col my-2" v-if="activityData.staff.judges">
                <p class="my-2">{{ $t('judge') }}:</p>

                <div
                  v-if="activityData.staff && activityData.staff.judges"
                  class="flex flex-wrap gap-1"
                >
                  <MemberPop
                    :member-vo="item"
                    v-for="item in activityData.staff.judges"
                    :key="item.memberId"
                  />
                </div>
              </div>
              <div class="my-2 flex flex-col" v-if="activityData.staff.translator">
                <p class="my-2">{{ $t('translator') }}:</p>
                <div
                  v-if="activityData.staff && activityData.staff.translator"
                  class="flex flex-wrap gap-1"
                >
                  <MemberPop
                    :member-vo="item"
                    v-for="item in activityData.staff.translator"
                    :key="item.memberId"
                  />
                </div>
              </div>
              <div class="flex flex-col my-2" v-if="activityData.staff.others">
                <p class="my-2">{{ $t('commiter') }}:</p>
                <div
                  v-if="activityData.staff && activityData.staff.others"
                  class="flex flex-wrap gap-1"
                >
                  <MemberPop
                    :member-vo="item"
                    v-for="item in activityData.staff.others"
                    :key="item.memberId"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- rules -->
      <div class="section" v-if="activityData.rules">
        <div class="desc-like">
          <p class="title">{{ $t('warning') }}</p>
          <div v-html="activityData.rules[locale] || activityData.rules['cn']" />
        </div>
      </div>
      <!-- other -->
      <div class="section" v-if="activityData.timesorother">
        <div class="desc-like">
          <p class="title">{{ $t('其他') }}</p>
          <div v-html="activityData.timesorother[locale] || activityData.timesorother['cn']" />
        </div>
      </div>
      <!-- faq -->
      <div class="section" v-if="activityData.faq">
        <div class="desc-like">
          <p class="title">FAQ</p>
          <div v-html="activityData.faq[locale] || activityData.faq['cn']" />
        </div>
      </div>
    </div>
    <MyCustomLoading v-else />
  </Transition>
</template>

<script setup lang="ts">
import _ from 'lodash'
const { locale } = useCurrentLocale()
const { activityData, currentItem, nextCm, prevCm, currentCMIndex, isLoading, isPrev } =
  useAboutPage()
</script>

<style lang="scss" scoped>
.fullpage {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  .section {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .desc-like {
      padding-top: 5%;
      justify-self: flex-start;
      align-self: flex-start;
      width: 95%;
      color: $whiteColor;
      font-size: $normalFontSize;
    }
    .staff-label {
      width: 100px;
      flex-shrink: 0;
    }
  }
  .inner-container {
    display: flex;
    flex-direction: column;
    width: 95%;
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
  .title-cm {
    font-size: 32px;
    font-weight: 600;
    color: $themeColor;
  }
  .desc-like {
    align-items: flex-start;
    justify-content: flex-start;
    width: 95%;
    overflow-y: hidden;
  }
  .threeline {
    @include showLine(3);
  }
}
</style>
