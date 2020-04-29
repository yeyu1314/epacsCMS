<template>
    <div
            style="background-repeat: no-repeat;background-size: 100%;height: 100%;"
            :style="{backgroundImage: 'url(' + bg_pic + ')'}"
    >
        <div
                style="font-weight: bold;font-size: 18px;height: 42px;line-height: 42px;text-align:center;width: 170mm;margin: 0 auto;"
        >EPACS检测报告单
        </div>
        <div class="ctrolPrintPlace">
            <p
                    class="first"
                    style="font-size: 14px;text-align: left;font-weight: bold;padding-left: 90px;height: 26px;line-height: 26px;margin:0;margin-bottom:3px"
            >车辆信息</p>
            <div style="display: flex;flex-direction: row;width: 170mm;margin-left:90px;">
                <div style="width: 105px;height:78px;position: relative;">
                    <img style=" width: 100%;" :src="CarFrameUrl" alt @mouseenter="mouseEnter(-1)"/>
                    <div
                            class="showBigBtn"
                            @mouseleave="mouseLeave()"
                            :data-optionId="-1"
                            style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width: 105px;height: 78px;z-index: 1;"
                    >
                        <i
                                class="el-icon-zoom-in"
                                @click="bigIcon(carBigImageID)"
                                style="color: #fff;font-size: 25px;margin: 30px;"
                        />
                    </div>
                </div>
                <div style="display: flex;flex-direction: column; margin-left:15px;">
                    <div
                            style="line-height: 26px; height: 26px;display: flex;flex-direction: row;padding-left: 20px;font-size: 14px;"
                    >
                    <span
                            style="display: inline-block;margin-right: 15px;width: 200px;text-align: left;"
                    >
                      车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌：
                      <span
                              style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >{{carNumber}}</span>
                    </span>
                        <span style="display: inline-block;margin-right: 15px;">
                      检测地点：
                      <span
                              style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >{{testAddr}}</span>
                    </span>
                    </div>
                    <div
                            style="line-height: 26px; height: 26px;display: flex;flex-direction: row;padding-left: 20px;font-size: 14px;"
                    >
                    <span
                            style="display: inline-block;margin-right: 15px;width: 200px;text-align: left;"
                    >
                      车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系：
                      <span
                              style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >{{ReseriesName}}</span>
                    </span>
                        <span style="display: inline-block;margin-right: 15px;">
                      车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：
                      <span
                              style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >{{cartype}}</span>
                    </span>
                    </div>
                    <div
                            style="line-height: 26px; height: 26px;display: flex;flex-direction: row;padding-left: 20px;font-size: 14px;"
                    >
                    <span style="display: inline-block;width: 215px;text-align: left;">
                      综合油耗：
                      <span
                              v-show="oilDeplete!==0"
                              style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >{{oilDeplete}}L/100km</span>

                      <span
                              v-show="oilDeplete===0"
                              style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      ></span>
                    </span>
                        <span
                                style="display: inline-block;margin-right: 15px;width: 210px;text-align: left;"
                        >
                      里&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;程：
                      <span
                              style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >{{mileNumber}}</span>
                    </span>
                    </div>
                </div>
            </div>
            <div style="margin-left: 88px;width: 158mm;" class="second">
                <p
                        style="font-size: 14px;font-weight: bold;text-align: left;margin-bottom: 10px;width:150px;margin:0;height: 26px;line-height: 26px;"
                >检测影像</p>
                <div style=" width: 100%;display: flex;flex-direction: row;">
                    <div style="width: 48mm;display: flex;flex-direction: column;margin-top:4px;">
                        <p
                                style="font-size: 14px;width: 120px;margin-left:3px;height: 22px;line-height: 22px;background: #eee;text-align: center;"
                                class="picTitle"
                        >检测部位</p>
                        <div
                                v-for="item in placeArr"
                                :key="item.optionId"
                                style="width: 120px;height: 92px;margin-bottom: 20px;position: relative;margin-left:3px;position: relative;"
                                class="ctrl_left"
                        >
                            <img
                                    :src="item.url"
                                    v-if="item.url !== undefined && item.url != null"
                                    alt
                                    style="width: 100%;"
                                    @mouseenter="mouseEnter(item.optionId)"
                            />
                            <p
                                    v-else
                                    style="width: 120px;height: 91px;border: 1px solid #c0c4cc;margin: 0 auto;"></p>
                            <div
                                    class="showBigBtn"
                                    @click="clickOption(item.optionId)"
                                    @mouseleave="mouseLeave(item.optionId)"
                                    :data-optionId="item.optionId"
                                    style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width: 120px;height: 90px;z-index: 1;"
                            >
                                <i
                                        class="el-icon-zoom-in"
                                        @click="bigIcon(item.photoId)"
                                        style="color: #fff;font-size: 22px;margin:35px 5px 0 5px;cursor: pointer;"
                                />
                                <i
                                        class="el-icon-delete"
                                        @click="deleteRow(item.optionId)"
                                        style="color: #fff;font-size: 22px;margin-top: 35px;cursor: pointer;"
                                />
                            </div>
                            <p
                                    style="font-size: 14px;text-align: center;margin:0;border: 1px solid #c0c4cc;height: 20px;line-height: 20px;    margin: 0;margin-top: -3px;"
                            >{{item.optionName}}</p>
                            <p
                                    style="position: absolute;top: 0px;text-align: center;width: 100%;background-color: rgba(103, 194, 58, 0.56);color: #fff;opacity: 1;letter-spacing: 5px;font-size: 12px;padding: 3px 0;"
                                    class="placeVal"
                            >{{item.optionValue | option}}</p>
                            <div
                                    style="width: 35px;position: absolute;top: 15px;right: -37px;"
                                    class="arrowIcon"
                            >
                                <img
                                        v-show="item.contrastResult === 4"
                                        src="../../../assets/img/2.png"
                                        alt
                                        style="width:100%;"
                                        @click="Arrow(item.optionId,item.contrastResult)"
                                />
                                <img
                                        src="../../../assets/img/3.png"
                                        style="width:100%;"
                                        v-show="item.contrastResult === 2"
                                        @click="Arrow(item.optionId,item.contrastResult)"
                                />
                                <img
                                        src="../../../assets/img/equal.png"
                                        style="width:80%;position: relative;top: 13px;"
                                        v-show="item.contrastResult===3"
                                        @click="Arrow(item.optionId,item.contrastResult)"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                            style=" margin-left: 0mm;width: 115.5mm;display: flex;flex-direction: column;margin-top: 5px;"
                    >
                        <p
                                style="font-size: 14px;width:402px;height: 22px;line-height: 22px;background:#eee;text-align: center;"
                                class="picTitle"
                        >大数据对比</p>
                        <div
                                v-for="t in placeArr"
                                :key="t.optionId"
                                style="width: 100%;height: 112px;position: relative;"
                                class="ctrl_right"
                        >
                            <template v-for="c in datapicArr">
                                <div
                                        :key="c.id"
                                        v-if="t.optionId == c.optionId"
                                        style="width: 100%;height: auto;display: flex;flex-direction: row;"
                                >
                                    <div
                                            style="width: 120px;height: 91px;position: relative;"
                                            v-if="c.url2 != null"
                                    >
                                        <div
                                                class="showBigBtn"
                                                @click="clickOption(c.optionId)"
                                                @mouseleave="mouseLeave(c.imageId2)"
                                                :data-optionId="c.imageId2"
                                                style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width: 120px;height: 90px;z-index: 1;"
                                        >
                                            <i
                                                    class="el-icon-zoom-in"
                                                    @click="bigIcon(c.imageId2)"
                                                    style="color: #fff;font-size: 25px;margin: 30px;"
                                            />
                                        </div>
                                        <img
                                                :src="c.url2"
                                                alt
                                                style=" width: 120px;height:90px; background: #eee;"
                                                @mouseenter="mouseEnter(c.imageId2)"
                                        />
                                        <p
                                                style="font-size: 14px;text-align: center;
                          background: #f3816a;
                          line-height: 22px;
                          color: #fff;
                          height: 20px;
                          font-size: 14px;
                          margin-top: -3px;"
                                        >轻度</p>
                                        <div
                                                :data-optionId="c.optionId"
                                                :data-imgId="c.imageId2"
                                                class="tr_sign"
                                                style="display:none;position: absolute;top: 0px;width:0;height:0;border-color: transparent #67c23a;border-width: 0px 0px 30px 30px;border-style: solid;z-index: 1;"
                                        >
                                            <i
                                                    class="el-icon-check"
                                                    style="position: relative;top: 0px;right: 27px;color: #fff;"
                                            />
                                        </div>
                                    </div>
                                    <div v-else style="width: 120px;height: 108px;">
                                        <div
                                                style="width: 118px;height: 88px;border: 1px solid #eee;margin: 0 auto;margin-right: 6px;"
                                        ></div>
                                        <p
                                                style="font-size: 14px;text-align: center;
                          background: #f3816a;
                          line-height: 22px;
                          color: #fff;
                          height: 20px;
                          font-size: 14px;
                          width:120px;
                           margin: 0;
                          "
                                        >轻度</p>
                                    </div>

                                    <div
                                            style="width: 120px;height: 87px;margin: 0 14px;position: relative;left:7px;"
                                            v-if="c.url3 != null"
                                    >
                                        <div
                                                class="showBigBtn"
                                                @click="clickOption(c.optionId)"
                                                @mouseleave="mouseLeave(c.imageId3)"
                                                :data-optionId="c.imageId3"
                                                style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width: 120px;height: 90px;z-index: 1;"
                                        >
                                            <i
                                                    class="el-icon-zoom-in"
                                                    @click="bigIcon(c.imageId3)"
                                                    style="color: #fff;font-size: 25px;margin: 30px;"
                                            />
                                        </div>
                                        <img
                                                :src="c.url3"
                                                alt
                                                style="  width: 120px;height:90px;background: #eee;"
                                                @mouseenter="mouseEnter(c.imageId3)"
                                        />
                                        <p
                                                style="font-size: 14px;text-align: center;margin-top: -3px;
                              background:#ff0000;
                              color: #fff;
                              height: 20px;
                              line-height: 22px;
                              font-size: 14px;
                          "
                                        >中度</p>
                                        <div
                                                :data-optionId="c.optionId"
                                                :data-imgId="c.imageId3"
                                                class="tr_sign"
                                                style="display:none;position: absolute;top: 0px;width:0;height:0;border-color: transparent #67c23a;border-width: 0px 0px 30px 30px;border-style: solid;z-index: 1;"
                                        >
                                            <i
                                                    class="el-icon-check"
                                                    style="position: relative;top: 0px;right: 27px;color: #fff;"
                                            />
                                        </div>
                                    </div>
                                    <div
                                            v-else
                                            style="width: 120px;height: 108px;    margin-left: 22px;margin-right: 6px;"
                                    >
                                        <div style="width: 118px;height: 88px;border: 1px solid #eee;"></div>
                                        <p
                                                style="font-size: 14px;text-align: center;
                              background: #ff0000;
                              color: #fff;
                              font-size: 14px;
                              height: 20px;
                              line-height: 22px;
                              width: 120px;
                              margin: 0;
                          "
                                        >中度</p>
                                    </div>

                                    <div
                                            style="width: 120px;height: 87px;margin: 0 14px;position: relative;"
                                            v-if="c.url4 != null"
                                    >
                                        <div
                                                class="showBigBtn"
                                                @click="clickOption(c.optionId)"
                                                @mouseleave="mouseLeave(c.imageId4)"
                                                :data-optionId="c.imageId4"
                                                style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width: 120px;height: 90px;z-index: 1;"
                                        >
                                            <i
                                                    class="el-icon-zoom-in"
                                                    @click="bigIcon(c.imageId4)"
                                                    style="color: #fff;font-size: 25px;margin: 30px;"
                                            />
                                        </div>
                                        <img
                                                :src="c.url4"
                                                alt
                                                style=" width: 120px;height:90px;background: #eee;"
                                                @mouseenter="mouseEnter(c.imageId4)"
                                        />
                                        <p
                                                class="severe"
                                                style="font-size: 14px;text-align: center;margin-top: -3px;
                          background: #af0101;
                          height: 20px;
                          line-height: 22px;
                          color: #fff;
                          font-size: 14px;
                          "
                                        >重度</p>
                                        <div
                                                :data-optionId="c.optionId"
                                                :data-imgId="c.imageId4"
                                                class="tr_sign"
                                                style="display:none;position: absolute;top: 0px;width:0;height:0;border-color: transparent #67c23a;border-width: 0px 0px 30px 30px;border-style: solid;z-index: 1;"
                                        >
                                            <i
                                                    class="el-icon-check"
                                                    style="position: relative;top: 0px;right: 27px;color: #fff;"
                                            />
                                        </div>
                                    </div>
                                    <div v-else style="width: 120px;height: 108px;margin-left: 14px;">
                                        <div style="width: 118px;height: 88px;border: 1px solid #eee;"></div>
                                        <p
                                                style="font-size: 14px;text-align: center;
                              background: #ff0000;
                              color: #fff;
                              font-size: 14px;
                              height: 20px;
                              line-height: 22px;
                              margin: 0;
                              width:120px;
                          "
                                        >重度</p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="three">
                <div style=" width: 158mm; margin-left: 88px;">
                    <p
                            v-show="isprint"
                            style="height: 30px;line-height: 30px;text-align: left;padding-left: 5px;font-size:14px;margin:0;"
                    >*检测结果</p>
                    <div style="position: relative;" v-show="isprint">
                        <el-input
                                type="textarea"
                                id="chCtrl"
                                :autosize="{ minRows: 4}"
                                placeholder="请输入意见"
                                v-model="advise"
                                maxlength="100"
                                style="font-size:12px;"
                                :disabled="!isShowReach"
                        />
                        <span
                                style="font-size: 14px;position: absolute;bottom: 8px;right: 20px;color: #959595;"
                        >还能输入{{chLen}}字</span>
                    </div>
                    <p
                            v-show="!isprint"
                            style="word-wrap:break-word;    text-align: left;    padding-left: 10px;font-size:12px;margin:0;border: 1px solid;    padding: 5px;"
                    >
                        <span style="font-weight:bolder;">检测结果：</span>
                        {{advise}}
                    </p>
                    <el-button
                            v-if="templateBut"
                            type="primary"
                            style="padding:8px 7px;float:right;margin-top:10px"
                            @click="selectTemplate"
                    >选择模板
                    </el-button>
                </div>
                <div style="width: 158mm;margin: 0px 0 10px 88px;" class="ctroAdvise">
                    <p
                            style="height: 30px;line-height: 30px;text-align: left;padding-left: 5px;font-size:14px;margin:0;"
                            v-show="isprint"
                    >*诊断意见</p>
                    <div style="position: relative;" v-show="isprint">
                        <el-input
                                id="exCtrl"
                                type="textarea"
                                :autosize="{ minRows: 4}"
                                placeholder="请输入说明"
                                v-model="illustrate"
                                maxlength="280"
                                :disabled="!isShowReach"
                                style="font-size:12px;"
                        />
                        <span
                                style="font-size: 12px;position: absolute;bottom: 6px;right: 18px;color: #959595;"
                        >还能输入{{exLen}}字</span>
                    </div>
                    <p
                            v-show="!isprint"
                            style="word-wrap:break-word;text-align: left; padding-left: 10px;font-size:12px;margin:0;padding: 5px;border:1px solid;margin-top:3px"
                    >
                        <span style="font-weight:bolder;">诊断意见：</span>
                        {{illustrate}}
                    </p>
                </div>
                <div
                        style="display: flex;justify-content: space-between;width: 158mm;margin: 20px 0 20px 88px;font-size:14px;"
                >
                    <span style="padding-left:10px;">影像诊断工程师：{{step1ImageHeader}}</span>
                    <span>客户签名：</span>
                    <span
                            style="display:inline-block;text-align: left;padding-right:15px;"
                    >检测日期：{{time}}</span>
                </div>
            </div>
        </div>

        <el-dialog :visible.sync="dialogVisible2" width="700px">
            <div style="width:100%">
                <img :src="bigImage" alt style="width:100%" />
            </div>
        </el-dialog>
        <el-dialog title="对比模板选择" :visible.sync="template" width="500px">
            <p
                    v-for="(item,index) in selectTemplateArr"
                    :key="index"
                    @click="select(item.name)"
            >
                <el-input
                        type="textarea"
                        style="margin-bottom:10px"
                        :rows="2"
                        disabled
                        placeholder="请输入内容"
                        v-model="item.name"
                />
            </p>
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
    name: "contentItem",
    data() {
      return {
        advise: "", //意见
        illustrate: "", //说明
        step1ImageHeader: "",// 影像诊断工程师
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
        engineType: "", //发动机
        engineArr: [],
        engine: [],
        engineType2: "",
        mileSection: "", //里程区间
        mileSectionArr: "",
        statusArr: [],
        placeArr: [],
        //查询
        carPai: null,
        CarFrameUrl: "",
        carBigImageID: "",
        isShowReach: true, // 请输入说明
        //车辆信息
        carNumber: "",
        brandname: "",
        cartype: "",
        ReseriesName: "",
        gasolinetype: "",
        oilDeplete: "",
        testAddr: "",
        // mileNumber: "",
        //暂存参数
        jobId: "",
        jobCode: "",
        version: "",
        //获取图片参数
        p_mileStart: "",
        isprint: true,
        selectTemplateArr: [], //对比模板
        datapicArr: [],
        carFrameImageId: 0,
        dialogVisible2: false,
        bigImage: ''
      };
    },
    props: {
      mileNumber: {
        type: String,
      }
    },
    filters: {
      type(d) {
        const arr = ["", "检测", "治疗", "检测+治疗"];
        return arr[d];
      },
      option(val) {
        const arr = ["未赋值", "轻微", "轻度", "中度", "重度", "严重"];
        const str = arr[parseInt(val)];
        return str;
      }
    },
    mounted() {
      this.Bus.$on("sendOptions", res => { // 接收检测结果
        this.advise = res
      });
      this.Bus.$on('refreshImg', baseArr => { //接收刷新后的图片列表
        this.datapicArr = baseArr
      })
    },
    methods : {
      getContentData(row) {
        console.log('row',row)
        row.review = 1
        // this.mileNumber = row.mile + "km"
        this.carNumber = row.carNumber;
        this.cartype = row.modelName;
        this.ReseriesName = row.seriesName;
        this.testAddr = row.orgName;
        queryByIdFirstReport({carId: row.carId}).then(res => {
          this.oilDeplete = res.data.oilDeplete; // 综合油耗
          if (res.retcode === 1) {
            const arr = res.data.list;
            const param = {
              jobId: row.jobId,
              step: 1
            }
            this.getCenterLeft(param, arr) // 获取检测部位的图片
            this.getCenterRight(row, res.data) //获取大数据对比的渲染图片
            this.seeFristReport(param); //回显报告中的说明，意见
          } else {
            net.message(this, "获取车辆信息异常", "warning");
          }
        });
        this.exChange()
        this.getBgImg(row.orgId)
      },
      // 选择模板
      selectTemplate() {
        this.template = true;
        getExplain(null, null).then(res => {
          if (res.retcode === 1) {
            this.selectTemplateArr = res.data;
          } else {
            this.$mount.error(res.retmsg);
          }
        });
      },
      // 选中模板
      select(val) {
        this.illustrate = val;
        this.exLen = 260 - val.length;
        this.template = false;
      },
      // 获取检测部位的图片
      getCenterLeft(param, arr){
        queryCarTestingPhoto(param).then(d => { //获取检测部位的渲染图片
          const data = d.data;
          const b_arr = [];
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < data.length; j++) {
              if (data[j].optionId === -1) {
                this.carBigImageID = data[j].photoId;
                this.CarFrameUrl = net.imgUrl + data[j].photoId;
              } else if (data[j].optionId === -11) { // 车架号
                this.carFrameImageId = net.imageHP + "image/getLarge?imageId=" + data[j].photoId;
              }
              arr[i]["placeName"] = url;
              if (arr[i].optionId === data[j].optionId) {
                var url = net.imgUrl + data[j].photoId;
                arr[i]["url"] = url;
                arr[i]["photoId"] = data[j].photoId;
                if (data[j].contrastResult === 2 || data[j].contrastResult === 3 || data[j].contrastResult === 4 ) {
                  arr[i]["contrastResult"] = data[j].contrastResult;
                } else {
                  if (data[j].optionValue === 1 || data[j].optionValue === 2) {
                    arr[i]["contrastResult"] = 2;
                  } else if (data[j].optionValue === 4 || data[j].optionValue === 5) {
                    arr[i]["contrastResult"] = 4;
                  } else {
                    arr[i]["contrastResult"] = 3;
                  }
                }
                arr[i]["optionValue"] = data[j].optionValue;
                b_arr.push(arr[i]);
              }
            }
          }
          this.placeArr = b_arr;
          this.$emit('carFrameImage',this.carFrameImageId) // 传 车架号图片 地址
          setTimeout(() => {
            this.trendsEdit(this.placeArr.length);
          }, 300);
        });
      },
      //获取大数据对比的渲染图片
      getCenterRight(row, data) {
        const param = {
          brandId: row.brandId,
          factoryId: row.factoryId,
          seriesId: row.seriesId,
          modelId: row.modelId,
          mileEnd: 0,
          mileStart: row.mile,
          jobId: row.jobId,
          areaId: data.areaId,
          cityId: data.cityId,
          provinceId: data.provinceId
        }
        webMatchFirstReport(null, param).then(res => {
          if (res.retcode === 1) {
            const data = res.data;
            //添加对应的url
            for (let i = 0; i < data.length; i++) {
              if (data[i].imageId2 !== 0) {
                data[i]["url2"] = net.imgUrl + data[i].imageId2;
              } else {
                data[i]["url2"] = null;
              }
              if (data[i].imageId3 !== 0) {
                data[i]["url3"] = net.imgUrl + data[i].imageId3;
              } else {
                data[i]["url3"] = null;
              }
              if (data[i].imageId4 !== 0) {
                data[i]["url4"] = net.imgUrl + data[i].imageId4;
              } else {
                data[i]["url4"] = null;
              }
            }
            //根据部位的顺序调整对应的部位图片
            const datapicArr = [];
            for (let g = 0; g < this.placeArr.length; g++) {
              for (let j = 0; j < data.length; j++) {
                if (this.placeArr[g].optionId === data[j].optionId) {
                  datapicArr.push(data[j]);
                }
              }
            }
            this.datapicArr = datapicArr;
            this.Bus.$emit('originalImg', datapicArr)
          }
        });
      },
      //回显报告中的说明，意见
      seeFristReport(param){
        queryTestingWeb(param).then(res => {
          if (res.retcode === 1){
            this.illustrate = res.data.imageNote;
            this.advise = res.data.diagnosticOption;
            this.time = net.dateFormat(res.data.reportTime, 0);
            this.exLen = 280 - res.data.imageNote.length;
            this.chLen = 100 - res.data.diagnosticOption.length;
            this.step1ImageHeader = res.data.step1ImageHeader;
          }
        })
      },
      // 点击部位图片
      clickOption(optionId){
        this.Bus.$emit('positionSelect', optionId) //把值传给兄弟组件 rightItem
      },
      // 删除部位
      deleteRow(id){
        this.$confirm("是否删除该部位图片", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            this.optionIds.push(id);
            const arr1 = [],
              arr2 = [];
            for (let i = 0; i < this.placeArr.length; i++) {
              if (this.placeArr[i].optionId !== id) {
                arr1.push(this.placeArr[i]);
              }
            }
            for (let j = 0; j < this.datapicArr.length; j++) {
              if (this.datapicArr[j].optionId !== id) {
                arr2.push(this.datapicArr[j]);
              }
            }
            this.placeArr = arr1;
            this.datapicArr = arr2;
          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },


      //动态调整打印布局
      trendsEdit(count) {
        if (count === 1) {
          $(".frist").css({
            "margin-top": "20px"
          });
          $(".second").css({
            "margin-top": "30px"
          });
          $(".three").css({
            "margin-top": "30px"
          });
          $(".picTitle").css({
            "margin-bottom": "20px",
            height: "36px",
            "line-height": "36px"
          });
          $(".ctroAdvise").css({
            "margin-top": "30px"
          });
        }
        if (count === 2 || count === 3) {
          $(".frist").css({
            "margin-top": "20px"
          });
          $(".second").css({
            "margin-top": "30px"
          });
          $(".three").css({
            "margin-top": "15px"
          });
          $(".picTitle").css({
            "margin-bottom": "20px",
            height: "36px",
            "line-height": "36px"
          });
          $(".ctroAdvise").css({
            "margin-top": "30px"
          });
          $(".ctrl_left").css({
            "margin-bottom": "50px"
          });
          $(".ctrl_right").css({
            "margin-bottom": "30px"
          });
        }
        if (count === 4) {
          $(".frist").css({
            "margin-top": "10px"
          });
          $(".second").css({
            "margin-top": "10px"
          });
          $(".three").css({
            "margin-top": "0px"
          });
          $(".picTitle").css({
            "margin-bottom": "5px",
            "margin-top": "5px",
            height: "30px",
            "line-height": "30px"
          });
          $(".ctroAdvise").css({
            "margin-top": "5px"
          });
          $(".ctrl_left").css({
            "margin-bottom": "35px"
          });
          $(".ctrl_right").css({
            "margin-bottom": "15px"
          });
        }
        if (count === 5) {
          $(".picTitle").css({
            "margin-bottom": "0px",
            "margin-top": "0px",
            height: "30px",
            "line-height": "30px"
          });
        }
      },

      mouseEnter(d) {//鼠标进入图片显示放大按钮
        $(".showBigBtn").hide();
        $(".showBigBtn[data-optionid='" + d + "']").show();
      },

      mouseLeave() {
        $(".showBigBtn").hide();
      },

      getBgImg(orgId) {// 获取背景图
        this.bg_pic = net.imageHP + "web/config/watermark/getImage?orgId=" + orgId;
      },

      bigIcon(id) {// 放大图片图标
        this.dialogVisible2 = true;
        this.bigImage = net.bigImg + id;
      },

      exChange() {//监听说明
        $("#exCtrl").on("input propertychange", e => {
          this.exLen = 280 - e.target.value.length;
        });
        $("#chCtrl").on("input propertychange", e => {
          this.chLen = 100 - e.target.value.length;
        });
      },

    }
  };
</script>

<style scoped>

</style>
