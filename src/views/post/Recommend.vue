<template>
  <el-card class="" shadow="never">
    <div slot="header">
      <span class="has-text-weight-bold">🧐 相关推荐</span>
    </div>
    <div v-if="recommend.length!=0">
      <p  v-for="(item,index) in recommend" :key="index" :title="item.title" class="block ellipsis is-ellipsis-1">
        <router-link :to="{name:'post-detail',params: { id: item.id }}">
          <span class="tag">
            {{ parseInt(index) + 1 }}
          </span>
          {{ item.title }}
        </router-link>
      </p>
    </div>
    <div v-else>暂无相关话题</div>
  </el-card>
</template>

<script>
import { getRecommendTopics } from '@/api/post'

export default {
  name: 'Recommend',
  props: {
    topicId: {
      type: String,
      default: null
    },
    tagId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      recommend: []
    }
  },
  created() {
    console.log(this.tagId)
    this.fetchRecommendTopics()
  },
  methods: {
    fetchRecommendTopics() {
      getRecommendTopics(this.topicId, 5, this.tagId).then(value => {
        const { data } = value
        this.recommend = data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
