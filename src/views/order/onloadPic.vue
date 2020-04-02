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
          <div style="display:flex;flex-wrap: wrap;" v-show="onloadPicRow.jobCode==20">
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
            <div :class="{error:onloadPics1 == 2}" class="left">车牌号</div>
            <div class="right">
              <el-upload
                style="display:inline-block"
                :action="uploadUrl"
                list-type="picture-card"
                :data="{carNumber:onloadPicRow.carNumber,step:1,option:-1}"
                :on-success="uploadSuccess.bind(this,-1,conloadPicCarPhotoId)"
                :on-preview="handlePictureCardPreview"
                :on-change="change.bind(this,-1)"
                :on-remove="remove.bind(this,-1,conloadPicCarPhotoId,onloadPicRow.jobId,onloadPicRow.version)"
                :file-list="onloadPicFileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <div class="perform">
            <div :class="{error:onloadPics2 == 2}" class="left">车架号</div>
            <div class="right">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :data="{carNumber:onloadPicRow.carNumber,step:1,option:-11}"
                :on-success="uploadSuccess.bind(this,-11,onloadPicFramePhotoId)"
                :on-preview="handlePictureCardPreview"
                :on-change="change.bind(this,-11)"
                :on-remove="remove.bind(this,-11,onloadPicFramePhotoId,onloadPicRow.jobId,onloadPicRow.version)"
                :file-list="onloadPicFileList1"
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
    <el-dialog :visible="dialogVisible1" @close='close1'>
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-dialog
      :visible="progressBar"
      title="AI正在识别运算"
      custom-class="hello"
      :center="true"
      :showClose="false"
      :closeOnClickModal="false"
      :closeOnPressEscape="false"
    >
      <div style="text-align:center">
        <div style="height:50px">
          <el-progress
            :percentage="used"
            :text-inside="loadProgress"
            status="exception"
            :stroke-width="18"
          />
        </div>
        <img src="../../assets/img/ai.gif" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import net from "../../assets/js/public"
