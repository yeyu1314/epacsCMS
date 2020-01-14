<template>
  <div style="width:100%;height:100%">
    <div v-if="check">
      <div style="margin:5px;" v-if="false">
        注意:未审核数据是指所有完成工单中
        <label style="color:red">未经过人工审核</label>确认之后，进入
        <label style="color:red">比对数据库</label>的数据
      </div>
      <div class="search" v:if="showSearchBox">
        <div class="p_select">
          <el-select v-model="selectedBrand" clearable placeholder="请选择品牌" @change="brandChange">
            <el-option
              v-for="item in brandData"
              :key="item.id"
              :label="item.brandName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select v-model="selectedHost" clearable placeholder="请选择主机厂商" @change="hostChange">
            <el-option
              v-for="item in hostData"
              :key="item.id"
              :label="item.factoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select v-model="selectedSeries" clearable placeholder="请选择车系">
            <el-option
              v-for="item in seriesData"
              :key="item.id"
              :label="item.seriesName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select v-model="selectedArea" clearable placeholder="请选择区" @change="areaChange">
            <el-option
              v-for="item in areaData"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-select v-model="orgin" clearable placeholder="请选择维修站" filterable>
            <el-option
              v-for="item in orginArr"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="p_select">
          <el-input placeholder="请输入车牌号" v-model="carNumber" clearable></el-input>
        </div>
        <div class="p_select">
          <el-button type="primary" @click="clickSearch" icon="el-icon-search">查询</el-button>
        </div>
      </div>
      <el-tabs
        type="border-card"
        v-model="tabIndex"
        @tab-click="clickSearch"
        style="margin-top:10px;"
      >
        <el-tab-pane label="校验审核">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="carNumber" label="车牌" align="center" min-width="200"></el-table-column>
            <el-table-column
              prop="inputTime"
              :formatter="tiem"
              label="录单时间"
              align="center"
              min-width="200"
            ></el-table-column>
            <el-table-column prop="mile" label="录单里程" align="center" min-width="200"></el-table-column>
            <el-table-column prop="orgName" label="维修站名称" align="center" min-width="200"></el-table-column>
            <el-table-column label="操作" min-width="100" align="center">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="primary" size="small">校验与审核</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 数据统计tab -->
        <el-tab-pane label="数据统计">
          <el-table :data="countListData" border style="width: 100%">
            <el-table-column prop="brandName" label="车辆品牌" align="center" min-width="200"></el-table-column>
            <el-table-column prop="factoryName" label="主机厂" align="center" min-width="200"></el-table-column>
            <el-table-column prop="seriesName" label="车系" align="center" min-width="200"></el-table-column>
            <el-table-column prop="areaName" label="地区" align="center" min-width="200"></el-table-column>
            <el-table-column prop="total" label="未审核数量" align="center" min-width="200"></el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 不通过原因tab -->
        <el-tab-pane label="不通过原因统计">
          <el-table :data="failCountListData" border style="width: 100%">
            <el-table-column prop="note" label="不通过原因" align="center" min-width="200"></el-table-column>
            <el-table-column prop="total" label="数量" align="center" min-width="200"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 主体结束-->
    <!-- 对话框开始 -->
    <div v-if="!check" class="checkBox">
      <div class="return">
        <el-button type="primary" @click="check = true">返回</el-button>
      </div>
      <div class="vehicleInformation">
        <div class="vehicleBox">
          <el-row :gutter="20">
            <el-col :span="6">
              <p class="numberPlate commonPlateClass">
                <span>车牌号：</span>
                <span style>{{numberPlate}}</span>
              </p>
            </el-col>
            <el-col :span="6">
              <p class="numberPlate commonPlateClass">
                <span>车型：</span>
                <span style>{{modelName}}</span>
              </p>
            </el-col>
            <el-col :span="6">
              <p class="numberPlate commonPlateClass">
                <span>车系：</span>
                <span style>{{seriesName}}</span>
              </p>
            </el-col>
            <el-col :span="6">
              <p class="numberPlate commonPlateClass">
                <span>主机厂商：</span>
                <span style>{{factoryName}}</span>
              </p>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <p class="detections commonPlateClass">
                <span>录单时间：</span>
                <span>{{recordingTime}}</span>
              </p>
            </el-col>
            <el-col :span="6">
              <p class="detections commonPlateClass">
                <span>录单里程：</span>
                <span>{{mileage}}</span>
              </p>
            </el-col>
            <el-col :span="6">
              <p class="detections commonPlateClass">
                <span>维修站名称：</span>
                <span>{{repairSite}}</span>
              </p>
            </el-col>
            <el-col :span="6">
              <p class="detections commonPlateClass">
                <span>检测次数：</span>
                <span>{{numberOfDetections}}次</span>
              </p>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row :gutter="20" style="padding:10px 0 20px 0">
            <el-col :span="3">部位</el-col>
            <el-col :span="3" v-for="(item,index) in part" :key="index">
              <div class="grid-content bg-purple-dark">
                <p class="partName">{{item.optionName}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row :gutter="20">
            <el-col :span="3" class="imgBox" style="line-height:120px">照片</el-col>
            <el-col :span="3" v-for="(item,index) in partImgArr" :key="index">
              <div class="grid-content bg-purple-dark imgBox amplification">
                <img :src="item.photoUrl" />
                <i
                  class="el-icon-zoom-in amplification_i"
                  v-show="item.big"
                  @click="amplification(item.photoId)"
                ></i>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row :gutter="20" style="padding:20px 0 20px 0;">
            <el-col :span="3" class="inputBox">赋值</el-col>
            <el-col :span="3" v-for="(item,index) in partImgArr" :key="index">
              <div class="grid-content bg-purple-dark inputBox">
                <el-select
                  v-show="item.show"
                  v-model="item.optionValue"
                  @change="partValue(item,$event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in degree"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="assignmentBtn">
          <el-button type="primary" v-if="storage" @click="failStorage">审核不通过</el-button>
          <el-button type="primary" v-if="storage" @click="reviewStorage">审核入库</el-button>
          <el-button type="primary" @click="changeAssignment">修改赋值</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="originalImage" width="40%">
      <img :src="originalImageUrl" style="width:100%;height: auto;" />
    </el-dialog>
    <el-dialog :visible.sync="showFailReasonDialog" width="40%" height="600px" title="影像审核不通过">
      <div style="margin:20px;">请选择审核不通过的原因</div>
      <div class="p_select">
        <el-select v-model="selectedFailReason" clearable placeholder="请选择原因">
          <el-option
            v-for="item in FailReasonList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFailReasonDialog = false">取 消</el-button>
        <el-button type="primary" @click="sumbitFailReason">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import net from "../../assets/js/public";
export default {
  inject: ["reload"],
  data() {
    return {
      showSearchBox:true,
      orgin: "", //维修站
      orginArr: [],
      tabIndex: "0",
      brandData: [], //汽车品牌
      selectedBrand: "",
      hostData: [], //主机厂商
      selectedHost: "",
      seriesData: [], //车系
      selectedSeries: "",
      areaData: [], //区
      selectedArea: "",
      carNumber: null,
      tableData: [], //存放表格数据
      countListData: [], //存放统计表格数据
      failCountListData:[],//不通过统计数据
      pageNumber: 1, //页码
      numberOfPages: 10, //每页条数
      licensePlate: null,
      total: null,
      currentPage4: 1,
      check: true,
      part: [],
      partImg: [],
      partImgArr: [],
      carId: "",
      orderId: "",
      fieldParseList: [],
      partAssignment: [],
      ban: true,
      numberPlate: "", //车牌号
      modelName: "", //车型
      seriesName: "", // 车系
      factoryName: "", // 主机厂
      numberOfDetections: "",
      recordingTime: "",
      mileage: "",
      repairSite: "",
      storage: false,
      showFailReasonDialog: false, //失败原因对话框
      FailReasonList: [], //失败原因列表
      selectedFailReason: "",
      originalImage: false, //图片放大弹出层
      originalImageUrl: "",
      degree: [
        {
          value: 0,
          label: "未赋值"
        },
        {
          value: 1,
          label: "轻微"
        },
        {
          value: 2,
          label: "轻度"
        },
        {
          value: 3,
          label: "中度"
        },
        {
          value: 4,
          label: "重度"
        },
        {
          value: 5,
          label: "严重"
        }
      ],
      bindData: []
    };
  },
  created() {
    this.getbrandData();
    this.getareaData();
    this.getOrgin();
  },
  methods: {
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
    //获取汽车品牌
    getbrandData() {
      net.request("admin/select/getCarBrand", "post").then(res => {
        if (res.retcode == 1) {
          this.brandData = res.data;
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //监听下拉
    brandChange() {
      this.hostData = [];
      this.seriesData = [];
      this.selectedHost = "";
      this.selectedSeries = "";
      this.gethostData();
    },
    //获取主机厂商
    gethostData() {
      net
        .request("admin/select/getCarFactory", "post", {
          brandId: this.selectedBrand
        })
        .then(res => {
          if (res.retcode == 1) {
            this.hostData = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    hostChange() {
      this.seriesData = [];
      this.selectedSeries = "";
      this.getSeriesData();
    },
    //获取车系
    getSeriesData() {
      net
        .request("admin/select/getCarSeries", "post", {
          factoryId: this.selectedHost
        })
        .then(res => {
          if (res.retcode == 1) {
            this.seriesData = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //获取区
    getareaData() {
      net.request("admin/select/getArea", "post").then(res => {
        if (res.retcode == 1) {
          this.areaData = res.data;
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    areaChange() {
      this.provinceData = [];
      this.selectedProvince = "";
      this.getprovinceData();
    },
    //获取省系
    getprovinceData() {
      net
        .request("admin/select/getProvince", "post", {
          areaId: this.selectedArea
        })
        .then(res => {
          if (res.retcode == 1) {
            this.provinceData = res.data;
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    getDataList() {
      net
        .request(
          "admin/ai/getCarAIInfoListNotExamine",
          "post",
          { pageNo: this.pageNumber, pageSize: this.numberOfPages },
          {
            carNumber: this.carNumber,
            brandId: this.selectedBrand,
            factoryId: this.selectedHost,
            seriesId: this.selectedSeries,
            areaId: this.selectedArea,
            orgId: this.orgin
          }
        )
        .then(res => {
          if (res.retcode == 1) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    getCountList() {
      net
        .request(
          "admin/ai/countExamineInfo",
          "post",
          { pageNo: this.pageNumber, pageSize: this.numberOfPages },
          {
            carNumber: this.carNumber,
            brandId: this.selectedBrand,
            factoryId: this.selectedHost,
            seriesId: this.selectedSeries,
            areaId: this.selectedArea,
            orgId: this.orgin
          }
        )
        .then(res => {
          if (res.retcode == 1) {
            this.countListData = res.data;
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    getFailCountList() {
      net
        .request(
          "admin/ai/queryAIFailPhotoCount",
          "post",
          { pageNo: this.pageNumber, pageSize: this.numberOfPages },
          {
            // carNumber: this.carNumber,
            // brandId: this.selectedBrand,
            // factoryId: this.selectedHost,
            // seriesId: this.selectedSeries,
            // areaId: this.selectedArea,
            // orgId: this.orgin
          }
        )
        .then(res => {
          if (res.retcode == 1) {
            this.failCountListData = res.data;
          } else {
            this.$message.error(res.retmsg);
          }
        });
    },
    //搜索
    clickSearch() {
      if (this.tabIndex == 0) {
        this.showSearchBox = true;
        this.getDataList();
      } else if (this.tabIndex == 1){
        this.showSearchBox = true;
        this.getCountList();
      } else if (this.tabIndex == 2){
        this.showSearchBox = false;
        this.getFailCountList();
      }
    },
    //ai校验
    handleClick(row) {
      this.partImgArr = [];//清空图片
      this.check = !this.check;
      this.numberPlate = row.carNumber;
      this.modelName = row.modelName;
      this.seriesName = row.seriesName;
      this.factoryName = row.factoryName;
      this.numberOfDetections = row.count;
      this.recordingTime = this.tiem(row);
      this.mileage = row.mile;
      this.repairSite = row.orgName;
      this.getPart(row.carId, row.workId);
      this.carId = row.carId;
      this.orderId = row.orderId;
      if (row.tag % 10 != 0) {
        this.storage = true;
      }
    },
    tiem(row) {
      return net.dateFormat(row.inputTime, 0);
    },
    handleSizeChange(val) {
      this.numberOfPages = val;
      this.getDataList(
        { pageNo: this.pageNumber, pageSize: this.numberOfPages },
        { carNumber: this.licensePlate }
      );
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getDataList(
        { pageNo: this.pageNumber, pageSize: this.numberOfPages },
        { carNumber: this.licensePlate }
      );
    },
    //获取部位
    getPart(carId, workId) {
      net
        .request(
          "admin/select/getOptionByCarId",
          "post",
          {
            carId: carId
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.part = res.data;
            this.part.unshift(
              {
                id: -1,
                optionName: "车牌"
              },
              {
                id: -11,
                optionName: "车架号"
              }
            );
            this.getPartImg(workId);
          } else {
            this.$message.error("暂无数据");
          }
        });
    },
    // 获取部位图片
    getPartImg(workId) {
      net
        .request(
          "admin/ai/getCarAIPhoto",
          "post",
          {
            workId: workId
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.partImg = res.data;
            for (let i in this.part) {
              this.part[i]["photoUrl"] = require("../../assets/img/part.jpg");
              this.part[i]["optionId"] = this.part[i].id;
              this.part[i]["photoId"] = this.part[i].id;
              this.part[i]["show"] = false;
              this.part[i]["big"] = false;
              this.part[i]["optionValue"] = "";
            }
            for (let p in this.part) {
              for (let j in this.partImg) {
                if (this.part[p].optionId == this.partImg[j].optionId) {
                  this.part[p].photoUrl = this.partImg[j].photoUrl;
                  this.part[p].optionValue = this.partImg[j].optionValue;
                  this.part[p].photoId = this.partImg[j].photoId;
                  if (
                    this.part[p].optionId == -1 ||
                    this.part[p].optionId == -11
                  ) {
                    this.part[p].show = false;
                    this.part[p]["big"] = true;
                  } else {
                    this.part[p].show = true;
                    this.part[p]["big"] = true;
                  }
                }
              }
            }
            this.partImgArr = this.part;
          } else {
            this.$message.error("暂无数据");
          }
        });
    },
    //图片放大
    amplification(id) {
      this.originalImage = true;
      this.originalImageUrl = net.imageHP + "image/getLarge?imageId=" + id;
    },
    changeAssignment() {
      let list = this.fieldParseList;
      if (list.length == 0) {
        this.$message.error("暂无修改");
        return;
      } else {
        this.$confirm("是否提交该赋值", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            net
              .request(
                "admin/ai/AICheck",
                "post",
                {
                  carId: this.carId,
                  orderId: this.orderId
                },
                list
              )
              .then(res => {
                if (res.retcode == 1) {
                  this.$message({
                    type: "success",
                    message: res.retmsg
                  });
                } else {
                  this.$message({
                    type: "success",
                    message: res.retmsg
                  });
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消赋值"
            });
          });
      }
    },
    failStorage() {
      this.selectedFailReason = "";
      net
        .request("admin/ai/queryExamineReasonList", "post", null, null)
        .then(res => {
          if (res.retcode == 1) {
            this.FailReasonList = res.data;
            this.showFailReasonDialog = true;
          } else {
            this.$message({
              type: "success",
              message: res.retmsg
            });
          }
        });
    },
    //提交审核不通过和具体的失败原因
    sumbitFailReason() {
      let that = this;
      if (this.selectedFailReason == "" || this.selectedFailReason == 0) {
        this.$message({
          type: "warning",
          message: "请选择审核不通过的原因"
        });
        return;
      }
      net
        .request(
          "admin/ai/failAIExamine",
          "post",
          {
            orderId: that.orderId,
            reasonId: that.selectedFailReason
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.$message({
              type: "success",
              message: "提交不通过原因完成"
            });
            this.showFailReasonDialog = false;
            this.tabIndex == 0;
            this.check = true;
            this.getDataList();
          } else {
            this.$message({
              type: "warning",
              message: res.retmsg
            });
          }
        });
    },
    reviewStorage() {
      let that = this;
      net
        .request(
          "admin/ai/AIExamine",
          "post",
          {
            orderId: that.orderId
          },
          null
        )
        .then(res => {
          if (res.retcode == 1) {
            this.tabIndex == 0;
            this.check = true;
            this.getDataList();
            //this.reload();
          }
        });
    },
    clear(index) {
      console.log(this.partAssignment[index]);
    },
    //获取赋值
    getAssignmentIndex(arr, option) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].optionId == option) {
          return i;
        }
      }
    },
    partValue(row, val) {
      this.$forceUpdate();
      let list = {};
      let add = true;
      if (this.fieldParseList.length != 0) {
        for (let i in this.fieldParseList) {
          if (
            this.fieldParseList[i].photoId == row.photoId &&
            this.fieldParseList[i].optionId == row.optionId
          ) {
            this.fieldParseList[i].optionValue = val;
            add = false;
          }
        }
        if (add) {
          list.photoId = row.photoId;
          list.optionId = row.optionId;
          list.optionValue = val;
          this.fieldParseList.push(list);
        }
      } else {
        list.photoId = row.photoId;
        list.optionId = row.optionId;
        list.optionValue = val;
        this.fieldParseList.push(list);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.search {
  display: flex;
  flex-wrap: wrap;
  .p_select {
    margin-right: 20px;
    margin-top: 15px;
  }
}
.return {
  margin-bottom: 10px;
  text-align: left;
}
.block {
  margin-top: 20px;
  text-align: left;
}
.vehicleInformation {
  padding: 15px 0px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -65%);
  border: 2px solid #66b1ff;
  display: flex;
  flex-direction: column;
}
.vehicleBox {
  margin-bottom: 20px;
}
.vehicleBox::after {
  content: "020";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.el-row {
  height: 36px;
  line-height: 36px;
}
.numberPlate,
.detections {
  color: #666;
  display: flex;
  span {
    &:nth-child(1) {
      display: inline-block;
      width: 200px;
      text-align: right;
    }
    &:nth-child(2) {
      display: inline-block;
      text-align: left;
    }
  }
}

.commonPlateClass {
  font-size: 16px;
}
.checkBox {
  width: 100%;
  margin-top: 20px;
  height: 100%;
}

.amplification_i {
  position: relative;
  top: -50%;
  transform: translateY(-50%);
  color: #fff;
}
.imgBox {
  height: 120px;
}
.inputBox {
  height: 40px;
  line-height: 40px;
}
.imgBox img {
  width: 100%;
  height: 100%;
}
.assignmentBtn {
  text-align: right;
  padding-right: 5px;
  margin: 10px;
}
</style>
