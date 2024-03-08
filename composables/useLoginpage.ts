import type { MemberParams } from 'Member'
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

  return {
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
  }
}
