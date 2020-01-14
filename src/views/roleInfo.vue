<template>
  <div id="userList" v-loading="loading">
    <div v-if="flag">
      <div class="searchContent">
        <el-input placeholder="请输入角色权限" v-model="nickName" clearable></el-input>
        <el-input placeholder="请输入角色名" v-model="name" clearable></el-input>
        <el-select
          v-model="roleType"
          clearable
          placeholder="请选择角色类型"
          style="width:280px;margin-right:15px;"
        >
          <el-option v-for="item in userType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button
          type="primary"
          style="background: #009688;"
          @click="search"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          type="primary"
          style="background: #009688;"
          @click="addUser"
          icon="el-icon-plus"
        >新增</el-button>
      </div>
      <div class="table">
        <el-table :data="ueseList" border style="width: 99%">
          <el-table-column prop="id" label="角色ID" align="center"></el-table-column>
          <el-table-column prop="nickName" label="角色权限" align="center"></el-table-column>
          <el-table-column prop="name" label="角色名" align="center"></el-table-column>
          <el-table-column prop="roleType" label="角色类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.roleType | utype}}</span>
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
              <el-button
                v-show="scope.row.roleType != 2"
                @click="setUpClick(scope.row)"
                type="warning"
                size="small"
              >设置权限</el-button>
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
          placeholder="请输入角色权限"
          v-model="edit_rolenick"
          style="margin:0 0 15px 0px;width:280px;"
          clearable
        ></el-input>
        <el-input
          placeholder="请输入角色名"
          v-model="edit_rolename"
          style="margin:0 0 15px 0px;width:280px;"
          clearable
        ></el-input>
        <el-select
          v-model="selectType"
          clearable
          placeholder="请选择角色类型"
          style="margin:0 0 15px 0px;width:280px;"
        >
          <el-option v-for="item in userType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div style="display: flex;margin: 10px 0 0 50px;">
          <p style="margin-right:20px">是否可打印</p>
          <el-radio-group v-model="radio2">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ensure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-if="flag==false" style="position:relative">
      <div class="operation">
        <el-button size="small" @click="back">返回</el-button>
        <el-button
          size="small"
          @click="ensureSetUp"
          style="background: rgb(0, 150, 136);color:#fff"
        >确认</el-button>
      </div>
      <div style="margin:70px 0 0 20px">
        <el-tree
          :data="menuData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="checkedKeys"
          :props="defaultProps"
          :check-on-click-node="true"
          ref="tree"
        ></el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import net from "../assets/js/public";
