import type { MemberParams } from 'Member'

export const genral = (name: string, t: any) => {
  return [
    { required: true, message: t('inputName', [name]), trigger: 'change' },
    { min: 6, max: 16, message: t('name616', [name]), trigger: 'change' }
  ]
}

export const useLoginRules = (registerForm: MemberParams, t: any) => {
  const validateRePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error(t('inputConfirm')))
    } else if (value !== registerForm.password) {
      callback(new Error(t('notSame')))
    } else {
      callback()
    }
  }
  const validateEmail = (rule: any, value: any, callback: any) => {
    const emailReg = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+[.a-zA-Z]+$/
    if (value === '') {
      callback(new Error(t('inputEmail')))
    } else if (!emailReg.test(value)) {
      callback(new Error(t('correctEmail')))
    } else {
      callback()
    }
  }
  const ruleslogin = reactive({
    username: genral(t('username'), t),
    password: genral(t('password'), t)
  })
  const rulesRegister = reactive({
    username: [
      ...genral(t('username'), t),
      {
        pattern: /^[A-Za-z0-9]{6,16}$/,
        message: t('nochar'),
        triger: 'change'
      }
    ],
    password: [
      ...genral(t('password'), t),
      {
        pattern: /^[A-Za-z0-9.+-_,]{6,16}$/,
        message: t('teshu'),
        triger: 'change'
      }
    ],
    memberName: genral(t('nickname'), t),
    rePassword: [{ validator: validateRePass, trigger: 'change' }, ...genral(t('confirmPass'), t)],
    email: [
      { validator: validateEmail, trigger: 'change' },
      { required: true, message: t('inputEmail'), trigger: 'change' }
    ],
    verifyCode: [
      { required: true, message: t('inputCode'), trigger: 'change' },
      { pattern: /^[0-9]{6}/, message: t('correctCode'), trigger: 'change' }
    ]
  })
  return {
    validateRePass,
    validateEmail,
    ruleslogin,
    rulesRegister
  }
}