import $ from "jquery"
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import {frozenOrder, finshUpload, ensureUploadImgList, deletePhoto} from '../../api'
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
      uploadUrl: net.imageHP + "import/upload",
      fileList: [],
      carPhotoId: undefined,
      framePhotoId: undefined,
      dialogVisible1: false,
      dialogImageUrl: '',
      used : 0,
      loadProgress: false,
    }
  },
  created () {
    this.getDetectionImgUploadList()
    this.$store.state.progressBar = false
  },
  components: {
    tableCom,
    searchCom
  },
  computed: {
    ...mapState(['imgUploadTableData', 'imgUploadPagination', 'imgUploadLongDatas', 'pageNo', 'pageSize', 'searchData', 'detectionImgUploadBtnArrList',
    'onloadPicDialog', 'onloadPicRow', 'rowCarInfo', 'onLoadPicPhotoList', 'onloadPicFileList', 'onloadPicFileList1', 'conloadPicCarPhotoId', 'onloadPicFramePhotoId',
    'onloadPics1', 'onloadPics2', 'progressBar', ])// 读数据
  },
  watch: {
    // 如果 `showEditPage` 发生改变，这个函数就会运行
    progressBar: function (progressBar) {
      if(progressBar === true) {
        this.finshUpload()
      }
    }
  },
  filters: {
    type(d) {
      const arr = ["", "检测", "治疗", "检测+治疗"];
      return arr[d];
    }
  },
  methods: {
    ...mapActions(['getDetectionImgUploadList']),

    finshUpload() { // 完成上传
      this.loadProgress = true
      const that = this
      const param = {
        jobId: that.$store.state.onloadPicRow.jobId,
        version: that.$store.state.onloadPicRow.version
      }
      finshUpload(param).then(res => {
        if (res.retcode === 1) {
          let dsq = setInterval(function () {
            that.used = that.used + 1
            if (that.used >= 100) {
              clearInterval(dsq);
              net.message(that, "AI已经识别,可继续录入数据", "success");
              const skip = net.isJump("/firstReport");
              if (skip) {
                that.$router.push({path: "/firstReport"});
              } else {
                this.getDetectionImgUploadList()
              }
              that.$store.state.progressBar = false;
            }
          }, 50);
        } else {
          net.message(this, res.retmsg, "error");
          that.$store.state.progressBar = false;
        }
      });
    },

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
                  this.getDetectionImgUploadList()
                }).catch(res => {
          console.log(res)
          this.getDetectionImgUploadList()
        })
      })
    },

    uploadImgs () {// 确认上传
      const row = this.$store.state.onloadPicRow
      let param = {
        jobId: row.jobId,
        version: row.version,
        chaiZhuang: this.chaizhuang || 0,
        jianCe: this.jiance || 0,
        genDan: this.gendan || 0
      };
      console.log(row,param)
      if (row.jobCode == 20 && row.photoId == undefined) {
        param["jobCode"] = 30;
      }
      if (row.jobCode == 30 || row.jobCode == 31 || row.jobCode == 32) {
        param["jobCode"] = 31;
      }
      if (this.chaizhuang.length == 0 || this.jiance.length == 0 || this.gendan.length == 0) {
        let title = "";
        if (this.chaizhuang.length == 0) {
          title += "拆装工程师 ";
        }
        if (this.jiance.length == 0) {
          title += " 检测工程师";
        }
        if (this.gendan.length == 0) {
          title += " 跟单员";
        }
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
            this.ensureUpload(param);
            console.log(param)
          });
        } else {
          this.ensureUpload(param);
          console.log(param)
        }
      } else {
        this.ensureUpload(param);
      }
      this.$store.state.onloadPicDialog = false
    },

    ensureUpload(param) { //确认上传接口调取
      ensureUploadImgList(param, this.onLoadPicPhotoList).then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            this.version = res.data;
            this.dialogVisible = false;
            this.getDetectionImgUploadList()
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },

    close () { // 关闭弹窗
      this.$store.state.onloadPicDialog = false
    },

    close1 () { //关闭放大图片
      this.dialogVisible1 = false
    },

    closeDialog () {
      // this.$store.state.onloadPicDialog = false
      console.log('关闭')
    },

    uploadSuccess(optionId, photoId, response, file, fileList){ // 上传图片成功
      if (response.retcode !== 1) {
        net.message(this, response.retmsg, "error");
        return false;
      }
      this.$store.state.onLoadPicPhotoList.push({ optionId: optionId, photoId: response.data });
      // this.optionId = optionId;
      if (optionId === -1) {
        this.carPhotoId = response.data;
      } else if (optionId === -11) {
        this.framePhotoId = response.data;
      } else {
        const data = this.rowCarInfo
        for (let i = 0; i < data.list.length; i++) {
          const element = data.list[i];
          if (optionId === element.optionId) {
            data.list[i].photoId = response.data;
            this.$store.state.rowCarInfo.list.splice(i, 1, element);
          }
        }
      }
    },

    change(idx, file, fileList) {//监听改变
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },

    remove(optionID, photoID, jobID, version1) {// 移除图片的回调
      const param = {
        optionId: optionID,
        photoId: photoID,
        jobId: jobID,
        version: version1
      }
      deletePhoto(param, {}).then(res => {
          if (res.retcode == 1) {
            for (let i = 0; i < this.onLoadPicPhotoList.length; i++) {
              if (this.onLoadPicPhotoList[i].optionId == optionID) {
                this.onLoadPicPhotoList.splice(i, 1);
              }
            }
            net.message(this, "删除成功", "warning");
            this.version = res.data;
            setTimeout(() => {
              this.ctroOnloadBtn();
            }, 500);
          } else {
            net.message(this, "删除失败", "warning");
            setTimeout(() => {
              this.ctroOnloadBtn();
            }, 500);
          }
        });
    },

    handleExceed() {
      net.message(this, "同时上传限制一个图，请先删除前面上传的图片", "error")
    },

    handlePictureCardPreview(file) {//点击显示放大
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },

    ctroOnloadBtn() {//控制上传按钮显示
      const _this = this;
      $(".perform").each(function() {
        var btn = $(this)
                .children(".right")
                .children("div")
                .children(".el-upload--picture-card");
        var count = $(this)
                .children(".right")
                .children("div")
                .children(".el-upload-list--picture-card")
                .children().length;

        if (count == 0) {
          btn.show();
        }
        if (count > 0) {
          btn.hide();
          var del = $(this)
                  .children(".right")
                  .children("div")
                  .children(".el-upload-list--picture-card")
                  .children(".el-upload-list__item")
                  .children(".el-upload-list__item-actions")
                  .children(".el-upload-list__item-delete");
          if (_this.sign == 0) {
            del.hide();
          } else {
            del.show();
          }
        }
      });
    },

    reloadDia() {// 显示上传图片系列样式
      $(".perform").each(function () {
        const btn = $(this)
                .children(".right")
                .children("div")
                .children(".el-upload--picture-card");
        btn.show();
      })
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

