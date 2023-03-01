<template>
  <div class="columns">
    <!--文章详情-->
    <div class="column is-three-quarters">
      <!--主题-->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="has-text-centered">
          <h1 class="topic_title">{{ topic.title }}</h1>
          <div id="author_text" class="has-text-grey is-size-6 mt-3">
            <span>{{
              dayjs(topic.updateTime).format("YYYY年MM月DD日 HH:mm")
            }}</span>
            <el-divider direction="vertical" />
            <span>查看 {{ topic.view }}</span>
            <el-divider direction="vertical" />
            <span>评论 {{ topic.comments }}</span>
          </div>
        </div>
        <!-- 封面 -->
        <div v-if="topic.cover" class="cover">
          <img :src="topic.cover" />
        </div>
        <!--Markdown-->
        <div id="preview" />

        <!--标签-->
        <nav class="level has-text-grey is-size-7 mt-6">
          <div class="level-left">
            <p class="level-item">
              <b-taglist>
                <b-tag type="is-info is-light mr-1">
                  {{ "#" + topic.tagName }}
                </b-tag>
              </b-taglist>
            </p>
          </div>
          <div v-if="token && user.id === topic.author.id" class="level-right">
            <router-link
              class="level-item"
              :to="{ name: 'topic-edit', params: { id: topic.id } }"
            >
              <span class="tag">编辑</span>
            </router-link>
            <a class="level-item">
              <span class="tag" @click="handleDelete(topic.id)">删除</span>
            </a>
          </div>
        </nav>
      </el-card>

      <lv-comments :slug="topic.id" />
    </div>

    <div class="column">
      <!--作者-->
      <Author v-if="flag" :author="topic.author" />
      <!--推荐-->
      <recommend v-if="flag" :topic-id="topic.id" :tag-id="topic.tagId" />
    </div>
  </div>
</template>

<script>
import { deleteTopic, getTopic } from "@/api/post";
import { mapGetters } from "vuex";
import Author from "@/views/post/Author";
import Recommend from "@/views/post/Recommend";
import LvComments from "@/components/Comment/Comments";
import Vditor from "vditor";
import "vditor/dist/index.css";

export default {
  name: "Detail",
  components: { Author, Recommend, LvComments },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  data() {
    return {
      flag: false,
      topic: {
        content: "",
        id: this.$route.params.id,
        author: {
          id: "", //不初始化的话会导致读取为空
        },
      },
      tags: [],
      topicUser: {},
    };
  },
  mounted() {
    this.fetchTopic();
  },
  methods: {
    renderMarkdown(md) {
      Vditor.preview(document.getElementById("preview"), md, {
        hljs: { style: "github", enable: true },
      });
    },
    // 初始化
    fetchTopic() {
      getTopic(this.$route.params.id).then((response) => {
        const { data } = response;
        this.topic = data.data;
        this.topic.content = data.data.content;
        this.renderMarkdown(this.topic.content);
        this.flag = true;
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
              this.$router.push({ path: "/" });
            }, 500);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
#preview {
  min-height: 300px;
}
.topic_title {
  font-size: 30px;
  font-weight: bold;
  text-align: left;
  margin-top: 10px;
}
#author_text {
  text-align: left;
}
.cover {
  width: 100%;
  height: 450px;
  text-align: center;
  margin-bottom: 20px;
}
/* 图片等比例缩放 */
.cover img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
