<template>
  <div>
    <div id="userList" v-if="historyPage">
      <div class="searchContent">
        <el-input placeholder="请输入车牌号" v-model="carNumber " clearable></el-input>
        <el-button
          type="primary"
          style="background: #009688;"
          @click="search"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button type="primary" @click="JumpAddCarInfo" icon="el-icon-plus">新增车辆信息</el-button>
      </div>
      <div class="table" v-show="isShowTable">
        <el-table :data="carList" border style="width: 99%">
          <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
          <el-table-column prop="factoryName" label="主机厂商" align="center"></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
          <el-table-column prop="seriesName" label="车系" align="center"></el-table-column>
          <el-table-column prop="modelName" label="车型" align="center"></el-table-column>
          <el-table-column prop="areaName" label="区" align="center"></el-table-column>
          <el-table-column prop="provinceName" label="省份" align="center"></el-table-column>
          <el-table-column prop="customerName" label="客户姓名" align="center"></el-table-column>
          <el-table-column prop="customerPhone" label="客户电话" align="center"></el-table-column>
          <el-table-column prop="fuelTypeName" label="汽油类型" align="center"></el-table-column>
          <el-table-column prop="orgName" label="维修站" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click="addorder(scope.row)"
                type="success"
                style="background: #009688;"
                size="small"
              >新增</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-show="isShowTable">
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
      </div>
    </div>
    <div v-if="!historyPage">
      <div style="text-align: left;margin-top: 10px;">
        <el-button @click="historyPage = true">返回</el-button>
      </div>
      <!-- :before-close="handleClose" -->
      <div>
        <el-row :gutter="20" style="padding: 20px 0;">
          <el-col :span="6">
            <legend class="title">车牌:</legend>
            <div class="grid-content bg-purple" style="float:left">
              <el-input
                style="width:100%;"
                placeholder="请输入车牌"
                v-model="carNumber"
                disabled
                clearable
              ></el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" style="float:left;width:100%">
              <legend class="title">业务线:</legend>
              <el-select
                style="width:70%;float:left"
                v-model="selectService"
                clearable
                placeholder="请选择业务线"
                disabled
              >
                <el-option
                  v-for="item in serviceArr"
                  :key="item.id"
                  :label="item.serviceLineName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" style="float:left;width:100%">
              <legend class="title">维修站:</legend>
              <el-select
                style="width:70%;float:left"
                v-model="orgin"
                clearable
                placeholder="请选择维修站"
                @change="orginChange"
                filterable
                v-show="isShow"
              >
                <el-option
                  v-for="item in orginArr"
                  :key="item.id"
                  :label="item.orgName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding: 20px 0;">
          <el-col :span="6">
            <legend class="title">里程:</legend>
            <div class="grid-content bg-purple" style="float:left">
              <el-input
                style="width:100%;"
                placeholder="请输入里程（单位：km）"
                v-model="add_mileage"
                clearable
              ></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <legend class="title">次数:</legend>
            <div class="grid-content bg-purple" style="float:left">
              <el-input style="width:100%;" placeholder="请输入次数" v-model="frequency" clearable></el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <legend class="title">时间:</legend>
            <div class="grid-content bg-purple" style="float:left">
              <el-date-picker
                style="float:left;width:80%"
                v-model="repairTime"
                type="date"
                @change="getTime"
                :editable="false"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="padding-bottom: 20px;">
          <el-col :span="12">
            <div style="width: 120px;float: left;margin-top: 5%;">
              <label style="display:inline-block;">客户车况描述</label>
            </div>
            <div style="width: 76%;float: left;">
              <el-input type="textarea" v-model="desc" :autosize="{ minRows: 3}"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="padding-bottom: 20px;">
          <el-col :span="12">
            <div class="selectType">
              <p style="width: 100px;float: left;">业务类型</p>
              <div style="width: 76%;float: left;">
                <el-radio-group v-model="selectType">
                  <el-radio :label="1">检测</el-radio>
                  <el-radio :label="2">检测 + 治疗</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ensure">确 定</el-button>
        </span>-->
      </div>
      <div class="early">
        <div>
          <p class="detectionTitle">检测上传</p>
          <el-row :gutter="20" style="padding:10px 0 20px 0">
            <el-col :span="3">部位</el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-dark">
                <p class="partName">车牌</p>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-dark">
                <p class="partName">车架号</p>
              </div>
            </el-col>
            <el-col :span="3" v-for="(item,index) in historyPart" :key="index">
              <div class="grid-content bg-purple-dark">
                <p class="partName">{{item.optionName}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row :gutter="20">
            <el-col :span="3" class="imgBox" style="line-height:120px">照片</el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-dark imgBox amplification">
                <el-upload
                  list-type="picture-card"
                  :action="uploadUrl"
                  :data="{carNumber:carNumber,step:1,option:-1}"
                  :on-success="uploadSuccess.bind(this,-1,0)"
                  :on-remove="deleteImg.bind(this,-1)"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-dark imgBox amplification">
                <el-upload
                  list-type="picture-card"
                  :action="uploadUrl"
                  :data="{carNumber:carNumber,step:1,option:-11}"
                  :on-success="uploadSuccess.bind(this,-11,0)"
                  :on-remove="deleteImg.bind(this,-11)"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="3" v-for="(item,index) in historyPart" :key="index">
              <div class="grid-content bg-purple-dark imgBox amplification">
                <el-upload
                  list-type="picture-card"
                  :action="uploadUrl"
                  :data="{carNumber:carNumber,step:1,option:item.id}"
                  :on-success="uploadSuccess.bind(this,item.id,framePhotoId)"
                  :on-remove="deleteImg.bind(this,item.id)"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="early" v-if="selectType == 2">
        <div>
          <p class="detectionTitle">复查上传</p>
          <el-row :gutter="20" style="padding:10px 0 20px 0">
            <el-col :span="3">部位</el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-dark">
                <p class="partName">车牌</p>
              </div>
            </el-col>
            <el-col :span="3" v-for="(item,index) in historyPart" :key="index">
              <div class="grid-content bg-purple-dark">
                <p class="partName">{{item.optionName}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row :gutter="20">
            <el-col :span="3" class="imgBox" style="line-height:120px">照片</el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-dark imgBox amplification">
                <el-upload
                  list-type="picture-card"
                  :action="uploadUrl"
                  :data="{carNumber:carNumber,step:1,option:-1}"
                  :on-success="uploadSuccess1.bind(this,-11,framePhotoId)"
                  :on-remove="deleteImg1"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="3" v-for="(item,index) in historyPart" :key="index">
              <div class="grid-content bg-purple-dark imgBox amplification">
                <el-upload
                  list-type="picture-card"
                  :action="uploadUrl"
                  :data="{carNumber:carNumber,step:1,option:item.id}"
                  :on-success="uploadSuccess1.bind(this,item.id,framePhotoId)"
                  :on-remove="deleteImg1"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="submitBox">
        <el-button type="primary" @click="submitChanges">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      uploadUrl: net.imageHP + "import/upload",
      carList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      carNumber: "",
      add_mileage: "",
      selectService: "",
      dialogVisible: false,
      dialogVisible1: false,
      serviceArr: [],
      desc: "",
      checkedCar: [],
      carArr: [],
      selectType: 1,
      isShowTable: false,
      carId: 0,
      isShow: false,
      orgin: "", //维修站
      orginArr: [],
      orginUser: "", //维修站用户
      orginUserArr: [],
      engineerId: "",
      engineerArr: [],
      dTitle: "",
      historyPage: true, //控制显示新增页面
      historyPart: [], //保存部位
      uploadId: "",
      submitPartImg: [], //检测图片信息
      reviewPartImg: [], //复查图片信息
      frequency: 1, //维修次数
      repairTime: "", //维修时间
      framePhotoId: undefined
    };
  },
  created() {},
  computed: {
    uploadDisabled: function() {
      return this.imagelist.length > 0;
    }
  },
  methods: {
    //点击新增
    addorder(row) {
      this.historyPage = false;
      var orgId = JSON.parse(sessionStorage.getItem("signInfo")).orgId;
      if (orgId == null || orgId == 0) {
        this.isShow = true;
      } else {
        this.isShow = false;
        this.orginChange(orgId);
      }
      this.add_mileage = "";
      this.selectService = "";
      this.orgin = "";
      this.dialogVisible = true;
      this.carId = row.id;
      this.desc = "";
      this.orginUserArr = [];
      this.orginUser = "";
      this.engineerId = "";
      this.engineerArr = [];
      this.dTitle = "新增工单" + "(" + row.carNumber + ")";
      this.getAllService(() => {
        this.selectService = 1;
      });
      this.carNumber = row.carNumber;
      this.getOrgin();
      this.getHistoryPart(row.id);
    },
    //点击车况模板
    clickCondition() {
      this.dialogVisible1 = true;
      this.getAllCar();
    },
    //选择车况模板
    selectCar() {
      if (this.checkedCar.length != 0) {
        if (this.desc != "") {
          this.desc = this.desc + "\n" + this.checkedCar.join("\n");
        } else {
          this.desc = this.checkedCar.join("\n");
        }
      }
      this.checkedCar = [];
      this.dialogVisible1 = false;
    },

    //获取维修站
    getOrgin(callback) {
      callback = callback || function() {};
      net.request("admin/Organization/getOrganizationAll", "post").then(res => {
        if (res.retcode == 1) {
          this.orginArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    orginChange(val) {
      this.orginUser = "";
      this.engineerId = "";
      this.getOrginUser(val);
      this.getEngineer(val);
    },
    //获取维修站用户
    getOrginUser(orgId) {
      net
        .request("admin/orgUser/queryUserByOrgId", "post", { orgId: orgId })
        .then(res => {
          if (res.retcode == 1) {
            this.orginUserArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    getEngineer(orgID) {
      net
        .request("admin/engineer/queryEngineerByOrgId", "post", {
          orgId: orgID
        })
        .then(res => {
          if (res.retcode == 1) {
            this.engineerArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    //获取列表数据
    getList(param, data) {
      net.request("admin/car/queryPage", "post", param, data).then(res => {
        if (res.retcode == 1) {
          this.carList = res.data.rows;
          this.total = res.data.total;
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { carNumber: this.carNumber }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { carNumber: this.carNumber }
      );
    },

    search() {
      this.isShowTable = true;
      //查询
      this.getList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { carNumber: this.carNumber }
      );
    },
    JumpAddCarInfo() {
      this.$router.push({ path: "/carInfo" });
    },
    //获取车况模板
    getAllCar(callback) {
      callback = callback || function() {};
      net.request("admin/select/getCarStencil", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.carArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    //获取业务线
    getAllService(callback) {
      callback = callback || function() {};
      net.request("admin/select/getLine", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.serviceArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    // 获取部位
    getHistoryPart(id) {
      console.log(id);
      net
        .request(
          "admin/select/getOptionByCarId",
          "post",
          {
            carId: id
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.historyPart = res.data;
          } else {
            net.message(this, "部位获取失败");
          }
        });
    },
    //图片上次成功回调
    uploadSuccess(optionId, photoId, response, file, fileList) {
      console.log(file);
      let list = {};
      if (optionId == -1 || optionId == -11) {
        list["photoId"] = file.response.data;
        list["optionId"] = optionId;
        list["optionValue"] = 0;
      } else {
        list["photoId"] = file.response.data.id;
        list["optionId"] = file.response.data.optionId;
        list["optionValue"] = file.response.data.optionValue;
      }
      this.reviewPartImg.push(list);
    },
    deleteImg(id, file, fileList) {
      let photoId = "";
      if (id == -1 || id == -11) {
        photoId = file.response.data;
      } else {
        photoId = file.response.data.id;
      }
      net
        .request(
          "admin/order/deleteHistoryPhoto",
          "post",
          {
            photoId: photoId
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            console.log(res);
            this.$message({ message: res.retmsg, type: "success" });
            if (res.data == "") {
              for (let j in this.reviewPartImg) {
                if (this.reviewPartImg[j].optionId == id) {
                  this.reviewPartImg.splice(j, 1);
                }
              }
            } else {
              for (let i in this.reviewPartImg) {
                if (this.reviewPartImg[i].photoId == file.response.data.id) {
                  this.reviewPartImg.splice(i, 1);
                }
              }
            }
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    uploadSuccess1(optionId, photoId, response, file, fileList) {
      let list = {};
      list["photoId"] = file.response.data;
      list["optionId"] = optionId;
      this.submitPartImg.push(list);
    },
    deleteImg1(file, fileList) {
      console.log(file);
      net
        .request(
          "admin/order/deleteHistoryPhoto",
          "post",
          {
            photoId: file.response.data
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.$message({ message: res.retmsg, type: "success" });
            console.log(this.submitPartImg);
            for (let i in this.submitPartImg) {
              if (this.submitPartImg[i].photoId == file.response.data) {
                this.submitPartImg.splice(i, 1);
              }
            }
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    getTime(date) {
      let time = new Date(date);
      this.repairTime = time.getTime();
    },
    //提交更改入库
    submitChanges() {
      let that = this;
      if (this.add_mileage == "") {
        net.message(this, "请输入里程数", "warning");
        return false;
      }
      if (this.selectService == "") {
        net.message(this, "请选择业务线", "warning");
        return false;
      }
      if (this.selectType == 0) {
        net.message(this, "请选择业务类型", "warning");
        return false;
      }
      if (this.orgin == "") {
        net.message(this, "请选择维修站点", "warning");
        return false;
      }
      if (this.frequency == "") {
        net.message(this, "请输入次数", "warning");
        return false;
      }
      if (this.repairTime == "") {
        net.message(this, "请选择时间", "warning");
        return false;
      }
      net
        .request(
          "history/addHistoryOrder",
          "post",
          {},
          {
            firstlist: this.reviewPartImg,
            secondlist: this.submitPartImg,
            order: {
              count: this.frequency,
              orgId: this.orgin,
              carId: this.carId,
              serviceLineId: this.selectService,
              inputTime: this.repairTime,
              mile: this.add_mileage,
              note: this.desc,
              checkType: this.selectType
            }
          }
        )
        .then(res => {
          if (res.retcode == 1) {
            that.$router.push("/modalUrlConfig");
          } else {
            net.message(this, "入库失败", "warning");
          }
          console.log(res.data);
        });
    }
  }
};
</script>
<style lang="less" >
#userList {
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
  .table {
    padding-bottom: 30px;
  }
  .pagination {
    position: relative;
    top: 20px;
    // height: 100px;
    .el-pagination {
      position: absolute;
      left: 0px;
    }
    .number .active {
      background: #009688 !important;
    }
  }
  .conditionTitle {
    width: 300px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    p {
      height: 42px;
      line-height: 42px;
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
  .selectType {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: 0 auto;
    p {
      text-align: left;
      padding-left: 15px;
      height: 36px;
      line-height: 36px;
    }
    div {
      margin-top: 15px;
    }
  }
}
.title {
  display: inline-block;
  float: left;
  line-height: 40px;
  margin-right: 10px;
}
.detectionTitle {
  margin: 20px;
  font-size: 17px;
  font-weight: 600;
  color: red;
}
.early {
  .el-upload--picture-card {
    width: 100% !important;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100%;
  }

  .el-upload-list--picture-card:not(:empty) + .el-upload--picture-card {
    display: none;
  }
}
.submitBox {
  margin-top: 20px;
  text-align: right;
  padding-right: 30px;
}
</style>
