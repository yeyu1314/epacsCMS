<!--
<template>
    <table-template
        :tableData="tableData"
        :tableColumns="tableColumns"
        :selectionShow="false"
        :selectColumns="false"
        :tableOperationShow="true"
    ></table-template>
</template>

<script>
    import tableTemplate from "./compomentTable"
  export default {
    name: "testTable",
    components : {
      tableTemplate
    },
    data () {
      return {
        tableColumns: [
          {
            key: "company",
            title: "企业",
            width: "150",
            isShow: true // 控制当前列是否显示
          },
          {
            key: "networkAccessRate",
            title: "入网率",
            width: "150",
            isShow: true
          },
          {
            key: "networkAccessScore",
            title: "入网率得分",
            width: "150",
            isShow: true
          },
          {
            key: "onlineRate",
            title: "上线率",
            width: "150",
            isShow: true
          },
          {
            key: "onlineScore",
            title: "上线率得分",
            width: "150",
            isShow: true
          },
          {
            key: "trackIntegrityRate",
            title: "轨迹完整率",
            width: "150",
            isShow: true
          }
        ],
        tableData: [
          {company : 'a',networkAccessRate:'b',networkAccessScore:'c',onlineRate:'d',onlineScore:'e',trackIntegrityRate:'f',},
          {company : 'a',networkAccessRate:'b',networkAccessScore:'c',onlineRate:'d',onlineScore:'e',trackIntegrityRate:'f',},
        ]
      }
    }
  };
</script>

<style scoped>

</style>
-->

<!--

<template>
    <div class="table-page">
        <i-table
            :list="list"
             @handleSelectionChange="handleSelectionChange"
             @sizeChange="getSizeChange"
             @currentPage="getCurrentPage"
             :options="options"
             :columns="columns"
             :operates="operates"
             :pageShow="page.pageShow"
             :total="page.total"
        >
        </i-table>
    </div>
</template>

<script>
  import iTable  from './compomentTable'    //引入table组件
  export default{
    data(){
      return{
         page:{   //关于页码的相关参数
         pageShow:true,  //是否显示
          total:0,        //总条数
          pageSize:10,    //每页条数
          pageNo:1,       //第几页
        },
        handleSelection:[],  //checkbox选中行
        // list:[],// table数据
        options: {  // table样式参数
          stripe: false, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          highlightCurrentRow: true, // 是否支持当前行高亮显示
          mutiSelect: true, // 是否支持列表项选中功能
        }, // table 的参数结束
        columns: [
          {  // 需要展示的列开始
              prop: 'typeName',
              label: '设备类型',
              align: 'center',
              isShow:true,
              formatter: (row, column, cellValue) => {   //formatter重构
                return `返回参数`
              }
            },
          {
            prop: 'model',
            label: '设备名称',
            align: 'center',
            isShow:true
          },
          {
            prop: 'company',
            label: '厂商',
            align: 'center',
            isShow:true
          }
        ],// 需要展示的列结束
        operates: {   //操作栏
          width:400,
          fixed: 'right',
          list: [
            {
              id:'1',
              label: '编辑',
              show: true,   //是否显示按钮
              className:'searchAll', //样式类名
              disabled: false,   //是否禁用按钮 默认是danger的禁用样式
              method: (index, row) => {
                this.handleEdit(index, row)
              }
            }, {
              id:'2',
              label: '删除',
              show: true,
              className:'searchAll',
              disabled: true,
              method: (index, row) => {
                this.handledel(index, row)
              }
            }
          ]
        }, // 列操作按钮
        list : [
          {typeName:'宝马'}
        ]

      } //return ending
    },
    methods:{
      handleSelectionChange (val) { //checkbox选中的数据val 是选中行的所有数组
        this.handleSelection=val;
      },
      getSizeChange(val){  //table组件发射的方法 用于改变每页数据量
        this.page.pageSize=val;
        //这下面需要重新调用 获取列表页的函数

      },
      getCurrentPage(val){  //table组件发射的方法  用于改变当前所在页码
        this.page.pageNo=val;
        //这下面需要重新调用 获取列表页的函数

      },
      handleEdit (index, row) {  //操作栏编辑按钮
        console.log(' index:', index)
        console.log(' row:', row)
      },
      handledel(index, row) {  //操作栏删除按钮
        console.log(' index:', index)
        console.log(' row:', row)
      },
    },
    components:{
      iTable
    },
    created(){
      //调用获取列表页的方法
    }
  }

</script>

-->


<!--
<template>
    <i-table
            :dataSource="dataSource"
            @selection-change="handleSelectionChange"
            @review="handleReview"
    >
    </i-table>
