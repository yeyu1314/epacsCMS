<template>
  <div>
    <div id="userList">
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
        <div class="p_select" v-if="false">
          <el-select clearable v-model="filterFree" filterable placeholder="请选择过滤类型">
            <el-option
              v-for="item in filterFreeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select" v-if="false">
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
        <el-tabs class="el-tab-set" type="border-card" style="margin-right:15px" v-model="tabIndex">
          <el-tab-pane class="el-tab-pane" label="按天统计">
            <div id="capture" ref="imageTofile">
              <div class="search">
                <div class="p_select">
                  <el-date-picker
                    v-model="StartDay"
                    type="date"
                    placeholder="选择开始日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  >></el-date-picker>
                </div>
                <div class="p_select">
                  <el-date-picker
                    v-model="EndDay"
                    type="date"
                    placeholder="选择结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  >></el-date-picker>
                </div>
                <div class="p_select">
                  <el-button type="primary" @click="clickDaySearch" icon="el-icon-search">查询</el-button>
                </div>
              </div>
              <div id="dayChart" class="ecChart"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="按周统计">
            <div class="search">
              <div class="p_select">
                <el-date-picker
                  v-model="StartWeek"
                  type="week"
                  placeholder="请选择开始周"
                  :picker-options="pickerOptions2"
                >></el-date-picker>
              </div>
              <div class="p_select" id="weekEnd">
                <el-date-picker
                  v-model="EndWeek"
                  type="week"
                  placeholder="请选择结束周"
                  :picker-options="pickerOptions2"
                >></el-date-picker>
              </div>
              <div class="p_select">
                <el-button type="primary" @click="clickWeekSearch" icon="el-icon-search">查询</el-button>
              </div>
              <div id="weekChart" class="ecChart"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="按月统计">
            <div class="search">
              <div class="p_select">
                <el-date-picker
                  v-model="StartMonth"
                  type="month"
                  placeholder="请选择开始月份"
                  value-format="yyyy-MM"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </div>
              <div class="p_select">
                <el-date-picker
                  v-model="EndMonth"
                  type="month"
                  placeholder="请选择结束月份"
                  value-format="yyyy-MM"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </div>
              <div class="p_select">
                <el-button type="primary" @click="clickMonthSearch" icon="el-icon-search">查询</el-button>
              </div>
              <div id="monthChart" class="ecChart"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import net from "../../assets/js/public";
