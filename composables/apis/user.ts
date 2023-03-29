import { MemberParams, MemberVo } from 'Member'

const getMyInfoApi = async () => {
  const { data } = await xFetch<MemberVo>('/api/user/getMyInfo')
  return {
    data: data && data.data
  }
}

const login = async (params: { username: string; password: string }) => {
  const { data } = await xFetch<string>('/api/user/login', 'post', params)
  return {
    data: data && data.data
  }
}

const register = async (params: MemberParams) => {
  const { data } = await xFetch<string>('/api/user/register', 'post', params)
  return {
    data: data && data.data
  }
}

const updateMyInfo = async (params: Partial<MemberVo>) => {
  const { data, refresh } = await xFetch<string>('/api/user/updateUserInfoByToken', 'post', params)
  return {
    data: data && data.data,
    refresh
  }
}

export const UserApi = {
  getMyInfo: getMyInfoApi,
  login: login,
  register: register,
  updateMyInfo: updateMyInfo
}
