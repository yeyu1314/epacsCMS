<template>
  <div class="content">
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
        <el-select
          v-model="value6"
          clearable
          placeholder="请选择省"
          :disabled="province"
          @change="provinceChange"
        >
          <el-option
            v-for="item in provinceData"
            :key="item.id"
            :label="item.provinceName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-select v-model="value7" clearable placeholder="请选择市" :disabled="urbanArea">
          <el-option
            v-for="item in cityData"
            :key="item.id"
            :label="item.cityName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="p_select">
        <el-input placeholder="请输入最小里程" v-model="minimumMileage" clearable></el-input>
      </div>
      <div class="p_select">
        <el-input placeholder="请输入最大里程" v-model="maximumMileage" clearable></el-input>
      </div>
    <!-- <div class="p_select">
        <el-select v-model="mileage" clearable @change="changeMileage" placeholder="请选择里程">
          <el-option
            v-for="item in mileageData"
            :key="item.id"
            :label="item.mileage"
            :value="item.mileage"
          ></el-option>
        </el-select>
      </div> -->
      <div class="p_select">
        <el-select clearable v-model="type" placeholder="请选择积碳维度">
          <el-option
            v-for="item in typeDataArr"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
       <div class="p_select">
        <el-date-picker
          v-model="value8"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="seleteMonth"
        ></el-date-picker>
      </div>
      <div class="p_select">
        <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        <el-button type="warning" @click="exportForm" icon="el-icon-download">导出</el-button>
      </div>
    </div>
    <div style="margin-top:15px" v-if=" carModel">
       <!-- <div style="margin-bottom: 10px;font-size:14px">
      <el-row :gutter="20">
      <el-col :span="2">合计项：</el-col>
      <el-col :span="5">{{carbon}}：{{totalCarbon}}</el-col>
    </el-row>
    </div> -->
      <template>
        <el-table :data="listArr" :header-cell-style="getRowClass" :summary-method="getSummaries" show-summary  border style="width: 100%;">
          <el-table-column prop="cityName" label="城市" align="center" min-width="80"></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center" min-width="80"></el-table-column>
          <el-table-column prop="factoryName" label="主机厂" align="center" min-width="80"></el-table-column>
          <el-table-column prop="seriesName" label="车系" align="center" min-width="80"></el-table-column>
          <el-table-column prop="modelName" label="车型" align="center" min-width="80"></el-table-column>
          <!-- <el-table-column prop='kilometer' label="里程(公里)" align="center" min-width="80"></el-table-column> -->
          <!-- <el-table-column prop="proportion" label="积碳比例" align="center" min-width="80"></el-table-column> -->
          <el-table-column prop="one"  :label="carbon" align="center" min-width="80"></el-table-column>
          <el-table-column  :formatter = 'one' prop="one" :label="ratio" align="center" min-width="80"></el-table-column>
          <!-- <el-table-column prop="two" v-if="type == 2"  label="轻度" align="center" min-width="80"></el-table-column>
          <el-table-column v-if="type == 2" :formatter = 'two' prop="two" label="积碳占比" align="center" min-width="80"></el-table-column>
          <el-table-column prop="three" v-if="type == 3"  label="中度" align="center" min-width="80"></el-table-column>
          <el-table-column v-if="type == 3" :formatter ='three' prop="three" label="积碳占比" align="center" min-width="80"></el-table-column>
          <el-table-column  prop="four" v-if="type == 4"  label="重度" align="center" min-width="80"></el-table-column>
          <el-table-column v-if="type == 4" :formatter ='four' prop="four"  label="积碳占比" align="center" min-width="80"></el-table-column>
            <el-table-column v-if="type ==5"  prop="five"  label="严重" align="center" min-width="80"></el-table-column>
          <el-table-column v-if="type ==5" :formatter ='five' prop="five"  label="积碳占比" align="center" min-width="80"></el-table-column> -->
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
    </div>
  </div>
