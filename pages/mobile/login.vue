<template>
  <div class="bg">
    <div class="header">
      <div class="w-60 h-24 cursor-pointer">
        <MyCustomImage :img="Mirai" @click="goWelcome" />
      </div>
    </div>
    <div class="flex-1 w-full h-full flex justify-center pt-10">
      <div class="login-container">
        <div class="form">
          <div>
            <p class="title">{{ $t('logintoMMGC') }}</p>
            <p class="sub-title">{{ $t('MMGCdesc') }}</p>
          </div>
          <Transition mode="out-in">
            <el-form
              label-position="left"
              :model="loginForm"
              status-icon
              ref="loginRef"
              :rules="ruleslogin"
              class="mt-5 flex-1"
              @submit.native.prevent
              v-if="!isRegister"
            >
              <el-form-item :label="$t('username')" prop="username">
                <el-input v-model="loginForm.username" />
              </el-form-item>
              <el-form-item :label="$t('password')" prop="password">
                <el-input v-model="loginForm.password" type="password" />
              </el-form-item>
            </el-form>
            <el-form
              label-position="left"
              :model="registerForm"
              class="mt-5 flex-1"
              status-icon
              :rules="rulesRegister"
              @submit.native.prevent
              ref="registerRef"
              v-else
            >
              <el-form-item :label="$t('username')" prop="username">
                <el-input v-model="registerForm.username" />
              </el-form-item>
              <el-form-item :label="$t('password')" prop="password">
                <el-input v-model="registerForm.password" type="password" />
              </el-form-item>
              <el-form-item :label="$t('nickname')" prop="memberName">
                <el-input v-model="registerForm.memberName" />
              </el-form-item>
              <el-form-item :label="$t('confirmPass')" prop="rePassword">
                <el-input v-model="registerForm.rePassword" type="password" />
              </el-form-item>
              <el-form-item :label="t('email')" prop="email">
                <el-input v-model="registerForm.email" />
              </el-form-item>
              <el-form-item :label="$t('verifyCode')" prop="verifyCode">
                <div class="flex w-full">
                  <el-input v-model="registerForm.verifyCode" />
                  <el-button
                    type="primary"
                    class="ml-2"
                    @click="getCodeFn"
                    :disabled="isSend || isLoading"
                    :loading="isLoading"
                    >{{ !isSend ? $t('getCode') : $t('time get', [time]) }}</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </Transition>

          <div class="text-light-50 self-end">
            <el-button type="primary" round :dark="true" @click="isRegister = !isRegister">{{
              isRegister ? $t('login') : $t('register')
            }}</el-button>
            <el-button type="primary" round :dark="true" @click="submitFn">{{
              $t('submit')
            }}</el-button>
          </div>
          <div class="flex items-center justify-self-end">
            <div class="w-24 h-12">
              <MyCustomImage :img="Mirai" />
            </div>
            <p class="sub-title">{{ $t('dontDoany') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Mirai from '~~/assets/img/mirai.png'
import type { MemberParams } from 'Member'
import { useUserStore } from '~~/stores/user'
import { UserApi } from '~~/composables/apis/user'
import { getCode } from '~~/composables/apis/email'
import _ from 'lodash'

definePageMeta({
  needLoading: false
})

const isRegister = ref(false)
const isSend = ref(false)
const time = ref(60)
const registerRef = ref()
const loginRef = ref()
const isLoading = ref(false)

const loginForm = reactive<{ username: string; password: string }>({
  username: '',
  password: ''
})

const registerForm = reactive<MemberParams & { rePassword: string }>({
  username: '',
  password: '',
  verifyCode: undefined,
  memberName: '',
  rePassword: '',
  email: ''
})

const localeRoute = useLocaleRoute()
const { t } = useI18n()
const { createMessage } = useMessage()
const { rulesRegister, ruleslogin } = useLoginRules(registerForm, t)

const goWelcome = () => {
  const route = localeRoute('/welcome')
  navigateTo(route?.fullPath)
}

const getCodeFn = async () => {
  try {
    await registerRef.value.validateField('email')
    isLoading.value = true
    await getCode(registerForm.email)
    isSend.value = true
    const myInternal = setInterval(() => {
      time.value--
    }, 1000)
    setTimeout(() => {
      isSend.value = false
      clearInterval(myInternal)
      time.value = 60
    }, 60000)
    createMessage(t('getCodeSuccess'))
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const submitFn = async () => {
  if (isRegister.value) {
    await registerRef.value.validate()
    registerForm.verifyCode = parseInt(registerForm.verifyCode!.toString())
    const form = _.cloneDeep(registerForm)
    const { data: token } = await UserApi.register(form)
    if (token) {
      const userStore = useUserStore()
      await userStore.setToken(token)
      await userStore.getUserInfo()
      const router = useRouter()
      router.push('/')
    }
  } else {
    await loginRef.value.validate()
    const form = _.cloneDeep(loginForm)
    const { data: token } = await UserApi.login(form)
    if (token) {
      const userStore = useUserStore()
      userStore.setToken(token)
      await userStore.getUserInfo()
      const router = useRouter()
      router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped></style>
