import type { MovieVo } from 'Movie'
import { cancelVideoLike, likeVideo, pollVideo } from './apis/oper'

export const useMovieOperate = () => {
  const { t } = useI18n()
  const localeNaviGate = useLocaleNavigate()
  const isLoading = ref(false)

  const likeOrUnLike = async (movieItem: MovieVo) => {
    if (!movieItem.loginVo || isLoading.value) return
    isLoading.value = true
    try {
      if (movieItem && movieItem.loginVo.isLike) {
        await cancelVideoLike(movieItem.movieId)
        ElMessage.success(t('cancelLike'))
      } else {
        const { data } = await likeVideo(movieItem.movieId)
        if (data?.code === 200) {
          ElMessage.success(t('likeSuccess'))
        }
      }
    } finally {
      isLoading.value = false
    }
    movieItem.loginVo.isLike = !movieItem.loginVo.isLike
    if (movieItem.likeNums) movieItem.likeNums += movieItem.loginVo.isLike ? 1 : -1
  }

  const pollMovie = (movieItem: MovieVo) => {
    if (!movieItem.loginVo || isLoading.value) return
    isLoading.value = true
    try {
      if (movieItem && movieItem.loginVo.isPoll) {
        ElMessage.warning(t('pollLimit'))
      } else {
        ElMessageBox.confirm(t('pollTip'), t('tip')).then(async () => {
          const { data } = await pollVideo(movieItem.movieId)
          if (data?.code === 200 && movieItem.loginVo) {
            movieItem.loginVo && (movieItem.loginVo.isPoll = true)
            ElMessage.success(t('pollSuccess'))
            if (movieItem.pollNums) movieItem.pollNums += movieItem.loginVo.isPoll ? 1 : -1
          }
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  const goToMovieDetail = (movieId: number) => {
    localeNaviGate(`/movie/${movieId}`)
  }

  const goToMovieDetailMobile = (movieId: number) => {
    localeNaviGate(`/mobile/movie/${movieId}`)
  }

  return {
    pollMovie,
    likeOrUnLike,
    isLoading,
    goToMovieDetail,
    goToMovieDetailMobile
  }
}
