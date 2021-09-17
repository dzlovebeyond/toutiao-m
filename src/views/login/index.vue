<template>
<!-- 为了便于后续控制组件样式，给根节点（元素）起个类名 login-container -->
  <div class="login-container">
      <!-- 顶部导航栏 -->
      <van-nav-bar class="page-nav-bar" title="登录">
        <!-- 利用插槽，增加一个关闭按钮图标，点击后跳转返回上一页面 -->
        <van-icon slot="left" name="cross" @click="$router.back()" />
      </van-nav-bar>
      <!-- /顶部导航栏 -->

      <!-- 登录表单 -->
      <van-form ref="loginForm" @submit="onSubmit">
        <!-- rules：为表单验证，type:number表示输入类型只能是数字，maxlength表示最大输入字符位数 -->
        <van-field
          v-model="user.mobile"
          name="mobile"
          placeholder="请输入手机号"
          :rules="userFormRules.mobile"
          type="number"
          maxlength="11"
        >
          <!-- vant组件库中的 van-field支持插槽，利用插槽显示图标 -->
          <i slot="left-icon" class="heima heima-shouji"></i>
        </van-field>
        <van-field
          v-model="user.code"
          name="code"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
          type="number"
          maxlength="6"
        >
          <i slot="left-icon" class="heima heima-yanzhengma"></i>
          <!-- 在此插入验证码按钮 -->
          <!-- 注意：native-type="button"可以避免普通按钮触发表单提交 -->
          <template #button>
            <!-- 发送验证码 倒计时 -->
            <!-- 得用 v-if，如果 isCountDownShow 为 true，就显示倒计时，否则显示发送验证码按钮 -->
            <!-- time是设置倒计时时长，1000毫秒 * 10次 -->
            <!-- finish是 CountDown 自带的功能，倒计时结束后自动调用，设置隐藏倒计时并显示发送验证码按钮 -->
            <van-count-down
              v-if="isCountDownShow"
              :time="1000 * 10"
              format="ss 秒"
              @finish="isCountDownShow = false"
            />
            <van-button
              v-else
              class="send-sms-btn"
              round size="small"
              type="default"
              native-type="button"
              @click="onSendSms"
            >发送验证码</van-button>
          </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
        </div>
      </van-form>
      <!-- /登录表单 -->
  </div>
</template>

<script>
// 按需加载 请求用户登录、请求发送验证码 的接口
import { login, sendSms } from '@/api/user.js'

export default {
  // 建议给每个组件都起个名字
  name: 'LoginIndex',
  data () {
    return {
      // user对象用于存储输入框中手机号、验证码
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          // 可以写多个验证规则
          // 正则表达式验证手机号，以13或15或17或18开头，后面9位数据结尾
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          // 验证码为6位数字
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 控制是否显示倒计时，默认不显示
    }
  },
  methods: {
    // 提交登录
    // 因为请求接口是异步操作，所以这里 onSubmit 函数需要使用 async wait 的方式
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证

      // 当表单验证成功后，给出加载提示
      // 在组件中使用 Toast 必须通过 this.$toast 来调用
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 提示信息持续显示时长，默认为2000，即2秒，改成0则表示一直显示，直到遇到下一个toast终止
      })
      // 3.提交表彰请求登录
      // 使用 try catch 的方式捕获异常
      try {
        const res = await login(user)
        console.log('登陆成功', res)
        // 登陆成功后，给出成功提示（同时将终止前面的 toast 加载提示）
        this.$toast.success('登陆成功')
        // 将获取到的数据存储到 vuex 的 state 中
        this.$store.commit('setUser', res.data.data)
        // 登录成功后，跳转回原来的页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // 登陆失败后，给出失败提示（同时将终止前面的 toast 加载提示）
          this.$toast.fail('手机号或验证码错误')
        } else {
          // 登陆失败后，给出失败提示（同时将终止前面的 toast 加载提示）
          this.$toast.fail('未知错误，请稍后重试')
          // 把返回的错误详细信息打印到后台
          console.log(err)
        }
      }
      // 4.根据请求响应结果处理后续操作
    },

    // 发送验证码
    async onSendSms () {
      // 1. 只校验手机号输入框
      // 利用ref属性和validate获取手机号的表单，注意：validate返回的是 promise，所以要使用 async waite
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('校验手机号通过')
      } catch (err) {
        return console.log('校验手机号失败', err)
      }
      // 2. 校验通过后，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        const res = await sendSms(this.user.mobile)
        this.$toast('发送成功')
        console.log(res)
      } catch (err) {
        this.isCountDownShow = false // 发送失败，关闭倒计时
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
          console.log(err)
        } else {
          this.$toast('发送失败，请稍后重试')
          console.log(err)
        }
      }
    }
  }
}
</script>

<style scoped lang=less>
/* 设置输入框图标字体大小 */
.login-container {
  .heima {
    font-size: 18px;
  }
}

/* 设置验证码按钮样式 */
.send-sms-btn {
  background-color: #ededed;
  width: 80px;
  height: 23px;
  line-height: 23px;
  font-size: 12px;
  color: #666;
}

/* 设置登陆按钮外层盒子样式 */
.login-btn-wrap {
  padding: 27px 16px;
}

/* 设置登陆按钮样式 */
.login-btn {
  background-color: #6db4fb;
  border: none;
}
</style>
