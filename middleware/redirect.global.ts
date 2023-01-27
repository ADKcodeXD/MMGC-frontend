export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    const locale = useCookie('i18n_redirected')
    if (locale.value === 'cn') {
      return navigateTo('/welcome')
    } else {
      return navigateTo(`/${locale.value}/welcome`)
    }
  }
  return
})
