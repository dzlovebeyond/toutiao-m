<template>
  <van-cell
    class="article-item"
  >
    <!-- 插槽-标题 -->
    <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    <!-- 插槽-描述 -->
    <div slot="label">
        <!-- 如果有3张图片，就显示在标题下面、描述信息上面 -->
        <div v-if="article.cover.type === 3" class="cover-wrap">
            <div class="cover-item" v-for="(img, ind) in article.cover.images" :key="ind">
                    <van-image
                        fit="cover"
                        class="cover-item-img"
                        :src="img"
                    />
            </div>
        </div>
        <div class="label-info-wrap">
            <span>{{ article.aut_name }}</span>
            <span>{{ article.comm_count }}评论</span>
            <!-- relativeTime：用于处理时间的过虑器，在 utils/dayjs 中定义的 -->
            <span>{{ article.pubdate | relativeTime }}</span>
        </div>
    </div>
    <!-- 插槽-右侧 -->
    <!-- 如果只有1张图片，就显示在右侧 -->
    <van-image
        v-if="article.cover.type === 1"
        slot="default"
        fit="cover"
        class="right-cover"
        :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  data () {
    return {

    }
  },
  props: {
    // 接入一条文章数据对象
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.article-item {
    .title {
        font-size: 16px;
        color: #3a3a3a;
    }
    .van-cell__value {
        flex: unset;
        width: 116px;
        height: 73px;
        padding-left: 12px;
    }
    .right-cover {
        width: 116px;
        height: 73px;
    }
    .label-info-wrap span {
        font-size: 11px;
        color: #b4b4b4;
        margin-right: 12px;
    }
    .cover-wrap {
        display: flex;
        padding: 15px 0;
        .cover-item {
            flex: 1;
            height: 73px;
            // &：选中父亲的孩子，not(:last-child)：不包括最后一个孩子
            &:not(:last-child) {
                padding-right: 2px;
            }
            .cover-item-img {
                width: 100%;
                height: 73px;
            }
        }
    }
}
</style>
