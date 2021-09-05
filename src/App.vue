<template>
  <div id="app">
    <!-- 路由入口 -->
    <router-view/>
    <h1>黑马头条</h1>
    <!-- 测试字体图标 -->
    <!-- class中是：字体图标类名 样式名 -->
    <i class="heima heima-dianzan2"></i>

    <!-- 测试vant组件库 -->
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>

<script>
export default {
  // 根组件名称（建议每一个组件都给一个name）
  name: 'App'
}
</script>
<style lang="less">
</style>
