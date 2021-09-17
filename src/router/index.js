import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由
const routes = [{
  // 登陆页面
  path: '/login',
  name: 'login',
  component: () =>
    import('@/views/login') // 注意：login/后面的index.vue可以省略
},
{
  // Layout布局页面
  path: '/',
  // name: 'layout', // 如果设置了默认子路由，父路由的 name 就没有意义了
  component: () =>
    import('@/views/layout'),
  // 配置 layout 布局页面子路由
  children: [{
    // 首页-页面
    path: '', // 路径为空，表示为默认子路由，只能有1个
    name: 'home',
    component: () =>
      import('@/views/home')
  }, {
    // 问答-页面
    path: '/qa',
    name: 'qa',
    component: () =>
      import('@/views/qa')
  }, {
    // 视频-页面
    path: 'video',
    name: 'video',
    component: () =>
      import('@/views/video')
  }, {
    // 我的-页面
    path: 'my',
    name: 'my',
    component: () =>
      import('@/views/my')
  }]
}
]

const router = new VueRouter({
  routes
})

export default router
