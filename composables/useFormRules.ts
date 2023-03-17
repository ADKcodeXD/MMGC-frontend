import { MemberParams } from 'Member'
export const genral = (name: string) => {
  return [
    { required: true, message: `请输入${name}`, trigger: 'change' },
    { min: 6, max: 16, message: `${name}需要在6-16个字符间`, trigger: 'change' }
  ]
}

export const useLoginRules = (registerForm: MemberParams) => {
  const validateRePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入确认密码！'))
    } else if (value !== registerForm.password) {
      callback(new Error('两次密码输入不一致！'))
    } else {
      callback()
    }
  }
  const validateEmail = (rule: any, value: any, callback: any) => {
    const emailReg = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
    if (value === '') {
      callback(new Error('请输入邮箱！'))
    } else if (!emailReg.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  }
  const ruleslogin = reactive({
    username: genral('用户名'),
    password: genral('密码')
  })
  const rulesRegister = reactive({
    username: [
      ...genral('用户名'),
      {
        pattern: /^[A-Za-z0-9]{6,16}$/,
        message: `用户名不能包含特殊字符，只能由英文和数字组成`,
        triger: 'change'
      }
    ],
    password: [
      ...genral('密码'),
      {
        pattern: /^[A-Za-z0-9.+-_,]{6,16}$/,
        message: `密码只能包含如下特殊字符(.+-_,)`,
        triger: 'change'
      }
    ],
    memberName: genral('昵称'),
    rePassword: [{ validator: validateRePass, trigger: 'change' }, ...genral('确认密码')],
    email: [
      { validator: validateEmail, trigger: 'change' },
      { required: true, message: '请输入邮箱', trigger: 'change' }
    ],
    verifyCode: [
      { required: true, message: '请输入验证码', trigger: 'change' },
      { pattern: /^[0-9]{6}/, message: '请输入正确的验证码', trigger: 'change' }
    ]
  })
  return {
    validateRePass,
    validateEmail,
    ruleslogin,
    rulesRegister
  }
}
