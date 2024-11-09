export const useFullPageWheel = (length: number) => {
  const pageState = reactive({
    current: 1,
    isScrolling: false,
    deltaY: 0,
    animationTime: 1010,
    len: length
  })
  const fullpageEl = ref()
  const container = ref()

  const execScroll = (index: number) => {
    // 获取容器高度
    const height = fullpageEl.value.clientHeight
    const scrollHeight = -(index - 1) * height + 'px'
    container.value.style.transform = `translateY(${scrollHeight})`
    pageState.current = index
  }

  const move = (index: number) => {
    pageState.isScrolling = true
    execScroll(index)
    setTimeout(() => {
      pageState.isScrolling = false
    }, pageState.animationTime)
  }

  const next = () => {
    if (pageState.current + 1 <= pageState.len) {
      pageState.current += 1
      move(pageState.current)
    }
  }

  const pre = () => {
    if (pageState.current - 1 > 0) {
      pageState.current -= 1
      move(pageState.current)
    }
  }

  const onMouseWheel = (e: WheelEvent) => {
    const evt = e || window.event
    const target = evt.target as HTMLElement

    // 查找最近的可滚动容器
    const getScrollParent = (element: HTMLElement): HTMLElement | null => {
      const style = window.getComputedStyle(element)
      const hasScroll = style.overflow === 'auto' || style.overflow === 'scroll'
      const hasVerticalScroll = element.scrollHeight > element.clientHeight

      if (hasScroll && hasVerticalScroll) {
        return element
      }

      return element.parentElement ? getScrollParent(element.parentElement) : null
    }

    const scrollableParent = getScrollParent(target)

    if (scrollableParent) {
      // 检查是否已经滚动到边界
      const isAtTop = scrollableParent.scrollTop <= 0
      const isAtBottom =
        scrollableParent.scrollTop + scrollableParent.clientHeight >= scrollableParent.scrollHeight

      // 只有在滚动到边界时才触发页面切换
      if ((evt.deltaY > 0 && isAtBottom) || (evt.deltaY < 0 && isAtTop)) {
        evt.stopPropagation()
        if (pageState.isScrolling) return false

        pageState.deltaY = evt.deltaY
        if (pageState.deltaY > 0) {
          next()
        } else {
          pre()
        }
      }
      return // 如果有可滚动容器，优先让容器自然滚动
    }

    // 没有可滚动容器时，执行原有的页面切换逻辑
    evt.stopPropagation()
    if (pageState.isScrolling) return false

    pageState.deltaY = evt.deltaY
    if (pageState.deltaY > 0) {
      next()
    } else if (pageState.deltaY < 0) {
      pre()
    }
  }

  return {
    pageState,
    move,
    onMouseWheel,
    fullpageEl,
    container
  }
}
