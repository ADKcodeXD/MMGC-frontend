<template>
  <ClientOnly>
    <div class="plyr-wrapper">
      <div ref="playerContainer" class="plyr-container">
        <video ref="videoElement" :poster="coverzip || ''" playsinline crossorigin="anonymous">
          <source :src="currentSrc" type="video/mp4" />
        </video>
      </div>

      <!-- 移动端横屏提示 -->
      <div v-if="showOrientationTip" class="orientation-tip">
        <div class="orientation-content">
          <div class="orientation-icon">📱</div>
          <div class="orientation-text">
            <div class="orientation-title">{{ orientationText.title }}</div>
            <div class="orientation-subtitle">{{ orientationText.subtitle }}</div>
          </div>
          <button class="orientation-close" @click="hideOrientationTip">×</button>
        </div>
      </div>

      <!-- 视频源切换按钮 -->
      <div v-if="sources.length > 1" class="source-selector">
        <div class="source-label">
          <span class="source-icon">🌐</span>
          {{ sourceText.label }}
        </div>
        <div class="source-buttons">
          <button
            v-for="item in sources"
            :key="item.label"
            :class="['source-btn', { active: item.label === currentLabel }]"
            @click="switchSource(item.label)"
          >
            <span class="source-flag">{{ getLanguageFlag(item.label) }}</span>
            <span class="source-text">{{ getLanguageText(item.label) }}</span>
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { calcZip } from '~~/utils'
import * as _ from 'lodash-es'

interface VideoSource {
  src: string
  type: string
  label: string
}

const props = defineProps<{
  videoUrl: string | any[] | any
  cover?: string
}>()

const emit = defineEmits(['onPlay', 'onAbort', 'onPause'])
const { locale } = useI18n()

const playerContainer = ref<HTMLElement>()
const videoElement = ref<HTMLVideoElement>()
let player: any = null
const currentLabel = ref(locale.value)
const isMobile = ref(false)
const showOrientationTip = ref(false)

// 多语言文本
const languageTexts = {
  zh: {
    source: { label: '切换语言:' },
    orientation: {
      title: '获得更好的观看体验',
      subtitle: '请将设备横向旋转'
    },
    languages: {
      zh: '中文',
      'zh-CN': '中文',
      'zh-TW': '繁体中文',
      en: 'English',
      'en-US': 'English',
      ja: '日本語',
      'ja-JP': '日本語',
      default: '默认'
    }
  },
  en: {
    source: { label: 'Language:' },
    orientation: {
      title: 'Better Viewing Experience',
      subtitle: 'Please rotate your device to landscape'
    },
    languages: {
      zh: '中文',
      'zh-CN': '中文',
      'zh-TW': '繁体中文',
      en: 'English',
      'en-US': 'English',
      ja: '日本語',
      'ja-JP': '日本語',
      default: 'Default'
    }
  },
  ja: {
    source: { label: '言語切替:' },
    orientation: {
      title: 'より良い視聴体験',
      subtitle: 'デバイスを横向きに回転してください'
    },
    languages: {
      zh: '中文',
      'zh-CN': '中文',
      'zh-TW': '繁体中文',
      en: 'English',
      'en-US': 'English',
      ja: '日本語',
      'ja-JP': '日本語',
      default: 'デフォルト'
    }
  }
}

const currentLanguage = computed(() => {
  const lang = locale.value.split('-')[0]
  return (languageTexts as any)[lang] || languageTexts.en
})

const sourceText = computed(() => currentLanguage.value.source)
const orientationText = computed(() => currentLanguage.value.orientation)

const coverzip = computed(() => {
  if (props.cover) {
    return calcZip(props.cover, '0.6x')
  }
})

const sources = computed<VideoSource[]>(() => {
  if (_.isArray(props.videoUrl)) {
    return props.videoUrl.map((item: any) => ({
      src: item.url,
      type: 'video/mp4',
      label: item.label
    }))
  } else if (_.isObject(props.videoUrl)) {
    return Object.keys(props.videoUrl).map((key: string) => ({
      src: props.videoUrl[key],
      type: 'video/mp4',
      label: key
    }))
  } else {
    return [
      {
        src: props.videoUrl,
        type: 'video/mp4',
        label: 'default'
      }
    ]
  }
})

const currentSrc = computed(() => {
  const found = sources.value.find(item => item.label === currentLabel.value)
  return found ? found.src : sources.value[0].src
})

// 检测移动设备
function detectMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 获取语言标志
function getLanguageFlag(label: string): string {
  const flags: Record<string, string> = {
    zh: '🇨🇳',
    'zh-CN': '🇨🇳',
    'zh-TW': '🇹🇼',
    en: '🇺🇸',
    'en-US': '🇺🇸',
    ja: '🇯🇵',
    'ja-JP': '🇯🇵',
    default: '🌐'
  }
  return flags[label] || '🌐'
}

