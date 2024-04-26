<template>
  <div class="body" :key="$route.fullPath">
    <var-app-bar round>
      <template #left>
        <var-button round text color="transparent" text-color="#fff" @click="goHome">
          <var-icon name="home" :size="24" />
        </var-button>
      </template>

      <template #right>
        <div class="flex items-center">
          <var-menu-select
            :modelValue="locale"
            @update:model-value="handleLocale"
            size="large"
            placement="top"
          >
            <var-button round text color="transparent" text-color="#fff">
              <Icon name="ion:language-sharp" size="24"></Icon>
            </var-button>
            <template #options>
              <var-menu-option label="中文" value="cn" />
              <var-menu-option label="English" value="en" />
              <var-menu-option label="日本語" value="jp" />
            </template>
          </var-menu-select>

          <var-button
            round
            text
            color="transparent"
            text-color="#fff"
            @click="goLogin"
            v-if="!isUserInfo"
          >
            <Icon name="ant-design:user-outlined" size="24"></Icon>
          </var-button>
          <MobileAvatar v-else />
        </div>
      </template>

      <template #content>
        <var-tabs
          color="transparent"
          active-color="#fff"
          inactive-color="#ddd"
          v-model:active="currentRoute"
          @update:active="changeRoute"
        >
          <var-tab name="about"
            ><Icon name="tabler:file-description" size="1rem" class="mr-1"></Icon
            >{{ $t('desc') }}</var-tab
          >
          <var-tab name="main"
            ><Icon name="ic:round-ondemand-video" size="1rem" class="mr-1"></Icon
            >{{ $t('mainStage') }}</var-tab
          >
          <var-tab name="support"
            ><Icon name="simple-icons:githubsponsors" size="1rem" class="mr-1"></Icon
            >{{ $t('organSponsor') }}</var-tab
          >
          <var-tab name="history"
            ><Icon name="ic:baseline-history" size="1rem" class="mr-1"></Icon
            >{{ $t('history') }}</var-tab
          >
        </var-tabs>
      </template>
    </var-app-bar>
    <div class="flex items-center justify-center heightss">
      <NuxtPage :activityId="activityId" />
    </div>
    <div class="bg"></div>
  </div>
</template>

<script setup lang="ts">
import { StyleProvider } from '@varlet/ui'
import { onMounted } from 'vue'
import { useGlobalStore } from '~/stores/global'
import _ from 'lodash'
const route = useRoute()
const localeRoute = useLocaleRoute()
const { locale } = useCurrentLocale()
const globalStore = useGlobalStore()
const { goHome, goLogin, handleLocale } = useGoMobile()

const activityId =
  parseInt(route.params.activityId?.toString()) || globalStore.config?.currentActivityId

onMounted(() => {
  return StyleProvider({
    '--color-primary': '#ffb961',
    '--color-on-primary': '#472a00',
    '--color-primary-container': '#663e00',
    '--color-on-primary-container': '#ffddb9',
    '--color-info': '#dfc1a2',
    '--color-on-info': '#3f2d17',
    '--color-info-container': '#57432b',
    '--color-on-info-container': '#fdddbd',
    '--color-warning': '#bccd9e',
    '--color-on-warning': '#273513',
    '--color-warning-container': '#3d4b27',
    '--color-on-warning-container': '#d7e9b8',
    '--color-danger': '#ffb4ab',
    '--color-on-danger': '#690005',
    '--color-danger-container': '#93000a',
    '--color-on-danger-container': '#ffb4ab',
    '--color-body': '#1f1b16',
    '--color-text': '#ebe1d9',
    '--color-on-surface-variant': '#d4c4b5',
    '--color-outline': '#9d8e81',
    '--color-inverse-surface': '#ebe1d9',
    '--card-background': '#222',
    '--card-title-color': '#ffb961'
  })
})

const changeRoute = (routepath: any) => {
  const route = localeRoute(`/mobile/activity/${activityId}/${routepath}`)
  navigateTo(route?.fullPath || '/')
}

const currentRoute = computed(() => {
  const arr = route.path && route.path.split('/')
  let lastMatchUrl = arr[arr.length - 1]
  if (lastMatchUrl && lastMatchUrl.indexOf('?')) {
    lastMatchUrl = lastMatchUrl.split('?')[0]
  }
  return lastMatchUrl
})

const { isUserInfo } = useMyInfo()
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.heightss {
  height: calc(100vh - 98px);
}

.bg {
  width: 100vw;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background-image: url(@/assets/2024/bgmobile.png);
  background-size: cover;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: absolute;
}
</style>
