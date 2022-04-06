<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openModel(null)"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="linkIdList.length == 0"
        @click="deleteFlag = true"
      >
        批量删除
      </el-button>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入友链名"
          style="width:200px"
          @keyup.enter.native="searchLinks"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchLinks"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      border
      :data="linkList"
      @selection-change="selectionChange"
      v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column
        prop="avatarLink"
        label="链接头像"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <img :src="scope.row.avatarLink" width="40" height="40" />
        </template>
      </el-table-column>
      <el-table-column prop="linkName" label="链接名" align="center" />
      <el-table-column prop="blogLink" label="链接地址" align="center" />
      <el-table-column prop="description" label="链接介绍" align="center" />
      <el-table-column
        prop="status"
        label="是否展示"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="140"
        align="center"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:1rem"
            @confirm="deleteLink(scope.row.linkId)"
          >
            <el-button size="mini" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination-container"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 批量删除对话框 -->
    <el-dialog :visible.sync="deleteFlag" width="30%">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="deleteFlag = false">取 消</el-button>
        <el-button type="primary" @click="deleteLink(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 添加对话框 -->
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div class="dialog-title-container" slot="title" ref="linkTitle" />
      <el-form label-width="80px" size="medium" :model="linkForm">
        <el-form-item label="链接名">
          <el-input style="width:250px" v-model="linkForm.linkName" />
        </el-form-item>
        <el-form-item label="链接头像">
          <el-input style="width:250px" v-model="linkForm.avatarLink" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input style="width:250px" v-model="linkForm.blogLink" />
        </el-form-item>
        <el-form-item label="链接介绍">
          <el-input style="width:250px" v-model="linkForm.description" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  created() {
    this.listLinks();
  },
  data: function() {
    return {
      loading: true,
      deleteFlag: false,
      addOrEdit: false,
      linkIdList: [],
      linkList: [],
      linkForm: {
        linkId: null,
        linkName: "",
        avatarLink: "",
        description: "",
        blogLink: ""
      },
      keywords: null,
      current: 1,
      size: 10,
      count: 0
    };
  },
  methods: {
    selectionChange(linkList) {
      this.linkIdList = [];
      linkList.forEach(item => {
        this.linkIdList.push(item.linkId);
      });
    },
    searchLinks() {
      this.current = 1;
      this.listLinks();
    },
    sizeChange(size) {
      this.size = size;
      this.listLinks();
    },
    currentChange(current) {
      this.current = current;
      this.listLinks();
    },
    changeDisable(link) {
      this.axios.put("/api/server/link/admin/disable", {
        linkId: link.linkId,
        status: link.status
      });
    },
    deleteLink(id) {
      var param = {};
      if (id == null) {
        param = { data: this.linkIdList };
      } else {
        param = { data: [id] };
      }
      this.axios
        .delete("/api/server/link/admin/delete", param)
        .then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: "成功",
              message: data.message
            });
            this.listLinks();
          } else {
            this.$notify.error({
              title: "失败",
              message: data.message
            });
          }
          this.deleteFlag = false;
        });
    },
    openModel(link) {
      if (link != null) {
        this.linkForm = JSON.parse(JSON.stringify(link));
        this.$refs.linkTitle.innerHTML = "修改友链";
      } else {
        this.linkForm.linkId = null;
        this.linkForm.linkName = "";
        this.linkForm.avatarLink = "";
        this.linkForm.description = "";
        this.linkForm.blogLink = "";
        this.$refs.linkTitle.innerHTML = "添加友链";
      }
      this.addOrEdit = true;
    },
    addOrEditCategory() {
      if (this.linkForm.linkName.trim() == "") {
        this.$message.error("友链名不能为空");
        return false;
      }
      if (this.linkForm.avatarLink.trim() == "") {
        this.$message.error("友链头像不能为空");
        return false;
      }
      if (this.linkForm.description.trim() == "") {
        this.$message.error("友链介绍不能为空");
        return false;
      }
      if (this.linkForm.blogLink.trim() == "") {
        this.$message.error("友链地址不能为空");
        return false;
      }
      this.axios
        .post("/api/server/link/admin/saveOrUpdateFriendLink", this.linkForm)
        .then(({ data }) => {
          if (data.flag) {
            this.$notify.success({
              title: "成功",
              message: data.message
            });
            this.listLinks();
          } else {
            this.$notify.error({
              title: "失败",
              message: data.message
            });
          }
          this.addOrEdit = false;
        });
    },
    listLinks() {
      this.axios
        .get("/api/server/link/listLink", {
          params: {
            currentPage: this.current,
            pageSize: this.size,
            queryString: this.keywords
          }
        })
        .then(({ data }) => {
          this.linkList = data.data.records;
          this.count = data.data.total;
          this.loading = false;
        });
    }
  }
};
</script>
