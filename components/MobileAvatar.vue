<template>
  <div>
    <var-avatar @click="right = true" :src="userInfo.avatar || ''" size="small" />
    <var-popup
      position="right"
      v-model:show="right"
      @open="changeUserinfoCache"
      style="width: 60%; background: linear-gradient(rgb(45 29 0), black); color: #fff"
    >
      <div class="w-full p-4 flex flex-col">
        <div class="info flex">
          <var-avatar class="mr-4" @click="right = true" :src="userInfo.avatar || ''" />
          <div class="right-info">
            <p>{{ userInfo.memberName }}</p>
            <p class="sub-title">@{{ userInfo.username }}</p>
          </div>
        </div>
        <div class="flex flex-col my-4">
          <p>{{ $t('SnsAccountSet') }}</p>
          <var-input
            variant="outlined"
            placeholder="bilibili"
            size="small"
            v-model="snsSiteCache.bilibili"
            class="my-2 mt-4"
          >
            <template #prepend-icon>
              <Icon name="ri:bilibili-line" size="20" class="mr-2" />
            </template>
          </var-input>
          <var-input
            variant="outlined"
            placeholder="youtube"
            size="small"
            v-model="snsSiteCache.youtube"
            class="my-2"
          >
            <template #prepend-icon>
              <Icon name="ri:youtube-line" size="20" class="mr-2" />
            </template>
          </var-input>
          <var-input
            variant="outlined"
            placeholder="X"
            size="small"
            v-model="snsSiteCache.twitter"
            class="my-2"
          >
            <template #prepend-icon>
              <Icon name="ri:twitter-x-line" class="mr-2" size="20" />
            </template>
          </var-input>
          <var-input
            variant="outlined"
            placeholder="niconico"
            size="small"
            v-model="snsSiteCache.niconico"
            class="my-2"
          >
            <template #prepend-icon>
              <Icon name="arcticons:niconico" class="mr-2" size="20" />
            </template>
          </var-input>
          <var-input
            variant="outlined"
            :placeholder="$t('personalWebsite')"
            size="small"
            v-model="snsSiteCache.personalWebsite"
            class="my-2"
          >
            <template #prepend-icon>
              <var-icon class="mr-2" name="github" :size="20" />
            </template>
          </var-input>
        </div>
        <p>{{ $t('descriable') }}</p>
        <var-input
          variant="outlined"
          :placeholder="$t('descriable')"
          textarea
          :rows="3"
          v-model="descTemp"
          class="mt-4"
        />

        <VarButton type="primary" class="mt-4" @click="updateInfo">{{ $t('update') }}</VarButton>
        <VarButton type="danger" class="mt-4" @click="logout">{{ $t('logout') }}</VarButton>
      </div>
    </var-popup>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'

const { logout, userInfo, updateUser } = useMyInfo()

const snsSiteCache = ref<Sns>({
  bilibili: '',
  niconico: '',
  youtube: '',
  twitter: '',
  personalWebsite: ''
})
const right = ref(false)

const descTemp = ref('')

const changeUserinfoCache = () => {
  const tempInfo = _.cloneDeep(userInfo.value)
  snsSiteCache.value = _.assignIn(snsSiteCache.value, tempInfo.snsSite)
  descTemp.value = tempInfo.desc || ''
}

const updateInfo = async () => {
  const tempInfo = _.cloneDeep(userInfo.value)
  tempInfo.snsSite = snsSiteCache.value
  tempInfo.desc = descTemp.value
  await updateUser(tempInfo)
  right.value = false
}
</script>
