<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入车牌号" v-model="carNumber" clearable></el-input>
      <el-button type="primary" style="background:#009688;" @click="search" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" @click="JumpAddCarInfo" icon="el-icon-plus">新增车辆信息</el-button>
    </div>
    <div class="table" v-show="isShowTable">
      <el-table :data="carList" border style="width: 99%">
        <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
        <el-table-column label="车辆信息" align="center">
          <template slot-scope="scope">
            {{scope.row.brandName}}
            <br />
            {{scope.row.seriesName}}
            <br />
            {{scope.row.modelName}}
            <br />
            {{scope.row.fuelTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="最新进店信息" align="center">
          <template slot-scope="scope">
            {{scope.row.lastOrgName}}
            <br />
            <label style="color:#0066CC">{{scope.row.lastSA}}</label>
          </template>
        </el-table-column>
        <el-table-column label="最新订单信息" align="left">
          <template slot-scope="scope">
            <span v-html="formatTime(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="addorder(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >新增</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-show="isShowTable">
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

    <el-dialog :title="dTitle" :visible.sync="dialogVisible" width="600px">
      <el-input
        placeholder="请输入里程（单位：km）"
        v-model="add_mileage"
        value="车辆检测"
        style="margin:0 0 15px 0px;width:500px;"
        clearable
      ></el-input>
      <el-select
        v-model="selectService"
        clearable
        placeholder="请选择业务线"
        style="margin:0 0 15px 0px;width:500px;"
      >
        <el-option
          v-for="item in serviceArr"
          :key="item.id"
          :label="item.serviceLineName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="orgin"
        clearable
        placeholder="请选择维修站"
        style="margin:0 0 15px 0px;width:500px;"
        @change="orginChange"
        filterable
        v-show="isShow"
      >
        <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="orginUser"
        clearable
        placeholder="请选择该车辆接待的服务顾问"
        style="margin:0 0 15px 0px;width:500px;"
      >
        <el-option
          v-for="item in orginUserArr"
          :key="item.id"
          :label="item.userName"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="selectType">
        <p>发动机 缸数量 (可点击选择或者手动输入)</p>
        <el-input placeholder="请输入缸数量" v-model="step2Type2PowerCount" clearable></el-input>
        <br />
        <el-radio-group v-model="tempStep2Type2PowerCount" @change="handleStep2Type2PowerCountList">
          <el-radio :label="3">3缸</el-radio>
          <el-radio :label="4">4缸</el-radio>
          <el-radio :label="6">6缸</el-radio>
          <el-radio :label="8">8缸</el-radio>
          <el-radio :label="10">10缸</el-radio>
          <el-radio :label="12">12缸</el-radio>
        </el-radio-group>
      </div>
      <div class="selectType">
        <p>业务类型</p>
        <el-radio-group v-model="selectType">
          <el-radio :label="1" v-if="false">检测</el-radio>
          <el-radio :label="2">治疗</el-radio>
          <el-radio :label="3">检测 + 治疗</el-radio>
        </el-radio-group>
      </div>
      <div class="selectType" v-if="selectType==2">
        <p>治疗项目</p>
        <el-checkbox-group v-model="step2Type2OptionList" @change="handleStep2Type2OptionList">
          <el-checkbox :label="0">动力康复</el-checkbox>
          <el-checkbox :label="1">缸内修复</el-checkbox>
          <el-checkbox :label="2">烧机油治理</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="conditionTitle">
        <p>客户车况描述 (请按照实际情况填写)</p>
        <el-button size="small" @click="clickCondition">车况模板</el-button>
      </div>
      <el-input
              type="textarea"
              v-model="desc"
              :autosize="{ minRows: 3}"
              style="margin:15px 0 15px 0px;width:500px;"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="车况模板" :visible.sync="dialogVisible1" width="500px">
      <el-checkbox-group v-model="checkedCar" class="carCondi">
        <el-checkbox
          v-for="item in carArr"
          :label="item.stencilName"
          :key="item.id"
        >{{item.stencilName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="selectCar">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      carList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      carNumber: "",
      add_mileage: "",
      selectService: "",
      dialogVisible: false,
      dialogVisible1: false,
      serviceArr: [],
      desc: "",
      checkedCar: [],
      carArr: [],
      selectType: 3,
      step2Type2PowerCount: 4,
      tempStep2Type2PowerCount: 4,
      step2Type2OptionList: [0],
      isShowTable: false,
      carId: 0,
      isShow: false,
      orgin: "", //维修站
      orginArr: [],
      orginUser: "", //维修站用户
      orginUserArr: [],
      engineerId: "",
      engineerArr: [],
      dTitle: ""
    };
  },
  created() {},
  methods: {
    //点击新增
    addorder(row) {
      var orgId = JSON.parse(sessionStorage.getItem("signInfo")).orgId;
      console.log(orgId)
      if (orgId == null || orgId == 0) {
        this.isShow = true;
      } else {
        this.isShow = false;
        this.orginChange(orgId);
      }
      this.add_mileage = "";
      this.selectService = "";
      this.orgin = "";
      this.dialogVisible = true;
      this.carId = row.id;
      this.desc = "车辆检测";
      this.orginUserArr = [];
      this.orginUser = "";
      this.engineerId = "";
      this.engineerArr = [];
      this.dTitle = "新增工单" + "(" + row.carNumber + ")";
      this.getAllService(() => {
        this.selectService = 1;
      });
      this.getOrgin();
    },
    //点击车况模板
    clickCondition() {
      this.dialogVisible1 = true;
      this.getAllCar();// 获取车况模板
    },
    //选择车况模板
    selectCar() {
      if (this.checkedCar.length != 0) {
        if (this.desc != "") {
          this.desc = this.desc + "\n" + this.checkedCar.join("\n");
        } else {
          this.desc = this.checkedCar.join("\n");
        }
      }
      this.checkedCar = [];
      this.dialogVisible1 = false;
    },
    //确认新增
    ensure() {
      if (this.add_mileage == "") {
        net.message(this, "请输入里程数", "warning");
        return false;
      }
      if (this.selectService == "") {
        net.message(this, "请选择业务线", "warning");
        return false;
      }
      if (this.desc == "") {
        net.message(this, "请选择车况模板或者输入车况", "warning");
        return false;
      }
      if (this.selectType == 0) {
        net.message(this, "请选择业务类型", "warning");
        return false;
      }
      let param = {
        carId: this.carId,
        checkType: this.selectType,
        mile: this.add_mileage,
        note: this.desc,
        serviceLineId: this.selectService,
        userId: this.orginUser,
        step2Type2OptionList: this.step2Type2OptionList.join(","),
        carCylinder: this.step2Type2PowerCount
        // engineerId: this.engineerId
      };
      var orgId = JSON.parse(sessionStorage.getItem("signInfo")).orgId;
      if (orgId == null || orgId == 0) {
        param["orgId"] = this.orgin;
      }

      net.request("admin/order/addOrder", "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          if (this.selectType == 2) {
            var f = net.isJump("/ensureOrder");
            if (f) {
              this.$router.push({ path: "/ensureOrder" });
            } else {
              this.dialogVisible = false;
            }
          } else {
            var skip = net.isJump("/waitOrder");
            if (skip) {
              this.$router.push({ path: "/waitOrder" });
            } else {
              this.dialogVisible = false;
            }
          }
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取维修站
    getOrgin(callback) {
      callback = callback || function() {};
      net.request("admin/Organization/getOrganizationAll", "post").then(res => {
        if (res.retcode == 1) {
          this.orginArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    // 车辆接待服务顾问
    orginChange(val) {
      this.orginUser = "";
      this.engineerId = "";
      this.getOrginUser(val);// 获取服务顾问
      this.getEngineer(val);// 获取工程师
    },
    //获取维修站用户
    getOrginUser(orgId) {
      net
        .request("admin/orgUser/queryUserByOrgId", "post", { orgId: orgId })
        .then(res => {
          if (res.retcode == 1) {
            this.orginUserArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    // 获取工程师
    getEngineer(orgID) {
      net
        .request("admin/engineer/queryEngineerByOrgId", "post", {
          orgId: orgID
        })
        .then(res => {
          if (res.retcode == 1) {
            this.engineerArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    //获取列表数据(查询)
    getList(param, data) {
      net
        .request("admin/order2/queryCarPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.carList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    // 每页显示数量
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { carNumber: this.carNumber }
      );
    },
    // 翻页
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { carNumber: this.carNumber }
      );
    },
    // 查询按钮
    search() {
      this.isShowTable = true;
      //查询
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { carNumber: this.carNumber }
      );
    },
    // 新增车辆信息
    JumpAddCarInfo() {
      this.$router.push({ path: "/carInfo" });
    },
    //获取车况模板
    getAllCar(callback) {
      callback = callback || function() {};
      net.request("admin/select/getCarStencil", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.carArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    //获取业务线
    getAllService(callback) {
      callback = callback || function() {};
      net.request("admin/select/getLine", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.serviceArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    formatTime(rowInfo) {
      if (!rowInfo.haveLastOrder) {
        return "";
      }
      var date = new Date(rowInfo.lastOrderTime);
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      var hour = date.getHours();
      if (hour < 10) {
        hour = "0" + hour;
      }
      var min = date.getMinutes();
      if (min < 10) {
        min = "0" + min;
      }
      var showInfo =
        "订单时间:" + date.getFullYear() + "年" + month + "月" + day + "日 ";
      showInfo += hour + ":" + min + "<br/>";
      showInfo += "订单里程:" + rowInfo.lastMile + "km<br/>";
      var busType =
        rowInfo.lastCheckType == 3
          ? "检测+治疗"
          : rowInfo.lastCheckType == 2
          ? "治疗"
          : "检测";
      showInfo += "业务类型:" + busType + " <br/>";
      var process = "未知";
      var code = rowInfo.lastJobCode;
      if (code == 1002) {
        process = "检测完成未治疗";
      } else if (code >= 1000) {
        process = "全部完成";
      } else if (code <= 10) {
        process = "待检测";
      } else if (code > 10 && code < 100) {
        process = "待上传照片";
      } else if (code >= 100 && code < 230) {
        process = "待编辑报告";
      } else if (code == 230) {
        process = "待审核报告";
      } else if (code >= 500 && code <= 510) {
        process = "待确认治疗";
      } else if (code == 550) {
        process = "待复查";
      } else if (code >= 600 && code < 700) {
        process = "待上传复查照片";
      } else if (code >= 700 && code < 850) {
        process = "待编辑复查报告";
      } else if (code == 850) {
        process = "待审核复查报告";
      } else {
        process = "未知";
      }
      showInfo += "业务进度:" + process + " <br/>";
      return showInfo;
    },
    // 治疗项目必须包含动力康复
    handleStep2Type2OptionList(value) {
      console.log(value.join(","));
      if (value.indexOf(0) == -1) {
        net.message(this, "治疗项目必须包含动力康复", "warning");
        value.push(0);
      }
    },
    handleStep2Type2PowerCountList(value) {
      this.step2Type2PowerCount = value;
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
  .table {
    padding-bottom: 30px;
  }
  .pagination {
    position: relative;
    top: 20px;
    .el-pagination {
      position: absolute;
      left: 0px;
    }
    .number .active {
      background: #009688 !important;
    }
  }
  .conditionTitle {
    width: 500px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    p {
      height: 42px;
      line-height: 42px;
    }
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
  .selectType {
    display: flex;
    flex-direction: column;
    width: 500px;
    margin: 0 auto;
    p {
      text-align: left;
      height: 36px;
      line-height: 36px;
    }
    div {
      margin-top: 0px;
      text-align: left;
    }
  }
}
</style>
