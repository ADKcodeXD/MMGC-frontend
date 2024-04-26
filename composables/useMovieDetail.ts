import type { MovieVo } from 'Movie'
import { getMovieByActivityId, getMovieDetailById } from '~~/composables/apis/movie'
import { addComment, getCommentList } from '~~/composables/apis/comment'
import { useGlobalStore } from '~~/stores/global'
import { useUserStore } from '~~/stores/user'
import type { CommentVo } from 'Comment'
import _ from 'lodash'

export const useMovieDetail = () => {
  const route = useRoute()
  const movieDetail = ref<MovieVo>()
  const movies = ref<MovieVo[]>([])
  const openlink = useOpenLink()
  const snsSites = ref()
  const body = ref()
  const content = ref('')
  const isFocus = ref(false)

  const localeNaviGate = useLocaleNavigate()
  const { t } = useI18n()
  const { userInfo } = useUserStore()
  const { currentActivityData } = useGlobalStore()

  const movieId = computed(() => {
    return parseInt(route.params.movieId.toString()) || 0
  })

  const total = ref(0)
  const comments = ref<CommentVo[]>([])
  const playSource = ref<any[]>([])
  const pageParam = reactive<any>({
    page: 1,
    pageSize: 10,
    movieId: movieId.value
  })

  const getMovieDetail = async (movieId: number) => {
    const { data } = await getMovieDetailById(movieId)
    if (data) {
      movieDetail.value = data
      const keys = _.keys(movieDetail.value.moviePlaylink) as any
      keys.forEach((key: keyof I18N) => {
        if (movieDetail.value && movieDetail.value.moviePlaylink[key]) {
          if (movieDetail.value.moviePlaylink[key]) {
            playSource.value.push({ url: movieDetail.value.moviePlaylink[key], label: key })
          }
        }
      })
      snsSites.value = useSnsSites(data.movieLink)
    }
  }

  const backToMain = (isMobile?: boolean) => {
    if (movieDetail.value?.activityVo?.activityId) {
      localeNaviGate(
        `${isMobile ? '/mobile' : ''}/activity/${movieDetail.value?.activityVo?.activityId}/main`,
        {
          day: movieDetail.value.day
        }
      )
    } else {
      localeNaviGate(
        `${isMobile ? '/mobile' : ''}/activity/${currentActivityData?.activityId}/main`
      )
    }
  }
 
  const getVideoByDay = async () => {
    if (movieDetail.value?.activityVo && movieDetail.value.day) {
      const { data } = await getMovieByActivityId(
        movieDetail.value.activityVo.activityId,
        movieDetail.value.day
      )
      movies.value = data?.result.filter(item => item.movieId !== movieId.value) || []
    }
  }

  const sentComment = async () => {
    if (!userInfo || !userInfo?.memberId) {
      ElMessage.warning(t('loginFirst'))
      return
    }
    if (!content.value || content.value.trim().length === 0) {
      ElMessage.warning(t('commentContentEmpty'))
      return
    }
    await addComment({
      content: content.value,
      movieId: movieId.value
    })
    await getComment()
    content.value = ''
    ElMessage.success(t('commentSuccess'))
    return
  }

  const getComment = async (prams?: any) => {
    if (!prams) {
      pageParam.page = 1
      prams = pageParam
    }
    const { data } = await getCommentList(prams)
    if (data) {
      comments.value = data.result
      total.value = data.total
    }
  }

  return {
    total,
    playSource,
    pageParam,
    comments,
    movieDetail,
    movies,
    openlink,
    snsSites,
    body,
    content,
    isFocus,
    getComment,
    sentComment,
    getVideoByDay,
    backToMain,
    movieId,
    getMovieDetail
  }
}
