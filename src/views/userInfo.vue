<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入 用户名" v-model="userName" clearable></el-input>
      <el-input placeholder="请输入 所属部门" v-model="nickName" clearable></el-input>
      <el-input placeholder="请输入 电话号码" v-model="phone" clearable></el-input>
      <el-input placeholder="请输入 角色权限" v-model="roleNickName" clearable></el-input>
      <el-input placeholder="请输入 角色名" v-model="roleName" clearable></el-input>
      <el-select v-model="type" placeholder="请选择用户类型" clearable style="margin-right:15px;">
        <el-option label="全部" value="0"></el-option>
        <el-option label="后台用户" value="1"></el-option>
        <el-option label="app用户" value="2"></el-option>
        <el-option label="维修站用户" value="3"></el-option>
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
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column prop="nickName" label="所属部门" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="roleNickName" label="角色权限" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
        <el-table-column prop="type" label="用户类型" align="center">
          <template slot-scope="scope">{{scope.row.type | utype}}</template>
        </el-table-column>
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
        placeholder="请输入用户名"
        v-model="edit_username"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入所属部门"
        v-model="edit_usernick"
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
        v-model="selectType"
        clearable
        placeholder="请选择用户类型"
        style="margin:0 0 15px 0px;width:280px;"
        @change="userTypeChange"
      >
        <el-option v-for="item in userType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="selectRole"
        clearable
        placeholder="请选择角色"
        style="margin:0 0 15px 0px;width:280px;"
        @change="roleTypeChange"
      >
        <el-option v-for="item in roleAll" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="selectOrign"
        clearable
        filterable
        placeholder="请选择维修站"
        style="margin:0 0 15px 0px;width:280px;"
        v-show="showOrg"
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
      userName: "",
      nickName: "",
      phone: "",
      roleName: "",
      roleNickName: "",
      selectRole: "", //角色选择
      roleAll: [],
      selectOrign: "", //维修站选择
      orignAll: [],
      selectType: "",
      dialogVisible: false,
      edit_usernick: "",
      edit_username: "",
      edit_userphone: "",
      enit_id: "",
      edit_password: "",
      isShowMiMaInput: false,
      userType: [
        { id: 1, name: "后台用户" },
        { id: 2, name: "APP用户" },
        { id: 3, name: "维修站用户" }
      ],
      sign: 0, //用来判断是新增还是修改
      showOrg: true,
      title: "",
      type: ""
    };
  },
  created() {
    this.getUserList(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      {
        userName: this.userName,
        nickName: this.nickName,
        phone: this.phone,
        roleName: this.roleName,
        roleNickName: this.roleNickName,
        type: this.type
      }
    );
  },
  filters: {
    utype(d) {
      var str = "";
      if (d == 1) {
        str = "后台用户";
      }
      if (d == 2) {
        str = "APP用户";
      }
      if (d == 3) {
        str = "维修站用户";
      }
      return str;
    }
  },
  methods: {
    //点击新增
    addUser() {
      this.title = "新增用户信息";
      this.getAllorgin();
      this.dialogVisible = true;
      this.edit_usernick = "";
      this.edit_username = "";
      this.edit_userphone = "";
      this.enit_id = "";
      this.selectRole = "";
      this.selectOrign = "";
      this.selectType = "";
      this.sign = 0;
      this.isShowMiMaInput = true;
      this.edit_password = "";
      this.roleAll = [];
      this.orignAll = [];
    },
    editClick(row) {
      //修改
      this.title = "修改用户信息";
      this.getAllRole(row.type, () => {
        this.selectRole = row.roleId;
      });
      this.getAllorgin(() => {
        this.selectOrign = row.orgId;
      });
      if (row.type == 1) {
        this.showOrg = false;
      } else {
        this.showOrg = true;
      }
      this.roleAll = [];
      this.orignAll = [];
      this.dialogVisible = true;
      this.edit_usernick = row.nickName;
      this.edit_username = row.userName;
      this.edit_userphone = row.phone;
      this.enit_id = row.id;
      this.selectType = row.type;
      this.sign = 1;
      this.isShowMiMaInput = false;
    },
    //确认修改
    ensure() {
      if (this.selectType == 3 || this.selectType == 2) {
        if (this.selectOrign == "") {
          net.message(this, "请选择维修站", "error");
          return false;
        }
      }
      let param = {
        roleId: this.selectRole,
        userName: this.edit_username,
        nickName: this.edit_usernick,
        phone: this.edit_userphone,
        orgId: this.selectOrign,
        type: this.selectType
      };
      let url;
      if (this.sign == 1) {
        url = "admin/user/updateUser";
        param["id"] = this.enit_id;
      }
      if (this.sign == 0) {
        url = "admin/user/addUser";
        param["passWord"] = this.edit_password;
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          var args = JSON.parse(sessionStorage.getItem("signInfo"));
          if (args.id == res.data.id) {
            net.message(this, "当前角色信息已改变,请重新登录", "success");
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 2000);
          }
          this.getUserList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            {
				userName: this.userName,
				nickName: this.nickName,
				phone: this.phone,
				roleName: this.roleName,
				roleNickName: this.roleNickName,
				type: this.type
            }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getUserList(param, data) {
      net.request("admin/user/queryPage", "post", param, data).then(res => {
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
        {
			userName: this.userName,
			nickName: this.nickName,
			phone: this.phone,
			roleName: this.roleName,
			roleNickName: this.roleNickName,
			type: this.type
        }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
			userName: this.userName,
			nickName: this.nickName,
			phone: this.phone,
			roleName: this.roleName,
			roleNickName: this.roleNickName,
			type: this.type
        }
      );
    },

    search() {
      //查询
      this.pageNo = 1;
      this.getUserList(
        { pageNo: 1, pageSize: this.pageSize },
        {
			userName: this.userName,
			nickName: this.nickName,
			phone: this.phone,
			roleName: this.roleName,
			roleNickName: this.roleNickName,
			type: this.type
        }
      );
    },
    //获取所有角色信息
    getAllRole(type, callback) {
      callback = callback || function() {};
      net
        .request("admin/role/selectType", "post", { type: parseInt(type) })
        .then(res => {
          if (res.retcode == 1) {
            this.roleAll = res.data;
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
    },
    //监听用户类型改变
    userTypeChange(val) {
      this.selectRole = "";
      this.selectOrign = "";
      if (val == 1) {
        this.showOrg = false;
      } else {
        this.showOrg = true;
      }
      this.getAllRole(val);
    },
    roleTypeChange(val) {
      this.selectOrign = "";
      this.getAllorgin("", val);
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
