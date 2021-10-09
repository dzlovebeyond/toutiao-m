<template>
  <div class="search-history">
      <van-cell title="搜索历史">
          <div v-if="isDeleteShow">
            <!-- <span @click="searchHistories = []">全部删除</span> //这样清空无意义，因为props数据不能重新赋值 -->
            <!-- 调用父组件方法清空数据 -->
            <span @click="$emit('clear-search-histories')">全部删除</span>
            &nbsp;&nbsp;
            <span @click="isDeleteShow = false">完成</span>
          </div>
          <van-icon v-else name="delete" @click="isDeleteShow = true" />
      </van-cell>
      <van-cell v-for="(item, index) in searchHistories" :key="index" :title="item" @click="onSearchItemClick(item, index)">
          <van-icon v-if="isDeleteShow" name="close" />
      </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    // 注意：props数据
    // 如果是普通数据，如字符串、数字、布尔等，绝对不能修改，即使修改也不会传导给父组件的原始数据，修改无意义
    // 如果是引入类型数据，如数组、对象等，可以修改，如.push等，但不能重新赋值，如 aaa = []

    // 接入父组件传来的搜索历史记录数据
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 用于存储删除状态
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 如果是删除状态，删除当前索引的历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 如果是非删除状态，调用父组件中的方法，转到搜索结果
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
