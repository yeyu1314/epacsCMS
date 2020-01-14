<template>
  <div class="content">
    <div class="search">
      <div class="p_select">
        <el-input placeholder="请输入姓名" v-model="userName" clearable></el-input>
      </div>
      <div class="p_select">
        <el-date-picker
          v-model="value2"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM"
        >></el-date-picker>
      </div>
      <div class="p_select">
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" @click="exportForm" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div style="margin-top:15px" v-show="tabularData">
      <el-table :data="listArr" border style="width: 99%">
        <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="logMonth" label="日期" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.logMonth | logMonth}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="step1Edit" label="检测报告编辑数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.step1Edit==0?"-":scope.row.step1Edit}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="step1Examine" label="检测报告审核数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.step1Examine==0?"-":scope.row.step1Examine}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="step2Edit" label="复查报告编辑数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.step2Edit==0?"-":scope.row.step2Edit}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="step2Examine" label="复查报告审核数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.step2Examine==0?"-":scope.row.step2Examine}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      userName: "",
      value2: "",
      listArr: [],
      total1: null,
      tabularData: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        logMonth: "",
        userName: null
      },
      // pickerOptions: {
        // disabledDate(time) {
        //   const start = new Date();
        //   return time.getMonth() > start.getMonth() - 1;
        // }
      // }
    };
  },
  created() {},
  filters: {
    logMonth(data) {
      let str = data.toString();
      let str1 = str.substring(0, 4) + "-" + str.substring(4, 6);
      return str1;
    }
  },
  methods: {
    getList(page) {
      net.request("admin/newReport/DATAReportMonth", "post", page).then(res => {
        if (res.retcode == 1) {
          this.tabularData = true;
          this.listArr = res.data;
          //   this.total1 = res.data.total;
        } else {
          this.$message.error(res.retmsg);
        }
      });
    },
    //查询
    clickSearch() {
      // let page;
      // let cost;
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择查询日期");
        return false;
      } else {
        this.page = {
          //   pageNo: this.page.pageNo,
          //   pageSize: this.page.pageSize,
          logMonth: this.value2.split("-").join(""),
          userName: this.userName
        };
        this.getList(this.page);
      }
    },
    exportForm() {
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择查询日期");
        return false;
      } else {
        this.download();
      }
    },
    download() {
      let url;
      url =
        net.baseUrl +
        "admin/newReportExcel/DATAReportMonth" +
        "?logMonth=" +
        this.value2.split("-").join("") +
        "&userName=" +
        this.userName; //get方式要encode一下, 后端接收参数data

      window.open(url);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList(this.page, null);
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.getList(this.page, null);
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
