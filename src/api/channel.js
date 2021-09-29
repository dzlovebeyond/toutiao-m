// 频道请求模块

// 引入之前封装好的 axios 请求模块
import request from '@/utils/request.js'

// 对外暴露获取所有频道的接口
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 对外暴露添加 我的频道 请求模块
// 一次添加一个频道
// 接口路径：/v1_0/user/channels，需要携带Body参数（参数类型数组object[]，里面是对象{id、seq}）
export const addUserChannel = channel => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// 对外暴露删除 我的频道 请求模块
// 接口路径：/v1_0/user/channels/:target，需要携带路径参数，直接传值即可
export const delUserChannel = channelId => {
  console.log('delUserChannel-被执行-', channelId)
  return request({
    method: 'DELETE',
    url: `/v1_0/user/channels/${channelId}`
  })
}
