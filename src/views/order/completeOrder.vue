<!--
<template>
  <div>
    <div v-show="showTable">
      <div class="searchContent">
        <el-input placeholder="请输入车牌号" v-model="carPai" clearable></el-input>
        <el-input placeholder="请输入维修站" v-model="orgSearch" clearable @change="orgChange"></el-input>
        <el-input placeholder="请输入车系" v-model="carSeSearch" clearable></el-input>
        <el-select v-model="checkType" placeholder="请选择业务类型" clearable>
          <el-option label="全部" value="0"></el-option>
          <el-option label="检测" value="1"></el-option>
          <el-option label="治疗" value="2"></el-option>
          <el-option label="检测+治疗" value="3"></el-option>
        </el-select>
        <el-button
          type="primary"
          style="background: #009688;margin-left:15px;"
          @click="search"
          icon="el-icon-search"
        >搜索</el-button>
      </div>
      <div>
        <el-table :data="listData" border style="width: 99%">
          <el-table-column prop="carNumber" label="车牌" align="center"></el-table-column>
          <el-table-column label="车辆信息" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.factoryName}}</span>
              <br />
              <span>{{scope.row.seriesName}}</span>
              <br />
              <span>{{scope.row.modelName}}</span>
              <br />
            </template>
          </el-table-column>
          <el-table-column
            prop="inputTime"
            align="center"
            label="下单时间"
            color="#f40"
            :formatter="formartTime"
          ></el-table-column>
          <el-table-column
            prop="orgName"
            align="center"
            label="下单站点"
            v-if="this.orderPageShowOrgName"
          ></el-table-column>
          <el-table-column align="center" label="业务类型">
            <template slot-scope="scope">
              <span>{{scope.row.checkType | type}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" align="center" label="故障描述"></el-table-column>
          <el-table-column prop="carCylinder" align="center" label="发动机缸数量"></el-table-column>
          <el-table-column label="检测报告" align="center" width="125">
            <template slot-scope="scope">
              <el-button
                @click="seeFirstReport(scope.row)"
                type="primary"
                size="small"
                :class="scope.row.step1 == 1 ? 'classB' : 'classA'"
                v-show="(scope.row.jobCode==1000 && scope.row.checkType !=2)|| (scope.row.jobCode==1010 && scope.row.checkType !=2)  || (scope.row.jobCode==1002&& scope.row.checkType !=2) || (scope.row.jobCode==1003&& scope.row.checkType !=2) ||  (scope.row.jobCode==1005&& scope.row.checkType !=2)"
              >查看检测报告</el-button>
            </template>
          </el-table-column>
          <el-table-column label="复查报告" align="center" width="125">
            <template slot-scope="scope">
              <el-button
                @click="seeRecheckReport(scope.row)"
                type="warning"
                size="small"
                :class="scope.row.step2 == 1 ? 'classB' : 'classA'"
                v-show="scope.row.jobCode==1000"
              >查看复查报告</el-button>
              <span v-show="scope.row.jobCode==1010">异常完成无报告</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" width="125">
            <template slot-scope="scope">
              <el-button
                @click="seeProUse(scope.row)"
                type="success"
                size="small"
                v-show="scope.row.jobCode==1000 || scope.row.jobCode==1010"
              >备注项</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作记录" align="center" width="140">
            <template slot-scope="scope">
              <el-button @click="lockOver(scope.row)" type="success" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
        <span v-show="isUse">暂无产品用料</span>
        <div v-show="!isUse">
          <el-table :data="seeProArr" border style="width: 100%">
            <el-table-column prop="productName" label="产品名" align="center"></el-table-column>
            <el-table-column prop="number" label="数量" align="center"></el-table-column>
          </el-table>
        </div>
        &lt;!&ndash; <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>&ndash;&gt;
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible3" width="700px">
        <div style="width:100%">
          <el-table :data="seeArr" height="450" border style="width: 100%">
            <el-table-column prop="userName" label="操作人"></el-table-column>
            <el-table-column prop="remarks" label="操作内容"></el-table-column>
            <el-table-column prop="inputTime" :formatter="dateFormat" label="操作时间"></el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      orderPageShowOrgName: false,
      listData: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      dialogVisible: false,
      jobId: "",
      jobCode: "",
      orgId: "",
      showRecheck: false,
      showFirstReport: false,
      showTable: true,
      //参数
      placeData: [],
      carCount: "",
      brandName: "",
      modelName: "",
      fuelTypeName: "",
      mile: "",
      seeProArr: [],
      isUse: false,
      carPai: null,
      orgSearch: null,
      carSeSearch: null,
      checkType: null,
      dialogVisible3: false,
      seeArr: [],
      switchPage: true,
      page: this.$route.params
    };
  },
  created() {
    var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
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
      this.pageSize = this.page.pageSize;
      this.pageNo = this.page.pageNo;
      this.carPai = this.page.carNumber;
    }
  },
  filters: {
    type(d) {
      var arr = ["", "检测", "治疗", "检测+治疗"];
      return arr[d];
    }
  },
  methods: {
    formartTime(row) {
      return net.dateFormat(row.inputTime, 1);
    },
    orgChange(value) {
      if (value.length == 0) {
        localStorage.removeItem("orgSearch");
      }
    },
    seeProUse(row) {
      this.dialogVisible = true;
      net
        .request("admin/order/queryProductInfoList", "post", {
          jobId: row.jobId
        })
        .then(res => {
          if (res.retcode == 1) {
            var data = res.data.rows;
            var list = [];
            for (var i = 0; i < data.length; i++) {
              if (data[i].number != 0) {
                list.push(data[i]);
              }
            }
            if (list.length == 0) {
              this.isUse = true;
            } else {
              8;
              this.seeProArr = list;
            }
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    getlistData(param, data) {
      net
        .request("admin/order/queryListPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.listData = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
          console.log(res);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          type: 9,
          carNumber: this.carPai,
          orgName: this.orgSearch,
          seriesName: this.carSeSearch,
          checkType: this.checkType
        }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          type: 9,
          carNumber: this.carPai,
          orgName: this.orgSearch,
          seriesName: this.carSeSearch,
          checkType: this.checkType
        }
      );
    },
    // 查看检测报告
    seeFirstReport(row) {
      console.log(row)
      this.record(row.jobId, 1);
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 1,
          row: row,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          carNumber: this.carPai,
          enter: true,
          print: true
        }
      });
    },
    //查看复查报告
    seeRecheckReport(row) {
      this.record(row.jobId, 2);
      this.$router.push({
        name: "recheck",
        params: {
          operId: 2,
          row: row,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          carNumber: this.carPai,

          enter: false
        }
      });
    },
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
    search() {
      this.pageNo = 1;
      if (this.orgSearch != null && this.orgSearch.length !== 0) {
        localStorage.setItem("orgSearch", this.orgSearch);
      }
      (this.pageSize = 10),
        this.getlistData(
          { pageNo: this.pageNo, pageSize: this.pageSize },
          {
            type: 9,
            carNumber: this.carPai,
            orgName: this.orgSearch,
            seriesName: this.carSeSearch,
            checkType: this.checkType
          }
        );
    },
    //查看记录
    lockOver(row) {
      this.seeArr = [];
      this.dialogVisible3 = true;
      net
        .request("admin/order/queryOrderById", "post", { id: row.jobId })
        .then(res => {
          console.log(res.data.list)
          this.seeArr = res.data.list;
        });
    },
    dateFormat(row) {
      let time = net.dateFormat(row.inputTime);
      return time;
    }
  }
};
</script>
<style lang='less' scoped>
.searchContent {
  margin: 10px 0 20px 0;
  display: flex;
  flex-direction: row;
  .el-input&#45;&#45;suffix {
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

-->



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
            size='medium'
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

    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
      <span v-show="isUse">暂无产品用料</span>
      <div v-show="!isUse">
        <el-table :data="seeProArr" border style="width: 100%">
          <el-table-column prop="productName" label="产品名" align="center"></el-table-column>
          <el-table-column prop="number" label="数量" align="center"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import net from "../../assets/js/public";
  import SearchForm from '../form/searchForm'
  import cesTable from '../form/compomentTable'
  import operatingRecord from '../form/operatingRecord'
  import editForm from '../form/editForm'
  import moment from 'moment'
  export default {
    data () {
      let checkTypes=[{label:'全部',value:'0'},{label:'检测',value:'1'},{label:'治疗',value:'2'},{label:'检测+治疗',value:'3'}]
      let checkTypeProps={label:'label',value:'value'}
      return {
        that : this,
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
          {type:'Select',prop:'checkType',width:'180px',options:checkTypes,props:checkTypeProps,change:row=>this.selectCheckType(row),placeholder:'请选择业务类型'},
        ],
        searchHandle:[{label:'查询',icon:"el-icon-search",type:'primary',handle:()=>this.searchNews()},],//搜索按钮
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
        pagination:{
          pageSize:10,
          pageNum:1,
          total:0
        },
        orderPageShowOrgName : false,
        pageNo: 1,
        pageSize: 10,
        page: this.$route.params,
        redordCols : [
          {label:'操作人',prop:'userName'},
          {label:'操作内容',prop:'remarks'},
          {label:'操作时间',prop:'inputTime'},
        ],
        redordData : [],
        isShowRecord : false,//操作记录弹窗
        editCfg:[
          {label:'车牌',prop:'carNumber',type:'input',width:'280px'},
          {label:'车系',prop:'carMsg',type:'input',width:'280px'},
          {label:'维修站',prop:'station',type:'input',width:'280px'},
          {label:'下单时间',prop:'inputTime',type:'dateTime',width:'280px'},
          {label:'业务类型',prop:'checkType',type:'select',options:checkTypes,props:checkTypeProps,width:'280px'}
        ],
        editData:{
          carNumber:null,
          carMsg:null,
          station:null,
          checkType:null,
          inputTime : null
        },
        editRules:{
          name:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ]
        },
        title : '',
        showEdit : false,//form弹窗
        dialogVisible : false,//备注弹窗
        isUse : false,
        seeProArr : [],
      }
    },
    components:{
      cesTable,
      SearchForm,
      operatingRecord,
      editForm,
    },
    methods : {
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
      showReview (that,row) {
        console.log("点击了查看复查报告",that,row.jobId)
        this.record(row.jobId, 2);
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
        this.dialogVisible = true;
        net
            .request("admin/order/queryProductInfoList", "post", {
              jobId: that.jobId
            })
            .then(res => {
              if (res.retcode == 1) {
                var data = res.data.rows;
                var list = [];
                for (var i = 0; i < data.length; i++) {
                  if (data[i].number != 0) {
                    list.push(data[i]);
                  }
                }
                if (list.length == 0) {
                  this.isUse = true;
                } else {
                  8;
                  this.seeProArr = list;
                }
              } else {
                net.message(this, res.retmsg, "warning");
              }
            });
      },
      // 类型下拉框
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
        this.editData = {}      // 清空form表单编辑弹窗
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
                  const reviewButtonArr = []
                  const reviewButtonList = []
                  const remarkButtonArr = []
                  const remarkButtonList = []
                  for (let i = 0; i < tableArr.length; i++) {
                    if(tableArr[i].checkTypeId === 1 || tableArr[i].checkTypeId === 3) {// 控制显示隐藏的条件    1---检测 2----治疗  3 ----检测+治疗
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
                    if (reviewArr.length === 1) {
                      reviewArr = []
                    }
                    if(reviewArr.length === 0) {
                      reviewButtonList.push({
                        id : index  +1,
                        btnList : reviewArr
                      })
                    }
                    reviewArr.push(c)
                  })
                  remarkButtonArr.forEach((c,index) => {
                    if (remarkArr.length === 1) {
                      remarkArr = []
                    }
                    if(remarkArr.length === 0) {
                      remarkButtonList.push({
                        id : index  +1,
                        btnList : remarkArr
                      })
                    }
                    remarkArr.push(c)
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
                  orgName: this.searchData.station,
                  seriesName: this.searchData.carMsg,
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
                  orgName: this.searchData.station,
                  seriesName: this.searchData.carMsg,
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
        this.getlistData(
                { pageNo: 1, pageSize: 10 },
                {
                  type: 9,
                  carNumber: carNumber,
                  orgName: station,// 维修站
                  seriesName: carMsg,// 车系
                  checkType: checkType
                }
        );
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
      // ...mapState(['tableData','newBtnList']), //读数据
    },
  }


</script>

<style>

</style>