// 获取语言文本
function getLanguageText(label: string): string {
  return currentLanguage.value.languages[label] || label
}

// 检查屏幕方向
function checkOrientation() {
  if (!isMobile.value) return

  const isPortrait = window.innerHeight > window.innerWidth
  if (isPortrait && player?.fullscreen?.active) {
    showOrientationTip.value = true
  } else {
    showOrientationTip.value = false
  }
}

// 隐藏横屏提示
function hideOrientationTip() {
  showOrientationTip.value = false
}

// 尝试锁定屏幕方向
function tryLockOrientation() {
  if (!isMobile.value || !player?.fullscreen?.active) return

  if (screen.orientation && (screen.orientation as any).lock) {
    ;(screen.orientation as any).lock('landscape').catch(() => {
      // 如果无法锁定方向，显示提示
      setTimeout(checkOrientation, 500)
    })
  } else {
    // 如果不支持锁定，显示提示
    setTimeout(checkOrientation, 500)
  }
}

// 解锁屏幕方向
function unlockOrientation() {
  if (screen.orientation && (screen.orientation as any).unlock) {
    ;(screen.orientation as any).unlock()
  }
  showOrientationTip.value = false
}

// 切换视频源
async function switchSource(label: string) {
  if (currentLabel.value === label) return
  currentLabel.value = label
  if (player) {
    const currentTime = player.currentTime
    const wasPlaying = !player.paused
    const volume = player.volume
    // 显示加载状态
    player.poster = coverzip.value || ''

    try {
      player.source = {
        type: 'video',
        sources: [
          {
            src: currentSrc.value,
            type: 'video/mp4'
          }
        ]
      }

      // 恢复播放状态
      await nextTick()

      player.once('loadedmetadata', () => {
        if (currentTime > 0 && currentTime < player.duration) {
          player.currentTime = currentTime
        }
        player.volume = volume

        if (wasPlaying) {
          player.play().catch(console.error)
        }
      })
    } catch (error) {
      console.error('Error switching source:', error)
      emit('onAbort')
    }
  }
}

onMounted(async () => {
  isMobile.value = detectMobile()
  // 动态导入 Plyr
  const { default: Plyr } = await import('plyr')
  if (videoElement.value) {
    // 移动端控制栏配置
    const mobileControls = [
      'play-large',
      'play',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'settings',
      'fullscreen'
    ]

    // 桌面端控制栏配置
    const desktopControls = [
      'play-large',
      'restart',
      'rewind',
      'play',
      'fast-forward',
      'progress',
      'current-time',
      'duration',
      'mute',
      'volume',
      'captions',
      'settings',
      'pip',
      'airplay',
      'fullscreen'
    ]

    player = new Plyr(videoElement.value, {
      // 根据设备类型选择控制栏
      controls: isMobile.value ? mobileControls : desktopControls,

      // 设置菜单
      settings: ['quality', 'speed'],

      // 播放速度选项
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
      },

      // 音量设置
      volume: 0.6,

      // 其他配置
      loop: { active: false },
      keyboard: { focused: true, global: false },
      tooltips: { controls: true, seek: true },
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: isMobile.value
      },

      // 自定义图标
      iconUrl: 'https://cdn.plyr.io/3.7.8/plyr.svg',

      // 质量选择器
      quality: {
        default: 720,
        options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
      }
    })

    // 事件监听
    player.on('ready', () => {
      console.log('Plyr is ready')
    })

    player.on('play', () => {
      emit('onPlay')
    })

    player.on('pause', () => {
      emit('onPause')
    })

    player.on('ended', () => {
      emit('onPause')
    })

    player.on('error', (event: any) => {
      console.error('Plyr error:', event)
      emit('onAbort')
    })

    // 全屏事件监听
    player.on('enterfullscreen', () => {
      if (isMobile.value) {
        tryLockOrientation()
      }
    })

    player.on('exitfullscreen', () => {
      if (isMobile.value) {
        unlockOrientation()
      }
    })

    // 监听屏幕方向变化
    if (isMobile.value) {
      window.addEventListener('orientationchange', () => {
        setTimeout(checkOrientation, 500)
      })
      window.addEventListener('resize', checkOrientation)
    }
  }
})

onBeforeUnmount(() => {
  if (player) {
    player.destroy()
    player = null
  }
  if (isMobile.value) {
    window.removeEventListener('orientationchange', checkOrientation)
    window.removeEventListener('resize', checkOrientation)
  }
})

