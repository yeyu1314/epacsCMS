<template>
    <div>
        <p style="text-align:center;font-weight: bold;">综合维度</p>
        <div class="searchCon" style="margin-bottom: 20px;">
            <el-select
                    v-model="dimensionalityValue"
                    clearable
                    placeholder="请选择报告综合维度"
                    @change="dimensionalityChange"
                    class="f_select"
            >
                <el-option
                        v-for="item in dimensionality"
                        :key="item.value"
                        :label="item.laber"
                        :value="item.value"
                />
            </el-select>
            <el-button type="primary" class="search" size="mini" @click="submitDimensionality">保存</el-button>
        </div>
        <p style="text-align:center;font-weight: bold;">关联车型数据</p>
        <div class="searchCon">
            <el-select
                    v-model="districtData"
                    clearable
                    placeholder="请选择区"
                    @change="areaChange"
                    class="f_select"
            >
                <el-option
                        v-for="item in areaArr"
                        :key="item.id"
                        :label="item.areaName"
                        :value="item.id"
                />
            </el-select>
            <el-select
                    v-model="provinceData"
                    clearable
                    placeholder="请选择省份"
                    @change="provinceChange"
                    class="f_select"
            >
                <el-option
                        v-for="item in provinceArr"
                        :key="item.id"
                        :label="item.provinceName"
                        :value="item.id"
                />
            </el-select>
            <el-select v-model="cityData" clearable placeholder="请选择市/县" class="f_select">
                <el-option
                        v-for="item in cityArr"
                        :key="item.id"
                        :label="item.cityName"
                        :value="item.id"
                />
            </el-select>
        </div>
        <div class="searchCon">
            <el-select
                    v-model="brandData"
                    clearable
                    placeholder="请选择品牌"
                    @change="brandChange"
                    class="p_select"
            >
                <el-option
                        v-for="item in brandDataArr"
                        :key="item.id"
                        :label="item.brandName"
                        :value="item.id"
                />
            </el-select>
            <el-select
                    v-model="firmData"
                    clearable
                    placeholder="请选择主机厂商"
                    @change="hostChange"
                    class="p_select"
            >
                <el-option
                        v-for="item in hostData"
                        :key="item.id"
                        :label="item.factoryName"
                        :value="item.id"
                />
            </el-select>
        </div>
        <div class="searchCon">
            <el-select
                    v-model="seriesData"
                    clearable
                    placeholder="请选择车系"
                    @change="audiChange"
                    class="p_select"
            >
                <el-option
                        v-for="item in audiData"
                        :key="item.id"
                        :label="item.seriesName"
                        :value="item.id"
                />
            </el-select>
            <el-select v-model="typeData" clearable placeholder="请选择车型" class="p_select">
                <el-option
                        v-for="item in carTypeData"
                        :key="item.id"
                        :label="item.modelName"
                        :value="item.id"
                />
            </el-select>
        </div>
        <div class="searchCon">
            <el-select v-model="mileSection" clearable placeholder="请选择里程" class="p_select">
                <el-option
                        v-for="item in mileSectionArr"
                        :key="item.id"
                        :label="item.mileage"
                        :value="item.mileage"
                />
            </el-select>
            <el-select v-model="engineType2" clearable placeholder="请选择发动机" class="p_select">
                <el-option
                        v-for="item in engine"
                        :key="item.id"
                        :label="item.engineName"
                        :value="item.id"
                />
            </el-select>
        </div>
        <div class="searchCon">
            <el-select
                    v-model="partData"
                    clearable
                    placeholder="请选择部位"
                    style="width:180px;margin: 20px 0 0 20px;"
            >
                <el-option
                        v-for="item in engineArr"
                        :key="item.optionId"
                        :label="item.optionName"
                        :value="item.optionId"
                />
            </el-select>
            <el-button type="primary" class="search" size="mini" @click="searchClick">搜索</el-button>
        </div>
        <div class="searchPercent" v-show="showRightTitle">
            <p>{{rightPercent1}}</p>
            <p>{{rightPercent2}}</p>
            <p>{{rightPercent3}}</p>
        </div>
        <div class="statuspic" v-for="item in statusArr" :key="item.id">
            <div
                    @dblclick="editPrintData(item.optionId,item.url2,1,item.imageId2)"
                    v-if="item.url2 != null"
                    style="position: relative;"
            >
                <img :src="item.url2" alt @mouseenter="mouseEnter(item.sign2)"/>
                <p class="light">{{item.val_1}}</p>
                <div
                        class="showBigBtn"
                        @mouseleave="mouseLeave(item.sign2)"
                        :data-optionId="item.sign2"
                        style="display:none;position:absolute;top: 0;right: 0px;background: #000;opacity: 0.5;width: 112px;height: 85px;z-index: 1;"
                >
                    <i
                            class="el-icon-zoom-in"
                            @click="bigIcon(item.imageId2)"
                            style="color: #fff;font-size: 25px;margin: 30px;"></i>
                </div>
            </div>
            <div v-else class="ulrEmpty">
                <div></div>
                <p class="light">{{item.val_1}}</p>
            </div>
            <div
                    @dblclick="editPrintData(item.optionId,item.url3,2,item.imageId3)"
                    v-if="item.url3 != null"
                    style="position: relative;"
            >
                <img :src="item.url3" alt @mouseenter="mouseEnter(item.sign3)"/>
                <p class="moderate">{{item.val_2}}</p>
                <div
                        class="showBigBtn"
                        @mouseleave="mouseLeave(item.sign3)"
                        :data-optionId="item.sign3"
                        style="display:none;position:absolute;top: 0;right: 0px;background: #000;opacity: 0.5;width: 112px;height: 85px;z-index: 1;"
                >
                    <i
                            class="el-icon-zoom-in"
                            @click="bigIcon(item.imageId3)"
                            style="color: #fff;font-size: 25px;margin: 30px;"></i>
                </div>
            </div>
            <div v-else class="ulrEmpty">
                <div></div>
                <p class="moderate">{{item.val_2}}</p>
            </div>
            <div
                    @dblclick="editPrintData(item.optionId,item.url4,3,item.imageId4)"
                    v-if="item.url4 != null"
                    style="position: relative;"
            >
                <img :src="item.url4" alt @mouseenter="mouseEnter(item.sign4)"/>
                <p class="severe">{{item.val_3}}</p>
                <div
                        class="showBigBtn"
                        @mouseleave="mouseLeave(item.sign4)"
                        :data-optionId="item.sign4"
                        style="display:none;position:absolute;top: 0;right: 2px;background: #000;opacity: 0.5;width: 112px;height: 85px;z-index: 1;"
                >
                    <i
                            class="el-icon-zoom-in"
                            @click="bigIcon(item.imageId4)"
                            style="color: #fff;font-size: 25px;margin: 30px;"></i>
                </div>
            </div>
            <div v-else class="ulrEmpty">
                <div></div>
                <p class="severe">{{item.val_3}}</p>
            </div>
        </div>


        <el-dialog :visible.sync="dialogVisible2" width="700px">
            <div style="width:100%">
                <img :src="bigImage" alt style="width:100%" />
            </div>
        </el-dialog>

    </div>
