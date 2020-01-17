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
          btnList: [
            {type: 'success', label: '开始检测', handle: (that, row) => this.startDetection(that, row)},
            {type: 'danger', label: '冻结工单', handle: (that, row) => this.frozen(that, row)}
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
      console.log('开始检测', that, row)
      getStartTesting({jobId: row.jobId, version: row.version})
        .then((res) => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success")
            var skip = net.isJump("/waitOrder")
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
      console.log('冻结工单', that, row)
      this.$confirm("此操作将冻结此工单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(that, row)
        frozenOrder({jobId: row.jobId, version: row.version})
          .then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getDetectionOrderList()
          }).catch(res => {
            console.log(res)
            this.getDetectionOrderList()
          })
      })
    },
    searchOrder () { // 查询
      this.getDetectionOrderList()
    }
  }
}
</script>

<style scoped>

</style>
