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
    <el-dialog title="上传照片" :visible.sync="onloadPicDialog" @click="closeDialog">
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
          <!--<span>车牌号：{{imgUploadTableData[0].carNumber}}</span>-->
          <span>车牌号：{{imgUploadTableData}}</span>
         <!-- <p>
            <span>车牌号：{{carCount}}</span>
            <span>车系：{{brandName}}</span>
            <span>车型：{{modelName}}</span>
          </p>
          <p>
            <span>燃油类型：{{fuelTypeName}}</span>
            <span>综合油耗：{{oilDeplete}}L/100km</span>
            <span>行驶里程：{{mile}}KM</span>
          </p>-->
         <!-- <div style="display:flex;flex-wrap: wrap;" v-show="this.jobCode==20">
            <el-select
                    v-model="chaizhuang"
                    placeholder="请选择拆装工程师"
                    clearable
                    style="margin-right:10px;margin-top:10px"
            >
              <el-option
                      v-for="item in chaizhuang_data"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
            <el-select
                    v-model="jiance"
                    placeholder="请选择检测工程师"
                    clearable
                    style="margin-right:10px;margin-top:10px"
            >
              <el-option
                      v-for="item in jiance_data"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
            <el-select
                    v-model="gendan"
                    placeholder="请选择跟单员"
                    clearable
                    style="margin-right:10px;margin-top:10px"
            >
              <el-option
                      v-for="item in gendan_data"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              ></el-option>
            </el-select>
          </div>-->
        </div>
       <!-- <div class="onlodList">
          <div class="perform">
            <div :class="{error:s1 == 2}" class="left">车牌号</div>
            <div class="right">
              &lt;!&ndash; headers="application/x-www-form-urlencoded" &ndash;&gt;
              <el-upload
                      style="display:inline-block"
                      :action="uploadUrl"
                      list-type="picture-card"
                      :data="{carNumber:carNumber,step:1,option:-1}"
                      :on-success="uploadSuccess.bind(this,-1,carPhotoId)"
                      :on-preview="handlePictureCardPreview"
                      :on-change="change.bind(this,-1)"
                      :on-remove="remove.bind(this,-1,carPhotoId,jobId,version)"
                      :file-list="fileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <div class="perform">
            <div class="left" :class="{error:s2 == 2}">车架号</div>
            <div class="right">
              <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      :on-success="uploadSuccess.bind(this,-11,framePhotoId)"
                      :data="{carNumber:carNumber,step:1,option:-11}"
                      :on-preview="handlePictureCardPreview"
                      :on-change="change.bind(this,-11)"
                      :on-remove="remove.bind(this,-11,framePhotoId,jobId,version)"
                      :file-list="fileList1"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <div class="perform" v-for="item in placeData" :key="item.id">
            <div class="left" :class="{error:item.isQualified == 2}">{{item.optionName}}</div>
            <div class="right">
              <el-upload
                      :action="uploadUrl"
                      list-type="picture-card"
                      :on-success="uploadSuccess.bind(this,item.optionId,item.photoId)"
                      :data="{carNumber:carNumber,step:1,option:item.optionId}"
                      :on-preview="handlePictureCardPreview"
                      :on-change="change.bind(this,item.id)"
                      :file-list="item.list"
                      :on-remove="remove.bind(this,item.optionId,item.photoId,jobId,version)"
                      :on-exceed="handleExceed"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </div>-->
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
      orderPageShowOrgName: false
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
    ...mapState(['imgUploadTableData', 'imgUploadPagination', 'imgUploadLongDatas', 'pageNo', 'pageSize', 'searchData', 'detectionImgUploadBtnArrList', 'onloadPicDialog'])// 读数据
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
      this.$store.state.onloadPicDialog = false
      // const data = this.$store.state.detectionImgUploadBtnArrList
      // for (let i = 0; i < data.length; i++) {
      //   if (row.jobId === data[i].jobId) {
      //     data[i].btnList[1].isShow = true
      //   }
      // }
    },
    closeDialog () {
      // this.$store.state.onloadPicDialog = false
      console.log('关闭')
    }
  }
}
</script>
<style lang='less'>
</style>

