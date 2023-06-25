/**
 * 定义用户信息数据类型
 */

// 登录接口返回的数据
export interface User {
  id: string
  account: string
  mobile: string
  token: string
  avatar: string
}

// 短信验证码类型
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

// 用户详情类型
// 排除 token
type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}

// 患者类型
export interface Patient {
  /**
   * 是否设置为默认患者 1 设置为默认 0 不设置
   */
  defaultFlag: 0 | 1
  /**
   * 性别 1男 0女
   */
  gender: number
  /**
   * 性别值
   */
  genderValue?: number
  age?: number
  /**
   * 患者信息id
   */
  id?: string
  /**
   * 患者身份证号
   */
  idCard: string
  /**
   * 患者姓名
   */
  name: string
}

// 患者列表类型
export type patientList = Patient[]
