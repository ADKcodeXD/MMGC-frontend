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
          <ElButton
            @click="isForgot = true"
            class="self-start my-2"
            text
            link
            type="primary"
            v-if="!isRegister && !isForgot"
            >{{ $t('forgotPasw') }}</ElButton
          >
          <Transition mode="out-in">
            <el-form
              label-position="left"
              :model="loginForm"
              status-icon
              ref="loginRef"
              :rules="ruleslogin"
              class="mt-5 flex-1"
              @submit.native.prevent
              v-if="!isRegister && !isForgot"
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
              v-else-if="!isForgot"
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
              <el-form-item :label="$t('email')" prop="email">
                <el-input v-model="registerForm.email" />
              </el-form-item>
              <el-form-item :label="$t('verifyCode')" prop="verifyCode">
                <div class="flex w-full">
                  <el-input v-model="registerForm.verifyCode" />
                  <el-button
                    type="primary"
                    class="ml-2"
                    @click="() => getCodeFn(registerForm.email)"
                    :disabled="isSend || isLoading"
                    :loading="isLoading"
                    >{{ !isSend ? $t('getCode') : $t('time get', [time]) }}</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
            <el-form
              label-position="left"
              :model="forgotForm"
              status-icon
              ref="loginRef"
              :rules="forgotRegister"
              class="mt-5 flex-1"
              @submit.native.prevent
              v-else-if="isForgot"
            >
              <el-form-item :label="$t('email')" prop="username">
                <el-input v-model="forgotForm.email" />
              </el-form-item>
              <el-form-item :label="$t('verifyCode')" prop="code">
                <div class="flex w-full">
                  <el-input v-model="forgotForm.code" />
                  <el-button
                    type="primary"
                    class="ml-2"
                    @click="() => getCodeFn(forgotForm.email)"
                    :disabled="isSend || isLoading"
                    :loading="isLoading"
                    >{{ !isSend ? $t('getCode') : $t('time get', [time]) }}</el-button
                  >
                </div>
              </el-form-item>
              <el-form-item :label="$t('password')" prop="password">
                <el-input v-model="forgotForm.password" type="password" />
              </el-form-item>
              <el-form-item :label="$t('confirmPass')" prop="rePassword">
                <el-input v-model="forgotForm.rePassword" type="password" />
              </el-form-item>
            </el-form>
          </Transition>

          <div class="text-light-50 self-end" v-if="!isForgot">
            <el-button type="primary" round :dark="true" @click="isRegister = !isRegister">{{
              isRegister ? $t('login') : $t('register')
            }}</el-button>
            <el-button type="primary" round :dark="true" @click="() => submitFn()">{{
              $t('submit')
            }}</el-button>
          </div>

          <div class="text-light-50 self-end" v-else>
            <el-button type="primary" round :dark="true" @click="isForgot = !isForgot">{{
              $t('login')
            }}</el-button>
            <el-button type="primary" round :dark="true" @click="() => resetPwd(false)">{{
              $t('update')
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

definePageMeta({
  needLoading: false
})

const {
  getCodeFn,
  submitFn,
  goWelcome,
  ruleslogin,
  rulesRegister,
  loginForm,
  registerForm,
  isLoading,
  loginRef,
  registerRef,
  time,
  isSend,
  isRegister
} = useLoginPage()

const { isForgot, forgotForm, resetPwd, forgotRegister } = useForgotPwd()
</script>

<style lang="scss" scoped>
@media screen and (min-width: 320px) {
  .bg {
    background-image: url(@/assets/img/bg2.png);
    background-size: 100% 100% cover;
    height: 100%;
    min-width: 320px;
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
      width: 90%;
      height: 600px;
      background-color: rgba(70, 21, 2, 0.205);
      border-radius: 2rem;
      display: flex;
      overflow-y: auto;
      backdrop-filter: blur(5px);
      box-shadow: 0 0 100px rgba(238, 71, 5, 0.473);
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
    max-width: 200px;
    @include showLine(2);
    color: #fff;
  }
}

@media screen and (min-width: 1440px) {
  .bg {
    .login-container {
      width: 47%;
      height: 85%;
    }
  }
  :deep(.el-form-item__label) {
    width: 200px;
    @include showLine(2);
    color: #fff;
  }
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
