import { AsyncDataExecuteOptions, _AsyncData } from 'nuxt/dist/app/composables/asyncData'
import { Ref } from 'vue'
import { useUserStore } from '~~/stores/user'
interface MyUseFetchRes<T> {
  data: Ref<ResResult<T>> | null
  refresh?: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void> | Promise<() => void>
  error: Ref<any>
}
const useMyCustomFetch = <T>(url: string, options?: any): Promise<MyUseFetchRes<T>> => {
  return new Promise<MyUseFetchRes<T>>(
    <T>(resolve: (params: MyUseFetchRes<T>) => any, reject: (params: MyUseFetchRes<T>) => any) => {
      const { apiPrefix } = useRuntimeConfig()
      const _url = apiPrefix + url
      let _options = options
      const { token, clearToken } = useUserStore()
      if (_options) {
        _options.headers = {
          Authorization: `Bearer ${token}`
        }
      } else {
        _options = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
      // 请求拦截器T
      useFetch(_url, { ..._options })
        .then(({ data, error, refresh }: _AsyncData<any, any>) => {
          if (error.value) {
            if (data.value && data.value.code === 401) {
              // clearToken()
            } else {
              process.client ? ElMessage.error(error.value.message) : ''
            }
            reject({
              data: null,
              refresh: refresh,
              error: ref<any>(error)
            })
          }
          if (data.value.code !== 200) {
            ElMessage.error(data.value.msg)
            reject({
              data: data as unknown as Ref<ResResult<T>>,
              refresh: refresh,
              error: ref<any>(error)
            })
          }
          resolve({
            data: data as unknown as Ref<ResResult<T>>,
            refresh: refresh,
            error: ref<any>(error)
          })
        })
        .catch((err: any) => {
          reject({ data: null, error: ref<any>(err) })
        })
    }
  )
}

// 自动导出
export const useHttp = {
  get: <T>(url: string, params?: any) => {
    return useMyCustomFetch<T>(url, { method: 'get', params: params })
  },
  post: <T>(url: string, params?: any) => {
    return useMyCustomFetch<T>(url, { method: 'post', body: params })
  },
  put: <T>(url: string, params?: any) => {
    return useMyCustomFetch<T>(url, { method: 'put', body: params })
  },
  delete: <T>(url: string, params?: any) => {
    return useMyCustomFetch<T>(url, { method: 'get', body: params })
  }
}
