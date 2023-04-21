<template>
  <el-popover placement="top" :width="300" trigger="hover" :show-after="100" transition="popshow">
    <template #reference>
      <ElAvatar
        :src="calcZip(memberVo.avatar, '0.4x') || undefined"
        class="mx-1"
        :size="size || 32"
        >{{ noAvatar }}</ElAvatar
      >
    </template>
    <template #default>
      <div class="flex">
        <ElAvatar
          :src="calcZip(memberVo.avatar, '0.4x') || undefined"
          :size="80"
          class="flex-shrink-0"
          >{{ noAvatar }}</ElAvatar
        >
        <div class="ml-2">
          <p class="text-2xl">{{ memberVo.memberName }}</p>
          <p class="text-xs">@{{ memberVo.email || memberVo.username }}</p>
          <p class="text-gray-400">{{ memberVo.desc }}</p>
          <div v-if="memberVo.snsSite">
            <p class="my-2 text-xs">{{ $t('sns') }}</p>
            <div class="flex flex-wrap">
              <div
                v-for="item in snsSites"
                :key="item.value"
                class="cursor-pointer"
                :title="`${$t('clickJump')} ${item.value}`"
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
import { calcZip } from '~~/utils'

const props = defineProps<{
  memberVo: MemberVo
  size?: number
}>()
const { openlink, noAvatar, snsSites } = useMemberPop(props.memberVo)
</script>
