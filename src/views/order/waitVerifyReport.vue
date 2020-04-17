<template>
  <div>
    <div class="ces-main" v-show="dialogVisible">
      <search-com
              size='medium '
              labelWidth = '80px'
              :searchData = "searchData"
              :searchForm = "searchForm"
              :searchHandle="searchHandle">
      </search-com>
      <table-com
              :that='that'
              size='medium '
              :isSelection='true'
              :isIndex='true'
              :isHandle='true'
              :tableData='waitVerifyReportTableData'
              :tableCols='tableCols'
              :isPagination='true'
              :tablePage='waitVerifyReportPagination'
              :longDatas="waitVerifyReportLongData"
              @CurrentChange = 'CurrentChange'
              @SizeChange = 'SizeChange'
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
    <div v-show="!dialogVisible">
      <div style="display:flex; margin-top:20px;">
        <el-button type="primary" @click="keepData">编辑并通过</el-button>
        <el-button type="warning" @click="submitReport">审核通过</el-button>
        <el-button type="danger" @click="repulse">打回</el-button>
        <!-- <el-button type="primary" @click="seeCarFrameNumber">查看车架号图片</el-button> -->
        <el-button type="danger" @click="back">返回列表</el-button>
        <el-button type="success" @click="printdiv">预览/打印</el-button>
        <el-button type="primary" @click="editMileage">编辑里程</el-button>
      </div>
      <div style="display:flex;flex-direction: row;">
        <div
          style="width: 210mm;min-width:210mm;height: 297mm;margin-top:15px;display:flex;border:1px solid #eee;flex-direction: column;"
          id="printBody"
        >
          <div
            style="background-repeat: no-repeat;background-size: 100%;height: 100%;"
            :style="{backgroundImage: 'url(' + bg_pic + ')'}"
          >
            <div
              style="font-weight: bold;font-size: 18px;height: 60px;line-height: 60px;text-align:center;width: 158mm;margin: 0 auto;"
            >EPACS复查报告单</div>
            <p
              class="first"
              style="font-size: 14px;text-align: left;font-weight: bold;padding-left: 80px;height: 26px;line-height: 26px;margin:0;margin-bottom:3px"
            >车辆信息</p>
            <div style="display: flex;flex-direction: row;width: 170mm;margin-left:90px;">
              <div style="width: 105px;height:78px;position: relative;">
                <img
                  style=" width: 100%;display:block;"
                  :src="carUrl"
                  alt
                  @mouseenter="mouseEnter(-2)"
                />
                <div
                  class="showCPBigBtn"
                  @mouseleave="mouseLeave()"
                  :data-optionId="-2"
                  style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width: 100%;height: 100%;z-index: 1;"
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
            <!-- 治疗前 -->
            <p
              class="second"
              style="text-align: left;width: 200px;margin-left: 80px;font-size: 14px;font-weight: bold;padding-top: 10px;"
            >治疗结果:</p>
            <div style="display:flex;justify-content: space-between;margin-top:7px;">
              <!-- 治疗前 -->
              <div style="width:40%;margin-left: 60px;" class="leftbefore">
                <div style="width:100%">
                  <p
                    class="p_title"
                    style="text-align:center;margin:0 auto;font-size:14px;background: #eee;height: 24px;line-height: 24px;"
                    :style="{width:imgWidth + 'px'}"
                  >治疗前</p>
                </div>
                <div v-for="item in beforeArr" :key="item.optionId">
                  <div
                    class="p_picture"
                    style="position: relative;margin:0 auto;"
                    :style="{width:imgWidth + 'px'}"
                  >
                    <img
                      :src="item.url"
                      v-if="item.url !== undefined && item.url != null"
                      alt
                      @mouseenter="mouseEnter(item.photoId)"
                      style="width:100%;display:block"
                    />
                    <p
                            v-else
                            style="width: 100%;height: 100%;border: 1px solid #eee;margin: 0 auto;"
                    />
                    <div
                      class="showBigBtn"
                      @mouseleave="mouseLeave(item.photoId)"
                      :data-optionId="item.photoId"
                      style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width:100%;height:100%;z-index: 1;"
                    >
                      <i
                              class="el-icon-zoom-in"
                              @click="bigIcon(item.photoId)"
                              style="color: #fff;font-size: 25px;"
                              :style="{marginTop: iconTop + 'px'}"
                      />
                    </div>
                  </div>
                  <p style="margin-top:3px;font-size:14px;text-align:center">{{item.optionName}}</p>
                </div>
              </div>
              <!-- 治疗后 -->
              <div style="width:40%;margin-right: 100px;">
                <div style="width:100%">
                  <p
                    class="p_title"
                    style="text-align:center;margin:0 auto;font-size:14px;background: #eee;height: 24px;line-height: 24px;"
                    :style="{width:imgWidth + 'px'}"
                  >治疗后</p>
                </div>
                <div v-for="item in afterArr" :key="item.optionId">
                  <div
                    class="p_picture"
                    style="position: relative;margin:0 auto;"
                    :style="{width:imgWidth + 'px'}"
                  >
                    <img
                      :src="item.url"
                      v-if="item.url !== undefined && item.url != null"
                      alt
                      @mouseenter="mouseEnter(item.photoId)"
                      style="width:100%;display:block"
                    />
                    <p
                            v-else
                            style="width: 100%;height: 100%;border: 1px solid #eee;margin: 0 auto;"
                    />
                    <div
                      class="showBigBtn"
                      @mouseleave="mouseLeave(item.photoId)"
                      :data-optionId="item.photoId"
                      style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width:100%;height:100%;z-index: 1;"
                    >
                      <i
                              class="el-icon-zoom-in"
                              @click="bigIcon(item.photoId)"
                              style="color: #fff;font-size: 25px;"
                              :style="{marginTop: iconTop + 'px'}"
                      />
                    </div>
                  </div>
                  <p style="margin-top:3px;font-size:14px;text-align:center">{{item.optionName}}</p>
                </div>
              </div>
            </div>
            <!-- 复查结果 -->
            <div class="three">
              <p
                style="margin:5px 0 0 80px;text-align: left;width: 200px;font-size: 14px;font-weight: bold;"
              >复查结果:</p>
              <div style="position: relative;" v-show="isprint">
                <el-input
                        type="textarea"
                        id="exCtrl"
                        :autosize="{minRows: 8}"
                        maxlength="230"
                        placeholder="复查结果"
                        v-model="result"
                        style="width:570px;margin-top: 10px;"
                />
                <span
                  style="font-size: 14px;position: absolute;bottom: 6px;right: 185px;color: #959595;"
                >还能输入{{exLen}}字</span>
              </div>
              <p
                v-show="!isprint"
                style="border:1px solid;margin:5px 0 0 90px;line-height: 20px; font-size: 14px;width:570px;word-wrap:break-word;text-align: left;padding: 7px"
              >{{result}}</p>
              <p
                style="margin-left: 90px;padding-right:30px;width:570px;margin-top: 15px;display: flex;justify-content: space-between;"
              >
                <span style="display: inline-block;width: 120px;">影像诊断工程师:{{step2ImageHeader}}</span>
                <span style="display: inline-block;">检测日期：{{time}}</span>
              </p>
            </div>
          </div>
        </div>
        <div style="margin-top:20px;margin-left:20px;" v-show="showUse">
          <p style="text-align: left;">产品用量</p>
          <div style="margin-top:15px;display:flex;flex-direction: row;">
            <div>
              <el-checkbox-group
                v-model="checkProList"
                style="display:flex;flex-direction: column;"
              >
                <el-checkbox
                  style="margin-left: 20px;text-align: left;height: 42px;line-height: 42px;"
                  v-for="(item,index) in productArr"
                  :key="index"
                  :label="item.id"
                  disabled
                >{{item.productName}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <el-checkbox-group style="display:flex;flex-direction: column;margin-left:10px;">
                <el-input-number
                        class="inputNumber"
                        :data-id="item.id"
                        style="margin-top: 6px;margin-bottom:5px;"
                        v-for="(item,index) in productArr"
                        :key="index"
                        :min="0"
                        v-model="dataModel[index].value1"
                        @change="handleChange($event,item.id)"
                        size="small"
                        label="描述文字"
                        disabled
                />
              </el-checkbox-group>
            </div>
          </div>
          <!-- <div style="text-align: left;margin: 20px 0 0 23px;">
            <el-button type="success" size="small" @click="subUse">提交用量</el-button>
          </div>-->
        </div>
        <el-dialog :visible.sync="dialogVisible2" width="700px">
          <div style="width:100%">
            <img :src="bigImage" alt style="width:100%" />
          </div>
        </el-dialog>
        <el-dialog title="修改里程" :visible.sync="dialogVisible4" width="30%">
          <el-input placeholder="请输入里程" v-model="editMileNumber" maxlength="8" clearable/>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4 = false">取 消</el-button>
            <el-button type="primary" @click="ensureEdit">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    <el-dialog title="车架号图片" :visible.sync="dialogVisible5" width="800px">
      <img :src="carFrameImageId" alt style="width:768px;height:576px;" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible5 = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
  import net from "../../assets/js/public"
  import $ from "jquery"
  import tableCom from '../../components/tableCompnment/tableForm'
  import searchCom from '../../components/tableCompnment/searchForm'
  import recordForm from '../../components/tableCompnment/recordForm'
  import {frozenOrder, getOperatingRecord, queryByIdFirstReport, queryCarTestingPhoto, queryTestingWeb, editAuditingRecheck, auditingRecheck,
    repulseReport, ensureEdit, getProductData, getSearchProductData} from '../../api'
  import {mapActions, mapState} from 'vuex'
  import moment from "moment";
  export default {
    components: {
      tableCom,
      searchCom,
      recordForm
    },
    data() {
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
          {
            label: '打印',
            type: 'Button',
            btnList: [
              {type: 'primary', label: '打印检测报告', handle: (that, row) => this.printReport(that, row)}
            ]
          },
          {
            label: '操作',
            type: 'Button',
            btnList: [
              {type: 'primary', label: '开始审核', handle: (that, row) => this.startVerift(that, row)}
            ]
          },
          {
            label: '操作记录',
            type: 'Button',
            btnList: [
              {type: 'success', label: '查看', handle: (that, row) => this.showRecord(that, row)}
            ]
          },
          {
            label: '冻结',
            type: 'Button',
            btnList: [
              {type: 'danger', label: '冻结工单', handle: (that, row) => this.frozen(that, row)}
            ]
          }
        ],
        isShowRecord: false,

        orderPageShowOrgName: false,
        editMileNumber: "",
        dialogVisible4: false,
        dialogVisible5: false, //车架号图片dialog
        carFrameImageId: 0,
        //背景图片
        bg_pic: "",
        num1: "",
        listData: [],
        total: null,
        dialogVisible: true,
        jobId: "",
        orgId: "",
        //参数
        title: "",
        beforeArr: [],
        afterArr: [],
        result:
          "治疗效果非常显著，原先被积碳覆盖和包裹的补位经过治疗后已经漏出的金属的光泽。为巩固治疗效果，请在安全行驶的情况下，进行急加速，猛轰油门等操作。建议每次包养时对发动机做健康体检。以便及时发现问题及时解决，做到以养代修。以保持发动机卓越的动力性跟燃油经济性。",
        isprint: true,
        isShowSub: false,
        isShowBtn: true,
        operId: "",
        seeArr: [],
        //车辆信息
        mileNumber: "",
        gasolinetype: "",
        oilDeplete: "",
        carNumber: "",
        brandname: "",
        testAddr: "",
        cartype: "",
        ReseriesName: "",
        isPower: true, //控制打印显隐
        productArr: [],
        checkProList: [],
        dataModel: [], //暂存计步器双休绑定
        useArr: [], //用量暂存
        showUse: true,
        version: "",
        dialogVisible1: false, //照片不合格弹窗
        dialogVisible2: false,
        checkedPlace: [],
        position: [], //部位数据
        carUrl: "", //车牌照片
        carBigImageID: "",
        carPai: null,
        exLen: 0,
        bigImage: "",
        time: "",
        imgWidth: 165, //4张图片165，
        iconTop: 50,
        step2ImageHeader: ""
      }
    },
    created() {
      this.getWaitVerifyReportList()
    },
    filters: {
      type(d) {
        var arr = ["", "检测", "治疗", "检测+治疗"];
        return arr[d];
      }
    },
    computed: {
      ...mapState(['waitVerifyReportTableData', 'waitVerifyReportLongData', 'waitVerifyReportPagination', 'pageNo', 'pageSize', 'searchData', 'redordData', 'redordCols'])// 读数据
    },
    methods: {
      ...mapActions(['getWaitVerifyReportList']),

      showRecord (that, row) {// 点击操作记录
        this.isShowRecord = true
        getOperatingRecord({ id: row.jobId }).then(res => {
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

      frozen (that, row) {// 冻结
        this.$confirm('此操作将冻结此工单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          frozenOrder({jobId: row.jobId, version: row.version})
                  .then(res => {
                    console.log(res)
                  }).catch(res => {
            console.log(res)
            this.getDetectionOrderList()
          })
        })
      },

      searchOrder () { // 查询
        this.getWaitVerifyReportList()
      },
      //翻页
      CurrentChange(val){
        this.$store.state.waitVerifyReportPagination.pageNum = val;
        this.getWaitVerifyReportList()
      },
      //选择 每页显示数量
      SizeChange(val){
        this.$store.state.waitVerifyReportPagination.pageSize = val;
        this.getWaitVerifyReportList()
      },

      printReport(that, row) { // 打印检测报告
        this.$router.push({
          name: "InitSurvey",
          params: {
            operId: 6,
            row: row,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            carNumber: this.carPai,
            enter: false,
            print: true
          }
        });
      },

      startVerift(that, row) { // 开始审核
        for (let i in this.listData) {
          this.listData[i]["review"] = 0;
        }
        row.review = 1;
        this.exChange();
        this.dialogVisible = false;
        this.jobId = row.jobId;
        this.jobCode = row.jobCode;
        this.mileNumber = row.mile + "km";
        this.checkProList = [];
        this.dataModel = [];
        this.version = row.version;
        this.getBgImg(row.orgId);
        this.getProductInfo(() => {
          //初始化产品用量
          this.searchProUse();
        });
        if (row.jobCode === 700) {
          this.isShowSub = false;
        } else if (row.jobCode === 800) {
          this.isShowBtn = false;
          this.isShowSub = true;
        } else {
          this.isShowSub = false;
        }
        //车辆信息
        queryByIdFirstReport({ carId: row.carId }).then(res => {
            this.gasolinetype = res.data.fuelTypeName;
            this.oilDeplete = res.data.oilDeplete;
            this.carNumber = res.data.carNumber;
            this.brandname = res.data.brandName;
            this.ReseriesName = res.data.seriesName;
            this.testAddr = res.data.orgName;
            this.cartype = res.data.modelName;
          });
        const param = {
          jobId: this.jobId,
          step: 1
        }
        queryCarTestingPhoto(param).then(d => {
            if (d.retcode === 1) {
              const Arr = d.data,
                      before = [];
              this.beforeArr = [];
              this.afterArr = [];
              for (let i = 0; i < Arr.length; i++) {
                Arr[i]["url"] = net.bigImg + Arr[i].photoId;
                if (Arr[i].optionId !== -1 && Arr[i].optionId !== -11 && Arr[i].optionId !== 5 &&Arr[i].optionId !== -2) {
                  before.push(Arr[i]);
                }
              }
              const paramData = {
                jobId: this.jobId,
                step: 2
              }
                  //检测后照片
              queryCarTestingPhoto(paramData).then(r => {
                  if (r.retcode === 1) {
                    const after = [],
                            b_arr = r.data,
                            Arr = [];
                    for (let g = 0; g < b_arr.length; g++) {
                      if (b_arr[g].optionId === -2) {
                        this.carUrl = net.imgUrl + b_arr[g].photoId;
                        this.carBigImageID = b_arr[g].photoId;
                      }
                      for (let j = 0; j < before.length; j++) {
                        if (before[j].optionId === b_arr[g].optionId) {
                          Arr.push(b_arr[g]);
                          break;
                        }
                      }
                    }

                    for (let i = 0; i < Arr.length; i++) {
                      for (let k = 0; k < before.length; k++) {
                        const element = before[k];
                        if (Arr[i].optionId === element.optionId) {
                          this.beforeArr.push(element);
                        }
                      }
                      Arr[i]["url"] = net.bigImg + Arr[i].photoId;
                      if (Arr[i].optionId !== -2 &&Arr[i].optionId !== -11 && Arr[i].optionId !== 5 &&Arr[i].optionId !== -1) {
                        after.push(Arr[i]);
                      }
                    }
                    this.afterArr = after;
                    this.trendsEdit(this.beforeArr.length);
                  } else {
                    net.message(this, r.retmsg, "error");
                  }
                });
            } else {
              net.message(this, d.retmsg, "error");
            }
          });
        const params = {
          jobId: this.jobId,
          step: 2
        }
        queryTestingWeb(params).then(res => {
            if (res.retcode === 1) {
              if (res.data != null) {
                this.result = res.data.diagnosticOption;
                this.step2ImageHeader = res.data.step2ImageHeader;
                this.exLen = 230 - res.data.diagnosticOption.length;
                this.time = net.dateFormat(res.data.reportTime, 0);
              } else {
                this.exLen = 230 - this.result.length;
              }
            } else {
              net.message(this, res.retmsg, "error");
            }
          })
      },

      keepData(){ // 编辑并通过
        const list = this.getProArgs();
        let params = {
          jobId: this.jobId,
          diagnosticOption: this.result,
          version: this.version
        };
        let data = list;
        editAuditingRecheck(params, data).then(res => {
            if (res.retcode === 1) {
              net.message(this, res.retmsg, "suuccess");
              const skip = net.isJump("/completeOrder");
              if (skip) {
                this.$router.push({ path: "/completeOrder" });
              } else {
                this.getWaitVerifyReportList()
              }
            } else {
              net.message(this, res.retmsg, "error");
            }
          })
      },

      submitReport(){ // 审核通过
        let params = {
          jobId: this.jobId,
          version: this.version
        };
        auditingRecheck(params).then(res => {
          if (res.retcode === 1) {
            net.message(this, res.retmsg, "suuccess");
            const skip = net.isJump("/completeOrder");
            if (skip) {
              this.$router.push({ path: "/completeOrder" });
            } else {
              this.getWaitVerifyReportList()
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        })
      },

      repulse() { // 打回
        this.$confirm(
          "此操作将修改工单为复查报告编辑状态，是否确认打回?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            const param = {
              jobId: this.jobId,
              version: this.version
            }
            repulseReport(param).then(res => {
                if (res.retcode === 0) {
                  this.dialogVisible = true;
                  this.getWaitVerifyReportList()
                } else {
                  net.message(this, res.retmsg, "warning");
                }
              });
          })
          .catch(() => {});
      },

      back() { // 返回列表
        if (this.operId === 2) {
          this.$router.push({ path: "/completeOrder" });
        } else {
          this.dialogVisible = true;
          this.getWaitVerifyReportList()
        }
      },

      printdiv() { // 预览 / 打印
        this.isprint = false;
        setTimeout(() => {
          net.printServer(
            document.getElementById("printBody").innerHTML,
            myWindow => {
              setTimeout(() => {
                myWindow.print();
                myWindow.close();
                this.isprint = true;
              }, 1000);
            }
          );
        }, 300);
      },

      editMileage() { // 编辑里程
        this.editMileNumber = "";
        this.dialogVisible4 = true;
      },

      ensureEdit() { // 确认编辑里程
        let reg = /^\d+$/;
        if (!reg.test(this.editMileNumber)) {
          net.message(this, "里程只能为非负正整数", "error");
          return false;
        }
        const param = {
          jobId: this.jobId,
          mile: this.editMileNumber
        }
        ensureEdit(param).then(res => {
            if (res.retcode === 1) {
              net.message(this, "修改成功", "success");
              this.dialogVisible4 = false;
              this.mileNumber = this.editMileNumber + "km";
            } else {
              net.message(this, res.retmsg, "error");
            }
          })
      },

      getBgImg(orgId) {
        this.bg_pic = net.imageHP + "web/config/watermark/getImage?orgId=" + orgId;
      },
      exChange() {
        $("#exCtrl").on("input propertychange", e => {
          this.exLen = 230 - e.target.value.length;
        });
      },

      trendsEdit(len) {//动态控制打印布局
        if (len === 1 || len === 2) {
          this.imgWidth = 270;
          this.iconTop = 90;
        } else if (len === 3) {
          this.imgWidth = 240;
          this.iconTop = 75;
        } else if (len === 4) {
          this.imgWidth = 165;
          this.iconTop = 50;
        }
      },

      mouseEnter(d) {//鼠标进入图片显示放大按钮
        if (d === -2) {
          $(".showCPBigBtn").hide();
          $(".showCPBigBtn[data-optionid='" + d + "']").show();
          return;
        }

        $(".showBigBtn").hide();
        $(".showBigBtn[data-optionid='" + d + "']").show();
      },
      mouseLeave() {
        $(".showCPBigBtn").hide();
        $(".showBigBtn").hide();
      },
      bigIcon(id) {
        this.dialogVisible2 = true;
        this.bigImage = net.bigImg + id;
      },

      getProductInfo(callback) {//获取产品信息
        callback = callback || function() {};
        getProductData().then(res => {
          if (res.retcode === 1) {
            const data = res.data;
            for (let i = 0; i < data.length; i++) {
              const item = {value1: "", id: data[i].id};
              this.dataModel.push(item);
            }
            this.productArr = data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
      },

      searchProUse() {//查询产品用量
        getSearchProductData({jobId: this.jobId}).then(res => {
            if (res.retcode === 1) {
              const data = res.data.rows;
              for (let i = 0; i < data.length; i++) {
                if (data[i].number !== 0) {
                  this.checkProList.push(data[i].productId);
                  for (let j = 0; j < this.dataModel.length; j++) {
                    if (this.dataModel[j].id === data[i].productId) {
                      this.dataModel[j]["value1"] = data[i].number;
                    }
                  }
                }
              }
            } else {
              net.message(this, res.retmsg, "error");
            }
          });
      },
    },
  }
</script>
<style lang='less' scoped>
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
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #009688;
}
.contentBody {
  display: flex;
  flex-direction: column;
  width: 100%;
  .carInfo {
    width: 80%;
    border-bottom: 1px solid #bfbfbf;
    margin: 0 auto;
    p {
      line-height: 32px;
      height: 32px;
      text-align: left;
      span {
        display: inline-block;
        margin-right: 20px;
      }
    }
  }
  .onlodList {
    width: 80%;
    margin: 0 auto 0;
    padding: 5px 0;
    max-height: 450px;
    overflow-y: scroll;
  }
}
.enter {
  background-color: #e6a23c;
  border: 1px solid #e6a23c;
}
.default {
  background-color: rgb(0, 150, 136);
  border: 1px solid rgb(0, 150, 136);
}
</style>

