<template>
  <div class="update-birthday">
    <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择年月日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfirm"
    />
  </div>
</template>

<script>
// 引入修改个人资料的接口模块
import { updateUserProfile } from '@/api/user.js'
// 引入日期转换模块
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    // 接收父组件 v-model 传值
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    // 自定义函数 修改昵称
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // loading状态中，禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: currentDate
        })
        // 更新父组件视图
        this.$emit('input', currentDate)
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
