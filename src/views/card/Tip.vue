<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>π₯³ ζ―ζ₯δΈε₯</span>
    </div>
    <div>
      <div class="has-text-left block">
        {{ tip.content }}
      </div>
      <div class="has-text-right mt-5 block">
        ββ{{ tip.author }}
      </div>
    </div>
  </el-card>
</template>

<script>
import {getTodayTip} from '@/api/tip'

export default {
  name: 'Tip',
  data() {
    return {
      tip: {}
    }
  },
  created() {
    this.fetchTodayTip()
  },
  methods: {
    fetchTodayTip() {
      getTodayTip().then(response => {
        const { data } = response
        this.tip = data.tip
      })
    }
  }
}
</script>

<style scoped>

</style>