</template>
<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      carModel:false,
      value1: 17,
      value2: 32,
      value3: 79,
      value4: "",
      value5: "",
      value6: "",
      value7: "",
      value8:[this.GetDateStr(-30),new Date()],
      mileage: "",
      type: 3,
      range:'',
      brandData: [],
      hostData: [],
      audiData: [],
      carTypeData: [],
      areaData: [],
      provinceData: [],
      cityData: [],
      mileageData:[],
      typeDataArr: [
        {
          value: 1,
          name: "轻微"
        },
        {
          value: 2,
          name: "轻度"
        },
        {
          value: 3,
          name: "中度"
        },
        {
          value: 4,
          name: "重度"
        },
        {
          value: 5,
          name: "严重"
        }
      ],
      carbon:'中度车辆合计',
      ratio:'中度车辆占比',
      serviceAdvisor: "",
      construction: "",
      detection: "",
      diagnosis: "",
      listArr: [],
      total1: null,
      province: true,
      urbanArea: true,
      minMile:'',
      maxMile:'',
      totalConversion:'',
      page: {
        pageNo: 1,
        pageSize: 10
      },
      parameter: {
        area:'',
        brand:'',
        carModel:'',
        city:'',
        checkType:'',
        endTime:'',
        factory:'',
        maxMile:'',
        minMile:'',
        province:'',
        series:'',
        startTime:''
        },
       totalCarbon:'',
       minimumMileage:'',
       maximumMileage:'',
    };
  },
  created() {
    this.getbrandData();
    this.getareaData();
    this.getEngineData();
    this.getMileData();
    this.brandChange1(17);
    // this.getList(this.page, this.parameter);
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return {
          // "font-weight": "600",
          "font-size": "15px",
          'color':'#4f81bd'
        };
      } else {
        return "";
      }
    },
     brandChange1(val){
      this.gethostData(val);
      this.getaudiData1(32)
    },
    getaudiData1(val){
      this.getaudiData(val);
      this.getcarTypeData1(79)
    },
    getcarTypeData1(value){
      this.getcarTypeData(value)
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
      if (value != null) {
        this.getprovinceData(value);
        this.province = false;
      } else {
        this.province = true;
      }
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
      if (value != null) {
        this.getcityData(value);
        this.urbanArea = false;
      } else {
        this.urbanArea = true;
      }
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
    //里程区间
    getMileData() {
      net.request("admin/select/getCarMileage", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.mileageData = res.data
          
        } else {
          net.message(this, res.retmsg, "error");
        }
      });
    },
    tiem(row) {
      return net.dateFormat(row.inputTime, 0);
    },
    serviceType(row) {
      if (row.checkType == 1) {
        return "检测";
      }
      if (row.checkType == 2) {
        return "治疗";
      }
      if (row.checkType == 3) {
        return "检测+治疗";
      }
    },
    dismounting(row) {
      if (row.dismountingName == null) {
        return "无";
      } else {
        return row.dismountingName;
      }
    },
    repair(row) {
      if (row.repairName == null) {
        return "无";
      } else {
        return row.repairName;
      }
    },
    one(row){
      return (((row.one/row.total)*100).toFixed(2))+'%';
      // if((row.one/row.total).toFixed(2) == 0.00 ){
      //   return 0
      // }else{
      //   return (((row.one/row.total)/100).toFixed(2));
      // }
    },
    two(row){
      return (((row.two/row.total)*100).toFixed(2))+'%';
    },
    three(row){
      return (((row.three/row.total)*100).toFixed(2))+'%';
    },
    four(row){
      return (((row.four/row.total)*100).toFixed(2))+'%';
    },
    five(row){
      return (((row.five/row.total)*100).toFixed(2))+'%';
    },
    // changeMileage(value){
    //   if(value == null){
    //     console.log(value)
    //     this.minMile = '';
    //     this.maxMile = '';
    //   }else{
    //     this.minMile = parseInt(value.split('-')[0]);
    //     this.maxMile = parseInt(value.split('-')[1]);
    //   }
    // },
    //查询
    clickSearch() {
      // let maxMile,minMile;
      // if(this.mileage != ''){
      //   maxMile = this.maxMile;
      //   minMile = this.minMile
      // }else{
      //   maxMile = '';
      //   minMile = ''
      // }
    // if (this.value8 == "" || this.value8 == null) {
    //       this.$message.error("请选择查询月份");
    //       return;
    //     }
    let endTime = null;
      let startTime = null;
      if (this.value8 == null) {
        endTime = null;
        startTime = null;
      } else {
        endTime = Date.parse(this.value8[1]);
        startTime = Date.parse(this.value8[0]);
      }
      if(this.type == '' || this.type == null){
        this.type = 3;
        this.carbon = this.typeDataArr[this.type - 1].name + '车辆合计'
        this.ratio =  this.typeDataArr[this.type - 1].name + '车辆占比'
      }else{
        this.carbon = this.typeDataArr[this.type - 1].name + '车辆合计'
        this.ratio =  this.typeDataArr[this.type - 1].name + '车辆占比'
      }
      if(parseInt(this.minimumMileage) > parseInt(this.maximumMileage)){
        this.$message.error('最小里程不得大于最大里程')
        return
      }
      let parameter = {
        area:this.value5,
        brand:this.value1,
        carModel:this.value4,
        checkType:this.type,
        city:this.value7,
        endTime:endTime,
        factory:this.value2,
        maxMile:parseInt(this.maximumMileage),
        minMile:parseInt(this.minimumMileage),
        province:this.value6,
        series:this.value3,
        startTime:startTime
      };
      this.parameter = parameter;
      this.carModel = true;
      this.getTotalPrice(parameter)
      this.getList(this.page, this.parameter);
    },
    seleteMonth(value){
      if(value == '' || value == null){
        return
      }
      
    },
    //获取合计项
  getTotalPrice(obj){
    net.request('admin/examine/queryExamineCount','post',null,obj).then(res => {
      if(res.retcode == 1){
        console.log(res)
        console.log(res.data == null)
        if(res.data == null){
          this.totalCarbon ='暂无数据'
        }else{
          this.totalCarbon =   res.data.one;
          this.totalConversion = (((res.data.one/res.data.total)*100).toFixed(2))+'%';
        }
        

      // this.totalCheckCount = res.data.checkCount;
      // this.totalRepairCount = res.data.repairCount;
      // this.totalPrice = res.data.price;
      // this.totalType1 = res.data.type8021;
      // this.totalType2 = res.data.type8022;
      // this.totalIncome = res.data.income.toFixed(2)
      }else{
        this.$message.error(res.retmsg)
      }
    })
  },
   
  //获取列表
    getList(page, shape) {
      net
        .request("admin/examine/queryExamine", "post", page, shape)
        .then(res => {
          if (res.retcode == 1) {
            this.listArr = res.data.rows;
            this.total1 = res.data.total;
            let mile = null
            if(this.mileage == '' || this.mileage == null){
              mile = '全部'
            }else{
               mile = this.mileage
            }
            for(let i =0; i<res.data.rows.length;i++){
              res.data.rows[i].kilometer = mile;
            }
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    getSummaries(param) {
    console.log(param)
        const { columns, data } = param;
        const sums = ['合计项','','','','',this.totalCarbon,this.totalConversion];


        return sums;
      },
    //导出
     exportForm() {
      this.download();
    },
    download() {
      let url;
      url =
        net.baseUrl +
        "admin/examine/writeExcelQueryExamine" +
        "?area=" +
        this.value5 +
        "&brand=" +
        this.value1 +
        "&carModel=" +
        this.value4 +
        "&city=" +
        this.value7 +
        "&factory=" +
        this.value2 +
        '&maxMile=' +
        this.maxMile +
        '&minMile='+
        this.minMile
        "&province=" +
        this.value6 +
        "&series=" +
        this.value3
      window.open(url);
    },
    //分页
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList(this.page, this.parameter);
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.getList(this.page, this.parameter);
    },
    GetDateStr(AddDayCount) {   
      var dd = new Date();  
      dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期  
      var y = dd.getFullYear();   
      var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
      var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
      return y+"-"+m+"-"+d;   
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
