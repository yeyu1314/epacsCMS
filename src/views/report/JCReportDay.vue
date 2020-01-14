<template>
  <div class="content">
    <div class="search">
      <div class="p_select">
        <el-select
          v-model="edit_groupId"
          clearable
          filterable
          placeholder="请选择集团"
          @change="groupChange"
        >
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
          v-model="value2"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
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
        <el-table-column prop="logDay" label="日期" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.logDay | logDay}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sa" label="SA接单(检测)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sa==0?"-":scope.row.sa}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jc" label="检测数量(检测)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.jc==0?"-":scope.row.jc}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zd" label="诊断数量(检测)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.zd==0?"-":scope.row.zd}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cz" label="拆装数量(检测)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.cz==0?"-":scope.row.cz}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gd" label="跟单数量(检测)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gd==0?"-":scope.row.gd}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sa2" label="SA接单(治疗)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sa2==0?"-":scope.row.sa2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jc2" label="检测数量(治疗)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.jc2==0?"-":scope.row.jc2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zd2" label="诊断数量(治疗)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.zd2==0?"-":scope.row.zd2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cz2" label="拆装数量(治疗)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.cz2==0?"-":scope.row.cz2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zl2" label="治疗数量(治疗)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.zl2==0?"-":scope.row.zl2}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gd2" label="跟单数量(治疗)" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gd2==0?"-":scope.row.gd2}}</span>
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
      orgId: "",
      orgIdArr: [],
      value2: "",
      listArr: [],
      total1: null,
      tabularData: false,
      edit_groupId: "",
      groupArr: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        logDay: "",
        orgId: null
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    this.groupNm();
  },
  filters: {
    logDay(data) {
      let str = data.toString();
      let str1 =
        str.substring(0, 4) +
        "-" +
        str.substring(4, 6) +
        "-" +
        str.substring(6, 8);

      return str1;
    }
  },
  methods: {
    // 集团下拉监听
    groupChange(val) {
      this.orgId = "";
      this.getOrgin(val);
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
          "admin/Organization/getOrganizationByGroupId",
          "post",
          {
            groupId: val,
            orgName: ""
          },
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
    getList(page) {
      net.request("admin/newReport/JCReportDay", "post", page).then(res => {
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
      let page;
      let cost;
      if (this.edit_groupId == "" || this.edit_groupId == null) {
        this.$message.error("请选择集团");
        return false;
      } else if (this.orgId == "" || this.orgId == null) {
        this.$message.error("请选择检测站点");
        return false;
      } else if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择查询日期");
        return false;
      } else {
        this.page = {
          //   pageNo: this.page.pageNo,
          //   pageSize: this.page.pageSize,
          logDay: this.value2.split("-").join(""),
          orgId: this.orgId
        };
        this.getList(this.page);
      }
    },
    exportForm() {
      if (this.value2 == "" || this.value2 == null) {
        this.$message.error("请选择查询日期");
        return false;
      } else if (this.orgId == "" || this.orgId == null) {
        this.$message.error("请选择检测站点");
        return false;
      } else {
        this.download();
      }
    },
    download() {
      let url;
      url =
        net.baseUrl +
        "admin/newReportExcel/JCReportDay" +
        "?logDay=" +
        this.value2.split("-").join("") +
        "&orgId=" +
        this.orgId; //get方式要encode一下, 后端接收参数data

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
