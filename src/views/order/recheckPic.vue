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
            :tableData='recheckPicTableData'
            :tableCols='tableCols'
            :isPagination='true'
            :tablePage='recheckPicPagination'
            :longDatas="recheckPicLongData"
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
        {label: '工单说明', prop: 'explain'},
        {label: '当前操作人', prop: 'operatorName'},
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
    this.getRecheckPicList()
  },
  computed: {
    ...mapState(['recheckPicTableData', 'recheckPicLongData', 'recheckPicPagination', 'pageNo', 'pageSize', 'searchData'])// 读数据
  },
  methods: {
    ...mapActions(['getRecheckPicList']),
    searchOrder () { // 查询
      this.getRecheckPicList()
    }
  }
}
</script>
<style lang='less'>
.onloadFirstPic {
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
      // border-bottom: 1px solid #bfbfbf;
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
    .bottonContent {
      display: flex;
      max-height: 500px;
      overflow-y: scroll;
      .onlodList {
        width: 40%;
        margin-left: 82px;
        padding: 5px 0;
        .perform {
          width: 100%;
          height: 150px;
          border-bottom: 1px solid #bfbfbf;
          display: flex;
          flex-direction: row;
          .left {
            width: 29%;
            height: 100%;
            border-right: 1px solid #bfbfbf;
            line-height: 150px;
          }
          .right {
            width: 70%;
            height: 100%;
          }
          .error {
            color: #f40;
          }
        }
      }
    }
  }
  .el-upload-list--picture-card:not(:empty) + .el-upload--picture-card {
    display: none;
  }
}
.pPosition {
  position: relative;
}
#mainBtn {
  .el-button--primary {
    span {
      margin-right: 0px;
    }
  }
  position: absolute;
  top: -30px;
  right:0;
}
.hello1 {
  .el-dialog__title {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>

