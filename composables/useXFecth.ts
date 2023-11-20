import { useUserStore } from '~~/stores/user'

export const xFetch = async <T>(
  url: string,
  method = 'get',
  params?: any,
  isQuery = false,
  headers?: Record<string, any>
) => {
  const { clearToken } = useUserStore()
  const { data, refresh, error } = await useFetch<ResResult<T>>(url, {
    onResponseError({ response }) {
      if (response._data) {
        const data = response._data
        if (data.data.code === 401) {
          clearToken()
        } else {
          if (process.client) {
            ElMessage({
              type: 'error',
              message: data.data.msg
            })
          }
        }
      }
    },
    onResponse({ response }) {
      const data = response._data
      if (data.code !== 200) {
        if (process.client) {
          if (data.msg) {
            ElMessage({
              type: 'error',
              message: data.msg
            })
          }
        }
        return data
      } else {
        return data
      }
    },
    body: isQuery ? undefined : method === 'get' ? undefined : params,
    query: isQuery ? params : method !== 'get' ? undefined : params,
    method: method as any,
    headers: headers || undefined
  })

  return {
    data: (data && data.value) || null,
    refresh: refresh,
    error: error
  }
}
