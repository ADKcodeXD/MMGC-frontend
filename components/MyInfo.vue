<template>
  <div @mouseover="isShow = true" class="relative" v-if="memberVo">
    <ElAvatar :src="memberVo.avatar || undefined" class="mx-1">{{ noAvatar }}</ElAvatar>
    <div class="popover" @mouseleave="showOff" v-show="isShow" @mouseover="isShow = true">
      <div class="flex flex-col items-center">
        <ElAvatar :size="60" :src="memberVo.avatar || undefined" class="mx-1">{{
          noAvatar
        }}</ElAvatar>
        <p class="title mt-1" style="font-size: 24px">{{ memberVo.memberName }}</p>
        <p>{{ memberVo.username }}</p>
        <p v-if="snsSites.length">{{ $t('sns') }}</p>
        <div class="flex flex-wrap">
          <div
            v-for="item in snsSites"
            :key="item.value"
            class="cursor-pointer"
            :title="`${$t('clickJump')} ${item.value}`"
            @click="openlink(item.value)"
          >
            <Icon :name="item.icon" :style="{ color: item.color }" size="16px" class="mr-1" />
          </div>
        </div>
      </div>
      <div class="wrapper">
        <div class="btn" @click="editMyInfo"><Icon name="ion:edit"></Icon>{{ $t('update') }}</div>
        <div class="btn" @click="logout">
          <Icon name="ion:log-out-outline"></Icon>{{ $t('logout') }}
        </div>
      </div>
      <MyInfoEdit ref="editRef" />
    </div>
  </div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import { MemberVo } from 'Member'
const props = defineProps<{
  memberVo: MemberVo
}>()
const { openlink, noAvatar, snsSites } = useMemberPop(props.memberVo)
const emit = defineEmits(['logout'])
const isShow = ref(false)

const editRef = ref()

const logout = () => {
  emit('logout')
  isShow.value = false
}

const editMyInfo = () => {
  editRef.value.openDialog()
}

const showOff = _.debounce(() => {
  isShow.value = false
}, 300)
</script>

<style lang="scss" scoped>
.popover {
  position: absolute;
  padding: 3px;
  top: 120%;
  right: -50%;
  width: 12rem;
  height: 15rem;
  border-radius: 30px;
  color: $themeNotActiveColor;
  box-shadow: 0 0 10px rgba(223, 62, 13, 0.212);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(65, 3, 3, 0.178);
  backdrop-filter: blur(5px);
  z-index: 1;
  overflow: hidden;
  .wrapper {
    width: 105%;
    transform: translateY(4px);
    flex-shrink: 0;
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
      color: $themeNotActiveColor;
      &:hover {
        color: $themeColor;
        background-color: rgba(39, 24, 1, 0.87);
      }
    }
  }
}
</style>
