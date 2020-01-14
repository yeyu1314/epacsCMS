<template>
  <div id="userList">
    <div style="padding:10px;color:#f40;text-align:left">
      注意:
      <br />&nbsp;&nbsp;&nbsp;&nbsp;1.不选择时间则默认查询当天凌晨到现在的数据;
      <br />&nbsp;&nbsp;&nbsp;&nbsp;2.时间跨度不能超过七天,只选开始时间则后推七天，只选结束时间则前推七天;
      <br />&nbsp;&nbsp;&nbsp;&nbsp;3.目前单价:一类检测200,二类检测400;检测(其他)0;动力康复(奥迪店600其他店800)缸壁修复(400)烧机油治理(600);
    </div>
    <div class="search">
      <div class="p_select">
        <el-select v-model="groupId" clearable filterable placeholder="请选择集团" @change="groupChange">
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
          <el-option v-for="item in orgIdArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
        </el-select>
      </div>
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
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" @click="exportForm" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div class="table">
      <el-tabs type="border-card" v-model="tabIndex" @tab-click="clickSearch">
        <el-tab-pane label="数据统计">
          <el-table :data="tabAdataList" border style="width: 100%" :span-method="colspanMethod">
            <el-table-column prop="brandName" label="类别" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.busType==999999999?"合计":((scope.row.busType==199 || scope.row.busType==101 || scope.row.busType==102)?"检测":"治疗")}}</span>
              </template>
            </el-table-column>
            <el-table-column label="明细" align="center" :formatter="busTypeFormat"></el-table-column>
            <el-table-column label="单价" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.busType==999999999?"":(scope.row.price==0?"&nbsp;&nbsp;&nbsp;&nbsp;0元/":scope.row.price+"元/")}}{{(scope.row.busType==199 || scope.row.busType==101 || scope.row.busType==102)?"台":"缸"}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="workNumCount" label="数量" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.busType==999999999?"":scope.row.workNumCount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="subtotal" label="小计" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="详细记录">
          <div style="width: 100%;">
            <el-table :data="tabBdataList" border style="width: 100%;">
              <el-table-column prop="orgName" label="店面名称" align="center"></el-table-column>
              <el-table-column prop="inputTime" label="时间" align="center" :formatter="dateFormat"></el-table-column>
              <el-table-column prop="mile" label="公里数" align="center"></el-table-column>
              <el-table-column prop="seriesName" label="车型" align="center"></el-table-column>
              <el-table-column prop="carNumber" label="车牌" align="center"></el-table-column>
              <el-table-column prop="carCylinder" label="发动机缸数" align="center"></el-table-column>
              <el-table-column prop="busType" label="类别" align="center" :formatter="busTypeFormat"></el-table-column>
              <el-table-column prop="p8021" label="8021（瓶）油路" align="center"></el-table-column>
              <el-table-column prop="p8022" label="8022（瓶）气路" align="center"></el-table-column>
              <el-table-column prop="lbsgn" label="LBSGN（瓶）" align="center"></el-table-column>
              <el-table-column prop="lbssj" label="LBSSJ（瓶）烧机油治理" align="center"></el-table-column>
              <el-table-column prop="canFree" label="是否转化" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.canFree==1?"是":""}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="pagination" v-if="tabIndex==1">
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
    </div>
  </div>
</template>

<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      filterFree: 0,
      filterFreeList: [
        { id: 0, name: "检测项-不过滤已转化" },
        { id: 1, name: "检测项-过滤已转化" }
      ],
      groupId: 2,
      groupArr: [], //所有集团
      orgId: "",
      orgIdArr: [], //集团下所有站点
      StartTime: "",
      EndTime: "",
      tabIndex: 0,
      tabAdataList: [],
      tabBdataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      urlArr: [
        "admin/carInfo/queryCarBrandPage",
        "admin/carInfo/queryCarFactoryPage"
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    this.groupNm();
    this.groupChange(2);
  },
  methods: {
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
    checkInput() {
      if (this.orgId == "" || this.orgId == 0) {
        net.message(this, "请选择检测站点", "warning");
        return false;
      }
      return true;
    },
    clickSearch() {
      if (this.checkInput()) {
        this.tabAdataList = [];
        this.tabBdataList = [];
        if (this.tabIndex == 0) {
          this.getCountInfo();
        } else if (this.tabIndex == 1) {
          this.getDetailList();
        } else {
          net.message(this, "请刷新页面重试!", "warning");
        }
      }
    },
    exportForm() {
      var url =
        net.baseUrl + "admin/newReportExcel/exportFinancialDetailForOrg?";
      url += "jobOrgId=" + this.orgId;
      url += "&filterFree=" + this.filterFree;
      url += "&StartTime=" + this.StartTime;
      url += "&EndTime=" + this.EndTime;
      window.open(url);
    },
    getCountInfo() {
      net
        .request(
          "admin/financial/queryFinancialCountInfo",
          "post",
          {
            jobOrgId: this.orgId,
            filterFree: this.filterFree,
            StartTime: this.StartTime,
            EndTime: this.EndTime
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.tabAdataList = res.data.rows;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    getDetailList() {
      net
        .request(
          "admin/financial/queryFinancialDetailForOrg",
          "post",
          {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            jobOrgId: this.orgId,
            filterFree: this.filterFree,
            StartTime: this.StartTime,
            EndTime: this.EndTime
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.tabBdataList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
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
