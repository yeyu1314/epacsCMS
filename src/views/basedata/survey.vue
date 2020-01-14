<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入部位名" v-model="stencilName " clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="conditionList" border style="width: 100%">
        <el-table-column prop="optionName" label="部位" align="center"></el-table-column>
        <el-table-column prop="name" label="模板" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="editClick(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >修改</el-button>
            <el-button @click="del(scope.row)" type="danger" size="small">删除</el-button>
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
      <el-select v-model="part" placeholder="请选择部位" style="width:100%;margin-bottom:20px">
        <el-option v-for="item in partArr" :key="item.id" :label="item.optionName" :value="item.id"></el-option>
      </el-select>
      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="partIntroduction"></el-input>
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
      enit_id: "",
      sign: 0, //用来判断是新增还是修改
      dialogVisible: false,
      changePart: [], //部位信息
      part: "", //获取选中的部位
      partArr: [], //获取已有的部位注入select
      partIntroduction: "", //部位信息介绍
      title: ""
    };
  },
  created() {
    this.getUserList(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      { optionName: this.stencilName }
    );
  },
  methods: {
    //点击新增
    addUser() {
      this.dialogVisible = true;
      this.enit_id = "";
      this.sign = 0;
      this.getPart();
      this.partIntroduction = "";
      this.part = "";
      this.title = "新增模板";
    },
    editClick(row) {
      //修改
      this.dialogVisible = true;
      this.enit_id = row.id;
      this.sign = 1;
      this.getPart();
      this.partIntroduction = row.name;
      this.part = row.optionId;
      this.title = "修改部位信息";
    },
    //确认修改
    ensure() {
      let parameter = {
        name: this.partIntroduction,
        optionId: this.part
      };
      let that = this;
      let url = "";
      if (this.sign == 1) {
        parameter["id"] = this.enit_id;
        url = "admin/SurveyReport/updatePreliminaryTemplet";
      }
      if (this.sign == 0) {
        url = "admin/SurveyReport/addPreliminaryTemplet";
      }
      net.request(url, "post", {}, parameter).then(res => {
        if (res.retcode == 1) {
          this.dialogVisible = false;
          this.$message({
            message: res.retmsg,
            type: "success"
          });
          that.getUserList(
            { pageNo: that.pageNo, pageSize: that.pageSize },
            { optionName: that.stencilName }
          );
        } else {
          this.$message.error(res.retmsg);
        }
      });
    },
    //删除
    del(row) {
      let that = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          net
            .request(
              "admin/SurveyReport/delectPreliminaryTemplet",
              "post",
              { id: row.id },
              {}
            )
            .then(res => {
              if (res.retcode == 1) {
                that.getUserList(
                  { pageNo: that.pageNo, pageSize: that.pageSize },
                  { optionName: that.stencilName }
                );
                this.$message({
                  message: res.retmsg,
                  type: "success"
                });
              } else {
                this.$message.error(res.retmsg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //获取列表数据
    getUserList(param, data) {
      net
        .request("admin/SurveyReport/queryPage", "post", param, data)
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
        { optionName: this.stencilName }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { optionName: this.stencilName }
      );
    },

    search() {
      //查询
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { optionName: this.stencilName }
      );
    },

    //获取部位
    getPart() {
      net.request("admin/select/getOption", "post", {}, {}).then(res => {
        if (res.retcode == 1) {
          this.partArr = res.data;
        } else {
          this.$mount.error(res.retmsg);
        }
      });
    }
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
