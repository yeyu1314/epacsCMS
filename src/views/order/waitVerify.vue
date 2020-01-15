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
      :tableData='verifyDetectionOrderTableData'
      :tableCols='tableCols'
      :isPagination='true'
      :tablePage='verifyDetectionOrderPagination'
      :longDatas="verifyDetectionOrderLongDatas"
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
import {getOperatingRecord, frozenOrder} from '../../api'
import {mapActions, mapState} from 'vuex'
export default {
  components: {
    tableCom,
    searchCom,
    recordForm
  },
  data () {
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
  created () {
    this.getDetectionVerifyList()
  },
  computed: {
    ...mapState(['verifyDetectionOrderTableData', 'verifyDetectionOrderLongDatas', 'verifyDetectionOrderPagination', 'pageNo', 'pageSize', 'searchData', 'redordData', 'redordCols'])// 读数据
  },
  methods: {
    ...mapActions(['getDetectionVerifyList']),
    // 打印检测报告
    printReport (that, row) {
      console.log(that, row)
    },
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
    // 开始审核
    startVerift () {

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
    .ctroArrow {
      display: flex;
      margin-top: 15px;
      margin-left: 20px;
      p {
        font-size: 14px;
      }
      .derail {
        margin-top: 8px;
        margin-left: 10px;
      }
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
