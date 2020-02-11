<!--带上传照片-->
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
      :tableData='imgUploadTableData'
      :tableCols='tableCols'
      :newBtnList="detectionImgUploadBtnArrList"
      :isPagination='true'
      :tablePage='imgUploadPagination'
      :longDatas="imgUploadLongDatas"
    >
    </table-com>
    <el-dialog title="上传照片" :visible="onloadPicDialog" @click="closeDialog" @close='close'>
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
            <span>车牌号：{{onloadPicRow.carNumber}}</span>
            <span>车系：{{onloadPicRow.seriesName}}</span>
            <span>车型：{{onloadPicRow.modelName}}</span>
          </p>
          <p>
            <span>燃油类型：{{rowCarInfo.fuelTypeName}}</span>
            <span>综合油耗：{{rowCarInfo.oilDeplete}}L/100km</span>
            <span>行驶里程：{{onloadPicRow.mile}}KM</span>
          </p>
          <div style="display:flex;flex-wrap: wrap;">
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
          </div>
        </div>
        <div class="onlodList">
          <div class="perform">
            <div class="left">车牌号</div>
            <div class="right">
              <el-upload
                style="display:inline-block"
                :action="uploadUrl"
                list-type="picture-card"
                :data="{carNumber:onloadPicRow.carNumber,step:1,option:-1}"
                :on-success="uploadSuccess"
                :on-preview="handlePictureCardPreview"
                :on-change="change.bind(this,-1)"
                :on-remove="remove.bind(this,-1,carPhotoId,onloadPicRow.jobId,onloadPicRow.version)"
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
                :data="{carNumber:onloadPicRow.carNumber,step:1,option:-11}"
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
          <div class="perform" v-for="item in rowCarInfo.list" :key="item.id">
            <div class="left">{{item.optionName}}</div>
            <div class="right">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="uploadSuccess.bind(this,item.optionId,item.photoId)"
                :data="{carNumber:onloadPicRow.carNumber,step:1,option:item.optionId}"
                :on-preview="handlePictureCardPreview"
                :on-change="change.bind(this,item.id)"
                :file-list="item.list"
                :on-remove="remove.bind(this,item.optionId,item.photoId,onloadPicRow.jobId,onloadPicRow.version)"
                :on-exceed="handleExceed"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import {frozenOrder} from '../../api'
import {mapActions, mapState} from 'vuex'
export default {
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
        {label: '业务类型', prop: 'checkType'},
        {label: '故障描述', prop: 'note'},
        {label: '发动机缸数量', prop: 'carCylinder'},
        {label: '当前操作人', prop: 'operatorName'},
        {label: '操作', type: 'button'},
        {
          label: '冻结',
          type: 'Button',
          btnList: [
            {type: 'danger', label: '冻结工单', handle: (that, row) => this.frozen(that, row)}
          ]
        }
      ],
      orderPageShowOrgName: false,
      chaizhuang: '',
      jiance: '',
      gendan: '',
      imageUrl: '',
      uploadUrl: '',
      fileList: [],
      carPhotoId: undefined,
    }
  },
  created () {
    this.getDetectionImgUploadList()
  },
  components: {
    tableCom,
    searchCom
  },
  computed: {
    ...mapState(['imgUploadTableData', 'imgUploadPagination', 'imgUploadLongDatas', 'pageNo', 'pageSize', 'searchData', 'detectionImgUploadBtnArrList',
    'onloadPicDialog', 'onloadPicRow', 'rowCarInfo'])// 读数据
  },
  methods: {
    ...mapActions(['getDetectionImgUploadList']),
    searchOrder () { // 查询
      this.getDetectionImgUploadList()
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
      this.$store.state.onloadPicDialog = false
      // const data = this.$store.state.detectionImgUploadBtnArrList
      // for (let i = 0; i < data.length; i++) {
      //   if (row.jobId === data[i].jobId) {
      //     data[i].btnList[1].isShow = true
      //   }
      // }
    },
    close () { // 关闭弹窗
      this.$store.state.onloadPicDialog = false
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
    border-top: 1px solid #bfbfbf;
    width: 80%;
    margin: 0 auto 0;
    padding: 5px 0;
    max-height: 450px;
    overflow-y: scroll;
    margin-top: 10px;
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
.el-upload-list--picture-card:not(:empty) + .el-upload--picture-card {
  display: none;
}
.hello {
  .el-dialog__title {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>

