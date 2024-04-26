import type { MemberVo } from 'Member'
import { useOpenLink } from './useLink'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import lodash from 'lodash'
import { UserApi } from './apis/user'

export const useMemberPop = (memberVO: any) => {
  const noAvatar = computed(() => {
    if (!memberVO.avatar && !memberVO.memberName) {
      return 'Null'
    }
    if (!memberVO.avatar) {
      return memberVO.memberName.slice(0, 1)
    }
    return undefined
  })

  const snsSites = computed(() => {
    return useSnsSites(memberVO.snsSite)
  })

  const openlink = useOpenLink()

  return {
    openlink,
    snsSites,
    noAvatar
  }
}

export const useMyInfo = () => {
  const userStore = useUserStore()
  const { t } = useI18n()

  const userInfo = storeToRefs(userStore).userInfo as unknown as Ref<MemberVo>
  const isUserInfo = computed(() => {
    return !lodash.isEmpty(userInfo.value)
  })

  const logout = () => {
    userStore.clearToken()
  }

  const updateUser = async (values: any) => {
    const userStore = useUserStore()
    // 调用api
    delete values.email
    delete values.role
    delete values.createTime
    delete values.username
    await UserApi.updateMyInfo(values)
    await userStore.refreshUserStore()
    ElMessage.success(t('updateSuccess'))
  }

  if (userStore.token) userStore.getUserInfo()

  return {
    logout,
    isUserInfo,
    userInfo,
    updateUser
  }
}
