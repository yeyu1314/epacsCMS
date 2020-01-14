<template>
  <div class="content">
    <div class="search">
      <div class="p_select">
        <el-select v-model="edit_groupId" clearable filterable placeholder="请选择集团">
          <el-option
            v-for="item in groupArr"
            :key="item.groupId"
            :label="item.groupName"
            :value="item.groupId"
          ></el-option>
        </el-select>
      </div>
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
        <el-select v-model="value6" clearable placeholder="请选择省" @change="provinceChange">
          <el-option
            v-for="item in provinceData"
            :key="item.id"
            :label="item.provinceName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select v-model="value7" clearable placeholder="请选择县" @change="repairSite">
          <el-option
            v-for="item in cityData"
            :key="item.id"
            :label="item.cityName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select clearable v-model="orgin" filterable placeholder="请选择检测站点">
          <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
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
          <el-table-column prop="checkCount" label="检测台次" align="center" min-width="80"></el-table-column>
          <el-table-column prop="repairCount" label="治疗台次" align="center" min-width="80"></el-table-column>
          <el-table-column
            prop="type8021"
            label="动力康复剂8021|用量(瓶)"
            :render-header="renderheader"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="type8022"
            label="动力康复剂8022|用量(瓶)"
            :render-header="renderheader"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="cost1"
            prop="firstAmt"
            label="检测营收"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="cost2"
            prop="recheckAmt"
            label="治疗营收"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="cost3"
            prop="price"
            label="用料成本|(成本价)"
            :render-header="renderheader"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="cost4"
            prop="firstFee"
            label="检测分成|(合同订单)"
            :render-header="renderheader"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="cost5"
            prop="recheckFee"
            label="治疗分成|(合同订单)"
            :render-header="renderheader"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="cost6"
            prop="totalFee"
            label="结算金额|(含发票)"
            :render-header="renderheader"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="cost7"
            prop="income"
            label="总收入(元)"
            align="center"
            min-width="80"
          ></el-table-column>
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
      edit_groupId: "",
      value5: "",
      value6: "",
      value7: "",
      value2: "",
      value3: "",
      listArr: [],
      provinceData: [],
      groupArr: [],
      total1: null,
      tabularData: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        dateMonth: "",
        orgId: null,
        area: "",
        province: "",
        city: ""
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
    };
  },
  created() {
    this.groupNm();
    this.getareaData();
    this.getOrgin(0);
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return {
          // "font-weight": "600",
          "font-size": "15px",
          color: "#4f81bd"
        };
      } else {
        return "";
      }
    },
    //获取集团数据
    groupNm() {
      net.request("admin/group/getGroupInfoList", "post").then(res => {
        if (res.retcode == 1) {
          this.groupArr = res.data;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
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
    getList(page, shape) {
      net
        .request("admin/examine/queryMonthIncome", "post", page, shape)
        .then(res => {
          if (res.retcode == 1) {
            this.tabularData = true;
            this.listArr = res.data.rows;
            this.total1 = res.data.total;
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
      this.provinceData = [];
      this.cityData = [];
      this.value6 = "";
      this.value7 = "";
      this.getprovinceData(value);
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
    repairSite(value) {
      this.getOrgin(value);
      if (value == null || value == "") {
        this.getOrgin(0);
      } else {
        this.getOrgin(value);
      }
    },
    provinceChange(value) {
      this.cityData = [];
      this.value7 = "";
      this.getcityData(value);
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
      let cost;
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择查询月份");
        return;
      } else {
        page = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          dateMonth: this.value2,
          groupId: this.edit_groupId,
          orgId: this.orgin,
          area: this.value5,
          province: this.value6,
          city: this.value7
        };
        cost = {
          dateMonth: this.value2,
          groupId: this.edit_groupId,
          orgId: this.orgin,
          area: this.value5,
          province: this.value6,
          city: this.value7
        };
        this.page = page;
        this.getTotalPrice(cost);
        this.getList(this.page, null);
      }
    },
    seleteMonth(value) {
      if (value == "" || value == null) {
        return;
      }
    },
    exportForm() {
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择查询月份");
        return;
      }
      this.download();
    },

    download() {
      let url;
      url =
        net.baseUrl +
        "admin/examine/writeExcelQueryMonthIncome" +
        "?dateMonth=" +
        this.value2 +
        "&groupId=" +
        this.edit_groupId; //get方式要encode一下, 后端接收参数data

      window.open(url);
    },
    //获取合计项
    getTotalPrice(obj) {
      net
        .request("admin/examine/queryMonthIncomeCount", "get", obj, null)
        .then(res => {
          if (res.retcode) {
            // totalCheckCount:'',
            //       totalRepairCount:'',
            //       totalPrice:'',
            //       totalType1:'',
            //       totalType2:'',
            //       totalIncome:'',
            //       totalFirstAmt:'',
            //       totalRecheckAmt:'',
            //       totalFirstFee:'',
            //       totalRecheckFee:'',
            //       totalFee:''

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
    //合计栏列
    getSummaries(param) {
      console.log(param);
      const { columns, data } = param;
      const sums = [
        "合计项",
        this.totalCheckCount,
        this.totalRepairCount,
        this.totalType1,
        this.totalType2,
        this.totalFirstAmt,
        this.totalRecheckAmt,
        this.totalPrice,
        this.totalFirstFee,
        this.totalRecheckFee,
        this.totalFee,
        this.totalIncome
      ];

      return sums;
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList(this.page, null);
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.getList(this.page, null);
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
      margin-right: 20px;
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
