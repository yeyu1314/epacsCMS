<template>
  <div class="content">
    <div class="search">
      <div class="p_select">
        <el-select v-model="value1" clearable filterable placeholder="请选择品牌" @change="brandChange">
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
        <el-select v-model="value7" clearable placeholder="请选择县" @change="repairSite">
          <el-option
            v-for="item in cityData"
            :key="item.id"
            :label="item.cityName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
     <div class="p_select">
        <el-select clearable v-model="orgin" filterable placeholder="请选择检测站点" >
          <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-input placeholder="请输入最小里程" v-model="minimumMileage" clearable></el-input>
      </div>
      <div class="p_select">
        <el-input placeholder="请输入最大里程" v-model="maximumMileage" clearable></el-input>
      </div>
      <div class="p_select">
        <el-date-picker
          v-model="range"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>

      <div class="p_select">
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" @click="exportForm" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div style="margin-top:15px" v-if="carModel">
      <!-- <div style="margin-bottom: 10px;font-size:14px">
      <el-row :gutter="20">
      <el-col :span="2">合计项：</el-col>
      <el-col :span="5">检测台次：{{totalCheckCount}}</el-col>
      <el-col :span="5">治疗台次：{{totalRepairCount}}</el-col>
      <el-col :span="4">转化率：{{totalConversion}}</el-col>
    </el-row>
    </div> -->
      <template>
        <el-table :data="listArr" :header-cell-style="getRowClass" :summary-method="getSummaries" show-summary border style="width: 100%;">
          <el-table-column prop="brandName" label="品牌" align="center" min-width="80"></el-table-column>
          <el-table-column prop="seriesName" label="车系" align="center" min-width="80"></el-table-column>
          <el-table-column prop="modelName" label="车型" align="center" min-width="80"></el-table-column>
          <el-table-column prop="checkCount" label="检测台次" align="center" min-width="80"></el-table-column>
          <el-table-column prop="repairCount" label="治疗台次" align="center" min-width="80"></el-table-column>
          <el-table-column :formatter='conversion' prop="checkRate" label="转化率" align="center" min-width="80"></el-table-column>
          <!-- <el-table-column
            :formatter="checkCount"
            prop="cityName"
            label="检测车系占比"
            align="center"
            min-width="80"
          ></el-table-column>
          <el-table-column
            :formatter="repairCount"
            prop="cityName"
            label="治疗车系占比"
            align="center"
            min-width="80"
          ></el-table-column> -->
          <el-table-column prop="orgName" label="检测站点" align="center" min-width="80"></el-table-column>
          <el-table-column prop="cityName" label="城市" align="center" min-width="80"></el-table-column>
        </el-table>
      </template>
      <div style="text-align:left;margin-top:15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20,30]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      carModel:false,
      brandData: [], //汽车品牌
      value1: 17,
      hostData: [], //主机厂商
      value2: 32,
      audiData: [], //车系
      value3: 79,
      carTypeData: [], //车型
      value4: "",
      areaData: [], //区
      value5: "",
      provinceData: [], //省
      value6: "",
      cityData: [], //县
      value7: "",
      radioSel: "不限里程", //里程
      orginArr: [], //站点
      orgin: "",
      range:[this.GetDateStr(-30),new Date()],//日期选择
      mileageData: [],
      spraySel: "",
      carNumber: null,
      sprayData: [],
      selState: 3,
      isShowTable: false,
      isShowTabs: false,
      pageNo: 1,
      pageSize: 10,
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
      tabsData: [],
      listArr: [],
      total1: null,
      detectionProportion: "",
      treatmentProportion: "",
      minimumMileage:'',
      maximumMileage:'',
      page: {
        pageNo: 1,
        pageSize: 10
      },
      parameter: {
        area: "",
        brand: "",
        carModel: "",
        city: "",
        endTim: null,
        factory: "",
        orgName: "",
        maxMile:'',
        minMile:'',
        province: "",
        series: "",
        startTime: null
      },
      totalCheckCount:'',
      totalRepairCount:'',
      totalConversion:''
    };
  },
  created() {
    this.getbrandData();
    this.getareaData();
    this.getEngineData();
    this.getOrgin(0);
    this.brandChange1(17);
    // this.getList(this.page, this.parameter);
  },
  methods: {
    //查询点击
    clickSearch() {
      let endTime = null;
      let startTime = null;
      if (this.range == null) {
        endTime = null;
        startTime = null;
      } else {
        endTime = Date.parse(this.range[1]);
        startTime = Date.parse(this.range[0]);
      }
      if(this.minimumMileage > this.maximumMileage){
        this.$message.error('最小里程不得大于最大里程')
        return
      }
      let parameter = {
        area: this.value5,
        brand: this.value1,
        carModel: this.value4,
        city: this.value7,
        endTim: endTime,
        factory: this.value2,
        orgName: this.orgin,
        maxMile:this.maximumMileage,
        minMile:this.minimumMileage,
        province: this.value6,
        series: this.value3,
        startTime: startTime
      };
      this.carModel = true;
      this.parameter = parameter;
      this.getList(this.page, this.parameter);
    },
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.ctrlDta();
    // },
    // handleCurrentChange(val) {
    //   this.pageNo = val;
    //   this.ctrlDta();
    // },
    dateFormat(row, column) {
      let time = net.dateFormat(row.inputTime);
      return time;
    },

    //不同维度控制数据
    // ctrlDta() {
    //   if (this.selState == 1) {
    //     this.paging(this.list_1);
    //   }
    //   if (this.selState == 2) {
    //     this.paging(this.list_2);
    //   }
    //   if (this.selState == 3) {
    //     this.paging(this.list_3);
    //   }
    //   if (this.selState == 4) {
    //     this.paging(this.list_4);
    //   }
    //   if (this.selState == 5) {
    //     this.paging(this.list_5);
    //   }
    // },
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
    brandChange1(val){
      this.gethostData(val);
      this.getaudiData1(32)
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
    getaudiData1(val){
      this.getaudiData(val);
      this.getcarTypeData1(79)
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
    getcarTypeData1(value){
      this.getcarTypeData(value)
    },
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
    repairSite(value){
      this.getOrgin(value)
      if(value == null || value == ''){
        this.getOrgin(0)
      }else{
        this.getOrgin(value)
      }
    },
    getOrgin(val) {
      net.request("admin/Organization/getOrganizationAll", "post",{
        cityId:val
      },null).then(res => {
        if (res.retcode == 1) {
          this.orginArr = res.data;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    getList(page, shape) {
      let that = this;
      net
        .request("admin/examine/queryCarModelAnalyzeModel", "post", page, shape)
        .then(res => {
          if (res.retcode == 1) {
            that.listArr = res.data.data.rows;
            that.total1 = res.data.data.total;
            that.detectionProportion = res.data.checkcount;
            that.treatmentProportion = res.data.repaircount;
            that.totalCheckCount = res.data.checkcount;
            that.totalRepairCount = res.data.repaircount;
            that.totalConversion = ((that.totalRepairCount / that.totalCheckCount) * 100).toFixed(2) + '%'
          } else {
            that.$message.error(res.retmsg);
          }
        });
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = ['合计项','','',this.totalCheckCount,this.totalRepairCount,this.totalConversion,'',''];

        return sums;
      },
    //导出
    exportForm() {
      this.download()
    },
    download() {
      let url;
      let endTime = null;
      let startTime = null;
      if (this.range == null || this.range == "") {
        endTime = null;
        startTime = null;
      } else {
        endTime = Date.parse(this.range[1]);
        startTime = Date.parse(this.range[0]);
      }
      url =
        net.baseUrl +
        "admin/examine/writeExcelQueryCarModelAnalyzeModelList" +
        "?area=" +
        this.value5 +
        "&brand=" +
        this.value1 +
        "&carModel=" +
        this.value4 +
        "&city=" +
        this.value7 +
        "&endTim=" +
        endTime +
        "&factory=" +
        this.value2 +
        "&orgName=" +
        this.orgin +
        "&province=" +
        this.value6 +
        "&series=" +
        this.value3 +
        "&startTime=" +
        startTime;
      window.open(url);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList(this.page, this.parameter);
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.getList(this.page, this.parameter);
    },
    checkCount(row) {
      return (row.checkCount / this.detectionProportion).toFixed(2) * 100 + "%";
    },
    conversion(row){
      return (row.checkRate * 100).toFixed(2) + '%'
    },
    repairCount(row) {
      return (
        (row.repairCount / this.treatmentProportion).toFixed(2) * 100 + "%"
      );
    },
    GetDateStr(AddDayCount) {   
      var dd = new Date();  
      dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
      var y = dd.getFullYear();   
      var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
      var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
      return y+"-"+m+"-"+d;   
    },
    getRowClass ({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0) {
                return {
                  // 'font-weight':'600',
                  'font-size':'15px',
                  'color':'#4f81bd'
                }
            } else {
                return ''
            }
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
      margin-right: 15px;
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
