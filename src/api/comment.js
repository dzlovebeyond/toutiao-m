// 评论请求模块

// 引入之前写好的 axios 请求模块
import request from '@/utils/request.js'

// 对外暴露 获取评论列表或评论回复 的接口
export const getComments = params => {
  return request({
    method: 'GET',
    url: 'v1_0/comments',
    params // params: params 的简写
  })
}

// 对外暴露 评论点赞 的接口
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: 'v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 对外暴露 取消评论点赞 的接口
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `v1_0/comment/likings/${target}`
  })
}

// 对外暴露 添加评论或回复评论 的接口
export const addComment = data => {
  return request({
    method: 'POST',
    url: 'v1_0/comments',
    data
  })
}
