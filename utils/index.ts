export const setItem = (key: string, item: any): void => {
  if (typeof item === 'object') {
    localStorage.setItem(key, JSON.stringify(item))
  } else if (typeof item === 'string') {
    try {
      localStorage.setItem(key, item)
    } catch (error) {
      throw new Error('item is not a object')
    }
  }
}

export const getItem = (key: string): any => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return null
    } else {
      return JSON.parse(item)
    }
  } catch (error) {
    return localStorage.getItem(key)
  }
}

export const removeItem = (key: string): void => {
  localStorage.removeItem(key)
}

export const calcZip = (img: string, key: string) => {
  let quality
  const RegQiniu = new RegExp(/^http(s|):\/\/assets.*\/[0-9a-zA-Z-]*.(jpeg|jpg|png|webp|gif)$/, 'i')
  const RegTencent = new RegExp(
    /^http(s|):\/\/mirai-mad.*\/[0-9a-zA-Z-]*.(jpeg|jpg|png|webp)$/,
    'i'
  )
  let tencentFlag = false
  let qiniuFlag = false
  if (RegQiniu.test(img)) {
    qiniuFlag = true
  } else if (RegTencent.test(img)) {
    tencentFlag = true
  } else {
    return img
  }
  switch (key) {
    case 'none':
      quality = ''
      break
    case '0.2x':
      quality = tencentFlag ? '?imageMogr2/thumbnail/100x/quality/40' : '?imageView2/2/w/100/q/40'
      break
    case '0.4x':
      quality = tencentFlag ? '?imageMogr2/thumbnail/300x/quality/50' : '?imageView2/2/w/300/q/50'
      break
    case '0.6x':
      quality = tencentFlag ? '?imageMogr2/thumbnail/640x/quality/70' : '?imageView2/2/w/640/q/70'
      break
    case '0.8x':
      quality = tencentFlag ? '?imageMogr2/thumbnail/1080x/quality/80' : '?imageView2/2/w/1080/q/85'
      break
  }
  return `${img}${quality}`
}
