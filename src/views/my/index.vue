<template>
  <div class="my-container">
    <!-- 顶部-已登录（显示用户信息） -->
    <!-- v-if="user"：如果user不为空，则表示已登陆，则显示已登录内容 -->
    <div v-if="user" class="header user-info">
      <!-- 基础信息 -->
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑按钮</van-button>
        </div>
      </div>
      <!-- /基础信息 -->
      <!-- 统计信息 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
      <!-- /统计信息 -->
    </div>
    <!-- /顶部-已登录（显示用户信息） -->

    <!-- 顶部-未登录（显示登陆/注册按钮） -->
    <!-- v-else：如果user为空，表示未登录，显示未登录内容 -->
    <div v-else class="header not-login">
      <!-- @click="$router.push('/login')"：点击跳转路由链接 -->
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /顶部-未登录（显示登陆/注册按钮） -->

    <!-- 宫格导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <!-- 利用插槽 使用自定义图标和文字 -->
        <i slot="icon" class="heima heima-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="heima heima-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <!-- 消息通知、小智、退出 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <!-- v-if="user"：如果已登录状态，则显示退出按钮 -->
    <!-- clickable：表示显示点击效果 -->
    <van-cell v-if="user" title="退出登录" class="layout-cell" clickable @click="onLogout" />
    <!-- /消息通知、小智、退出 -->

  </div>
</template>

<script>
// vuex 辅助函数用法，通过引入 vuex 的 mapState 获取 State 数据
import { mapState } from 'vuex'
// 引入请求当前登录账号的用户信息
import { getUserInfo } from '@/api/user.js'

export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {} // 用于存储当前用户信息
    }
  },
  computed: {
    // 将 mapState 解构到原地，以便获取 vuex 中的 State 数据，即获取登陆信息
    ...mapState(['user'])
  },
  created () {
    // 在页面初始化完成阶段，请求加载用户信息数据
    if (this.user) { // 如果 user 不为空，则表示已登录状态，则加载用户信息
      this.loadUserInfo()
    }
  },
  methods: {
    onLogout () {
      // 确认退出提示信息
      // 注意：在组件中使用 vant 函数，需要 把 Dialog 改成 this.$dialog
      this.$dialog.confirm({
        title: '是否确认退出？'
      })
        .then(() => {
          // 清除登陆状态
          // 调用 vuex 中 mutations 的方法，将 setUser 置空，即当前无登陆状态
          // 同时，在 setUser 方法中，会把 user 的值更新到本地存储，即本地存储中也没有登陆状态了
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消-退出登录')
        })
    },

    async loadUserInfo () {
      // 加载用户信息
      try {
        // 使用 api 接口 getUserInfo 获取用户信息，并将信息中的 data 解构到原地
        const { data } = await getUserInfo()
        // 将获取到的信息赋值给 userInfo
        // console.log(data)
        this.userInfo = data.data
      } catch (err) {
        // 如果获取失败，则显示提示信息
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  // 顶部基本样式
  .header {
    // @表示 src 的路径位置，但在 css 中需要加一个 ~ 才能正常引用
    background-image: url("~@/assets/banner.png");
    background-size: cover;
  }

  // 未登录相关样式
  .not-login {
    // flex布局，水平垂直居中
    display: flex;
    justify-content: center;
    align-items: center;
    height: 180px;
    .login-btn {
      // flex布局，纵向排列，水平垂直居中
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 66px;
        height: 66px;
        margin-bottom: 8px;
      }
      .text {
        font-size: 14px;
        color: #fff;
      }
    }
  }

  // 已登录相关样式
  .user-info {
    .base-info {
      // flex布局，两端对齐，垂直居中
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 115px;
      padding: 38px 16px 11px;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 66px;
          height: 66px;
          margin-right: 12px;
          border: 2px solid #fff;
        }
        .name {
          font-size: 15px;
          color: #fff;
        }
      }
    }
    .data-stats {
      // flex布局，子元素设置 flex:1 平分父元素宽度
      display: flex;
      height: 65px;
      .data-item {
        height: 100%;
        flex: 1;
        // flex布局，垂直排列，水平垂直居中
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 12px;
        }
      }
    }
  }

  // 宫格导航
  .grid-nav {
    .grid-item {
      height: 70px;
      i.heima {
        font-size: 22px;
      }
      .heima-shoucang {
        color: #eb5253;
      }
      span.text {
        font-size: 14px;
      }
      .heima-lishi {
        color: #ff9d1d;
      }
    }
  }

  // 消息通知、小智、退出 相关样式
  .layout-cell {
    margin-top: 9px;
    text-align: center;
    color: #d86262;
  }
}
</style>
