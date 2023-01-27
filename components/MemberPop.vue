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
import { MemberVo } from 'Member'

const props = defineProps<{
  memberVo: MemberVo
}>()
const { openlink, noAvatar, snsSites } = useMemberPop(props.memberVo)
</script>
