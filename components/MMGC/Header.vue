<template>
  <div class="MMGC-header">
    <section class="MMGC-header-logo" @click="goWelcome">
      <MyCustomImage :img="activityData?.activityLogo" />
    </section>
    <nav class="MMGC-header-nav">
      <p class="nav-item">
        <NuxtLink :to="localePath(`/activity/${activityId}/about`)"> {{ $t('desc') }} </NuxtLink>
      </p>
      <i class="split">/</i>
      <p class="nav-item">
        <NuxtLink :to="localePath(`/activity/${activityId}/main`)">
          {{ $t('mainStage') }}
        </NuxtLink>
      </p>
      <i class="split">/</i>
      <p class="nav-item">
        <NuxtLink :to="localePath(`/activity/${activityId}/support`)">
          {{ $t('organSponsor') }}
        </NuxtLink>
      </p>
      <i class="split">/</i>
      <p class="nav-item">
        <NuxtLink :to="localePath(`/activity/${activityId}/history`)">
          {{ $t('history') }}
        </NuxtLink>
        <i class="iconfont mmgc-iconchevron-down"></i>
      </p>
    </nav>
    <section class="MMGC-header-oper">
      <ElDropdown trigger="click" @command="handleLocale">
        <div class="oper-item">
          <ClientOnly>
            <Icon name="ion:language-sharp" size="1.5rem" class="mb-1" />
          </ClientOnly>
          <p>{{ $t('language') }}</p>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="cn">中文简体</ElDropdownItem>
            <ElDropdownItem command="jp">日本语</ElDropdownItem>
            <ElDropdownItem command="en">English</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ClientOnly>
        <div class="oper-item" @click="$router.push(localePath('login'))" v-if="!isUserInfo">
          <Icon name="ant-design:user-outlined" size="1.5rem" class="mb-1" />
          <p>{{ $t('login') }}</p>
        </div>
        <div class="oper-item" v-else>
          <MyInfo :member-vo="userInfo" @logout="logout" />
        </div>
      </ClientOnly>
    </section>
  </div>
</template>
<script setup lang="ts">
import { MemberVo } from 'Member'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '~~/stores/global'
import { useUserStore } from '~~/stores/user'
import lodash from 'lodash'
import { Ref } from 'vue'
const route = useRoute()
const store = useGlobalStore()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const localeRoute = useLocaleRoute()
const globalStore = useGlobalStore()
const userStore = useUserStore()

const userInfo = storeToRefs(userStore).userInfo as unknown as Ref<MemberVo>

const activityId =
  parseInt(route.params.activityId?.toString()) || globalStore.config?.currentActivityId
let activityData = ref<any>()

if (activityId === globalStore.config?.currentActivityId) {
  activityData.value = globalStore.currentActivityData
} else {
  const { activityData: remoteData } = useActivityDetail(activityId || 0)
  activityData = remoteData
}
if (userStore.token) userStore.getUserInfo()

const handleLocale = (command: 'cn' | 'jp' | 'en') => {
  store.setLocale(command)
  switchLocalePath(command)
}

const isUserInfo = computed(() => {
  return !lodash.isEmpty(userInfo.value)
})

const goWelcome = () => {
  const route = localeRoute('/welcome')
  navigateTo(route?.fullPath)
}

const logout = () => {
  userStore.clearToken()
}
</script>

<style lang="scss" scoped>
.MMGC {
  &-header {
    width: 100%;
    height: 8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: $themeNotActiveColor;
    background-image: linear-gradient(to top, #00000000 0%, rgba(0, 0, 0, 0.301) 100%);
    &-logo {
      width: 14rem;
      height: 5.4rem;
      cursor: pointer;
    }
    &-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $themeNotActiveColor;
      font-size: $bigFontSize;
      font-weight: 600;
      .nav-item {
        cursor: pointer;
        display: flex;
        transition: color 0.4s ease;
        line-height: $bigFontSize;
        .iconfont {
          font-size: $bigFontSize;
        }
        &:hover {
          color: $themeColor;
        }
      }
      .split {
        margin: 0px 4rem;
        font-weight: 600;
      }
    }
    &-oper {
      width: 14rem;
      display: flex;
      justify-content: space-around;
      .oper-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $themeNotActiveColor;
        font-size: 12px;
        line-height: normal;
        transition: color 0.4s ease;
        &:hover {
          color: $themeColor;
        }
      }
    }
  }
}
</style>
