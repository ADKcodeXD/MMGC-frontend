<template>
  <div class="bg">
    <div class="header">
      <div class="w-60 h-24">
        <MyCustomImage :img="Mirai" @click="$router.push('/')" />
      </div>
    </div>
    <div class="flex-1 w-full h-full flex justify-center pt-10">
      <div class="login-container">
        <div class="img-container">
          <MyCustomImage :img="Bg" fit="cover" />
        </div>
        <div class="form">
          <div>
            <p class="title">登录到MMGC官网</p>
            <p class="sub-title">登录MMGC官网可以使用投票，评论，点赞等功能，为选手加油助威！</p>
          </div>
          <Transition mode="out-in">
            <el-form
              label-position="left"
              label-width="100px"
              :model="loginForm"
              status-icon
              ref="loginRef"
              :rules="ruleslogin"
              class="mt-5 flex-1"
              v-if="!isRegister"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" type="password" />
              </el-form-item>
            </el-form>
            <el-form
              label-position="left"
              label-width="100px"
              :model="registerForm"
              class="mt-5 flex-1"
              status-icon
              :rules="rulesRegister"
              ref="registerRef"
              v-else
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="registerForm.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password" type="password" />
              </el-form-item>
              <el-form-item label="昵称" prop="memberName">
                <el-input v-model="registerForm.memberName" />
              </el-form-item>
              <el-form-item label="确认密码" prop="rePassword">
                <el-input v-model="registerForm.rePassword" type="password" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" />
              </el-form-item>
              <el-form-item label="验证码" prop="verifyCode">
                <div class="flex w-full">
                  <el-input v-model="registerForm.verifyCode" />
                  <el-button
                    type="primary"
                    class="ml-2"
                    @click="getCode"
                    :disabled="isSend || isLoading"
                    :loading="isLoading"
                    >{{ !isSend ? '获取验证码' : `${time}秒后再次获取` }}</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </Transition>

          <div class="text-light-50 self-end">
            <el-button type="primary" round :dark="true" @click="isRegister = !isRegister">{{
              isRegister ? '登录' : '注册'
            }}</el-button>
            <el-button
              type="primary"
              color="#ffc962"
              round
              :dark="true"
              style="color: #ffffdd"
              @click="submit"
              >提交</el-button
            >
          </div>
          <div class="flex items-center justify-self-end">
            <div class="w-24 h-12">
              <MyCustomImage :img="Mirai" />
            </div>
            <p class="sub-title">本站承诺不会使用您的任何信息用作任何其他用途</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Mirai from '~~/assets/img/mirai.png'
import Bg from '~~/assets/img/bg.png'
import { MemberParams } from 'Member'
import { useUserStore } from '~~/stores/user'
import { UserApi } from '~~/composables/apis/user'

const isRegister = ref(false)
const isSend = ref(false)
const time = ref(60)
const registerRef = ref()
const loginRef = ref()
const isLoading = ref(false)
const { createMessage } = useMessage()
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
const { rulesRegister, ruleslogin } = useLoginRules(registerForm)

const getCode = async () => {
  try {
    await registerRef.value.validateField('email')
    isLoading.value = true
    await useHttp.get<string>('/email/getCode', { email: registerForm.email })
    isSend.value = true
    const myInternal = setInterval(() => {
      time.value--
    }, 1000)
    setTimeout(() => {
      isSend.value = false
      clearInterval(myInternal)
      time.value = 60
    }, 60000)
    createMessage('发送验证码成功,请到邮箱查收')
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const submit = async () => {
  if (isRegister.value) {
    await registerRef.value.validate()
    await useHttp.post<string>('/email/verify', {
      email: registerForm.email,
      code: registerForm.verifyCode
    })
    registerForm.verifyCode = parseInt(registerForm.verifyCode!.toString())
    const { data: token } = await UserApi.register(registerForm)
    if (token) {
      const userStore = useUserStore()
      await userStore.setToken(token)
      await userStore.getUserInfo()
      const router = useRouter()
      router.push('/')
    }
  } else {
    await loginRef.value.validate()
    const { data: token } = await UserApi.login(loginForm)
    console.log(token)
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
<style lang="scss" scoped>
.bg {
  background-image: url(@/assets/img/bg2.png);
  background-size: 100% 100% cover;
  height: 100vh;
  min-width: 1024px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: move 120s infinite linear;
  .header {
    padding: 1rem;
    display: flex;
    width: 100%;
    align-items: flex-start;
  }
  .login-container {
    width: 47%;
    height: 65%;
    background-color: rgba(70, 21, 2, 0.205);
    border-radius: 2rem;
    display: flex;
    overflow: hidden;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 100px rgba(238, 71, 5, 0.473);
    .img-container {
      width: 40%;
      height: 100%;
      flex-shrink: 0;
    }
    .form {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 1rem;
      justify-content: space-between;
    }
  }
}
:deep(.el-form-item__label) {
  color: #fff;
}
@keyframes move {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -100%;
  }
}
</style>
