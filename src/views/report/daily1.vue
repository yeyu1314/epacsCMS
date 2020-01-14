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
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM"
          format="yyyy-MM"
          v-model="value2"
          @change="changeDate"
        ></el-date-picker>
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
      <!-- <div class="p_select">
        <el-select clearable v-model="orgin" filterable placeholder="请选择检测站点">
          <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
        </el-select>
      </div>-->
      <div class="p_select">
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" @click="exportForm" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div style="margin-top:15px" v-show="tabularData">
      <template>
        <el-table :data="listArr" border :cell-style="getRowClass" :header-cell-style="getClass">
          <el-table-column fixed="left" prop="orgname" label="检测站点" align="center" min-width="200"></el-table-column>
          <el-table-column prop="checkcount1" label="1日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount2" label="2日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount3" label="3日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount4" label="4日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount5" label="5日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount6" label="6日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount7" label="7日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount8" label="8日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount9" label="9日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount10" label="10日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount11" label="11日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount12" label="12日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount13" label="13日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount14" label="14日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount15" label="15日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount16" label="16日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount17" label="17日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount18" label="18日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount19" label="19日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount20" label="20日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount21" label="21日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount22" label="22日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount23" label="23日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount24" label="24日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount25" label="25日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount26" label="26日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount27" label="27日" align="center" min-width="60"></el-table-column>
          <el-table-column prop="checkcount28" label="28日" align="center" min-width="60"></el-table-column>
          <el-table-column
            prop="checkcount29"
            label="29日"
            align="center"
            min-width="60"
            v-if="hideRow1"
          ></el-table-column>
          <el-table-column
            prop="checkcount30"
            label="30日"
            align="center"
            min-width="60"
            v-if="hideRow2"
          ></el-table-column>
          <el-table-column
            prop="checkcount31"
            label="31日"
            align="center"
            min-width="60"
            v-if="hideRow3"
          ></el-table-column>

          <el-table-column fixed="right" prop="checktotal" label="汇总" align="center" min-width="80"></el-table-column>
          <el-table-column fixed="right" prop="rank" label="排名" :formatter="rankType" align="center" min-width="80"></el-table-column>
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
      edit_groupId: "",
      // orginArr: [],
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
      hideRow1: true,
      hideRow2: true,
      hideRow3: true,
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
      label: ""
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
    dateAddDays(dataStr, dayCount) {
      var strdate = dataStr; //日期字符串
      var isdate = new Date(strdate.replace(/-/g, "/")); //把日期字符串转换成日期格式
      isdate = new Date((isdate / 1000 + 86400 * dayCount) * 1000); //日期加1天
      var pdate = isdate.getMonth() + 1 + "-" + isdate.getDate(); //把日期格式转换成字符串

      return pdate;
    },
    getList(page, shape) {
      net
        .request("admin/weekDaysReport/getDayNoCure", "post", page, shape)
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
    provinceChange(value) {
      this.cityData = [];
      this.value7 = "";
      this.getcityData(value);
    },
    changeDate() {
      this.tabularData = false;
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
    getClass({ row, column, rowIndex, columnIndex }) {
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
    getRowClass({ row, column, rowIndex, columnIndex }) {
      var date = this.value2;
      var y = date.substring(0, 4).toString();
      var m = date.substring(5, 7).toString();
      var day = 0;
      if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12)
        day = 31;
      else if (m == 4 || m == 6 || m == 9 || m == 11) {
        day = 30;
      } else if (m == 2) {
        day = 28 + (y % 4 == 0 && (y % 100 == 0 && y % 400 == 0) ? 1 : 0);
      }
      if (day == 28) {
        (this.hideRow1 = false),
          (this.hideRow2 = false),
          (this.hideRow3 = false);
      } else if (day == 29) {
        (this.hideRow1 = true),
          (this.hideRow2 = false),
          (this.hideRow3 = false);
      } else if (day == 30) {
        (this.hideRow1 = true), (this.hideRow2 = true), (this.hideRow3 = false);
      } else if (day == 31) {
        (this.hideRow1 = true), (this.hideRow2 = true), (this.hideRow3 = true);
      }
    },
    //查询
    clickSearch() {
      let page;
      let cost;
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("日期为必填项");
      } else if (this.value2) {
        page = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          date: this.value2,
          groupId: this.edit_groupId,
          area: this.value5,
          province: this.value6,
          city: this.value7
        };
        cost = {
          dateMonth: this.value2,
          groupId: this.edit_groupId,
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
        this.$message.error("请选择查询月份");
        return;
      }
      this.download();
    },

    download() {
      let url;
      url =
        net.baseUrl +
        "admin/weekDaysReport/daily1" +
      "?pageNo="+this.page.pageNo+"&pageSize="+this.page.pageSize+"&date="+this.value2+"&groupId="+this.edit_groupId+"&area="+this.value5+"&province="+this.value6+"&city="+this.value7 //get方式要encode一下, 后端接收参数data

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
    }

    // renderheader(h, { column, $index }) {
    //   console.log(h);
    //   return h("span", {}, [
    //     h("span", {}, column.label.split("|")[0]),
    //     h("br"),
    //     h("span", {}, column.label.split("|")[1])
    //   ]);
    // }
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
        color: #4f81bd;
        font-size: 14px;
      }
    }
    .el-table thead {
      color: #4f81bd;
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
