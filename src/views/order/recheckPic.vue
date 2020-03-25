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
                  :on-success="uploadSuccess.bind(this,-2,recheckrowCarInfo.carPhotoId)"
                  :on-preview="handlePictureCardPreview"
                  :on-change="change.bind(this,-1)"
                  :on-remove="remove.bind(this,-1,carPhotoId,recheckonloadPicRow.jobId,recheckonloadPicRow.version)"
                  :file-list="frecheckrowFleList"
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
                      v-for="(item,index) in productItem"
                      :key="index"
                      :label="item.id"
                    >{{item.productName}}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div>
                  <el-checkbox-group style="display:flex;flex-direction: column;margin-left:10px;">
                    <el-input-number
                      class="inputNumber"
                      :data-id="item.id"
                      style="margin-top: 6px;margin-bottom:5px;"
                      v-for="(item,index) in productItem"
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
            </div>
          </div>
      </div>
    </el-dialog>
    <el-dialog :visible="dialogVisible1">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery"
import net from "../../assets/js/public"
import tableCom from '../../components/tableCompnment/tableForm'
import searchCom from '../../components/tableCompnment/searchForm'
import {frozenOrder, saveProductData} from '../../api'
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
      imageUrl: '',
      uploadUrl: '',
      fileList: [],
      carPhotoId: undefined,
      productArr: [],
      checkProList: [],
      uploadUrl: net.imageHP + "import/upload",
      dialogVisible1: false, //图片放大显示控制
      dialogImageUrl: "",
      // photoList: [], //保存上传图片后的信息
      fileList1: [],
      placeData: [],
      //弹窗下拉
      chaizhuang: "",
      chaizhuang_data: [],
      jiance: "",
      jiance_data: [],
      gendan: "",
      gendan_data: [],
      zhiliao: "",
      zhiliao_data: []
    }
  },
  created() {
    this.getRecheckPicList()
  },
  computed: {
    ...mapState(['recheckPicTableData', 'recheckPicLongData', 'recheckPicPagination', 'pageNo', 'pageSize', 'searchData', 
    'recheckImgUploadBtnArrList', 'recheckonloadPicRow', 'recheckonloadPicDialog', 'recheckrowCarInfo', 'productItem', 'dataModel',
    'frecheckrowFleList', 'photoList'])// 读数据
  },
  methods: {
    ...mapActions(['getRecheckPicList']),
    searchOrder () { // 查询
      this.getRecheckPicList()
    },
    printReport(that, row) {
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 4,
          row: row,
          pageNo: this.recheckPicPagination.pageNum,
          pageSize: this.recheckPicPagination.pageSize,
          carNumber: row.carNumber,
          enter: false,
          print: true
        }
      })
    },
    frozen(that, row){ //冻结工单
      console.log('冻结工单', that, row)
      this.$confirm("此操作将冻结此工单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(that, row)
        frozenOrder({jobId: row.jobId, version: row.version}).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getRecheckPicList()
        }).catch(res => {
          console.log(res)
          this.getRecheckPicList()
        })
      })
    },
    uploadImgs () {
      console.log('确定上传')
      const row = this.$store.state.recheckonloadPicRow
      let param = {
        jobId: row.jobId,
        version: row.version,
        chaiZhuang: this.chaizhuang || 0,
        jianCe: this.jiance || 0,
        genDan: this.gendan || 0,
        zhiLiao: this.zhiliao || 0
      };
      if (row.jobCode == 600 && row.photoId == undefined) {
        param["jobCode"] = 630;
      }
      if (row.jobCode == 630 || row.jobCode == 631 || row.jobCode == 632) {
        param["jobCode"] = 631;
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
        if (row.jobCode == 620) {
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
        console.log(param)
      }
      this.$store.state.recheckonloadPicDialog = false
    },
    ensureUpload(param) {
      console.log(param)
      net
        .request(
          "admin/order/uploadSecondPhotoList",
          "post",
          param,
          this.photoList
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            this.version = res.data;
            // this.updatePicState(optionId);
            this.dialogVisible = false;
            this.getRecheckPicList()
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    close () { // 关闭弹窗
      this.$store.state.recheckonloadPicDialog = false
    },
    closeDialog () {
      // this.$store.state.onloadPicDialog = false
      console.log('关闭')
    },
    change(idx, file, fileList) { // 监听改变
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    remove(optionID, photoID, jobID, version1) {
      console.log(optionID, photoID, jobID, version1);
      net
        .request(
          "admin/order/deleteRecheckPhoto",
          "post",
          {
            optionId: optionID,
            photoId: photoID,
            jobId: jobID,
            version: version1
          },
          {}
        )
        .then(res => {
          if (res.retcode == 1) {
            for (var i = 0; i < this.photoList.length; i++) {
              if (this.photoList[i].optionId == optionID) {
                this.photoList.splice(i, 1);
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
      net.message(this, "同时上传限制一个图，请先删除前面上传的图片", "error");
    },
    // 保存产品用量
    addProductNumber() {
      var params = {
        version: this.recheckonloadPicRow.version,
        jobId: this.recheckonloadPicRow.jobId
      };
      console.log(params)
      var data = this.getProArgs();
      console.log(data)
      saveProductData(params, data).then(res => {
        if (res.retcode == 1) {
          // net.message(this, res.retmsg, "success");
          this.$message({
          message: res.retmsg,
          type: 'success'
        });
          this.$store.state.recheckonloadPicRow.version = res.data;
        } else {
          net.message(this, res.retmsg, "error");
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //获取产品用量参数对象
    getProArgs() {
      console.log('sss')
      var list = [];
      var _this = this;
      $(".inputNumber").each(function() {
        var productId = $(this).data("id");
        var number = $(this)
          .children(".el-input--small")
          .children("input")
          .val();
        var obj;
        var flag = _this.checkProList.indexOf(productId);
        if (flag == -1) {
          obj = {
            productId: productId,
            number: 0
          };
        } else {
          obj = {
            productId: productId,
            number: number
          };
        }
        list.push(obj);
      });
      return list;
    },
    // 监听输入的产品用量
    handleChange(id, val) {
      // this.checkProList.push(id)
      if (val > 0) {
        var s = this.checkProList.indexOf(id);
        if (s == -1) {
          this.checkProList.push(id);
        }
      }
      if (val == 0) {
        var s1 = this.checkProList.indexOf(id);
        if (s1 != -1) {
          this.checkProList.splice(s1, 1);
        }
      }
    },
    //图片上次成功回调
    uploadSuccess(optionId, photoId, response, file, fileList) {
      console.log(optionId, photoId, response, file, fileList);
      if (response.retcode != 1) {
        net.message(this, response.retmsg, "error");
        return false;
      }
      this.photoList.push({ optionId: optionId, photoId: response.data });
      console.log(this.photoList);
      this.optionId = optionId;
      if (optionId == -1) {
        this.carPhotoId = response.data;
      } else if (optionId == -11) {
        this.framePhotoId = response.data;
      } else {
        for (let i = 0; i < this.placeData.length; i++) {
          const element = this.placeData[i];
          if (optionId == element.optionId) {
            element.photoId = response.data;
            this.placeData.splice(i, 1, element);
          }
        }
        console.log(this.placeData);
      }

      this.ctroOnloadBtn();
    },
    //点击显示放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    //控制上传按钮显示
    ctroOnloadBtn() {
      var _this = this;
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

