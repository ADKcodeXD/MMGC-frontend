<template>
  <div class="show w-full">
    <div class="MMGC-header">
      <section class="MMGC-logo" @click="goWelcome">
        <MyCustomImage :img="activityData?.activityLogo" />
      </section>
      <nav class="MMGC-nav">
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
        </p>
      </nav>
      <section class="MMGC-oper">
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
        <div class="oper-item" @click="$router.push(localePath('login'))" v-if="!isUserInfo">
          <Icon name="ant-design:user-outlined" size="1.5rem" class="mb-1" />
          <p>{{ $t('login') }}</p>
        </div>
        <div class="oper-item" v-else>
          <MyInfo :member-vo="userInfo" @logout="logout" />
        </div>
      </section>
    </div>
    <div class="MMGC-mobile">
      <section class="MMGC-logo" @click="goWelcome">
        <Icon name="ant-design:home-outlined" />
      </section>
      <nav class="MMGC-nav">
        <p class="nav-item">
          <NuxtLink :to="localePath(`/activity/${activityId}/about`)">
            <Icon name="tabler:file-description" size="1rem"></Icon>
            <p>{{ $t('desc') }}</p></NuxtLink
          >
        </p>
        <p class="nav-item">
          <NuxtLink :to="localePath(`/activity/${activityId}/main`)">
            <Icon name="ic:round-ondemand-video" size="1rem"></Icon>
            <p>{{ $t('mainStage') }}</p>
          </NuxtLink>
        </p>
        <p class="nav-item">
          <NuxtLink :to="localePath(`/activity/${activityId}/support`)">
            <Icon name="simple-icons:githubsponsors" size="1rem"></Icon>
            <p>{{ $t('organSponsor') }}</p>
          </NuxtLink>
        </p>
        <p class="nav-item">
          <NuxtLink :to="localePath(`/activity/${activityId}/history`)">
            <Icon name="ic:baseline-history" size="1rem"></Icon>
            <p>{{ $t('history') }}</p>
          </NuxtLink>
        </p>
      </nav>
      <section class="MMGC-oper">
        <ElDropdown trigger="click" @command="handleLocale">
          <div class="oper-item">
            <ClientOnly>
              <Icon name="ion:language-sharp" size="0.8rem" class="mb-1" />
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
        <div class="oper-item" @click="$router.push(localePath('login'))" v-if="!isUserInfo">
          <Icon name="ant-design:user-outlined" size="0.8rem" class="mb-1" />
          <p>{{ $t('login') }}</p>
        </div>
        <div class="oper-item" v-else>
          <MyInfo :member-vo="userInfo" @logout="logout" />
        </div>
      </section>
    </div>
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
@media screen and (min-width: 320px) {
  .MMGC {
    &-header {
      width: 100%;
      height: 8rem;
      display: none;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      color: $themeNotActiveColor;
      background-image: linear-gradient(to top, #00000000 0%, rgba(0, 0, 0, 0.301) 100%);
    }
    &-mobile {
      display: flex;
      height: 3rem;
      padding: 1rem;
      margin-bottom: 2rem;
      justify-content: space-between;
      align-items: center;
      background-color: rgb(51, 35, 2);
    }
  }
  .MMGC-logo {
    height: 3rem;
    font-size: 2rem;
    color: $themeColor;
    cursor: pointer;
  }
  .MMGC-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $themeNotActiveColor;
    font-size: 1rem;
    font-weight: 600;
    .nav-item {
      cursor: pointer;
      transition: color 0.4s ease;
      margin: 0 6px;
      width: 50px;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1rem;
        font-size: 0.6rem;
        max-width: 50px;
        p {
          @include showLine(1);
        }
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
  .MMGC-oper {
    display: flex;
    flex-shrink: 0;
    justify-content: space-around;
    align-items: center;
    .oper-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: $themeNotActiveColor;
      font-size: 0.6rem;
      margin-right: 1rem;
      line-height: normal;
      transition: color 0.4s ease;
      &:hover {
        color: $themeColor;
      }
    }
  }
}

@media screen and (min-width: 1440px) {
  .MMGC {
    &-header {
      display: flex;
    }
    &-mobile {
      display: none;
    }
  }
  .MMGC-logo {
    width: 14rem;
    height: 5.4rem;
    cursor: pointer;
  }
  .MMGC-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $themeNotActiveColor;
    font-size: $bigFontSize;
    font-weight: 600;
    .nav-item {
      margin: 0 4px;
      width: unset;
      a {
        flex-direction: row;
        font-size: $bigFontSize;
        line-height: $bigFontSize;
        max-width: unset;
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
  .MMGC-oper {
    width: 14rem;
    display: flex;
    flex-shrink: 0;
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
</style>
