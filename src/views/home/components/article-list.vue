<template>
  <div class="article-list">
      <!-- 下拉刷新组件 -->
      <!-- 当下拉的时候，就会触发 refresh 事件 -->
      <!-- success-text：刷新成功提示文本 -->
      <!-- success-duration：刷新成功提示文本停留时间 -->
      <van-pull-refresh v-model="isRefreshLoading" :success-text="refreshSuccessText" success-duration="1500" @refresh="onRefresh">
        <!-- 文章列表 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
            >
            <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
            <!-- 使用组件展示文章列表项，并将 v-for 循环出的 article 对象传给组件 -->
            <ArticleItem v-for="(article, index) in list" :key="index" :article="article" />
        </van-list>
        <!-- /文章列表 -->
      </van-pull-refresh>
      <!-- /下拉刷新组件 -->
  </div>
</template>

<script>
// 引入获取文章列表的接口
import { getArticles } from '@/api/article'
// 引入文章列表项组件
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    // 注册文章列表项组件
    ArticleItem
  },
  props: { // 父传子方式获取传入参数
    channel: {
      type: Object, // 限制输入类型为对象
      required: true // 必要参数
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制 加载状态
      finished: false, // 控制 加载完成状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制 列表加载失败的提示状态，即加载失败提示 加载失败，点击重新加载
      isRefreshLoading: false, // 控制 下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功' // 下拉成功提示文本
    }
  },
  methods: {
    // load事件：控制 list 列表加载
    // list 初始化后会触发一次 load 事件，用于加载第一屏数据，默认为10条
    // 如果没有铺满屏幕，会再触发一次，直接铺满屏幕或全部加载完成为止
    // onLoad() {
    // // 1.异步请求获取数据
    // // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    // setTimeout(() => {
    //     // 2.把请求获取到的数据放到 list 数组中
    //     for (let i = 0; i < 10; i++) {
    //     this.list.push(this.list.length + 1);
    //     }

    //     // 3.本次加载结束后，要设置加载状态 loading 为 false，即表示本次加载已完成，这样下次才能继续加载
    //     this.loading = false;

    //     // 4.如果数据全部加载完成，需要将 finished 设置为 true，即显示 没有更多数据了，并且不在触发 load 加载事件了
    //     if (this.list.length >= 40) {
    //     this.finished = true;
    //     }
    // }, 1000);
    // },

    // load事件：控制 list 列表加载
    async onLoad () {
      try {
        // 1.异步请求获取数据
        const data = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now() // 如果有时间戳数据，说明不是第一页，使用这个时间戳更新数据；如果没有时间戳数据，说明是第一次获取数据，使用当前时间即可；这里时间戳可以理解成页码（第一次请求传当前时间，后续请求根据获取的数据填充
          // with_top: 1 //是否包含置顶
        })
        // console.log(data)

        // 用于测试加载失败的代码，随机出现错误的代码
        // if (Math.random() > 0.5) {
        //     JSON.parse('aaaaaaaaaa')
        // }

        // 2.把请求获取到的数据放到 list 数组中
        const { results } = data.data.data // 将数据中的 results 解构到原地，相当于直接得到 results 数组
        console.log(results)
        // 使用展开操作符展开数据，将每次获取到的数据追加到 list 数组； ...results：相当于 results[0],results[1],...直到最后一个元素
        this.list.push(...results)

        // 3.本次加载结束后，要设置加载状态 loading 为 false，即表示本次加载已完成，这样下次才能继续加载
        this.loading = false

        // 4.如果数据全部加载完成，需要将 finished 设置为 true，即显示 没有更多数据了，并且不在触发 load 加载事件了
        if (results.length) {
          // 如果还能获取到数据，就更新下获取下一页的时间戳
          this.timestamp = data.data.data.pre_timestamp
        } else {
          // 如果 length 为 0，则表示没有数据了，设置 list 的 finished 为 true；即不加载数据了，并且显示
          this.finished = true
        }
      } catch (err) {
        // console.log('获取文章列表失败，请稍后再试', err)
        // 设置错误提示状态为 true，list列表 会自动显示 加载失败，点击重新加载
        this.error = true
        // 加载失败后，需要设置 loading 状态为 false，否则一直在转
        this.loading = false
      }
    },
    // 下拉刷新事件
    async onRefresh () {
      // console.log('执行了onRefresh')
      try {
        // 1.请求获取数据
        const data = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now() // 下拉刷新要获取的是最新数据，所以时间戳给当前时间
        })

        // 用于测试加载失败的代码，随机出现错误的代码
        // if (Math.random() > 0.5) {
        //     JSON.parse('aaaaaaaaaa')
        // }

        // 2.将获取的数据追加到文章列表 list 的顶部
        const { results } = data.data.data // 解构 data 中的 results 到原地
        this.list.unshift(...results) // 展开 results 到原地，插入到 list 数组最前面
        // 3.关闭下拉刷新的 loding 状态
        this.isRefreshLoading = false
        // 4.更新下拉刷新成功提示文本
        this.refreshSuccessText = `刷新成功，更新了条${results.length}条数据`
      } catch (err) {
        console.log('刷新数据失败，请稍后再试', err)
        // 利用刷新成功提示文本变量，也可以给出错误提示
        this.isRefreshLoading = false // 关闭 loding 状态，否则显示不出来错误提示
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
    height: 79vh;
    overflow-y: auto;
}
</style>