</template>
<script>
  import iTable  from './compomentTable'    //引入table组件
  export default{
    components:{
      iTable
    },
    data(){
      return {
        dataSource: {
          data: [], // 表格数据
            cols: [
              {
                label: '仓库',
                prop: 'warehouseName',
                isTemplate: true
              },
              {
                label: '包裹号',
                prop: 'packageNum',
                width: '150'
              },
              {
                label: '订单类型',
                prop: 'orderType',
                isCodeTableFormatter: true,
              },
              {
                label: '订单号',
                prop: 'waybillNum',
                width: '150'
              },
              {
                label: '邮寄方式',
                prop: 'mailingMethod',
              }, {
                label: '商品数',
                prop: 'numberOfPackages',
              }, {
                label: '包装人',
                prop: 'packagesUserName',
              }, {
                label: '包装时间',
                prop: 'packagesTime',
                width: '160'
              }
            ], // 表格的列数据
            isSelection: true, // 表格有多选时设置
            isOperation: true, // 表格有操作列时设置
            isIndex: true, // 列表序号
            loading: false, // loading
            operation: {
            // 表格有操作列时设置
            label: "操作", // 列名
              width: "80", // 根据实际情况给宽度
              data: [
              {
                label: "查看", // 操作名称
                emitType: "review", // 触发父组件
                permission: "如URL" // 后期这个操作的权限，用来控制权限
              }
            ]
          }
        }
      }
    }
  }
</script>
-->



<!--

<template>
    <div class="app-container calendar-list-container">
        <el-row>
            <el-col :span="24">
                <div>
                    <tabletext :list="list" @handleSelectionChange="handleSelectionChange" :options="options"
                               :columns="columns" :operates="operates">
                    </tabletext>
                    <div class="pagination-container">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                       :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]"
                                       :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper"
                                       :total="total"> </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import tabletext from './compomentTable';
  // import { page } from 'api/dl/meter/index';
  export default {
    name: 'table1',
    components: {
      tabletext
    },
    computed: {},
    data() {
      return {
        list: [
          {meterid:11,title:'名称'},
          {meterid:11,title:'名称'},
          {meterid:11,title:'名称'},
        ], // table数据
        listQuery: {
          page: 1,
          limit: 20,
          systemname: undefined
        },
        total: null,
        options: {
          stripe: true, // 是否为斑马纹 table
          loading: false, // 是否添加表格loading加载动画
          highlightCurrentRow: true, // 是否支持当前行高亮显示
          mutiSelect: false, // 是否支持列表项选中功能
        }, // table 的参数
        columns: [
          {
            prop: 'meterid',
            label: '电表ID',
            align: 'center',
          }, {
            prop: 'title',
            label: '电表名称',
            align: 'center',
            // formatter: (row, column, cellValue) => {
            //   console.log(row.isenable)
            //   console.log(row)
            //   return `<span style="white-space: nowrap;color: dodgerblue;">${row.metername}</span>`
            // }
          },{
            prop: 'meteraddress',
            label: '电表地址',
            align: 'center',
          }, {
            prop: 'magnification',
            label: '倍率',
            align: 'center',
          },{
            prop: 'manufacturer',
            label: '厂家',
            align: 'center',
          },{
            prop: 'metermodel',
            label: '型号',
            align: 'center',
          },{
            prop: 'meterrule',
            label: '规约',
            align: 'center',
          },{
            prop: 'cabinetnum',
            label: '柜号',
            align: 'center',
          },{
            prop: 'remark',
            label: '备注',
            align: 'center',
          },{
            prop: 'isenable',
            label: '是否有效',
            align: 'center',
            render: (h, params) => {
              return h('span', {
              }, params.row.isenable === '1' ? '是' : params.row.isenable === '2' ? '否' : '')
            }
          },
        ], // 需要展示的列
        // 按钮
        operates: {
          width: 150,
          list: [
            {
              id: '1',
              label: '编辑',
              style: 'cursor:pointer;color: #409eff;',
              show: true,
              class: 'el-icon-edit',
              plain: true,
              method: (scope, row) => {
                console.log(scope)
                console.log(row)
                this.handleEdit(row)
              }
            },
            {
              id: '2',
              label: '删除',
              style: 'cursor:pointer;color: #b3450e;',
              class: 'el-icon-delete',
              show: true,
              plain: false,
              method: (index, row) => {
                this.handleDel(index,row)
              }
            }
          ]
        } // 列操作按钮
      }
    },
    created() {
      this.getList();

      const test = [
         {meterid:11,title:'名称',isShowBtn:true},
         {meterid:11,title:'名称',isShowBtn:false},
         {meterid:11,title:'名称',isShowBtn:true},
      ]
      const isShowBtn = [true,false,true];
      for (let i = 0; i<test.length; i++){
        this.operates.list[0].show = test[i].isShowBtn
      }

    },
    methods: {
      // 选中行
      handleSelectionChange(val) {
        console.log('val:', val)
      },
      // 编辑
      handleEdit(index, row) {
        console.log(' index:', index)
        console.log(' row:', row)
      },
      // 删除
      handleDel(index, row) {
        console.log(' index:', index)
        console.log(' row:', row)
      },

      getList() {
        console.log(this.listQuery)
        // page(this.listQuery).then(response => {
        //   this.list = response.data.rows;
        //   this.total = response.data.total;
        // })
      },
      handleSizeChange(val) {
        console.log(val)
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        console.log(val)
        this.listQuery.page = val;
        this.getList()
      },
    }
  }
