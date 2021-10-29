<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <!-- 如果 loading 为 true，显示加载中图标 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <!-- 如果 article.title 有值，说明加载成功，显示文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>

          <!-- 关注按钮 -->
          <!-- <van-button
            v-if="article.is_followed"
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
          >关注</van-button> -->

          <!-- 关注功能已经抽离成一个组件，把 is_followed 和 用户id  传给子组件 -->
          <!-- 注意：这里的 $event 就是子组件调用父组件函数时传递的参数 -->
          <!-- <follow-user
            :is-followed="article.is_followed"
            :user-id="article.aut_id"
            class="follow-btn"
            @updata-is_followed="article.is_followed = $event"
          /> -->

          <!--
            当我们给子组件传值时，这个值还需要在子组件中修改的话
            传值：props
              :is-followed="article.is_followed"
            修改：自定义事件
              @updata-is_followed="article.is_followed = $event"

            这种情况下，可以在组件上使用 v-model 进行代码精简
              value="article.is_followed"
              @input="article.is_followed = $event"
           -->
          <follow-user
            v-model="article.is_followed"
            :user-id="article.aut_id"
            class="follow-btn"
          />

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <!-- v-html：用于将带有 html 标签的字符串解析成 html 结构标签再显示 -->
        <!-- ref：是 vue 提供的获取 DOM 元素的方法，这里用于获取 article.content 中的 DOM 图片 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <CommentList
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event"
          @reply-click="onReplyClick"
        />
        <!-- /评论列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >写评论</van-button>
          <van-icon
            name="comment-o"
            :info="totalCommentCount"
            color="#777"
          />
          <!-- 收藏 -->
          <!-- <van-icon
            color="#777"
            name="star-o"
          /> -->
          <collect-atricle v-model="article.is_collected" :article-id="article.art_id" />
          <!-- /收藏 -->
          <!-- 点赞 -->
          <!-- <van-icon
            color="#777"
            name="good-job-o"
          /> -->
          <like-atricle v-model="article.attitude" :article-id="article.art_id" />
          <!-- /点赞 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup
          v-model="isPostShow"
          position="bottom"
        >
          <CommentPost :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
        <!-- /发布评论 -->

      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <!-- 点击重试，重新加载 loadArticle 请求 -->
        <van-button @click="loadArticle" class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 100%"
    >
      <CommentReply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->

  </div>
</template>

<script>
// 引用请求获取文章详情的接口模块
import { getArticleById } from '@/api/article.js'
// vant 中的 imageview 组件与其它组件不同，需要单独加载
import { ImagePreview } from 'vant'
// 引用 关注 组件
import FollowUser from '@/components/follow-user'
// 引入 收藏 组件
import CollectAtricle from '@/components/collect-article'
// 引入 点赞 组件
import LikeAtricle from '@/components/like-article'
// 引入 评论列表 组件
import CommentList from './components/comment-list'
// 引入 写评论 组件
import CommentPost from './components/comment-post'
// 引入 评论的回复 组件
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    // 注册 关注 组件
    FollowUser,
    // 注册 收藏 组件
    CollectAtricle,
    // 注册 点赞 组件
    LikeAtricle,
    // 注册 评论列表 组件
    CommentList,
    // 注册 写评论 组件
    CommentPost,
    // 注册 评论的回复 组件
    CommentReply
  },
  provide: function () {
    // provide 和 inject 用于给所有后代组件传值的用法
    return {
      articleId: this.articleId // 将文章id传给所有后代组件
    }
  },
  props: {
    // 解耦路由中的参数
    articleId: {
      type: [Number, String], // 数据类型可以是两种类型之一
      required: true
    }
  },
  data () {
    return {
      article: {}, // 存储文章详情
      loading: true, // 控制加载状态，true 显示 loading图标，false 隐藏
      errStatus: 0, // 失败状态码，用于判断是404还是其它失败
      totalCommentCount: 0, // 评论总数量
      isPostShow: false, // 写评论 弹出层
      commentList: [], // 评论列表
      isReplyShow: false, // 评论回复 弹出层
      currentComment: {} // 当前点击回复的评论项
    }
  },
  created () {
    // 在此生命周期获取文章内容数据
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      this.loading = true // 每次加载前，先显示 loading 图标
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)

        // 模拟随机请求错误，测试对应页面显示是否正确
        // if (Math.random() > 0.5) {
        //   JSON.parse('aaaaaaaaaaaa') //非JSON格式字符串，转换肯定会报错
        // }

        this.article = data.data // 将获取到的数据存储到文章详情变量中

        // 在请求成功后，并且需要等待一下渲染页面后，再获取 DOM 节点
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          // 把代码逻辑写到一个函数去处理
          this.previewImage()
        }, 0)
      } catch (err) {
        // 如果出现错误，且状态码为404，就为错误状态码赋值
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('获取文章详情失败', err)
      }
      this.loading = false // 加载完成后，无论成功或失败，关闭 loading 图标
    },

    // 自定义一个函数，处理获取 DOM 节点的图片地址
    previewImage () {
      const articleContent = this.$refs['article-content'] // 获取 DOM
      const imgs = articleContent.querySelectorAll('img') // 获取 DOM 中所有 img 标签
      const images = [] // 用于存储图片地址的数组
      // 获取图片地址
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 为每个图片绑定点击事件，调用 vant 组件库中的 ImagePreview 实现预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images: images,
            // 当前位置索引
            startPosition: index
          })
        }
      })
      // console.log(images)
    },
    // 子组件发布完评论后，关闭弹出层、将发布内容更新到列表顶部
    onPostSuccess (data) {
      this.isPostShow = false // 关闭弹出层
      this.commentList.unshift(data.new_obj) // 将发布内容更新到列表顶部
    },
    // 处理评论的回复
    onReplyClick (comment) {
      this.isReplyShow = true // 显示评论回复弹出层
      this.currentComment = comment // 保存当前回复的评论项内容
    }
  }
}
</script>

<style scoped lang="less">
// 引入样式文件
@import "./github-markdown.css";

.article-container {
  /deep/ .van-icon {
    color: #fff;
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 20px;
      padding: 25px 16px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 16px;
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 12px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 11px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }

    .article-content {
      padding: 27px 16px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 100px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 100px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 61px;
      color: #b4b4b4;
    }
    .text {
      font-size: 15px;
      color: #666666;
      margin: 16px 0 24px;
    }
    .retry-btn {
      width: 140px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #c3c3c3;
      font-size: 15px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 8px;
        background-color: #e22829;
      }
    }
  }
}
</style>
