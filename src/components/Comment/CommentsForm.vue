<template>
  <article class="media">
    <div class="media-content">
      <form @submit.prevent="onSubmit">
        <b-input
          v-model.lazy="commentText"
          type="textarea"
          maxlength="400"
          placeholder="Add a comment..."
          :disabled="isLoading"
          required
        ></b-input>
        <div class="level-right">
          <b-button
            type="is-primary"
            native-type="submit"
            class="level-item"
            :disabled="isLoading"
          >
            Comment
          </b-button>
        </div>
      </form>
    </div>
  </article>
</template>

<script>
import { pushComment } from "@/api/comment";
import { mapGetters } from "vuex";

export default {
  name: "LvCommentsForm",
  data() {
    return {
      commentText: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  props: {
    slug: {
      type: String,
      default: null,
    },
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        let postData = {};
        postData["content"] = this.commentText;
        postData["topicId"] = this.slug;
        postData["userId"] = this.user.id;
        postData["replyId"] = 0;
        await pushComment(postData);
        this.commentText = "";
        this.$emit("loadComments", this.slug);
        this.$message.success("留言成功");
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
