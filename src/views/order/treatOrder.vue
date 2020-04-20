<template>
  <div class="ces-main">
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
            :tableData='treatTableData'
            :tableCols='tableCols'
            :isPagination='true'
            :tablePage='treatPagination'
            :longDatas="treatLongData"
            @CurrentChange = 'CurrentChange'
            @SizeChange = 'SizeChange'
    >
    </table-com>
  </div>
</template>

<script>
import net from "../../assets/js/public";
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import {frozenOrder, startTeaet} from '../../api'
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
        {
          label: '打印',
          type: 'Button',
          btnList: [
            {type: 'success', isShow: true, size: 'small', label: '打印检测报告', handle: (that, row) => this.printReport(that, row)}
          ]
        },
        {
          label: '操作',
          type: 'Button',
          btnList: [
            {type: 'success', isShow: true, size: 'small', label: '开始复查', handle: (that, row) => this.startTeaet(that, row)}
          ]
        },
        {
          label: '冻结',
          type: 'Button',
          btnList: [
            {type: 'danger', isShow: true, size: 'small', label: '冻结工单', handle: (that, row) => this.frozen(that, row)}
          ]
        }
      ],
    }
  },
  created() {
    this.getTreatOrderEditList()
  },
  computed: {
    ...mapState(['treatTableData', 'treatPagination', 'treatLongData', 'pageNo', 'pageSize', 'searchData'])// 读数据
  },
  methods: {
    ...mapActions(['getTreatOrderEditList']),
    startTeaet (that, row) { // 开始复查
      const params = {
        jobId: row.jobId,
        version: row.version
      }
      startTeaet(params).then(res => {
        if (res.retcode === 1) {
          net.message(this, res.retmsg, "success");
          const skip = net.isJump("/recheckPic");
          if (skip) {
            this.$router.push({ path: "/recheckPic" });
          } else {
            this.getTreatOrderEditList()
          }
        } else {
          net.message(this, res.retmsg, "error");
        }
      })
    },
    printReport (that, row) { // 打印检测报告
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 3,
          row: row,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          carNumber: row.carNumber,
          enter: false,
          print: true
        }
      });
    },
    frozen (that, row) { // 冻结
      this.$confirm('此操作将冻结此工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(that, row)
        frozenOrder({jobId: row.jobId, version: row.version}).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
          this.getDetectionOrderList()
        })
      })
    },
    searchOrder () { // 查询
      this.getTreatOrderEditList()
    },
    //翻页
    CurrentChange(val){
      this.$store.state.treatPagination.pageNum = val;
      this.getTreatOrderEditList()
    },
    //选择 每页显示数量
    SizeChange(val){
      this.$store.state.treatPagination.pageSize = val;
      this.getTreatOrderEditList()
    },
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

