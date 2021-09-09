// 用户相关请求模块

// 引入之前写好的 axios 请求模块
import request from '@/utils/request'

// 对外暴露用户登录请求方法
export const login = user => {
  return request({
    method: 'POST',
    url: 'app/v1_0/authorizations',
    data: user
  })
}

// 对外暴露发送手机验证码的请求方法
export const sendSms = mobile => {
  return request({
    method: 'GET',
    // 在 url 中传递请求参数
    url: `app/v1_0/sms/codes/${mobile}`
  })
}
