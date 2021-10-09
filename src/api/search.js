// 联想建议（自动补全搜索）请求模块

// 引入之前写好的 axios 请求模块
import request from '@/utils/request'

// 对外暴露联想建议请求方法
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 对外暴露搜索结果的请求方法
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params: params
  })
}
