<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="fullpage" ref="fullpageEl" v-if="activityData">
      <div class="fullpage-container" ref="container" @mousewheel="onMouseWheel">
        <!-- CM -->
        <div class="section relative" v-if="activityData.activityCM">
          <p class="absolute top--2 left-0 title-cm">活动CM</p>
          <Swiper
            :modules="[SwiperNavigation, SwiperController, SwiperPagination]"
            :allowTouchMove="false"
            :pagination="true"
            :navigation="true"
            :slides-per-view="1"
          >
            <SwiperSlide v-for="item in activityData.activityCM" :key="item">
              <Aplayer :video-url="item" />
            </SwiperSlide>
          </Swiper>
        </div>
        <!-- desc 介绍 -->
        <div class="section desc-like">
          <div class="desc-name">
            <div>
              <p class="title">
                {{ activityData.activityName[locale] || activityData.activityName.cn }}
              </p>
              <div
                v-if="activityData.desc"
                v-html="activityData.desc[locale] || activityData.desc['cn']"
              />
            </div>
            <div v-if="activityData.startTime && activityData.endTime">
              <p class="title">起止时间</p>
              <p>{{ activityData.startTime }} 至 {{ activityData.endTime }}</p>
            </div>
            <div v-if="activityData.staff">
              <p class="title" v-if="activityData.staff.organizer">Staff</p>
              <div class="flex flex-col">
                <div class="flex items-center my-2" v-if="activityData.staff.organizer">
                  <p>主办:</p>
                  <div v-if="activityData.staff && activityData.staff.organizer">
                    <MemberPop :member-vo="activityData.staff.organizer" />
                  </div>
                </div>
                <div class="flex items-center my-2" v-if="activityData.staff.judges">
                  <p>评委:</p>
                  <div v-if="activityData.staff && activityData.staff.judges" class="flex">
                    <MemberPop
                      :member-vo="item"
                      v-for="item in activityData.staff.judges"
                      :key="item.memberId"
                    />
                  </div>
                </div>
                <div class="flex items-center my-2" v-if="activityData.staff.translator">
                  <p>翻译人员:</p>
                  <div v-if="activityData.staff && activityData.staff.translator" class="flex">
                    <MemberPop
                      :member-vo="item"
                      v-for="item in activityData.staff.translator"
                      :key="item.memberId"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- rules -->
        <div class="section">this is about4</div>
        <!-- other -->
      </div>
    </div>
    <MyCustomLoading v-else />
    <div class="achor">
      <div
        class="achor-item"
        v-for="item in 3"
        :key="item"
        :class="{ current: pageState.current === item }"
        :style="clacTransform(item)"
        @click="move(item)"
      >
        <p class="decorate">#{{ item }}</p>
        <div class="circle"></div>
        <p class="text-xl font-bold pl-8">活动CM</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '~~/stores/global'

definePageMeta({
  key: route => route.fullPath
})

const attrs: { activityId: number } = useAttrs() as any
const { localeState } = storeToRefs(useGlobalStore())
const locale = computed(() => localeState.value) as unknown as keyof I18N
const { activityData } = useActivityDetail(attrs.activityId)
const { fullpageEl, container, pageState, move, onMouseWheel } = useFullPageWheel(3)

const clacTransform = (index: number) => {
  const pos = index - pageState.current
  const transformY = pos * 90 + 'px'
  const transformX = Math.abs(pos) * 15 + 'px'
  const scale = 1 - Math.abs(pos) * 0.25
  return `transform: translateY(${transformY}) translateX(${transformX}) scale(${scale});opacity: ${scale};`
}
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
    .title-cm {
      font-size: 32px;
      font-weight: 600;
      color: $themeColor;
    }
    .desc-name {
      justify-self: flex-start;
      width: 80%;
      color: $whiteColor;
      font-size: $normalFontSize;
    }
  }
  .desc-like {
    padding-top: 5%;
    align-items: flex-start;
    overflow-y: hidden;
  }
  .slider-item {
    width: 100%;
  }
}
.achor {
  position: absolute;
  top: 300px;
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

<style>
.swiper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-slide,
.swiper-slide-duplicate {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
</style>
