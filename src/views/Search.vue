<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        检索到 <code>{{ list.length }}</code> 条关于
        <code class="has-text-info">{{ query.keyword }}</code> 的记录
      </div>
      <div>
        <article v-for="(item, index) in list" :key="index" class="media">
          <div class="media-content">
            <div class="level-left has-text-grey mt-2" style="font-size: 13px">
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
            <div class="media-bottom" style="color: #707070; margin-top: 10px">
              <span class="view el-icon-view" style="padding-right: 4px"></span>
              <span style="padding-right: 20px">{{ item.view }}</span>
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
      </div>

      <!--分页-->
      <pagination
        v-show="query.total > 0"
        :total="query.total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="fetchList"
      />
    </el-card>
  </div>
</template>

<script>
import { searchByKeyword } from "@/api/search";
import Pagination from "@/components/Pagination";

export default {
  name: "Search",
  components: { Pagination },
  data() {
    return {
      list: [],
      query: {
        keyword: this.$route.query.key,
        pageNum: 0,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      searchByKeyword(this.query).then((value) => {
        const data = value.data.data;
        this.list = data.list;
        this.query.total = data.total;
        this.query.pageSize = data.pageSize;
        this.query.pageNum = data.pageNum;
      });
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
  max-width: 1000px;
}
.mw620 {
  max-width: 800px;
}
</style>
