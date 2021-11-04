<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm" >完成</div>
    </div>
  </div>
</template>

<script>
// 引入 cropperjs CSS和JS
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
// 引入更新头像的接口模块
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  props: {
    // 接收父组件传值
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null // 用于存储裁剪后的图片数据
    }
  },
  mounted () {
    const image = this.$refs.img
    // 配置图片剪切参数
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    onConfirm () {
      // 客户端获取裁切后的文件对象
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // 如果接口要求的 Content-Type 为 application/json（大部分接口是这种类型），则传递普通JS对象
        // updateUserPhoto({
        //   photo: blob
        // })

        // 如果接口要求的 Content-Type 为 multipart/form-data，则传递 FormData对象
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)

        // 更新视图
        console.log(data)
        this.$emit('updata-photo', data.data.photo)
        // 关闭弹出层
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    // 要使用 cropper 必须让 img 为块元素，并且外部需要一个容器包裹，同时还需要img宽度100%
    display: block;
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm {
      width: 45px;
      height: 45px;
      font-size: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
