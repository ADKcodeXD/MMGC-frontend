export const uploadImg = async (formData: FormData) => {
  const { data, refresh } = await xFetch<ResResult<string>>(
    '/api/upload/uploadImg',
    'post',
    formData
  )
  return {
    data: data && data.data,
    refresh
  }
}
