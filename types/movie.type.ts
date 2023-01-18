declare module 'Movie' {
	import { ActivityVo } from 'Activity'
	import { MemberVo } from 'Member'

	interface MovieModel {
		/**
		 * 关联活动id 如果不存在则为非活动作品
		 */
		activityId: null | number
		/**
		 * 作者id 可以关联本站拥有的用户 如果不存在可以输入作者名
		 */
		authorId: null | number
		/**
		 * 如果不存在id 则优先使用这个
		 */
		authorName: null | string
		/**
		 * 评论次数
		 */
		commentNums: number
		/**
		 * 上传时间 自动生成
		 */
		createTime: null | string | number
		/**
		 * 假设关联了活动 那么这个movie就会有所属日
		 */
		day: number | null
		/**
		 * 期望播放时间 未到达时间不会展示在列表中
		 */
		expectPlayTime: null | string
		/**
		 * 0 非原创 1 原创
		 */
		isOrigin: number
		/**
		 * 点赞数量
		 */
		likeNums: number
		/**
		 * cover 视频封面
		 */
		movieCover: string
		/**
		 * 影片介绍 分三语
		 */
		movieDesc: I18N
		/**
		 * 影片的下载链接 使用各种网盘存放
		 */
		movieDownloadLink: null | DownloadLink
		/**
		 * 影片id
		 */
		movieId: number
		/**
		 * 影片的播放链接 分各种平台
		 */
		movieLink: null | Sns
		/**
		 * 影片名 分三语存放
		 */
		movieName: I18N
		/**
		 * 三语播放i18n列表 适用于有多个源的情况下
		 */
		moviePlaylink: I18N
		/**
		 * 票数 仅用于活动作品 统计投票次数 一个人单日只能投一个作品
		 */
		pollNums: number
		/**
		 * 实际发布时间 用户填写
		 */
		realPublishTime: null | string
		/**
		 * 上传者id
		 */
		uploader: number
		/**
		 * 播放次数
		 */
		viewNums: number
	}

	type MovieParams = Pick<MovieModel, 'movieCover' | 'movieName' | 'movieDesc' | 'moviePlaylink'> &
		Partial<
			Pick<
				MovieModel,
				| 'movieLink'
				| 'movieDownloadLink'
				| 'authorId'
				| 'authorName'
				| 'realPublishTime'
				| 'expectPlayTime'
				| 'activityId'
				| 'day'
				| 'isOrigin'
			>
		>

	interface MovieUpdateParams extends MovieParams {
		movieId: number
	}
	interface MovieVo extends Required<Omit<MovieModel, 'activityId' | 'authorId' | 'uploader' | 'expectPlayTime'>> {
		/**
		 * 活动VO类型
		 */
		activityVo: ActivityVo | null
		/**
		 * 标记视频的一些状态
		 */
		loginVo: LoginVo | null
		/**
		 * 上传者信息
		 */
		uploader: MemberVo | null
		/**
		 * 实际原作者信息
		 */
		author: MemberVo | null
		/**
		 * 是否为原创作品
		 */
		isActivityMovie: boolean | null
		/**
		 * 是否为已公开作品
		 */
		isPublic: boolean | null
	}
}
