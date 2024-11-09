<template>
  <div class="flex flex-col">
    <var-app-bar :title="$t('loginorRegister')" title-position="center" round>
      <template #left
        ><var-button round text color="transparent" text-color="#fff" @click="goHome">
          <var-icon name="home" :size="24" /> </var-button
      ></template>
    </var-app-bar>
    <div class="h-full flex justify-center p-8">
      <div class="form">
        <div>
          <p class="title">{{ $t('logintoMMGC') }}</p>
          <p class="text-light-400 text-sm">{{ $t('MMGCdesc') }}</p>
          <VarButton
            class="my-2"
            text
            type="primary"
            @click="isForgot = true"
            v-if="!isForgot && !isRegister"
            >{{ $t('forgotPasw') }}</VarButton
          >
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
            v-if="!isRegister && !isForgot"
          >
            <el-form-item prop="username" style="width: 100%">
              <var-input
                v-model="loginForm.username"
                :placeholder="$t('username')"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item prop="password">
              <var-input
                v-model="loginForm.password"
                type="password"
                :placeholder="$t('password')"
                style="width: 100%"
              />
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
            <el-form-item prop="username">
              <var-input
                v-model="registerForm.username"
                :placeholder="$t('username')"
                class="w-full"
              />
            </el-form-item>
            <el-form-item prop="password">
              <var-input
                v-model="registerForm.password"
                type="password"
                :placeholder="$t('password')"
                class="w-full"
              />
            </el-form-item>
            <el-form-item prop="memberName">
              <var-input
                v-model="registerForm.memberName"
                :placeholder="$t('nickname')"
                class="w-full"
              />
            </el-form-item>
            <el-form-item prop="rePassword">
              <var-input
                v-model="registerForm.rePassword"
                type="password"
                :placeholder="$t('confirmPass')"
                class="w-full"
              />
            </el-form-item>
            <el-form-item prop="email">
              <var-input v-model="registerForm.email" :placeholder="$t('email')" class="w-full" />
            </el-form-item>
            <el-form-item prop="verifyCode">
              <div class="flex w-full items-center">
                <var-input
                  v-model="registerForm.verifyCode"
                  :placeholder="$t('verifyCode')"
                  class="flex-1"
                />
                <var-button
                  type="primary"
                  class="ml-2"
                  @click="() => getCodeFn(registerForm.email)"
                  :disabled="isSend || isLoading"
                  :loading="isLoading"
                  >{{ !isSend ? $t('getCode') : $t('time get', [time]) }}</var-button
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
            <el-form-item prop="username">
              <var-input class="w-full" :placeholder="$t('email')" v-model="forgotForm.email" />
            </el-form-item>
            <el-form-item prop="code">
              <div class="flex w-full">
                <var-input
                  :placeholder="$t('verifyCode')"
                  class="w-full"
                  v-model="forgotForm.code"
                />
                <var-button
                  type="primary"
                  class="ml-2"
                  @click="() => getCodeFn(forgotForm.email)"
                  :disabled="isSend || isLoading"
                  :loading="isLoading"
                  >{{ !isSend ? $t('getCode') : $t('time get', [time]) }}</var-button
                >
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <var-input
                class="w-full"
                :placeholder="$t('password')"
                v-model="forgotForm.password"
                type="password"
              />
            </el-form-item>
            <el-form-item prop="rePassword">
              <var-input
                class="w-full"
                :placeholder="$t('confirmPass')"
                v-model="forgotForm.rePassword"
                type="password"
              />
            </el-form-item>
          </el-form>
        </Transition>

        <div class="text-light-50 self-end" v-if="!isForgot">
          <VarButton type="primary" class="mr-2" :dark="true" @click="isRegister = !isRegister">{{
            isRegister ? $t('login') : $t('register')
          }}</VarButton>
          <VarButton type="primary" :dark="true" @click="() => submitFn(true)">{{
            $t('submit')
          }}</VarButton>
        </div>

        <div class="text-light-50 self-end" v-else>
          <VarButton type="primary" class="mr-2" :dark="true" @click="isForgot = false">{{
            $t('login')
          }}</VarButton>
          <VarButton type="primary" :dark="true" @click="() => resetPwd()">{{
            $t('update')
          }}</VarButton>
        </div>

        <div class="flex items-center flex-col justify-self-end mt-12">
          <div class="w-24 h-12">
            <MyCustomImage :img="Mirai" />
          </div>
          <p class="text-light-400 text-center">{{ $t('dontDoany') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Mirai from '~~/assets/img/mirai.png'
import _ from 'lodash'

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

const { goHome } = useGoMobile()
</script>
