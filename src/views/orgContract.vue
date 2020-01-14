<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入业务类型" v-model="busName " clearable></el-input>
      <el-input placeholder="请输入维修站名" v-model="orgName " clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="listData" border style="width: 100%">
        <el-table-column prop="busName" label="业务类型" align="center"></el-table-column>
        <el-table-column prop="serviceLineName" label="业务线" align="center"></el-table-column>
        <el-table-column prop="orgName" label="维修站" align="center"></el-table-column>
        <el-table-column prop="defaultPrice" label="价格" align="center"></el-table-column>
        <el-table-column prop="proportion" label="万分比" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="editClick(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >修改</el-button>
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
    <el-dialog :title="title" :visible.sync="dialogVisible" width="420px">
      <!-- :before-close="handleClose" -->
      <el-select
        v-model="ServiceLine"
        clearable
        placeholder="请选择业务线"
        style="margin:0 0 15px 0px;width:280px;"
        @change="lineChange"
        v-show="isEdit"
      >
        <el-option
          v-for="item in ServiceLineData"
          :key="item.id"
          :label="item.serviceLineName"
          :value="item.id"
        ></el-option>
      </el-select>
      <div style="width:280px;margin:0 auto;heigth:36px;line-height:36px;"  v-show="isEdit">
        <p style="text-align:left">选择业务类型</p>
        <el-checkbox-group v-model="selectType" class="carCondi" style="margin-bottom:15px;"  >
          <el-checkbox
            v-for="item in serviceTypeData"
            :label="item.id"
            :key="item.id"
          >{{item.busName}}</el-checkbox>
        </el-checkbox-group>
      </div>

      <el-select
        v-model="selectOrign"
        clearable
        filterable
        placeholder="请选择维修站"
        style="margin:0 0 15px 0px;width:280px;"
         v-show="isEdit"
      >
        <el-option v-for="item in orignAll" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
      </el-select>

      <el-input
        placeholder="请输入价格"
        v-model="edit_price"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>

      <el-input
        placeholder="请输入万分比"
        v-model="edit_proportion"
        style="margin:0 0 15px 0px;width:280px;"
        type="number"
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      listData: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      busName: null,
      orgName: null,
      ServiceLine: "", //业务线
      ServiceLineData: [],
      selectType: [], //业务类型
      serviceTypeData: [],
      selectOrign: "", //维修站选择
      orignAll: [],
      dialogVisible: false,
      edit_price: "",
      edit_proportion: "",
      enit_id: "",
      title: "新增维修站合同",
      sign: 0, //用来判断是新增还是修改
      isEdit:false
    };
  },
  created() {
    this.getList({ pageNo: this.pageNo, pageSize: this.pageSize }, {});
  },
  methods: {
    //点击新增
    addUser() {
      this.getAllServiceLine();
      this.getAllorgin();
      this.dialogVisible = true;
      this.edit_price = ""; //价格
      this.edit_proportion = ""; //万分比
      this.enit_id = ""; //ID
      this.ServiceLine = ""; //业务线
      this.ServiceLineData = [];
      this.selectType = []; //业务类型
      this.serviceTypeData = [];
      this.selectOrign = ""; //维修站
      this.sign = 0;
      this.isEdit = true;
    },
    editClick(row) {
      //修改
      this.dialogVisible = true;
      this.edit_price = row.defaultPrice;
      this.edit_proportion = row.proportion;
      this.enit_id = row.id;
      this.sign = 1;
      this.isEdit = false;
    },
    //确认修改
    ensure() {
      if (this.ServiceLine == "" && this.sign == 0) {
        net.message(this, "请选择业务线", "warning");
        return false;
      }
      var len = this.selectType.length,
        strSConfigId;
      if (len == 0  && this.sign == 0) {
        net.message(this, "请勾选业务类型", "warning");
        return false;
      }
      if (len == 1) {
        strSConfigId = this.selectType[0];
      }
      if (len > 1) {
        strSConfigId = this.selectType.join(",");
      }
      if (this.selectOrign == ""  && this.sign == 0) {
        net.message(this, "请选择维修站", "warning");
        return false;
      }
      if (this.edit_price == "") {
        net.message(this, "请输入价格", "warning");
        return false;
      }
      if (this.edit_proportion == "") {
        net.message(this, "请输入万分比", "warning");
        return false;
      }
      let param, url;
      if (this.sign == 1) {
        url = "admin/business/updateBusiness";
        param = {
          id: this.enit_id,
          defaultPrice: this.edit_price, //价格
          proportion: this.edit_proportion, //万分比
        };
      }
      if (this.sign == 0) {
        url = "admin/business/addBusiness";
        param = {
          orgId: this.selectOrign,
          defaultPrice: this.edit_price, //价格
          proportion: this.edit_proportion, //万分比
          strSConfigId: strSConfigId //业务类型==>拼接成字符串
        };
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          this.getList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            { orgName: this.orgName, busName: this.busName }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getList(param, data) {
      net.request("admin/business/queryPage", "post", param, data).then(res => {
        if (res.code == 0) {
          this.listData = res.rows;
          this.total = res.total;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    // 定义表格样式
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, busName: this.busName }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, busName: this.busName }
      );
    },

    search() {
      //查询
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, busName: this.busName }
      );
    },
    //获取所有业务线
    getAllServiceLine(callback) {
      callback = callback || function() {};
      net.request("admin/select/getLine", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.ServiceLineData = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    lineChange(value) {
      this.serviceType = [];
      this.getAllServiceLineType(value);
    },
    //获取所有业务类型
    getAllServiceLineType(lineId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getServiceConfig", "post", { lineId: lineId })
        .then(res => {
          if (res.retcode == 1) {
            this.serviceTypeData = res.data;
            callback();
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    //获取所有维修站信息
    getAllorgin(callback) {
      callback = callback || function() {};
      net
        .request("admin/Organization/getOrganizationAll", "post", {})
        .then(res => {
          if (res.retcode == 1) {
            this.orignAll = res.data;
            callback();
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
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
    margin-bottom: 40px;
  }
   .carCondi {
    display: flex;
    flex-direction: column;
    label {
      height: 32px;
      text-align: left;
      margin-left: 60px;
    }
  }
}
</style>
