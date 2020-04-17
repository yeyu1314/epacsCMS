<template>
  <div class="ces-main">
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
      :tableData='ensureOrderTableData'
      :tableCols='tableCols'
      :isPagination='true'
      :tablePage='ensureOrderPagination'
      :longDatas="ensureOrderLongDatas"
      :newBtnList='ensureOrderBtnArrList'
      @CurrentChange = 'CurrentChange'
      @SizeChange = 'SizeChange'
    >
    </table-com>
    <el-dialog title="温馨提示" :visible="dialogVisible" width="40%" @close='close'>
      <span>当前订单检测已完成，车主是否接受治疗？</span>
      <br />
      <br />
      <div class="selectType" style="text-align:left;margin-left:10%">
        <p>治疗项目</p>
        <br />
        <el-checkbox-group v-model="step2Type2OptionList" @change="handleStep2Type2OptionList">
          <el-checkbox :label="0">动力康复</el-checkbox>
          <el-checkbox :label="1">缸内修复</el-checkbox>
          <el-checkbox :label="2">烧机油治理</el-checkbox>
        </el-checkbox-group>
      </div>
      <br />
      <div style="text-align:left;margin-left:10%">
        <span style="color:#f40">注意:</span>
        <br />
        <span
          style="color:#f40"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;治疗项目已经调整,请注意根据实际情况进行选择</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" style="color:red">*不治疗*</el-button>
        <el-button type="primary" @click="ensure">接受治疗</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="预览文件"
      :visible="viewPdf20"
      :before-close="handleClose"
      :fullscreen="true"
    >
      <iframe :src=url20 frameborder="0" style="width: 100vw; height: 80vh"></iframe>
    </el-dialog>
    <el-dialog
      title="预览文件"
      :visible="viewPdf30"
      :before-close="handleClose"
      :fullscreen="true"
    >
      <iframe :src=url30 frameborder="0" style="width: 100%; height: 80vh"></iframe>
    </el-dialog>
    <el-dialog
      title="预览文件"
      :visible="viewPdf31"
      :before-close="handleClose"
      :fullscreen="true"
    >
      <iframe :src=url31 frameborder="0" style="width: 100%; height: 80vh"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import net from "../../assets/js/public"
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import {frozenOrder, startEnsureOrder, stopEnsureOrder} from '../../api'
import {mapActions, mapState} from 'vuex'
export default {
  components: {
    tableCom,
    searchCom
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
        {label: '报告解读',type: 'button'},
        {
          label: '操作',
          type: 'Button',
          btnList: [
            {type: 'primary', label: '是否接受治疗', handle: (that, row) => this.treatOrder(that, row)},
            {type: 'primary', label: '打印检测报告', handle: (that, row) => this.printReport(that, row)}
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
      treatOrderRow: '',
      dialogVisible: false,
      step2Type2OptionList: [0],
      url30 : 'http://autoepacs.com/30.pdf',
      url31 : 'http://autoepacs.com/31.pdf',
      url20 : 'http://autoepacs.com/20.pdf',
      isViewPdf30: false,
      isViewPdf31: false
    };
  },
  created () {
    this.getEnsureOrderList()
  },
  computed: {
    ...mapState(['ensureOrderTableData', 'ensureOrderLongDatas', 'ensureOrderPagination', 'pageNo', 'pageSize', 'searchData', 'ensureOrderBtnArrList',
    'viewPdf20', 'viewPdf30', 'viewPdf31'])// 读数据
  },
  methods: {
    ...mapActions(['getEnsureOrderList']),

    frozen(that, row) {//冻结
      console.log(that, row)
      this.$confirm('此操作将冻结此工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(that, row)
        frozenOrder({jobId: row.jobId, version: row.version}).then(res => {
          if (res.retcode === 1) {
            console.log(res)
            net.message(this, "操作成功", "success");
            this.getEnsureOrderList()
          }
        }).catch(res => {
          console.log(res)
        })
      })
    },
    //翻页
    CurrentChange(val){
      this.$store.state.ensureOrderPagination.pageNum = val;
      this.getEnsureOrderList()
    },
    //选择 每页显示数量
    SizeChange(val){
      this.$store.state.ensureOrderPagination.pageSize = val;
      this.getEnsureOrderList()
    },
    treatOrder (that, row) {// 是否接受治疗
      this.dialogVisible = true
      this.treatOrderRow = row
    },
    handleStep2Type2OptionList(value) { // 选择治疗项目
      if (value.indexOf(0) === -1) {
        net.message(this, "治疗项目必须包含动力康复", "warning");
        value.push(0);
      }
    },
    ensure(){ // 接受治疗
      const params = {
        jobId: this.treatOrderRow.jobId,
        orgId: this.treatOrderRow.orgId,
        version: this.treatOrderRow.version,
        step2Type2OptionList: this.step2Type2OptionList.join(",")
      }
      startEnsureOrder(params).then(res => {
        if (res.retcode === 1) {
            net.message(this, res.retmsg, "success");
          const skip = net.isJump("/treatOrder");
          if (skip) {
              this.$router.push({ path: "/treatOrder" });
            } else {
              this.getEnsureOrderList()
            }
          } else {
            net.message(this, res.retmsg, "warning");
          }
      })
    },
    cancel(){ // 不治疗
      const params = {
        jobId: this.treatOrderRow.jobId,
        version: this.treatOrderRow.version,
      }
      stopEnsureOrder(params).then(res => {
        if (res.retcode === 1) {
          net.message(this, res.retmsg, "success")
          this.$router.push({ path: "/completeOrder" })
        } else {
          net.message(this, res.retmsg, "warning")
        }
      })
    },
    searchOrder () { // 查询
      this.getEnsureOrderList()
    },
    close(){ // 关闭选择治疗弹窗
      this.dialogVisible = false
      this.step2Type2OptionList = [0]
    },
    printReport(that, row) { // 打印检测报告
      console.log(this.ensureOrderPagination,row)
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 2,
          row: row,
          pageNo: this.ensureOrderPagination.pageNum,
          pageSize: this.ensureOrderPagination.pageSize,
          carNumber: row.carNumber,
          enter: false,
          print: true
        }
      });
    },
    handleClose() { //关闭 报告解读 弹窗
      this.$store.state.viewPdf20 = false
      this.$store.state.viewPdf30 = false
      this.$store.state.viewPdf31 = false
    }
  }
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
</style>

