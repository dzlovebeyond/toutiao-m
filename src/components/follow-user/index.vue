<template>
<van-button
    v-if="value"
    class="follow-btn"
    round
    size="small"
    :loading="followLoading"
    @click="onFllow"
    >已关注</van-button>
    <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="followLoading"
    @click="onFllow"
    >关注</van-button>
</template>

<script>
// 引用 关注/取消关注 接口模块
import { addFollow, deleteFollow } from '@/api/user.js'

export default {
  name: 'FollowUser', // 组件名
  props: {
    // 接收父组件传值，关注状态
    value: {
      type: Boolean,
      required: true
    },
    // 接收父组件传值，用户id
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      followLoading: false // 控制 关注/已关注 loading状态
    }
  },
  methods: {
    // 自定义函数，处理 关注 / 取消关注
    async onFllow () {
      try {
        this.followLoading = true // 显示 loading 状态
        if (this.value) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
        } else {
          // 未关注，添加关注
          await addFollow(this.userId)
        }
        // 更新页面中的关注状态，修改父组件中的 is_followed
        // this.$emit('updata-is_followed', !this.value)

        // 在父组件上使用 v-model 后，自动坚听的事件是 input
        this.$emit('input', !this.value)
      } catch (err) {
        let errMessage = '操作失败，请稍后重试！'
        if (err.response && err.response.status === 400) {
          // 如果错误码为400，表示自己关注自己错误
          errMessage = '你不能自己关注自己！'
        }
        this.$toast(errMessage)
        console.log(err)
      }
      // 无论请求成功还是失败，都要关闭 loading 状态
      this.followLoading = false
    }
  }
}
</script>

<style>

</style>
