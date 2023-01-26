import { MemberParams, MemberVo } from 'Member'

const getMyInfoApi = async () => {
  const { data, refresh } = await xFetch<MemberVo>('/api/user/getMyInfo')
  return {
    data: data && data.data,
    refresh
  }
}

const login = async (params: { username: string; password: string }) => {
  const { data, refresh } = await xFetch<string>('/api/user/login', 'post', params)
  return {
    data: data && data.data,
    refresh
  }
}

const register = async (params: MemberParams) => {
  const { data, refresh } = await xFetch<string>('/api/user/register', 'post', params)
  return {
    data: data && data.data,
    refresh
  }
}

export const UserApi = {
  getMyInfo: getMyInfoApi,
  login: login,
  register: register
}
