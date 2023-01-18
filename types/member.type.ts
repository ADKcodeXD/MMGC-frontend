declare module 'Member' {
	interface MemberModel {
		/**
		 * 头像，头像的图片地址
		 */
		avatar: null | string
		/**
		 * 创建时间，创建时间
		 */
		createTime: number
		/**
		 * 个人介绍
		 */
		desc: null | string
		/**
		 * 邮箱
		 */
		email: null | string
		/**
		 * 1为男 0为女
		 */
		gender: number | null
		/**
		 * 用户唯一uid 自增id
		 */
		memberId: number
		/**
		 * 中文名，昵称 姓名
		 */
		memberName: string
		/**
		 * 密码 MD5 简单加密即可
		 */
		password: string
		/**
		 * 角色信息
		 */
		role: null | string
		snsSite: Sns | null
		/**
		 * 用户名
		 */
		username: string
	}

	interface MemberParams {
		/**
		 * 用户名
		 */
		username: string
		/**
		 * 邮箱验证码 需要接入邮件服务
		 */
		verifyCode: number
		/**
		 * 中文名，昵称 姓名
		 */
		memberName: string
		/**
		 * 密码 MD5 简单加密即可
		 */
		password: string
		/**
		 * 邮箱 必须要
		 */
		email: string
		/**
		 * 头像，头像的图片地址
		 */
		avatar?: null | string
		/**
		 * 个人介绍
		 */
		desc?: null | string
		/**
		 * 1为男 0为女
		 */
		gender?: number | null
		snsSite?: Sns | null
	}

	interface MemberVo {
		memberId: number
		memberName: string
		username: string
		avatar: null | string
		desc: null | string
		gender: number | null | string
		snsSite: Sns | null
		role: string | null
		email: string | null
		createTime?: string | null | number
		password?: string
	}
}
