export const uploadImg = async (formData: FormData | File | Blob) => {
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
