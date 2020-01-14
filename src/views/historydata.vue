<template>
  <div class="content">
    <div style="margin-top:5px;" v-if="false">
      注意:对
      <label style="color:red">比对数据库</label>的数据进行检索,包括历史导入数据和审核通过的最新数据
    </div>
    <div class="search">
      <div class="p_select">
        <el-select v-model="value1" clearable placeholder="请选择品牌" @change="brandChange">
          <el-option
            v-for="item in brandData"
            :key="item.id"
            :label="item.brandName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select v-model="value2" clearable placeholder="请选择主机厂商" @change="hostChange">
          <el-option
            v-for="item in hostData"
            :key="item.id"
            :label="item.factoryName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select v-model="value3" clearable placeholder="请选择车系" @change="audiChange">
          <el-option
            v-for="item in audiData"
            :key="item.id"
            :label="item.seriesName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select v-model="value4" clearable placeholder="请选择车型">
          <el-option
            v-for="item in carTypeData"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          ></el-option>
        </el-select>
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
      <div class="p_select">
        <el-select v-model="radioSel" clearable placeholder="请选择里程">
          <el-option
            v-for="item in mileageData"
            :key="item.id"
            :label="item.mileage"
            :value="item.mileage"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select v-model="spraySel" clearable placeholder="请选择喷射方式">
          <el-option
            v-for="item in sprayData"
            :key="item.id"
            :label="item.engineName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-input placeholder="请输入车牌号" v-model="carNumber" clearable></el-input>
      </div>
      <div class="p_select">
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
      </div>
    </div>
    <div class="table" v-show="isShowTable">
      <div style="text-align:left;margin-bottom: 10px;">检测车辆合计：{{allTotle}}台</div>
      <div style="display: flex;">
        <div class="m_select">
          <el-radio-group v-model="selState" @change="stateChange">
            <el-radio-button
              v-for="item in status"
              :key="item.id"
              :label="item.id"
              border
            >{{item.label}}{{item.proportion}}</el-radio-button>
          </el-radio-group>
        </div>
        <div style="height: 36px;line-height: 36px;margin-left: 20px;">当前维度车辆合计：{{total}} 台</div>
      </div>

      <div class="tableContent">
        <el-table :data="dataList" border style="width: 99%" v-loading="loading">
          <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
          <el-table-column prop="colligateValue" label="积碳程度" align="center">
            <template slot-scope="scope">{{scope.row.colligateValue | state}}</template>
          </el-table-column>
          <el-table-column prop="inputTime" label="检测时间" align="center" :formatter="dateFormat"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click="seeClick(scope.row)"
                type="success"
                style="background: #009688;"
                size="small"
              >查看图片</el-button>
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
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="图片对比" :visible.sync="dialogVisible" width="70%">
      <el-tabs v-model="active" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabsData"
          :label="item.optionName"
          :key="item.id"
          :name="item.optionName"
        >
          <div style="display: flex;flex-direction: column;">
            <div style="display: flex;">
              <div style="width:49%;border:1px solid #eee">
                <img :src="item.url1" alt style="width:100%" />
              </div>
              <div style="width:49%;border:1px solid #eee;margin-left:1.5%">
                <img :src="item.url2" alt style="width:100%" />
              </div>
            </div>
            <p
              style="margin-top: 30px;text-align: left;font-size: 14px;"
              v-show="item.degree != ''"
            >积碳程度：{{item.degree}}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      brandData: [], //汽车品牌
      value1: "",
      hostData: [], //主机厂商
      value2: "",
      audiData: [], //车系
      value3: "",
      carTypeData: [], //车型
      value4: "",
      areaData: [], //区
      value5: "",
      provinceData: [], //省
      value6: "",
      cityData: [], //县
      value7: "",
      radioSel: "不限里程", //里程
      mileageData: [],
      spraySel: "",
      carNumber: null,
      sprayData: [],
      selState: 3,
      status: [
        //状态数据
        { id: 1, label: "轻微", proportion: "" },
        { id: 2, label: "轻度", proportion: "" },
        { id: 3, label: "中度", proportion: "" },
        { id: 4, label: "重度", proportion: "" },
        { id: 5, label: "严重", proportion: "" }
      ],
      isShowTable: false,
      isShowTabs: false,
      pageNo: 1,
      pageSize: 5,
      total: null,
      dataList: [],
      loading: true,
      list_1: [],
      list_2: [],
      list_3: [],
      list_4: [],
      list_5: [],
      allTotle: 0,
      dialogVisible: false,
      active: "1",
      baseArr: [
        { tabName: "轻微", optionName: "喷油嘴", optionId: 1 },
        { tabName: "轻度", optionName: "进气道", optionId: 2 },
        { tabName: "中度", optionName: "进气阀", optionId: 3 },
        { tabName: "重度", optionName: "活塞顶", optionId: 4 },
        { tabName: "严重", optionName: "缸壁", optionId: 5 }
      ],
      tabsData: []
    };
  },
  created() {
    this.getbrandData();
    this.getareaData();
    this.getCarMile();
    this.getEngineData();
  },
  methods: {
    //查询点击
    clickSearch() {
      this.isShowTable = false;
      this.isShowTabs = false;
      this.list_1 = [];
      this.list_2 = [];
      this.list_3 = [];
      this.list_4 = [];
      this.list_5 = [];
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.ctrlDta();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.ctrlDta();
    },
    dateFormat(row) {
      let time = net.dateFormat(row.inputTime);
      return time;
    },
    //查看图片对比
    seeClick(row) {
      this.dialogVisible = true;
      this.tabsData = [];
      net
        .request("admin/image/polling/appImageContrast", "post", {
          jobId: row.jobId
        })
        .then(res => {
          if (res.retcode == 1) {
            var data = res.data;
            for (var i = 0; i < data.length; i++) {
              data[i]["optionName"] = this.baseArr[
                data[i].optionId - 1
              ].optionName;
              data[i]["url1"] =
                net.bigImg + data[i].step1Image + "&showNullImage=false";
              data[i]["url2"] =
                net.bigImg + data[i].step2Image + "&showNullImage=false";
              data[i]["id"] = i + 1;
              var index = data[i].step1Value;
              if (index > 0) {
                data[i]["degree"] = this.baseArr[parseInt(index) - 1].tabName;
              } else {
                data[i]["degree"] = "";
              }
            }
            if (data.length != 0) {
              this.active = data[0].optionName;
            }
            this.tabsData = data;
          }
        });
    },
    //监听tabs切换
    handleClick(tab, event) {
       console.log(tab, event);
    },
    //获取列表数据
    getList() {
      var mileStart, mileEnd;
      if (this.radioSel != "") {
        if (this.radioSel != "不限里程") {
          var mileArr = this.radioSel.split("-");
          mileStart = mileArr[0];
          mileEnd = mileArr[1];
        } else {
          mileStart = 0;
          mileEnd = 1000000;
        }
      }
      var params = {
        brandId: this.value1,
        factoryId: this.value2,
        seriesId: this.value3,
        modelId: this.value4,
        areaId: this.value5,
        provinceId: this.value6,
        cityId: this.value7,
        mileEnd: mileEnd,
        mileStart: mileStart,
        carNumber: this.carNumber,
        engineId: this.spraySel
      };
      if (this.value1 == "") {
        params["brandId"] = 0;
      }
      if (this.value2 == "") {
        params["factoryId"] = 0;
      }
      if (this.value3 == "") {
        params["seriesId"] = 0;
      }
      if (this.value4 == "") {
        params["modelId"] = 0;
      }
      if (this.value5 == "") {
        params["areaId"] = 0;
      }
      if (this.value6 == "") {
        params["provinceId"] = 0;
      }
      if (this.value7 == "") {
        params["cityId"] = 0;
      }
      if (this.radioSel == "") {
        params["mileEnd"] = 0;
        params["mileStart"] = 0;
      }
      net
        .request("admin/image/polling/appImage", "post", null, params)
        .then(res => {
          if (res.retcode == 0) {
            net.message(this, res.retmsg, "warning");
            return;
          }
      this.isShowTable = true;
          var f_arr = res.data;
          // f_arr.sort(this.sortTwoCate);
          var data = f_arr;
          this.allTotle = data.length;
          for (var i = 0; i < data.length; i++) {
            if (data[i].colligateValue == 1) {
              this.list_1.push(data[i]);
            }
            if (data[i].colligateValue == 2) {
              this.list_2.push(data[i]);
            }
            if (data[i].colligateValue == 3) {
              this.list_3.push(data[i]);
            }
            if (data[i].colligateValue == 4) {
              this.list_4.push(data[i]);
            }
            if (data[i].colligateValue == 5) {
              this.list_5.push(data[i]);
            }
          }
          if (this.list_1.length == 0) {
            this.status[0].proportion = "(0%)";
          } else {
            this.status[0].proportion =
              "(" +
              ((this.list_1.length / this.allTotle) * 100).toFixed(2) +
              "%" +
              ")";
          }
          if (this.list_2.length == 0) {
            this.status[1].proportion = "0%";
          } else {
            this.status[1].proportion =
              "(" +
              ((this.list_2.length / this.allTotle) * 100).toFixed(2) +
              "%" +
              ")";
          }
          if (this.list_3.length == 0) {
            this.status[2].proportion = "0%";
          } else {
            this.status[2].proportion =
              "(" +
              ((this.list_3.length / this.allTotle) * 100).toFixed(2) +
              "%" +
              ")";
          }
          if (this.list_4.length == 0) {
            this.status[3].proportion = "0%";
          } else {
            this.status[3].proportion =
              "(" +
              ((this.list_4.length / this.allTotle) * 100).toFixed(2) +
              "%" +
              ")";
          }
          if (this.list_5.length == 0) {
            this.status[4].proportion = "0%";
          } else {
            this.status[4].proportion =
              "(" +
              ((this.list_5.length / this.allTotle) * 100).toFixed(2) +
              "%" +
              ")";
          }
          this.ctrlDta();
        });
    },
    //排序
    sortTwoCate(a, b) {
      if (a["imageCount1"] === b["imageCount1"]) {
        if (a["imageCount2"] < b["imageCount2"]) {
          return 1;
        } else if (a["imageCount2"] > b["imageCount2"]) {
          return -1;
        } else {
          return 0;
        }
      } else {
        if (a["imageCount1"] < b["imageCount1"]) {
          return 1;
        } else {
          return -1;
        }
      }
    },
    //监听5个维度单选
    stateChange() {
      this.pageNo = 1;
      this.pageSize = 5;
      this.ctrlDta();
    },
    //分页
    paging(list) {
      var start = this.pageNo * this.pageSize - (this.pageSize / 5) * 5;
      var end = this.pageNo * this.pageSize;
      var arr = list.slice(start, end);
      this.total = list.length;
      this.dataList = arr;
      this.loading = false;
    },
    //不同维度控制数据
    ctrlDta() {
      if (this.selState == 1) {
        this.paging(this.list_1);
      }
      if (this.selState == 2) {
        this.paging(this.list_2);
      }
      if (this.selState == 3) {
        this.paging(this.list_3);
      }
      if (this.selState == 4) {
        this.paging(this.list_4);
      }
      if (this.selState == 5) {
        this.paging(this.list_5);
      }
    },
    //获取汽车品牌
    getbrandData() {
      net.request("admin/select/getCarBrand", "post").then(res => {
        if (res.retcode == 1) {
          this.brandData = res.data;
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    getEngineData(callback) {
      callback = callback || function() {};
      net.request("admin/select/getEngineType", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.sprayData = res.data;
          callback();
        } else {
          net.message(this, res.retmsg, "error");
        }
      });
    },
    //监听下拉
    brandChange(value) {
      this.hostData = [];
      this.audiData = [];
      this.carTypeData = [];
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      this.gethostData(value);
    },
    //获取主机厂商
    gethostData(brandId) {
      net
        .request("admin/select/getCarFactory", "post", { brandId: brandId })
        .then(res => {
          if (res.retcode == 1) {
            this.hostData = res.data;
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
    getaudiData(factoryId) {
      net
        .request("admin/select/getCarSeries", "post", { factoryId: factoryId })
        .then(res => {
          if (res.retcode == 1) {
            this.audiData = res.data;
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
    getcarTypeData(seriesId) {
      net
        .request("admin/select/getCarModel", "post", { seriesId: seriesId })
        .then(res => {
          if (res.retcode == 1) {
            this.carTypeData = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
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
    //获取里程POST /admin/select/getCarMileage
    getCarMile() {
      net.request("admin/select/getCarMileage", "post").then(res => {
        if (res.retcode == 1) {
          var data = res.data;
          data.unshift({ id: 0, mileage: "不限里程" });
          this.mileageData = data;
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    }
  },
  filters: {
    state(val) {
      var arr = ["轻微", "轻度", "中度", "重度", "严重"];
      var str = arr[parseInt(val) - 1];
      return str;
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  .search {
    display: flex;
    flex-wrap: wrap;
    .p_select {
      margin-right: 20px;
      margin-top: 15px;
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
