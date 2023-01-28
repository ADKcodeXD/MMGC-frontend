import { MemberVo } from 'Member'

declare global {
  type NormalObject = {
    [key: string]: any
  }

  type ControllerRouter = {
    url: string
    method: string
    handler: Function
    name?: string
    middleware?: any
    constructor?: Function | any
    instance?: any
  }

  type ParamsMeta = {
    name: string
    index: number
    fn: Function
  }

  type I18N = {
    /**
     * 中文名
     */
    cn: string
    /**
     * 英文名
     */
    en?: null | string
    /**
     * 日文名
     */
    jp?: null | string
  }

  type Staff = {
    /**
     * 评委id列表
     */
    judges?: number[] | null
    /**
     * 主办人用户id
     */
    organizer?: null | number
    /**
     * 翻译人员
     */
    translator?: number[] | null
    /**
     * 其他贡献者
     */
    others?: number[] | null
  }

  type StaffVo = {
    judges?: MemberVo[] | null
    organizer?: null | MemberVo
    translator?: MemberVo[] | null
    others?: MemberVo[] | null
  }

  type Sns = {
    bilibili?: string
    /**
     * niconico网站
     */
    niconico?: string
    /**
     * 个人网站
     */
    personalWebsite?: string
    /**
     * 推特网站
     */
    twitter?: string
    /**
     * youtube频道
     */
    youtube?: string
  }

  type DownloadLink = {
    baidu?: string
    google?: string
    onedrive?: string
    other?: string
  }

  type LoginVo = {
    /**
     * 是否收藏
     */
    isCollect: boolean
    /**
     * 是否点赞
     */
    isLike: boolean
    /**
     * 是否已投票
     */
    isPoll: boolean
  }

  type ResResult<T> = {
    code: number
    msg: string
    data: T
  }

  type PageResult<T> = {
    result: T[]
    total: number
    page: number
  }
  /**
   * CMVO
   */
  interface Cmvo {
    cmEditor: string | null
    desc: null | string
    link: string
    title: null | string
  }

  interface PageParams {
    page?: number | null
    pageSize?: number | null
    id?: number | null // 搜索id
    /** 搜索关键词 */
    keyword?: string | null
    createTime?: Date | number | string | null
    /** 相关字段 */
    sortRule?: string | null
    /** 不填默认正序 */
    orderRule?: '' | 'reverse' | null
  }

  interface IncrementType {
    coll: string
    currentValue: number
  }

  export interface MoviePageParams extends PageParams {
    /** 活动id */
    activityId?: number
    /** 活动天数 */
    day?: number
    /** 0代表未公开 1代表公开 */
    isPublic?: number
    /** 上传者id */
    uploader?: number
  }

  export interface MMGCSysConfig {
    currentActivityId?: number
    skin?: string
    isVideoPlay?: boolean
    otherSettings?: string
    configType?: number
  }
}
export {}
