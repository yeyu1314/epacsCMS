<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入维修站名" v-model="orgName" clearable></el-input>
      <el-input placeholder="请输入姓名" v-model="engineerName" clearable></el-input>
      <el-input placeholder="请输入联系电话" v-model="phone" clearable></el-input>
	  <el-select v-model="type" placeholder="选择岗位名称" clearable style="margin-right:15px;">
        <el-option label="全部" value="0"></el-option>
        <el-option label="拆装技师" value="1"></el-option>
        <el-option label="检测工程师" value="2"></el-option>
        <el-option label="跟单员" value="3"></el-option>
        <el-option label="治疗技师" value="4"></el-option>
      </el-select>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="ueseList" border style="width: 99%">
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="orgName" label="维修站名" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="chaiZhuang" label="拆装技师" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.chaiZhuang==1?"启用":""}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jianCe" label="检测工程师" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.jianCe==1?"启用":""}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="genDan" label="跟单员" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.genDan==1?"启用":""}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zhiLiao" label="治疗技师" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.zhiLiao==1?"启用":""}}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="editClick(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >修改</el-button>
            <!-- <el-button
              @click="editDisable(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >{{scope.row.type == 1 ? "启用" : "禁用"}}</el-button>-->
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
      <div style="display:flex;flex-direction: column;justify-content: center;">
        <el-input
          placeholder="请输入姓名"
          v-model="edit_engineerName"
          style="margin:0 0 15px 60px;width:280px;"
          clearable
        ></el-input>
        <el-checkbox-group
          v-model="edit_chaiZhuang"
          style="margin:0 0 15px 60px;width:280px;text-align:left"
        >
          <el-checkbox label="拆装技师"></el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group
          v-model="edit_jianCe"
          style="margin:0 0 15px 60px;width:280px;text-align:left"
        >
          <el-checkbox label="检测工程师"></el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group
          v-model="edit_genDan"
          style="margin:0 0 15px 60px;width:280px;text-align:left"
        >
          <el-checkbox label="跟单员"></el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group
          v-model="edit_zhiLiao"
          style="margin:0 0 15px 60px;width:280px;text-align:left"
        >
          <el-checkbox label="治疗技师"></el-checkbox>
        </el-checkbox-group>
        <el-input
          placeholder="请输入联系电话"
          v-model="edit_userphone"
          style="margin:0 0 15px 60px;width:280px;"
          clearable
        ></el-input>
        <el-select
          v-model="selectOrign"
          clearable
          placeholder="请选择维修站"
          filterable
          style="margin:0 0 15px 60px;width:280px;"
        >
          <el-option v-for="item in orignAll" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
        </el-select>
      </div>

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
      orgName: null,
	  type: null,
      phone: null,
      engineerName: null,
      selectOrign: "", //维修站选择
      orignAll: [],
      dialogVisible: false,
      edit_engineerName: "",
      edit_chaiZhuang: "",
      edit_jianCe: "",
      edit_genDan: "",
      edit_zhiLiao: "",
      edit_userphone: "",
      edit_orgName: "",
      enit_id: "",
      sign: 0, //用来判断是新增还是修改
      title: "",
      args: ""
    };
  },
  created() {
    this.args = JSON.parse(sessionStorage.getItem("signInfo"));
    this.getUserList({ pageNo: this.pageNo, pageSize: this.pageSize }, {});
  },
  methods: {
    //点击新增
    addUser() {
      this.getAllorgin();
      this.dialogVisible = true;
      this.edit_engineerName = "";
      this.edit_orgName = "";
      this.edit_userphone = "";
      this.enit_id = "";
      this.selectOrign = "";
      this.sign = 0;
      this.title = "新增 工程师";
      this.edit_chaiZhuang = false;
      this.edit_jianCe = false;
      this.edit_genDan = false;
      this.edit_zhiLiao = false;
    },
    editClick(row) {
      //修改
      this.getAllorgin(() => {
        this.selectOrign = row.orgId;
      });
      this.dialogVisible = true;
      this.edit_engineerName = row.name;
      this.edit_orgName = row.orgName;
      this.edit_userphone = row.phone;
      this.enit_id = row.id;
      this.sign = 1;
      this.title = "修改 工程师信息";
      this.edit_chaiZhuang = row.chaiZhuang == 1 ? true : false;
      this.edit_jianCe = row.jianCe == 1 ? true : false;
      this.edit_genDan = row.genDan == 1 ? true : false;
      this.edit_zhiLiao = row.zhiLiao == 1 ? true : false;
    },
    editDisable(row) {
      //启用禁用
      net
        .request("admin/engineer/prohibitEngineer", "post", { id: row.id }, {})
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            this.getUserList(
              { pageNo: this.pageNo, pageSize: this.pageSize },
              {
                orgName: this.orgName,
                phone: this.phone,
                type: this.type,
                name: this.engineerName
              }
            );
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //确认修改
    ensure() {
      var param = {
        name: this.edit_engineerName,
        orgId: this.selectOrign,
        phone: this.edit_userphone,
        chaiZhuang: this.edit_chaiZhuang == true ? 1 : 0,
        jianCe: this.edit_jianCe == true ? 1 : 0,
        genDan: this.edit_genDan == true ? 1 : 0,
        zhiLiao: this.edit_zhiLiao == true ? 1 : 0
      };
      let url;
      if (this.sign == 1) {
        url = "admin/engineer/updateEngineer";
        param["id"] = this.enit_id;
      }
      if (this.sign == 0) {
        url = "admin/engineer/addEngineer";
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          this.getUserList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            {
              orgName: this.orgName,
              phone: this.phone,
                type: this.type,
              name: this.engineerName
            }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getUserList(param, data) {
      net.request("admin/engineer/queryPage", "post", param, data).then(res => {
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
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, phone: this.phone,
                type: this.type, name: this.engineerName }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, phone: this.phone,
                type: this.type, name: this.engineerName }
      );
    },

    search() {
      //查询
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, phone: this.phone, 
                type: this.type,name: this.engineerName }
      );
    },
    //获取所有维修站信息
    getAllorgin(callback) {
      callback = callback || function() {};
      net
        .request("admin/Organization/getOrganizationAll", "post", {})
        .then(res => {
          if (res.retcode == 1) {
            this.orignAll = res.data;
            callback();
          } else {
            net.message(this, "获取数据失败", "warning");
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
