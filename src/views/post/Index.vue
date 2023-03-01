<template>
  <div>
    <el-card shadow="never" style="padding: 0; margin: 0">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="最新" name="latest">
            <article
              v-for="(item, index) in articleList"
              :key="index"
              class="media"
            >
              <div class="media-content">
                <div
                  class="level-left has-text-grey mt-2"
                  style="font-size: 13px"
                >
                  <router-link :to="{ path: `/member/${item.author.id}/home` }">
                    {{ item.author.userName }}
                  </router-link>
                  <el-divider direction="vertical"></el-divider>
                  <span>
                    {{ dayjs(item.gmtCreate).format("YYYY年MM月DD日") }}
                  </span>
                </div>
                <div
                  class="blog-title"
                  :class="item.cover == null ? 'mw760' : 'mw620'"
                >
                  <!-- el-tooltip：鼠标悬浮提示 -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.title"
                    placement="top"
                  >
                    <router-link
                      :to="{ name: 'post-detail', params: { id: item.id } }"
                    >
                      <span>{{ item.title }}</span>
                    </router-link>
                  </el-tooltip>
                </div>
                <div
                  class="blog-summary has-text-grey"
                  :class="item.cover == null ? 'mw760' : 'mw620'"
                  style="font-size: 13px"
                >
                  {{ item.content }}
                </div>
                <div
                  class="media-bottom"
                  style="color: #707070; margin-top: 10px"
                >
                  <span
                    class="view el-icon-view"
                    style="padding-right: 4px"
                  ></span>
                  <span style="padding-right: 20px">{{ item.view }}</span>
                  <!-- <span
                    class="zans el-icon-thumb"
                    style="padding-right: 4px"
                  ></span>
                  <span style="padding-right: 20px">{{ item.zans }}</span> -->
                  <span
                    class="comments el-icon-s-comment"
                    style="padding-right: 4px"
                  ></span>
                  <span>{{ item.comments }}</span>
                </div>
              </div>
              <div class="right-img">
                <figure v-if="item.cover">
                  <img :src="item.cover" />
                </figure>
              </div>
            </article>
          </el-tab-pane>
          <el-tab-pane label="热门" name="hot">
            <article
              v-for="(item, index) in articleList"
              :key="index"
              class="media"
            >
              <div class="media-content">
                <div
                  class="level-left has-text-grey mt-2"
                  style="font-size: 13px"
                >
                  <router-link :to="{ path: `/member/${item.author.id}/home` }">
                    {{ item.author.userName }}
                  </router-link>
                  <el-divider direction="vertical"></el-divider>
                  <span>
                    {{ dayjs(item.gmtCreate).format("YYYY年MM月DD日") }}
                  </span>
                </div>
                <div
                  class="blog-title"
                  :class="item.cover == null ? 'mw760' : 'mw620'"
                >
                  <!-- el-tooltip：鼠标悬浮提示 -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.title"
                    placement="top"
                  >
                    <router-link
                      :to="{ name: 'post-detail', params: { id: item.id } }"
                    >
                      <span>{{ item.title }}</span>
                    </router-link>
                  </el-tooltip>
                </div>
                <div
                  class="blog-summary has-text-grey"
                  :class="item.cover == null ? 'mw760' : 'mw620'"
                  style="font-size: 13px"
                >
                  {{ item.content }}
                </div>
                <div
                  class="media-bottom"
                  style="color: #707070; margin-top: 10px"
                >
                  <span
                    class="view el-icon-view"
                    style="padding-right: 4px"
                  ></span>
                  <span style="padding-right: 20px">{{ item.view }}</span>
                  <!-- <span
                    class="zans el-icon-thumb"
                    style="padding-right: 4px"
                  ></span>
                  <span style="padding-right: 20px">{{ item.zans }}</span> -->
                  <span
                    class="comments el-icon-s-comment"
                    style="padding-right: 4px"
                  ></span>
                  <span>{{ item.comments }}</span>
                </div>
              </div>
              <div class="right-img">
                <figure v-if="item.cover">
                  <img :src="item.cover" />
                </figure>
              </div>
            </article>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!--分页-->
      <pagination
        v-show="page.total > 0"
        :total="page.total"
        :page.sync="page.current"
        :limit.sync="page.size"
        @pagination="init"
      />
    </el-card>
  </div>
</template>

<script>
import { getList } from "@/api/post";
import Pagination from "@/components/Pagination";
export default {
  name: "TopicList",
  components: { Pagination },
  data() {
    return {
      activeName: "latest",
      articleList: [],
      tab: "latest",
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getList(this.page.current, this.page.size, this.tab).then((response) => {
        const data = response.data.data;
        this.page.current = data.pageNum;
        this.page.total = data.total;
        this.page.size = data.pageSize;
        this.articleList = data.list;
        //格式化阅读量，评论数
        for (var i = 0; i < this.articleList.length; i++) {
          this.articleList[i].view = this.numFormat(this.articleList[i].view);
          this.articleList[i].comments = this.numFormat(
            this.articleList[i].comments
          );
        }
      });
    },
    numFormat(num) {
      if (num >= 10000) {
        num = Math.round(num / 1000) / 10 + "W+";
      } else if (num >= 1000) {
        num = Math.round(num / 100) / 10 + "K+";
      }
      return num;
    },
    handleClick(tab) {
      this.page.current = 1;
      this.tab = tab.name;
      this.init();
    },
  },
};
</script>

<style scoped>
.right-img {
  width: 155px;
  height: 117px;
  padding: 10px;
}
.right-img img {
  width: 130px;
  height: 97px;
}
.blog-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.blog-summary {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mw760 {
  max-width: 740px;
}
.mw620 {
  max-width: 600px;
}
</style>
