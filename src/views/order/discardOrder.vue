<template>
  <div class="ces-main">
    <search-com
            size='medium '
            labelWidth = '80px'
            :searchData = "discardSearchData"
            :searchForm = "searchForm"
            :searchHandle="searchHandle">
    </search-com>
    <table-com
            :that='that'
            size='medium '
            :isSelection='true'
            :isIndex='true'
            :isHandle='true'
            :tableData='discardTableData'
            :tableCols='tableCols'
            :isPagination='true'
            :tablePage='discardPagination'
            :longDatas="discardLongData"
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
    ></record-form>
  </div>
</template>

<script>
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import recordForm from '../../components/tableCompnment/recordForm'
import {getOperatingRecord} from '../../api'
import {mapActions, mapState} from 'vuex'
export default {
  components: {
    tableCom,
    searchCom,
    recordForm
  },
  data() {
    let checkTypes=[{label:'全部',value:'0'},{label:'检测',value:'1'},{label:'治疗',value:'2'},{label:'检测+治疗',value:'3'}]
    let checkTypeProps={label:'label',value:'value'}
    return {
      that: this,
      searchForm: [ // 搜索栏
        {type: 'Input', prop: 'carNumber', width: '180px', placeholder: '请输入车牌'},
        {type:'Input',prop:'carMsg',width:'180px',placeholder:'请输入车系'},
        {type:'Input',prop:'station',width:'180px',placeholder:'请输入维修站'},
        {type:'Select',prop:'checkType',width:'180px',options:checkTypes,props:checkTypeProps,change:row=>this.selectCheckType(row),placeholder:'请选择业务类型'},
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
        // {label: '工单状态', prop: 'carCylinder'},
        // {label: '作废时间', prop: 'carCylinder'},
        {
          label: '操作记录',
          type: 'Button',
          btnList: [
            {type: 'success', label: '查看',size: 'small', handle: (that, row) => this.showRecord(that, row)}
          ]
        }
      ],
      isShowRecord: false
    }
  },
  created() {
    this.$store.state.discardSearchData = {
      carNumber: null,
      carMsg: null,
      station: null,
      checkType: null
    }
    this.$store.state.discardPagination = {
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
    this.getDiscaedList()
  },
  computed: {
    ...mapState(['discardTableData', 'discardLongData', 'discardPagination', 'pageNo', 'pageSize', 'discardSearchData', 'redordData', 'redordCols'])// 读数据
  },
  methods: {
    ...mapActions(['getDiscaedList']),
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
    //翻页
    CurrentChange(val){
      this.$store.state.discardPagination.pageNum = val;
      this.getDiscaedList()
    },
    //选择 每页显示数量
    SizeChange(val){
      this.$store.state.discardPagination.pageSize = val;
      this.getDiscaedList()
    },
    searchNews() { // 查询
      this.getDiscaedList()
    }
  }
};
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
.classA {
  background: #009688;
}
.classB {
  background: #909399;
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
.seeRecheck {
  width: 800px;
  margin: 0 auto;
  .operBtn {
    display: flex;
    width: 100%;
  }
  .contentBody {
    .onlodList {
      width: 80%;
      margin: 0 auto 0;
      padding: 5px 0;
      max-height: 450px;
      overflow-y: scroll;
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
      }
    }
  }
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #009688;
}
</style>

