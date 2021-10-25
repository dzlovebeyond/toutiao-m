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

// 对外暴露获取文章详情的接口
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

// 对外暴露收藏文章接口
export const addCollect = articleId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target: articleId
    }
  })
}

// 对外暴露取消收藏文章接口
export const deleteCollect = articleId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${articleId}`
  })
}

// 对外暴露点赞文章接口
export const addLike = articleId => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

// 对外暴露取消点赞文章接口
export const deleteLike = articleId => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${articleId}`
  })
}
