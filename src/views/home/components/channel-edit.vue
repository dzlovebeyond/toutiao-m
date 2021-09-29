<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item v-for="(channel, index) in myChannels" :key="index" class="grid-item" @click="onMyChannelClick(channel, index)">
      <!-- v-show="isEdit && !fiexChannels.includes(channel.id)"：表示isEdit状态为true并且不是固定频道id的时候，显示小差号 -->
      <van-icon v-show="isEdit && !fiexChannels.includes(channel.id)" slot="icon" name="clear"></van-icon>
        <!-- v-bind:class 语法 -->
        <!-- 如果当前 index 值等于 active 的值，就加载 active_style 类名 -->
        <span class="text" :class="{ active_style: index === active }" slot="text">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" class="grid-item" icon="plus" @click="onAddChannel(channel)" />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
// 引入获取所有频道的请求模块、向我的频道添加频道的模块
import { getAllChannels, addUserChannel, delUserChannel } from '@/api/channel'
// 引入 vuex，用于得到用户登陆状态数据
import { mapState } from 'vuex'
// 引入 操作本地存储的 模块
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 用于存储所有频道列表
      isEdit: false, // 用于存储 我的频道 的编辑状态
      fiexChannels: [0] // 不允许删除的固定频道，id号为0不允许删除
    }
  },
  computed: {
    ...mapState(['user']), // 得到 user 用户登陆数据
    recommendChannels () { // 定义计算属性，存储频道推荐数据
      const channels = [] // 用于临时存储频道推荐数据
      // 遍历全部频道，每次与我的频道比较，返回不相交的结果，作为推荐频道数据
      this.allChannels.forEach(channel => {
        // 使用 find 遍历数组，找到满足条件的频道项
        const ret = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        // 如果 ret 为不为真，说明不相交，则收集到推荐频道中
        if (!ret) {
          channels.push(channel)
        }
      })
      // 返回计算结果
      return channels
    }
  },
  created () {
    this.loadAllChannels() // 在页面加载完成的 created 生命周期，获取所有频道列表
  },
  methods: {
    // 自定义函数，用于获取所有频道列表
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道失败，请稍后再试')
      }
    },
    // 自定义函数，删除频道的持久化操作
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登陆，则调用接口，将数据更新到远端服务器
          await delUserChannel(channel.id)
        } else {
          // 未登陆，将数据更新到本地存储
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除频道保存失败，请稍后再试')
      }
    },

    // 自定义函数，用于将 频道推荐中的频道 添加到 我的频道中
    async onAddChannel (channel) {
      // 页面上的效果：将点击的频道 添加到 我的频道中
      this.myChannels.push(channel)

      // 数据持久化操作
      if (this.user) {
        try {
          // 已登陆，把数据通过请求接口存储到 远端服务器上
          await addUserChannel({
            id: channel.id, // 名称需要按接口要求定义，频道id
            seq: this.myChannels.length // 名称需要按接口要求定义，序号
          })
        } catch (err) {
          this.$toast('添加频道保存失败，请稍后再试')
          console.log(err)
        }
      } else {
        // 未登陆，把数据存储到 本地存储
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    // 自定义函数，用于在编辑状态下，点击哪个频道，就删除到 频道推荐中
    onMyChannelClick (channel, index) {
      console.log(channel, index)
      // 一.编辑状态，切换频道（这里指的切换也可以称为删除）
      if (this.isEdit) {
        // 1.如果是固定频道，则直接返回不做任何操作
        if (this.fiexChannels.includes(channel.id)) {
          return
        }

        // 2.删除频道项
        // 页面操作：
        // splice从数组中删除指定索引的元素
        // 参数1：要删除的元素的开始索引号（包括索引号自己）
        // 参数2：删除的个数，如果不指定，则从参数1开始删除到最后
        this.myChannels.splice(index, 1)

        // 3.如果删除的索引在当前激活的索引前面，需要激活索引 - 1，避免激活的索引频道发生变化
        if (index <= this.active) {
          // 最后一个参数 true 是传递弹出层显示状态，true为显示
          this.$emit('update-active', this.active - 1, true)
        }

        // 持久化操作：
        // 这里我们定义一个函数进行删除操作
        this.deleteChannel(channel)
      } else {
        // 二.非编辑状态，跳转到首页面的该频道中
        // 在子组件中调用父组件函数，修改父组件 当前激活频道的索引 index
        // 最后一个参数 false 是传递弹出层显示状态，false为隐藏
        this.$emit('update-active', index, false)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 42px 0;
  .title-text {
    font-size: 16px;
    color: #333;
  }
  .edit-btn {
    width: 52px;
    height: 24px;
    font-size: 13px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 80px;
    height: 43px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
      .active_style {
        color: red;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .van-icon-clear {
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 15px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 14px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
