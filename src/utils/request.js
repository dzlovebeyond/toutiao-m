// 请求模块

// 引入 axios
import axios from 'axios'

// 创建 axios 实例，配置请求基地址
// 使用 request 接收返回值，即返回请求对象
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
  // baseUrl: 'http://toutiao-app.itheima.net/' //备用接口地址
})

// 请求拦截器（如统一设置token，后续配置）
// 响应拦截器（如判断错误代码，后续配置）

// 对外暴露请求方法
export default request
