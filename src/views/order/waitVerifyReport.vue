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
            :tableData='waitVerifyReportTableData'
            :tableCols='tableCols'
            :isPagination='true'
            :tablePage='waitVerifyReportPagination'
            :longDatas="waitVerifyReportLongData"
    >
    </table-com>
    <record-form
            :that='that'
            :redordData='redordData'
            :redordCols='redordCols'
            :isShowRecord="isShowRecord"
            @closeTip="closeTip"
    ></record-form>
  </div>
</template>

<script>
  import tableCom from '../../components/tableCompnment/tableForm'
  import searchCom from '../../components/tableCompnment/searchForm'
  import recordForm from '../../components/tableCompnment/recordForm'
  import {frozenOrder, getOperatingRecord} from '../../api'
  import {mapActions, mapState} from 'vuex'
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
          {label: '查询', icon: 'el-icon-search', type: 'primary', handle: () => this.searchNews()}
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
        isShowRecord: false
      }
    },
    created() {
      this.getWaitVerifyReportList()
    },
    computed: {
      ...mapState(['waitVerifyReportTableData', 'waitVerifyReportLongData', 'waitVerifyReportPagination', 'pageNo', 'pageSize', 'searchData', 'redordData', 'redordCols'])// 读数据
    },
    methods: {
      ...mapActions(['getWaitVerifyReportList']),
      // 点击操作记录
      showRecord (that, row) {
        // console.log(that, row)
        this.isShowRecord = true
        getOperatingRecord({ id: row.jobId })
                .then(res => {
                  console.log(res)
                  const data = res.data.list
                  this.$store.state.redordData = data
                }).catch(res => {
          console.log('操作记录', res)
        })
      },
      closeTip () { // 关闭弹窗
        this.isShowRecord = false
      },
      // 冻结
      frozen (that, row) {
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

