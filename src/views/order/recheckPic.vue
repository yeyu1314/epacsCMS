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
            :newBtnList="recheckImgUploadBtnArrList"
    >
    </table-com>
    <el-dialog title="上传照片" :visible="recheckonloadPicDialog" @click="closeDialog" @close='close'>
      <div class="contentBody">
        <div class="carInfo">
          <p class="title" style="height:40px;">
            车辆信息：
            <el-button
                    @click="uploadImgs"
                    style="float:right;display:inline-block;"
                    type="primary"
            >确认上传</el-button>
          </p>
          
          <p>
            <span>车牌号：{{recheckonloadPicRow.carNumber}}</span>
            <span>车系：{{recheckonloadPicRow.seriesName}}</span>
            <span>车型：{{recheckonloadPicRow.modelName}}</span>
          </p>
          <p>
            <span>燃油类型：{{recheckrowCarInfo.fuelTypeName}}</span>
            <span>综合油耗：{{recheckrowCarInfo.oilDeplete}}L/100km</span>
            <span>行驶里程：{{recheckonloadPicRow.mile}}KM</span>
          </p>
        </div>
        <div style="display:flex;flex-wrap: wrap;width: 500px;margin-left: 100px;" v-show="recheckonloadPicRow.jobCode==600">
          <el-select
            v-model="chaizhuang"
            placeholder="请选择拆装工程师"
            clearable
            style="margin-right:10px;margin-top:10px"
          >
            
          </el-select>
          <el-select
            v-model="jiance"
            placeholder="请选择检测工程师"
            clearable
            style="margin-right:10px;margin-top:10px"
          >
            
          </el-select>
          <el-select
            v-model="gendan"
            placeholder="请选择跟单员"
            clearable
            style="margin-right:10px;margin-top:10px"
          >
            
          </el-select>
          <el-select
            v-model="zhiliao"
            placeholder="请选择治疗技师"
            clearable
            style="margin-right:10px;margin-top:10px"
          >
            
          </el-select>
        </div>
        <div class="recheckPicBox">
          <div class="onlodList">
            <div class="perform">
              <div class="left">车牌号</div>
              <div class="right">
                <el-upload
                  style="display:inline-block"
                  :action="uploadUrl"
                  list-type="picture-card"
                  :data="{carNumber:recheckonloadPicRow.carNumber,step:1,option:-1}"
                  :on-success="uploadSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-change="change.bind(this,-1)"
                  :on-remove="remove.bind(this,-1,carPhotoId,recheckonloadPicRow.jobId,recheckonloadPicRow.version)"
                  :file-list="fileList"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
            <div class="perform">
              <div class="left">车架号</div>
              <div class="right">
                <el-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :data="{carNumber:recheckrowCarInfo.carNumber,step:1,option:-11}"
                  :on-success="uploadSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-change="change.bind(this,-1)"
                  :on-remove="remove.bind(this,-1)"
                  :file-list="fileList"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
            <div class="perform" v-for="item in recheckrowCarInfo.list" :key="item.id">
              <div class="left">{{item.optionName}}</div>
              <div class="right">
                <el-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :on-success="uploadSuccess.bind(this,item.optionId,item.photoId)"
                  :data="{carNumber:recheckonloadPicRow.carNumber,step:1,option:item.optionId}"
                  :on-preview="handlePictureCardPreview"
                  :on-change="change.bind(this,item.id)"
                  :file-list="item.list"
                  :on-remove="remove.bind(this,item.optionId,item.photoId,recheckonloadPicRow.jobId,recheckonloadPicRow.version)"
                  :on-exceed="handleExceed"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </div>
          </div>
          <div style="margin-top:20px;margin-left:20px;">
              <div style="display:flex;justify-content: space-between;">
                <p
                  style="text-align: left;line-height: 36px;padding-left: 20px;font-weight: bold;font-size: 16px;"
                >产品用量</p>
                <el-button type="success" size="small" @click="addProductNumber">保存产品用量</el-button>
              </div>
              <div style="margin-top:15px;display:flex;flex-direction: row;">
                <div>
                  <el-checkbox-group
                    v-model="checkProList"
                    style="display:flex;flex-direction: column;"
                  >
                    <el-checkbox
                      style="margin-left: 20px;text-align: left;height: 42px;line-height: 42px;    margin-bottom: 1px;"
                      v-for="(item,index) in productArr"
                      :key="index"
                      :label="item.id"
                    >{{item.productName}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div>
                  <el-checkbox-group style="display:flex;flex-direction: column;margin-left:10px;">
                    <el-input-number
                      class="inputNumber"
                      :data-id="item.id"
                      style="margin-top: 6px;margin-bottom:5px;"
                      v-for="(item,index) in productArr"
                      :key="index"
                      :min="0"
                      v-model="dataModel[index].value1"
                      size="small"
                      label="描述文字"
                      :step="0.5"
                      @change="handleChange(item.id,dataModel[index].value1)"
                    ></el-input-number>
                  </el-checkbox-group>
                </div>
              </div>
              <!-- <div style="text-align: left;margin: 20px 0 0 23px;">
              <el-button type="success" size="small" @click="subUse">提交用量</el-button>
              </div>-->
            </div>
          </div>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible="recheckonloadPicDialog">
      {{recheckonloadPicRow}}---------------
      {{recheckrowCarInfo}}
    </el-dialog> -->
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
          type: 'button',
        },
        {
          label: '冻结',
          type: 'Button',
          btnList: [
            {type: 'danger', label: '冻结工单', handle: (that, row) => this.frozen(that, row)}
          ]
        }
      ],
      isShowRecord: false,
      chaizhuang: '',
      jiance: '',
      gendan: '',
      zhiliao: '',
      imageUrl: '',
      uploadUrl: '',
      fileList: [],
      carPhotoId: undefined,
      productArr: [],
      checkProList: [],
    }
  },
  created() {
    this.getRecheckPicList()
  },
  computed: {
    ...mapState(['recheckPicTableData', 'recheckPicLongData', 'recheckPicPagination', 'pageNo', 'pageSize', 'searchData', 
    'recheckImgUploadBtnArrList', 'recheckonloadPicRow', 'recheckonloadPicDialog', 'recheckrowCarInfo'])// 读数据
  },
  methods: {
    ...mapActions(['getRecheckPicList']),
    searchOrder () { // 查询
      this.getRecheckPicList()
    },
    uploadImgs () {
      console.log('确定上传')
      console.log(this.$store.state.detectionImgUploadBtnArrList)
      console.log(this.$store.state.rowCarInfo)
      const row = this.$store.state.rowCarInfo
      let param = {
        jobId: row.jobId,
        version: row.version,
        chaiZhuang: row.chaizhuang || 0,
        jianCe: row.jiance || 0,
        genDan: row.gendan || 0
      };
      if (row.jobCode == 20 && row.photoId == undefined) {
        param["jobCode"] = 30;
      }
      if (row.jobCode == 30 || row.jobCode == 31 || row.jobCode == 32) {
        param["jobCode"] = 31;
      }
      if (row.chaizhuang.length == 0 || row.jiance.length == 0 || row.gendan.length == 0) {
        let title = "";
        // if (row.chaizhuang.length == 0) {
        //   title += "拆装工程师 ";
        // }
        // if (row.jiance.length == 0) {
        //   title += " 检测工程师";
        // }
        // if (row.gendan.length == 0) {
        //   title += " 跟单员";
        // }
        if (row.jobCode == 20) {
          this.$confirm(
            <span>
              <p> 没有选择{title} 这样操作将会影响到对应人员的数据统计</p>
              <p style={{ color: "#f40" }}>请确认是否录入？</p>
            </span>,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).then(() => {
            // this.ensureUpload(param);
            console.log(param)
          });
        } else {
          // this.ensureUpload(param);
          console.log(param)
        }
      } else {
        // this.ensureUpload(param);
        console.log(param)
      }
      this.$store.state.recheckonloadPicDialog = false
    },
    close () { // 关闭弹窗
      this.$store.state.recheckonloadPicDialog = false
    },
    closeDialog () {
      // this.$store.state.onloadPicDialog = false
      console.log('关闭')
    },
    uploadSuccess(){
      console.log('aaa')
    },
    handlePictureCardPreview(){

    },
    change(){

    },
    remove() {

    },
    handleExceed() {

    },
    addProductNumber () {

    }
  }
}
</script>
<style lang='less'>
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
    // .bottonContent {
    //   display: flex;
    //   max-height: 500px;
    //   overflow-y: scroll;
      .onlodList {
        width: 40%;
        margin-left: 82px;
        padding: 5px 0;
        float: left;
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
    // }
  }
  .el-upload-list--picture-card:not(:empty) + .el-upload--picture-card {
    display: none;
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

