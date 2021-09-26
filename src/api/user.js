// 用户相关请求模块

// 引入之前写好的 axios 请求模块
import request from '@/utils/request'

// 引入 vuex 中的 state,以便在请求中携带 token
// import store from '@/store'

// 对外暴露用户登录请求方法
export const login = user => {
  return request({
    method: 'POST',
    // url: 'app/v1_0/authorizations',
    url: 'v1_0/authorizations',
    data: user
  })
}

// 对外暴露发送手机验证码的请求方法
export const sendSms = mobile => {
  return request({
    method: 'GET',
    // 在 url 中传递请求参数
    // url: `app/v1_0/sms/codes/${mobile}`
    url: `v1_0/sms/codes/${mobile}`
  })
}

// 对外暴露获取当前登录用户信息的请求方法
export const getUserInfo = () => {
  return request({
    method: 'GET',
    // url: '/app/v1_0/user',
    url: 'v1_0/user'
    // 发送请求头，携带 token
    // headers: {
    // Authorization 为后端提供的名称
    // Bearer 为固定写法，表示持票人，后面空格，再附上 token
    // Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 对外暴露获取用户频道列表的请求方法
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: 'v1_0/user/channels'
  })
}
