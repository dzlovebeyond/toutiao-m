<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
      class="serach-btn"
      slot="title"
      type="info"
      size="small"
      round
      icon="search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- /顶部导航栏 -->

    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表组件 -->
        <!-- 注意：需要将频道 id 传递给组件 -->
        <ArticleList :channel="channel" />
        <!-- /文章列表组件 -->
      </van-tab>
      <!-- 右侧占位 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- /右侧占位 -->
      <!-- 右侧汉堡菜单 -->
      <div slot="nav-right" class="hamburger-btn" @click="isChennelEditShow = true">
        <i class="heima heima-gengduo"></i>
      </div>
      <!-- /右侧汉堡菜单 -->
    </van-tabs>
    <!-- /文章频道列表 -->

    <!-- 频道编辑-弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <!-- 使用弹出层内容组件 -->
      <!-- @update-active="onUpdateActive"：监听子组件调用的函数 update-active，用于子组件调用修改当前激活的频道索引号 -->
      <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive" />
    </van-popup>
    <!-- /频道编辑-弹出层 -->
  </div>
</template>

<script>
// 引入获取用户频道列表的接口
import { getUserChannels } from '@/api/user'
// 引入文章列表子组件
import ArticleList from './components/article-list.vue'
// 引入频道编辑-弹出层组件
import ChannelEdit from './components/channel-edit.vue'
// 引入 vuex，用于得到用户登陆状态数据
import { mapState } from 'vuex'
// 引入 操作本地存储的 模块
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    // 注册组件
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 用于存储获取到的用户频道列表数组
      isChennelEditShow: false // 控制 频道编辑-弹出层 的显示与隐藏状态
    }
  },
  computed: {
    ...mapState(['user']) // 得到 user 用户登陆数据
  },
  created () {
    // 在加载页面时，调用函数发起请求，获取用户频道列表数据
    this.loadChannels()
  },
  methods: {
    // 自定义函数，用于获取用户频道列表
    async loadChannels () {
      console.log('loadChannels')
      try {
        let channelsTemp = [] // 用于临时存储频道列表
        if (this.user) {
          console.log('已登陆', this.user)
          // 已登录，通过接口获取用户频道列表
          // { data }：的意思是将获取到的数据中，仅将 data 对象原地解构到这里，便于后续使用
          // 如果这里直接使用 data 接收也可以，后面使用时就要使用 data.data
          const { data } = await getUserChannels()
          // 将获取到的频道列表数据存储到 channelsTemp 数组中
          channelsTemp = data.data.channels
        } else {
          console.log('未登陆')
          // 未登录，判断是否有本地存储
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            // 有，拿来使用
            channelsTemp = localChannels
          } else {
            // 没有，请求默认频道列表
            // 注意：这里的接口和上面获取用户的接口相同，原因是该接口如果是未登陆用户访问，就直接返回默认频道列表
            const { data } = await getUserChannels()
            channelsTemp = data.data.channels
          }
        }
        this.channels = channelsTemp
      } catch (err) {
        this.$toast('获取用户频道列表失败，请稍后再试')
      }
    },
    // 为子组件修改 当前激活索引号 的方法
    onUpdateActive (index, isShow = true) {
      this.active = index // 修改 当前激活索引号
      this.isChennelEditShow = isShow // 关闭弹出层
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  // 让出顶部导航栏和频道列表的位置
  padding-top: 87px;
  // 让出底部导航栏的位置，否则会被底部导航栏遮挡
  padding-bottom: 50px;
  // 搜索框样式
  // /deep/：表示深度操作符，在 style 使用的 scoped 属性时，有时操作样式不管用时使用
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .serach-btn {
    width: 278px;
    height: 32px;
    background: #5babfb;
    border: none;
    font-size: 14px;
      .van-icon {
        color: #fff;
        font-size: 16px;
      }
  }

  // 文章频道列表样式
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 46px;
      left: 0;
      right: 0;
      height: 41px;
      z-index: 1;
    }

    .van-tab {
      min-width: 100px;
      border-right: 1px solid #edeff3;
      font-size: 15px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 4px;
      width: 16px !important;
      background-color: #3296fa;
    }
    // 配合设置汉堡按钮下方占位符
    .van-tabs__nav--complete {
      padding-right: 0;
    }
    // 设置汉堡按钮下方占位符
    .placeholder {
      flex-shrink: 0;
      width: 33px;
      height: 41px;
    }
    // 设置汉堡按钮样式
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 33px;
      height: 41px;
      background-color: #fff;
      opacity: 0.902;
      i {
        font-size: 17px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>
