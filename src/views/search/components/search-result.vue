<template>
  <div class="search-result">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync="error"
    error-text="加载失败，请点击重试"
    @load="onLoad"
    >
    <van-cell v-for="(article, index) in list" :key="index" :title="article.title" :to="'article/'+article.art_id" />
    </van-list>
  </div>
</template>

<script>
// 引入用于获取搜索结果的接口模块
import { getSearchResult } from '@/api/search.js'

export default {
  name: 'SearchResult',
  props: {
    // 接收父传子数据，文本框输入的内容
    searchInput: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      isResultShow: false, // 控制搜索结果的展示
      page: 1, // 页码
      error: false // 控制加载失败状态
    }
  },
  methods: {
    async onLoad () {
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //     }

      //     // 加载状态结束
      //     this.loading = false

      //     // 数据全部加载完成
      //     if (this.list.length >= 40) {
      //     this.finished = true
      //     }
      // }, 1000)

      try {
        // 1.请求接口获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: 20, // 每页行数
          q: this.searchInput // 查询关键词
        })
        // console.log(data)

        // 用于测试加载失败的随机出错代码
        // if (Math.random() > 0.5) {
        //     JSON.parse('sdfsdfsf')
        // }

        // 2.将数据添加到数组列表
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载的 loading 关闭
        this.loading = false
        // 4.判断是否还有数据
        //   有，则更新页码；无，则将加载状态 finished 设置为结束状态
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true // 控制加载失败状态，以便在最下方显示"加载失败，点击重试"
        this.loading = false // 加载失败了，也要关闭 loading 状态
        this.$toast('获取搜索结果失败，请稍后再试')
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
