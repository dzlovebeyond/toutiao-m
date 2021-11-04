<template>
  <div class="update-gender">
    <van-picker
    title="设置性别"
    show-toolbar
    :columns="columns"
    :default-index="value"
    @cancel="$emit('close')"
    @confirm="onConfirm"
    @change="onPickerChange"
    />
</div>
</template>

<script>
// 引入修改个人资料的接口模块
import { updateUserProfile } from '@/api/user.js'

export default {
  name: 'UpdateGender',
  props: {
    // 接收父组件 v-model 传值
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'], // 下拉选项列表内容
      localGender: this.value // 用于存储性别对应的值，0男、1女
    }
  },
  methods: {
    // 监听选项被修改的事件，用于获取选项内容
    onPickerChange (picker, value, index) {
      this.localGender = index
    },
    // 自定义函数 修改昵称
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // loading状态中，禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender
        })
        // 更新父组件视图
        this.$emit('input', localGender)
        // 关闭弹出层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
