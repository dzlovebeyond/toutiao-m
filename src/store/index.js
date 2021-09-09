import Vue from 'vue'
import Vuex from 'vuex'

// 引入操作本地存储的模块
import { getItem, setItem } from '@/utils/storage.js'

Vue.use(Vuex)

// 定义一个常量，用于本地存储 token 变量名使用
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // user是一个对象，用于存储用户登陆信息、token等数据
    // user: null
    // 从本地存储中获取 token 数据
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    // 创建一个函数，用于修改 user 的信息使用
    setUser (state, date) {
      // 把登陆后获取到的数据存储到 vuex 中 state.user
      state.user = date

      // 同时把数据中的 token 再存储到本地存储中一份
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
