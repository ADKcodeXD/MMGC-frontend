declare module 'Activity' {
	interface ActivityModel {
		/**
		 * 活动官网页的背景图 不设置就是默认背景
		 */
		activityBackgroundImg: string | null
		/**
		 * 活动cm 视频链接 可以拥有好几个CM
		 */
		activityCM: Cmvo[] | null
		/**
		 * 活动封面图
		 */
		activityCover: string | null
		/**
		 * 活动主id，活动的id 根据此id进行各种操作
		 */
		activityId: number
		/**
		 * 活动专属logo
		 */
		activityLogo: string
		/**
		 * 活动名 活动的名称 支持国际化
		 */
		activityName: I18N
		/**
		 * 创建时间 Date类型
		 */
		createTime: string | Date | number
		/**
		 * 活动的天数
		 */
		days: number
		/**
		 * 富文本的多语言简介
		 */
		desc: I18N | null
		/**
		 * 结束的时间
		 */
		endTime: string | Date | null
		/**
		 * 视频数量
		 */
		movieNums: number | null
		/**
		 * 赞助商id  可以有多个赞助商
		 */
		sponsorId: number[] | null
		/**
		 * 活动组织人员
		 */
		staff: null | Map<any, any>
		/**
		 * 开始时间
		 */
		startTime: string | null
		/**
		 * 规则的多语言简介
		 */
		rules: I18N | null
		/**
		 * 其他信息的详细介绍
		 */
		timesorother: I18N | null
		/**
		 * faq
		 */
		faq: I18N | null
	}

	interface ActivityVo extends Omit<ActivityModel, 'staff' | 'sponsorId'> {
		/**
		 * StaffVo类型
		 */
		staff: StaffVo | null
		/**
		 * Array<SponsorVo>
		 */
		sponsorListVo: Array<any> | null
	}

	type ActivityParamsTemp = Partial<
		Pick<
			ActivityModel,
			'activityBackgroundImg' | 'activityCM' | 'days' | 'endTime' | 'sponsorId' | 'startTime' | 'rules' | 'faq' | 'timesorother'
		>
	> &
		Pick<ActivityModel, 'activityCover' | 'activityId' | 'activityLogo' | 'activityName' | 'desc'>
	interface ActivityParams extends ActivityParamsTemp {
		/**
		 * 活动组织人员 id集合类型
		 */
		staff: Staff | null
	}

	interface ActivityUpdateParams extends Partial<Omit<ActivityParams, 'activityId'>> {
		/**
		 * 必填 更新需要携带活动id
		 */
		activityId: number
	}
}
