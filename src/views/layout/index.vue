<template>
  <div class="layout-container">
      <!-- 子路由入口 -->
      <router-view />
      <!-- /子路由入口 -->

      <!-- 底部导航栏 TabBar -->
      <!-- active表示被激活的标签（即哪个菜单被选中），主要用于演示效果，当设置route后，激活状态会附路径变化，就可删除active了 -->
      <!-- route表示开启路由，支持为菜单设置路由链接 -->
      <van-tabbar class="layout-tabbar" v-model="active" route>
        <!-- replace to="/home"：表示菜单对应的路由链接，实测replace可省略 -->
        <van-tabbar-item to="/">
            <!-- 通过 vant 提供的插槽，自定义图标 -->
            <i slot="icon" class="heima heima-shouye"></i>
            <span class="text">首页</span>
        </van-tabbar-item>
        <van-tabbar-item to="/qa">
            <i slot="icon" class="heima heima-wenda"></i>
            <span class="text">问答</span>
        </van-tabbar-item>
        <van-tabbar-item to="/video">
            <i slot="icon" class="heima heima-shipin"></i>
            <span class="text">视频</span>
        </van-tabbar-item>
        <van-tabbar-item to="/my">
            <i slot="icon" class="heima heima-wode"></i>
            <!-- 如果已登录显示我的，未登录显示未登录 -->
            <span class="text">{{ $store.state.user ? '我的' : '未登录'}}</span>
        </van-tabbar-item>
      </van-tabbar>
      <!-- /底部导航栏 TabBar -->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
    .layout-tabbar {
        i.heima {
            // 设置底部导航栏字体大小
            font-size: 20px;
        }
        span.text {
            font-size: 10px;
        }
    }
}
</style>
