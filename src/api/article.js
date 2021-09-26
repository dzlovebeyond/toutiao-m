// 文章相关请求模块

// 引入之前写好的 axios 请求模块
import request from '@/utils/request.js'

// 对外暴露获取文章列表的接口
export const getArticles = params => {
  return request({
    method: 'GET',
    url: 'v1_0/articles',
    params // params: params 的简写
  })
}
