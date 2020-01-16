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
    >
    </table-com>
  </div>
</template>

<script>
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import {frozenOrder} from '../../api'
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
    };
  },
  created () {
    this.getEnsureOrderList()
  },
  computed: {
    ...mapState(['ensureOrderTableData', 'ensureOrderLongDatas', 'ensureOrderPagination', 'pageNo', 'pageSize', 'searchData', 'ensureOrderBtnArrList'])// 读数据
  },
  methods: {
    ...mapActions(['getEnsureOrderList']),
    //冻结
    frozen(that, row) {
      console.log(that, row)
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
    // 打印检测报告
    printReport (that, row) {
      console.log(that, row)
    },
    // 是否接受治疗
    treatOrder (that, row) {
      console.log(that, row)
    },
    searchOrder () { // 查询
      this.getEnsureOrderList()
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

