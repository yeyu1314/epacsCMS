<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入品牌" v-model="carBrand " clearable></el-input>
      <el-input placeholder="请输入主机厂商" v-show="isShowHost" v-model="carHost " clearable></el-input>
      <el-input placeholder="请输入车系" v-show="isShowSeries" v-model="carSeries " clearable></el-input>
      <el-input placeholder="请输入车型" v-show="isShowType" v-model="carType " clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addData" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-tabs type="border-card" v-model="tabName" @tab-click="tabClick">
        <el-tab-pane label="品牌">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="主机厂商">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="factoryName" label="主机厂商" align="center"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="车系">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="factoryName" label="主机厂商" align="center"></el-table-column>
            <el-table-column prop="seriesName" label="车系" align="center"></el-table-column>
            <el-table-column prop="assayType" label="检测分类" align="center">
              <template
                slot-scope="scope"
              >{{scope.row.assayType==1?"I类检测":(scope.row.assayType==2?"Ⅱ类检测":"其他")}}</template>
            </el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="车型">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="factoryName" label="主机厂商" align="center"></el-table-column>
            <el-table-column prop="seriesName" label="车系" align="center"></el-table-column>
            <el-table-column prop="modelName" label="车型" align="center"></el-table-column>
            <el-table-column prop="oilDeplete" label="综合油耗" align="center"></el-table-column>
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
        </el-tab-pane>
      </el-tabs>
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
        v-model="brandId"
        clearable
        placeholder="请选择品牌"
        style="margin:0 0 15px 0px;width:280px;"
        v-show="isShowHost"
        @change="brandChange"
      >
        <el-option
          v-for="item in brandData"
          :key="item.id"
          :label="item.brandName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="hostId"
        clearable
        placeholder="请选择主机厂商"
        style="margin:0 0 15px 0px;width:280px;"
        v-show="isShowSeries"
        @change="hostChange"
      >
        <el-option
          v-for="item in hostData"
          :key="item.id"
          :label="item.factoryName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="sericsId"
        clearable
        placeholder="请选择车系"
        style="margin:0 0 15px 0px;width:280px;"
        v-show="isShowType"
      >
        <el-option
          v-for="item in sericsData"
          :key="item.id"
          :label="item.seriesName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-input
        :placeholder="inputTitle"
        v-model="publicArgu"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-select
        v-if="isShowSeries && !isShowType"
        v-model="assayType"
        v-show="isShowSeries"
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option
          v-for="item in assayTypeList"
          :value="item.value"
          :key="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
      <el-input
        v-if="isShowType"
        :placeholder="inputoilDepleteTitle"
        v-model="oilDeplete"
        style="margin:0 0 15px 0px;width:280px;"
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
import net from "../../assets/js/public";
export default {
  data() {
    return {
      publicArgu: "",
      carBrand: "", //品牌
      carHost: "", //主机
      carSeries: "", //车系
      carType: "", //车型
      dataList: [],
      dialogVisible: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tabName: 0,
      urlArr: [
        "admin/carInfo/queryCarBrandPage",
        "admin/carInfo/queryCarFactoryPage",
        "admin/carInfo/queryCarSeriesPage",
        "admin/carInfo/queryCarModelPage",
        "admin/carInfo/addCarBrand",
        "admin/carInfo/addCarFactory",
        "admin/carInfo/addCarSeries",
        "admin/carInfo/addCarModel",
        "admin/carInfo/updateCarBrand",
        "admin/carInfo/updateCarFactory",
        "admin/carInfo/updateCarSeries",
        "admin/carInfo/updateCarModel"
      ],
      isShowHost: false, //是否显示主机查询
      isShowSeries: false, //是否显示车系查询
      isShowType: false, //是否显示车型查询
      sign: 0, //默认是新增
      add_title: ["新增品牌", "新增主机厂商", "新增车系", "新增车型"],
      edit_title: ["修改品牌", "修改主机厂商", "修改车系", "修改车型"],
      placeholder_input: [
        "请输入品牌名",
        "请输入主机厂商",
        "请输入车系",
        "请输入车型"
      ],
      oilDeplete: "",
      inputoilDepleteTitle: "请输入综合油耗",
      inputTitle: "",
      title: "",
      hostId: "",
      hostData: [],
      sericsId: "",
      assayTypeList: [
        { value: "1", label: "I类检测" },
        { value: "2", label: "Ⅱ类检测" },
        { value: "0", label: "其他" }
      ],
      assayType: "I类检测",
      sericsData: [],
      brandId: "",
      brandData: [],
      edit_id: 0,
      edit_key: ["brandName", "factoryName", "seriesName", "modelName"],
      messageFont: ["新增成功", "修改成功"]
    };
  },
  created() {
    this.getList(this.urlArr[this.tabName], { brandName: this.carBrand });
  },
  methods: {
    ensure() {
      var url;
      var s;
      let param = {};
      if (this.sign == 0) {
        //新增
        s = parseInt(this.tabName) + 4;
        url = this.urlArr[s];
      }
      if (this.sign == 1) {
        //修改
        s = parseInt(this.tabName) + 8;
        url = this.urlArr[s];
        param["id"] = this.edit_id;
      }
      if (s % 4 == 2) {
        //新增检测类别
        var postAssayType = 0;
        if (this.assayType == 1 || this.assayType == "I类检测") {
          postAssayType = 1;
        } else if (this.assayType == 2 || this.assayType == "Ⅱ类检测") {
          postAssayType = 2;
        }
        console.log("====>" + postAssayType);
      }
      param["assayType"] = postAssayType;
      param[this.edit_key[this.tabName]] = this.publicArgu; //输入框参数
      if (
        this.isShowHost == true &&
        this.isShowSeries == false &&
        this.isShowType == false
      ) {
        param["brandId"] = this.brandId;
      }
      if (this.isShowSeries == true && this.isShowType == false) {
        param["factoryId"] = this.hostId;
      }
      if (this.isShowType == true) {
        if (this.oilDeplete == "") {
          net.message(this, "请输入综合油耗", "warning");
          return;
        }
        this.oilDeplete = parseFloat(this.oilDeplete);
        param["seriesId"] = this.sericsId;
        param["oilDeplete"] = this.oilDeplete;
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          this.dialogVisible = false;
          net.message(this, this.messageFont[this.sign], "success");
          this.public(this.tabName);
        }
      });
    },
    addData() {
      //点击新增
      this.dialogVisible = true;
      this.title = this.add_title[this.tabName];
      this.inputTitle = this.placeholder_input[this.tabName];
      this.sign = 0;
      this.publicArgu = "";
      this.brandId = "";
      this.brandData = [];
      this.hostId = "";
      this.hostData = [];
      this.sericsId = "";
      this.oilDeplete = "";
      this.sericsData = [];
      this.moduleShow(() => {
        if (this.isShowHost == true) {
          this.getAllbrand();
        }
      });
    },
    editClick(row) {
      //点击修改
      this.dialogVisible = true;
      this.sign = 1;
      this.publicArgu = "";
      this.areaId = "";
      this.AreaData = [];
      this.provinceId = "";
      this.code = "";
      this.provinceData = [];
      this.title = this.edit_title[this.tabName];
      this.inputTitle = this.placeholder_input[this.tabName];
      this.edit_id = row.id;
      this.oilDeplete = row.oilDeplete;
      this.assayType =
        row.assayType == 1
          ? "I类检测"
          : row.assayType == 2
            ? "Ⅱ类检测"
            : "其他";
      this.moduleShow(() => {
        this.publicArgu = row.brandName;
        if (this.isShowHost == true) {
          this.publicArgu = row.factoryName;
          this.getAllbrand(() => {
            this.brandId = row.brandId;
            if (this.isShowSeries == true) {
              this.publicArgu = row.seriesName;
              this.getAllhost(row.brandId, () => {
                this.hostId = row.factoryId;
                if (this.isShowType == true) {
                  this.publicArgu = row.modelName;
                  this.getAllSerics(row.factoryId, () => {
                    this.sericsId = row.seriesId;
                  });
                }
              });
            }
          });
        }
      });
    },
    moduleShow(callback) {
      callback = callback || function() {};
      if (this.tabName == 0) {
        this.isShowHost = false;
        this.isShowSeries = false;
        this.isShowType = false;
      }
      if (this.tabName == 1) {
        this.isShowHost = true;
        this.isShowSeries = false;
        this.isShowType = false;
      }
      if (this.tabName == 2) {
        this.isShowHost = true;
        this.isShowSeries = true;
        this.isShowType = false;
      }
      if (this.tabName == 3) {
        this.isShowHost = true;
        this.isShowSeries = true;
        this.isShowType = true;
      }
      callback();
    },
    getAllbrand(callback) {
      //获取所有品牌
      callback = callback || function() {};
      net.request("admin/select/getCarBrand", "post").then(res => {
        this.brandData = res.data;
        callback();
      });
    },
    brandChange(value) {
      this.hostId = "";
      this.hostData = [];
      this.sericsId = "";
      this.sericsData = [];
      if (this.isShowSeries == true) {
        this.getAllhost(value);
      }
    },
    getAllhost(brandId, callback) {
      //获取所有主机厂商
      callback = callback || function() {};
      net
        .request("admin/select/getCarFactory", "post", { brandId: brandId })
        .then(res => {
          this.hostData = res.data;
          callback();
        });
    },
    hostChange(value) {
      this.sericsId = "";
      this.sericsData = [];
      if (this.isShowType == true) {
        this.getAllSerics(value);
      }
    },
    getAllSerics(factoryId, callback) {
      //获取所有车系
      callback = callback || function() {};
      net
        .request("admin/select/getCarSeries", "post", { factoryId: factoryId })
        .then(res => {
          this.sericsData = res.data;
          callback();
        });
    },
    //获取列表
    getList(url, data) {
      net
        .request(
          url,
          "post",
          { pageNo: this.pageNo, pageSize: this.pageSize },
          data
        )
        .then(res => {
          if (res.retcode == 1) {
            this.dataList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据异常", "warning");
          }
        });
    },
    //tab点击
    tabClick() {
      this.moduleShow();
      this.public(this.tabName);
      if (this.tabName == 0) {
        this.isShowProvince = false;
        this.isShowCity = false;
      }
      if (this.tabName == 1) {
        this.isShowProvince = true;
        this.isShowCity = false;
      }
      if (this.tabName == 2) {
        this.isShowProvince = true;
        this.isShowCity = true;
      }
    },
    search() {
      this.public(this.tabName);
    },
    public(index) {
      var data = {};
      if (index == 0) {
        data = { brandName: this.carBrand };
        this.getList(this.urlArr[this.tabName], data);
      }
      if (index == 1) {
        data = {
          brandName: this.carBrand,
          factoryName: this.carHost
        };
        this.getList(this.urlArr[this.tabName], data);
      }
      if (index == 2) {
        data = {
          brandName: this.carBrand,
          factoryName: this.carHost,
          seriesName: this.carSeries
        };
        this.getList(this.urlArr[this.tabName], data);
      }
      if (index == 3) {
        data = {
          brandName: this.carBrand,
          factoryName: this.carHost,
          seriesName: this.carSeries,
          modelName: this.carType
        };
        this.getList(this.urlArr[this.tabName], data);
      }
    },
    //弹窗确认
    handleSizeChange(val) {
      this.pageSize = val;
      this.public(this.tabName);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.public(this.tabName);
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
