<template>
  <div id="userList">
    <div class="searchContent">
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="ueseList" border style="width: 99%">
        <el-table-column prop="groupName" label="集团名" align="center"></el-table-column>
        <el-table-column prop="userName" label="添加人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>
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
        placeholder="请输入集团名"
        v-model="edit_groupName"
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
      ueseList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      createTime: null,
      orignAll: [],
      edit_groupId:"",
      dialogVisible: false,
      edit_groupName: "",
      sign: 0, //用来判断是新增还是修改
      title: "",
      args:"",
    };
  },
  created() {
    this.args = JSON.parse( sessionStorage.getItem("signInfo"));
    this.getUserList(
      { pageNo: this.pageNo, pageSize: this.pageSize }
    );
  },
  methods: {
    //点击新增
    addUser() {
      this.dialogVisible = true;
      this.edit_groupName="";
      this.sign = 0;
    },
    editClick(row) {
      //修改
      console.log(row)
      this.dialogVisible = true;
      this.sign = 1;
      this.edit_groupName = row.groupName;
      this.edit_groupId=row.groupId
    },
    //确认修改
    ensure() {
      var param = {
        groupName: this.edit_groupName,
      };
      let url;
      if (this.sign == 1) {
        url = "admin/group/modGroupInfo";
        param["groupId"]=this.edit_groupId

      }
      if (this.sign == 0) {
        url = "admin/group/addGroupInfo";
      }
      net.request(url, "post",param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          this.getUserList(
            { pageNo: this.pageNo, pageSize: this.pageSize }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getUserList(param) {
      net.request("admin/group/getGroupInfoForPage", "post", param).then(res => {
        if (res.retcode == 1) {
          this.ueseList = res.data.rows;
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
        { pageNo: this.pageNo, pageSize: this.pageSize }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize }
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
