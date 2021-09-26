// 引入 vue，为了配置全局过虑器，方便后续调用方法
import Vue from 'vue'

// 引入 Dayjs
import dayjs from 'dayjs'
// 加载处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置国际化-加载中文语言包
import 'dayjs/locale/zh-cn'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 默认语言是英文，这里我们配置成中文
// 全局使用
dayjs.locale('zh-cn')

// 定义一个全局过虑器，然后就可以在任一组件中直接使用了（template中使用，不是JS中使用）
// 过虑器相当于一个全局可用的方法
// 参数1：过虑器名称
// 参数2：过虑器函数
// 使用方法：{{ 表达式 | 过虑器名称 }}
Vue.filter('relativeTime', value => {
  // 返回距离当前时间过去多久，如 1小时前
  return dayjs().to(value)
})
