export const getConfig = async () => {
  const { data, refresh } = await xFetch<ConfigVo>('/api/config/getConfig')
  return {
    data: data && data.data,
    refresh
  }
}
