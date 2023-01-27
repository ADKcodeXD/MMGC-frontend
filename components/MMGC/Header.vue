<template>
  <div class="MMGC-header">
    <section class="MMGC-header-logo" @click="goWelcome">
      <img src="@/assets/img/2022logo.png" />
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
      <p class="nav-item">主办&赞助</p>
      <i class="split">/</i>
      <p class="nav-item">往届赛事<i class="iconfont mmgc-iconchevron-down"></i></p>
    </nav>
    <section class="MMGC-header-oper">
      <ElDropdown trigger="click" @command="handleLocale">
        <div class="oper-item">
          <ClientOnly>
            <Icon name="ion:language-sharp" size="1.5rem" class="mb-1" />
          </ClientOnly>
          <p>语言</p>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="cn">中文简体</ElDropdownItem>
            <ElDropdownItem command="jp">日本语</ElDropdownItem>
            <ElDropdownItem command="en">English</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <div
        class="oper-item"
        @click="$router.push(localePath(`/activity/${activityId}/main`))"
        v-if="!userInfo"
      >
        <ClientOnly>
          <Icon name="ant-design:user-outlined" size="1.5rem" class="mb-1" />
        </ClientOnly>
        <p>登录</p>
      </div>
      <div class="oper-item" v-else>
        <MyInfo :member-vo="userInfo" @logout="logout" />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { MemberVo } from 'Member'
import { useGlobalStore } from '~~/stores/global'
import { useUserStore } from '~~/stores/user'
const route = useRoute()
const store = useGlobalStore()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const localeRoute = useLocaleRoute()
const activityId = parseInt(route.params.activityId.toString())
const handleLocale = (command: 'cn' | 'jp' | 'en') => {
  store.setLocale(command)
  switchLocalePath(command)
}
const goWelcome = () => {
  const route = localeRoute('/welcome')
  navigateTo(route?.fullPath)
}
const userStore = useUserStore()

const userInfo = ref<MemberVo | null>()
const logout = () => {
  userInfo.value = null
  userStore.clearToken()
}
onMounted(() => {
  setTimeout(() => {
    userStore.getUserInfo().then(user => {
      userInfo.value = user
    })
  }, 0)
})
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
