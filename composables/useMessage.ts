export const useMessage = () => {
  const createMessage = (msg = '访问成功', type: any = 'success') => {
    ElMessage({
      type: type,
      message: msg
    })
  }
  return {
    createMessage
  }
}
