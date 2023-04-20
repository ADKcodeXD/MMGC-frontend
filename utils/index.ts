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
  switch (key) {
    case 'none':
      quality = ''
      break
    case '0.2x':
      quality = '?imageMogr2/thumbnail/100x/quality/30'
      break
    case '0.4x':
      quality = '?imageMogr2/thumbnail/300x/quality/30'
      break
    case '0.6x':
      quality = '?imageMogr2/thumbnail/640x/quality/60'
      break
    case '0.8x':
      quality = '?imageMogr2/thumbnail/1080x/quality/80'
      break
  }
  return `${img}${quality}`
}