</script>

-->



<!-- 完成工单列表-->
<!--<template>
    <div class="ces-main">
        &lt;!&ndash;<span>{{tableCols}}</span>&ndash;&gt;
        <search-form
            size='medium '
            labelWidth = '80px'
            :searchData = "searchData"
            :searchForm = "searchForm"
            :searchHandle="searchHandle">
        </search-form>
        <ces-table
                :that='that'
                size='small '
                :isSelection='true'
                :isIndex='true'
                :isHandle='true'
                :tableData='tableData'
                :tableCols='tableCols'
                :newBtnList="newBtnList"
                :checkButtonList="checkButtonList"
                :reviewButtonList="reviewButtonList"
                :remarkButtonList="remarkButtonList"
                :isPagination='true'
                :tablePage='pagination'
                @CurrentChange = 'CurrentChange'
                @SizeChange = 'SizeChange'
                :longDatas="longDatas"
        >
        </ces-table>
        <operating-record
                :that='that'
                :redordData='redordData'
                :redordCols='redordCols'
                :isShowRecord="isShowRecord"
                @closeTip="closeTip"
        >

        </operating-record>
        <edit-form
                :that="that"
                :editCfg="editCfg"
                :editData="editData"
                :editRules="editRules"
                :showEdit = "showEdit"
                @closeTip="closeTip"
                :title="title"
                @handleSubmit="handleSubmit"
        >

        </edit-form>
    </div>
</template>