</template>

<script>
  import {
    getOperatingRecord,
    frozenOrder,
    startVeriftById,
    veriftToExamine,
    veriftPresentation,
    veriftRepulse,
    submitDimensionality,
    getArea,
    getProvince,
    getCity,
    getCarSeries,
    getCarFactory,
    getCarModel,
    getExplain,
    getEngineType,
    getOptionByCarId,
    getCarBrand,
    getCarMileage,
    queryTestingWeb,
    queryCarTestingPhoto,
    queryByIdFirstReport,
    webMatchFirstReport,
    ensureEdit,
    webSelect
  } from "../../../api/index";
  import net from '../../../assets/js/public'
  import $ from "jquery";

  export default {
    name: "rightItem",
    data() {
      return {
        baseData: '',
        dimensionality: [// 增和维度下拉框
          { id: 2, laber: "轻微轻度", value: 2 },
          { id: 3, laber: "中度以上", value: 3 }
        ],
        dimensionalityValue: "", //综合维度
        brandDataArr: [], //汽车品牌
        brandData: "",
        hostData: [], //主机厂商
        firmData: "",
        audiData: [], //车系
        seriesData: "",
        carTypeData: [], //车型
        typeData: "",
        partData: "", //部位
        districtData: -1, //区
        areaArr: [], // 区下拉框
        provinceData: -1, //省
        provinceArr: [],
        cityData: -1, //市县
        cityArr: [],
        //右侧百分百
        rightPercent1: "",
        rightPercent2: "",
        rightPercent3: "",
        showRightTitle: false,
        orgId: "", //机构ID，用于背景图片
        //背景图片
        bg_pic: "",
        optionIds: [],
        carId: "",
        time: "", //时间
        exLen: "", //说明字数
        chLen: "", //意见字数
        checkType: "", //工单类型，判断审核完成后跳转
        showTemplate: false,

        templateBut: true,
        template: false, //对比模板弹出框
        resource: "",
        engineType: "", //部位
        engineArr: [],
        engine: [], // 发动机
        engineType2: "",
        mileSection: "", //里程区间
        mileSectionArr: "",
        statusArr: [],
        placeArr: [],
        originalImg: [],

        bigImage: "",
        dialogVisible2: false,
      };
    },
    created (){

    },
    props: {
      // rowData: {   //这个就是父组件中子标签自定义名字
      //   type: Object
      // }
    },
    watch: {
      // rowData: function() {
      //   this.getSlectData(this.rowData);
      // }
    },
    mounted() {
      this.Bus.$on("positionSelect", res => { // 接收来自兄弟组件contentItem 的值
        this.partData = res
      })
      this.Bus.$on("originalImg", res => { // 接收来自兄弟组件contentItem 的值
        this.originalImg = res
      })
    },
    methods: {
      getSlectData(row) {
        console.log('row',row)

        this.partData = ''
        this.statusArr = []
        this.rightPercent1 = ''
        this.rightPercent2 = ''
        this.rightPercent3 = ''
        this.showRightTitle = false

        this.baseData = row,
        this.dimensionalityValue = row.avgValue > 0 ? row.avgValue : '';//报告维度
        this.getEngineData(() => {
          startVeriftById({ carId: row.carId }).then(res => {
            // console.log("获取数据", res);
            this.carNumber = res.data.carNumber;
            this.brandname = res.data.brandName;
            this.oilDeplete = res.data.oilDeplete;
            this.areaId = res.data.areaId;
            this.cityId = res.data.cityId;
            this.provinceId = res.data.provinceId;
            this.engineType2 = res.data.engineId;

            this.getbrandData(() => { //品牌四级联动
              this.brandData = res.data.brandId;
              this.gethostData(res.data.brandId, () => {
                this.firmData = res.data.factoryId;
                this.getaudiData(res.data.factoryId, () => {
                  this.seriesData = res.data.seriesId;
                  this.getcarTypeData(res.data.seriesId, () => {
                    this.typeData = res.data.modelId;
                    this.getareaData(() => {//区省市三级联动
                      this.districtData = res.data.areaId;
                      this.getprovinceData(res.data.areaId, () => {
                        this.provinceData = res.data.provinceId;
                        this.getcityData(res.data.provinceId, () => {
                          this.cityData = res.data.cityId;
                        });
                      });
                    });
                    // this.getConterData(row.carId); // 获取中间图片内容
                    this.getMileData(); //初始化里程区间
                    // this.seeFristReport(); //查看检测报告
                  });
                });
              });
            }); //初始化品牌
          });
        }, row.carId); //初始化发动机
        this.getEngine();
      },
      // 获取部位
      getEngineData(callback, id) {
        callback = callback || function() {
        };
        getOptionByCarId({ carId: id }).then(res => {
          if (res.retcode === 1) {
            this.engineArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
      },
      getbrandData(callback) {//获取汽车品牌
        callback = callback || function() {
        };
        getCarBrand().then(res => {
          if (res.retcode === 1) {
            this.brandDataArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },
      gethostData(brandId, callback) { //获取主机厂商
        callback = callback || function() {
        };
        getCarFactory({ brandId: brandId }).then(res => {
          if (res.retcode === 1) {
            this.hostData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },
      getaudiData(factoryId, callback) {//获取车系
        callback = callback || function() {
        };
        getCarSeries({ factoryId: factoryId }).then(res => {
          if (res.retcode === 1) {
            this.audiData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },
      getcarTypeData(seriesId, callback) {//获取车型
        callback = callback || function() {
        };
        getCarModel({ seriesId: seriesId }).then(res => {
          if (res.retcode === 1) {
            this.carTypeData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },
      getareaData(callback) {//获取区
        callback = callback || function() {
        };
        getArea().then(res => {
          if (res.retcode === 1) {
            this.areaArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },
      getprovinceData(areaId, callback) { //获取省系
        callback = callback || function() {
        };
        getProvince({ areaId: areaId }).then(res => {
          if (res.retcode === 1) {
            this.provinceArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },
      getcityData(provinceId, callback) { //获取市县
        callback = callback || function() {
        };
        getCity({ provinceId: provinceId }).then(res => {
          if (res.retcode === 1) {
            this.cityArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },
      getMileData(callback) {//里程区间
        callback = callback || function() {
        };
        getCarMileage({}).then(res => {
          if (res.retcode === 1) {
            this.mileSectionArr = res.data;
            this.mileSectionArr.unshift({ id: 0, mileage: "不限里程" });
            this.mileSection = "不限里程";
            callback();
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
      },
      getEngine() { // 获取发动机
        getEngineType({}, {}).then(res => {
          this.engine = res.data;
        });
      },
      dimensionalityChange(value) { // 选择维度
        this.dimensionalityValue = value;
      },
      // 修改综合维度
      submitDimensionality() {
        const param = {
          value: this.dimensionalityValue,
          jobId: this.baseData.jobId
        };
        submitDimensionality(param).then(res => {
          console.log(res);
          if (res.retcode === 1) {
            net.message(this, res.retmsg, "success");
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
      },
      // 选择区
      areaChange(value) {
        // inceData = [];
        // this.citthis.provyData = [];
        this.provinceData = "";
        this.cityData = "";
        this.getprovinceData(value);
      },
      // 选择省份
      provinceChange(value) {
        this.cityData = [];
        this.cityData = "";
        this.getcityData(value);
      },
      // 选择品牌
      brandChange(value) {
        this.hostData = [];
        this.audiData = [];
        this.carTypeData = [];
        this.firmData = "";
        this.seriesData = "";
        this.typeData = "";
        this.gethostData(value);
      },
      // 选择主机厂商
      hostChange(value) {
        this.audiData = [];
        this.carTypeData = [];
        this.seriesData = "";
        this.typeData = "";
        this.getaudiData(value);//获取主机厂商
      },
      audiChange(value) { // 选择车系
        this.carTypeData = [];
        this.typeData = "";
        this.getcarTypeData(value);
      },
      searchClick() { //搜索

        this.showRightTitle = true;
        this.getRightList();
      },
      getRightList() {
        let start, end;
        if (this.mileSection !== "不限里程") {
          const mileArr = this.mileSection.split("-");
          start = mileArr[0];
          end = mileArr[1];
        } else {
          start = 0;
          end = 1000000;
        }
        const param = {
          brandId: this.brandData,
          factoryId: this.firmData,
          seriesId: this.seriesData,
          modelId: this.typeData,
          optionId: this.partData, //
          mileEnd: end,
          mileStart: start,
          areaId: this.districtData,
          cityId: this.cityData,
          provinceId: this.provinceData,
          engineId: this.engineType2
        };
        if (this.value5 === "") {
          net.message(this, "请选择部位！！", "error");
          return false;
        }
        webSelect(null, param).then(res => {
          console.log(res)
          if (res.retcode === 1) {
            const data = res.data.images;
            const percents = res.data.percents;
            for (let i = 0; i < data.length; i++) {
              if (data[i].imageId2 !== 0) {
                data[i]["url2"] = net.imgUrl + data[i].imageId2;
                data[i]["sign2"] = data[i].imageId2 + "_" + i;
              } else {
                data[i]["url2"] = null;
              }
              if (data[i].imageId3 !== 0) {
                data[i]["url3"] = net.imgUrl + data[i].imageId3;
                data[i]["sign3"] = data[i].imageId3 + "_" + i;
              } else {
                data[i]["url3"] = null;
              }
              if (data[i].imageId4 !== 0) {
                data[i]["url4"] = net.imgUrl + data[i].imageId4;
                data[i]["sign4"] = data[i].imageId4 + "_" + i;
              } else {
                data[i]["url4"] = null;
              }
              data[i]["val_1"] = "轻度";
              data[i]["val_2"] = "中度";
              data[i]["val_3"] = "重度";
            }
            console.log(data)
            this.rightPercent1 = percents[0].value;
            this.rightPercent2 = percents[1].value;
            this.rightPercent3 = percents[2].value;
            this.statusArr = data;
          }
        });
      },

      // 双击搜索的图片
      editPrintData(optionId, url, sign, imgId) {
        let baseArr = this.originalImg;
        for (let i = 0; i < baseArr.length; i++) {
          if (baseArr[i].optionId === optionId) {
            if (sign === 1) {
              baseArr[i]["url2"] = url;
              baseArr[i]["imageId2"] = imgId;
            }
            if (sign === 2) {
              baseArr[i]["url3"] = url;
              baseArr[i]["imageId3"] = imgId;
            }
            if (sign === 3) {
              baseArr[i]["url4"] = url;
              baseArr[i]["imageId4"] = imgId;
            }
          }
        }
        // this.datapicArr = baseArr;
        this.Bus.$emit('refreshImg', baseArr) //把值传给兄弟组件 rightItem
        setTimeout(() => {
          $(".tr_sign[data-imgid = '" + imgId + "']").show();
        }, 300);
      },

      mouseEnter(d) {//鼠标进入图片显示放大按钮
        $(".showBigBtn").hide();
        $(".showBigBtn[data-optionid='" + d + "']").show();
      },
      mouseLeave() {
        $(".showBigBtn").hide();
      },
      bigIcon(id) {// 放大图片图标
        this.dialogVisible2 = true;
        this.bigImage = net.bigImg + id;
      },
    }
  };
</script>

<style lang="less" scoped>

</style>
