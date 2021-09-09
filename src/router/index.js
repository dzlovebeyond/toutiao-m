import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由
const routes = [{
  path: '/login',
  name: 'login',
  component: () =>
    import('@/views/login') // 注意：login/后面的index.vue可以省略
}]

const router = new VueRouter({
  routes
})

export default router
