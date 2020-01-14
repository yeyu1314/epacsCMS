<template>
  <div class="onloadFirstPic">
    <div class="searchContent">
      <el-input placeholder="请输入车牌号" v-model="carPai" clearable></el-input>

      <el-button
        type="primary"
        style="background: #009688;"
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
        <el-table-column prop="note" align="center" label="工单说明">
          <template slot-scope="scope">
            <span v-if="scope.row.jobCode==632" style="color:#f40">照片不合格</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" align="center" label="当前操作人"></el-table-column>

        <el-table-column fixed="right" label="打印" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                @click="seeFirstReport(scope.row)"
                type="success"
                style="background: #009688;"
                size="small"
              >打印检测报告</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="123">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.jobCode==600"
              @click="onloadClick(scope.row)"
              type="success"
              style="background:#009688;"
              size="small"
            >上传复查照片</el-button>
            <el-button
              v-show="scope.row.jobCode==630 || scope.row.jobCode==631 || scope.row.jobCode==632"
              @click="editOnloadClick(scope.row)"
              type="success"
              style="background:#009688;"
              size="small"
            >编辑复查照片</el-button>
            <div style="margin-top:5px;">
              <el-button
                v-show="scope.row.jobCode==630 || scope.row.jobCode==631 || scope.row.jobCode==632"
                @click="complete(scope.row)"
                type="success"
                size="small"
              >完成复查上传</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="冻结" align="center" width="100">
          <template slot-scope="scope">
            <el-button @click="frozen(scope.row)" type="danger" size="small">冻结工单</el-button>
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
    <el-dialog :visible.sync="dialogVisible1">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogVisible" @close="cancel" width="1000px">
      <div class="contentBody">
        <div class="carInfo">
          <p class="title">车辆信息：</p>
          <p>
            <span>车牌号：{{carCount}}</span>
            <span>车系：{{brandName}}</span>
            <span>车型：{{modelName}}</span>
          </p>
          <p class="pPosition">
            <span>燃油类型：{{fuelTypeName}}</span>
            <span>综合油耗：{{oilDeplete}}L/100km</span>
            <span>行驶里程：{{mile}}KM</span>
            <span id="mainBtn">
              <el-button type="primary" @click="uploadImgs">确认提交</el-button>
            </span>
          </p>
        </div>
        <div
          style="display:flex;flex-wrap: wrap;    width: 500px;    margin-left: 100px;"
          v-show="this.jobCode==600"
        >
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
          <el-select
            v-model="zhiliao"
            placeholder="请选择治疗技师"
            clearable
            style="margin-right:10px;margin-top:10px"
          >
            <el-option
              v-for="item in zhiliao_data"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="bottonContent">
          <div class="onlodList">
            <div class="perform">
              <div class="left" :class="{error:s1 == 2}">车牌号</div>
              <div class="right">
                <!-- headers="application/x-www-form-urlencoded" -->
                <el-upload
                  :action="uploadUrl"
                  list-type="picture-card"
                  :data="{carNumber:carNumber,step:2,option:-2}"
                  :on-success="uploadSuccess.bind(this,-2,carPhotoId)"
                  :on-preview="handlePictureCardPreview"
                  :on-change="change.bind(this,-2)"
                  :on-remove="remove.bind(this,-2,carPhotoId,jobId,version)"
                  :file-list="fileList"
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
                  :data="{carNumber:carNumber,step:2,option:item.optionId}"
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
    <el-dialog
      :visible.sync="progressBar"
      title="AI正在识别运算"
      custom-class="hello1"
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
          ></el-progress>
        </div>
        <img src="../../assets/img/ai.gif" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import net from "../../assets/js/public";
