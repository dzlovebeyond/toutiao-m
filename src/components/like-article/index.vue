<template>
  <van-icon
    :name=" value === 1 ? 'good-job' : 'good-job-o'"
    :color="value === 1 ? '#e5645f' : '#777'"
    :loading="likeLoading"
    @click="onLike"
  />
</template>

<script>
// 引入点赞接口模块
import { addLike, deleteLike } from '@/api/article'

export default {
  name: 'LikeArticle',
  data () {
    return {
      likeLoading: false // 点赞的 loading 状态
    }
  },
  props: {
    // 接收父组件 v-model 传递来的点赞状态
    value: {
      type: Number,
      required: true
    },
    // 接收父组件传来的文章 id
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onLike () {
      // 打开 loading 状态
      this.likeLoading = true
      try {
        if (this.value === 1) {
          // 已点赞状态，取消点赞
          const { data } = await deleteLike(this.articleId)
          console.log(data)
        } else {
          // 未点赞状态，点赞
          const { data } = await addLike(this.articleId)
          console.log(data)
        }
        // 操作接口后，给出成功提示
        this.$toast.success(this.value === 1 ? '取消点赞' : '点赞成功')
        // 更新视图
        // 如果获取到的点赞状态为已点赞 1，上面操作之后应该为 -1
        // 如果获取到的点选状态为未点赞 -1，上面操作之后应该为 1
        this.$emit('input', this.value === 1 ? -1 : 1)
      } catch (err) {
        this.$toast.fail('点赞失败，请稍后再试！')
        console.log(err)
      }
      // 关闭 loading 状态
      this.likeLoading = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
