export default defineEventHandler(async event => {
  const runtime = useRuntimeConfig()
  const baseUrl = runtime.public.apiBase || ''
  const prefix = runtime.public.apiPrefix || ''
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
    if (event.node.req.url.includes('upload')) {
      const formData = await readMultipartFormData(event)
      body = formData && (formData[0] as any)

      const boundary = `----${Math.random().toString(16)}`
      const payload = Buffer.concat([
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(
          `Content-Disposition: form-data; name="${body.name}"; filename="${body.filename}"\r\n`
        ),
        Buffer.from(`Content-Type: ${body.type}\r\n\r\n`),
        body.data,
        Buffer.from(`\r\n--${boundary}--\r\n`)
      ])
      delete headers['content-type']
      delete headers['content-length']
      headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`
      headers['Content-Length'] = payload.length
      const formData2 = new FormData()
      formData2.append(body.name, new Blob([payload]), body.filename)
      body = formData2 as any
    }
    return $fetch(url, {
      method,
      params: query,
      body,
      headers,
    })
  }
})
