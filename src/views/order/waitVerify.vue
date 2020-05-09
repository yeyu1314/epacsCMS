<template>
  <div>
    <div class="ces-main" v-show="!isShowOpear">
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
        :tableData='verifyDetectionOrderTableData'
        :tableCols='tableCols'
        :isPagination='true'
        :tablePage='verifyDetectionOrderPagination'
        :longDatas="verifyDetectionOrderLongDatas"
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
    <div v-show="isShowOpear" class="warping">
      <!-- 操作栏 -->
      <div class="operation">
        <div class="left">
          <el-button type="info" @click="subExamine">审核通过</el-button>
          <el-button type="danger" @click="reduction">还原</el-button>
          <el-button type="success" @click="editAdopt">编辑并通过</el-button>
          <el-button type="danger" @click="repulse">打回</el-button>
          <el-button type="primary" @click="editMileage">编辑里程</el-button>
          <el-button type="primary" @click="seeCarFrameNumber">查看车架号图片</el-button>
          <el-button type="warning" @click="backClick">返回列表</el-button>
          <el-button type="primary" @click="printdiv" v-show="ctroPrinting">预览/打印</el-button>
        </div>
        <div class="right"></div>
      </div>
      <div class="line"></div>
      <div class="centent" id="firstContent">
        <!-- 左侧 -->
        <div style="background:aliceblue;width: 320px;">
          <leftItem />
        </div>

       <!-- 中间 -->
        <div id="centershow" style="width: 210mm;height: 297mm;border: 1px solid #eee; overflow-x: hidden;margin-left:50px;" >
          <contentItem ref="contentItem" :mileNumber="mileNumber" @carFrameImage="getCarFrameImage" @sendChildData="sendChildData" />
        </div>

         <!-- 右侧 -->
        <div class="rightTool">
          <rightItem ref="rightItem"  />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible2" width="700px">
      <div style="width:100%">
        <img :src="bigImage" alt style="width:100%" />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible3" width="700px">
      <div style="width:100%">
        <el-table :data="seeArr" height="450" border style="width: 100%">
          <el-table-column prop="userName" label="操作人"/>
          <el-table-column prop="remarks" label="操作内容"/>
          <el-table-column prop="inputTime" :formatter="dateFormat" label="操作时间"/>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="修改里程" :visible.sync="dialogVisible4" width="30%">
      <el-input placeholder="请输入里程" v-model="editMileNumber" maxlength="8" clearable/>
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
</template>
<script>
import net from "../../assets/js/public";
import $ from "jquery";
import moment from 'moment'
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import recordForm from '../../components/tableCompnment/recordForm'
import {getOperatingRecord, frozenOrder, startVeriftById, veriftToExamine, veriftPresentation, veriftRepulse, queryTestingWeb, ensureEdit, } from '../../api'
import {mapActions, mapState} from 'vuex'
import leftItem from './firstReport/leftItem'
import contentItem from './firstReport/contentItem'
import rightItem from './firstReport/rightItem'
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
        {
          label: '打印',
          type: 'Button',
          btnList: [
            {type: 'primary', label: '打印检测报告',size: 'small', handle: (that, row) => this.printReport(that, row)}
          ]
        },
        {
          label: '操作',
          type: 'Button',
          btnList: [
            {type: 'primary', label: '开始审核',size: 'small', handle: (that, row) => this.startVerift(that, row)}
          ]
        },
        {
          label: '操作记录',
          type: 'Button',
          btnList: [
            {type: 'success', label: '查看',size: 'small', handle: (that, row) => this.showRecord(that, row)}
          ]
        },
        {
          label: '冻结',
          type: 'Button',
          btnList: [
            {type: 'danger', label: '冻结工单',size: 'small', handle: (that, row) => this.frozen(that, row)}
          ]
        }
      ],
      isShowRecord: false, //操作记录弹窗
      isShowOpear: false, // 显示审核界面
      ctroPrinting: true, //预览打印 按钮
      isShowArrow: "不打印", //打印是否显示箭头
      orgId: "", //机构ID，用于背景图片
      optionIds: [],
      carId: "",
      checkType: "", //工单类型，判断审核完成后跳转

      templateBut: true,
      isprint: true,

      placeArr: [],
      //查询
      step1ImageHeader: "",// 影像诊断工程师

      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,//车架号图片dialog
      carFrameImageId: 0,
      datapicArr: [],
      editMileNumber: "",
      bigImage: "",
      seeArr: [],
      rowData: '',
      mileNumber: '', //里程
      advise: '',
      illustrate: ''
    }
  },
  created () {
    this.getDetectionVerifyList()
  },
  computed: {
    ...mapState(['verifyDetectionOrderTableData', 'verifyDetectionOrderLongDatas', 'verifyDetectionOrderPagination', 'pageNo', 'pageSize', 'searchData', 'redordData', 'redordCols'])// 读数据
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
    ...mapActions(['getDetectionVerifyList']),
    dateFormat(row) {
      let time = net.dateFormat(row.inputTime);
      return time;
    },

    getCarFrameImage(data){ // 获取车架号图片
      this.carFrameImageId = data
    },
    sendChildData(data){ // 结果和意见
      this.advise = data.advise
      this.illustrate = data.illustrate
    },

    // 打印检测报告
    printReport (that, row) {
      console.log(that, row)
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 7,
          row: row,
          pageNo: this.verifyDetectionOrderPagination.pageNum,
          pageSize: this.verifyDetectionOrderPagination.pageSize,
          carNumber: row.carNumber,
          enter: false,
          print: true
        }
      })
    },

    showRecord (that, row) { // 点击操作记录
      this.isShowRecord = true
      getOperatingRecord({ id: row.jobId }).then(res => {
        let data = res.data.list
        for (let i = 0; i < res.data.list.length; i++){
          data[i].inputTime = moment(data[i].inputTime).format('YYYY-MM-DD HH:MM')
        }
        this.$store.state.redordData = data
        }).catch(error => {
          console.log('操作记录', error)
        })
    },

    frozen (that, row) { // 冻结
      this.$confirm('此操作将冻结此工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(that, row)
        frozenOrder({jobId: row.jobId, version: row.version}).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getDetectionVerifyList()
        }).catch(() => {
          this.getDetectionVerifyList()
        })
      })
    },

    searchOrder () { // 查询
      this.getDetectionVerifyList()
    },

    //翻页
    CurrentChange(val){
      this.$store.state.verifyDetectionOrderPagination.pageNum = val;
      this.getDetectionVerifyList()
    },
    //选择 每页显示数量
    SizeChange(val){
      this.$store.state.verifyDetectionOrderPagination.pageSize = val;
      this.getDetectionVerifyList()
    },
    closeTip () { // 关闭操作记录的弹窗
      this.isShowRecord = false
    },
    // 开始审核
    startVerift (that, row) {
      this.isShowOpear = true
      this.$refs.contentItem.getContentData(row);
      this.$refs.rightItem.getSlectData(row);
      this.rowData = row
      this.mileNumber = row.mile + "km"
    },
    // 审核通过
    subExamine(){
      this.$refs.contentItem.subExamine();
    },
    // 还原
    reduction(){
      this.$refs.contentItem.reduction();
    },
    // 编辑并通过
    editAdopt(){
      this.$refs.contentItem.editAdopt()
    },
    // 打回
    repulse(){
      const param = {
        jobId: this.rowData.jobId,
        version: this.rowData.version
      }
      this.$confirm("此操作将修改工单为待编辑状态，是否确认打回?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          veriftRepulse(param).then(res => {
              this.isShowOpear = false;
              if (res.retcode === 1) {
                this.getDetectionVerifyList()
              } else {
                net.message(this, res.retmsg, "warning");
              }
            });
        })
        .catch(() => {});
    },
    // 编辑里程
    editMileage(){
      this.dialogVisible4 = true;
      this.editMileNumber = "";
    },
    //确认编辑里程
    ensureEdit() {
      let reg = /^\d+$/;
      console.log(this.editMileNumber);
      if (!reg.test(this.editMileNumber)) {
        net.message(this, "里程只能为非负正整数", "error");
        return false;
      }
      const param = {
        jobId: this.rowData.jobId,
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
      });
    },
    // 查看车架号图片
    seeCarFrameNumber(){
      this.dialogVisible5 = true;
    },
    // 返回列表
    backClick(){
      this.isShowOpear = false;
      this.getDetectionVerifyList()
    },
    // 预览、打印
    printdiv() {
      this.$refs.contentItem.printDiv();
    },




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
  .leftTool {
    width: 300px;
    z-index: 99;
    position: fixed;
    top: 60px;
    background: aliceblue;
    height: 100%;

    .p_select {
      margin-bottom: 15px;
    }
    .arrow {
      width: 85px;
      margin-left: 170px;
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
