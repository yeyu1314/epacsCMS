<template>
  <div class="content">
    <div class="search">
      <div class="p_select">
        <el-select v-model="value5" clearable placeholder="请选择区" @change="areaChange">
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
          v-model="value6"
          clearable
          placeholder="请选择省"
          :disabled="provinceDisabled"
          @change="provinceChange"
        >
          <el-option
            v-for="item in provinceData"
            :key="item.id"
            :label="item.provinceName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select
          v-model="value7"
          clearable
          placeholder="请选择县"
          :disabled="repairDisabled"
          @change="repairSite"
        >
          <el-option
            v-for="item in cityData"
            :key="item.id"
            :label="item.cityName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select
          clearable
          v-model="orgin"
          filterable
          placeholder="请选择检测站点"
          @change="orginChange"
          :disabled="orginDisabled"
        >
          <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select clearable v-model="type" placeholder="请选择服务类型">
          <el-option
            v-for="item in typeDataArr"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select
          clearable
          v-model="serviceAdvisor"
          @change="serviceAdvisorSelect"
          placeholder="请选择工程师类型"
        >
          <el-option
            v-for="item in serviceAdvisorArr"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select clearable v-model="engineer" placeholder="请选择工程师">
          <el-option
            v-for="item in engineerArr"
            :key="item.id"
            :label="item.nickName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-date-picker
          v-model="value2"
          type="month"
          format="yyyy 年 MM 月"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="seleteMonth"
        ></el-date-picker>
      </div>
      <div class="p_select">
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" @click="exportForm" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div style="margin-top:15px" v-show="tabularData">
      <!-- <div style="margin-bottom: 10px;font-size:14px;text-align:left">
      <el-row :gutter="20">
      <el-col :span="5">合计项：</el-col>
      <el-col :span="5">检测台次：{{totalCheckCount}}</el-col>
      <el-col :span="5">治疗台次：{{totalRepairCount}}</el-col>
      <el-col :span="5">用料成本：{{totalPrice}}</el-col>
    </el-row>
    </div>
    <div style="margin-bottom: 10px;font-size:14px;text-align:left">
      <el-row :gutter="20">
      <el-col :span="5">动力康复剂（8021）：{{totalType1}}</el-col>
      <el-col :span="5">动力康复剂（8022）：{{totalType2}}</el-col>
      <el-col :span="5">总收入：{{totalIncome}}</el-col>
    </el-row>
      </div>-->
      <template>
        <el-table
          :data="listArr"
          :summary-method="getSummaries"
          show-summary
          border
          :header-cell-style="getRowClass"
          style="width: 100%;"
        >
          <el-table-column prop="orgName" label="检测站点" align="center" min-width="80"></el-table-column>
          <el-table-column prop="userName" :label="consultant" align="center" min-width="80"></el-table-column>
          <el-table-column
            prop="inputTime"
            :formatter="tiem"
            label="时间"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="serviceType"
            prop="address"
            label="服务类型"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column prop="carNumber" label="车牌" align="center" min-width="80"></el-table-column>
          <el-table-column prop="seriesName" label="车型" align="center" min-width="80"></el-table-column>
          <el-table-column prop="realPrice" label="价格" align="center" min-width="80"></el-table-column>
        </el-table>
      </template>
      <div style="text-align:left;margin-top:15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20,30]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
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
      orgin: "",
      orginArr: [],
      areaData: [],
      cityData: [],
      value5: "",
      value6: "",
      value7: "",
      value2: "",
      value3: "",
      listArr: [],
      provinceData: [],
      total1: null,
      tabularData: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        dateMonth: "",
        cityId: "",
        checkType: "",
        orgId: "",
        userId: ""
      },
      cost: {
        dateMonth: "",
        orgId: "",
        area: "",
        province: "",
        city: ""
      },
      totalCheckCount: "",
      totalRepairCount: "",
      totalPrice: "",
      totalType1: "",
      totalType2: "",
      totalIncome: "",
      totalFirstAmt: "",
      totalRecheckAmt: "",
      totalFirstFee: "",
      totalRecheckFee: "",
      totalFee: "",
      typeDataArr: [
        {
          value: 1,
          name: "检测"
        },
        {
          value: 2,
          name: "治疗"
        },
        {
          value: 3,
          name: "检测+治疗"
        }
      ],
      serviceAdvisorArr: [
        {
          value: 1,
          name: "SA服务顾问"
        },
        {
          value: 2,
          name: "维修技师"
        }
      ],
      engineer: "",
      engineerArr: [],
      type: "",
      serviceAdvisor: "",
      provinceDisabled: true,
      repairDisabled: true,
      orginDisabled: true,
      consultant: "",
      totalC: ""
    };
  },
  created() {
    this.getareaData();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return {
          // "font-weight": "600",
          "font-size": "15px",
          'color':'#4f81bd'
        };
      } else {
        return "";
      }
    },
    //获取站点
    getOrgin(val) {
      net
        .request(
          "admin/Organization/getOrganizationAll",
          "post",
          {
            cityId: val
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.orginArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    getList(url, page, page1) {
      net.request(url, "post", page, page1).then(res => {
        if (res.retcode == 1) {
          this.listArr = res.data.rows;
          this.total1 = res.data.total;
          this.tabularData = true;
        } else {
          this.$message.error(res.retmsg);
        }
      });
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
    areaChange(value) {
      if (value == "" || value == null) {
        this.provinceData = [];
        this.cityData = [];
        this.value6 = "";
        this.value7 = "";
        this.orgin = "";
        this.serviceAdvisor = "";
        this.provinceDisabled = true;
        this.repairDisabled = true;
        this.orginDisabled = true;
      } else {
        this.provinceDisabled = false;
        this.getprovinceData(value);
      }
    },
    //获取省系
    getprovinceData(areaId) {
      net
        .request("admin/select/getProvince", "post", { areaId: areaId })
        .then(res => {
          if (res.retcode == 1) {
            this.provinceData = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    orginChange(value) {
      if (value == "" || value == null) {
        this.serviceAdvisor = "";
      }
    },
    serviceAdvisorSelect(val) {
      this.engineer = "";
      if (val == 1) {
        this.getSa();
      } else {
        this.getjs();
      }
    },
    getSa() {
      net
        .request(
          "admin/orgUser/queryUserByOrgId",
          "post",
          {
            orgId: this.orgin
          },
          null
        )
        .then(res => {
          console;
          if (res.retcode == 1) {
            this.engineerArr = res.data;
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    getjs() {
      net
        .request("admin/engineer/queryEngineerByOrgId", "post", {
          orgId: this.orgin
        })
        .then(res => {
          console.log(res);
          if (res.retcode == 1) {
            this.engineerArr = res.data;
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    repairSite(value) {
      if (value == null || value == "") {
        this.orginDisabled = true;
        this.orgin = "";
        this.serviceAdvisor = "";
      } else {
        this.orginDisabled = false;
        this.getOrgin(value);
      }
    },
    provinceChange(value) {
      if (value == "" || value == null) {
        this.cityData = [];
        this.value7 = "";
        this.orgin = "";
        this.serviceAdvisor = "";
        this.repairDisabled = true;
        this.orginDisabled = true;
      } else {
        this.repairDisabled = false;
        this.getcityData(value);
      }
    },
    //获取市县
    getcityData(provinceId) {
      net
        .request("admin/select/getCity", "post", { provinceId: provinceId })
        .then(res => {
          if (res.retcode == 1) {
            this.cityData = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //查询
    clickSearch() {
      let page;
      if (this.value7 == "" || this.value7 == null) {
        this.$message.error("请选择城市");
        return;
      }
      if (this.value7 == "" || this.value7 == null) {
        this.$message.error("请选择城市");
        return;
      }
      if (this.engineer == "" || this.engineer == null) {
        this.$message.error("请选择工程师");
        return;
      }
      if (this.orgin == "" || this.orgin == null) {
        this.$message.error("请选择维修站点");
        return;
      }
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择月份");
        return;
      }
      page = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        dateMonth: this.value2,
        orgId: this.orgin,
        cityId: this.value7,
        checkType: this.type,
        userId: this.engineer
      };

      this.page = page;
      if (this.serviceAdvisor == 1) {
        this.consultant = "SA服务顾问";
        this.getList("admin/examine/queryMonthAssessmentSA", this.page, null);
        this.getSaTotal(this.page);
      } else if (this.serviceAdvisor == 2) {
        this.consultant = "维修工程师";
        this.getList(
          "admin/examine/queryMonthAssessmentMaintain",
          this.page,
          null
        );
        this.getTechnicianToatal(this.page);
      }
      // this.getTotalPrice(cost)
      // this.getList(this.page)
    },
    seleteMonth(value) {
      if (value == "" || value == null) {
        return;
      }
      this.clickSearch();
    },
    exportForm() {
      if (this.value7 == "" || this.value7 == null) {
        this.$message.error("请选择城市");
        return;
      }
      if (this.value7 == "" || this.value7 == null) {
        this.$message.error("请选择城市");
        return;
      }
      if (this.engineer == "" || this.engineer == null) {
        this.$message.error("请选择工程师");
        return;
      }
      if (this.orgin == "" || this.orgin == null) {
        this.$message.error("请选择维修站点");
        return;
      }
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择月份");
        return;
      }
      this.download();
    },

    download() {
      let url;
      url =
        net.baseUrl +
        "admin/examine/writeExcelQueryAssessment" +
        "?dateMonth=" +
        this.value2 +
        "&cityId=" +
        this.value7 +
        "&checkType=" +
        this.type +
        "&orgId=" +
        this.orgin +
        "&userId=" +
        this.engineer +
        "&userType=" +
        this.serviceAdvisor; //get方式要encode一下, 后端接收参数data

      window.open(url);
    },
    //获取合计项
    getTotalPrice(obj) {
      net
        .request("admin/examine/queryMonthIncomeCount", "get", obj, null)
        .then(res => {
          if (res.retcode) {
            this.totalCheckCount = res.data.checkCount;
            this.totalRepairCount = res.data.repairCount;
            this.totalPrice = res.data.price;
            this.totalType1 = res.data.type8021;
            this.totalType2 = res.data.type8022;
            this.totalFirstAmt = res.data.firstAmt;
            this.totalRecheckAmt = res.data.recheckAmt;
            this.totalFirstFee = res.data.firstFee.toFixed(2);
            this.totalRecheckFee = res.data.recheckFee.toFixed(2);
            this.totalFee = res.data.totalFee.toFixed(2);
            this.totalIncome = res.data.income.toFixed(2);
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    getSaTotal(obj) {
      net
        .request("admin/examine/queryMonthAssessmentSACount", "post", obj, null)
        .then(res => {
          if (res.retcode == 1) {
            this.totalC = res.data;
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    getTechnicianToatal(obj) {
      net
        .request(
          "admin/examine/queryMonthAssessmentMaintainCount",
          "post",
          obj,
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.totalC = res.data;
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    //合计栏列
    getSummaries(param) {
      console.log(param);
      const { columns, data } = param;
      const sums = ["合计项", "", "", this.total1, "", "", this.totalC];

      return sums;
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      if (this.serviceAdvisor == 1) {
        // this.consultant = "SA服务顾问";
        this.getList("admin/examine/queryMonthAssessmentSA", this.page, null);
      } else if (this.serviceAdvisor == 2) {
        // this.consultant = "维修工程师";
        this.getList(
          "admin/examine/queryMonthAssessmentMaintain",
          this.page,
          null
        );
        }
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      if (this.serviceAdvisor == 1) {
        // this.consultant = "SA服务顾问";
        this.getList("admin/examine/queryMonthAssessmentSA", this.page, null);
        this.getSaTotal(this.page);
      } else if (this.serviceAdvisor == 2) {
        // this.consultant = "维修工程师";
        this.getList(
          "admin/examine/queryMonthAssessmentMaintain",
          this.page,
          null
        );
        }
    },

    renderheader(h, { column, $index }) {
      console.log(h);
      return h("span", {}, [
        h("span", {}, column.label.split("|")[0]),
        h("br"),
        h("span", {}, column.label.split("|")[1])
      ]);
    },

    checkCount(row) {
      return ((row.repairCount / row.checkCount) * 100).toFixed(2) + "%";
    },
    dailyAverage(row) {
      return (row.repairCount / row.days).toFixed(2);
    },
    cost1(row) {
      return row.firstAmt.toFixed(2);
    },
    cost2(row) {
      return row.recheckAmt.toFixed(2);
    },
    cost3(row) {
      return row.price.toFixed(2);
    },
    cost4(row) {
      return row.firstFee.toFixed(2);
    },
    cost5(row) {
      return row.recheckFee.toFixed(2);
    },
    cost6(row) {
      return row.totalFee.toFixed(2);
    },
    cost7(row) {
      return row.income.toFixed(2);
    },
    tiem(row) {
      return net.dateFormat(row.inputTime, 0);
    },
    serviceType(row) {
      if (row.checkType == 1) {
        return "检测";
      }
      if (row.checkType == 2) {
        return "治疗";
      }
      if (row.checkType == 3) {
        return "检测+治疗";
      }
    }
  }
};
</script>
<style lang="less"  scoped>
.content {
  display: flex;
  flex-direction: column;
  .search {
    display: flex;
    flex-wrap: wrap;
    .p_select {
      margin-right: 15px;
      margin-top: 15px;
      .radio {
      }
    }
  }
  .table {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    position: relative;
    .m_select {
      display: flex;
      flex-direction: row;
      p {
        height: 42px;
        line-height: 42px;
        margin-left: 30px;
        color: #9c9c9c;
        font-size: 14px;
      }
    }
    .tableContent {
      margin-top: 10px;
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
}
</style>
