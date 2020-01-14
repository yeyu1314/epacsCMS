<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入车况名" v-model="stencilName " clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="conditionList" border style="width: 99%">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="stencilName" label="车况名" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="editClick(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="420px">
      <!-- :before-close="handleClose" -->
      <el-input
        placeholder="请输入车况名"
        v-model="edit_carnick"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      conditionList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      stencilName: null,
      edit_carnick: "",
      enit_id: "",
      sign: 0, //用来判断是新增还是修改
      dialogVisible: false,
      title:""
    };
  },
  created() {
    this.getUserList(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      { stencilName: this.stencilName }
    );
  },
  methods: {
    //点击新增
    addUser() {
      this.dialogVisible = true;
      this.edit_carnick = "";
      this.enit_id = "";
      this.sign = 0;
      this.title = "新增模板"
    },
    editClick(row) {
      //修改
      this.dialogVisible = true;
      this.edit_carnick = row.stencilName;
      this.enit_id = row.id;
      this.sign = 1;
      this.title = "修改模板"
    },
    //确认修改
    ensure() {
      let param = {
        stencilName: this.edit_carnick
      };
      let url;
      if (this.sign == 1) {
        url = "admin/carStencil/updateCarStencil";
        param["id"] = this.enit_id;
      }
      if (this.sign == 0) {
        url = "admin/carStencil/addCarStencil";
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          this.getUserList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            {stencilName: this.stencilName}
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getUserList(param, data) {
      net
        .request("admin/carStencil/queryPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.conditionList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    // 定义表格样式
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
         {stencilName: this.stencilName}
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {stencilName: this.stencilName}
      );
    },

    search() {
      //查询
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {stencilName: this.stencilName}
      );
    },
  }
};
</script>
<style lang="less" scoped>
#userList {
  display: flex;
  flex-direction: column;
  .searchContent {
    margin: 10px 0 20px 0;
    display: flex;
    flex-direction: row;
    .el-input--suffix {
      width: 200px;
      margin-right: 20px;
    }
  }
  .pagination {
    position: relative;
    margin-top: 20px;
    .el-pagination {
      position: absolute;
      left: 0px;
    }
    .number .active {
      background: #009688 !important;
    }
  }
}
</style>