<script>
  import net from "../../assets/js/public";
  import {mapState,mapActions} from 'vuex'
  import SearchForm from './searchForm'
  import cesTable from './compomentTable'
  import operatingRecord from './operatingRecord'
  import editForm from './editForm'
  import moment from 'moment'
  export default {
    data () {
      let checkTypes=[{label:'全部',value:'0'},{label:'检测',value:'1'},{label:'治疗',value:'2'},{label:'检测+治疗',value:'3'}]
      let checkTypeProps={label:'label',value:'value'}
      return {
        that : this,
        pagination:{
          pageNum:1,
          pageSize:10,
          total:0
        },
        searchHandle:[//搜索按钮
          {label:'查询',icon:"el-icon-search",type:'primary',handle:()=>this.searchNews()},
        ],
        searchData:{// 查询表单
          carNumber:null,
          carMsg:null,
          station:null,
          checkType:null
        },
        searchForm:[//搜索栏
          {type:'Input',prop:'carNumber',width:'180px',placeholder:'请输入车牌'},
          {type:'Input',prop:'carMsg',width:'180px',placeholder:'请输入车系'},
          {type:'Input',prop:'station',width:'180px',placeholder:'请输入维修站'},
          {type:'Select',prop:'checkType',width:'180px',options:checkTypes,props:checkTypeProps,placeholder:'请选择业务类型'},
        ],
        editCfg:[// 编辑form表单
          {label:'车牌',prop:'carNumber',type:'input',width:'280px'},
          {label:'车系',prop:'carMsg',type:'input',width:'280px'},
          {label:'维修站',prop:'station',type:'input',width:'280px'},
          {label:'下单时间',prop:'inputTime',type:'dateTime',width:'280px'},
          {label:'业务类型',prop:'checkType',type:'select',options:checkTypes,props:checkTypeProps,width:'280px'}
        ],
        editData:{// 编辑form数据
          carNumber:null,
          carMsg:null,
          station:null,
          checkType:null,
          inputTime : null
        },
        redordCols : [//操作记录表头
          {label:'操作人',prop:'userName'},
          {label:'操作内容',prop:'remarks'},
          {label:'操作时间',prop:'inputTime'},
        ],


        tableData : [],// 表格数据
        newBtnList:[],// 按钮列表
        checkButtonList : [],
        reviewButtonList : [],
        remarkButtonList : [],

        tableCols:[// 表头
          {label:'车牌',prop:'carNumber'},
          {label:'车辆信息',type:'longData'},
          {label:'下单时间',prop:'inputTime'},
          {label:'业务类型',prop:'checkType'},
          {label:'故障描述',prop:'note'},
          {label:'发动机数量',prop:'carCylinder'},
          {label:'检测报告',type:'checkButton',},
          {label:'复查报告',type:'reviewButton',},
          {label:'备注',type:'remarkButton',},
          {label:'操作记录',type:'Button',btnList:[
              {type:'success',label:'查看',handle:(row,that)=>this.showRecord(row,that)},
            ]},
        ],
        longDatas : [],

        orderPageShowOrgName : false,
        pageNo: 1,
        pageSize: 10,
        page: this.$route.params,

        redordData : [],
        isShowRecord : false,//操作记录弹窗
        editRules:{
          name:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ]
        },
        title : '',
        showEdit : false,//form弹窗

        aaa : ''

      }
    },
    components:{
      cesTable,
      SearchForm,
      operatingRecord,
      editForm,
    },
    methods : {
      // ...mapActions(['getData',]),
      record(jobId, step) {
        net
          .request("/admin/order/OperationMark", "post", {
            jobId: jobId,
            step: step
          })
          .then(res => {
            console.log(res);
          });
      },
      // 点击 查看检查报告
      showCheck (that,row) {
        console.log("点击了查看检查报告",row)
        this.record(row.jobId, 1);
        this.$router.push({
          name: "InitSurvey",
          params: {
            operId: 1,
            row: row.allData,
            pageNo: this.pagination.pageNum,
            pageSize: this.pagination.pageSize,
            carNumber: this.searchData.carNumber,
            enter: true,
            print: true
          }
        });
      },
      // 点击 查看复查报告
      showReview (row,that) {
        console.log("点击了查看复查报告",row,that)
        this.record(that.jobId, 2);
        this.$router.push({
          name: "recheck",
          params: {
            operId: 2,
            row: row.allData,
            pageNo: this.pagination.pageNum,
            pageSize: this.pagination.pageSize,
            carNumber: this.searchData.carNumber,
            enter: false
          }
        });
      },
      // 点击 备注项
      showRemark (row,that) {
        console.log("点击了备注项",row,that)
      },
      selectCheckType (row) {//类型下拉框
        console.log(row)
      },
      // 显示操作记录
      showRecord (row,that) {
        this.isShowRecord = true
        net
          .request("admin/order/queryOrderById", "post", { id: that.jobId })
          .then(res => {
            if (res.retcode == 1) {
              const data = res.data.list
              const redordData = []
              for (let i = 0; i < data.length; i++){
                redordData.push(
                  {
                    id : data[i].id,
                    userName : data[i].userName,
                    remarks : data[i].remarks,
                    inputTime : moment(data[i].inputTime).format('YYYY-MM-DD HH:MM'),
                  }
                )
              }
              this.redordData = redordData
            }else {
              net.message(this, res.retmsg, "warning");
            }

          });

        /*this.editData = {// 给弹窗赋值
          carNumber:that.carNumber,
          carMsg:that.carMsg,
          station:that.note,
          checkType:that.checkType,
          inputTime : that.inputTime
        }
        this.title = '车辆信息'
        this.showEdit = true*/
      },
      //关闭弹窗
      closeTip() {
        console.log("关闭弹窗")
        this.isShowRecord = false// 关闭操作记录弹窗
        this.showEdit = false// 关闭form表单弹窗
        // this.editData = {}      // 清空form表单编辑弹窗
        this.redordData = []
      },
      // 提交弹窗内容
      handleSubmit(){
        const aaa = this.editData
        console.log('点击了确定',aaa)
      },

    // 获取表格数据
      getlistData(param, data) {
        this.tableData = []
        net
          .request("admin/order/queryListPage", "post", param, data)
          .then(res => {
            if (res.retcode == 1) {
              // this.listData = res.data.rows;
              // this.pagination.total = res.data.total;
              const pagination = {
                pageSize : res.data.pageSize,
                pageNum : res.data.pageNo,
                total : res.data.total,
              }
              this.pagination = pagination
            } else {
              net.message(this, "获取数据失败", "warning");
            }
            // console.log(res);
            const tableArr = []
            const carMsgArr = []
            const data = res.data.rows
            console.log(data)
            //封装表格数据
            for (let i = 0; i< data.length; i++){
              tableArr.push({
                    id:i +1,
                    carNumber:data[i].carNumber,//车牌
                    inputTime:moment(data[i].inputTime).format('YYYY-MM-DD HH:MM'),//下单时间
                    checkType:data[i].checkType === 1 ? '检测' : (data[i].checkType === 3 ? '治疗+检测' : '治疗'),//业务类型
                    checkTypeId : data[i].checkType,
                    note:data[i].note,//故障描述
                    carCylinder:data[i].carCylinder,//发动机缸数
                    //车辆信息
                    factoryName:data[i].factoryName,
                    seriesName:data[i].seriesName,
                    modelName:data[i].modelName,

                    jobCode : data[i].jobCode,
                    jobId : data[i].jobId,
                    allData : data[i],
                })
              carMsgArr.push({//封装车辆信息格式
                    id : i+1,
                    note:[
                      data[i].factoryName,
                      data[i].seriesName,
                      data[i].modelName,
                    ]
              })
            }
            this.tableData = tableArr
            this.longDatas = carMsgArr

            // 按钮的显示隐藏
            const checkButtonArr = []
            const checkButtonList = []// 二维数组
            const reviewButtonArr = []
            const reviewButtonList = []
            const remarkButtonArr = []
            const remarkButtonList = []
            for (let i = 0; i < tableArr.length; i++) {
              if(tableArr[i].checkTypeId === 1 || tableArr[i].checkTypeId === 3) {// 控制显示隐藏的条件    1-&#45;&#45;检测 2&#45;&#45;&#45;&#45;治疗  3 &#45;&#45;&#45;&#45;检测+治疗
                checkButtonArr.push({id:i,type:'primary',label:'查看检测报告',isShow: true,size:'small ', handle:(row,that)=>this.showCheck(row,that)})
              }else {
                checkButtonArr.push({id:i,type:'primary',label:'查看检测报告',isShow: false,})
              }
              if(tableArr[i].jobCode === 1000){
                reviewButtonArr.push({id:i,type:'warning',label:'查看复查报告',isShow: true, handle:(row,that)=>this.showReview(row,that)})
              }else {
                reviewButtonArr.push({id:i,type:'warning',label:'查看复查报告',isShow: false,} )
              }
              if(tableArr[i].jobCode === 1000 || tableArr[i].jobCode === 1010){
                remarkButtonArr.push({id:i,type:'success',label:'备注项',isShow: true, handle:(row,that)=>this.showRemark(row,that)})
              }else {
                remarkButtonArr.push({id:i,type:'success',label:'备注项',isShow: false,} )
              }
            }
            // 封装按钮格式
            let reviewArr = [] //一维数组（长度为2）
            let checkArr = []
            let remarkArr = []
            checkButtonArr.forEach((c,index) => {
              if (checkArr.length === 1) {//如果小数组已经满了，创建一个新的  （两个为一组）
                checkArr = []
              }
              if(checkArr.length === 0) {//如果minArr是空的，将小数组保存到大数组中
                checkButtonList.push({
                  id : index  +1,
                  btnList : checkArr
                })
              }
              checkArr.push(c)//将当前分类保存到小数组中
            })
            reviewButtonArr.forEach((c,index) => {
              if (reviewArr.length === 1) {//如果小数组已经满了，创建一个新的  （两个为一组）
                reviewArr = []
              }
              if(reviewArr.length === 0) {//如果minArr是空的，将小数组保存到大数组中
                reviewButtonList.push({
                  id : index  +1,
                  btnList : reviewArr
                })
              }
              reviewArr.push(c)//将当前分类保存到小数组中
            })
            remarkButtonArr.forEach((c,index) => {
              if (remarkArr.length === 1) {//如果小数组已经满了，创建一个新的  （两个为一组）
                remarkArr = []
              }
              if(remarkArr.length === 0) {//如果minArr是空的，将小数组保存到大数组中
                remarkButtonList.push({
                  id : index  +1,
                  btnList : remarkArr
                })
              }
              remarkArr.push(c)//将当前分类保存到小数组中
            })
            this.checkButtonList = checkButtonList
            this.reviewButtonList = reviewButtonList
            this.remarkButtonList = remarkButtonList

          });
      },

    //翻页
      CurrentChange(val){
        console.log(val)
        this.pagination.pageNum = val;
        this.getlistData(
          { pageNo: val, pageSize: this.pagination.pageSize },
          {
            type: 9,
            carNumber: this.searchData.carNumber,
            orgName: this.searchData.carMsg,
            seriesName: this.searchData.station,
            checkType: this.searchData.checkType
          }
        );
      },
    //选择 每页显示数量
      SizeChange(val){
        this.pagination.pageSize = val;
        this.getlistData(
          { pageNo: this.pagination.pageNum, pageSize: val },
          {
            type: 9,
            carNumber: this.searchData.carNumber,
            orgName: this.searchData.carMsg,
            seriesName: this.searchData.station,
            checkType: this.searchData.checkType
          }
        );
      },
      //查询
      searchNews(){
        const carNumber = this.searchData.carNumber
        const carMsg = this.searchData.carMsg
        const station = this.searchData.station
        const checkType = this.searchData.checkType
        console.log(carNumber,carMsg,station,checkType)
        // this.getlistData(
        //   { pageNo: 1, pageSize: 10 },
        //   {
        //     type: 9,
        //     carNumber: carNumber,
        //     orgName: carMsg,
        //     seriesName: station,
        //     checkType: checkType
        //   }
        // );
      }

    },
    created () {
      // this.$store.dispatch('recordBtnList')//提交一个事件
      const signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
      this.orderPageShowOrgName = signInfo.orgId == 0;
      let flag = localStorage.getItem("orgSearch");
      if (flag) {
        this.orgSearch = flag;
      }
      if (this.page.pageNo == undefined) {
        this.getlistData(
          { pageNo: this.pageNo, pageSize: this.pageSize },
          { type: 9, orgName: flag ? localStorage.getItem("orgSearch") : "" }
        );
      } else {
        this.getlistData(
          { pageNo: this.page.pageNo, pageSize: this.page.pageSize },
          {
            type: 9,
            carNumber: this.page.carNumber,
            orgName: flag ? localStorage.getItem("orgSearch") : ""
          }
        );
      }

    },
    computed : {
      // ...mapState(['searchData','searchForm',
      //   'editCfg','editData',
      //   'redordCols',
      //   // 'tableData','newBtnList','checkButtonList','reviewButtonList','remarkButtonList'
      // ]), //读数据

      // this.aaa = searchForm
    },
  }


