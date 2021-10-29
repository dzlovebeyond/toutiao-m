<template>
  <van-icon
    :name=" value ? 'star' : 'star-o'"
    :color="value ? '#ffa500' : '#777'"
    :loading="collectLoading"
    @click="onCollect"
  />
</template>

<script>
// 引入收藏、取消收藏接口模块
import { addCollect, deleteCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  data () {
    return {
      // 存储 点击收藏时 是否显示 loding 状态
      collectLoading: false
    }
  },
  props: {
    // 接收父组件使用 v-mode 传递的收藏状态数据，默认使用 value 接收
    value: {
      type: Boolean,
      required: true
    },
    // 接收父组件传来的文章 id
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    // 自定义函数，处理添加收藏与取消收藏
    async onCollect () {
      // 显示 loding 状态
      this.collectLoading = true
      try {
        if (this.value) {
          // 已收藏状态，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏状态，添加收藏
          await addCollect(this.articleId)
        }
        // 修改后台收藏状态后，更新视图
        // 调用父组件 v-model 默认事件 input，更新父组件 article.is_collected 状态为原状态的取反操作
        this.$emit('input', !this.value)
        // 给出成功提示
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败，请重复！')
        console.log(err)
      }
      // 关闭 loading 状态
      this.collectLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
