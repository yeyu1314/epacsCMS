<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入维修站名" v-model="userName " clearable></el-input>
      <el-input placeholder="请输入联系电话" v-model="phone " clearable></el-input>
      <el-input placeholder="请输入角色名" v-model="roleName " clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="ueseList" border style="width: 100%">
        <el-table-column prop="orgName" label="维修站名" align="center"></el-table-column>
        <el-table-column prop="nickName" label=" 检测中心" align="center"></el-table-column>
        <el-table-column prop="userName" label="检测中心用户名" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="roleNickName" label="角色权限" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
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
        placeholder="请输入维修站用户昵称"
        v-model="edit_usernick"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入检测中心用户名"
        v-model="edit_username"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入联系电话"
        v-model="edit_userphone"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入密码"
        v-model="edit_password"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
        v-show="isShowMiMaInput"
      ></el-input>
      <el-select
        v-model="selectRole"
        clearable
        placeholder="请选择角色"
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option v-for="item in roleAll" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="selectOrign"
        clearable
        placeholder="请选择维修站"
        v-show="isOrgUser"
        filterable
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option v-for="item in orignAll" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      ueseList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      userName: null,
      phone: null,
      roleName: null,
      selectRole: "", //角色选择
      roleAll: [],
      selectOrign: "", //维修站选择
      orignAll: [],
      dialogVisible: false,
      edit_usernick: "",
      edit_username: "",
      edit_userphone: "",
      enit_id: "",
      edit_password: "",
      isShowMiMaInput: false,
      sign: 0, //用来判断是新增还是修改
      title: "",
      isOrgUser:true,//是否能选择维修站
      args:"",
    };
  },
  created() {
    this.args = JSON.parse( sessionStorage.getItem("signInfo"));
    this.getUserList(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      { userName: this.userName, phone: this.phone, roleName: this.roleName }
    );
  },
  methods: {
    //点击新增
    addUser() {
      this.getAllRole();
      this.getAllorgin();
      this.dialogVisible = true;
      this.edit_usernick = "";
      this.edit_username = "";
      this.edit_userphone = "";
      this.enit_id = "";
      this.selectRole = "";
      this.selectOrign = "";
      this.sign = 0;
      this.isShowMiMaInput = true;
      this.title = "新增维修站用户";
       if(this.args.orgId == null){
        this.isOrgUser = true;
      }else{
        this.isOrgUser = false;
      }
    },
    editClick(row) {
      //修改
       if(this.args.orgId == null){
        this.isOrgUser = true;
      }else{
        this.isOrgUser = false;
      }
      this.getAllRole(() => {
        this.selectRole = row.roleId;
      });
      this.getAllorgin(() => {
        this.selectOrign = row.orgId;
      });
      this.dialogVisible = true;
      this.edit_usernick = row.nickName;
      this.edit_username = row.userName;
      this.edit_userphone = row.phone;
      this.enit_id = row.id;
      this.sign = 1;
      this.isShowMiMaInput = false;
      this.title = "修改维修站用户";
    },
    //确认修改
    ensure() {
      let param = {
        roleId: this.selectRole,
        userName: this.edit_username,
        nickName: this.edit_usernick,
        phone: this.edit_userphone,
        type: 3
      };
      if(this.args.orgId == null){
        param["orgId"] = this.selectOrign;
      }else{
        param["orgId"] = this.args.orgId;
      }
      let url;
      if (this.sign == 1) {
        url = "admin/orgUser/updateUser";
        param["id"] = this.enit_id;
      }
      if (this.sign == 0) {
        url = "admin/orgUser/addUser";
        param["passWord"] = this.edit_password;
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          this.getUserList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            {
              userName: this.userName,
              phone: this.phone,
              roleName: this.roleName
            }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getUserList(param, data) {
      net.request("admin/orgUser/queryPage", "post", param, data).then(res => {
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
        { userName: this.userName, phone: this.phone, roleName: this.roleName }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { userName: this.userName, phone: this.phone, roleName: this.roleName }
      );
    },

    search() {
      //查询
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { userName: this.userName, phone: this.phone, roleName: this.roleName }
      );
    },
    //获取所有角色信息
    getAllRole(callback) {
      callback = callback || function() {};
      net.request("admin/role/queryList", "post", {}).then(res => {
        if (res.retcode == 1) {
          var data = res.data;
            var list = [];
            for (var i = 0; i < data.length; i++) {
              if(data[i].id == 3 || data[i].id == 4){
                list.push(data[i]);
              }
            }
          this.roleAll =list;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
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