</script>

<style>

</style>-->


<!--待检测工单-->
<!--

<template>
    <div class="ces-main">
        <search-form
                size='medium '
                labelWidth = '80px'
                :searchData = "searchData"
                :searchForm = "searchForm"
                :searchHandle="searchHandle">
        </search-form>
        <ces-table
                :that='that'
                size='small '
                :isSelection='true'
                :isIndex='true'
                :isHandle='true'
                :tableData='tableData'
                :tableCols='tableCols'
                :newBtnList="newBtnList"
                :isPagination='true'
                :tablePage='pagination'
                @CurrentChange = 'CurrentChange'
                @SizeChange = 'SizeChange'
                :longDatas="longDatas"
        >
        </ces-table>
    </div>
</template>

<script>
  import net from "../../assets/js/public";
  import SearchForm from './searchForm'
  import cesTable from './compomentTable'
  import moment from 'moment'
  export default {
    data () {
      return {
        that : this,
        // 查询表单
        searchData:{
          carNumber:null,
        },
        searchForm:[//搜索栏
          {type:'Input',prop:'carNumber',width:'180px',placeholder:'请输入车牌'},
        ],
        searchHandle:[//搜索按钮
          {label:'查询',icon:"el-icon-search",type:'primary',handle:()=>this.searchNews()},
        ],
        tableData : [],// 表格数据
        newBtnList:[],// 按钮列表
        tableCols:[// 表头
          {label:'车牌',prop:'carNumber'},
          {label:'车辆信息',type:'longData'},
          {label:'下单时间',prop:'inputTime'},
          {label:'业务类型',prop:'checkType'},
          {label:'故障描述',prop:'note'},
          {label:'发动机缸数量',prop:'carCylinder'},
          {label:'操作记录',type:'button',}],
        longDatas : [],
        pagination:{//页数...
          pageSize:10,
          pageNum:1,
          total:0
        },
        orderPageShowOrgName : false,
        page: this.$route.params,
      }
    },
    components:{
      cesTable,
      SearchForm,
    },
    methods : {
      // 获取表格数据
      getlistData(param, data) {
        this.tableData = []
        net
          .request("admin/order/queryListPage", "post", param, data)
          .then(res => {
            if (res.retcode == 1) {
              const pagination = {
                pageSize : res.data.pageSize,
                pageNum : res.data.pageNo,
                total : res.data.total,
              }
              this.pagination = pagination
            } else {
              net.message(this, "获取数据失败", "warning");
            }
            const tableArr = []
            const carMsgArr = []
            const data = res.data.rows
            console.log(data)
            //封装表格数据
            for (let i = 0; i< data.length; i++){
              tableArr.push({
                id:i +1,
                carNumber:data[i].carNumber,//车牌
                inputTime:moment(data[i].inputTime).format('YYYY-MM-DD HH:MM'),//下单时间
                checkType:data[i].checkType === 1 ? '检测' : (data[i].checkType === 3 ? '治疗+检测' : '治疗'),//业务类型
                checkTypeId : data[i].checkType,
                note:data[i].note,//故障描述
                carCylinder:data[i].carCylinder,//发动机缸数
                jobCode : data[i].jobCode,
                //车辆信息
                factoryName:data[i].factoryName,
                seriesName:data[i].seriesName,
                modelName:data[i].modelName,
                jobId : data[i].jobId,

                allData : data[i],
              })
              carMsgArr.push({//封装车辆信息格式
                id : i+1,
                note:[
                  data[i].factoryName,
                  data[i].seriesName,
                  data[i].modelName,
                ]
              })
            }
            this.tableData = tableArr
            this.longDatas = carMsgArr

            // 按钮的显示隐藏
            const checkButtonArr = []
            const checkButtonList = []// 二维数组
            for (let i = 0; i < tableArr.length; i++) {
              checkButtonArr.push(
                {type:'success',label:'开始检测',isShow: true,size:'small ', handle:(that,row)=>this.start(that,row)},
                {type:'danger',label:'冻结工单',isShow: true,size:'small ', handle:(that,row)=>this.stop(that,row)}
                )
            }
            // 封装按钮格式
            let checkArr = []
            checkButtonArr.forEach((c,index) => {
              if (checkArr.length === 2) {//如果小数组已经满了，创建一个新的  （两个为一组）
                checkArr = []
              }
              if(checkArr.length === 0) {//如果minArr是空的，将小数组保存到大数组中
                checkButtonList.push({
                  id : index/2 +1,
                  btnList : checkArr
                })
              }
              checkArr.push(c)//将当前分类保存到小数组中
            })
            this.newBtnList = checkButtonList

          });
      },

      //翻页
      CurrentChange(val){
        this.pagination.pageNum = val;
        this.getlistData(
          { pageNo: val, pageSize: this.pagination.pageSize },
          { type: 1 }
        );
      },
      //选择 每页显示数量
      SizeChange(val){
        this.pagination.pageSize = val;
        this.getlistData(
          { pageNo: this.pagination.pageNum, pageSize: val },
          { type: 1 }
        );

      },
      //查询
      searchNews(){
        this.getlistData(
          { pageNo: this.pagination.pageNum, pageSize: this.pagination.pageSize },
          { carNumber: this.searchData.carNumber, type: 1 }
        );
      },
      //开始检测
      start(that,row){
        net
          .request("admin/order/startTesting", "post", {
            jobId: row.jobId,
            version: row.allData.version
          })
          .then(res => {
            if (res.retcode == 1) {
              net.message(this, res.retmsg, "success");
              var skip = net.isJump("/waitOrder");
              if (skip) {
                this.$router.push({ path: "/onloadPic" });
              } else {
                this.getlistData(
                  { pageNo: this.pagination.pageNum, pageSize: this.pagination.pageSize },
                  { type: 1 }
                );
              }
            } else {
              net.message(this, res.retmsg, "warning");
            }
          });
      },
      //冻结工单
      stop(that,row){
        console.log(that,row)
        this.$confirm("此操作将冻结此工单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          net
            .request("admin/abnormalOrder/frozenByUser", "post", {
              jobId: row.jobId,
              version: row.allData.version
            })
            .then(res => {
              if (res.retcode == 1) {
                net.message(this, "操作成功", "success");
                this.getlistData(
                  { pageNo: this.pagination.pageNum, pageSize: this.pagination.pageSize },
                  { carNumber: this.searchData.carNumber, type: 1 }
                );
              }
            });
        });
      }

    },
    created () {
      var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
      this.orderPageShowOrgName = signInfo.orgId == 0;
      this.getlistData(
        { pageNo: this.pagination.pageNum, pageSize: this.pagination.pageSize },
        { type: 1 }
      );
    },
    computed : {
    },
  }


