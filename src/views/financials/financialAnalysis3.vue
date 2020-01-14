<template>
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
        <el-select v-model="groupId" clearable filterable placeholder="请选择集团" >
          <el-option
            v-for="item in groupArr"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId"
          ></el-option>
        </el-select>
      </div>
      <div class="search">
        <div class="p_select">
          <el-date-picker
            v-model="StartMonth"
            type="month"
            placeholder="请选择开始月份"
            value-format="yyyy-MM"
            :picker-options="pickerOptions"
          >></el-date-picker>
        </div>
        <div class="p_select">
          <el-date-picker
            v-model="EndMonth"
            type="month"
            placeholder="请选择结束月份"
            value-format="yyyy-MM"
            :picker-options="pickerOptions"
          >></el-date-picker>
        </div>
        <div class="p_select">
          <el-button type="primary" @click="clickMonthSearch" icon="el-icon-search">查询</el-button>
        </div>
      </div>

      <div class="table">
        <div id="monthChart" class="ecChart"></div>
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
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date("2019-05-01 00:00:00")
          );
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date("2019-04-29 00:00:00") ||
            (time.getDay() == 0 || time.getDay() == 6)
          );
        }
      },
      dataLength: 0,
      isShow: false
    };
  },
  components: {},
  created() {
    this.groupNm();
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
        legend: {
          data: ["检测台次", "治疗台次"]
        },
        toolbox: {
          show: true,
          feature: {
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
            name: "台次",
            max: serverData.countMaxValue,
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: [
          {
            name: "检测台次",
            type: "bar",
            smooth: true,
            xAxisIndex: 0,
            yAxisIndex: 1,
            data: serverData.step1CountList
          },
          {
            name: "治疗台次",
            type: "bar",
            smooth: true,
            xAxisIndex: 0,
            yAxisIndex: 1,
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
      // 绘制图表
      myChart.setOption(option);
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
            this.drawLine(0, "monthChart", res.data);
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
