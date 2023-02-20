<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="fullpage" ref="fullpageEl" v-if="activityData">
      <div class="fullpage-container" ref="container" @mousewheel="onMouseWheel">
        <!-- CM -->
        <div class="section relative cm-section" v-if="activityData.activityCM">
          <div class="video-cm">
            <Transition name="right-to-left" mode="out-in">
              <div class="inner-container" v-if="currentItem">
                <Aplayer :video-url="currentItem.link" />
                <div class="flex justify-between items-end h-32">
                  <div>
                    <p class="title">{{ currentItem.title }}</p>
                    <p class="tip text-light-50 mb-2">作者:{{ currentItem.cmEditor }}</p>
                    <p class="sub-title">{{ currentItem.desc }}</p>
                  </div>
                  <div class="flex">
                    <p class="cursor-pointer set" @click="prevCm" v-if="currentCMIndex !== 0">
                      上一个
                    </p>
                    <p
                      class="cursor-pointer set"
                      @click="nextCm"
                      v-if="currentCMIndex !== activityData.activityCM.length - 1"
                    >
                      下一个
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
                  <p class="staff-label">主办:</p>
                  <div v-if="activityData.staff && activityData.staff.organizer">
                    <MemberPop :member-vo="activityData.staff.organizer" />
                  </div>
                </div>
                <div class="flex items-center my-2" v-if="activityData.staff.judges">
                  <p class="staff-label">评委:</p>
                  <div v-if="activityData.staff && activityData.staff.judges" class="flex">
                    <MemberPop
                      :member-vo="item"
                      v-for="item in activityData.staff.judges"
                      :key="item.memberId"
                    />
                  </div>
                </div>
                <div class="flex items-center my-2" v-if="activityData.staff.translator">
                  <p class="staff-label">翻译人员:</p>
                  <div v-if="activityData.staff && activityData.staff.translator" class="flex">
                    <MemberPop
                      :member-vo="item"
                      v-for="item in activityData.staff.translator"
                      :key="item.memberId"
                    />
                  </div>
                </div>
                <div class="flex items-center my-2" v-if="activityData.staff.others">
                  <p class="staff-label">参与贡献者:</p>
                  <div v-if="activityData.staff && activityData.staff.others" class="flex">
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
    <div class="achor">
      <div
        class="achor-item"
        v-for="(item, index) in achorList"
        :key="index"
        :class="{ current: pageState.current === index + 1 }"
        :style="clacTransform(index + 1)"
        @click="move(index + 1)"
      >
        <p class="decorate">#{{ index + 1 }}</p>
        <div class="circle"></div>
        <p class="text-xl font-bold pl-8">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ActivityVo } from 'Activity'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '~~/stores/global'

definePageMeta({
  pageTransition: { name: 'page', mode: 'out-in' }
})
const currentCMIndex = ref(0)

const prevCm = () => {
  if (currentCMIndex.value === 0) return
  currentCMIndex.value--
}
const nextCm = () => {
  if (currentCMIndex.value === activityData.value!.activityCM!.length - 1) return
  currentCMIndex.value++
}

const currentItem = computed(() => {
  if (activityData.value) {
    if (activityData.value.activityCM) {
      return activityData.value.activityCM[currentCMIndex.value]
    }
  }
  return null
})

const attrs: { activityId: number } = useAttrs() as any
const { localeState } = storeToRefs(useGlobalStore())
const locale = computed(() => localeState.value) as unknown as keyof I18N

const achorList = ref<any>([])
const { activityData } = useActivityDetail(attrs.activityId)

const { fullpageEl, container, pageState, move, onMouseWheel } = useFullPageWheel(1)

const clacTransform = (index: number) => {
  const pos = index - pageState.current
  const transformY = pos * 90 + 'px'
  const transformX = Math.abs(pos) * 15 + 'px'
  const scale = 1 - Math.abs(pos) * 0.25
  return `transform: translateY(${transformY}) translateX(${transformX}) scale(${scale});opacity: ${scale};`
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
    list.push({ name: '活动CM' })
    len++
  }
  list.push({ name: '活动介绍' })
  if (keys.includes('rules') && activityData.rules && activityData.rules.cn) {
    list.push({ name: '活动规则' })
    len++
  }
  if (keys.includes('timesorother') && activityData.timesorother && activityData.timesorother.cn) {
    list.push({ name: '注意事项' })
    len++
  }
  if (keys.includes('faq') && activityData.faq && activityData.faq.cn) {
    list.push({ name: 'FAQ&其他' })
    len++
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
  }
  .section {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .desc-like {
      padding-top: 5%;
      justify-self: flex-start;
      align-self: flex-start;
      width: 80%;
      color: $whiteColor;
      font-size: $normalFontSize;
    }
    .staff-label {
      width: 100px;
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
    .title-cm {
      font-size: 32px;
      font-weight: 600;
      color: $themeColor;
    }
  }
  .desc-like {
    align-items: flex-start;
    justify-content: flex-start;
    width: 80%;
    overflow-y: hidden;
  }
  .slider-item {
    width: 100%;
  }
}
.achor {
  position: absolute;
  top: 40%;
  right: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  color: $themeNotActiveColor;
  &-item {
    position: absolute;
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    transition: all ease 0.5s;
    &.current {
      color: $themeColor;
      text-shadow: 0 0 50px $themeColor;
    }
  }
  .circle {
    position: absolute;
    top: -20px;
    left: -20px;
    width: 100px;
    height: 100px;
    border: 3px $themeNotActiveColor solid;
    border-radius: 50%;
  }
  .decorate {
    font-size: 48px;
    font-weight: 600;
  }
}
</style>
