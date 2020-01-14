<template>
  <div>
    <div class="searchContent">
      <el-input placeholder="请输入车牌号" v-model="carPai" clearable></el-input>

      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
    </div>
    <div>
      <el-table :data="listData" border style="width: 99%">
        <el-table-column prop="carNumber" label="车牌" align="center"></el-table-column>
        <el-table-column label="车辆信息" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.factoryName}}</span>
            <br />
            <span>{{scope.row.seriesName}}</span>
            <br />
            <span>{{scope.row.modelName}}</span>
            <br />
          </template>
        </el-table-column>
        <el-table-column
          prop="inputTime"
          align="center"
          label="下单时间"
          color="#f40"
          :formatter="formartTime"
        ></el-table-column>
        <el-table-column
          prop="orgName"
          align="center"
          label="下单站点"
          v-if="this.orderPageShowOrgName"
        ></el-table-column>
        <el-table-column align="center" label="业务类型">
          <template slot-scope="scope">
            <span>{{scope.row.checkType | type}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" align="center" label="故障描述"></el-table-column>
        <el-table-column prop="carCylinder" align="center" label="发动机缸数量"></el-table-column>
        <el-table-column fixed="right" label="打印" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                @click="seeFirstReport(scope.row)"
                type="success"
                style="background: #009688;"
                size="small"
              >打印检测报告</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                @click="start(scope.row)"
                type="success"
                style="background: #009688;"
                size="small"
              >开始复查</el-button>
              <!-- <el-button @click="concel(scope.row)" type="warning" size="small">撤销</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="冻结" align="center" width="100">
          <template slot-scope="scope">
            <el-button @click="frozen(scope.row)" type="danger" size="small">冻结工单</el-button>
          </template>
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
      orderPageShowOrgName: false,
      listData: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      dialogVisible: false,
      jobId: "",
      orgId: "",
      version: "",
      carPai: null,
      page: this.$route.params
    };
  },
  created() {
    var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
    this.orderPageShowOrgName = signInfo.orgId == 0;
    if (this.page.pageNo == undefined) {
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 6 }
      );
    } else {
      this.getlistData(
        { pageNo: this.page.pageNo, pageSize: this.page.pageSize },
        { type: 6, carNumber: this.page.carNumber }
      );
      this.pageSize = this.page.pageSize;
      this.pageNo = this.page.pageNo;
      this.carPai = this.page.carNumber;
    }
  },
  filters: {
    type(d) {
      var arr = ["", "检测", "治疗", "检测+治疗"];
      return arr[d];
    }
  },
  methods: {
    formartTime(row) {
      return net.dateFormat(row.inputTime, 1);
    },
    //冻结
    frozen(row) {
      this.$confirm("此操作将冻结此工单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        net
          .request("admin/abnormalOrder/frozenByUser", "post", {
            jobId: row.jobId,
            version: row.version
          })
          .then(res => {
            if (res.retcode == 1) {
              net.message(this, "操作成功", "success");
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 6 }
              );
            }
          });
      });
    },
    getlistData(param, data) {
      net
        .request("admin/order/queryListPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.listData = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
          console.log(res);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 6 }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 6 }
      );
    },
    start(row) {
      net
        .request("admin/order/reExamination", "post", {
          jobId: row.jobId,
          version: row.version
        })
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            var skip = net.isJump("/recheckPic");
            if (skip) {
              this.$router.push({ path: "/recheckPic" });
            } else {
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 6 }
              );
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    concel(row) {
      net
        .request("admin/order/revokeOrder", "post", {
          jobId: row.jobId,
          step: 2,
          version: row.version
        })
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            var skip = net.isJump("/recheckPic");
            if (skip) {
              this.$router.push({ path: "/recheckPic" });
            } else {
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 6 }
              );
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    search() {
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 6, carNumber: this.carPai }
      );
    },
    seeFirstReport(row) {
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 3,
          row: row,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          carNumber: this.carPai,
          enter: false,
          print: true
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.searchContent {
  margin: 10px 0 20px 0;
  display: flex;
  flex-direction: row;
  .el-input--suffix {
    width: 200px;
    margin-right: 20px;
  }
}
.pagination {
  position: relative;
  margin-top: 20px;
  .el-pagination {
    position: absolute;
    left: 0px;
    .el-pager li:not(.disabled) {
      .active {
        background: #009688 !important;
      }
    }
  }
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #009688;
}
</style>

