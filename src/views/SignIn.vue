<template>
  <div
    class="signIn"
    v-loading="loading2"
    element-loading-text="正在登陆"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="z-login-wrap">
      <div class="z-login-box">
        <div class="z-content z-clearfix">
          <div class="z-title">
            <h1>
              <img src="../assets/img/log03.png" />
              <span>登录</span>
            </h1>
          </div>
          <div class="z-form">
            <form id="loginForm">
              <el-input v-model="userPhone" placeholder="请输入手机号" class="d_input"></el-input>
              <div class="ctrlCode">
                <el-input v-model="code" placeholder="请输入验证码" class="d_input code"></el-input>
                <el-button
                  v-show="flag"
                  @click="getCode"
                  type="success"
                  plain
                  style="height: 40px;position: relative;top: 10px;width:40%;"
                >{{title}}</el-button>
                <el-button
                  v-show="!flag"
                  disabled
                  plain
                  style="height: 40px;position: relative;top: 10px;width:40%;"
                >重新获取({{second}}s)</el-button>
              </div>
              <button type="button" class="z-login-btn" @keyup.enter="enter" @click="login">登录</button>
            </form>
          </div>
        </div>
      </div>
      <!-- <div class="z-shadow"></div>1 -->
    </div>
    <p
      style="height:26px;line-height:26px;position:absolute;bottom:37px; !important;width:100%;    display: flex;flex-direction: column;"
    >
      <a href="http://www.miitbeian.gov.cn/" style="color:#fff">粤ICP备13074057号-2</a>
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502001574"
        style="color:#fff"
      >
        <img src="../assets/img/renumber.png" alt style="position:relative;" />
        粤公网安备 44030502001574
      </a>
    </p>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  name: "home",
  data() {
    return {
      codeImg: "", //验证码图片
      code: "",
      userPhone: "",
      password: "",
      loading2: false,
      uuId: "",
      baseCode: net.baseUrl + "admin/log/StringCode?uuId=",
      flag: true,
      second: 59,
      title: "获取验证码"
    };
  },
  created() {
    var _this = this;
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key == 13) {
        var sign = sessionStorage.getItem("signInfo");
        if (sign == null) {
          _this.login();
        }
      }
    };
  },
  mounted() {
    this.automaticLogin();
  },
  methods: {
    getCode() {
      if (!/^1[3456789]\d{9}$/.test(this.userPhone)) {
        net.message(this, "手机号码格式错误", "error");
        return false;
      }
      net
        .request("admin/log/getSmsCode", "post", { userPhone: this.userPhone })
        .then(res => {
          if (res.retcode == 1) {
          }
          net.message(this, res.data, "suucess");
          this.count_down();
          this.flag = false;
        });
    },
    count_down() {
      var time = setInterval(() => {
        this.second = this.second - 1;
        if (this.second == 0) {
          clearInterval(time);
          this.second = 59;
          this.flag = true;
        }
      }, 1000);
    },
    login() {
      if (this.code == "") {
        net.message(this, "请输入验证码", "warning");
      }
      let params = {
        userPhone: this.userPhone,
        code: this.code
      };
      this.loading2 = true;
      net.request("admin/log/webLogin", "post", params).then(res => {
        if (res.retcode == 1) {
          net.message(this, "登录成功", "success");
          console.log(res.data);
          sessionStorage.setItem("signInfo", JSON.stringify(res.data));
          net.setCookie("signInfo", JSON.stringify(res.data));
          setTimeout(() => {
            this.loading2 = false;
            this.$router.push({ name: "index" });
          }, 1000);
        } else {
          net.message(this, res.retmsg, "warning");
          this.loading2 = false;
        }
      });
    },
    automaticLogin() {
      var signInfo = JSON.parse(net.getCookie("signInfo"));
      //admin/log/webToken"
      if (signInfo) {
        this.loading2 = true;
        net
          .request("admin/log/webToken", "post", { userPhone: signInfo.phone })
          .then(res => {
            if (res.retcode == 1) {
              net.message(this, "登录成功", "success");
              sessionStorage.setItem("signInfo", JSON.stringify(res.data));
              setTimeout(() => {
                this.loading2 = false;
                this.$router.push({ name: "index" });
              }, 1000);
            } else {
              net.message(this, res.retmsg, "warning");
              this.loading2 = false;
            }
          });
      }
    }
  },
  components: {}
  // computed:mapState({
  //   count
  // })
};
</script>
<style lang="">
.d_input {
  margin-bottom: 18px;
  margin-top: 10px;
}
.ctrlCode {
  display: flex;
  justify-content: space-between;
}
.code {
  width: 56%;
  display: flex;
}
.z-login-btn {
  margin-top: 8px;
}
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  margin: 0;
  padding: 0;
}
a,
button,
input,
select,
textarea {
  outline: 0;
}

* {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: #333;
  text-decoration: none;
}

img {
  margin: 0;
  padding: 0;
  border: none;
  vertical-align: middle;
}

