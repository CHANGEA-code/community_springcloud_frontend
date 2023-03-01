<template>
  <header class="header has-background-white has-text-black">
    <b-navbar class="container is-white" :fixed-top="true">
      <template slot="brand">
        <b-navbar-item
          class="is-hidden-desktop"
          tag="router-link"
          :to="{ path: '/' }"
        >
          主页
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          🌐 主页
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <b-field position="is-centered">
            <b-input
              v-model="searchKey"
              class="s_input"
              width="80%"
              placeholder="搜索文章"
              rounded
              clearable
              @keyup.enter.native="search()"
            />

            <p class="control">
              <b-button class="is-info" @click="search()">检索 </b-button>
            </p>
          </b-field>
        </b-navbar-item>

        <b-navbar-item tag="div">
          <b-switch v-model="darkMode" passive-type="is-warning" type="is-dark">
            {{ darkMode ? "夜" : "日" }}
          </b-switch>
        </b-navbar-item>

        <b-navbar-item v-if="token == null || token === ''" tag="div">
          <div class="buttons">
            <b-button
              class="is-light"
              tag="router-link"
              :to="{ path: '/register' }"
            >
              注册
            </b-button>
            <b-button
              class="is-light"
              tag="router-link"
              :to="{ path: '/login' }"
            >
              登录
            </b-button>
          </div>
        </b-navbar-item>
        <b-navbar-item v-else>
          <el-dropdown trigger="click">
            <div class="avatar-div">
              <img
                :src="`https://cravatar.cn/avatar/${user.emailHash}.png?s=164&d=monsterid`"
              />
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{ path: `/member/${user.id}/home` }">
                  🧘 个人中心
                </router-link>
              </el-dropdown-item>
              <hr class="dropdown-divider" />
              <el-dropdown-item>
                <router-link :to="{ path: `/member/${user.id}/setting` }">
                  ⚙ 设置中心
                </router-link>
              </el-dropdown-item>
              <hr class="dropdown-divider" />
              <el-dropdown-item>
                <a @click="logout">👋 退出登录</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </b-navbar-item>
      </template>
    </b-navbar>
  </header>
</template>

<script>
import {
  disable as disableDarkMode,
  enable as enableDarkMode,
} from "darkreader";
import { getDarkMode, setDarkMode } from "@/utils/auth";
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      logoUrl: require("@/assets/logo.png"),
      // doubaoImg: require('@/assets/image/doubao.png'),
      searchKey: "",
      darkMode: false,
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  watch: {
    // 监听Theme模式
    darkMode(val) {
      if (val) {
        enableDarkMode({});
      } else {
        disableDarkMode();
      }
      setDarkMode(this.darkMode);
    },
  },
  created() {
    // 获取cookie中的夜间还是白天模式
    this.darkMode = getDarkMode();
    if (this.darkMode) {
      enableDarkMode({});
    } else {
      disableDarkMode();
    }
  },
  methods: {
    async logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$message.info("退出登录成功");
        setTimeout(() => {
          this.$router.push({ path: this.redirect || "/" });
        }, 500);
      });
    },
    search() {
      if (this.searchKey.trim() === null || this.searchKey.trim() === "") {
        this.$message.info({
          showClose: true,
          message: "请输入关键字搜索！",
          type: "warning",
        });
        return false;
      }
      this.$router.push({ path: "/search?key=" + this.searchKey });
      this.searchKey = "";
    },
  },
};
</script>

<style scoped>
input {
  width: 80%;
  height: 86%;
}
.avatar-div img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.avatar-div {
  /* text-align: center; */
  /* height: ; */
  display: flex;
  align-items: center;
}
.avatar-div div {
  float: left;
}
</style>
