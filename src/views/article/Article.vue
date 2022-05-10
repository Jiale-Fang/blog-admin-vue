<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 文章标题 -->
    <div class="article-title-container">
      <el-input
        v-model="article.title"
        size="medium"
        placeholder="输入文章标题"
      />
      <el-button
        type="danger"
        size="medium"
        class="save-btn"
        @click="saveArticleDraft"
        v-if="article.blogId == null || article.status == 3"
      >
        保存草稿
      </el-button>
      <el-button
        type="danger"
        size="medium"
        @click="openModel"
        style="margin-left:10px"
      >
        发布文章
      </el-button>
    </div>
    <!-- 文章内容 -->
    <mavon-editor
      ref="md"
      v-model="article.content"
      @imgAdd="uploadImg"
      style="height:calc(100vh - 260px)"
    />
    <!-- 添加文章对话框 -->
    <el-dialog :visible.sync="addOrEdit" width="40%" top="3vh">
      <div class="dialog-title-container" slot="title">
        发布文章
      </div>
      <!-- 文章数据 -->
      <el-form label-width="80px" size="medium" :model="article">
        <!-- 文章分类 -->
        <el-form-item label="文章分类">
          <el-tag
            type="success"
            v-show="article.typeName"
            style="margin:0 1rem 0 0"
            :closable="true"
            @close="removeCategory"
          >
            {{ article.typeName }}
          </el-tag>
          <!-- 分类选项 -->
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            v-if="!article.typeName"
          >
            <div class="popover-title">分类</div>
            <!-- 搜索框 -->
            <el-autocomplete
              style="width:100%"
              v-model="typeName"
              :fetch-suggestions="searchCategories"
              placeholder="请输入分类名搜索，enter可添加自定义分类"
              :trigger-on-focus="false"
              @keyup.enter.native="saveCategory"
              @select="handleSelectCategories"
            >
              <template slot-scope="{ item }">
                <div>{{ item.typeName }}</div>
              </template>
            </el-autocomplete>
            <!-- 分类 -->
            <div class="popover-container">
              <div
                v-for="item of typeList"
                :key="item.typeId"
                class="category-item"
                @click="addCategory(item)"
              >
                {{ item.typeName }}
              </div>
            </div>
            <el-button type="success" plain slot="reference" size="small">
              添加分类
            </el-button>
          </el-popover>
        </el-form-item>
        <!-- 文章标签 -->
        <el-form-item label="文章标签">
          <el-tag
            v-for="(item, index) of article.tagNameList"
            :key="index"
            style="margin:0 1rem 0 0"
            :closable="true"
            @close="removeTag(item)"
          >
            {{ item }}
          </el-tag>
          <!-- 标签选项 -->
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            v-if="article.tagNameList.length < 3"
          >
            <div class="popover-title">标签</div>
            <!-- 搜索框 -->
            <el-autocomplete
              style="width:100%"
              v-model="tagName"
              :fetch-suggestions="searchTags"
              placeholder="请输入标签名搜索，enter可添加自定义标签"
              :trigger-on-focus="false"
              @keyup.enter.native="saveTag"
              @select="handleSelectTag"
            >
              <template slot-scope="{ item }">
                <div>{{ item.tagName }}</div>
              </template>
            </el-autocomplete>
            <!-- 标签 -->
            <div class="popover-container">
              <div style="margin-bottom:1rem">添加标签</div>
              <el-tag
                v-for="(item, index) of tagNameList"
                :key="index"
                :class="tagClass(item)"
                @click="addTag(item)"
              >
                {{ item.tagName }}
              </el-tag>
            </div>
            <el-button type="primary" plain slot="reference" size="small">
              添加标签
            </el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="article.copyright" placeholder="请选择类型">
            <el-option
              v-for="item in copyrightList"
              :key="item.copyright"
              :label="item.label"
              :value="item.copyright"
            />
          </el-select>
        </el-form-item>
        <!-- 文章描述 -->
        <el-form-item label="文章描述">
          <el-input
            v-model="article.description"
            size="large"
            placeholder="输入文章描述（不少于十个字）"
          />
        </el-form-item>
        <!-- 文章类型 -->
        <el-form-item label="上传封面">
          <el-upload
            class="upload-cover"
            drag
            action="serverApi/file/articleImage"
            multiple
            :before-upload="beforeUpload"
            :on-success="uploadCover"
          >
            <i class="el-icon-upload" v-if="article.firstPicture == ''" />
            <div class="el-upload__text" v-if="article.firstPicture == ''">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
              v-else
              :src="article.firstPicture"
              width="360px"
              height="180px"
            />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle">
          发 表
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import * as imageConversion from "image-conversion";
export default {
  created() {
    this.initArticle();
  },
  destroyed() {
    //文章自动保存功能
    this.autoSaveArticle();
  },
  data: function() {
    return {
      addOrEdit: false,
      autoSave: true,
      typeName: "",
      tagName: "",
      typeList: [],
      tagNameList: [],
      copyrightList: [
        {
          copyright: 1,
          label: "原创"
        },
        {
          copyright: 2,
          label: "转载"
        },
        {
          copyright: 3,
          label: "翻译"
        }
      ],
      article: {
        blogId: null,
        title: this.$moment(new Date()).format("YYYY-MM-DD"),
        content: "",
        firstPicture: "",
        typeName: null,
        tagNameList: [],
        description: "",
        copyright: "",
        flag: "发布"
        // originalUrl: "",
        // isTop: 0,
        // type: 1,
        // status: 1
      }
    };
  },
  methods: {
    initArticle() {
      const path = this.$route.path;
      const arr = path.split("/");
      const articleId = arr[2];
      if (articleId) {
        this.axios.get("/api/server/blog/" + articleId).then(({ data }) => {
          this.article = data.data;
        });
      } else {
        const article = sessionStorage.getItem("article");
        if (article) {
          this.article = JSON.parse(article);
        }
      }
    },
    listCategories() {
      this.axios.get("/api/server/type/admin/search").then(({ data }) => {
        this.typeList = data.data;
      });
    },
    listTags() {
      this.axios.get("/api/server/tag/admin/search").then(({ data }) => {
        this.tagNameList = data.data;
      });
    },
    openModel() {
      if (this.article.title.trim() == "") {
        this.$message.error("文章标题不能为空");
        return false;
      }
      if (this.article.content.trim() == "") {
        this.$message.error("文章内容不能为空");
        return false;
      }
      this.listCategories();
      this.listTags();
      this.addOrEdit = true;
    },
    uploadCover(response) {
      this.article.firstPicture = response.data.url;
    },
    beforeUpload(file) {
      return new Promise(resolve => {
        if (file.size / 1024 < this.config.UPLOAD_SIZE) {
          resolve(file);
        }
        // 压缩到200KB,这里的200就是要压缩的大小,可自定义
        imageConversion
          .compressAccurately(file, this.config.UPLOAD_SIZE)
          .then(res => {
            resolve(res);
          });
      });
    },
    uploadImg(pos, file) {
      var formdata = new FormData();
      if (file.size / 1024 < this.config.UPLOAD_SIZE) {
        formdata.append("file", file);
        this.axios
          .post("/serverApi/file/articleImage", formdata)
          .then(({ data }) => {
            this.$refs.md.$img2Url(pos, data.data.url);
          });
      } else {
        // 压缩到200KB,这里的200就是要压缩的大小,可自定义
        imageConversion
          .compressAccurately(file, this.config.UPLOAD_SIZE)
          .then(res => {
            formdata.append(
              "file",
              new window.File([res], file.name, { type: file.type })
            );
            this.axios
              .post("/serverApi/file/articleImage", formdata)
              .then(({ data }) => {
                this.$refs.md.$img2Url(pos, data.data.url);
              });
          });
      }
    },
    saveArticleDraft() {
      if (this.article.title.trim() == "") {
        this.$message.error("文章标题不能为空");
        return false;
      }
      if (this.article.content.trim() == "") {
        this.$message.error("文章内容不能为空");
        return false;
      }
      this.article.status = 3;
      this.axios
        .post("/api/server/admin/articles", this.article)
        .then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: "成功",
              message: "保存草稿成功"
            });
          } else {
            this.$notify.error({
              title: "失败",
              message: "保存草稿失败"
            });
          }
        });
      //关闭自动保存功能
      this.autoSave = false;
    },
    saveOrUpdateArticle() {
      if (this.article.title.trim() == "") {
        this.$message.error("文章标题不能为空");
        return false;
      }
      if (this.article.content.trim() == "") {
        this.$message.error("文章内容不能为空");
        return false;
      }
      if (this.article.typeName == null) {
        this.$message.error("文章分类不能为空");
        return false;
      }
      if (this.article.tagNameList.length == 0) {
        this.$message.error("文章标签不能为空");
        return false;
      }
      if (this.article.description.length < 10) {
        this.$message.error("请输入大于十个字的文章描述");
        return false;
      }
      // if (this.article.firstPicture.trim() == "") {
      //   this.$message.error("文章封面不能为空");
      //   return false;
      // }
      this.axios
        .post("/api/server/blog/admin/saveOrUpdate", this.article)
        .then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: "成功",
              message: data.message
            });
            sessionStorage.removeItem("article");
          } else {
            this.$notify.error({
              title: "失败",
              message: data.message
            });
          }
          this.addOrEdit = false;
        });
      //关闭自动保存功能
      this.autoSave = false;
    },
    autoSaveArticle() {
      // 自动上传文章
      if (
        this.autoSave &&
        this.article.title.trim() != "" &&
        this.article.content.trim() != "" &&
        this.article.id != null
      ) {
        this.axios
          .post("/api/server/admin/articles", this.article)
          .then(({ data }) => {
            if (data.flag) {
              this.$notify.success({
                title: "成功",
                message: "自动保存成功"
              });
            } else {
              this.$notify.error({
                title: "失败",
                message: "自动保存失败"
              });
            }
          });
      }
      // 保存本地文章记录
      if (this.autoSave && this.article.id == null) {
        sessionStorage.setItem("article", JSON.stringify(this.article));
      }
    },
    searchCategories(keywords, cb) {
      this.axios
        .get("/api/server/type/admin/search", {
          params: {
            queryString: keywords
          }
        })
        .then(({ data }) => {
          cb(data.data);
        });
    },
    handleSelectCategories(item) {
      this.addCategory({
        typeName: item.typeName
      });
    },
    saveCategory() {
      if (this.typeName.trim() != "") {
        this.addCategory({
          typeName: this.typeName
        });
        this.typeName = "";
      }
    },
    addCategory(item) {
      this.article.typeName = item.typeName;
    },
    removeCategory() {
      this.article.typeName = null;
    },
    searchTags(keywords, cb) {
      this.axios
        .get("/api/server/tag/admin/search", {
          params: {
            queryString: keywords
          }
        })
        .then(({ data }) => {
          cb(data.data);
        });
    },
    handleSelectTag(item) {
      this.addTag({
        tagName: item.tagName
      });
    },
    saveTag() {
      if (this.tagName.trim() != "") {
        this.addTag({
          tagName: this.tagName
        });
        this.tagName = "";
      }
    },
    addTag(item) {
      if (this.article.tagNameList.indexOf(item.tagName) == -1) {
        this.article.tagNameList.push(item.tagName);
      }
    },
    removeTag(item) {
      const index = this.article.tagNameList.indexOf(item);
      this.article.tagNameList.splice(index, 1);
    }
  },
  computed: {
    tagClass() {
      return function(item) {
        const index = this.article.tagNameList.indexOf(item.tagName);
        return index != -1 ? "tag-item-select" : "tag-item";
      };
    }
  }
};
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
</style>
