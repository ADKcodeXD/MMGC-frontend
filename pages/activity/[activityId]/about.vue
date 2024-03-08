<template>
  <div class="w-full h-full flex items-center justify-center">
    <Transition mode="out-in">
      <div class="fullpage" ref="fullpageEl" v-if="activityData && !isLoading">
        <div class="fullpage-container" ref="container" @mousewheel="onMouseWheel">
          <!-- CM -->
          <div class="section relative cm-section" v-if="activityData.activityCM">
            <div class="video-cm">
              <Transition mode="out-in" :name="isPrev ? 'right-to-left' : 'left-to-right'">
                <div class="inner-container" v-if="currentItem" :key="currentItem.link">
                  <Aplayer :video-url="currentItem.link" />
                  <div class="flex justify-between items-end h-32">
                    <div>
                      <p class="title" :title="currentItem.title || ''">{{ currentItem.title }}</p>
                      <p class="tip text-light-50 mb-2">
                        {{ $t('author') }}:{{ currentItem.cmEditor }}
                      </p>
                      <p class="sub-title" :title="currentItem.desc || ''">
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
              <div v-if="activityData.staff">
                <p class="title" v-if="activityData.staff.organizer">Staff</p>
                <div class="flex flex-col">
                  <div class="flex items-center my-2" v-if="activityData.staff.organizer">
                    <p class="staff-label">{{ $t('organizer') }}:</p>
                    <div v-if="activityData.staff && activityData.staff.organizer">
                      <MemberPop :member-vo="activityData.staff.organizer" />
                    </div>
                  </div>
                  <div class="flex items-center my-2" v-if="activityData.staff.judges">
                    <p class="staff-label">{{ $t('judge') }}:</p>
                    <div
                      v-if="activityData.staff && activityData.staff.judges"
                      class="flex flex-wrap"
                    >
                      <MemberPop
                        :member-vo="item"
                        v-for="item in activityData.staff.judges"
                        :key="item.memberId"
                      />
                    </div>
                  </div>
                  <div class="flex items-center my-2" v-if="activityData.staff.translator">
                    <p class="staff-label">{{ $t('translator') }}:</p>
                    <div
                      v-if="activityData.staff && activityData.staff.translator"
                      class="flex flex-wrap"
                    >
                      <MemberPop
                        :member-vo="item"
                        v-for="item in activityData.staff.translator"
                        :key="item.memberId"
                      />
                    </div>
                  </div>
                  <div class="flex items-center my-2" v-if="activityData.staff.others">
                    <p class="staff-label">{{ $t('commiter') }}:</p>
                    <div
                      v-if="activityData.staff && activityData.staff.others"
                      class="flex flex-wrap"
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
              <div v-html="activityData.rules[locale] || activityData.rules['cn']" />
            </div>
          </div>
          <!-- other -->
          <div class="section" v-if="activityData.timesorother">
            <div class="desc-like">
              <div v-html="activityData.timesorother[locale] || activityData.timesorother['cn']" />
            </div>
          </div>
          <!-- faq -->
          <div class="section" v-if="activityData.faq">
            <div class="desc-like">
              <div v-html="activityData.faq[locale] || activityData.faq['cn']" />
            </div>
          </div>
        </div>
      </div>
      <MyCustomLoading v-else />
    </Transition>
    <AchorList
      :page-state="pageState"
      @move="move"
      :achor-list="achorList"
      v-if="activityData && !isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import type { ActivityVo } from 'Activity'
import _ from 'lodash'
import { useGlobalStore } from '~~/stores/global'

const attrs: { activityId: number } = useAttrs() as any
const { locale } = useCurrentLocale()
const { activityData, isLoading } = useActivityDetail(attrs.activityId)
const { fullpageEl, container, pageState, move, onMouseWheel } = useFullPageWheel(1)
const { unloading } = useGlobalStore()

const currentCMIndex = ref(0)
const isPrev = ref(false)
const achorList = ref<any>([])

const prevCm = () => {
  if (currentCMIndex.value === 0) return
  isPrev.value = true
  currentCMIndex.value--
}

const nextCm = () => {
  if (currentCMIndex.value === activityData.value!.activityCM!.length - 1) return
  isPrev.value = false
  currentCMIndex.value++
}

const length = (activityData: Partial<ActivityVo>) => {
  const keys = _.keys(activityData) as Array<keyof ActivityVo>
  let len = 1
  const list: { name: string }[] = []
  if (
    keys.includes('activityCM') &&
    activityData.activityCM &&
    activityData.activityCM.length > 0
  ) {
    list.push({ name: 'activityCm' })
    len++
  }
  list.push({ name: 'activityDesc' })
  if (keys.includes('rules') && activityData.rules && activityData.rules.cn) {
    list.push({ name: 'activityRules' })
    len++
  }
  if (keys.includes('timesorother') && activityData.timesorother && activityData.timesorother.cn) {
    list.push({ name: 'warning' })
    len++
  }
  if (keys.includes('faq') && activityData.faq && activityData.faq.cn) {
    list.push({ name: 'faqOther' })
    len++
  }
  achorList.value = list
  return len
}

const currentItem = computed(() => {
  if (activityData.value) {
    if (activityData.value.activityCM) {
      return activityData.value.activityCM[currentCMIndex.value]
    }
  }
  return null
})

watchEffect(() => {
  const len = length(activityData.value || {})
  pageState.len = len
})

watchEffect(() => {
  if (!isLoading.value) {
    unloading()
  }
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .fullpage {
    height: 100%;
    width: 100%;
    overflow: hidden;
    &-container {
      height: 100%;
      width: 100%;
      transition: all ease 0.5s;
    }
    .section {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-height: 100%;
      height: 100%;
      overflow: auto;
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
      }
      .title-cm {
        font-size: 32px;
        font-weight: 600;
        color: $themeColor;
      }
    }
    .desc-like {
      align-items: flex-start;
      justify-content: flex-start;
      width: 95%;
      overflow-y: hidden;
    }
  }
}

@media screen and (min-width: 1440px) {
  .fullpage {
    width: 80%;
    .section {
      height: 100%;
      overflow: auto;
      .desc-like {
        overflow-y: hidden;
        width: 80%;
      }
    }
    .cm-section {
      .video-cm {
        .inner-container {
          width: 80%;
        }
      }
    }
  }
}
</style>
