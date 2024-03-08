<template>
  <div class="relative" v-if="memberVo" ref="ref1">
    <ElAvatar :src="memberVo.avatar || undefined" class="mx-1">{{ noAvatar }}</ElAvatar>
    <Transition name="up-to-down">
      <div class="popover" ref="ref2" v-show="isHover || isHover1">
        <div class="flex flex-col">
          <div class="flex items-center justify-between">
            <ElAvatar :size="52" :src="memberVo.avatar || undefined">{{ noAvatar }}</ElAvatar>
            <div class="flex flex-col ml-2">
              <p class="name1">{{ memberVo.memberName }}</p>
              <p class="username">@{{ memberVo.username }}</p>
            </div>
          </div>
          <div class="flex flex-col mt-4">
            <p class="text-light-50 text-lg">{{ $t('sns') }}</p>
            <div class="flex flex-wrap" v-if="snsSites.length">
              <div
                v-for="item in snsSites"
                :key="item.value"
                class="cursor-pointer mx-1"
                :title="`${$t('clickJump')} ${item.value}`"
                @click="openlink(item.value)"
              >
                <Icon :name="item.icon" :style="{ color: item.color }" size="16px" class="mr-1" />
              </div>
            </div>
            <p v-else>暂未关联社交媒体</p>
          </div>
        </div>

        <div class="wrapper">
          <div class="btn bg-blue-500" @click="editMyInfo">
            <Icon name="ion:edit"></Icon>{{ $t('update') }}
          </div>
          <div class="btn bg-red-500" @click="logout">
            <Icon name="ion:log-out-outline"></Icon>{{ $t('logout') }}
          </div>
        </div>
        <MyInfoEdit ref="editRef" />
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import _ from 'lodash'
import type { MemberVo } from 'Member'

const props = defineProps<{
  memberVo: MemberVo
}>()
const emit = defineEmits(['logout'])
const { openlink, noAvatar, snsSites } = useMemberPop(props.memberVo)
const isShow = ref(false)
const ref2 = ref()
const ref1 = ref()

const isHover = useElementHover(ref2)
const isHover1 = useElementHover(ref1)
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
  padding: 8px 8px;
  top: 120%;
  right: -45%;
  width: 12rem;
  height: 13rem;
  border-radius: 16px;
  color: $themeNotActiveColor;
  box-shadow: 0 0 10px rgba(223, 62, 13, 0.212);
  display: flex;
  border: 2px solid $themeColor;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(65, 3, 3, 0.178);
  backdrop-filter: blur(5px);
  z-index: 1;
  overflow: hidden;
  .name1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    @include showLine(2);
  }
  .username {
    font-size: 0.8rem;
    color: rgb(192, 192, 192);
  }
  .wrapper {
    width: 100%;
    flex-shrink: 0;
    .btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 28px;
      font-size: 14px;
      border-radius: 16px;
      margin: 4px 0;
      transition: 0.4s ease all;
      color: white;
      &:hover {
        color: $themeColor;
      }
    }
  }
}
</style>
