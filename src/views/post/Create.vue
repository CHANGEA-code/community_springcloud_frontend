<template>
  <div class="columns">
    <div class="column is-full">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span><i class="fa fa fa-book"> 主题 / 发布主题</i></span>
        </div>
        <div>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            class="demo-ruleForm"
          >
            <el-form-item prop="title">
              <el-input v-model="ruleForm.title" placeholder="输入主题名称" />
            </el-form-item>

            <!--Markdown-->
            <div id="vditor" />

            <!-- <b-taginput
              v-model="ruleForm.tagId"
              class="my-3"
              maxlength="15"
              maxtags="3"
              ellipsis
              placeholder="请输入主题标签，限制为 15 个字符和 3 个标签"
            /> -->
            <b-select
              id="tag-select"
              v-model="ruleForm.tags"
              style="margin: 20px 0"
              placeholder="请选择主题标签"
            >
              <optgroup
                v-for="(item, index) in tags"
                :key="index"
                :label="item.name"
              >
                <option
                  v-for="(subItem, subIndex) in item.children"
                  :key="subIndex"
                  :value="item.id + ' ' + subItem.id"
                >
                  {{ subItem.name }}
                </option>
              </optgroup>
            </b-select>
            <!-- 封面 -->
            <el-form-item label="文章封面">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-error="handleAvatarError"
                :headers="headers"
                class="avatar-uploader"
                action="http://localhost:8120/admin/oss/file/upload?module=cover"
              >
                <img v-if="ruleForm.cover != undefined" :src="ruleForm.cover" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />  
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即创建
              </el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { post } from "@/api/post";
import { getTags } from "@/api/tag";
import Vditor from "vditor";
import { mapGetters } from "vuex";
import "vditor/dist/index.css";

export default {
  name: "TopicPost",

  computed: {
    ...mapGetters(["token", "user"]),
  },
  data() {
    return {
      headers: {},
      contentEditor: {},
      ruleForm: {
        title: "", // 标题
        content: "", // 内容
      },
      tags: [],
      rules: {
        title: [
          { required: true, message: "请输入话题名称", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.contentEditor = new Vditor("vditor", {
      height: 500,
      placeholder: "此处为话题内容……",
      theme: "classic",
      counter: {
        enable: true,
        type: "markdown",
      },
      preview: {
        delay: 0,
        hljs: {
          style: "monokai",
          lineNumber: true,
        },
      },
      tab: "\t",
      typewriterMode: true,
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      mode: "sv",
    });
    getTags().then((res) => {
      this.tags = res.data.items;
    });
    //上传图片需要添加token
    this.headers.token = this.token;
  },
  methods: {
    submitForm(formName) {
      //获取parentTagId，tagId
      var myselect = document.getElementById("tag-select");
      var index = myselect.selectedIndex;
      var ss = myselect.options[index].value.split(" ");
      var parentTagId = ss[0],
        tagId = ss[1];
      //获取userId
      var userId = this.user.id;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            this.contentEditor.getValue().length === 1 ||
            this.contentEditor.getValue() == null ||
            this.contentEditor.getValue() === ""
          ) {
            alert("话题内容不可为空");
            return false;
          }
          if (parentTagId == null || tagId == null) {
            alert("标签不可以为空");
            return false;
          }
          if (userId == null) {
            alert("用户id不可以为空");
            return false;
          }
          this.ruleForm.parentTagId = parentTagId;
          this.ruleForm.tagId = tagId;
          this.ruleForm.content = this.contentEditor.getValue();
          this.ruleForm.authorId = userId;
          post(this.ruleForm).then((response) => {
            const { data } = response;
            console.log(data)
            setTimeout(() => {
              this.$router.push({
                name: "post-detail",
                params: { id: data.id },
              });
            }, 800);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.contentEditor.setValue("");
      this.ruleForm.tags = "";
    },
    // 上传成功回调
    handleAvatarSuccess(res) {
      console.log(res);
      this.ruleForm.cover = res.data.url;
      // 强制重新渲染
      this.$forceUpdate();
    },
    // 上传校验
    beforeAvatarUpload(file) {
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
