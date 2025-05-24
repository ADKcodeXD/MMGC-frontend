export default defineNuxtRouteMiddleware((to, from) => {
  // 只在访问根路径时进行重定向
  if (to.path === '/' && to.fullPath === '/') {
    const locale = useCookie('i18n_redirected')
    if (locale.value === 'cn') {
      return navigateTo('/welcome')
    } else {
      if (locale.value) return navigateTo(`/${locale.value}/welcome`)
      else return navigateTo('/welcome')
    }
  }

  // 避免重定向循环 - 如果已经在 welcome 页面，不再重定向
  if (to.path.includes('/welcome')) {
    return
  }

  // 调试信息 - 可以在开发时启用
  if (process.dev) {
    console.log('Redirect middleware:', {
      toPath: to.path,
      toFullPath: to.fullPath,
      fromPath: from?.path,
      locale: useCookie('i18n_redirected').value
    })
  }

  return
})
