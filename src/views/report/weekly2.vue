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
        <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          v-model="value2"
          @change="changeDate"
        ></el-date-picker>
      </div>
      <div class="p_select">
        <el-select clearable v-model="ranType" filterable placeholder="请选择排名方式">
          <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
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
        <el-select v-model="value7" clearable placeholder="请选择县">
          <el-option
            v-for="item in cityData"
            :key="item.id"
            :label="item.cityName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" @click="exportForm" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div style="margin-top:15px" v-show="tabularData">
      <template>
        <el-table :data="listArr" border :cell-style="getRowClass" :header-cell-style="getClass" style="width: 100%;">
          <el-table-column prop="orgName" fixed="left" label="检测站点" align="center" min-width="120"></el-table-column>
          <el-table-column prop="checkCount" :label="label1" align="center" min-width="120">
            <el-table-column prop="checkCount1" label="检测" align="center" min-width="40"></el-table-column>
            <el-table-column prop="cureCount1" label="治疗" align="center" min-width="40"></el-table-column>
            <el-table-column
              prop="rank1"
              label="排名"
              :formatter="rankType"
              align="center"
              min-width="40"
            ></el-table-column>
          </el-table-column>
          <el-table-column prop="repairCount" :label="label2" align="center" min-width="120">
            <el-table-column prop="checkCount2" label="检测" align="center" min-width="40"></el-table-column>
            <el-table-column prop="cureCount2" label="治疗" align="center" min-width="40"></el-table-column>
            <el-table-column
              prop="rank2"
              label="排名"
              :formatter="rankType"
              align="center"
              min-width="40"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            prop="type8021"
            :label="label3"
            :render-header="renderheader"
            align="center"
            min-width="120"
          >
            <el-table-column prop="checkCount3" label="检测" align="center" min-width="40"></el-table-column>
            <el-table-column prop="cureCount3" label="治疗" align="center" min-width="40"></el-table-column>
            <el-table-column
              prop="rank3"
              label="排名"
              :formatter="rankType"
              align="center"
              min-width="40"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            prop="type8022"
            :label="label4"
            :render-header="renderheader"
            align="center"
            min-width="120"
          >
            <el-table-column prop="checkCount4" label="检测" align="center" min-width="40"></el-table-column>
            <el-table-column prop="cureCount4" label="治疗" align="center" min-width="40"></el-table-column>
            <el-table-column
              prop="rank4"
              label="排名"
              :formatter="rankType"
              align="center"
              min-width="40"
            ></el-table-column>
          </el-table-column>
          <el-table-column prop="firstAmt" :label="label5" align="center" min-width="120">
            <el-table-column prop="checkCount5" label="检测" align="center" min-width="40"></el-table-column>
            <el-table-column prop="cureCount5" label="治疗" align="center" min-width="40"></el-table-column>
            <el-table-column
              prop="rank5"
              label="排名"
              :formatter="rankType"
              align="center"
              min-width="40"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            prop="recheckAmt"
            label="合计"
            align="center"
            min-width="160"
          >
            <el-table-column prop="checktotal" label="检测" align="center" min-width="40"></el-table-column>
            <el-table-column prop="curetotal" label="治疗" align="center" min-width="40"></el-table-column>
            <el-table-column prop="conversionRate" label="转化率" align="center" :formatter="conversionRateType" min-width="40"></el-table-column>
            <el-table-column prop="rank" label="排名" align="center" min-width="40"></el-table-column>
          </el-table-column>
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
      ranType: "",
      orginArr: [{ id: 1, orgName: "检测" }, { id: 2, orgName: "治疗" }],
      edit_groupId: "",
      areaData: [],
      cityData: [],
      value5: "",
      value6: "",
      value7: "",
      value2: "",
      value3: "",
      edit_groupId: "",
      listArr: [],
      groupArr: [],
      provinceData: [],
      total1: null,
      tabularData: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        dateMonth: "",
        edit_groupId: null,
        area: "",
        province: "",
        city: ""
      },
      cost: {
        dateMonth: "",
        groupId: "",
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
      label1: "",
      label2: "",
      label3: "",
      label4: "",
      label5: ""
    };
  },
  created() {
    this.groupNm();
    this.getareaData();
    // this.getOrgin(0);
  },
  methods: {
    //排行转换
    rankType(row, column, cellValue) {
      if (cellValue <= 0) {
        return "";
      } else {
        return cellValue;
      }
    },
    getClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        return {
          "border-right-color": "#000",
          "border-left-color": "#000"
        };
      } else if (rowIndex === 0) {
        return {
          "font-size": "15px",
          'color':'#4f81bd',
          "border-right-color": "#000",
          "border-left-color": "#000"
        };
      } else {
        return "";
      }

    },
    conversionRateType(row, column, cellValue) {
      if (cellValue) {
        return cellValue+"%";
      }
    },
    avgCheckType(row, column, cellValue) {
      if (cellValue) {
        return cellValue.toFixed(2);
      } else {
        return "";
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex==0||columnIndex==3||columnIndex==6||columnIndex==9||columnIndex==12||columnIndex==15||columnIndex==16||columnIndex==17||columnIndex==18 ) {
          return {
            "border-right-color": "#000"
          };
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
    // //获取站点
    // getOrgin(val) {
    //   net.request("admin/Organization/getOrganizationAll", "post",{
    //     cityId:val
    //   },null).then(res => {
    //     if (res.retcode == 1) {
    //       this.orginArr = res.data;
    //     } else {
    //       net.message(this, "获取数据失败", "warning");
    //     }
    //   });
    // },
    dateAddDays(dataStr, dayCount) {
      var strdate = dataStr; //日期字符串
      var isdate = new Date(strdate.replace(/-/g, "/")); //把日期字符串转换成日期格式
      isdate = new Date((isdate / 1000 + 86400 * dayCount) * 1000); //日期加1天
      var pdate = isdate.getMonth() + 1 + "-" + isdate.getDate(); //把日期格式转换成字符串

      return pdate;
    },
    getList(page, shape) {
      net
        .request("admin/weekDaysReport/getWeekNoCure", "post", page, shape)
        .then(res => {
          if (res.retcode == 1) {
            console.log(res);
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
    //  repairSite(value){
    //     this.getOrgin(value)
    //     if(value == null || value == ''){
    //       this.getOrgin(0)
    //     }else{
    //       this.getOrgin(value)
    //     }
    //   },
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
    changeDate() {
      let text;
      let day = new Date(this.value2).getDay();
      switch (day) {
        case 0:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          break;
        case 1:
          text = this.value2;
          break;
      }
      if (text === undefined) {
        this.$message.error("请选择本周周的周一");
        this.value2 = "";
      }
    },
    //查询
    clickSearch() {
      let page;
      let cost;
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("日期为必填项");
      } else if (this.value2) {
        var date = this.dateAddDays(this.value2, 0);
        var date0 = this.dateAddDays(date, 0);
        var date1 = this.dateAddDays(date0, 6);
        var date9 = this.dateAddDays(date1, 1);
        var date2 = this.dateAddDays(date9, 6);
        var date3 = this.dateAddDays(date2, 1);
        var date4 = this.dateAddDays(date3, 6);
        var date5 = this.dateAddDays(date4, 1);
        var date6 = this.dateAddDays(date5, 6);
        var date7 = this.dateAddDays(date6, 1);
        var date8 = this.dateAddDays(date7, 6);
        this.label1 = date0 + "~" + date1;
        this.label2 = date9 + "~" + date2;
        this.label3 = date3 + "~" + date4;
        this.label4 = date5 + "~" + date6;
        this.label5 = date7 + "~" + date8;
        page = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          date: this.value2,
          groupId: this.edit_groupId,
          rankType:this.ranType,
          area: this.value5,
          province: this.value6,
          city: this.value7
        };
        cost = {
          dateMonth: this.value2,
          area: this.value5,
          province: this.value6,
          city: this.value7
        };
        this.page = page;
        // this.getTotalPrice(cost);
        this.getList(this.page, null);
      }
    },
    exportForm() {
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择查询日期");
        return;
      }
      this.download();
    },

    download() {
      let url;
      url =
        net.baseUrl +
        "admin/weekDaysReport/weekly2" +
      "?pageNo="+this.page.pageNo+"&pageSize="+this.page.pageSize+"&date="+this.value2+"&groupId="+this.edit_groupId+"&area="+this.value5+"&province="+this.value6+"&city="+this.value7

      window.open(url);
    },
    // //获取合计项
    // getTotalPrice(obj) {
    //   net
    //     .request("admin/examine/queryMonthIncomeCount", "get", obj, null)
    //     .then(res => {
    //       if (res.retcode) {
    //         console.log(res)
    //         // totalCheckCount:'',
    //         //       totalRepairCount:'',
    //         //       totalPrice:'',
    //         //       totalType1:'',
    //         //       totalType2:'',
    //         //       totalIncome:'',
    //         //       totalFirstAmt:'',
    //         //       totalRecheckAmt:'',
    //         //       totalFirstFee:'',
    //         //       totalRecheckFee:'',
    //         //       totalFee:''

    //         this.totalCheckCount = res.data.checkCount;
    //         this.totalRepairCount = res.data.repairCount;
    //         this.totalPrice = res.data.price;
    //         this.totalType1 = res.data.type8021;
    //         this.totalType2 = res.data.type8022;
    //         this.totalFirstAmt = res.data.firstAmt;
    //         this.totalRecheckAmt = res.data.recheckAmt;
    //         this.totalFirstFee = res.data.firstFee.toFixed(2);
    //         this.totalRecheckFee = res.data.recheckFee.toFixed(2);
    //         this.totalFee = res.data.totalFee.toFixed(2);
    //         this.totalIncome = res.data.income.toFixed(2);
    //       } else {
    //         this.$message.error(res.retmsg);
    //       }
    //     });
    // },
    // //合计栏列
    // getSummaries(param) {
    //   console.log(param);
    //   const { columns, data } = param;
    //   const sums = [
    //     "合计项",
    //     this.totalCheckCount,
    //     this.totalRepairCount,
    //     this.totalType1,
    //     this.totalType2,
    //     this.totalFirstAmt,
    //     this.totalRecheckAmt,
    //     this.totalPrice,
    //     this.totalFirstFee,
    //     this.totalRecheckFee,
    //     this.totalFee,
    //     this.totalIncome
    //   ];

    //   return sums;
    // },
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
    }
  }
};

//     checkCount(row) {
//       return ((row.repairCount / row.checkCount) * 100).toFixed(2) + "%";
//     },
//     dailyAverage(row) {
//       return (row.repairCount / row.days).toFixed(2);
//     },
//     cost1(row) {
//       return row.firstAmt.toFixed(2);
//     },
//     cost2(row) {
//       return row.recheckAmt.toFixed(2);
//     },
//     cost3(row) {
//       return row.price.toFixed(2);
//     },
//     cost4(row) {
//       return row.firstFee.toFixed(2);
//     },
//     cost5(row) {
//       return row.recheckFee.toFixed(2);
//     },
//     cost6(row) {
//       return row.totalFee.toFixed(2);
//     },
//     cost7(row) {
//       return row.income.toFixed(2);
//     }
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
        color: #4f81bd;
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
