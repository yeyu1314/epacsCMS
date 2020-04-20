<!--待检测工单-->
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
      :tableData='detectionOrderTableData'
      :tableCols='tableCols'
      :isPagination='true'
      :tablePage='detectionOrderPagination'
      :longDatas="detectionOrderLongDatas"
      @CurrentChange = 'CurrentChange'
      @SizeChange = 'SizeChange'
    >
    </table-com>
  </div>
</template>

<script>
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import {getStartTesting, frozenOrder} from '../../api'
import {mapActions, mapState} from 'vuex'
import net from "../../assets/js/public"

export default {
  name: 'detectionOrderList',
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
        {
          label: '操作记录',
          type: 'Button',
          width: '280px',
          btnList: [
            {type: 'success', size: 'small', label: '开始检测', handle: (that, row) => this.startDetection(that, row)},
            {type: 'danger', size: 'small', label: '冻结工单', handle: (that, row) => this.frozen(that, row)}
          ]
        }
      ],
      orderPageShowOrgName: false,
      page: this.$route.params
    }
  },
  components: {
    tableCom,
    searchCom
  },
  created () {
    this.getDetectionOrderList()
  },
  computed: {
    ...mapState(['detectionOrderTableData', 'detectionOrderPagination', 'detectionOrderLongDatas', 'pageNo', 'pageSize', 'searchData'])// 读数据
  },
  methods: {
    ...mapActions(['getDetectionOrderList']),

    startDetection (that, row) { // 开始检测
      getStartTesting({jobId: row.jobId, version: row.version})
        .then((res) => {
          if (res.retcode === 1) {
            net.message(this, res.retmsg, "success")
            const skip = net.isJump("/waitOrder");
            if (skip) {
              this.$router.push({ path: "/onloadPic" })
            } else {
              this.getDetectionOrderList()
            }
          } else {
            net.message(this, res.retmsg, "warning")
          }
        }).catch(error => {
        console.log(error)
        this.getDetectionOrderList()
      })
    },

    frozen (that, row) { // 冻结工单
      this.$confirm("此操作将冻结此工单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        frozenOrder({jobId: row.jobId, version: row.version})
          .then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getDetectionOrderList()
          }).catch(() => {
            this.getDetectionOrderList()
          })
      })
    },

    searchOrder () { // 查询
      this.getDetectionOrderList()
    },
    //翻页
    CurrentChange(val){
      this.$store.state.detectionOrderPagination.pageNum = val;
      this.getDetectionOrderList()
    },
    //选择 每页显示数量
    SizeChange(val){
      this.$store.state.detectionOrderPagination.pageSize = val;
      this.getDetectionOrderList()
    },
  }
}
</script>

<style scoped>

</style>
