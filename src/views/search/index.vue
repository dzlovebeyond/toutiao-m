<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!-- 注意：在 van-search 外层使用 form，且 action 不为空（任意值均可），是为了让手机端显示搜索按键，否则手机端没有这个按键 -->
    <!-- show-action：用于显示取消按钮，如果点了，就触发 @cancel 事件 -->
    <!-- @search：电脑端回车触发搜索函数，手机端点击搜索键触发搜索函数 -->
    <!-- @focus="isResultShow：当输入框再次获取焦点时，隐藏搜索结果，显示联想结果 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /顶部搜索栏 -->

    <!-- 搜索结果 -->
    <!-- isResultShow：根据变量，展示或隐藏搜索结果 -->
    <SearchResult v-if="isResultShow" :searchInput="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <!-- searchText：如果上面isResultShow不为真，则判断本行，输入框如果有文字，则展示联想建议 -->
    <!-- @search：接收子组件的调用，点击哪个选项，就把内容值进来 -->
    <SearchSuggestion v-else-if="searchText" :searchInput="searchText" @search="onSearch" />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <!-- v-else：如果上面2个条件都不成立，则显示历史记录 -->
    <!-- @clear-search-histories="searchHistories = []"：响应子组件清空历史记录的需求 -->
    <SearchHistory v-else :searchHistories="searchHistories" @clear-search-histories="searchHistories = []" @search="onSearch" />
    <!-- /历史记录 -->

  </div>
</template>

<script>
// 引用组件
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
// 引入本地存储的操作方法
import { setItem, getItem } from '@/utils/storage.js'

export default {
  name: 'SearchIndex',
  components: {
    // 注册组件
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      // 用于存放搜索历史记录，初始化时从本地存储拿数据，并使用 || 防止本地存储中无数据时报错，如果本地存储无数据，则赋值成空数据 []
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  watch: {
    // 持久化：监视搜索历史记录变量变化，并将更新后的数据存储到本地存储：
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  methods: {
    onSearch (val) {
      this.searchText = val // 用选择的文本替换搜索框中的内容

      // 存储搜索历史记录，要求：数据不重复、最新的排在最前面
      // 获取重复数据的索引，indexOf，如果有重复就会返回索引，没有重复就会返回 -1
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 如果索引值不是 -1，说明有重复，则删除老数据，后面加添加新数据
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val) // 将数据插入到数据最前面

      this.isResultShow = true // 设置变量，让搜索框下方展示搜索结果
    },
    onCancel () {
      // 点击取消，退回到上一页面
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  // 上内边距
  padding-top: 54px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    // 搜索栏固定定位
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
