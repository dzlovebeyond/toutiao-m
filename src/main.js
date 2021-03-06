import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局引入vant组件库，全部加载方式
import Vant from 'vant'

// 全局引入vant样式
import 'vant/lib/index.css'

// 全局引入自定义样式文件
import './styles/index.less'

// 加载 flexible 动态设置 REM 基准值
import 'amfe-flexible'

// 加载 dayjs 初始化配置
import './utils/dayjs'

// 全局注册vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
