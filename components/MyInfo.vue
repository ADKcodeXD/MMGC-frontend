<template>
  <div @mouseover="isShow = true" @mouseleave="isShow = false" class="relative">
    <ElAvatar :src="memberVo.avatar || undefined" class="mx-1">{{ noAvatar }}</ElAvatar>
    <Transition>
      <div class="popover" v-show="isShow">
        <div class="flex flex-col items-center">
          <ElAvatar :size="60" :src="memberVo.avatar || undefined" class="mx-1">{{
            noAvatar
          }}</ElAvatar>
          <p class="title mt-1">{{ memberVo.memberName }}</p>
          <p>{{ memberVo.username }}</p>
          <p v-if="snsSites.length">社交媒体</p>
          <div class="flex flex-wrap">
            <div
              v-for="item in snsSites"
              :key="item.value"
              class="cursor-pointer"
              :title="`点击跳转 ${item.value}`"
              @click="openlink(item.value)"
            >
              <Icon :name="item.icon" :style="{ color: item.color }" size="24px" class="mr-1" />
            </div>
          </div>
        </div>

        <div class="wrapper">
          <div class="btn"><Icon name="ion:edit"></Icon>修改</div>
          <div class="btn" @click="logout"><Icon name="ion:log-out-outline"></Icon>注销</div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { MemberVo } from 'Member'
import _ from 'lodash'
interface SiteItem {
  value: string
  icon: string
  color: string
}
const props = defineProps<{
  memberVo: MemberVo
}>()
const emit = defineEmits(['logout'])
const isShow = ref(true)
const noAvatar = computed(() => {
  if (!props.memberVo.avatar) {
    return props.memberVo.memberName.slice(0, 1)
  }
  return undefined
})
const snsSites = computed<SiteItem[]>(() => {
  if (props.memberVo.snsSite) {
    const keys = _.keys(props.memberVo.snsSite)
    const map: Record<string, any> = {
      bilibili: {
        color: '#EC2775',
        icon: 'ri:bilibili-fill'
      },
      niconico: {
        color: '#D4DADA',
        icon: 'simple-icons:niconico'
      },
      youtube: { color: '#4664F0', icon: 'logos:youtube-icon' },
      twitter: { color: '#1D9BF0', icon: 'logos:twitter' },
      personalWebsite: { color: '#E57119', icon: 'material-symbols:broadcast-on-personal' }
    }
    return keys.map(item => {
      const temp = map[item]
      temp.value = (props.memberVo.snsSite as any)[item]
      return temp
    })
  }
  return []
})
const logout = () => {
  emit('logout')
  isShow.value = false
}
const openlink = (link: string) => {
  if (window) {
    window.location.replace(link)
  }
}
</script>
<style lang="scss" scoped>
.popover {
  position: absolute;
  padding: 3px;
  top: 120%;
  right: -50%;
  width: 10rem;
  height: 14rem;
  border-radius: 30px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 10px rgba(223, 62, 13, 0.212);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(250, 128, 114, 0.123);
  overflow: hidden;
  .wrapper {
    width: 105%;
    transform: translateY(4px);
    .btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 28px;
      font-size: 14px;
      border-bottom: 1px solid;
      background-color: rgba(39, 24, 1, 0.342);
      transition: 0.4s ease all;
      &:hover {
        color: $themeColor;
        background-color: rgba(39, 24, 1, 0.87);
      }
    }
  }
}
</style>
