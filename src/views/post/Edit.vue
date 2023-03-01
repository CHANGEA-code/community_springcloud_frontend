<template>
  <section>
    <div class="columns">
      <div class="column is-full">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span><i class="fa fa fa-book"> 主题 / 更新主题</i></span>
          </div>
          <div>
            <el-form :model="topic" ref="topic" class="demo-topic">
              <el-form-item prop="title">
                <el-input
                  v-model="topic.title"
                  placeholder="输入新的主题名称"
                ></el-input>
              </el-form-item>

              <!--Markdown-->
              <div id="vditor"></div>

              <el-form-item label="文章标签" style="margin-top: 20px">
                <!-- 所属分类：级联下拉列表 -->
                <!-- 一级分类 -->
                <el-select
                  v-model="topic.parentTagId"
                  placeholder="请选择"
                  @change="tagChanged"
                >
                  <el-option
                    v-for="tag in parentTagList"
                    :key="tag.id"
                    :label="tag.name"
                    :value="tag.id"
                  />
                </el-select>
                <!-- 二级分类 TODO -->
                <el-select v-model="topic.tagId" placeholder="请选择">
                  <el-option
                    v-for="tag in tagList"
                    :key="tag.id"
                    :label="tag.name"
                    :value="tag.id"
                  />
                </el-select>
              </el-form-item>
              <!-- 封面 -->
              <el-form-item label="文章封面">
                <el-upload
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-error="handleAvatarError"
                  class="avatar-uploader"
                  :headers="headers"
                  action="http://localhost:8120/admin/oss/file/upload?module=cover"
                >
                  <img v-if="topic.cover" :src="topic.cover" />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
              <el-form-item class="mt-3">
                <el-button type="primary" @click="handleUpdate()"
                  >更新
                </el-button>
                <el-button @click="resetForm('topic')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
import { getTopic, update } from "@/api/post";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { getTags } from "@/api/tag";
import { mapGetters } from "vuex";
export default {
  name: "TopicEdit",
  components: {},
  computed: {
    ...mapGetters(["token"]),
  },
  data() {
    return {
      headers: {},
      topic: {
        parentTagId: "",
        tagId: "",
      },
      parentTagList: [], // 第一级标签分类
      tagList: [], // 第二级标签分类
    };
  },
  created() {
    // this.fetchTopic();
    this.initFrom();
    //上传图片需要添加token
    this.headers.token = this.token;
  },
  mounted() {},
  methods: {
    // 初始化表达的数据
    async initFrom() {
      await getTags().then((response) => {
        this.parentTagList = response.data.items;
      });
      if (this.$route.params.id) {
        await getTopic(this.$route.params.id).then((response) => {
          this.topic = response.data.data;
          this.renderMarkdown(response.data.data.content);
        });
      }
      // 设置二级标签列表，由于需要等待获取一级标签列表，因此需要等
      this.parentTagList.forEach((tag) => {
        if (tag.id === this.topic.parentTagId) {
          this.tagList = tag.children;
        }
      });
    },
    renderMarkdown(md) {
      this.contentEditor = new Vditor("vditor", {
        height: 460,
        placeholder: "输入要更新的内容",
        preview: {
          hljs: { style: "monokai" },
        },
        mode: "sv",
        after: () => {
          this.contentEditor.setValue(md);
        },
      });
    },
    fetchTopic() {
      getTopic(this.$route.params.id).then((value) => {
        this.topic = value.data.post;
        // this.topic.tagIds = value.data.tags.map(tag => tag.name);
        this.renderMarkdown(this.topic.content);
      });
    },
    handleUpdate: function () {
      this.topic.content = this.contentEditor.getValue();
      console.log(this.topic);
      this.topic.author = null;
      update(this.topic).then((response) => {
        const { data } = response;
        console.log(data);
        setTimeout(() => {
          this.$router.push({
            name: "post-detail",
            params: { id: this.topic.id },
          });
        }, 800);
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.contentEditor.setValue("");
      this.tags = "";
    },
    tagChanged(value) {
      this.parentTagList.forEach((tag) => {
        if (tag.id === value) {
          console.log(this.topic.tagId)
          this.topic.tagId = "";
          this.tagList = tag.children;
        }
      });
    },
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.topic.cover = res.data.url;
      // 强制重新渲染
      this.$forceUpdate();
    },
    // 上传校验
    beforeAvatarUpload(file) {
      console.log(file);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 文件上传失败（http）
    handleAvatarError() {
      this.$message.error("上传失败! （http失败）");
    },
  },
};
</script>

<style>
.vditor-reset pre > code {
  font-size: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader img {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
