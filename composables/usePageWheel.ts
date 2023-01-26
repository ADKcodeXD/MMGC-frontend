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
    if (evt.stopPropagation) {
      evt.stopPropagation()
    }
    if (pageState.isScrolling) {
      return false
    }
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
