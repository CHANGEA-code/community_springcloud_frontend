<template>
  <section>
    <el-card shadow="never">
      <div slot="header">个人设置</div>
      <div class="columns">
        <div class="column is-full">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础信息" name="first">
              <el-form ref="firstForm" label-width="100px" :model="userInfo">
                <el-form-item label="账号">
                  <el-input v-model="userInfo.userName" />
                </el-form-item>
                <el-form-item label="简介">
                  <el-input v-model="userInfo.bio" />
                </el-form-item>
                <!-- <el-form-item label="头像">
                <figure class="image is-48x48">
                  <img
                    :src="`https://cn.gravatar.com/avatar/${user.emailHash}?s=164&d=monsterid`"
                  />
                </figure>
              </el-form-item> -->
                <el-form-item
                  prop="email"
                  label="邮箱"
                  :rules="[
                    {
                      required: true,
                      message: '请输入邮箱地址',
                      trigger: 'blur',
                    },
                    {
                      type: 'email',
                      message: '请输入正确的邮箱地址',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <el-input v-model="userInfo.email" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('firstForm')"
                    >提交</el-button
                  >
                  <el-button @click="resetForm('firstForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form
                ref="secondForm"
                label-width="100px"
                class="demo-dynamic"
              >
                <el-form-item label="旧密码">
                  <el-input type="password" v-model="oldPass" />
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input type="password" v-model="newPass" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('secondForm')"
                    >提交</el-button
                  >
                  <el-button @click="resetForm('secondForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import { updatePass, update } from "@/api/user";
import { mapGetters } from "vuex";
import md5 from 'js-md5';
export default {
  name: "Setting",
  data() {
    return {
      activeName: "first",
      labelPosition: "right",
      oldPass:'',
      newPass:'',
      userInfo: {}
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  created() {
    // this.fetchInfo();
    this.userInfo = JSON.parse(JSON.stringify(this.user));
  },
  methods: {
        handleClick(tab, event) {
      console.log(111);
      console.log(tab, event);
    },
    submitForm(formName) {
      if (formName == "firstForm") {
        console.log(this.userInfo);
        //设置emailHash
        this.userInfo.emailHash = md5(this.userInfo.email)
        update(this.userInfo).then((res) => {
          this.$message.success("信息修改成功");
          this.$store.commit("user/SET_USER_STATE", this.userInfo);
        });
      }else {
        console.log(111)
        updatePass(this.userInfo.id, this.oldPass, this.newPass).then(res=>{
          this.$message.success("密码修改成功");
        })
      }
    },
    resetForm(formName) {
      if (formName == "firstForm") {
        this.userInfo = JSON.parse(JSON.stringify(this.user));
      }else {
        this.oldPass = '';
        this.newPass = '';
      }
    },
  },
};
</script>

<style scoped>
</style>