import $ from "jquery";
export default {
  data() {
    return {
      orderPageShowOrgName: false,
      uploadUrl: net.imageHP + "import/upload",
      listData: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      title: "",
      //车辆信息
      carCount: "",
      brandName: "",
      modelName: "",
      mile: "",
      fuelTypeName: "", //燃油
      oilDeplete:'',
      dialogVisible: false,
      dialogVisible1: false, //图片放大显示控制
      dialogImageUrl: "",
      fileList: [],
      fileList1: [],
      placeData: [],
      //参数
      carNumber: "",
      jobId: "",
      jobCode: "",
      photoUrl: "",
      optionId: "",
      carPhotoId: undefined,
      framePhotoId: undefined,
      //判断是上传检测照片还是编辑
      sign: 0,
      version: "",
      s1: 0,
      //
      carPai: null,
      productArr: [],
      checkProList: [],
      dataModel: [], //暂存计步器双休绑定
      progressBar: false,
      loadProgress: false,
      used: 0,
      page: this.$route.params,
      photoList: [], //保存上传图片后的信息
      //弹窗下拉
      chaizhuang: "",
      chaizhuang_data: [],
      jiance: "",
      jiance_data: [],
      gendan: "",
      gendan_data: [],
      zhiliao: "",
      zhiliao_data: []
    };
  },
  created() {
    var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
    this.orderPageShowOrgName = signInfo.orgId == 0;
    if (this.page.pageNo == undefined) {
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 7 }
      );
    } else {
      this.getlistData(
        { pageNo: this.page.pageNo, pageSize: this.page.pageSize },
        { type: 7, carNumber: this.page.carNumber }
      );

      this.pageSize = this.page.pageSize;
      this.pageNo = this.page.pageNo;
      this.carPai = this.page.carNumber;
    }
  },

  methods: {
    formartTime(row) {
      return net.dateFormat(row.inputTime, 1);
    },
    //获取下拉数据
    getSelectDtat(index, orgId) {
      let url = "";
      if (index == 1) {
        url = "admin/engineer/CZListByOrgId";
      }
      if (index == 2) {
        url = "admin/engineer/JCListByOrgId";
      }
      if (index == 3) {
        url = "admin/engineer/GDListByOrgId";
      }
      if (index == 4) {
        url = "admin/engineer/ZLListByOrgId";
      }
      net.request(url, "post", { orgId: orgId }).then(res => {
        if (index == 1) {
          this.chaizhuang_data = res.data;
        }
        if (index == 2) {
          this.jiance_data = res.data;
        }
        if (index == 3) {
          this.gendan_data = res.data;
        }
        if (index == 4) {
          this.zhiliao_data = res.data;
        }
      });
    },
    //冻结
    frozen(row) {
      this.$confirm("此操作将冻结此工单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        net
          .request("admin/abnormalOrder/frozenByUser", "post", {
            jobId: row.jobId,
            version: row.version
          })
          .then(res => {
            if (res.retcode == 1) {
              net.message(this, "操作成功", "success");
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 7 }
              );
            }
          });
      });
    },
    cancel() {
      this.mile = "";
      this.jobId = "";
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 7 }
      );
    },
    //根据id获取图片路径
    getPicUrl(id) {
      net
        .request(net.imageHP + "image/get", "get", {
          imageId: id
        })
        .then(res => {
          console.log(res);
        });
    },
    //获取产品信息
    getProductInfo(callback) {
      callback = callback || function() {};
      net.request("admin/product/selectProductList", "post", {}).then(res => {
        if (res.retcode == 1) {
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            var item = { value1: "", id: data[i].id };
            this.dataModel.push(item);
          }
          this.productArr = data;
          console.log(this.productArr);
          console.log(11111);
          callback();
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    // 监听输入框文字
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
    //查询产品用量
    searchProUse() {
      net
        .request("admin/order/queryProductInfoList", "post", {
          jobId: this.jobId
        })
        .then(res => {
          if (res.retcode == 1) {
            var data = res.data.rows;
            for (var i = 0; i < data.length; i++) {
              if (data[i].number != 0) {
                this.checkProList.push(data[i].productId);
                for (var j = 0; j < this.dataModel.length; j++) {
                  if (this.dataModel[j].id == data[i].productId) {
                    this.dataModel[j]["value1"] = data[i].number;
                  }
                }
              }
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    //添加产品用量
    addProductNumber() {
      var params = {
        version: this.version,
        jobId: this.jobId
      };
      var data = this.getProArgs();
      net
        .request("admin/order/writeProductInfo", "post", params, data)
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            this.version = res.data;
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    //获取产品用量参数对象
    getProArgs() {
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
    //编辑图片按钮
    editOnloadClick(row) {
      this.getSelectDtat(1, row.orgId);
      this.getSelectDtat(2, row.orgId);
      this.getSelectDtat(3, row.orgId);
      this.getSelectDtat(4, row.orgId);
      this.photoList = [];
      this.dialogVisible = true;
      this.mile = row.mile;
      this.jobId = row.jobId;
      this.jobCode = row.jobCode;
      this.carNumber = row.carNumber;
      this.fileList = [];
      this.fileList1 = [];
      this.sign = 1;
      this.version = row.version;
      this.title = "编辑复查照片";
      this.getProductInfo(() => {
        //初始化产品用量
        this.searchProUse();
      });
      net
        .request("admin/car/queryById", "post", {
          carId: row.carId
        })
        .then(res => {
          if (res.retcode == 1) {
            this.fuelTypeName = res.data.fuelTypeName;
            this.oilDeplete = res.data.oilDeplete;
            this.modelName = res.data.modelName;
            this.brandName = res.data.seriesName;
            this.carCount = res.data.carNumber;
            var arr = res.data.list;
            net
              .request("admin/car/queryCarTestingPhoto", "post", {
                jobId: this.jobId,
                step: 2
              })
              .then(d => {
                var data = d.data;
                for (var i = 0; i < arr.length; i++) {
                  for (var j = 0; j < data.length; j++) {
                    if (arr[i].optionId == data[j].optionId) {
                      arr[i]["isQualified"] = data[j].isQualified;
                      var obj = {};
                      if (data[j].photoId != null && data[j].photoId > 0) {
                        obj["url"] =
                          net.imageHP + "image/get?imageId=" + data[j].photoId;
                        arr[i].list.push(obj);
                        arr[i]["photoId"] = data[j].photoId;
                      } else {
                        arr[i]["isQualified"] = data[j].isQualified;
                      }
                    }
                  }
                }
                for (var g = 0; g < data.length; g++) {
                  var obj1 = {};
                  if (data[g].photoId != null && data[g].photoId > 0) {
                    obj1["url"] =
                      net.imageHP + "image/get?imageId=" + data[g].photoId;

                    if (data[g].optionId == -2) {
                      this.carPhotoId = data[g].photoId;
                      this.fileList.push(obj1);
                      this.s1 = data[g].isQualified;
                    }
                    if (data[g].optionId == -11) {
                      this.framePhotoId = data[g].photoId;
                      this.fileList1.push(obj1);
                      this.s2 = data[g].isQualified;
                    }

                    this.photoList.push({
                      optionId: data[g].optionId,
                      photoId: data[g].photoId
                    });
                    // console.log(this.photoList)
                  } else {
                    if (data[g].optionId == -2) {
                      this.s1 = data[g].isQualified;
                    }
                    if (data[g].optionId == -11) {
                      this.s2 = data[g].isQualified;
                    }
                  }
                }
                this.placeData = arr;
                console.log(arr);
                setTimeout(() => {
                  this.ctroOnloadBtn();
                }, 1000);
              });
          } else {
            net.message(this, "获取车辆信息异常", "warning");
          }
        });
    },
    //上传图片按钮
    onloadClick(row) {
      this.getSelectDtat(1, row.orgId);
      this.getSelectDtat(2, row.orgId);
      this.getSelectDtat(3, row.orgId);
      this.getSelectDtat(4, row.orgId);
      this.dialogVisible = true;
      this.mile = row.mile;
      this.jobId = row.jobId;
      this.jobCode = row.jobCode;
      this.fileList = [];
      this.fileList1 = [];
      this.dataModel = [];
      this.checkProList = [];
      this.carNumber = row.carNumber;
      this.sign = 0;
      this.title = "上传复查照片";
      this.version = row.version;
      this.getProductInfo(() => {
        //初始化产品用量
        this.searchProUse();
      });
      net
        .request("admin/car/queryById", "post", { carId: row.carId })
        .then(res => {
          if (res.retcode == 1) {
            this.fuelTypeName = res.data.fuelTypeName;
            this.oilDeplete = res.data.oilDeplete;
            this.modelName = res.data.modelName;
            this.brandName = res.data.brandName;
            this.carCount = res.data.carNumber;
            this.placeData = res.data.list;
          } else {
            net.message(this, "获取车辆信息异常", "warning");
          }
        });
    },
    //监听改变
    change(idx, file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    //修改过实时更新照片不合格状态
    updatePicState(optionId) {
      if (optionId == -1) {
        this.s2 = 1;
      }
      if (optionId == -11) {
        this.s1 = 1;
      }
      var arr = this.placeData;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].optionId == optionId) {
          arr[i].isQualified = 1;
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
      console.log(this.photoList);
      this.photoList.push({ optionId: optionId, photoId: response.data });
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

    uploadImgs() {
      let paramImg = {
        jobId: this.jobId,
        version: this.version,
        chaiZhuang: this.chaizhuang || 0,
        jianCe: this.jiance || 0,
        genDan: this.gendan || 0,
        zhiLiao: this.zhiliao || 0
      };
      if (this.jobCode == 600 && this.photoId == undefined) {
        paramImg["jobCode"] = 630;
      }
      if (this.jobCode == 630 || this.jobCode == 631 || this.jobCode == 632) {
        paramImg["jobCode"] = 631;
      }
      if (
        this.chaizhuang.length == 0 ||
        this.jiance.length == 0 ||
        this.gendan.length == 0
      ) {
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
        if (this.zhiliao.length === 0) {
          title += " 治疗技师";
        }
        if (this.jobCode == 620) {
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
            this.ensureUpload(paramImg);
          });
        } else {
          this.ensureUpload(paramImg);
        }
      } else {
        this.ensureUpload(paramImg);
      }
    },
    ensureUpload(paramImg) {
      net
        .request(
          "admin/order/uploadSecondPhotoList",
          "post",
          paramImg,
          this.photoList
        )
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            this.version = res.data;
            // this.updatePicState(optionId);
            this.dialogVisible = false;
            this.getlistData(
              { pageNo: this.pageNo, pageSize: this.pageSize },
              { type: 7 }
            );
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
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
    handleExceed() {
      net.message(this, "同时上传限制一个图，请先删除前面上传的图片", "error");
      // console.log("限制回调", files, fileList);
    },
    //完成复查上传
    complete(row) {
      this.progressBar = true;
      this.loadProgress = true;
      let that = this;
      net
        .request("admin/order/completeRecheck", "post", {
          jobId: row.jobId,
          version: row.version
        })
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            var skip = net.isJump("/editRecheck");
            if (skip) {
              this.$router.push({ path: "/editRecheck" });
            } else {
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 7 }
              );
            }
            var dsq = setInterval(function() {
              that.used = that.used + 1;
              if (that.used == 100) {
                clearInterval(dsq);
                net.message(that, res.retmsg, "success");
                var skip = net.isJump("/editRecheck");
                if (skip) {
                  that.$router.push({ path: "/editRecheck" });
                } else {
                  that.getlistData(
                    { pageNo: that.pageNo, pageSize: that.pageSize },
                    { carNumber: that.carPai, type: 7 }
                  );
                }
                that.progressBar = false;
              }
            }, 50);
          } else {
            that.progressBar = false;
            net.message(that, res.retmsg, "error");
          }
        });
    },
    //获取列表数据
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
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 7 }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 7 }
      );
    },
    search() {
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 7, carNumber: this.carPai }
      );
    },
    //点击显示放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    seeFirstReport(row) {
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 4,
          row: row,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          carNumber: this.carPai,
          enter: false,
          print: true
        }
      });
    }
  },
  filters: {
    type(d) {
      var arr = ["", "检测", "治疗", "检测+治疗"];
      return arr[d];
    }
  }
};
</script>
<style lang='less'>
.onloadFirstPic {
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
    .bottonContent {
      display: flex;
      max-height: 500px;
      overflow-y: scroll;
      .onlodList {
        width: 40%;
        margin-left: 82px;
        padding: 5px 0;
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
  }
  .el-upload-list--picture-card:not(:empty) + .el-upload--picture-card {
    display: none;
  }
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

