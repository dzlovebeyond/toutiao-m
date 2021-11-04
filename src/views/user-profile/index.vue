<template>
  <div class="user-profile">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /顶部导航栏 -->

    <!-- 用于图片选择的文件输入框，默认隐藏，当点击修改头像时触发 -->
    <!-- ref用于在van中选中dom -->
    <input type="file" hidden ref="file" @change="onFileChange">

    <!-- 个人信息 -->
    <van-cell title="头像" is-link>
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
        @click="$refs.file.click()"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true" />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true" />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNameShow" position="bottom" style="height: 100%">
      <UpdateName v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model="user.name" />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <UpdateGender v-if="isUpdateGenderShow" @close="isUpdateGenderShow = false" v-model="user.gender" />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday v-if="isUpdateBirthdayShow"  @close="isUpdateBirthdayShow = false" v-model="user.birthday" />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height: 100%">
      <UpdatePhoto v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow = false" @updata-photo="user.photo = $event" />
    </van-popup>
    <!-- /编辑头像 -->

  </div>
</template>

<script>
// 引入获取个人资料的接口模块
import { getUserProfile } from '@/api/user.js'
// 引入子组件
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'

export default {
  name: 'UserProfile',
  components: {
    // 注册组件
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data () {
    return {
      user: {}, // 用于存储用户个人资料
      isUpdateNameShow: false, // 控制昵称弹出层的显示
      isUpdateGenderShow: false, // 控制性别弹出层的显示
      isUpdateBirthdayShow: false, // 控制生日弹出层的显示
      isUpdatePhotoShow: false, // 控制头像弹出层的显示
      img: null // 子组件预览的头像图片
    }
  },
  created () {
    // 在此生命周期获取用户个人信息
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast.fail('加载用户资料失败，请稍后再试！')
        console.log(err)
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取 blob 数据，赋值给img，传给子组件
      this.img = window.URL.createObjectURL(file)
      // 显示弹出层
      this.isUpdatePhotoShow = true
      // 清空file-input的value，否则如果两次选择同样的图片，将无法显示弹层，因为没有触发change事件
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang='less' scoped>
.user-profile {
  /deep/ .van-icon {
    color: #ccc;
  }
  .avatar {
    width: 30px;
    height: 30px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