html {
  font-family: "Helvetica Neue", Helvetica, STHeiTi, Arial, sans-serif;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}

/*body{color:#333;font-size:14px;width:100%;height:100%;}*/

body {
  /* background-color: #3d4e66; */
}

/* 清除浮动 */

.z-clearfix:after,
.z-clearfix:before {
  content: ".";
  visibility: hidden;
  display: block;
  font-size: 0;
  clear: both;
  height: 0;
}

.z-login-wrap {
  position: relative;
  width: 640px;
  margin: 0 auto;
  font-family: "微软雅黑";
}

.z-login-box {
  width: 490px;
  height: 562px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -245px;
  margin-top: 180px;
  background: url("../assets/img/log01.png") no-repeat;
}

.z-login-box .z-content {
}

.z-content .z-title {
  margin: 95px auto 0 auto;
  text-align: center;
}

.z-content .z-title h1 {
  font-size: 28px;
  color: #fff;
  font-weight: normal !important;
}

.z-content strong {
  color: #ef8f05;
  font-weight: normal !important;
}

.z-content .z-title p {
  margin-top: 5px;
  color: #fff;
}

.z-content .z-form {
  text-align: center;
  width: 337px;
  margin: 0 auto;
  padding-top: 30px;
}

.form-item {
  display: block;
  overflow: hidden;
  height: auto;
  background: #f5f5f5;
  border-radius: 3px;
  margin-bottom: 18px;
}

.form-item > input {
  width: 100%;
  padding: 12px;
  border: 0;
  color: #88a4c8;
  font-size: 16px;
}

input::-webkit-input-placeholder {
  font-family: "微软雅黑";
  color: #88a4c8;
}

input::-moz-placeholder {
  font-family: "微软雅黑";
}

.z-code-box {
  background-color: #495e7a !important;
}

.z-code-box > input {
  width: 240px;
  float: left;
  border-radius: 3px;
}

.z-code-box .z-code {
  float: right;
  width: 80px;
  height: 42px;
  border-radius: 3px;
  overflow: hidden;
}

.z-form .z-inline {
  display: block;
  margin-top: 15px;
  font-size: 14px;
  color: #fff;
}

.z-form .z-inline span {
  display: inline-block;
  margin-left: 5px;
  vertical-align: middle;
}

.z-login-btn {
  width: 100%;
  padding: 12px;
  background-color: #19b394;
  border-radius: 3px;
  border: 0;
  font-family: "微软雅黑";
  font-size: 16px;
  color: #fff;
}

.z-login-btn:hover,
.z-login-btn:active,
.z-login-btn:focus:active,
.z-login-btn:focus:hover,
.z-code:hover,
.z-switch:hover {
  cursor: pointer;
}

.z-err {
  font-size: 14px;
  color: #ef6c6b;
  margin: 5px auto;
}

.z-shadow {
  position: absolute;
  top: 270px;
  left: 0;
  z-index: -1;
  width: 866px;
  height: 619px;
  background-repeat: no-repeat;
  background: url("../assets/img/log02.png") no-repeat;
  background-position: 75px 0px;
}

/*开关*/

.z-switch {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  position: relative;
  width: 50px;
  height: 26px;
  border: 1px solid #dfdfdf;
  outline: 0;
  border-radius: 16px;
  box-sizing: border-box;
  background: #dfdfdf;
  vertical-align: middle;
}

.z-switch:after {
  width: 24px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.z-switch:after,
.z-switch:before {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  border-radius: 12px;
  -webkit-transition: -webkit-transform 0.3s;
  -moz-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s -webkit-transform 0.3s -moz-transform 0.3s;
}

.z-switch:checked {
  border-color: #19b394;
  background-color: #19b394;
}

.z-switch:checked:after {
  -webkit-transform: translateX(24px);
  -moz-transform: translateX(24px);
  transform: translateX(24px);
}

.z-switch:checked:before {
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  transform: scale(0);
}

.z-loading-wrap {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
}

.z-msg {
  width: 100%;
  height: 100px;
  position: relative;
  text-align: center;
  top: 360px;
  font-size: 14px;
  color: #fff;
  font-family: "微软雅黑";
}

.spinner {
  width: 100px;
  height: 100px;
  position: relative;
  top: 350px;
  margin: 0 auto;
}

.double-bounce2 {
  background-color: #19b394 !important;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #67cf22;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-animation: bounce 2s infinite ease-in-out;
  animation: bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}

.z-switch:checked + #remenber {
  border-color: #19b394;
  background-color: #19b394;
}

.z-switch:checked + #remenber:after {
  -webkit-transform: translateX(24px);
  -moz-transform: translateX(24px);
  transform: translateX(24px);
}

.z-switch:checked + #remenber:before {
  -webkit-transform: scale(0);
  transform: scale(0);
}
.signIn {
  width: 100%;
  height: 100%;
  background: #3d4e66;
}
</style>
