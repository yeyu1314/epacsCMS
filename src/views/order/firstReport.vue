<!--待编辑报告-->
<template>
  <div>
    <div class="ces-main" v-show="!showEditPage">
      <search-com
        size='medium '
        labelWidth='80px'
        :searchData="searchData"
        :searchForm="searchForm"
        :searchHandle="searchHandle"
      />
      <table-com
        :that='that'
        size='medium '
        :isSelection='true'
        :isIndex='true'
        :isHandle='true'
        :tableData='editDetectionTableData'
        :tableCols='tableCols'
        :newBtnList='detectionOrderEditBtnArrList'
        :isPagination='true'
        :tablePage='editDetectionPagination'
        :longDatas="editDetectionLongData"
      >
      </table-com>
      <record-form
        :that='that'
        :redordData='redordData'
        :redordCols='redordCols'
        :isShowRecord="isShowRecord"
        @closeTip="closeTip"
      />
    </div>
     <div v-show="showEditPage" class="warping">
      <!-- 操作栏 -->
      <div class="operation">
        <div class="left">
          <el-button type="danger" @click="unqualified" v-show="isShowReach">照片不合格</el-button>
          <el-button type="success" @click="keepData" v-show="isShowReach">保存数据</el-button>
          <el-button type="danger" @click="reduction" v-show="isShowReach">还原</el-button>
          <el-button type="info" @click="submitReport" v-show="isShowSub || isShowReach">提交报告</el-button>
          <el-button type="primary" @click="editMileage">编辑里程</el-button>
          <el-button type="primary" @click="seeCarFrameNumber">查看车架号图片</el-button>
          <el-button type="warning" @click="back">返回列表</el-button>
          <el-button type="primary" @click="printdiv">预览/打印</el-button>
        </div>
        <div class="right"></div>
      </div>
      <div class="line"></div>
      <div class="centent" id="firstContent">
        <!-- 左侧 -->
        <div style="background:aliceblue;width: 320px;" @mouseover="showTemplate = !showTemplate">

          <leftItem />

        </div>
        <!-- 中间 -->
        <div
          id="centershow"
          style="width: 210mm;height: 297mm;border: 1px solid #eee; overflow-x: hidden;margin-left:50px;"
        >
           <div
            style="background-repeat: no-repeat;background-size: 100%;height: 100%;"
            :style="{backgroundImage: 'url(' + bg_pic + ')'}"
          >
            <div
              style="font-weight: bold;font-size: 18px;height: 42px;line-height: 42px;text-align:center;width: 170mm;margin: 0 auto;"
            >EPACS检测报告单</div>
            <div class="ctrolPrintPlace">
              <p
                class="first"
                style="font-size: 14px;text-align: left;font-weight: bold;padding-left: 90px;height: 26px;line-height: 26px;margin:0;margin-bottom:3px"
              >车辆信息</p>
              <div style="display: flex;flex-direction: row;width: 170mm;margin-left:90px;">
                <div style="width: 105px;height:78px;position: relative; ">
                  <img style=" width: 100%;" :src="CarFrameUrl" alt @mouseenter="mouseEnter(-1)" />
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
                    ></i>
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
                        v-if="oilDeplete!=0"
                        style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >{{oilDeplete}}L/100km</span>

                      <span
                        v-if="oilDeplete==0"
                        style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
                        v-if="item.url != undefined && item.url != null"
                        alt
                        style="width: 100%;"
                        @mouseenter="mouseEnter(item.optionId)"
                      />
                      <p
                        v-else
                        style="width: 120px;height: 91px;border: 1px solid #c0c4cc;margin: 0 auto;"
                      ></p>
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
                        ></i>
                        <i
                          class="el-icon-delete"
                          @click="deleteRow(item.optionId)"
                          style="color: #fff;font-size: 22px;margin-top: 35px;cursor: pointer;"
                        ></i>
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
                          v-show="item.contrastResult == 4"
                          src="../../assets/img/2.png"
                          alt
                          style="width:100%;"
                          @click="Arrow(item.optionId,item.contrastResult)"
                        />
                        <img
                          src="../../assets/img/3.png"
                          style="width:100%;"
                          v-show="item.contrastResult == 2"
                          @click="Arrow(item.optionId,item.contrastResult)"
                        />
                        <img
                          src="../../assets/img/equal.png"
                          style="width:80%;position: relative;top: 13px;"
                          v-show="item.contrastResult==3"
                          @click="Arrow(item.optionId,item.contrastResult)"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- 右侧对比图形开始 -->
                  <div
                    style=" margin-left: 0mm;width: 115.5mm;display: flex;flex-direction: column;margin-top: 5px;"
                  >
                    <p
                      style="font-size: 14px;width:402px;height: 22px;line-height: 22px;background:#eee;text-align: center;"
                      class="picTitle"
                    >大数据比对</p>
                    <div
                      v-for="t in placeArr"
                      :key="t.optionId"
                      style="width: 100%;height: 112px;position: relative;"
                      class="ctrl_right"
                    >
                      <template v-for="c in datapicArr">
                        <div
                          :key="c.id"
                          v-if="c.optionId == t.optionId"
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
                              ></i>
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
                              ></i>
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
                              ></i>
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
                              ></i>
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
                              ></i>
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
                              ></i>
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
                  <!-- 右侧对比图像结束-->
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
                            :disabled="!isShowReach"
                            style="font-size:12px;"
                    />
                    <span
                      style="font-size: 12px;position: absolute;bottom: 8px;right: 20px;color: #959595;"
                    >还能输入{{chLen}}字</span>
                  </div>
                  <el-button
                    v-if="templateBut"
                    type="primary"
                    style="padding:8px 7px;float:right;margin-top:10px"
                    @click="selectTemplate"
                  >选择模板</el-button>
                  <!-- <p
                    v-show="!isprint"
                    style="word-wrap:break-word;    text-align: left;    padding-left: 10px;font-size:14px;margin:0;padding: 5px;"
                  >

                  </p>-->
                  <p
                    v-show="!isprint"
                    style="word-wrap:break-word;    text-align: left;    padding-left: 10px;font-size:13px;margin:0;border: 1px solid;    padding: 5px;"
                  >
                    <span style="font-weight:bolder;">检测结果：</span>
                    {{advise}}
                  </p>
                </div>

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
                            style="font-size:12px;"
                            :disabled="!isShowReach"
                    />
                    <span
                      style="font-size: 12px;position: absolute;bottom: 6px;right: 18px;color: #959595;"
                    >还能输入{{exLen}}字</span>
                  </div>
                  <p
                    v-show="!isprint"
                    style="word-wrap:break-word;text-align: left;padding-left: 10px;font-size:13px;margin:0;padding: 5px;border:1px solid;margin-top:3px"
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
                    style="display:inline-block;width:162px;text-align: left;margin-right:15px;"
                  >
                    检测日期：
                    <span>{{time}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="rightTool">


          <rightItem />

          <div class="searchCon">
            <el-select
              v-model="value1"
              clearable
              placeholder="请选择品牌"
              @change="brandChange"
              class="p_select"
            >
              <el-option
                      v-for="item in brandData"
                      :key="item.id"
                      :label="item.brandName"
                      :value="item.id"
              />
            </el-select>
            <el-select
              v-model="value2"
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
              v-model="value3"
              clearable
              filterable
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
            <el-select v-model="value4" clearable placeholder="请选择车型" class="p_select">
              <el-option
                      v-for="item in carTypeData"
                      :key="item.id"
                      :label="item.modelName"
                      :value="item.id"
              />
            </el-select>
          </div>
          <div class="searchCon">
            <el-select v-model="engineType2" clearable placeholder="请选择发动机" class="p_select">
              <el-option
                      v-for="item in engine"
                      :key="item.id"
                      :label="item.engineName"
                      :value="item.id"
              />
            </el-select>
            <el-select v-model="mileSection" clearable placeholder="请选择里程" class="p_select">
              <el-option
                      v-for="item in mileSectionArr"
                      :key="item.id"
                      :label="item.mileage"
                      :value="item.mileage"
              />
            </el-select>
          </div>
          <div class="searchCon">
            <el-select
              v-model="value5"
              clearable
              placeholder="请选择部位"
              style="width:180px;margin: 20px 0 0 20px;"
            >
              <el-option
                      v-for="item in engineArr"
                      :key="item.id"
                      :label="item.optionName"
                      :value="item.id"
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
              <img :src="item.url2" alt @mouseenter="mouseEnter(item.sign2)" />
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
                        style="color: #fff;font-size: 25px;margin: 30px;"
                />
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
              <img :src="item.url3" alt @mouseenter="mouseEnter(item.sign3)" />
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
                        style="color: #fff;font-size: 25px;margin: 30px;"
                />
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
              <img :src="item.url4" alt @mouseenter="mouseEnter(item.sign4)" />
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
                        style="color: #fff;font-size: 25px;margin: 30px;"
                />
              </div>
            </div>
            <div v-else class="ulrEmpty">
              <div></div>
              <p class="severe">{{item.val_3}}</p>
            </div>
          </div>
        </div>


      </div>
      
      <el-dialog :visible.sync="dialogVisible2" width="700px">
        <div style="width:100%">
          <img :src="bigImage" alt style="width:100%" />
        </div>
      </el-dialog>
      <el-dialog title="部位" :visible.sync="dialogVisible1" width="500px">
        <el-checkbox-group
          v-model="checkedPlace"
          style="display: flex;flex-direction: column;"
          class="carCondi"
        >
          <el-checkbox
            v-for="item in position"
            :label="item.optionId"
            :key="item.optionId"
            style="height: 32px;text-align: left;margin-left:160px;"
          >{{item.optionName}}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="selectPlace">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改里程" :visible.sync="dialogVisible4" width="30%">
        <el-input placeholder="请输入里程" v-model="editMileNumber" maxlength="8" clearable></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="ensureEdit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="车架号图片" :visible.sync="dialogVisible5" width="800px">
        <img :src="carFrameImageId" alt style="width:768px;height:576px;" />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible5 = false">确 定</el-button>
        </span>
      </el-dialog>
      
    </div>
  </div>
</template>
<script>
import net from "../../assets/js/public"
import $ from "jquery";
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import recordForm from '../../components/tableCompnment/recordForm'
import leftItem from "./firstReport/leftItem";
import contentItem from "./firstReport/contentItem";
import rightItem from "./firstReport/rightItem";
import {getOperatingRecord, frozenOrder, getFirstReportEdir, imgUnqualified, submitReport, ensureEdit, submitDimensionality,
  getArea, getProvince, getCity, getCarBrand, getCarFactory, getCarSeries, getCarModel, getCarMileage, queryTestingWeb, webSelect,
  queryByIdFirstReport, queryCarTestingPhoto, getEngineType, getOptionByCarId, getExplain, webMatchFirstReport} from '../../api'
import {mapActions, mapState} from 'vuex'
import moment from "moment";
import Bus from '../bus'
export default {
  components: {
    tableCom,
    searchCom,
    recordForm,
    leftItem,
    contentItem,
    rightItem
  },
  data () {
    return {
      that: this,
      searchForm: [ // 搜索栏
        {type: 'Input', prop: 'carNumber', width: '180px', placeholder: '请输入车牌'}
      ],
      searchHandle: [ // 搜索按钮
        {label: '查询', icon: 'el-icon-search', type: 'primary', handle: () => this.searchOrder()}
      ],
      tableCols: [// 表头
        {label: '车牌', prop: 'carNumber'},
        {label: '车辆信息', type: 'longData'},
        {label: '下单时间', prop: 'inputTime'},
        {label: '业务类型', prop: 'checkTypeLaber'},
        {label: '故障描述', prop: 'note'},
        {label: '发动机缸数量', prop: 'carCylinder'},
        {label: '当前操作人', prop: 'operatorName'},
        {label: '操作', type: 'button'},
        {
          label: '操作记录',
          type: 'Button',
          btnList: [
            {type: 'success', isShow: true, label: '查看', handle: (that, row) => this.showRecord(that, row)}
          ]
        },
        {
          label: '冻结',
          type: 'Button',
          btnList: [
            {type: 'danger', isShow: true, label: '冻结工单', handle: (that, row) => this.frozen(that, row)}
          ]
        }
      ],
      isShowRecord: false, // 操作记录弹窗
      showTemplate: false,
      dimensionality : [// 增和维度下拉框
              {id:2,laber:'轻微轻度',value:2},
              {id:3,laber:'中度以上',value:3}
        ],
      dimensionalityValue: '', //综合维度
      value1: "",
      hostData: [], //主机厂商
      value2: "",
      audiData: [], //车系
      value3: "",
      carTypeData: [], //车型
      value4: "",
      value5: "", //部位
      value6: -1, //区
      areaArr: [], // 区下拉框
      value7: -1, //省
      provinceArr: [],
      value8: -1, //市县
      cityArr: [],
      brandData: [], //汽车品牌
      engineType: "", //发动机
      engineType2: "", //右边选择发动机的类型
      engineType3: "", //中间获取图片用到
      statusArr: [],
      //右侧百分百
      rightPercent1: "",
      rightPercent2: "",
      rightPercent3: "",
      showRightTitle: false,
      engineArr: [],
      mileSection: "", //里程区间
      mileSectionArr: "",
      engine: [], //发动机
      time: "", //时间
      step1ImageHeader: "",
      illustrate: "", //说明
      advise: "", //意见
      isprint: true,
      bg_pic: "",//背景图片
      optionIds: [],
      carId: "",
      exLen: "", //说明字数
      chLen: "", //意见字数
      dialogVisible3: false,
      seeArr: [],
      templateBut: true,
      template: false, //对比模板弹出框
      resource: "",
      selectTemplateArr: [],
      isShowReach: true,//是否为完成工单跳转过来显示
      isShowSub: false,
      placeArr: [],
      CarFrameUrl: "", //车牌图片
      oilDeplete: "",
      //车辆信息
      carNumber: "",
      brandname: "",
      cartype: "",
      ReseriesName: "",
      testAddr: "",
      mileNumber: "",
      areaId: "",
      cityId: "",
      provinceId: "",
      datapicArr: [],
      //获取图片参数
      p_mileStart: "",
      dialogVisible1: false,//照片不合格弹窗
      checkedPlace: [],
      position: [], //部位数据
      //查询参数
      carPai: null,
      unqualifiedArr: [
        { optionId: -1, optionName: "车牌号" },
        { optionId: -11, optionName: "车架号" },
        { optionId: 1, optionName: "喷油嘴" },
        { optionId: 2, optionName: "进气道" },
        { optionId: 3, optionName: "进气阀" },
        { optionId: 4, optionName: "活塞顶" },
        { optionId: 5, optionName: "缸壁" }
      ],
      editMileNumber: "",
      dialogVisible4: false,
      dialogVisible5: false, //车架号图片dialog
      carFrameImageId: 0,
      //控制图片放大
      dialogVisible2: false,
      bigImage: "",
    }
  },
  created () {
    this.getDetectionOrderEditList()
    this.$store.state.showEditPage = false
    this.$store.state.refresh = false
  },
  computed: {
    ...mapState(['editDetectionTableData', 'editDetectionPagination', 'editDetectionLongData', 'pageNo',
     'pageSize', 'searchData', 'redordData', 'redordCols', 'detectionOrderEditBtnArrList', 'showEditPage',
     'firstReportRow', 'refresh'])// 读数据
  },
  watch: {
    // 如果 `showEditPage` 发生改变，这个函数就会运行
    showEditPage: function (showEditPage) {
      if(showEditPage === true) {
        this.getData()
      }
    },
    refresh: function (refresh) {
      if(refresh === true) {
        this.getDetectionOrderEditList()
      }
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
  methods: {
    ...mapActions(['getDetectionOrderEditList', 'getDetectionImgUploadList']),
    showRecord (that, row) { // 点击操作记录
      this.isShowRecord = true
      getOperatingRecord({ id: row.jobId })
        .then(res => {
          let data = res.data.list
          for (let i = 0; i < res.data.list.length; i++){
            data[i].inputTime = moment(data[i].inputTime).format('YYYY-MM-DD HH:MM')
          }
          this.$store.state.redordData = data
        }).catch(res => {
          console.log('操作记录', res)
        })
    },
    closeTip () { // 关闭弹窗
      this.isShowRecord = false
    },
    frozen (that, row) { // 冻结
      this.$confirm('此操作将冻结此工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(that, row)
        frozenOrder({jobId: row.jobId, version: row.version})
          .then(res => {
            console.log(res)
          }).catch(res => {
            console.log(res)
            this.getDetectionOrderList()
          })
      })
    },

    getData() { // 获取数据
      console.log('成功啦',this.firstReportRow)
      const param = {carId: this.firstReportRow.carId}
      this.getFirstEditData(() => {
        getFirstReportEdir(param).then(res => {
          this.carNumber = res.data.carNumber;
          this.brandname = res.data.brandName;
          this.cartype = res.data.modelName;
          this.ReseriesName = res.data.seriesName;
          this.gasolinetype = res.data.fuelTypeName;
          this.oilDeplete = res.data.oilDeplete;
          this.testAddr = res.data.orgName;
          this.areaId = res.data.areaId;
          this.cityId = res.data.cityId;
          this.provinceId = res.data.provinceId;
          this.engineType2 = res.data.engineId;
          this.mileNumber = this.firstReportRow.mile + "km";
            //品牌四级联动
              this.getbrandData(() => {
                this.value1 = res.data.brandId;
                this.gethostData(res.data.brandId, () => {
                  this.value2 = res.data.factoryId;
                  this.getaudiData(res.data.factoryId, () => {
                    this.value3 = res.data.seriesId;
                    this.getcarTypeData(res.data.seriesId, () => {
                      this.value4 = res.data.modelId;

                      this.getMileData(); //初始化里程区间
                      this.seeFristReport(); //查看检测报告

                      //区省市三级联动
                      this.getareaData(() => {
                        this.value6 = res.data.areaId;
                        this.getprovinceData(res.data.areaId, () => {
                          this.value7 = res.data.provinceId;
                          this.getcityData(res.data.provinceId, () => {
                            this.value8 = res.data.cityId;
                          });
                        });
                      });
                      this.getConterData(this.firstReportRow.carId);
                    });
                  });
                });
              }); //初始化品牌
        }).catch(error => {
          console.log(error)
        })
      },this.firstReportRow.carId)
      
      this.getEngine();
    },
    searchOrder () {
      this.getDetectionOrderEditList()
    },
    unqualified(){ // 照片不合格
      this.position = [];
      this.dialogVisible1 = true;
      this.checkedPlace = [];
      this.position = this.unqualifiedArr;
    },
    selectPlace() { // 照片不合格确认提交按钮
      const param = {
        version: this.firstReportRow.version,
        jobId: this.firstReportRow.jobId,
        code: 32
      };
      if (this.checkedPlace.length === 0) {
        net.message(this, "请选择不合格部位", "error");
        return false;
      }
      imgUnqualified(param, this.checkedPlace).then(res => {
          if (res.retcode === 1) {
            net.message(this, res.retmsg, "success");
            const skip = net.isJump("/onloadPic");
            if (skip) {
              this.$router.push({ path: "/onloadPic" });
            } else {
              this.getDetectionImgUploadList()
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    keepData() { // 保存数据
      if (this.illustrate.length > 280) {
        net.message(
          this,
          "诊断意见超过最大限制字数(280字)，请重新修改",
          "error"
        );
        return false;
      }
      if (this.advise.length > 100) {
        net.message(
          this,
          "检测结果超过最大限制字数(100字)，请重新修改",
          "error"
        );
        return false;
      }
      let list = [];
      for (let i = 0; i < this.datapicArr.length; i++) {
        const obj = {},
                obj1 = {},
                obj2 = {};
        obj["contrast"] = 2;
        obj["imageId"] = this.datapicArr[i].imageId2;
        obj["optionId"] = this.datapicArr[i].optionId;
        obj1["contrast"] = 3;
        obj1["imageId"] = this.datapicArr[i].imageId3;
        obj1["optionId"] = this.datapicArr[i].optionId;
        obj2["contrast"] = 4;
        obj2["imageId"] = this.datapicArr[i].imageId4;
        obj2["optionId"] = this.datapicArr[i].optionId;
        list.push(obj);
        list.push(obj1);
        list.push(obj2);
      }
      const params = {
        jobId: this.firstReportRow.jobId,
        jobCode: 220,
        optionIds: this.optionIds.join(","),
        version: this.firstReportRow.version
      };
      console.log(params)
      const checkRecordList = [];
      for (let i = 0; i < this.placeArr.length; i++) {
        const obj3 = {};
        obj3["contrastResult"] = this.placeArr[i].contrastResult;
        obj3["optionId"] = this.placeArr[i].optionId;
        checkRecordList.push(obj3);
      }
      console.log(this.advise.length);
      const data = {
        imageNote: this.illustrate, //说明
        diagnosticOption: this.advise,
        list: list,
        checkRecordList: checkRecordList
      };
      net
        .request("admin/order/writePresentation", "post", params, data)
        .then(res => {
            console.log(res)
          if (res.retcode === 1) {
            console.log(res)
            this.isShowSub = true;
            this.version = res.data;
            net.message(this, res.retmsg, "suuccess");
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    reduction() { // 还原数据
      this.advise = "";
      this.illustrate =
        "检测比对是指在同区域、同车型、同里程条件下从大数据中检索出来的关联车型积碳生成的不同维度影像：轻度--表示比对范围内积碳较少；中度--表示比对范围内积碳平均水平；重度--表示比对范围内积碳最多。";
      this.getConterData(this.firstReportRow.carId);
      setTimeout(() => {
        $(".tr_sign").each(function() {
          $(this).hide();
        });
      }, 300);
    },
    submitReport() { // 提交数据
      if (this.illustrate.length > 280) {
        net.message(
          this,
          "诊断意见超过最大限制字数(280字)，请重新修改",
          "error"
        );
        return false;
      }
      if (this.advise.length > 100) {
        net.message(
          this,
          "检测结果超过最大限制字数(100字)，请重新修改",
          "error"
        );
        return false;
      }
      let list = [];
      for (let i = 0; i < this.datapicArr.length; i++) {
        const obj = {},
                obj1 = {},
                obj2 = {};
        obj["contrast"] = 2;
        obj["imageId"] = this.datapicArr[i].imageId2;
        obj["optionId"] = this.datapicArr[i].optionId;
        obj1["contrast"] = 3;
        obj1["imageId"] = this.datapicArr[i].imageId3;
        obj1["optionId"] = this.datapicArr[i].optionId;
        obj2["contrast"] = 4;
        obj2["imageId"] = this.datapicArr[i].imageId4;
        obj2["optionId"] = this.datapicArr[i].optionId;
        list.push(obj);
        list.push(obj1);
        list.push(obj2);
      }
      const params = {
        jobId: this.firstReportRow.jobId,
        jobCode: 230,
        optionIds: this.optionIds.join(","),
        version: this.firstReportRow.version
      };
      const checkRecordList = [];
      for (let i = 0; i < this.placeArr.length; i++) {
        const obj3 = {};
        obj3["contrastResult"] = this.placeArr[i].contrastResult;
        obj3["optionId"] = this.placeArr[i].optionId;
        checkRecordList.push(obj3);
      }
      const data = {
        imageNote: this.illustrate, //说明
        diagnosticOption: this.advise,
        list: list,
        checkRecordList: checkRecordList
      };
      submitReport(params, data).then(res => {
          if (res.retcode === 1) {
            net.message(this, res.retmsg, "suuccess");
            const skip = net.isJump("/waitVerify");
            if (skip) {
              this.$router.push({ path: "/waitVerify" });
            } else {
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 3 }
              );
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    ensureEdit() { //确认编辑
      let reg = /^\d+$/;
      console.log(this.editMileNumber);
      if (!reg.test(this.editMileNumber)) {
        net.message(this, "里程只能为非负正整数", "error");
        return false;
      }
      const params = {
        jobId: this.firstReportRow.jobId,
        mile: this.editMileNumber
      }
      ensureEdit(params).then(res => {
          if (res.retcode === 1) {
            net.message(this, "修改成功", "success");
            this.dialogVisible4 = false;
            this.mileNumber = this.editMileNumber + "km";
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    editMileage() { // 编辑里程
      this.editMileNumber = "";
      this.dialogVisible4 = true;
    },
    seeCarFrameNumber() { // 查看车架号图片
      this.dialogVisible5 = true;
    },
    back() { // 返回列表
      if (this.firstReportRow.operId === 1) {
        this.$router.push({ path: "/completeOrder" })
      } else if (this.firstReportRow.operId === 2) {
        this.$router.push({ path: "/ensureOrder" })
      } else {
        this.$store.state.showEditPage = false
        this.getDetectionOrderEditList()
      }
    },
    printdiv() { // 打印
      this.isprint = false;
      this.templateBut = false;
      $(".placeVal").each(function() {
        $(this).hide();
        $(".ctrolPrintPlace").css({
          position: "relative",
          right: "32px"
        });
      });
      $(".severe").each(function() {
        $(this).css({
          width: "120px"
        });
      });
      const iconArr = [];
      $(".tr_sign").each(function() {
        const flag = $(this).is(":hidden");
        if (flag === false) {
          iconArr.push($(this).data("imgid"));
          $(this).hide();
        }
      });
      if (this.isShowArrow === "不打印") {
        $(".arrowIcon").hide();
      }
      setTimeout(() => {
        $(".placeVal").each(function() {
          $(this).show();
          $(".ctrolPrintPlace").css({
            position: "relative",
            right: "0"
          });
        });
        this.isprint = true;
        this.templateBut = true;
        $(".arrowIcon").show();
        $(".tr_sign").each(function() {
          if (iconArr.length !== 0) {
            for (let i = 0; i < iconArr.length; i++) {
              if ($(this).data("imgid") == iconArr[i]) {
                $(this).show();
              }
            }
          }
        });
        $(".severe").each(function() {
          $(this).css({
            width: "120px"
          });
        });
      }, 600);
      setTimeout(() => {
        net.printServer(
          document.getElementById("centershow").innerHTML,
          myWindow => {
            setTimeout(() => {
              myWindow.print();
              myWindow.close();
            }, 1000);
          }
        );
      }, 300);
    },

    adviseArrow() {
      this.advise = this.opinion;
    },
    select(val) {
      this.illustrate = val;
      this.exLen = 260 - val.length;
      this.template = false;
    },
    dimensionalityChange(value) { // 选择综合维度
      this.dimensionalityValue = value
    },
    submitDimensionality() { // 保存综合维度
      const param = {
        value : this.dimensionalityValue,
        jobId: this.firstReportRow.jobId,
      };
      submitDimensionality(param).then(res => {
          console.log(res)
          if (res.retcode === 1) {
            net.message(this, res.retmsg, "success");
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    getareaData(callback) { //获取区
      callback = callback || function() {};
      getArea().then(res => {
        if (res.retcode === 1) {
          this.areaArr = res.data;
          callback();
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    areaChange(value) {
      this.provinceData = [];
      this.cityData = [];
      this.value7 = "";
      this.value8 = "";
      this.getprovinceData(value);
    },
    getprovinceData(areaId, callback) { //获取省系
      callback = callback || function() {};
      const param = {
        areaId: areaId
      }
      getProvince(param).then(res => {
          if (res.retcode === 1) {
            this.provinceArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    provinceChange(value) {
      this.cityData = [];
      this.value8 = "";
      this.getcityData(value);
    },
    
    getcityData(provinceId, callback) {//获取市县
      callback = callback || function() {};
      const param = {provinceId: provinceId}
      getCity(param).then(res => {
          if (res.retcode === 1) {
            this.cityArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    
    getbrandData(callback) {//获取汽车品牌
      callback = callback || function() {};
      getCarBrand().then(res => {
        if (res.retcode === 1) {
          this.brandData = res.data;
          callback();
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    
    brandChange(value) { //监听下拉  请选择品牌
      this.hostData = [];
      this.audiData = [];
      this.carTypeData = [];
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      this.gethostData(value);
    },
    
    gethostData(brandId, callback) { //获取主机厂商
      callback = callback || function() {};
      getCarFactory({ brandId: brandId }).then(res => {
          if (res.retcode === 1) {
            this.hostData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    hostChange(value) { // 选择主机厂商
      this.audiData = [];
      this.carTypeData = [];
      this.value3 = "";
      this.value4 = "";
      this.getaudiData(value);
    },
     
    getaudiData(factoryId, callback) { //获取车系
      callback = callback || function() {};
      getCarSeries({factoryId: factoryId}).then(res => {
          if (res.retcode === 1) {
            this.audiData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    audiChange(value) { // 选择车系
      this.carTypeData = [];
      this.value4 = "";
      this.getcarTypeData(value);
    },
    
    getcarTypeData(seriesId, callback) { //获取车型
      callback = callback || function() {};
      getCarModel({ seriesId: seriesId }).then(res => {
          if (res.retcode === 1) {
            this.carTypeData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    searchClick() {//搜索
      this.showRightTitle = true;
      this.getRightList();
    },
    
    getMileData(callback) { //里程区间
      callback = callback || function() {};
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
    
    seeFristReport() { //回显报告中的说明，意见
      const param = {
        jobId: this.firstReportRow.jobId,
        step: 1
      }
      queryTestingWeb(param).then(res => {
          if (res.retcode === 1) {
            if (res.data != null) {
              this.illustrate = res.data.imageNote;
              this.advise = res.data.diagnosticOption;
              this.artificer = res.data.userName;
              this.time = net.dateFormat(res.data.reportTime, 0);
              this.exLen = 280 - res.data.imageNote.length;
              this.chLen = 100 - res.data.diagnosticOption.length;
              this.step1ImageHeader = res.data.step1ImageHeader;
              this.dimensionalityValue = res.data.avgValue > 0 ? res.data.avgValue : '';//报告维度
            } else {
              this.exLen = 280;
              this.chLen = 100;
            }
          }
        });
    },
    getRightList() {//获取右边查询数据
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
        brandId: this.value1,
        factoryId: this.value2,
        seriesId: this.value3,
        modelId: this.value4,
        optionId: this.value5, //
        mileEnd: end,
        mileStart: start,
        areaId: this.value6,
        cityId: this.value8,
        provinceId: this.value7,
        engineId: this.engineType2
      };
      if (this.value5 === "") {
        net.message(this, "请选择部位！！", "error");
        return false;
      }
      webSelect(null, param).then(res => {
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
            this.rightPercent1 = percents[0].value;
            this.rightPercent2 = percents[1].value;
            this.rightPercent3 = percents[2].value;
            this.statusArr = data;
          }
        });
    },
    getConterData(carId) {//中间图片数据
      queryByIdFirstReport({carId: carId}).then(res => {
          // console.log(res.data);
          if (res.retcode === 1) {
            this.engineType3 = res.data.engineId;
            this.fuelTypeName = res.data.fuelTypeName;
            this.modelName = res.data.modelName;
            this.brandName = res.data.brandName;
            this.carCount = res.data.carNumber;
            const arr = res.data.list;
            const b_arr = [];
            //获取检测部位数据
            const param = {
              jobId: this.firstReportRow.jobId,
              step: 1
            }
            queryCarTestingPhoto(param).then(d => {
                const data = d.data;
                for (let i = 0; i < arr.length; i++) {
                  for (let j = 0; j < data.length; j++) {
                    if (data[j].optionId === -1) {
                      this.carBigImageID = data[j].photoId;
                      this.CarFrameUrl = net.imgUrl + data[j].photoId;
                    } else if (data[j].optionId === -11) {
                      this.carFrameImageId =
                        net.imageHP +
                        "image/getLarge?imageId=" +
                        data[j].photoId;
                    }
                    let url = ''
                    arr[i]["placeName"] = url;
                    if (arr[i].optionId === data[j].optionId) {
                      // var url = net.imgUrl + data[j].photoId; ///sdfghjkl;
                      arr[i]["url"] = net.imgUrl + data[j].photoId;
                      arr[i]["photoId"] = data[j].photoId;
                      if (data[j].contrastResult === 2 || data[j].contrastResult === 3 || data[j].contrastResult === 4) {
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
                setTimeout(() => {
                  this.trendsEdit(this.placeArr.length);
                }, 300);
                this.getCenterRight(); //获取中间右边的渲染图片
                for (let g = 0; g < this.unqualifiedArr.length; g++) {
                  for (let h = 0; h < data.length; h++) {
                    if (this.unqualifiedArr[g].optionId === data[h].optionId) {
                      this.unqualifiedArr[g].optionName =
                        this.unqualifiedArr[g].optionName + " (已上传图片)";
                    }
                  }
                }
              });
          } else {
            net.message(this, "获取车辆信息异常", "warning");
          }
        });
    },
    getEngine() { // 获取发动机
      getEngineType().then(res => {
        this.engine = res.data;
      });
    },
    getFirstEditData(callback, id) {
      callback = callback || function() {};
      getOptionByCarId({carId: id}).then(res => {
          if (res.retcode === 1) {
            this.engineArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },

    mouseEnter(d) { //鼠标进入图片显示放大按钮
      $(".showBigBtn").hide();
      $(".showBigBtn[data-optionid='" + d + "']").show();
    },
    mouseLeave() {
      $(".showBigBtn").hide();
    },
    selectTemplate() { //选择模板
      this.template = true;
      getExplain({},{}).then(res => {
        if (res.retcode === 1) {
          this.selectTemplateArr = res.data;
        } else {
          this.$mount.error(res.retmsg);
        }
      });
    },
     //获取右边的数据
    getCenterRight() {
      const param = {
        brandId: this.value1,
        factoryId: this.value2,
        seriesId: this.value3,
        modelId: this.value4,
        mileEnd: 0,
        mileStart: this.p_mileStart,
        jobId: this.firstReportRow.jobId,
        areaId: this.areaId,
        cityId: this.cityId,
        provinceId: this.provinceId,
        engineId: this.engineType3
      }
      webMatchFirstReport(null, param).then(res => {
          if (res.retcode === 1) {
            const data = res.data
            //添加对应的url
            for (let i = 0; i < data.length; i++) {
              if (data[i].imageId2 !== 0) {
                data[i]["url2"] = net.imgUrl + data[i].imageId2;
              } else {
                data[i]["url2"] = null
              }
              if (data[i].imageId3 !== 0) {
                data[i]["url3"] = net.imgUrl + data[i].imageId3;
              } else {
                data[i]["url3"] = null
              }
              if (data[i].imageId4 !== 0) {
                data[i]["url4"] = net.imgUrl + data[i].imageId4;
              } else {
                data[i]["url4"] = null
              }
            }
            //根据部位的顺序调整对应的部位图片
            const datapicArr = []
            for (let f = 0; f < this.placeArr.length; f++) {
              for (let j = 0; j < data.length; j++) {
                if (this.placeArr[f].optionId === data[j].optionId) {
                  datapicArr.push(data[j])
                }
              }
            }
            this.datapicArr = datapicArr
          }
        })
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
    //点击最右边查询的图片
    editPrintData(optionId, url, sign, imgId) {
      let baseArr = this.datapicArr;
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
      this.datapicArr = baseArr;
      setTimeout(() => {
        $(".tr_sign[data-imgid = '" + imgId + "']").show();
      }, 300);
    },
    
    clickOption(optionId) { //点击左边部位图片，同步右边下拉框
      this.value5 = optionId;
    },
    bigIcon(id, sign) { // 检测部位图片放大
      this.dialogVisible2 = true;
      if (sign) {
        this.bigImage = id;
      } else {
        this.bigImage = net.bigImg + id;
      }
    },
    
    Arrow(optionId, contrastResult) { //图标箭头点击
      const arr = this.placeArr;
      for (let i = 0; i < arr.length; i++) {
        if (optionId === arr[i].optionId) {
          if (contrastResult === 4) {
            //向上
            arr[i]["contrastResult"] = 3;
          }
          if (contrastResult === 3) {
            //向下
            arr[i]["contrastResult"] = 2;
          }
          if (contrastResult === 2) {
            //等于
            arr[i]["contrastResult"] = 4;
          }
        }
      }
    },
  }
}
</script>
<style lang="less" scope>
.warping {
  width: 100%;
  height: 100%;
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
      .el-pager li:not(.disabled) {
        .active {
          background: #009688 !important;
        }
      }
    }
  }
  .operation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .right {
      margin-right: 20px;
    }
  }
  .line {
    border-bottom: 1px solid #eee;
    margin-top: 20px;
    width: 150px;
  }
  .leftTool {
    width: 0px;
    z-index: 99;
    position: fixed;
    top: 60px;
    background: aliceblue;
    height: 100%;
    animation: charge 0.2s linear forwards;

    .p_select {
      margin-bottom: 15px;
    }
    .arrow {
      width: 85px;
      cursor: pointer;
      margin-left: 170px;
      img {
        width: 100%;
      }
    }
    p {
      height: 36px;
      line-height: 36px;
      text-align: left;
    }
    .ctroArrow {
      display: flex;
      margin-top: 15px;
      margin-left: 20px;
      p {
        font-size: 14px;
      }
      .derail {
        margin-top: 8px;
        margin-left: 10px;
      }
    }
  }
  .centent {
    width: 1600px;
    display: flex;
    flex-direction: row;
    // overflow-x:scroll;
    .rightTool {
      width: 600px;
      height: 1000px;
      display: flex;
      flex-direction: column;
      .searchCon {
        display: flex;
        flex-direction: row;
        .p_select {
          width: 250px;
          margin: 20px 0 0 20px;
        }
        .f_select {
          width: 160px;
          margin: 20px 0 0 20px;
        }
        .search {
          height: 40px;
          position: relative;
          top: 19px;
          left: 20px;
        }
      }
      .searchPercent {
        display: flex;
        width: 381px;
        margin-left: 20px;
        position: relative;
        top: 8px;
        margin-top: 7px;
        background: -webkit-linear-gradient(
          left,
          #fff,
          #ff0000
        ); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(
          right,
          #fff,
          #ff0000
        ); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(
          right,
          #fff,
          #ff0000
        ); /* Firefox 3.6 - 15 */
        background: linear-gradient(
          to right,
          #fff,
          #ff0000
        ); /* 标准的语法（必须放在最后） */
        p {
          font-size: 14px;
          text-align: center;
          width: 125px;
          // border:1px solid #dcdfe6;
          height: 36px;
          line-height: 36px;
        }
      }
      .statuspic {
        display: flex;
        flex-direction: row;
        width: 400px;
        margin-top: 20px;
        div {
          width: 160px;
          height: 100px;
          display: flex;
          margin-left: 20px;
          flex-direction: column;
          img {
            width: 100%;
            background: #eee;
          }
          p {
            margin-top: 5px;
            font-size: 14px;
          }
        }
        .ulrEmpty {
          width: 160px;
          height: 104px;
          div {
            width: 112px;
            height: 85px;
            border: 1px solid #eee;
            margin: 0 auto;
          }
          p {
            text-align: center;
          }
        }
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
    .radio-box {
      margin: 20px 0;
      .radio-title{
        font-size: 16px;
      }
      .radio-content {
        width: 80%;
        text-align: left;
        label {
          margin-left: 0;
        }
        .el-radio {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .el-radio__label {
            font-size: 14px;
            padding-left: 10px;
            line-height: 26px;
          }
        }
      }
    }

  }
  .content::-webkit-scrollbar {
    display: block;
  }
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  @keyframes charge {
    100% {
      width: 300px;
    }
  }
}
</style>
