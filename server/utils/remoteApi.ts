export const myFetch = $fetch.create({
  onRequest({ request, options }: any) {
    const token = useCookie('token')
    const { apiBase, apiPrefix } = useRuntimeConfig()
    request = apiPrefix + request
    options.headers = options.headers || {}
    options.baseURL = apiBase
    const option = options as any
    option.headers.Authorization = token.value || undefined
  },
  onRequestError({ request, options, error }) {
    // Handle the request errors
  },
  onResponse({ request, response, options }) {
    // Process the response data
    return response._data
  },
  onResponseError({ request, response, options }) {
    // Handle the response errors
  }
})

export const RemoteApi = {
  get: <T>(url: string, params?: any) => {
    return myFetch<ResResult<T>>(url, { method: 'get', params })
  },
  post: <T>(url: string, body?: any) => {
    return myFetch<ResResult<T>>(url, { method: 'post', body })
  },
  put: <T>(url: string, body?: any) => {
    return myFetch<ResResult<T>>(url, { method: 'put', body })
  },
  delete: <T>(url: string, body?: any) => {
    return myFetch<ResResult<T>>(url, { method: 'delete', body })
  }
}
