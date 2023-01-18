export interface ResOptions<T> {
  data?: T
  code?: number
  message?: string
  success?: boolean
}

const fetch = $fetch.create({
  // 请求拦截器
  async onRequest({ options }) {
    // 添加baseURL,nuxt3环境变量要从useRuntimeConfig里面取
    const { apiBase } = useRuntimeConfig()
    options.baseURL = apiBase
    // 添加请求头,没登录不携带token
    // const userStore = useUserStore()
    // if (!userStore.isLogin) return
    // const token = userStore.getToken()
    options.headers = new Headers(options.headers)
    options.headers.set('Authorization', `Bearer `) // ${token.value}
  },
  // 响应拦截
  onResponse({ response }) {
    if (response.headers.get('content-disposition') && response.status === 200) return response
    // 在这里判断错误
    if (response._data.code !== 200) return Promise.resolve(response._data)
    // 成功返回
    return response._data
  },
  // 错误处理
  onResponseError(error) {
    console.log(error)

    const err = (text: string) => {
      // Message.error(error?.response?._data.message ?? text)
    }
    if (error?.response?._data) {
      // const userStore = useUserStore()

      switch (error.response.status) {
        case 404:
          err('服务器资源不存在')
          break
        default:
          err('未知错误！')
      }
    } else {
      err('请求超时，服务器无响应！')
    }
    return Promise.reject(error?.response?._data ?? null)
  }
})

// 自动导出
export const useHttp = {
  get: <T>(url: string, params?: any) => {
    return fetch<ResOptions<T>>(url, { method: 'get', params })
  },
  post: <T>(url: string, params?: any) => {
    return fetch<ResOptions<T>>(url, { method: 'post', params })
  },
  put: <T>(url: string, params?: any) => {
    return fetch<ResOptions<T>>(url, { method: 'put', params })
  },
  delete: <T>(url: string, params?: any) => {
    return fetch<ResOptions<T>>(url, { method: 'delete', params })
  }
}
