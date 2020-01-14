<template>
  <div>
    <div id="userList">
      <div style="padding:10px;color:#f40;text-align:left" v-if="false">
        注意:
        <br />&nbsp;&nbsp;&nbsp;&nbsp;1.数据统计从2019-11-01开始;
        <br />&nbsp;&nbsp;&nbsp;&nbsp;2.在过滤转化的条件下,隔天确认治疗的工单会根据查询时间的变化导致数据不一致;
        <br />&nbsp;&nbsp;&nbsp;&nbsp;3.目前单价:一类检测200,二类检测400;检测(其他)0;动力康复(奥迪店600其他店800)缸壁修复(400)烧机油治理(600);
      </div>
      <div class="search">
        <div class="p_select" v-if="false">
          <el-select v-model="areaId" clearable placeholder="请选择区" @change="areaChange">
            <el-option
              v-for="item in areaData"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select
            v-model="groupId"
            clearable
            filterable
            placeholder="请选择集团"
            @change="groupChange"
          >
            <el-option
              v-for="item in groupArr"
              :key="item.groupId"
              :label="item.groupName"
              :value="item.groupId"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select clearable v-model="orgId" filterable placeholder="请选择检测站点">
            <el-option
              v-for="item in orgIdArr"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select clearable v-model="filterFree" filterable placeholder="请选择过滤类型">
            <el-option
              v-for="item in filterFreeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select clearable v-model="filterNewOrg" filterable placeholder="请选择过滤试运营">
            <el-option
              v-for="item in filterNewOrgList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="table">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane label="按天统计">

            <div id="capture" ref="imageTofile">
              <div class="search">
                <div class="p_select">
                  <el-date-picker
                    v-model="queryDay"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  >></el-date-picker>
                </div>
                <div class="p_select">
                  <el-button type="primary" @click="clickDaySearch" icon="el-icon-search">查询</el-button>
                  <el-button type="primary" @click="toImage" icon="el-icon-download" v-show="isShow" >下载图片</el-button>
                </div>
              </div>
              <!--<img :src="htmlUrl">-->
                <el-table
                  id = "mainFrame"
                  :data="dayDataList"
                  border
                  style="width: 100%"
                  :header-cell-style="tableHeaderColor"
                  :cell-style="cellStyle"
                >
                  <el-table-column prop="orgName" label="店面名称" align="center" width="240px"></el-table-column>
                  <el-table-column label="检测台次" align="center" width="140px">
                    <template slot-scope="scope">
                      <span>{{scope.row.t101 + scope.row.t102 + scope.row.t199}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="step2Count" label="治疗台次" align="center" width="140px"></el-table-column>
                  <el-table-column prop="t101" label="I类检测" align="center"></el-table-column>
                  <el-table-column prop="t102" label="Ⅱ类检测" align="center"></el-table-column>
                  <el-table-column prop="t199" label="检测(其他)" align="center"></el-table-column>
                  <el-table-column prop="t200" label="动力康复(缸数)" align="center"></el-table-column>
                  <el-table-column prop="t202" label="缸内修复(缸数)" align="center"></el-table-column>
                  <el-table-column prop="t202" label="烧机油治理(缸数)" align="center"></el-table-column>
                  <el-table-column prop="subMoney" label="营收合计" align="center"></el-table-column>
                </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="按月统计">
            <div class="search">
              <div class="p_select">
                <el-date-picker
                  v-model="queryMonth"
                  type="month"
                  placeholder="选择月份"
                  value-format="yyyy-MM"
                  :picker-options="pickerOptions"
                >></el-date-picker>
              </div>
              <div class="p_select">
                <el-button type="primary" @click="clickMonthSearch" icon="el-icon-search">查询</el-button>
              </div>
            </div>
            <el-table
              :data="monthDataList"
              border
              style="width: 100%"
              :header-cell-style="tableHeaderColor"
              :cell-style="cellStyle"
            >
              <el-table-column prop="orgName" label="店面名称" align="center"></el-table-column>
              <el-table-column label="检测台次" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.t101 + scope.row.t102 + scope.row.t199}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="step2Count" label="治疗台次" align="center"></el-table-column>
              <el-table-column prop="t101" label="I类检测" align="center"></el-table-column>
              <el-table-column prop="t102" label="Ⅱ类检测" align="center"></el-table-column>
              <el-table-column prop="t199" label="检测(其他)" align="center"></el-table-column>
              <el-table-column prop="t200" label="动力康复(缸数)" align="center"></el-table-column>
              <el-table-column prop="t202" label="缸内修复(缸数)" align="center"></el-table-column>
              <el-table-column prop="t202" label="烧机油治理(缸数)" align="center"></el-table-column>
              <el-table-column prop="subMoney" label="营收合计" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="按时间查询">
            <div class="search">
              <div class="p_select">
                <el-date-picker
                  v-model="StartTime"
                  type="datetime"
                  placeholder="请选择开始时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                >></el-date-picker>
              </div>
              <div class="p_select">
                <el-date-picker
                  v-model="EndTime"
                  type="datetime"
                  placeholder="请选择结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                >></el-date-picker>
              </div>

              <div class="p_select">
                <el-button type="primary" @click="clickTimeSearch" icon="el-icon-search">查询</el-button>
              </div>
            </div>
            <el-table
              :data="timeDataList"
              border
              style="width: 100%"
              :header-cell-style="tableHeaderColor"
              :cell-style="cellStyle"
            >
              <el-table-column prop="orgName" label="店面名称" align="center"></el-table-column>
              <el-table-column label="检测台次" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.t101 + scope.row.t102 + scope.row.t199}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="step2Count" label="治疗台次" align="center"></el-table-column>
              <el-table-column prop="t101" label="I类检测" align="center"></el-table-column>
              <el-table-column prop="t102" label="Ⅱ类检测" align="center"></el-table-column>
              <el-table-column prop="t199" label="检测(其他)" align="center"></el-table-column>
              <el-table-column prop="t200" label="动力康复(缸数)" align="center"></el-table-column>
              <el-table-column prop="t202" label="缸内修复(缸数)" align="center"></el-table-column>
              <el-table-column prop="t202" label="烧机油治理(缸数)" align="center"></el-table-column>
              <el-table-column prop="subMoney" label="营收合计" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import net from "../../assets/js/public";
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      htmlUrl: '',
      queryDay: "",
      queryMonth: "",
      filterFree: 1,
      filterNewOrg: 1,
      filterFreeList: [
        { id: 0, name: "检测项-不过滤已转化" },
        { id: 1, name: "检测项-过滤已转化" }
      ],
      filterNewOrgList: [
        { id: 0, name: "试运营-不过滤" },
        { id: 1, name: "试运营-过滤" }
      ],
      areaId: "",
      areaData: [],
      groupId: 2,
      groupArr: [], //所有集团
      orgId: "",
      orgIdArr: [], //集团下所有站点
      StartTime: "",
      EndTime: "",
      tabIndex: 0,
      timeDataList: [],
      dayDataList: [],
      monthDataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataLength : 0,
      isShow : false
    };
  },
  components: {
    html2canvas
  },
  created() {
    this.groupNm();
    this.groupChange(2);
    // this.getareaData();
  },
  methods: {
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "color: #409EFF;font-weight: bold ;";
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }){
      if (row.orgName === "合计") {
        return "color: black;font-weight: bold ;";
      }
    },
    //获取区
    getareaData() {
      net.request("admin/select/getArea", "post").then(res => {
        if (res.retcode == 1) {
          this.areaData = res.data;
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    areaChange(areaId) {
      this.orgId = "";
      this.getOrginByArea(areaId);
    },
    groupNm() {
      //获取集团数据
      net.request("admin/group/getGroupInfoList", "post").then(res => {
        if (res.retcode == 1) {
          this.groupArr = res.data;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    groupChange(groupId) {
      this.orgId = "";
      this.orgIdArr = [];
      if (groupId == "") {
        return;
      }
      this.getOrgin(groupId);
    },
    getOrgin(groupId) {
      //获取站点
      net
        .request(
          "admin/Organization/getOrganizationByGroupId",
          "post",
          { groupId: groupId, orgName: "" },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.orgIdArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    getOrginByArea(areaId) {
      this.orgIdArr = [];
      if (areaId == "") return;
      //获取站点
      net
        .request(
          "admin/Organization/getOrganizationByAreaId",
          "post",
          { areaId: areaId, orgName: "" },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.orgIdArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    checkInput() {
      if (this.orgId == "" || this.orgId == 0) {
        net.message(this, "请选择检测站点", "warning");
        return false;
      }
      return true;
    },
    clickTimeSearch() {
      net
        .request(
          "admin/financialM/timeFinancialManageCountInfo",
          "post",
          {
            groupId: this.groupId,
            areaId: this.areaId,
            orgId: this.orgId,
            filterFree: this.filterFree,
            filterNewOrg: this.filterNewOrg,
            StartTime: this.StartTime,
            EndTime: this.EndTime
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            this.timeDataList = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    clickDaySearch() {
      //按天查询
      this.isShow = false //隐藏下载图片的按钮
      net
        .request(
          "admin/financialM/dayFinancialManageCountInfo",
          "post",
          {
            groupId: this.groupId,
            areaId: this.areaId,
            orgId: this.orgId,
            filterFree: this.filterFree,
            filterNewOrg: this.filterNewOrg,
            queryDay: this.queryDay
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            this.dayDataList = res.data;
            this.dataLength  = res.data.length;

            // console.log(res.data)
            // console.log(res.data.length)
            if(res.data.length > 1){
              this.isShow = true  // 显示下载图片的按钮
            }
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    clickMonthSearch() {
      //按月查询
      net
        .request(
          "admin/financialM/monthFinancialManageCountInfo",
          "post",
          {
            groupId: this.groupId,
            areaId: this.areaId,
            orgId: this.orgId,
            filterFree: this.filterFree,
            filterNewOrg: this.filterNewOrg,
            queryMonth: this.queryMonth
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            this.monthDataList = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    exportForm() {
      var url =
        net.baseUrl + "admin/newReportExcel/exportFinancialDetailForOrg?";
      url += "jobOrgId=" + this.orgId;
      url += "&filterFree=" + this.filterFree;
      url += "&filterNewOrg=" + this.filterNewOrg;
      url += "&StartTime=" + this.StartTime;
      url += "&EndTime=" + this.EndTime;
      window.open(url);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.clickSearch();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.clickSearch();
    },
    dateFormat(row) {
      let time = net.dateFormat(row.inputTime);
      return time;
    },
    busTypeFormat(row) {
      if (row.busType == 199) {
        return "检测(其他)";
      } else if (row.busType == 101) {
        return "I类检测";
      } else if (row.busType == 102) {
        return "Ⅱ类检测";
      } else if (row.busType == 201) {
        return "缸内修复";
      } else if (row.busType == 202) {
        return "烧机油治理";
      } else if (row.busType == 200) {
        return "动力康复";
      } else return "";
    },
    colspanMethod({ rowIndex, columnIndex }) {
      if (rowIndex == 0 || rowIndex == 3) {
        if (columnIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        }
      } else if (rowIndex == 6) {
        if (columnIndex === 0) {
          return {
            rowspan: 1,
            colspan: 4
          };
        } else if (columnIndex != 4) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else {
        if (columnIndex === 0) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },

    // 页面元素转图片
    toImage() {
      // const width = "200px";
      // // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      // html2canvas(this.$refs.imageTofile, {
      //   backgroundColor: null,
      //   // width : width
      //   // windowWidth : width
      // }).then((canvas) => {
      //   // canvas.width = 500;
      //   // canvas.style.width = "500px";
      //   let url = canvas.toDataURL('image/png');
      //   console.log(canvas,'图片地址')
      //   console.log(url,'图片地址')
      //   // this.htmlUrl = url;
      //   // 把生成的base64位图片上传到服务器,生成在线图片地址
      //   // this.sendUrl();
      // })

      this.isShow = false// 隐藏下载图片的按钮

      setTimeout(() => {
        html2canvas(document.querySelector("#capture")).then(canvas => {
          const imgUrl = canvas.toDataURL("png"); // 获取生成的图片的url
          // console.log(imgUrl)

          var saveFile = function(data, filename){
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;

            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
          }


          const img = new Image();
          img.src = canvas.toDataURL("png");
          img.setAttribute('crossOrigin', 'anonymous');
          var canvas = document.createElement("canvas");//1. 获取画布
          // console.log('高度',this.dataLength)

          const num = this.dataLength * 48 + 148;
          // console.log(canvas)
          canvas.width = 530;//这个设置不能丢，否者会成为canvas默认的300*150的大小
          canvas.height = num;//这个设置不能丢，否者会成为canvas默认的300*150的大小
          var ctx = canvas.getContext("2d");//2. 获取画布上下文
          img.onload=function() {
            var w = img.width
            var h = img.height
            // ctx.drawImage(img, 0, 0, 200, h, 0, 0, 300, 200)
            ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h)
            var dataURL = canvas.toDataURL("image/png");
            // console.log('裁切后',dataURL)

            saveFile(dataURL,'images.jpg');

          }
        })
      },1000)


    },

  }
};
</script>
<style lang="less" scoped>
#userList {
  display: flex;
  flex-direction: column;
  .search {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    .p_select {
      margin-right: 20px;
      margin-top: 15px;
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
