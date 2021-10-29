<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
    >
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
// 引入 获取文章列表 接口模块
import { getComments } from '@/api/comment'
// 引入 评论项组件
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    // 注册 评论项组件
    CommentItem
  },
  props: {
    // 接收父组件传来的source id（文章id 或 评论id）
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 接收父元素传来的list，给默认空值，自己也可以使用
    list: {
      type: Array,
      default: () => [] // 默认值为1个空数组，注意不能直接 default: []，语言不允许这里这样写
    },
    // 评论类型
    type: {
      type: String,
      default: 'a' // 默认值a表示文章，c则表示评论
    }
  },
  data () {
    return {
      // list: [], // 评论列表数据
      loading: false, // 评论 loading 状态
      finished: false, // 加载评论完成状态
      offset: null, // 页码
      limit: 10, // 每页条目数
      error: false // 加载失败状态
    }
  },
  created () {
    this.onLoad() // 加载页面时直接调用一次函数，以便在没有看到列表时能够显示评论总数
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求接口获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a表示文章评论，c表示评论的回复
          source: this.source, // 文章id 或 评论id
          offset: this.offset, // 评论偏移量，即页码
          limit: this.limit // 每页条目数
        })
        // 2.将数据添加到列表
        // total_count: totalCount 表示解构 total_count，并重命名为 totalCount
        const { results, total_count: totalCount } = data.data // 将 results 评论数据解构
        this.list.push(...results) // 将 results 原地展开，并追加到 list 评论列表中

        // 把评论总数更新到父组件中
        this.$emit('onload-success', totalCount)

        // 3.将 loading 状态设置为 false
        this.loading = false

        // 4.判断是否还有数据
        if (results.length) {
          // 有则加载下一页数据
          this.offset = data.data.last_id
        } else {
          // 没有就将 finished 设置为结束状态
          this.finished = true
        }
      } catch (err) {
        console.log(err)
        this.error = true // 如果请求失败，设置错误状态为 true
        this.loading = false // 将 loading 状态设置为 false
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