import $ from "jquery";
export default {
  data() {
    return {
      chartList: [],
      StartDay: "",
      EndDay: "",
      StartWeek: "",
      EndWeek: "",
      StartMonth: "",
      EndMonth: "",
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
      groupId: 2, //默认选中中升集团
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
          return time.getTime() > Date.now() || time.getTime() < new Date('2019-05-01 00:00:00');
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return (time.getTime() > Date.now() || time.getTime() < new Date('2019-04-29 00:00:00')) || (time.getDay() == 0 || time.getDay() == 6);
        }
      },
      dataLength: 0,
      isShow: false
    };
  },
  components: {},
  created() {
    this.groupNm();
    this.groupChange(2);
    var day1 = new Date();
    var day2 = new Date(day1.getTime() - 30 * 24 * 60 * 60 * 1000);
    this.EndDay =
      day1.getFullYear() +
      "-" +
      (day1.getMonth() < 10 ? "0" : "") +
      (day1.getMonth() + 1) +
      "-" +
      (day1.getDate() < 10 ? "0" : "") +
      day1.getDate();
    this.StartDay =
      day2.getFullYear() +
      "-" +
      (day2.getMonth() < 10 ? "0" : "") +
      (day2.getMonth() + 1) +
      "-" +
      (day2.getDate() < 10 ? "0" : "") +
      day2.getDate();
    this.StartWeek = "2019-05-01";
    this.EndWeek = this.EndDay;
    this.StartMonth = "2019-05";
    this.EndMonth =
      day1.getFullYear() +
      "-" +
      (day1.getMonth() < 10 ? "0" : "") +
      (day1.getMonth() + 1);
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if (this.chartList) {
          for (var i = 0; i < this.chartList.length; i++) {
            var item = this.chartList[i];
            console.log(item);
            if (item) {
              item.resize();
            }
          }
        }
      })();
    };
  },
  updated() {},
  methods: {
    drawLine(index, id, serverData) {
      // 基于准备好的dom，初始化echarts实例
      console.log(id);
      var dom = document.getElementById(id);
      if ($(dom).children("div").length == 3) {
        $($(dom).children("div")[2]).hide();
      }
      let myChart = this.$echarts.init(dom);
      this.chartList[index] = myChart;
      var dataViewTitle = "";
      switch (index) {
        case 0:
          dataViewTitle = "日期";
          break;
        case 1:
          dataViewTitle = "月份";
          break;
        case 2:
          dataViewTitle = "周";
          break;
      }

      function getTable(opt, typeName) {
        var axisData = opt.xAxis[0].data; //获取图形的data数组
        var series = opt.series; //获取series
        var table = '<table style="width:calc(100vw - 300px)" border="1" cellpadding="2" cellspacing="0" ><thead>';
        table +=
          '<tr style="height:48px;line-height:48px;background-color:#fff;">' +
          "<th style='color: #409EFF;border : 1px solid #eee'>" +
          typeName +
          "</th>";

        for (var y = 0; y < series.length; y++) {
          table += "<th style='color: #409EFF;border : 1px solid #eee'>" + series[y].name + "</th>";
        }
        table +=
          '</tr></thead><tbody style="height:400px;overflow-y: scroll;">';
        for (var i = 0, l = axisData.length; i < l; i++) {
          table +=
            "<tr style='height:36px;line-height:36px;' >" +
            "<td style='border : 1px solid #eee;font-size: 14px;'>" +
            axisData[i] +
            "</td>";
          for (var j = 0; j < series.length; j++) {
            if (series[j].data[i]) {
              table += "<td style='border : 1px solid #eee;font-size: 14px;'>" + series[j].data[i] + "</td>";
            } else {
              table += "<td style='border : 1px solid #eee;font-size: 14px;'>" + 0 + "</td>";
            }
          }
          table += "</tr>";
        }
        table += "</tbody></table>";
        return table;
      }
      let option = {
        title: {
          text: serverData.orgName
          // subtext: "纯属虚构"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#283b56"
            }
          },
          textStyle: {
            align: "left"
          }
        },
        color:['#CC0000','#4D0099' ,'#FF8C00','#458B00','#104E8B'],
        legend: {
          data: ["检测台次", "治疗台次", "检测产值", "治疗产值"]
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              readOnly: true,
              optionToContent: function(opt) {
                // alert(11111)
                var table = "";
                table += getTable(opt, dataViewTitle);
                return table;
              }
            },
            saveAsImage: {}
          }
        },
        dataZoom: {
          show: true,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: serverData.timeLines
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            name: "台次",
            max: serverData.countMaxValue,
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: "value",
            scale: true,
            name: "产值",
            max: serverData.subCountMaxValue,
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: [
          {
            name: "检测台次",
            type: "line",
            smooth: true,
            data: serverData.step1CountList
          },
          {
            name: "治疗台次",
            type: "line",
            smooth: true,
            data: serverData.step2CountList
          },
          {
            name: "检测产值",
            type: "bar",
            stack: "产值",
            xAxisIndex: 0,
            yAxisIndex: 1,
            data: serverData.step1SubCountList
          },
          {
            name: "治疗产值",
            type: "bar",
            stack: "产值",
            xAxisIndex: 0,
            yAxisIndex: 1,
            data: serverData.step2SubCountList
          }
        ]
      };
      if (
        serverData.orgCountList != undefined &&
        (this.orgId == "" || this.orgId === 0)
      ) {
        option.series.splice(2,0,{
          name: "统计站点",
          type: "line",
          smooth: true,
          data: serverData.orgCountList
        });
        option.legend.data.splice(2,0, "统计站点");
      }
      // 绘制图表
      myChart.setOption(option);
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
    clickDaySearch() {
      //按天查询
      this.isShow = false; //隐藏下载图片的按钮
      net
        .request(
          "admin/financialAnalysis/dayFinancialManageCountInfo",
          "post",
          {
            groupId: this.groupId,
            areaId: this.areaId,
            orgId: this.orgId,
            filterFree: this.filterFree,
            filterNewOrg: this.filterNewOrg,
            StartDay: this.StartDay,
            EndDay: this.EndDay
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            this.drawLine(0, "dayChart", res.data);
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    clickWeekSearch() {
      console.log("===clickWeekSearch===");
      //按周查询
      net
        .request(
          "admin/financialAnalysis/weekFinancialManageCountInfo",
          "post",
          {
            groupId: this.groupId,
            areaId: this.areaId,
            orgId: this.orgId,
            filterFree: this.filterFree,
            filterNewOrg: this.filterNewOrg,
            StartWeek: this.StartWeek,
            EndWeek: this.EndWeek
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            console.log(res.data);
            this.drawLine(2, "weekChart", res.data);
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    clickMonthSearch() {
      console.log("===clickMonthSearch===");
      //按月查询
      net
        .request(
          "admin/financialAnalysis/monthFinancialManageCountInfo",
          "post",
          {
            groupId: this.groupId,
            areaId: this.areaId,
            orgId: this.orgId,
            filterFree: this.filterFree,
            filterNewOrg: this.filterNewOrg,
            StartMonth: this.StartMonth,
            EndMonth: this.EndMonth
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            this.drawLine(1, "monthChart", res.data);
          } else {
            net.message(this, res.retmsg, "warning");
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
  .search {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    .p_select {
      margin-right: 20px;
      margin-top: 15px;
    }
  }
}

.el-tab-set {
  width: calc(100vw - 240px);
}
.el-tab-pane {
  width: calc(100vw - 270px);
}
.ecChart {
  width: calc(100vw - 270px);
  height: 600px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
