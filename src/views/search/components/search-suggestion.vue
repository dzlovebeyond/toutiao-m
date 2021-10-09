<template>
  <div class="search-suggestion">
    <!-- @click="$emit('search', val)"，点击后，子传父，将选中的文本传给父组件 -->
    <van-cell
      v-for="(val, ind) in this.suggesstions"
      :key="ind"
      :title="val"
      @click="$emit('search', val)"
      icon="search"
    >
      <!-- 这里使用 v-html 可以将字符串中的 html 渲染成浏览器样式 -->
      <!-- highlight 是用于将文本替换成带有高亮 html 标签的字符串 -->
      <div slot="title" v-html="highlight(val)"></div>
    </van-cell>
  </div>
</template>

<script>
// 引入请求接口模块方法
import { getSearchSuggestions } from '@/api/search.js'
// 按需引入第三方工具库 Lodash 中的防抖工具
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggesstions: [] // 用于存储接口获取到的联想数据，以便展示到页面中
    }
  },
  props: {
    // 接收父组件传来的输入框内容
    searchInput: {
      type: String,
      required: true
    }
  },
  watch: {
    // 监视输入框内容变化
    searchInput: {
      // handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      // 把上面代码优化防抖后
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true // 该回调将在侦听开始之后立即调用（否则第一个字符不触发）
    }
  },
  methods: {
    // 自定义函数，获取联想建议的方法
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggesstions = data.data.options
        // console.log(data)
        // console.log(this.suggesstions)
      } catch (err) {
        this.$toast('获取联想建议失败，请稍后再试')
      }
    },
    // 自定义函数，将文本替换成带有高亮样式 html 标签的字符串
    highlight (text) {
      if (text) {
        // 定义替换后的内容
        const highlightStr = `<span class="active">${this.searchInput}</span>`
        // 如果需要动态创建正则条件，即正则条件为变量而非字符串时，需要使用 new RegExp
        // RegExp 正则表达式构造函数
        // 参数1：正则条件，支持变量
        // 参数2：正则参数，g为全局匹配多次，i为忽略大小写
        const reg = new RegExp(this.searchInput, 'gi')
        // 将字符串替换成带有 html 标签后，返回
        return text.replace(reg, highlightStr)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  // 搜索结果高亮样式
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
