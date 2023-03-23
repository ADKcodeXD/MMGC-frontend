export const getCode = async (email: string) => {
  const { data, refresh } = await xFetch<ResResult<null>>('/api/email/getCode', 'get', {
    email
  })
  return {
    data: data && data.data,
    refresh
  }
}

export const verify = async (email: string, code: number) => {
  const { data, refresh } = await xFetch<ResResult<null>>('/api/email/verify', 'post', {
    email,
    code
  })
  return {
    data: data && data.data,
    refresh
  }
}
