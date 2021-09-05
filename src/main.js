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

// 全局注册vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
