<template>
  <div>
    <div>
      <el-table :data="logData" border style="width: 99%">
        <el-table-column prop="loginIp" label="IP" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
        <el-table-column prop="url" align="center" label="接口地址" color="#f40"></el-table-column>
        <el-table-column prop="className" align="center" label="类名"></el-table-column>
        <el-table-column prop="method" align="center" label="方法名"></el-table-column>
        <el-table-column prop="operation" align="center" label="操作名"></el-table-column>
        <el-table-column prop="parameter" align="center" label="参数">
          <template slot-scope="scope">
            <p
              @click="see(scope.row.parameter)"
              style="width:200px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;cursor: pointer;"
            >{{scope.row.parameter}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="operTime" align="center" label="时间" :formatter="dateFormat"></el-table-column>
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
    <el-dialog title="参数详情" :visible.sync="dialogVisible" width="30%" >
      <span style="word-wrap:break-word ;">{{message}}</span>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      logData: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      dialogVisible:false,
      message:"",
    };
  },
  created() {
    this.getLogData({ pageNo: this.pageNo, pageSize: this.pageSize });
  },
  methods: {
    getLogData(param) {
      net.request("admin/log/queryPage", "post", param).then(res => {
        if (res.retcode == 1) {
          this.logData = res.data.rows;
          this.total = res.data.total;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
        console.log(res);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLogData({ pageNo: this.pageNo, pageSize: this.pageSize });
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getLogData({ pageNo: this.pageNo, pageSize: this.pageSize });
    },
    dateFormat(row, column) {
      let time = net.dateFormat(row.operTime);
      return time;
    },
    see(val) {
      this.dialogVisible = true;
      this.message = val;
    }
  }
};
</script>
<style lang='less' scoped>
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

