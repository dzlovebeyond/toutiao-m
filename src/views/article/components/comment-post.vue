<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="onPostComment"
      :disabled="!message.length"
    >发布</van-button>
  </div>
</template>

<script>
// 引入 添加评论与回复评论 接口模块
import { addComment } from '@/api/comment'

export default {
  name: 'CommentPost',
  components: {},
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null // 给默认值为null
    }
  },
  props: {
    // 接收父组件传来的 id
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 发布评论
    async onPostComment () {
      try {
        const { data } = await addComment({
          target: this.target, // 评论目标id（文章id或评论id，如果是评论id，下面art_id需要传文章id）
          content: this.message, // 评论内容
          art_id: this.articleId // 对文章评论不用传，对评论进行评论需要传文章id
        })
        // console.log(data)
        // 关闭父组件弹出层、将发布内容更新到列表顶部
        this.$emit('post-success', data.data)
        this.message = '' // 清空文本框
      } catch (err) {
        this.$toast.fail('发布失败，请稍后再试！')
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
