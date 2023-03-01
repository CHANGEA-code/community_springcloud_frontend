<template>
  <div>
    <article class="media">
      <figure class="media-left image is-48x48" style="margin-top: 6px">
        <img
          :src="`https://cravatar.cn/avatar/${comment.emailHash}.png?s=164&d=monsterid`"
        />
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <span>{{ comment.userName }}</span>
            &nbsp;&nbsp;
            <span class="comment-font">
              <small class="ml-2">{{
                dayjs(comment.createTime).format("YYYY年MM月DD日 HH:MM")
              }}</small>
              <el-divider direction="vertical" />
              <small
                class="reply-btn"
                v-on:click="replyFun(comment.id, comment.userName)"
                >回复</small
              >
              <el-divider v-if="token && user.id === comment.userId" direction="vertical" />
              <small
                class="delete-btn"
                v-on:click="deleteReply(comment.id)"
                v-if="token && user.id === comment.userId"
                >删除</small
              >
            </span>
            <br />
            <span class="content">{{ comment.content }}</span>
          </p>
        </div>
      </div>
    </article>

    <div
      class="sub-comment-div"
      v-for="(item, index) in comment.childs"
      :key="index"
    >
      <figure class="media-left image is-48x48" style="margin-top: 6px">
        <img
          :src="`https://cravatar.cn/avatar/${item.emailHash}.png?s=164&d=monsterid`"
        />
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <span>{{ item.userName }}</span>
            <small class="comment-font"> 回复@ </small>
            <span>{{ item.replyName }}</span>
            &nbsp;&nbsp;
            <span class="comment-font">
              <small class="ml-2">{{
                dayjs(item.createTime).format("YYYY年MM月DD日 HH:MM")
              }}</small>
              <el-divider direction="vertical" />
              <small
                class="reply-btn"
                v-on:click="replyFun(item.id, item.userName)"
                >回复</small
              >
              <el-divider v-if="token && user.id === item.userId" direction="vertical" />
              <small
                class="delete-btn"
                v-on:click="deleteReply(item.id)"
                v-if="token && user.id === item.userId"
                >删除</small
              >
            </span>
            <br />
            <span class="content">{{ item.content }}</span>
          </p>
        </div>
      </div>
    </div>

    <div id="form_div">
      <form v-show="isShow" @submit.prevent="onSubmit">
        <div id="textarea_box">
          <b-input
            ref="reply_textarea"
            v-model="commentText"
            type="textarea"
            maxlength="400"
            :placeholder="'回复@' + replyUsername"
            required
          ></b-input>
        </div>
        <div id="button_box">
          <b-button type="is-primary" native-type="submit" class="level-item">
            Comment
          </b-button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { pushComment, deleteComment } from "@/api/comment";
import { mapGetters } from "vuex";
export default {
  name: "LvCommentsItem",
  components: {},
  computed: {
    ...mapGetters(["token", "user"]),
  },
  data() {
    return {
      isShow: false,
      commentText: "",
      replyId: "",
      replyUsername: "",
    };
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    slug: {
      type: String,
      default: null,
    },
  },
  methods: {
    replyFun(replyId, username) {
      this.replyId = replyId;
      this.replyUsername = username;
      if (this.isShow === true) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
      //焦点定位到评论框
      var reply = this.$refs.reply_textarea;
      //聚焦要放到组件显示之后
      reply.focus();
    },
    deleteReply(commentId) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // type: 'warning'
      })
        .then(() => {
          deleteComment(commentId).then((res) => {
            const { code, message } = res;
            if (code === 20000) this.$emit("loadComments", this.slug);
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async onSubmit() {
      try {
        let postData = {};
        postData["content"] = this.commentText;
        postData["topicId"] = this.slug;
        postData["replyId"] = this.replyId;
        postData["userId"] = this.user.id;
        postData["replyName"] = this.replyUsername;
        await pushComment(postData);
        this.$emit("loadComments", this.slug);
        this.commentText = "";
        this.$message.success("留言成功");
        this.isShow = false;
      } catch (e) {
        this.$buefy.toast.open({
          message: `Cannot comment this story. ${e}`,
          type: "is-danger",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<style scoped>
.sub-comment-div {
  display: flex;
  margin-left: 50px;
  margin-top: 15px;
  padding-top: 5px;
  border-top: #e2e2e2 solid 1px;
}
article {
  margin-top: 15px;
  padding-top: 5px;
  border-top: #e2e2e2 solid 1px;
}
.reply-btn:hover {
  color: #ff6600;
}
.delete-btn:hover {
  color: #ff6600;
}
.content {
  display: block;
  margin-top: 5px;
}
#form_div {
  position: relative;
  padding-left: 50px;
  margin-top: 10px;
}
#textarea_box {
  width: 88%;
  height: 100px;
  display: inline-block;
}
#button_box {
  position: absolute;
  display: inline-block;
  margin-bottom: 20px;
}
figure img {
  border-radius: 50%;
}
.comment-font {
  color: #909399;
}
</style>


