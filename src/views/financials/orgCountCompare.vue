<template>
  <div id="userList">
    <div class="content">
      <div class="chartSet">
        <div class="search">
          <div class="p_select">
            <el-select v-model="groupId" clearable filterable placeholder="请选择集团">
              <el-option
                v-for="item in groupArr"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId"
              ></el-option>
            </el-select>
          </div>
          <div class="p_select">
            <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
          </div>
        </div>
        <div id="step1Chart" class="ecChart"></div>
        <div id="step2Chart" class="ecChart" v-if="false"></div>
      </div>
      <div class="filterSet" v-if="orgList.length > 0">
        <el-button @click="clearAllCheckedOrg">清空</el-button>
        <el-checkbox-group @change="onOrgCheckedChange" v-model="orgListChecked">
          <el-checkbox v-for="site in orgList" :key="site" :label="site">{{ site }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import net from "../../assets/js/public";
import $ from "jquery";

var chartList = [];
var optionList = [];
export default {
  data() {
    return {
      graphicType: 0, //折线图还是条形图
      graphicTypeName: "bar",
      groupId: 2, //默认选中中升集团
      groupArr: [], //所有集团,
      orgList: [],
      orgListChecked: [],
      serverResponseData: null,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date("2019-05-01 00:00:00")
          );
        }
      },
      defaultItemStyle1: {
        normal: {
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              color: "#458B00",
              fontSize: 16
            }
          }
        }
      },
      defaultItemStyle2: {
        normal: {
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              color: "#104E8B",
              fontSize: 16
            }
          }
        }
      },
      defaultItemStyle3: {
        normal: {
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              color: "#FF8C00",
              fontSize: 16
            },
            formatter: function(params) {
              return params.value + "天";
            }
          }
        }
      }
    };
  },
  components: {},
  created() {
    this.groupNm();
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if (chartList) {
          for (var i = 0; i < chartList.length; i++) {
            var item = chartList[i];
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
    clearAllCheckedOrg() {
      this.orgListChecked = [];
      this.renderData(this.orgListChecked);
    },
    onOrgCheckedChange() {
      this.renderData(this.orgListChecked);
    },
    drawLine(
      index,
      id,
      title,
      yName,
      countMaxValue,
      timeLines,
      legend,
      series
    ) {
      // 基于准备好的dom，初始化echarts实例
      var dom = document.getElementById(id);
      if ($(dom).children("div").length == 3) {
        $($(dom).children("div")[2]).hide();
      }
      let myChart = this.$echarts.init(dom);
      chartList[index] = myChart;
      let option = {
        title: {
          text: title
        },
        grid: { left: "100px", bottom: "200px" },
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
        color: ["#458B00", "#104E8B", "#FF8C00"],
        legend: { data: legend },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: timeLines,
            axisLabel: {
              interval: 0, //横轴信息全部显示
              // rotate: -30 //-90度角倾斜显示
              formatter: function(value) {
                return value.split("").join("\n");
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            name: yName,
            max: countMaxValue,
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: "value",
            scale: true,
            name: "开站天数",
            max: this.serverResponseData.maxDay,
            min: 0,
            axisLine: { lineStyle: { color: "#FF8C00" } },
            boundaryGap: [0.2, 0.2],
            splitLine: {
              lineStyle: {
                type: "dotted",
                width: 1
              }
            }
          }
        ],
        series: series
      };
      optionList[index] = option;
      // 绘制图表
      myChart.setOption(option, true);
      myChart.on("legendselectchanged", function(obj) {
        var selected = obj.selected;
        optionList[1 - index].legend.selected = selected;
        chartList[1 - index].setOption(optionList[1 - index], true);
      });
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
    clickSearch() {
      console.log("===clickSearch===");
      //按月查询
      net
        .request(
          "admin/financialAnalysis/orgCountCompare",
          "post",
          {
            groupId: this.groupId
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            this.serverResponseData = res.data;
            this.orgList = this.serverResponseData.timeLines;
            this.renderData(null, true);
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //渲染数据
    renderData(showList, showDefault = false) {
      var legend = [];
      var series1 = [];
      // var series2 = [];
      if (showList != null) {
        legend = showList;
        var step1CountList = [];
        var step2CountList = [];
        var dayCountList = [];
        if (legend.length > 0) {
          for (var x = 0; x < this.orgList.length; x++) {
            if (legend.indexOf(this.orgList[x]) != -1) {
              step1CountList.push(this.serverResponseData.step1CountList[x]);
              step2CountList.push(this.serverResponseData.step2CountList[x]);
              dayCountList.push(this.serverResponseData.step1SubCountList[x]);
            }
          }
        }
        series1[0] = {
          name: "检测台次",
          type: this.graphicTypeName,
          smooth: true,
          itemStyle: this.defaultItemStyle1,
          data: step1CountList
        };
        series1[1] = {
          name: "治疗台次",
          type: this.graphicTypeName,
          smooth: true,
          itemStyle: this.defaultItemStyle2,
          data: step2CountList
        };
        series1[2] = {
          name: "开站天数",
          symbolSize: 10,
          type: "scatter",
          data: dayCountList,
          xAxisIndex: 0,
          yAxisIndex: 1,
          itemStyle: this.defaultItemStyle3
        };
      } else if (showDefault) {
        let showCount = this.orgList.length;
        //取前面5个
        for (var y = 0; y < showCount; y++) {
          legend[legend.length] = this.orgList[y];
        }
        this.orgListChecked = legend;
        series1[0] = {
          name: "检测台次",
          type: this.graphicTypeName,
          smooth: true,
          itemStyle: this.defaultItemStyle1,
          data: this.serverResponseData.step1CountList
        };
        series1[1] = {
          name: "治疗台次",
          type: this.graphicTypeName,
          smooth: true,
          itemStyle: this.defaultItemStyle2,
          data: this.serverResponseData.step2CountList
        };
        series1[2] = {
          name: "开站天数",
          symbolSize: 10,
          type: "scatter",
          data: this.serverResponseData.step1SubCountList,
          xAxisIndex: 0,
          yAxisIndex: 1,

          itemStyle: this.defaultItemStyle3
        };
      }
      this.drawLine(
        0,
        "step1Chart",
        "",
        "台次",
        this.serverResponseData.step1MaxValue,
        legend,
        ["检测台次", "治疗台次", "开站天数"],
        series1
      );
      // this.drawLine(
      //   1,
      //   "step2Chart",
      //   "",
      //   "治疗台次",
      //   this.serverResponseData.step2MaxValue,
      //   legend,
      //   legend,
      //   series2
      // );
    }
  }
};
</script>
<style lang="less" scoped>
#userList {
  display: flex;
  flex-direction: column;
  .search {
    width: calc(100vw - 570px);
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    padding-bottom: 10px;
    .p_select {
      margin-right: 20px;
      margin-top: 15px;
      text-align: center;
    }
  }
}
.content {
  width: calc(100vw - 270px);
  display: flex;
  // flex-direction: row-reverse;
}
.filterSet {
  width: 300px;
  background-color: ghostwhite;
  box-shadow: 0 0 12px gray;
  text-align: left;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: scroll;
}
.el-checkbox-group {
  height: 22px;
  line-height: 22px;
  margin-top: 10px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.chartSet {
  width: calc(100vw - 570px);
  // display: flex;
}
.ecChart {
  width: calc(100vw - 570px);
  // width: calc((100vw - 270px) / 2);
  height: 750px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
