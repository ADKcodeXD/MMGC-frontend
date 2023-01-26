import { UserApi } from './../composables/apis/user'
import _ from 'lodash'
import { MemberVo } from 'Member'
import { defineStore } from 'pinia'
const maxAge = 1 * 60 * 60 * 24 * 2
const expires = new Date(Date.now() + maxAge * 1000)
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: useCookie('token').value || '',
      userInfo: {}
    } as {
      token: string | undefined
      userInfo: MemberVo
    }
  },
  actions: {
    setToken(token: string) {
      const tokenCookie = useCookie('token', { maxAge: maxAge, expires: expires })
      tokenCookie.value = token
      this.token = token
    },
    clearToken() {
      const tokenCookie = useCookie('token', {
        expires: new Date(),
        maxAge: 0
      })
      tokenCookie.value = null
      this.token = undefined
    },
    async getUserInfo() {
      if (_.isEmpty(this.userInfo) && this.token) {
        try {
          const { data } = await UserApi.getMyInfo()
          if (data) {
            this.userInfo = data
            return this.userInfo
          }
        } catch (error) {
          this.clearToken()
          return null
        }
      } else {
        return null
      }
    }
  }
})
