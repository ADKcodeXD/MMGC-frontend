<template>
  <el-popover placement="top" :width="300" trigger="hover">
    <template #reference>
      <ElAvatar :src="memberVo.avatar || undefined" class="mx-1">{{ noAvatar }}</ElAvatar>
    </template>
    <template #default>
      <div class="flex">
        <ElAvatar :src="memberVo.avatar || undefined" :size="80" class="flex-shrink-0">{{
          noAvatar
        }}</ElAvatar>
        <div class="ml-2">
          <p class="text-2xl">{{ memberVo.memberName }}</p>
          <p class="text-xs">@{{ memberVo.email || memberVo.username }}</p>
          <p class="text-gray-400">{{ memberVo.desc }}</p>
          <div v-if="memberVo.snsSite">
            <p class="my-2 text-xs">社交媒体</p>
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
        </div>
      </div>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { MemberVo } from 'Member'
interface SiteItem {
  value: string
  icon: string
  color: string
}
const props = defineProps<{
  memberVo: MemberVo
}>()

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

const openlink = (link: string) => {
  if (window) {
    window.location.replace(link)
  }
}
</script>
