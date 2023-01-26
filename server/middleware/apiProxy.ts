export default defineEventHandler(async event => {
  const baseUrl = process.env.NUXT_PUBLIC_API_BASE || ''
  const prefix = process.env.NUXT_PUBLIC_API_PREFIX || ''
  if (event.node.req.url?.startsWith('/api')) {
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
