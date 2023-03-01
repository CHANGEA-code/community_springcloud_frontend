<template>
  <div>
    <div class="columns">
      <div class="column is-three-quarters">
        <TopicList></TopicList>
      </div>
      <div class="column">
        <CardBar></CardBar>
      </div>
    </div>
  </div>
</template>

<script>
import CardBar from "@/views/card/CardBar"
import PostList from '@/views/post/Index'

export default {
  name: "Home",
  components: {CardBar, TopicList: PostList},
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
};
</script>
<style scoped>

</style>
