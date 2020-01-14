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
        <div id="step2Chart" class="ecChart"></div>
      </div>
      <div class="filterSet" v-if="orgList.length > 0">
        <el-button @click='clearAllCheckedOrg'>清空</el-button>
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
      maxShowCount: 5,
      groupId: 2, //默认选中中升集团
      groupArr: [], //所有集团,
      orgList: [],
      orgListChecked: [],
      serverResponseData: null
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
    clearAllCheckedOrg(){
      this.orgListChecked = [];
      this.renderData(this.orgListChecked);
    },
    onOrgCheckedChange() {
      while (this.orgListChecked.length > this.maxShowCount) {
        this.orgListChecked.splice(0, 1);
      }
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
        color: ["#CC0000", "#4D0099", "#FF8C00", "#458B00", "#104E8B"],
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
            data: timeLines
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
          "admin/financialAnalysis/analysisOpen30Days",
          "post",
          { groupId: this.groupId },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "查询成功", "success");
            this.serverResponseData = res.data;
            this.orgList = this.serverResponseData.orgNameList;
            this.renderData([], true);
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //渲染数据
    renderData(showList, showDefault = false) {
      var legend = [];
      var series1 = [];
      var series2 = [];
      if (showList.length > 0) {
        legend = showList;
        for (var x = 0; x < legend.length; x++) {
          var orgName = legend[x];
          var index = this.orgList.indexOf(orgName);
          if (index != -1) {
            series1[x] = {
              name: orgName,
              type: "line",
              smooth: true,
              data: this.serverResponseData.step1CountList[index]
            };
            series2[x] = {
              name: orgName,
              type: "line",
              smooth: true,
              data: this.serverResponseData.step2CountList[index]
            };
          }
        }
      } else {
        let showCount = showDefault
          ? this.orgList.length < this.maxShowCount
            ? this.orgList.length
            : this.maxShowCount
          : 0;
        //取前面5个
        for (var y = 0; y < showCount; y++) {
          legend[legend.length] = this.orgList[y];
          series1[y] = {
            name: legend[legend.length - 1],
            type: "line",
            smooth: true,
            data: this.serverResponseData.step1CountList[y]
          };
          series2[y] = {
            name: legend[legend.length - 1],
            type: "line",
            smooth: true,
            data: this.serverResponseData.step2CountList[y]
          };
        }
        this.orgListChecked = legend;
      }
      this.drawLine(
        0,
        "step1Chart",
        "",
        "检测台次",
        this.serverResponseData.step1MaxValue,
        this.serverResponseData.timeLines,
        legend,
        series1
      );
      this.drawLine(
        1,
        "step2Chart",
        "",
        "治疗台次",
        this.serverResponseData.step2MaxValue,
        this.serverResponseData.timeLines,
        legend,
        series2
      );
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
  height: 380px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