// import axios from "axios";
export default {
  data() {
    return {
      ueseList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      nickName: "",
      name: "",
      sign: 0, //用来判断是新增还是修改
      flag: true,
      dialogVisible: false,
      title: "",
      edit_rolenick: "",
      edit_rolename: "",
      enit_id: 0,
      checkedKeys: [],
      roleId: null,
      menuData: [],
      defaultProps: {
        children: "sub",
        label: "menuName"
      },
      setUpData: {},
      radio2: 0,
      userType: [
        { id: 1, name: "后台角色" },
        { id: 2, name: "APP角色" },
        { id: 3, name: "维修站角色" }
      ],
      selectType: "",
      loading: false,
      roleType: ""
    };
  },
  created() {
    this.getUserList(
      {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      },
      { nickName: this.nickName, name: this.name, roleType: this.roleType }
    );
  },
  filters: {
    utype(d) {
      var str = "";
      if (d == 1) {
        str = "后台角色";
      }
      if (d == 2) {
        str = "APP角色";
      }
      if (d == 3) {
        str = "维修站角色";
      }
      return str;
    }
  },
  methods: {
    getCheckedAll: function() {
      return this.flatState
        .filter(function(e) {
          if (e.node.indeterminate) {
            return e.node.indeterminate;
          }
          return e.node.checked;
        })
        .map(function(e) {
          return e.node;
        });
    },
    //设置权限
    setUpClick(row) {
      this.flag = false;
      this.roleId = row.id;
      this.checkedKeys = [];
      this.getAllMenu();
    },
    //点击新增
    addUser() {
      this.dialogVisible = true;
      this.title = "新增角色";
      this.edit_rolenick = "";
      this.edit_rolename = "";
      this.sign = 0;
    },
    editClick(row) {
      //修改
      this.dialogVisible = true;
      this.title = "修改角色";
      this.edit_rolenick = row.nickName;
      this.edit_rolename = row.name;
      this.enit_id = row.id;
      this.radio2 = row.isPrinting;
      this.selectType = row.roleType;
      this.sign = 1;
    },

    //确认修改
    ensure() {
      let param = {
        name: this.edit_rolename,
        nickName: this.edit_rolenick,
        isPrinting: this.radio2,
        roleType: this.selectType
      };
      let url;
      if (this.sign == 1) {
        url = "admin/role/updateRole";
        param["id"] = this.enit_id;
      }
      if (this.sign == 0) {
        url = "admin/role/addRole";
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          var args = JSON.parse(net.getCookie("signInfo"));
          if (args.roleId == res.data.id) {
            net.message(this, "当前角色信息已改变,请重新登录", "success");
            setTimeout(() => {
              net.delCookie("signInfo");
              this.$router.push({ path: "/" });
            }, 2000);
          }
          this.getUserList(
            //刷新页面
            {
              pageNo: this.pageNo,
              pageSize: this.pageSize
            },
            {
              nickName: this.nickName,
              name: this.name,
              roleType: this.roleType
            }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getUserList(param, data) {
      net.request("admin/role/queryPage", "post", param, data).then(res => {
        if (res.retcode == 1) {
          this.ueseList = res.data.rows;
          this.total = res.data.total;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList(
        {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        },
        { nickName: this.nickName, name: this.name, roleType: this.roleType }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList(
        {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        },
        { nickName: this.nickName, name: this.name, roleType: this.roleType }
      );
    },

    search() {
      //查询
      this.getUserList(
        {
          pageNo: this.pageNo,
          pageSize: this.pageSize
        },
        { nickName: this.nickName, name: this.name, roleType: this.roleType }
      );
    },
    getAllMenu() {
      net
        .request("admin/link/getMenuAll", "post", { roleId: this.roleId })
        .then(res => {
          if (res.retcode == 1) {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              data[i]["sub"] = data[i].subMenu;
              if (data[i].type == 1 && data[i].subMenu.length == 0) {
                this.checkedKeys.push(data[i].id);
              }
              if (data[i].subMenu.length != 0) {
                for (let j = 0; j < data[i].subMenu.length; j++) {
                  if (data[i].subMenu[j].subType == 1) {
                    this.checkedKeys.push(data[i].subMenu[j].id);
                  }
                }
              }
            }
            this.menuData = data;
          }
          console.log(res);
        });
    },
    back() {
      this.flag = true;
      this.roleId = "";
    },
    ensureSetUp() {
      var checkArr = this.$refs.tree.getCheckedNodes(); //选中的详情
      var halfCheckArr = this.$refs.tree.getHalfCheckedNodes(); //半选中的详情
      this.loading = true;
      // console.log("所有选中", checkArr);
      // console.log("半选中", halfCheckArr);
      var list = [];
      if (checkArr.length != 0) {
        for (let j = 0; j < checkArr.length; j++) {
          if (checkArr[j].menuId == undefined) {
            list.push(checkArr[j]);
          }
        }
      }
      if (halfCheckArr.length != 0) {
        //半选中不为0时
        for (let i = 0; i < halfCheckArr.length; i++) {
          var subMenu = halfCheckArr[i].subMenu;
          var arr = []; //暂存数组
          for (let f = 0; f < subMenu.length; f++) {
            for (let g = 0; g < checkArr.length; g++) {
              if (subMenu[f].id == checkArr[g].id) {
                arr.push(checkArr[g]);
              }
            }
          }
          halfCheckArr[i].subMenu = arr;
          list.push(halfCheckArr[i]);
        }
      }
      this.setUpData["list"] = list;
      this.setUpData["roleId"] = this.roleId;
      console.log("最终数据", this.setUpData);
      if (Object.keys(this.setUpData).length == 0) {
        net.message(this, "请勾选权限", "warning");
        return false;
      }
      var config = {
        headers: {
          token: JSON.parse(net.getCookie("signInfo")).token
        }
      };
      net.axios
        .post(net.baseUrl + "admin/role/setUp", this.setUpData, config)
        .then(res => {
          if (res.result == 401) {
            window.location.href = net.signUrl;
            return false;
          }
          console.log(res);
          if (res.data.retcode == 1) {
            net.message(this, "设置成功", "success");
            this.loading = false;
            this.setUpData = {};
            this.back();
            if (res.data.data == JSON.parse(net.getCookie("signInfo")).roleId) {
              net.message(this, "账号信息已改变,请重新登录", "success");
              setTimeout(() => {
                net.delCookie("signInfo");
                window.location.href = net.signUrl;
              }, 2000);
            }
          } else {
            net.message(this, "操作失败", "success");
            this.loading = false;
          }
        })
        .catch(function(error) {
          console.log(error);
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
  .operation {
    display: flex;
    flex-direction: row;
    margin: 20px 0 0 20px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
  }
}
</style>
