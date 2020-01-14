<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入维修站名" v-model="orgName" clearable></el-input>
      <el-input placeholder="请输入员工名" v-model="nickName" clearable></el-input>
      <el-date-picker v-model="timeArr" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyyMMdd">
    </el-date-picker>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
    </div>
    <div class="table">
      <el-table :data="conditionList" border style="width: 100%">
        <el-table-column prop="orgName" label="维修站名" align="center"></el-table-column>
        <el-table-column prop="nickName" label="员工" align="center"></el-table-column>
        <el-table-column prop="firstAmt" label="检测总费用" align="center">
            <template slot-scope="scope">{{scope.row.firstAmt | eeNaN}}</template>
        </el-table-column>
        <el-table-column prop="recheckAmt" label="复查总费用" align="center">
            <template slot-scope="scope">{{scope.row.recheckAmt | eeNaN}}</template>
        </el-table-column>
        <el-table-column prop="totalAmt" label="总费用" align="center">
            <template slot-scope="scope">{{scope.row.totalAmt | eeNaN}}</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
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
</template>

<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      conditionList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      orgName: null,
      edit_carnick: "",
      enit_id: "",
      sign: 0, //用来判断是新增还是修改
      dialogVisible: false,
      title: "",
      timeArr: null,
      nickName: ""
    };
  },
  created() {
    
    this.timeArr = [net.GetDateStr(-30),net.GetDateStr(0)]
    this.getFinanceReport(
      { pageNo: this.pageNo, pageSize: this.pageSize, startTimeStr: this.timeArr != null ? this.timeArr[0] : "", endTimeStr: this.timeArr != null ? this.timeArr[1] : ""},
      {}
    );
  },
  filters: {
      eeNaN(s) {
          if (typeof(s) == "undefined") {
              return 0
          }

          return s
      }
  },
  methods: {
    
    //获取列表数据
    getFinanceReport(param, data) {
      net
        .request("admin/report/financeReport", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.conditionList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getFinanceReport(
        { pageNo: this.pageNo, pageSize: this.pageSize, orgName: this.orgName, nickName: this.nickName, startTimeStr: this.timeArr != null ? this.timeArr[0] : "", endTimeStr: this.timeArr != null ? this.timeArr[1] : ""},
        {}
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getFinanceReport(
        { pageNo: this.pageNo, pageSize: this.pageSize, orgName: this.orgName, nickName: this.nickName, startTimeStr: this.timeArr != null ? this.timeArr[0] : "", endTimeStr: this.timeArr != null ? this.timeArr[1] : ""},
        {}
      );
    },

    search() {
      //查询
      
      this.getFinanceReport(
        { pageNo: this.pageNo, pageSize: this.pageSize, orgName: this.orgName, nickName: this.nickName, startTimeStr: this.timeArr != null ? this.timeArr[0] : "", endTimeStr: this.timeArr != null ? this.timeArr[1] : ""},
        {}
      );
    }
  }
};
</script>
<style lang="less" scoped>
#userList {
  display: flex;
  flex-direction: column;
  .searchContent {
    margin: 10px 0 20px 0;
    display: flex;
    flex-direction: row;
    .el-input--suffix {
      width: 200px;
      margin-right: 20px;
    }
    .el-button {
        margin-left: 20px;
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
