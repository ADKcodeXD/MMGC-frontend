export const xFetch = async <T>(url: string, method = 'get', params?: any) => {
  const { data, refresh, error } = await useFetch<ResResult<T>>(url, {
    onResponseError({ response }) {
      if (response._data) {
        const data = response._data
        if (data.data.code === 401) {
          return
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
    body: method === 'get' ? undefined : params,
    query: method !== 'get' ? undefined : params,
    method: method
  })

  return {
    data: (data && data.value) || null,
    refresh: refresh,
    error: error
  }
}
