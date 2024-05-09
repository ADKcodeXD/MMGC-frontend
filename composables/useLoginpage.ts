import { useUserStore } from '~~/stores/user'
import { UserApi } from '~~/composables/apis/user'
import { getCode } from '~~/composables/apis/email'
import _ from 'lodash'

export const useLoginPage = () => {
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

  const registerForm = reactive<any>({
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
  const { rulesRegister, ruleslogin, forgotRegister } = useLoginRules(registerForm, t)

  const goWelcome = () => {
    const route = localeRoute('/welcome')
    navigateTo(route?.fullPath)
  }

  const getCodeFn = async (email: string) => {
    try {
      const emailReg = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
      if (!email || !emailReg.test(email)) {
        createMessage(t('erroremail'))
        return
      }
      isLoading.value = true
      await getCode(email)
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

  const submitFn = async (isMobile?: boolean) => {
    if (isRegister.value) {
      await registerRef.value.validate()
      registerForm.verifyCode = parseInt(registerForm.verifyCode!.toString())
      const form = _.cloneDeep(registerForm)
      const { data: token } = await UserApi.register(form)
      if (token) {
        const userStore = useUserStore()
        await userStore.setToken(token)
        await userStore.getUserInfo()
        const route = localeRoute(`${isMobile ? '/mobile' : ''}/welcome`)
        navigateTo(route?.fullPath)
      }
    } else {
      await loginRef.value.validate()
      const form = _.cloneDeep(loginForm)
      const { data: token } = await UserApi.login(form)
      if (token) {
        const userStore = useUserStore()
        userStore.setToken(token)
        await userStore.getUserInfo()
        const route = localeRoute(`${isMobile ? '/mobile' : ''}/welcome`)
        navigateTo(route?.fullPath)
      }
    }
  }

  return {
    getCodeFn,
    submitFn,
    goWelcome,
    ruleslogin,
    forgotRegister,
    rulesRegister,
    loginForm,
    registerForm,
    isLoading,
    loginRef,
    registerRef,
    time,
    isSend,
    isRegister
  }
}

export const useForgotPwd = () => {
  const { t } = useI18n()
  const isForgot = ref(false)
  const localeRoute = useLocaleRoute()
  const forgotForm = reactive<any>({
    email: '',
    code: '',
    password: '',
    rePassword: ''
  })

  const { forgotRegister } = useLoginRules(forgotForm, t)

  const resetPwd = async (isMobile?: boolean) => {
    const params = _.cloneDeep(forgotForm)
    delete params.rePassword
    params.code = parseInt(params.code)
    const { data: token } = await UserApi.resetPwd(params)
    if (token) {
      const userStore = useUserStore()
      userStore.setToken(token)
      await userStore.getUserInfo()
      const route = localeRoute(`${isMobile ? '/mobile' : ''}/welcome`)
      navigateTo(route?.fullPath)
    }
  }

  return {
    forgotForm,
    isForgot,
    resetPwd,
    forgotRegister
  }
}
