<template>
  <section id="author">
    <el-card class="" shadow="never">
      <div slot="header">
        <span class="has-text-weight-bold">👨‍💻 关于作者</span>
      </div>
      <div class="has-text-centered">
        <p class="is-size-5 mb-5">
          <router-link :to="{ path: `/member/${author.id}/home` }">
            {{ author.userName }}
            <!-- <span class="is-size-7 has-text-grey">{{ '@' + user.userName }}</span> -->
          </router-link>
        </p>
        <div class="columns is-mobile">
          <div class="column is-half">
            <code>{{ author.postNum == null ? 0 : author.postNum }}</code>
            <p>文章</p>
          </div>
          <div class="column is-half">
            <code>{{ author.fansNum == null ? 0 : author.fansNum }}</code>
            <p>粉丝</p>
          </div>
        </div>
        <div>
          <button
            v-if="hasFollow"
            class="button is-success button-center is-fullwidth"
            @click="handleUnFollow(user.id, author.id)"
          >
            已关注
          </button>
          <button
            v-else
            class="button is-link button-center is-fullwidth"
            @click="handleFollow(user.id, author.id)"
            :disabled="user.id==author.id"
          >
            关注
          </button>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import { follow, unFollow, isFollow } from "@/api/follow";
import { mapGetters } from "vuex";
export default {
  name: "Author",
  props: {
    author: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      hasFollow: false,
    };
  },
  mounted() {
    isFollow(this.user.id, this.author.id).then(res => {
      const {data} = res;
      this.hasFollow = data.isFollow;
    })
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  methods: {
    handleFollow: function (userId, authorId) {
      if (this.token != null && this.token !== "") {
        follow(userId, authorId).then((response) => {
          console.log(response);
          const { message } = response;
          this.$message.success(message);
          this.hasFollow = !this.hasFollow;
          this.author.fansNum = parseInt(this.author.fansNum) + 1;
        });
      } else {
        this.$message.success("请先登录");
      }
    },
    handleUnFollow: function (userId, authorId) {
      unFollow(userId, authorId).then((response) => {
        const { message } = response;
        this.$message.success(message);
        this.hasFollow = !this.hasFollow;
        this.author.fansNum = parseInt(this.author.fansNum) - 1;
      });
    },
  },
};
</script>

<style scoped>
</style>