// 监听语言变化，更新当前选中的源
watch(locale, newLocale => {
  const hasMatchingSource = sources.value.some(source => source.label === newLocale)
  if (hasMatchingSource) {
    currentLabel.value = newLocale
  }
})

defineExpose({
  pause: () => player?.pause(),
  play: () => player?.play(),
  player: () => player,
  switchSource
})
</script>

<style lang="scss">
// 导入 Plyr 样式
@import 'plyr/dist/plyr.css';

.plyr-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.plyr-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .plyr {
    width: 100%;
    height: 100%;

    &--video {
      background: #000;
    }
  }

  // 自定义 Plyr 样式，参考官网设计
  .plyr__control {
    &--overlaid {
      background: rgba(0, 123, 255, 0.9);
      border: 2px solid rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 123, 255, 1);
        transform: scale(1.1);
      }
    }
  }

  .plyr__controls {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    border-radius: 0 0 8px 8px;
  }

  .plyr__control {
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.plyr__tab-focus {
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.8);
    }
  }

  .plyr__progress {
    &__input {
      &[type='range'] {
        color: #007bff;
      }
    }
  }

  .plyr__volume {
    &__input {
      &[type='range'] {
        color: #007bff;
      }
    }
  }

  // 设置弹出框样式优化
  .plyr__menu {
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px !important;
    backdrop-filter: blur(10px) !important;

    &__container {
      background: black !important;
    }

    &__value,
    &__item {
      color: #fff !important;
      background: transparent !important;
      border-radius: 4px !important;

      &:hover,
      &:focus {
        background: rgba(255, 255, 255, 0.1) !important;
        color: #007bff !important;
      }

      &[aria-checked='true'] {
        background: rgba(0, 123, 255, 0.2) !important;
        color: #007bff !important;
      }
    }

    &__back {
      color: #fff !important;

      &:hover,
      &:focus {
        background: rgba(255, 255, 255, 0.1) !important;
        color: #007bff !important;
      }
    }
  }
}

// 移动端横屏提示
.orientation-tip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);

  .orientation-content {
    background: #fff;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    max-width: 320px;
    margin: 20px;
    position: relative;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: orientationFadeIn 0.3s ease-out;
  }

  .orientation-icon {
    font-size: 48px;
    margin-bottom: 16px;
    animation: orientationRotate 2s ease-in-out infinite;
  }

  .orientation-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .orientation-subtitle {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }

  .orientation-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    font-size: 18px;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
      color: #333;
    }
  }
}

@keyframes orientationFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes orientationRotate {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

// 移动端进度条优化
@media (max-width: 768px) {
  .plyr-container .plyr__controls {
    // 移动端控制栏布局优化
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    gap: 4px;

    // 进度条单独一行
    .plyr__progress {
      order: -1;
      width: 100% !important;
      margin: 0 0 8px 0;
      height: 6px;
      transform: translateY(-4px);
      &__input {
        &[type='range'] {
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          &::-webkit-slider-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #007bff;
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          &::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #007bff;
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        }
      }

      &__buffer {
        display: none;
      }

      &__played {
        background: #007bff;
        border-radius: 3px;
      }
    }

    .plyr__control:not(.plyr__progress) {
      flex: 0 0 auto;
      margin: 0 2px;
    }

    .plyr__time {
      font-size: 12px;
      margin: 0 4px;
    }

    .plyr__volume {
      .plyr__control[type='range'] {
        display: none;
      }
    }
  }
}

// 语言切换器样式
.source-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  .source-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
  }

  .source-icon {
    font-size: 16px;
    opacity: 0.7;
  }

  .source-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .source-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 80px;
    justify-content: center;

    .source-text {
      white-space: nowrap;
    }

    &:hover {
      border-color: #007bff;
      color: #007bff;
      background: rgba(0, 123, 255, 0.05);
      transform: translateY(-1px);
    }

    &.active {
      background: #007bff;
      border-color: #007bff;
      color: #fff;
      box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .source-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .source-buttons {
      width: 100%;
      justify-content: flex-start;
    }

    .source-btn {
      flex: 1;
      min-width: 70px;
    }
  }
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  .source-selector {
    background: rgba(30, 30, 30, 0.95);

    .source-label {
      color: #e0e0e0;
    }

    .source-btn {
      background: #2a2a2a;
      border-color: #444;
      color: #ccc;

      &:hover {
        background: rgba(0, 123, 255, 0.1);
        border-color: #007bff;
        color: #007bff;
      }
    }
  }

  .orientation-tip .orientation-content {
    background: #2a2a2a;
    color: #e0e0e0;

    .orientation-title {
      color: #fff;
    }

    .orientation-subtitle {
      color: #ccc;
    }

    .orientation-close {
      background: rgba(255, 255, 255, 0.1);
      color: #ccc;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }
    }
  }
}
</style>
