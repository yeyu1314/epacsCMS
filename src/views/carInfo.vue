<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入车牌号" v-model="carNumber " clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="carList" border style="width: 99%">
        <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sex | sexs}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orgName" label="维修站名" align="center"></el-table-column>
        <el-table-column prop="areaName" label="所在区" align="center"></el-table-column>
        <el-table-column prop="provinceName" label="所在省" align="center"></el-table-column>
        <el-table-column prop="cityName" label="所在市" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="factoryName" label="主机厂商" align="center"></el-table-column>
        <el-table-column prop="seriesName" label="车系" align="center"></el-table-column>
        <el-table-column prop="modelName" label="车型" align="center"></el-table-column>
        <el-table-column prop="fuelTypeName" label="汽油类型" align="center"></el-table-column>
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
    <el-dialog
      title="车辆信息"
      :visible.sync="dialogVisible"
      width="420px"
      :close-on-click-modal="false"
    >
      <!-- :before-close="handleClose" -->
      <el-input
        placeholder="请输入车牌号"
        v-model="edit_carNumber"
        style="margin:0 0 15px 10px;width:280px;"
        clearable
      ></el-input>
      <span style="color:#f40">*</span>
      <el-input
        placeholder="请输入客户姓名"
        v-model="edit_customerName"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入客户电话"
        v-model="edit_customerPhone"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-select
        v-model="selectBrand"
        clearable
        filterable
        placeholder="请选择品牌"
        style="margin:0 0 15px 10px;width:280px;"
        @change="brandChange"
      >
        <el-option v-for="item in brandAll" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
      </el-select>
      <span style="color:#f40">*</span>
      <el-select
        v-model="value2"
        clearable
        placeholder="请选择主机厂商"
        style="margin:0 0 15px 10px;width:280px;"
        @change="hostChange"
      >
        <el-option
          v-for="item in hostData"
          :key="item.id"
          :label="item.factoryName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span style="color:#f40">*</span>

      <el-select
        v-model="value3"
        clearable
        filterable
        placeholder="请选择车系"
        style="margin:0 0 15px 10px;width:280px;"
        @change="audiChange"
      >
        <el-option
          v-for="item in audiData"
          :key="item.id"
          :label="item.seriesName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span style="color:#f40">*</span>

      <el-select
        v-model="value4"
        clearable
        placeholder="请选择车型"
        style="margin:0 0 15px 10px;width:280px;"
      >
        <el-option
          v-for="item in carTypeData"
          :key="item.id"
          :label="item.modelName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span style="color:#f40">*</span>

      <el-select
        v-model="sel_gasoline"
        clearable
        placeholder="请选择汽油类型"
        style="margin:0 0 15px 10px;width:280px;"
      >
        <el-option v-for="item in gasolineArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span style="color:#f40">*</span>

      <el-select
        v-model="orgin"
        clearable
        placeholder="请选择维修站"
        style="margin:0 0 15px 10px;width:280px;"
        filterable
        v-show="isShow"
      >
        <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
      </el-select>
      <span style="color:#f40" v-show="isShow">*</span>

      <div
        style="margin:10px 0 15px 50px;width:280px;display:flex;flex-direction: row;font-size:16px;"
      >
        <el-select
          v-model="sex"
          clearable
          placeholder="请选择性别"
          style="margin:0 0 15px 0px;width:280px;"
        >
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
        </el-select>
      </div>

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
      defaultBrandId: 0,
      carList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      organization: null,
      selectBrand: "", //品牌选择
      brandAll: [],
      value2: "", //主机选择
      hostData: [],
      value3: "", //车系选择
      audiData: [],
      value4: "", //车型选择
      carTypeData: [],
      sel_gasoline: "", //汽油类型
      gasolineArr: [],
      dialogVisible: false,
      carNumber: "", //车牌
      edit_carNumber: "",
      edit_customerName: "",
      edit_customerPhone: "",
      orgin: "", //维修站
      orginArr: [],
      enit_id: "",
      sign: 0, //用来判断是新增还是修改
      isShow: null,
      sex: ""
    };
  },
  created() {
    var roleId = JSON.parse(sessionStorage.getItem("signInfo")).orgId;
    if (roleId == null || roleId == 0) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
    this.getCarList(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      {
        carNumber: this.carNumber
      }
    );
  },
  methods: {
    //点击新增
    addUser() {
      this.getAllbrand();
      this.getAllGasoline();
      this.getOrgin();
      this.dialogVisible = true;
      this.edit_carNumber = "";
      this.edit_customerName = "";
      this.edit_customerPhone = "";
      this.enit_id = "";
      this.selectBrand = ""; //品牌选择
      this.brandAll = [];
      this.value2 = ""; //主机选择
      this.hostData = [];
      this.value3 = ""; //车系选择
      this.audiData = [];
      this.value4 = ""; //车型选择
      this.carTypeData = [];
      this.sel_gasoline = "";
      this.gasolineArr = [];
      this.orgin = "";
      this.orginArr = [];
      this.sex = "";
      this.sign = 0;
    },
    editClick(row) {
      //修改
      this.getAllGasoline(() => {
        this.sel_gasoline = row.fuelTypeId;
      });
      this.getOrgin(() => {
        this.orgin = row.initOrgId;
      });
      this.getAllbrand(() => {
        this.selectBrand = row.brandId;
        this.gethostData(row.brandId, () => {
          this.value2 = row.factoryId;
          this.getaudiData(row.factoryId, () => {
            this.value3 = row.seriesId;
            this.getcarTypeData(row.seriesId, () => {
              this.value4 = row.modelId;
            });
          });
        });
      });
      this.dialogVisible = true;
      this.edit_carNumber = row.carNumber;
      this.edit_customerName = row.customerName;
      this.edit_customerPhone = row.customerPhone;
      this.selectBrand = row.brandId;
      this.enit_id = row.id;
      this.sex = row.sex;
      this.sign = 1;
    },
    //确认修改
    ensure() {
      let param = {
        fuelTypeId: this.sel_gasoline,
        modelId: this.value4,
        carNumber: this.edit_carNumber,
        customerName: this.edit_customerName,
        customerPhone: this.edit_customerPhone,
        initOrgId: this.orgin,
        sex: this.sex
      };
      let url;
      if (this.sign == 1) {
        url = "admin/car/updateCar";
        param["id"] = this.enit_id;
      }
      if (this.sign == 0) {
        url = "admin/car/addCar";
      }
      if (this.isShow == true) {
        param["initOrgId"] = this.orgin;
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, "请进入工单管理进行检测单录入", "success");
          this.dialogVisible = false;
          this.getCarList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            {
              carNumber: this.carNumber
            }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getCarList(param, data) {
      net.request("admin/car/queryPage", "post", param, data).then(res => {
        if (res.retcode == 1) {
          this.carList = res.data.rows;
          this.total = res.data.total;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    // 定义表格样式
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCarList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          carNumber: this.carNumber
        }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getCarList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          carNumber: this.carNumber
        }
      );
    },

    search() {
      //查询
      this.getCarList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          carNumber: this.carNumber
        }
      );
    },
    //获取品牌数据
    getAllbrand(callback) {
      callback = callback || function() {};
      net.request("admin/select/getCarBrand", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.brandAll = res.data;
          this.doDefaultSelectBrand();
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    doDefaultSelectBrand() {
      var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
      var orgName = signInfo.orgName;
      if (orgName != null && orgName.indexOf("宝马") >= 0) {
        this.selectBrand = 19;
      } else if (orgName != null && orgName.indexOf("奔驰") >= 0) {
        this.selectBrand = 13;
      } else if (orgName != null && orgName.indexOf("奥迪") >= 0) {
        this.selectBrand = 22;
      } else if (orgName != null && orgName.indexOf("雷克萨斯") >= 0) {
        this.selectBrand = 16;
      } else this.selectBrand = "";
      if(this.selectBrand!=0){
        this.brandChange()
      }
    },
    brandChange() {
      this.hostData = [];
      this.audiData = [];
      this.carTypeData = [];
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      this.gethostData(this.selectBrand);
    },
    //获取主机厂商
    gethostData(brandId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCarFactory", "post", { brandId: brandId })
        .then(res => {
          if (res.retcode == 1) {
            this.hostData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    hostChange(value) {
      this.audiData = [];
      this.carTypeData = [];
      this.value3 = "";
      this.value4 = "";
      this.getaudiData(value);
    },
    //获取车系
    getaudiData(factoryId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCarSeries", "post", { factoryId: factoryId })
        .then(res => {
          if (res.retcode == 1) {
            this.audiData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    audiChange(value) {
      this.carTypeData = [];
      this.value4 = "";
      this.getcarTypeData(value);
    },
    //获取车型
    getcarTypeData(seriesId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCarModel", "post", { seriesId: seriesId })
        .then(res => {
          if (res.retcode == 1) {
            this.carTypeData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //获取汽油类型
    getAllGasoline(callback) {
      callback = callback || function() {};
      net.request("admin/select/getPetroleumType", "post").then(res => {
        if (res.retcode == 1) {
          this.gasolineArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
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
    }
  },
  filters: {
    sexs(d) {
      var arr = ["保密", "男", "女"];
      return arr[d];
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
  }
}
</style>
