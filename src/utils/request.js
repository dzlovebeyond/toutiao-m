// 请求模块

// 引入 axios
import axios from 'axios'
// 引入 vuex 以便使用其中的 token
import store from '@/store'

// 创建 axios 实例，配置请求基地址
// 使用 request 接收返回值，即返回请求对象
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
  // baseURL: 'http://ttapi.research.itcast.cn/' //老接口地址
  // baseUrl: 'http://toutiao-app.itheima.net/' //备用接口地址
})

// 请求拦截器（如统一设置token，后续配置）
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config：请求配置对象
  // console.log(config)
  // 解构出 vuex 中的 user 对象
  const { user } = store.state
  // 如果 user 有数据，并且有 token，就为请求配置对象添加 token 再发送请求
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里必须将返回 config，否则请求将停在这里
  return config
},
function (error) {
  // 如果请求出错了（还没有真正发出去时），会进入这里
  return Promise.reject(error)
})

// 响应拦截器（如判断错误代码，后续配置）

// 对外暴露请求方法
export default request
