<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <van-button
        class="like-btn"
        :class="{ liked: comment.is_liking }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="commentLoading"
        @click="onCommentLike"
      >
        {{ comment.like_count > 0 ? comment.like_count : '赞' }}
      </van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | relativeTime }}</span>
        <van-button
          class="reply-btn"
          round
          @click="$emit('reply-click', comment)"
        >回复 {{ comment.reply_count }}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
// 引入评论点赞 和 取消评论点赞 接口模块
import { addCommentLike, deleteCommentLike } from '@/api/comment.js'

export default {
  name: 'CommentItem',
  components: {},
  props: {
    // 接收父组件传来的数据
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      commentLoading: false // 评论点赞 loading 状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCommentLike () {
      this.commentLoading = true // 打开 loading 状态显示
      try {
        if (this.comment.is_liking) {
          // 已点赞，取消点赞
          await deleteCommentLike(this.comment.com_id)
          this.comment.like_count-- // 仅为更新视图，点赞数量-1
        } else {
          // 未点赞，点赞
          await addCommentLike(this.comment.com_id)
          this.comment.like_count++ // 仅为更新视图，点赞数量+1
        }
        this.comment.is_liking = !this.comment.is_liking // 仅为更新视图，点赞状态取反
      } catch (err) {
        this.$toast.fail('评论点赞失败，请稍后重试')
        console.log(err)
      }
      this.commentLoading = false // 关闭 loading 状态显示
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 13px;
    }
  }
  .comment-content {
    font-size: 16px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 10px;
    color: #222;
    margin-right: 12px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 67px;
    height: 24px;
    line-height: 24px;
    font-size: 10px;
    color: #222;
  }
  .like-btn {
    height: 15px;
    padding: 0;
    border: none;
    font-size: 10px;
    line-height: 15px;
    margin-right: 3px;
    .van-icon {
      font-size: 15px;
      color: #e5645f;
    }
    &.liked {
      color: #e5645f;
    }
  }
}
</style>
