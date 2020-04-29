<template>
  <div id="contain">
    <div class="block" style="width:99%;">
      <el-carousel :height="height">
        <el-carousel-item v-for="item in picArr" :key="item.id">
          <img :src="item.fileName" alt style="width:100%">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="ppp">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div style="width:90%;margin: 0 auto;">
            <img style="width:100%" src="../assets/img/init_survey_title.png" alt>
          </div>
        </div>
        <div
                class="btn"
                v-for="item in firstCheckTitles"
                v-show="item.flag"
                :key="item.id"
                @click="btnClick(item.path)"
        >
          <img :src="item.name" alt>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div style="width:90%;margin: 0 auto;">
            <img style="width:100%" src="../assets/img/re_examination.png" alt>
          </div>
        </div>
        <div
                class="btn"
                v-for="item in againCheckTitles"
                v-show="item.flag"
                :key="item.id"
                @click="btnClick(item.path)"
        >
          <img :src="item.name" alt>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div style="width:90%;margin: 0 auto;">
            <img style="width:100%" src="../assets/img/research.png" alt>
          </div>
        </div>
        <div
                class="btn"
                v-for="item in dataTitles"
                v-show="item.flag"
                :key="item.id"
                @click="btnClick(item.path)"
        >
          <img :src="item.name" alt>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div style="width:90%;margin: 0 auto;">
            <img style="width:100%" src="../assets/img/AI.png" alt>
          </div>
        </div>
        <div
                class="btn"
                v-for="item in AITitles"
                v-show="item.flag"
                :key="item.id"
                @click="btnClick1(item.pathName,item.type)"
        >
          <img :src="item.name" alt>
        </div>
      </el-card>
    </div>
    <div>
      <p style="height:26px;line-height:26px;width:100%;display: flex;flex-direction: column;margin-top:20px">
        <a href="http://www.miitbeian.gov.cn/" >粤ICP备13074057号-2</a>
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502001574" >
          <img src="../assets/img/renumber.png" alt="" style="position:relative;top:5px;">
          粤公网安备 44030502001574</a>
      </p>
    </div>
  </div>
</template>

<script>
  import net from "../assets/js/public";
  export default {
    data() {
      return {
        firstCheckTitles: [ // 检测 复查  操作按钮图片
          {
            name: require("../assets/img/onloadFrist.png"),
            flag: false,
            path: "/onloadPic",
            id: 1
          },
          {
            name: require("../assets/img/edit_init_survey.png"),
            flag: false,
            path: "/firstReport",
            id: 3,
            type: "warning"
          },
          {
            name: require("../assets/img/ex_init_survey.png"),
            flag: false,
            path: "/waitVerify",
            id: 2
          }
        ],
        againCheckTitles: [
          {
            name: require("../assets/img/onload_re_pic.png"),
            flag: false,
            path: "/recheckPic",
            id: 1
          },
          {
            name: require("../assets/img/edit_re_report.png"),
            flag: false,
            path: "/editRecheck",
            id: 3
          },
          {
            name: require("../assets/img/ex_re_examination.png"),
            flag: false,
            path: "/waitVerifyReport",
            id: 2
          }
        ],
        AITitles: [
          {
            id: 1,
            name: require("../assets/img/modeling.png"),
            flag: false,
            path: "/modalUrlConfig",
            pathName: "modalUrlConfig",
            type:0
          },
          {
            id: 2,
            name: require("../assets/img/database.png"),
            flag: false,
            path: "/distinguish",
            pathName: "distinguish",
            type:1
          },
          {
            id: 3,
            name: require("../assets/img/operator.png"),
            flag: false,
            path: "/distinguish",
            pathName: "distinguish",
            type:2
          }
        ],
        dataTitles: [
          {
            id: 1,
            name: require("../assets/img/verify.png"),
            flag: false,
            path: "/historydata",
            type: "primary"
          },
          {
            id: 2,
            name: require("../assets/img/retrieval.png"),
            flag: false,
            path: "/orderReport",
            type: "success"
          },
          {
            id: 3,
            name: require("../assets/img/statistics.png"),
            flag: false,
            path: "/bigdata",
            type: "warning"
          }
        ],
        allBtnArr: [],
        navList: "",
        picArr: [],
        height: "450px"
      };
    },
    created() {
      this.allBtnArr = this.firstCheckTitles
              .concat(this.againCheckTitles)
              .concat(this.AITitles)
              .concat(this.dataTitles);
      var width = document.body.clientWidth - 240;
      this.height = width / 4 + "px";
    },
    mounted() {
      this.getBannerPic(() => {
        setTimeout(() => {
          this.navList = JSON.parse(sessionStorage.getItem("navList")).data;
          for (var i = 0; i < this.navList.length; i++) {
            var subMenu = this.navList[i].subMenu;
            for (var j = 0; j < subMenu.length; j++) {
              for (var g = 0; g < this.allBtnArr.length; g++) {
                if (subMenu[j].subRouteName == this.allBtnArr[g].path) {
                  this.allBtnArr[g].flag = true;
                }
              }
            }
          }
        }, 1000);
      });
    },
    methods: {
      btnClick(d) {
        this.$router.push({ path: d });
      },
      btnClick1(d,type) {
        this.$router.push({ name: d,params:{
            type:type
          } });
      },
      getBannerPic(callback) {
        callback = callback || function() {};
        net
                .request2("web/config/homePage/list", "post", { type: 1 })
                .then(res => {
                  if (res.retcode == 1) {
                    var data = res.data;
                    for (var i = 0; i < data.length; i++) {
                      data[i].fileName =
                              net.imageHP +
                              "web/config/homePage/getImage?name=" +
                              data[i].fileName;
                    }
                    this.picArr = res.data;
                    callback();
                  } else {
                    net.message(this, res.retmsg, "error");
                  }
                });
      }
    }
  };
</script>

<style lang="less">
  #contain {
    display: flex;
    flex-direction: column;
  }
  .block {
    .el-carousel {
      .el-carousel__container {
        .el-carousel__item {
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .ppp {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    .btn {
      width: 55%;
      margin: 0 auto;
      margin-bottom: 15px;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
    display: block;
    width: 100%;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card:first-child {
    width: 24%;
  }
  .box-card {
    width: 24%;
    margin-right: 1%;
  }
</style>
