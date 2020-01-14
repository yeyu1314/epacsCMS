<template>
  <section>
    <div id="indexnav">
      <el-row class="tac">
        <el-col>
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#393d49"
            text-color="#fff"
            active-text-color="#ffffff"
            :default-active="this.$route.path"
            @select="handleSelect"
            router
          >
            <div v-for="(item,i) in nav_list" :key="i">
              <el-submenu v-if="item.subMenu.length > 0" :index="item.routeName">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ item.menuName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(g,f) in item.subMenu"
                    :key="f"
                    :index="g.subRouteName"
                  >{{g.menuName}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item v-if="item.subMenu.length == 0" :index="item.routeName">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.menuName }}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="transverse">
      <div class="title">EPACS</div>
      <div
        style="position: absolute;top:0;left:218px;border-left: 1px solid #000;border-right: 1px solid #000;height:60px;padding: 0 23px;cursor: pointer;"
        @click="indexClick"
      >
        <span class="iconfont icon-home"></span>
        <span>首页</span>
      </div>
      <div class="userInfo">
        用户:&nbsp;&nbsp;
        <span v-if="orgName!=''">{{orgName}}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>{{userName}}</span>
        <p style="margin-left:30px;display:none">修改密码</p>
        <p style="color:red" @click="exit">退出</p>
      </div>
    </div>x
    <div class="nav_background"></div>
  </section>
</template>
<script>
import net from "../assets/js/public";
import $ from "jquery";
export default {
  data() {
    return {
      userName: "", //用户名
      orgName: "", //用户名
      signInfo: "", //登录信息
      active: 1,
      nav_list: []
    };
  },
  created() {
    this.signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
    if (this.signInfo == null) {
      this.$router.push({ name: "SignIn" });
      return false;
    }
    this.userName = this.signInfo.userName;
    this.orgName = this.signInfo.orgName;
    this.getMenuInfo();
  },
  mounted() {
    var h = document.documentElement.clientHeight - 60 + "px";
    $("#indexnav").css({
      height: h
    });
  },
  methods: {
    getMenuInfo() {
      var param = { roleId: this.signInfo.roleId };
      net.request("admin/link/getMenu", "post", param).then(res => {
        if (res.retcode == 1) {
          this.nav_list = res.data;

          sessionStorage.setItem("navList", JSON.stringify(res));
        }
      });
    },
    handleOpen() {},
    handleClose() {},
    handleSelect() {
      //key, keyPath
      // console.log(this.$route.path);
    },
    exit() {
      this.$confirm("是否确认退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          sessionStorage.clear();
          net.delCookie("signInfo");
          this.$router.push({ path: "/" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    indexClick() {
      this.$router.push({ path: "/index" });
    }
  }
};
</script>   
<style lang="less" scoped>
section {
  width: 100%;
  height: 0;
  overflow: auto;
  .el-menu-item-group__title {
    display: none;
  }
  #indexnav::-webkit-scrollbar {
    display: none;
  }
  #indexnav {
    position: absolute;
    top: 0px;
    left: 0;
    padding-top: 60px;
    z-index: 10;
    width: 220px;
    z-index: 11;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    margin-right: -15px;
    .iconfont {
      font-size: 20px !important;
      display: inline-block;
      margin-right: 3px;
      color: #e6e3e3 !important;
    }
    .is-active {
      background: #009688 !important;
    }
    .el-menu-item-group__title {
      display: none !important;
    }
    .el-submenu .el-menu-item {
      padding: 0;
    }
  }

  .transverse {
    width: 100%;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    background: #23262e;
    color: #fff;
    line-height: 60px;
    z-index: 12;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    .title {
      width: 220px;
      color: #009688;
      text-align: center;
    }
    .portrait {
      width: 40px;
      height: 40px;
      position: absolute;
      right: 261px;
      top: 10px;
      img {
        display: inline-block;
        width: 100%;
        border-radius: 50%;
      }
    }
    .userInfo {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      cursor: pointer;
      span {
        color: #fff;
        display: inline-block;
      }
      p {
        width: 80px;
        cursor: pointer;
      }
    }
  }
  .nav_background {
    position: absolute;
    top: 0;
    left: 0;
    width: 219px;
    min-height: 300px;
    height: 100%;
    max-width: 3000px;
    background: #393d49;
    z-index: 10;
  }
}
</style>