</script>

<style>

</style>
-->

<!--待上传照片-->

<template>
    <div class="ces-main">
        <search-form
                size='medium '
                labelWidth = '80px'
                :searchData = "searchData"
                :searchForm = "searchForm"
                :searchHandle="searchHandle">
        </search-form>
        <ces-table
                :that='that'
                size='small '
                :isSelection='true'
                :isIndex='true'
                :isHandle='true'
                :tableData='tableData'
                :tableCols='tableCols'
                :newBtnList="newBtnList"
                :isPagination='true'
                :tablePage='pagination'
                :longDatas="longDatas"
        >
        </ces-table>

    </div>
</template>

<script>
  import net from "../../assets/js/public";
  import SearchForm from './searchForm'
  import cesTable from './compomentTable'
  import moment from 'moment'
  export default {
    data () {
      return {
        that : this,
        // 查询表单
        searchData:{
          carNumber:null,
        },
        searchForm:[//搜索栏
          {type:'Input',prop:'carNumber',width:'180px',placeholder:'请输入车牌'},
        ],
        searchHandle:[//搜索按钮
          {label:'查询',icon:"el-icon-search",type:'primary',handle:()=>this.searchNews()},
        ],
        tableData : [],// 表格数据
        tableCols:[// 表头
          {label:'车牌',prop:'carNumber'},
          {label:'车辆信息',type:'longData'},
          {label:'下单时间',prop:'inputTime'},
          {label:'业务类型',prop:'checkType'},
          {label:'故障描述',prop:'note'},
          {label:'发动机缸数量',prop:'carCylinder'},
          {label:'当前操作人',prop:'operatorName'},
          {label:'操作',type:'button',},
          {label:'冻结',type:'Button',btnList:[
              {type:'danger',label:'冻结工单',handle:(row,that)=>this.showRecord(row,that)},
            ]},
         ],
        newBtnList:[],

      /*


          {id:1,carNumber:'粤B555'},
          {id:2,carNumber:'粤B555'},
          {id:3,carNumber:'粤B555'},

      {id : 1,btnList:[
        {type:'primary',label:'上传照片',isShow:true, handle:(row,that)=>this.showEditTest(row,that)},
        {type:'success',label:'完成',isShow:false, handle:row=>''}
      ]
      },
      {id : 2,btnList:[
        {type:'primary',label:'上传照片',isShow:true, handle:(row,that)=>this.showEditTest(row,that)},
        {type:'success',label:'完成',isShow:false, handle:row=>''}
      ]
      },
      {id : 3,btnList:[
        {type:'primary',label:'上传照片',isShow:true, handle:(row,that)=>this.showEditTest(row,that)},
        {type:'success',label:'完成',isShow:false, handle:row=>''}
      ]
      },*/

      longDatas : [],
        pagination:{//页数...
          pageSize:10,
          pageNum:1,
          total:0
        },
        orderPageShowOrgName: false,
      }
    },
    components:{
      cesTable,
      SearchForm,
    },
    methods : {
      // 获取列表数据
      getlistData(param, data){
        net
          .request("admin/order/queryListPage", "post", param, data)
          .then(res => {
            console.log(res)
            if (res.retcode == 1) {
              const data = res.data.rows
              const carMsgArr = []
              const imgBtnArr = []
                for(let i = 0; i < data.length; i++){
                  data[i].inputTime = moment(data[i].inputTime).format('YYYY-MM-DD HH:MM')// 转换下单时间格式
                  data[i].id = i+1// 添加一个id
                  carMsgArr.push({//封装车辆信息格式
                    id : i+1,
                    note:[
                      data[i].factoryName,
                      data[i].seriesName,
                      data[i].modelName,
                    ]
                  })
                  if(data[i].jobCode == 20){
                    imgBtnArr.push(
                      {type:'primary',label:'上传照片',isShow:true, handle:(row,that)=>this.showEditTest(row,that)},
                      {type:'success',label:'完成',isShow:false,}
                    )
                  }
                if(data[i].jobCode == 30 || data[i].jobCode == 31 || data[i].jobCode == 32){
                    imgBtnArr.push(
                      {type:'primary',label:'上传照片',isShow:true, handle:(row,that)=>this.showEditTest(row,that)},
                      {type:'success',label:'完成',isShow:true, handle:(row,that)=>this.showEditTest(row,that)}
                    )
                  }

                }

              let minArr = []
              let imgBtnArrList = []
              console.log(imgBtnArr)
              imgBtnArr.forEach((c,index) => {
                if (minArr.length === 2) {//如果小数组已经满了，创建一个新的  （两个为一组）
                  minArr = []
                }
                if(minArr.length === 0) {//如果minArr是空的，将小数组保存到大数组中
                  imgBtnArrList.push({
                    id : index/2  +1,
                    btnList : minArr
                  })
                }
                minArr.push(c)//将当前分类保存到小数组中
              })

              console.log(data)
              console.log(carMsgArr)
              console.log(imgBtnArrList)

            this.tableData = data;
            this.longDatas = carMsgArr
            this.newBtnList = imgBtnArrList
            } else {
              net.message(this, "获取数据失败", "warning");
            }
          })
          .catch(res => {
            console.log(res)
          })
      },
      // 点击上传照片按钮
      showEditTest(row,that){
        console.log(row,that)
        this.$confirm("此操作将冻结此工单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            net.message(this, "操作成功", "success");
          for (let i=0;i<4;i++) {
            if(that.id === i){
              this.newBtnList[i-1].btnList[1].isShow = true
            }
          }
        });
      },
    },
    created() {
      var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
      this.orderPageShowOrgName = signInfo.orgId == 0;
      this.getlistData(
        { pageNo: this.pagination.pageNum, pageSize: this.pagination.pageSize },
        { type: 2 }
      );
    },
  }


</script>

<style>

</style>
