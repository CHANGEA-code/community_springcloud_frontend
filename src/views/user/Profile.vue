<template>
  <div class="member">
    <div class="columns">
      <div class="column is-one-quarter">
        <el-card shadow="never">
          <div slot="header" class="has-text-centered">
            <el-avatar
              :size="64"
              :src="`https://cravatar.cn/avatar/${author.emailHash}?s=164&d=monsterid`"
            />
            <!-- <p class="mt-3">{{ user.userName }}</p>  -->
          </div>
          <div>
            <p class="content">
              账号：<code>{{ author.userName }}</code>
            </p>
            <p class="content">
              入驻：{{ dayjs(author.gmtCreate).format("YYYY年MM月DD日 HH:MM") }}
            </p>
            <p class="content">
              简介：{{ author.bio == null ? "暂无" : author.bio }}
            </p>
            <p class="content">邮箱：{{ author.email }}</p>
          </div>
        </el-card>
      </div>

      <div class="column">
        <!--用户发布的话题-->
        <el-card class="box-card content">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              :label="user.id == author.id ? '我的文章' : 'ta的文章'"
              name="first"
            >
              <div v-if="topics.length === 0">暂无文章</div>
              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in topics"
                  :key="index"
                  class="media"
                >
                  <div class="media-content">
                    <div class="content ellipsis is-ellipsis-1">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.title"
                        placement="top"
                      >
                        <router-link
                          :to="{ name: 'post-detail', params: { id: item.id } }"
                        >
                          {{ item.title }}
                        </router-link>
                      </el-tooltip>
                    </div>
                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          发布于:{{
                            dayjs(item.gmtCreate).format("YYYY年MM月DD日 HH:mm")
                          }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <div v-if="token" class="media-right">
                    <div v-if="author.id === user.id" class="level">
                      <div class="level-item mr-1">
                        <router-link
                          :to="{ name: 'topic-edit', params: { id: item.id } }"
                        >
                          <span class="tag is-warning">编辑</span>
                        </router-link>
                      </div>
                      <div class="level-item">
                        <a @click="handleDelete(item.id)">
                          <span class="tag is-danger">删除</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              <!--分页-->
              <pagination
                v-show="page.total > 0"
                class="mt-5"
                :total="page.total"
                :page.sync="page.current"
                :limit.sync="page.size"
                @pagination="fetchPostByUserId"
              />
            </el-tab-pane>
            <el-tab-pane
              :label="user.id == author.id ? '我的关注' : 'ta的关注'"
              name="second"
            >
              <div v-if="followed.length === 0">暂无关注</div>
              <div v-else>
                <article
                  v-for="(item, index) in followed"
                  :key="index"
                  class="media"
                >
                  <div class="media-left">
                    <img
                      class="image is-48x48"
                      :src="`https://cravatar.cn/avatar/${item.emailHash}?s=164&d=monsterid`"
                      style="border-radius: 5px"
                    />
                  </div>
                  <div class="media-content">
                    <router-link :to="{ path: `/member/${item.id}/home` }">
                      {{ item.userName }}
                    </router-link>
                    <div style="margin-top: 5px">
                      {{ item.bio }}
                    </div>
                  </div>
                  <div class="media-right" v-if="author.id === user.id">
                    <div class="level-item">
                      <a @click="cancelFollow(user.id, item.id)">
                        <span class="tag is-danger">取消关注</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </el-tab-pane>
            <el-tab-pane
              :label="user.id == author.id ? '我的粉丝' : 'ta的粉丝'"
              name="third"
            >
              <div v-if="fans.length === 0">暂无粉丝</div>
              <div v-else>
                <article
                  v-for="(item, index) in fans"
                  :key="index"
                  class="media"
                >
                  <div class="media-left">
                    <img
                      class="image is-48x48"
                      :src="`https://cravatar.cn/avatar/${item.emailHash}?s=164&d=monsterid`"
                      style="border-radius: 5px"
                    />
                  </div>
                  <div class="media-content">
                    <div class="content">
                      <router-link :to="{ path: `/member/${item.id}/home` }">
                        {{ item.userName }}
                      </router-link>
                      <div style="margin-top: 5px">
                        {{ item.bio }}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index";
import { mapGetters } from "vuex";
import { deleteTopic, pageByUserId } from "@/api/post";
import { getById } from "@/api/user";
import { getFans, getFollowed, unFollow } from "@/api/follow";
export default {
  name: "Profile",
  components: { pagination },
  data() {
    return {
      author: {},
      activeName: "first",
      topics: {},
      followed: {}, //关注的人
      fans: {}, //我的粉丝
      page: {
        current: 1,
        size: 5,
        total: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  created() {
    this.fetchPostByUserId();
    this.fetchUserById();
  },
  methods: {
    handleClick(tab) {
      var tabName = tab.name;
      if (tabName == "second") {
        getFollowed(this.author.id).then((res) => {
          const { data } = res;
          this.followed = data.data;
        });
      } else if (tabName == "third") {
        getFans(this.author.id).then((res) => {
          const { data } = res;
          this.fans = data.data;
        });
      }
    },
    fetchPostByUserId() {
      pageByUserId(
        this.$route.params.userId,
        this.page.current,
        this.page.size
      ).then((res) => {
        const { data } = res;
        this.page.current = data.data.current;
        this.page.size = data.data.size;
        this.page.total = data.data.total;
        this.topics = data.data.list;
      });
    },
    fetchUserById() {
      getById(this.$route.params.userId).then((res) => {
        const { data } = res;
        this.author = data.user;
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          deleteTopic(id).then((value) => {
            const { message } = value;
            this.$message({
              type: "success",
              message: message,
            });
            setTimeout(() => {
              this.fetchPostByUserId();
            }, 100);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    cancelFollow(userId, authorId) {
      unFollow(userId, authorId).then((response) => {
        const { message } = response;
        this.$message.success(message);
        getFollowed(this.author.id).then((res) => {
          const { data } = res;
          this.followed = data.data;
        });
      });
    },
  },
};
</script>

<style scoped>
</style>
