export default defineEventHandler(async event => {
  const runtime = useRuntimeConfig()
  const baseUrl = runtime.public.apiBase || ''
  const prefix = runtime.public.apiPrefix || ''
  if (event.node.req.url?.startsWith('/api')) {
    console.log(event.node.req.url, baseUrl, prefix)
    const url = baseUrl + prefix + event.node.req.url.replace('/api', '')
    const query = getQuery(event)
    const token = getCookie(event, 'token')
    const method = getMethod(event)
    const headers: any = event.node.req.headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    let body = null
    if (method !== 'GET') {
      body = await readBody(event)
    }
    return $fetch(url, {
      method,
      params: query,
      body,
      headers
    })
  }
})
