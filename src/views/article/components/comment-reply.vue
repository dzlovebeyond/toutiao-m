<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>

    <!-- 正文滚动区域 -->
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment" />
      <!-- /当前评论项 -->

      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <CommentList :list="commentList" :source="comment.com_id" type="c" />
      <!-- /评论的回复列表 -->
    </div>
    <!-- /正文滚动区域 -->

    <!-- 写评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true">
        写评论
      </van-button>
    </div>
    <!-- /写评论 -->

    <!-- 发布评论 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <CommentPost :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->

  </div>
</template>

<script>
// 引入 评论项 组件
import CommentItem from './comment-item'
// 引入 评论列表 组件
import CommentList from './comment-list'
// 引入 评论列表 组件
import CommentPost from './comment-post'

export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false, // 发布评论弹出层控制
      commentList: [] // 评论的回复列表
    }
  },
  components: {
    // 注册组件
    CommentItem,
    CommentList,
    CommentPost
  },
  methods: {
    onPostSuccess (data) {
      this.comment.reply_count++ // 更新回复的数据
      this.isPostShow = false // 关闭弹层
      this.commentList.unshift(data.new_obj) // 将最新回复的内容更新到列表，用于显示最新回复
    }
  }
}
</script>

<style scoped lang="less">
.comment-reply {
    .scroll-wrap {
        position: fixed;
        top: 46px;
        left: 0;
        right: 0;
        bottom: 44px;
        overflow-y: auto;
    }
    .van-icon {
        color: blue !important;
    }
    .post-wrap {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border-top: 1px solid #d8d8d8;
        .post-btn {
            width: 60%;
        }
    }
}
</style>
