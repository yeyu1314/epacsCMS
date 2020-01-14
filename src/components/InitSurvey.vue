<template>
  <div class="warping">
    <div v-show="!isShowOpear">
      <div class="searchContent">
        <el-input placeholder="请输入车牌号" v-model="carPai" clearable></el-input>
        <el-button
          type="primary"
          style="background: #009688;"
          @click="search"
          icon="el-icon-search"
        >搜索</el-button>
      </div>
      <div>
        <el-table :data="listData" border style="width: 99%">
          <el-table-column prop="carNumber" label="车牌" align="center"></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
          <el-table-column prop="factoryName" align="center" label="主机厂商" color="#f40"></el-table-column>
          <el-table-column prop="seriesName" align="center" label="车系"></el-table-column>
          <el-table-column prop="modelName" align="center" label="车型"></el-table-column>
          <el-table-column prop="note" align="center" label="描述"></el-table-column>
          <el-table-column align="center" label="业务类型">
            <template slot-scope="scope">
              <span>{{scope.row.checkType | type}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" align="center" label="当前操作人"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="140">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.jobCode==100"
                @click="start(scope.row)"
                type="success"
                size="small"
              >开始编辑</el-button>
              <el-button
                @click="edit(scope.row)"
                v-show="scope.row.jobCode==210 || scope.row.jobCode==220 "
                type="warning"
                size="small"
              >编辑检测报告</el-button>
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
    </div>
    <div v-show="isShowOpear">
      <!-- 操作栏 -->
      <div class="operation">
        <div class="left">
          <el-button type="danger" @click="unqualified" v-show="isShowReach">照片不合格</el-button>
          <el-button type="success" @click="keepData" v-show="isShowReach">保存数据</el-button>
          <el-button type="danger" v-show="isShowReach" @click="reduction">还原</el-button>
          <el-button type="info" @click="submitReport" v-show="isShowSub || isShowReach">提交报告</el-button>
          <el-button type="warning" @click="back">返回列表</el-button>
          <el-button type="primary" @click="printdiv" v-show="ctroPrinting">预览/打印</el-button>
          <span style="margin-left:10px">箭头：</span>
          <el-switch v-model="printBtn" active-text="打印" inactive-text="不打印"></el-switch>
        </div>
        <div class="right"></div>
      </div>
      <div class="line"></div>
      <div class="centent" id="firstContent">
        <!-- 左侧 -->
        <div class="leftTool" v-show="isShowReach">
          <p>*诊断意见模板</p>
          <el-select
            v-model="engineType"
            clearable
            placeholder="请选择发动机"
            @change="engineChange"
            class="p_select"
          >
            <el-option
              v-for="item in engineArr"
              :key="item.id"
              :label="item.engineName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="moudleType"
            clearable
            placeholder="请选择"
            @change="gasolineChange"
            class="p_select"
          >
            <el-option
              v-for="item in gasolineArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input
            class="repostCon"
            type="textarea"
            :autosize="{ mixRows: 6}"
            placeholder="请输入诊断意见"
            v-model="opinion"
            disabled
          ></el-input>
          <div class="arrow" @click="adviseArrow">
            <img src="../assets/img/1.png" alt />
          </div>
          <div class="ctroArrow">
            <span style="font-size: 14px;    height: 36px;line-height: 36px;">箭头：</span>
            <el-tooltip :content="isShowArrow" placement="top" class="derail">
              <el-switch
                v-model="isShowArrow"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="不打印"
                inactive-value="打印"
                active-text="不打印"
                inactive-text="打印"
              >></el-switch>
            </el-tooltip>
          </div>
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
                <div style="width: 105px;height:78px;position: relative;">
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
                          src="../assets/img/2.png"
                          alt
                          style="width:100%;"
                          @click="Arrow(item.optionId,item.contrastResult)"
                        />
                        <img
                          src="../assets/img/3.png"
                          style="width:100%;"
                          v-show="item.contrastResult == 2"
                          @click="Arrow(item.optionId,item.contrastResult)"
                        />
                        <img
                          src="../assets/img/equal.png"
                          style="width:80%;position: relative;top: 13px;"
                          v-show="item.contrastResult==3"
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
                    >大数据比对</p>
                    <div
                      v-for="t in placeArr"
                      :key="t.optionId"
                      style="width: 100%;height: 112px;position: relative;"
                      class="ctrl_right"
                    >
                      <div
                        v-for="c in datapicArr"
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
                      <div v-else></div>
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
                      :autosize="{ minRows: 2}"
                      placeholder="请输入意见"
                      v-model="advise"
                      maxlength="100"
                      :disabled="!isShowReach"
                      style="font-size:12px;"
                    ></el-input>
                    <span
                      style="font-size: 12px;position: absolute;bottom: 8px;right: 20px;color: #959595;"
                    >还能输入{{chLen}}字</span>
                  </div>
                  <p
                    v-show="!isprint"
                    style="word-wrap:break-word;    text-align: left;    padding-left: 10px;font-size:13px;margin:0;padding: 5px;"
                  ></p>
                  <p
                    v-show="!isprint"
                    style="word-wrap:break-word;    text-align: left;    padding-left: 10px;font-size:13px;margin:0;border: 1px solid;    padding: 5px;"
                  >
                    <span style="font-weight:bolder;">检测结果：</span>
                    {{advise}}
                  </p>
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
                      :autosize="{ minRows: 3}"
                      placeholder="请输入说明"
                      v-model="illustrate"
                      maxlength="280"
                      style="font-size:12px;"
                      :disabled="!isShowReach"
                    ></el-input>
                    <span
                      style="font-size: 12px;position: absolute;bottom: 6px;right: 18px;color: #959595;"
                    >还能输入{{exLen}}字</span>
                  </div>
                  <!-- <p
                    v-show="!isprint"
                    style="word-wrap:break-word;    text-align: left;    padding-left: 10px;font-size:13px;margin:0;padding: 5px;"
                  >

                  </p>-->
                  <p
                    v-show="!isprint"
                    style="word-wrap:break-word;text-align: left;padding-left: 10px;font-size:13px;margin:0;padding: 5px;border:1px solid;margin-top:1px"
                  >
                    <span style="font-weight:bolder;">诊断意见：</span>
                    {{illustrate}}
                  </p>
                </div>
                <div
                  style="display: flex;justify-content: space-between;width: 158mm;margin: 20px 0 20px 88px;font-size:14px;"
                >
                  <span style="padding-left:10px;">影像诊断工程师：</span>
                  <span>客户签名：</span>
                  <span
                    style="display:inline-block;width:162px;text-align: left;margin-right:10px;"
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
        <div class="rightTool" v-show="isShowReach" style="display:none">
          <p style="text-align:center;font-weight: bold;">关联车型数据</p>
          <div class="searchCon">
            <el-select
              v-model="value6"
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
              ></el-option>
            </el-select>
            <el-select
              v-model="value7"
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
              ></el-option>
            </el-select>
            <el-select v-model="value8" clearable placeholder="请选择市/县" class="f_select">
              <el-option
                v-for="item in cityArr"
                :key="item.id"
                :label="item.cityName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
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
              ></el-option>
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
              ></el-option>
            </el-select>
          </div>
          <div class="searchCon">
            <el-select
              v-model="value3"
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
              ></el-option>
            </el-select>
            <el-select v-model="value4" clearable placeholder="请选择车型" class="p_select">
              <el-option
                v-for="item in carTypeData"
                :key="item.id"
                :label="item.modelName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="searchCon">
            <el-select v-model="mileSection" clearable placeholder="请选择里程" class="p_select">
              <el-option
                v-for="item in mileSectionArr"
                :key="item.id"
                :label="item.mileage"
                :value="item.mileage"
              ></el-option>
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
                v-for="item in placeArr"
                :key="item.optionId"
                :label="item.optionName"
                :value="item.optionId"
              ></el-option>
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
                ></i>
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
                ></i>
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
                ></i>
              </div>
            </div>
            <div v-else class="ulrEmpty">
              <div></div>
              <p class="severe">{{item.val_3}}</p>
            </div>
          </div>
        </div>
      </div>
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
    </div>
    <el-dialog :visible.sync="dialogVisible2" width="700px">
      <div style="width:100%">
        <img :src="bigImage" alt style="width:100%" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import net from "../assets/js/public";
import $ from "jquery";
export default {
  data() {
    return {
      //控制图片放大
      dialogVisible2: false,
      bigImage: "",

      isShowArrow: "不打印", //打印是否显示箭头
      opinion: "",
      illustrate:
        "上述检测比对是指在同区域，同车型，同里程条件下从大数据检索出来的积碳生成情况三个维度的照片：轻度--表示比对范围内积碳较少；中度--表示比对范围内积碳平均水平；重度--表示比对范围内积碳最多。", //说明
      advise: "", //意见
      statusArr: [],
      baseImgUrl: net.imgUrl,
      placeArr: [],
      datapicArr: [],
      brandData: [], //汽车品牌
      value1: "",
      hostData: [], //主机厂商
      value2: "",
      audiData: [], //车系
      value3: "",
      carTypeData: [], //车型
      value4: "",
      value5: "", //部位
      value6: -1, //区
      areaArr: [],
      value7: -1, //省
      provinceArr: [],
      value8: -1, //市县
      cityArr: [],
      isprint: true,
      gasolineType: "", //汽油
      moudleType: "",
      gasolineArr: [
        {
          id: 1,
          name: "油路"
        },
        {
          id: 2,
          name: "气路"
        },
        {
          id: 3,
          name: "油气路"
        }
      ],
      engineType: "", //发动机
      engineArr: [],
      isShowOpear: false, //显示编辑页面
      listData: [],
      //pageNo: 1,
      //pageSize: 10,
      total: null,
      mileSection: "", //里程区间
      mileSectionArr: "",
      //车辆信息
      carNumber: "",
      brandname: "",
      cartype: "",
      ReseriesName: "",
      gasolinetype: "",
      oilDeplete: "",
      testAddr: "",
      mileNumber: "",
      areaId: "",
      cityId: "",
      provinceId: "",
      //暂存参数
      jobId: "",
      jobCode: "",
      isShowSub: false,

      //获取图片参数
      p_mileStart: "",
      //是否为完成工单跳转过来显示
      isShowReach: true,
      operId: "",
      artificer: "", //诊断技师
      time: "", //时间
      CarFrameUrl: "", //车牌图片
      carBigImageID: "",
      //控制打印按钮显隐
      ctroPrinting: true,
      version: "",
      dialogVisible1: false, //照片不合格弹窗
      checkedPlace: [],
      position: [], //部位数据
      //查询参数
      unqualifiedArr: [
        { optionId: -1, optionName: "车牌号" },
        { optionId: -11, optionName: "车架号" },
        { optionId: 1, optionName: "喷油嘴" },
        { optionId: 2, optionName: "进气道" },
        { optionId: 3, optionName: "进气阀" },
        { optionId: 4, optionName: "活塞顶" },
        { optionId: 5, optionName: "缸壁" }
      ],
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
      exLen: "", //说明字数
      chLen: "", //意见字数
      printBtn: true,
      pageNo: this.$route.params.pageNo,
      pageSize: this.$route.params.pageSize,
      status: this.$route.params.enter,
      carPai: this.$route.params.carNumber,
      aa: this.$route.params
    };
  },
  created() {
    var args = JSON.parse(sessionStorage.getItem("signInfo"));
    console.log(args)
    if (args.isPrinting == 0) {
      this.ctroPrinting = false;
    }
    this.operId = this.$route.params.operId;
    var row = this.$route.params.row;
    if (
      this.operId == 1 ||
      this.operId == 2 ||
      this.operId == 3 ||
      this.operId == 4 ||
      this.operId == 5 ||
      this.operId == 6 ||
      this.operId == 7
    ) {
      this.isShowReach = false;
      this.isShowOpear = true;
      this.edit(row);
    }
    this.getlistData(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      { type: 3 }
    );
  },
  filters: {
    type(d) {
      var arr = ["", "检测", "治疗", "检测+治疗"];
      return arr[d];
    },
    option(val) {
      var arr = ["未赋值", "轻微", "轻度", "中度", "重度", "严重"];
      var str = arr[parseInt(val)];
      return str;
    }
  },
  methods: {
    //取消
    back() {
      if (this.operId == 1) {
        // this.$router.push({ path: "/completeOrder" });
        this.$router.push({
          name: "completeOrder",
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            status: !this.status,
            carNumber: this.carPai
          }
        });
      } else if (this.operId == 2) {
        // this.$router.push({ path: "/ensureOrder" });
        this.$router.push({
          name: "ensureOrder",
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            status: !this.status,
            carNumber: this.carPai
          }
        });
      } else if (this.operId == 3) {
        // this.$router.push({ path: "/treatOrder" });
        this.$router.push({
          name: "treatOrder",
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            status: !this.status,
            carNumber: this.carPai
          }
        });
      } else if (this.operId == 4) {
        // this.$router.push({ path: "/recheckPic" });
        this.$router.push({
          name: "recheckPic",
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            status: !this.status,
            carNumber: this.carPai
          }
        });
      } else if (this.operId == 5) {
        // this.$router.push({ path: "/recheckPic" });
        this.$router.push({
          name: "editRecheck",
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            status: !this.status,
            carNumber: this.carPai
          }
        });
      } else if (this.operId == 6) {
        // this.$router.push({ path: "/recheckPic" });
        this.$router.push({
          name: "waitVerifyReport",
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            status: !this.status,
            carNumber: this.carPai
          }
        });
      } else if (this.operId == 7) {
        // this.$router.push({ path: "/recheckPic" });
        this.$router.push({
          name: "waitVerify",
          params: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            status: !this.status,
            carNumber: this.carPai
          }
        });
      } else {
        this.isShowOpear = false;
        this.getlistData(
          { pageNo: this.pageNo, pageSize: this.pageSize },
          { type: 3, carNumber: this.carPai }
        );
      }
    },
    //开始检测
    start(row) {
      net
        .request("admin/order/startPractice", "post", {
          jobId: row.jobId,
          version: row.version
        })
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "请再次点击进入报告编辑", "success");
            this.getlistData(
              { pageNo: this.pageNo, pageSize: this.pageSize },
              { type: 3 }
            );
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    //编辑报告
    edit(row) {
      this.exChange();
      this.isShowOpear = true;
      this.isShowSub = false;
      this.carId = row.carId;
      this.mileNumber = row.mile + "km";
      this.p_mileStart = row.mile;
      this.jobId = row.jobId;
      this.jobCode = row.jobCode;
      this.version = row.version;
      this.orgId = row.orgId;
      this.showRightTitle = false;
      this.getBgImg(row.orgId);
      this.statusArr = [];
      if (this.jobCode == 220) {
        this.isShowSub = true;
      }
      this.getEngineData(() => {
        net
          .request("admin/car/queryById", "post", { carId: row.carId })
          .then(res => {
            this.engineType = res.data.engineId;
            if (this.engineType == 2) {
              this.moudleType = 3;
              this.gasolineArr = [
                {
                  id: 1,
                  name: "油路"
                },
                {
                  id: 2,
                  name: "气路"
                },
                {
                  id: 3,
                  name: "油气路"
                }
              ];
            }
            if (this.engineType == 4) {
              this.moudleType = 3;
              this.gasolineArr = [
                {
                  id: 1,
                  name: "油路"
                },
                {
                  id: 2,
                  name: "气路"
                },
                {
                  id: 3,
                  name: "油气路"
                }
              ];
            }
            if (this.engineType == 3) {
              this.gasolineArr = [
                {
                  id: 2,
                  name: "气路"
                },
                {
                  id: 3,
                  name: "油气路"
                }
              ];
              this.moudleType = 2;
            }
            //获取诊断意见模板
            this.getAdvise();
            console.log(res.data);
            // this.gasolineType = res.data.fuelTypeId;
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
                    this.getConterData(row.carId);
                  });
                });
              });
            }); //初始化品牌
          });
      }); //初始化发动机
    },
    //中间图片数据
    getConterData(carId) {
      net
        .request("admin/car/queryById", "post", {
          carId: carId
        })
        .then(res => {
          if (res.retcode == 1) {
            this.fuelTypeName = res.data.fuelTypeName;
            this.modelName = res.data.modelName;
            this.brandName = res.data.brandName;
            this.carCount = res.data.carNumber;
            var arr = res.data.list;
            var b_arr = [];
            //获取检测部位数据
            net
              .request("admin/car/queryCarTestingPhoto", "post", {
                jobId: this.jobId,
                step: 1
              })
              .then(d => {
                var data = d.data;
                for (var i = 0; i < arr.length; i++) {
                  for (var j = 0; j < data.length; j++) {
                    if (data[j].optionId == -1) {
                      this.carBigImageID = data[j].photoId;
                      this.CarFrameUrl = net.imgUrl + data[j].photoId;
                    }
                    arr[i]["placeName"] = url;
                    if (arr[i].optionId == data[j].optionId) {
                      var url = net.imgUrl + data[j].photoId;
                      arr[i]["url"] = url;
                      arr[i]["photoId"] = data[j].photoId;
                      if (
                        data[j].contrastResult == 2 ||
                        data[j].contrastResult == 3 ||
                        data[j].contrastResult == 4
                      ) {
                        arr[i]["contrastResult"] = data[j].contrastResult;
                      } else {
                        if (
                          data[j].optionValue == 1 ||
                          data[j].optionValue == 2
                        ) {
                          arr[i]["contrastResult"] = 2;
                        } else if (
                          data[j].optionValue == 4 ||
                          data[j].optionValue == 5
                        ) {
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
                for (var g = 0; g < this.unqualifiedArr.length; g++) {
                  for (var h = 0; h < data.length; h++) {
                    if (this.unqualifiedArr[g].optionId == data[h].optionId) {
                      this.unqualifiedArr[g].optionName =
                        this.unqualifiedArr[g].optionName + " (已上传图片)";
                      if (
                        data[h].photoId == null ||
                        data[h].photoId == "null"
                      ) {
                        this.unqualifiedArr[g].optionName =
                          this.unqualifiedArr[g].optionName + " (上传图片失败)";
                      }
                    }
                  }
                }
              });
          } else {
            net.message(this, "获取车辆信息异常", "warning");
          }
        });
    },
    //点击最右边查询的图片
    editPrintData(optionId, url, sign, imgId) {
      let baseArr = this.datapicArr;
      for (let i = 0; i < baseArr.length; i++) {
        if (baseArr[i].optionId == optionId) {
          if (sign == 1) {
            baseArr[i]["url2"] = url;
            baseArr[i]["imageId2"] = imgId;
          }
          if (sign == 2) {
            baseArr[i]["url3"] = url;
            baseArr[i]["imageId3"] = imgId;
          }
          if (sign == 3) {
            baseArr[i]["url4"] = url;
            baseArr[i]["imageId4"] = imgId;
          }
        }
      }
      this.datapicArr = baseArr;
      setTimeout(() => {
        $(".tr_sign[data-imgid = '" + imgId + "']").show();
        //  $(".tr_sign[data-imgid = '" + imgId + "']");
      }, 300);
    },
    //回显报告中的说明，意见
    seeFristReport() {
      net
        .request("admin/order/queryTestingWeb", "post", {
          jobId: this.jobId,
          step: 1
        })
        .then(res => {
          if (res.retcode == 1) {
            if (res.data != null) {
              this.illustrate = res.data.imageNote;
              this.advise = res.data.diagnosticOption;
              this.artificer = res.data.userName;
              this.time = net.dateFormat(res.data.reportTime, 0);
              this.exLen = 280 - res.data.imageNote.length;
              this.chLen = 100 - res.data.diagnosticOption.length;
            } else {
              this.exLen = 280;
              this.chLen = 100;
            }
          }
        });
    },
    //提交报告
    submitReport() {
      if (this.illustrate.length > 280) {
        net.message(
          this,
          "诊断意见超过最大限制字数(280字)，请重新修改",
          "error"
        );
        return false;
      }
      if (this.advise.length > 120) {
        net.message(
          this,
          "检测结果超过最大限制字数(100字)，请重新修改",
          "error"
        );
        return false;
      }
      let list = [];
      for (let i = 0; i < this.datapicArr.length; i++) {
        var obj = {},
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
      var params = {
        jobId: this.jobId,
        jobCode: 230,
        optionIds: this.optionIds.join(","),
        version: this.version
      };
      var checkRecordList = [];
      for (let i = 0; i < this.placeArr.length; i++) {
        var obj3 = {};
        obj3["contrastResult"] = this.placeArr[i].contrastResult;
        obj3["optionId"] = this.placeArr[i].optionId;
        checkRecordList.push(obj3);
      }
      var data = {
        imageNote: this.illustrate, //说明
        diagnosticOption: this.advise,
        list: list,
        checkRecordList: checkRecordList
      };
      net
        .request("admin/order/writePresentation", "post", params, data)
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "suuccess");
            var skip = net.isJump("/waitVerify");
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
    //保存数据
    keepData() {
      if (this.illustrate.length > 260) {
        net.message(
          this,
          "诊断说明超过最大限制字数(260字)，请重新修改",
          "error"
        );
        return false;
      }
      if (this.advise.length > 120) {
        net.message(
          this,
          "诊断意见超过最大限制字数(120字)，请重新修改",
          "error"
        );
        return false;
      }
      let list = [];
      for (let i = 0; i < this.datapicArr.length; i++) {
        var obj = {},
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
      var params = {
        jobId: this.jobId,
        jobCode: 220,
        optionIds: this.optionIds.join(","),
        version: this.version
      };
      var checkRecordList = [];
      for (let i = 0; i < this.placeArr.length; i++) {
        var obj3 = {};
        obj3["contrastResult"] = this.placeArr[i].contrastResult;
        obj3["optionId"] = this.placeArr[i].optionId;
        checkRecordList.push(obj3);
      }
      console.log(this.advise.length);
      var data = {
        imageNote: this.illustrate, //说明
        diagnosticOption: this.advise,
        list: list,
        checkRecordList: checkRecordList
      };
      net
        .request("admin/order/writePresentation", "post", params, data)
        .then(res => {
          if (res.retcode == 1) {
            this.isShowSub = true;
            this.version = res.data;
            net.message(this, res.retmsg, "suuccess");
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    //图标箭头点击
    Arrow(optionId, contrastResult) {
      if (this.$route.params.print) {
        return;
      } else {
        var arr = this.placeArr;
        for (var i = 0; i < arr.length; i++) {
          if (optionId == arr[i].optionId) {
            if (contrastResult == 4) {
              //向上
              arr[i]["contrastResult"] = 3;
            }
            if (contrastResult == 3) {
              //向下
              arr[i]["contrastResult"] = 2;
            }
            if (contrastResult == 2) {
              //等于
              arr[i]["contrastResult"] = 4;
            }
          }
        }
      }
    },
    //点击左边部位图片，同步右边下拉框
    clickOption(optionId) {
      this.value5 = optionId;
    },
    //查询
    search() {
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { carNumber: this.carPai, type: 3 }
      );
    },
    //获取列表数据
    getlistData(param, data) {
      net
        .request("admin/order/queryListPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.listData = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 3 }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 3 }
      );
    },
    //获取汽车品牌
    getbrandData(callback) {
      callback = callback || function() {};
      net.request("admin/select/getCarBrand", "post").then(res => {
        if (res.retcode == 1) {
          this.brandData = res.data;
          callback();
        } else {
          net.message(this, res.retmsg, "warning");
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

    adviseArrow() {
      this.advise = this.opinion;
    },
    //打印
    printdiv() {
      this.isprint = false;
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
      var iconArr = [];
      $(".tr_sign").each(function() {
        var flag = $(this).is(":hidden");
        if (flag == false) {
          iconArr.push($(this).data("imgid"));
          $(this).hide();
        }
      });
      // if (this.isShowArrow == "不打印") {
      //   // $(".arrowIcon").hide();
      // }
      if (this.printBtn) {
        $(".arrowIcon").show();
      } else {
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
        $(".arrowIcon").show();
        $(".tr_sign").each(function() {
          if (iconArr.length != 0) {
            for (var i = 0; i < iconArr.length; i++) {
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
    //获取发动机下拉数据
    getEngineData(callback) {
      callback = callback || function() {};
      net.request("admin/select/getEngineType", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.engineArr = res.data;
          callback();
        } else {
          net.message(this, res.retmsg, "error");
        }
      });
    },
    // 监听发动机下拉
    engineChange(val) {
      if (val == 2) {
        this.moudleType = 3;
        this.gasolineArr = [
          {
            id: 1,
            name: "油路"
          },
          {
            id: 2,
            name: "气路"
          },
          {
            id: 3,
            name: "油气路"
          }
        ];
      }
      if (val == 4) {
        this.moudleType = 3;
        this.gasolineArr = [
          {
            id: 1,
            name: "油路"
          },
          {
            id: 2,
            name: "气路"
          },
          {
            id: 3,
            name: "油气路"
          }
        ];
      }
      if (val == 3) {
        this.gasolineArr = [
          {
            id: 2,
            name: "气路"
          },
          {
            id: 3,
            name: "油气路"
          }
        ];
        this.moudleType = 2;
      }
      this.getAdvise();
    },
    //检测模板
    gasolineChange() {
      this.getAdvise();
    },
    //获取诊断意见模板
    getAdvise() {
      net
        .request("admin/select/getReportTemplate", "post", {
          type: this.moudleType,
          engineId: this.engineType
        })
        .then(res => {
          if (res.retcode == 1) {
            this.opinion = res.data.reportTemplate;
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    //里程区间
    getMileData(callback) {
      callback = callback || function() {};
      net.request("admin/select/getCarMileage", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.mileSectionArr = res.data;
          this.mileSectionArr.unshift({ id: 0, mileage: "不限里程" });
          this.mileSection = "不限里程";
          callback();
        } else {
          net.message(this, res.retmsg, "error");
        }
      });
    },
    //获取右边查询数据
    getRightList() {
      var start, end;
      console.log(this.mileSection);
      if (this.mileSection != "不限里程") {
        var mileArr = this.mileSection.split("-");
        start = mileArr[0];
        end = mileArr[1];
      } else {
        start = 0;
        end = 1000000;
      }

      var param = {
        brandId: this.value1,
        factoryId: this.value2,
        seriesId: this.value3,
        modelId: this.value4,
        optionId: this.value5, //
        mileEnd: end,
        mileStart: start,
        areaId: this.value6,
        cityId: this.value8,
        provinceId: this.value7
      };
      if (this.value5 == "") {
        net.message(this, "请选择部位！！", "error");
        return false;
      }
      net
        .request("admin/image/polling/webSelect", "post", null, param)
        .then(res => {
          if (res.retcode == 1) {
            var data = res.data.images;
            var percents = res.data.percents;
            for (var i = 0; i < data.length; i++) {
              if (data[i].imageId2 != 0) {
                data[i]["url2"] = net.imgUrl + data[i].imageId2;
                data[i]["sign2"] = data[i].imageId2 + "_" + i;
              } else {
                data[i]["url2"] = null;
              }
              if (data[i].imageId3 != 0) {
                data[i]["url3"] = net.imgUrl + data[i].imageId3;
                data[i]["sign3"] = data[i].imageId3 + "_" + i;
              } else {
                data[i]["url3"] = null;
              }
              if (data[i].imageId4 != 0) {
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
            // console.log(this.statusArr)
          }
        });
    },
    //获取中间的数据
    getCenterRight() {
      var param = {
        brandId: this.value1,
        factoryId: this.value2,
        seriesId: this.value3,
        modelId: this.value4,
        mileEnd: 0,
        mileStart: this.p_mileStart,
        jobId: this.jobId,
        areaId: this.areaId,
        cityId: this.cityId,
        provinceId: this.provinceId
      };
      net
        .request("admin/image/polling/webMatch", "post", null, param)
        .then(res => {
          if (res.retcode == 1) {
            var data = res.data;
            //添加对应的url
            for (var i = 0; i < data.length; i++) {
              if (data[i].imageId2 != 0) {
                data[i]["url2"] = net.imgUrl + data[i].imageId2;
              } else {
                data[i]["url2"] = null;
              }
              if (data[i].imageId3 != 0) {
                data[i]["url3"] = net.imgUrl + data[i].imageId3;
              } else {
                data[i]["url3"] = null;
              }
              if (data[i].imageId4 != 0) {
                data[i]["url4"] = net.imgUrl + data[i].imageId4;
              } else {
                data[i]["url4"] = null;
              }
            }
            //根据部位的顺序调整对应的部位图片
            var datapicArr = [];
            for (var f = 0; f < this.placeArr.length; f++) {
              for (var j = 0; j < data.length; j++) {
                if (this.placeArr[f].optionId == data[j].optionId) {
                  datapicArr.push(data[j]);
                }
              }
            }
            this.datapicArr = datapicArr;
          }
        });
    },
    //获取区
    getareaData(callback) {
      callback = callback || function() {};
      net.request("admin/select/getArea", "post").then(res => {
        if (res.retcode == 1) {
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
    //获取省系
    getprovinceData(areaId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getProvince", "post", { areaId: areaId })
        .then(res => {
          if (res.retcode == 1) {
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
    //获取市县
    getcityData(provinceId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCity", "post", { provinceId: provinceId })
        .then(res => {
          if (res.retcode == 1) {
            this.cityArr = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //照片不合格按钮
    unqualified() {
      this.dialogVisible1 = true;
      this.checkedPlace = [];
      this.position = this.unqualifiedArr;
    },
    selectPlace() {
      var param = {
        version: this.version,
        jobId: this.jobId,
        code: 32
      };
      if (this.checkedPlace.length == 0) {
        net.message(this, "请选择不合格部位", "error");
        return false;
      }
      net
        .request("admin/order/unqualified", "post", param, this.checkedPlace)
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            var skip = net.isJump("/onloadPic");
            if (skip) {
              this.$router.push({ path: "/onloadPic" });
            } else {
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 2 }
              );
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    //搜索
    searchClick() {
      this.showRightTitle = true;
      this.getRightList();
    },
    //还原数据
    reduction() {
      this.advise = "";
      this.illustrate =
        "上述检测比对是指在同区域，同车型，同里程条件下从大数据检索出来的积碳生成情况三个维度的照片：轻度--表示比对范围内积碳较少；中度--表示比对范围内积碳平均水平；重度--表示比对范围内积碳最多。";
      this.getConterData(this.carId);
      setTimeout(() => {
        $(".tr_sign").each(function() {
          $(this).hide();
        });
      }, 300);
    },
    //动态调整打印布局
    trendsEdit(count) {
      if (count == 1) {
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
      if (count == 2 || count == 3) {
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
      if (count == 4) {
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
      if (count == 5) {
        $(".picTitle").css({
          "margin-bottom": "0px",
          "margin-top": "0px",
          height: "30px",
          "line-height": "30px"
        });
      }
    },
    //鼠标进入图片显示放大按钮
    mouseEnter(d) {
      $(".showBigBtn").hide();
      $(".showBigBtn[data-optionid='" + d + "']").show();
    },
    mouseLeave() {
      $(".showBigBtn").hide();
    },
    bigIcon(id) {
      this.dialogVisible2 = true;
      this.bigImage = net.bigImg + id;
    },
    deleteRow(id) {
      this.$confirm("是否删除该部位图片", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.optionIds.push(id);
          var arr1 = [],
            arr2 = [];
          for (var i = 0; i < this.placeArr.length; i++) {
            if (this.placeArr[i].optionId != id) {
              arr1.push(this.placeArr[i]);
            }
          }
          for (var j = 0; j < this.datapicArr.length; j++) {
            if (this.datapicArr[j].optionId != id) {
              arr2.push(this.datapicArr[j]);
            }
          }
          this.placeArr = arr1;
          this.datapicArr = arr2;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取背景图
    getBgImg(orgId) {
      this.bg_pic =
        net.imageHP + "web/config/watermark/getImage?orgId=" + orgId;
    },
    //监听说明
    exChange() {
      $("#exCtrl").on("input propertychange", e => {
        this.exLen = 280 - e.target.value.length;
      });
      $("#chCtrl").on("input propertychange", e => {
        this.chLen = 100 - e.target.value.length;
      });
    }
  }
};
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
  .centent {
    width: 1600px;
    display: flex;
    flex-direction: row;
    // overflow-x:scroll;
    .leftTool {
      width: 200px;
      position: relative;
      .p_select {
        margin-bottom: 15px;
      }
      .arrow {
        position: absolute;
        top: 175px;
        left: 205px;
        width: 85px;
        cursor: pointer;
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
        p {
          font-size: 14px;
        }
        .derail {
          margin-top: 8px;
          margin-left: 10px;
        }
      }
    }
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
  }
  .content::-webkit-scrollbar {
    display: block;
  }
}
</style>
