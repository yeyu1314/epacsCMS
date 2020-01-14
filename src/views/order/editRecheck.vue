<template>
  <div>
    <div v-show="dialogVisible">
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
          <el-table-column prop="operatorName" align="center" label="当前操作人"></el-table-column>

          <el-table-column fixed="right" label="打印" align="center" min-width="100">
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
          <el-table-column fixed="right" label="操作" align="center" min-width="100">
            <template slot-scope="scope">
              <el-button
                @click="edit(scope.row)"
                type="success"
                :class="scope.row.review == 1 ?'enter':'default'"
                size="small"
              >编辑复查报告</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作记录" align="center">
            <template slot-scope="scope">
              <el-button @click="lockOver(scope.row)" type="success" size="small">查看</el-button>
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
    <div v-show="!dialogVisible">
      <div style="display:flex;margin-top:20px;">
        <el-button type="danger" @click="unqualified" v-show="isShowBtn">照片不合格</el-button>
        <el-button type="primary" @click="keepData" v-show="isShowBtn">保存数据</el-button>
        <el-button type="warning" @click="submitReport" v-show="isShowSub || isShowBtn">提交报告</el-button>
        <el-button type="success" @click="printdiv" v-show="isPower">预览/打印</el-button>
        <el-button type="primary" @click="editMileage">编辑里程</el-button>
        <el-button type="danger" @click="back">返回列表</el-button>
      </div>
      <div style="display:flex;flex-direction: row;">
        <div
          style="width: 210mm;min-width:210mm;height: 297mm;margin-top:15px;display:flex;border:1px solid #eee;flex-direction: column;"
          id="printBody"
        >
          <div
            style="background-repeat: no-repeat;background-size: 100%;height: 100%;"
            :style="{backgroundImage: 'url(' + bg_pic + ')'}"
          >
            <div
              style="font-weight: bold;font-size: 18px;height: 60px;line-height: 60px;text-align:center;width: 158mm;margin: 0 auto;"
            >EPACS复查报告单</div>
            <p
              class="first"
              style="font-size: 14px;text-align: left;font-weight: bold;padding-left: 80px;height: 26px;line-height: 26px;margin:0;margin-bottom:3px"
            >车辆信息</p>
            <div style="display: flex;flex-direction: row;width: 170mm;margin-left:90px;">
              <div style="width: 105px;height:78px;position: relative;">
                <img
                  style=" width: 100%;display:block;"
                  :src="carUrl"
                  alt
                  @mouseenter="mouseEnter(-2)"
                />
                <div
                  class="showCPBigBtn"
                  @mouseleave="mouseLeave()"
                  :data-optionId="-2"
                  style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width: 100%;height: 100%;z-index: 1;"
                >
                  <i
                    class="el-icon-zoom-in"
                    @click="bigIcon(carBigImageID)"
                    style="color: #fff;font-size: 25px;margin: 30px;"
                  ></i>
                </div>
              </div>
              <div style="display: flex;flex-direction: column; margin-left:15px;">
                <div
                  style="line-height: 26px; height: 26px;display: flex;flex-direction: row;padding-left: 20px;font-size: 14px;"
                >
                  <span
                    style="display: inline-block;margin-right: 15px;width: 200px;text-align: left;"
                  >
                    车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌：
                    <span
                      style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                    >{{carNumber}}</span>
                  </span>
                  <span style="display: inline-block;margin-right: 15px;">
                    检测地点：
                    <span
                      style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                    >{{testAddr}}</span>
                  </span>
                </div>
                <div
                  style="line-height: 26px; height: 26px;display: flex;flex-direction: row;padding-left: 20px;font-size: 14px;"
                >
                  <span
                    style="display: inline-block;margin-right: 15px;width: 200px;text-align: left;"
                  >
                    车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系：
                    <span
                      style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                    >{{ReseriesName}}</span>
                  </span>
                  <span style="display: inline-block;margin-right: 15px;">
                    车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：
                    <span
                      style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                    >{{cartype}}</span>
                  </span>
                </div>
                <div
                  style="line-height: 26px; height: 26px;display: flex;flex-direction: row;padding-left: 20px;font-size: 14px;"
                >
                  <span style="display: inline-block;width: 215px;text-align: left;">
                    综合油耗：
                    <span
                      v-if="oilDeplete!=0"
                      style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                    >{{oilDeplete}}L/100km</span>

                    <span
                      v-if="oilDeplete==0"
                      style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </span>
                  <span
                    style="display: inline-block;margin-right: 15px;width: 210px;text-align: left;"
                  >
                    里&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;程：
                    <span
                      style="display: inline-block;height: 25px;padding: 0 5px;border-bottom: 1px solid"
                    >{{mileNumber}}</span>
                  </span>
                </div>
              </div>
            </div>
            <p
              class="second"
              style="text-align: left;width: 200px;margin-left: 80px;font-size: 14px;font-weight: bold;margin-top: 5px;"
            >治疗结果:</p>
            <div style="display:flex;justify-content: space-between;margin-top:10px;">
              <!-- 治疗前 -->
              <div style="width:40%;margin-left: 60px;" class="leftbefore">
                <div style="width:100%">
                  <p
                    class="p_title"
                    style="text-align:center;margin:0 auto;font-size:14px;background: #eee;height: 24px;line-height: 24px;"
                    :style="{width:imgWidth + 'px'}"
                  >治疗前</p>
                </div>
                <div v-for="item in beforeArr" :key="item.optionId">
                  <div
                    class="p_picture"
                    style="position: relative;margin:0 auto;"
                    :style="{width:imgWidth + 'px'}"
                  >
                    <img
                      :src="item.url"
                      v-if="item.url != undefined && item.url != null"
                      alt
                      @mouseenter="mouseEnter(item.photoId)"
                      style="width:100%;display:block"
                    />
                    <p
                      v-else
                      style="width: 100%;height: 100%;border: 1px solid #eee;margin: 0 auto;"
                    ></p>
                    <div
                      class="showBigBtn"
                      @mouseleave="mouseLeave(item.photoId)"
                      :data-optionId="item.photoId"
                      style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width:100%;height:100%;z-index: 1;"
                    >
                      <i
                        class="el-icon-zoom-in"
                        @click="bigIcon(item.photoId)"
                        style="color: #fff;font-size: 25px;"
                        :style="{marginTop: iconTop + 'px'}"
                      ></i>
                    </div>
                  </div>
                  <p style="margin-top:3px;font-size:14px;text-align:center">{{item.optionName}}</p>
                </div>
              </div>
              <!-- 治疗后 -->
              <div style="width:40%;margin-right: 100px;">
                <div style="width:100%">
                  <p
                    class="p_title"
                    style="text-align:center;margin:0 auto;font-size:14px;background: #eee;height: 24px;line-height: 24px;"
                    :style="{width:imgWidth + 'px'}"
                  >治疗后</p>
                </div>
                <div v-for="item in afterArr" :key="item.optionId">
                  <div
                    class="p_picture"
                    style="position: relative;margin:0 auto;"
                    :style="{width:imgWidth + 'px'}"
                  >
                    <img
                      :src="item.url"
                      v-if="item.url != undefined && item.url != null"
                      alt
                      @mouseenter="mouseEnter(item.photoId)"
                      style="width:100%;display:block"
                    />
                    <p
                      v-else
                      style="width: 100%;height: 100%;border: 1px solid #eee;margin: 0 auto;"
                    ></p>
                    <div
                      class="showBigBtn"
                      @mouseleave="mouseLeave(item.photoId)"
                      :data-optionId="item.photoId"
                      style="display:none;position:absolute;top: 0;background: #000;opacity: 0.5;width:100%;height:100%;z-index: 1;"
                    >
                      <i
                        class="el-icon-zoom-in"
                        @click="bigIcon(item.photoId)"
                        style="color: #fff;font-size: 25px;"
                        :style="{marginTop: iconTop + 'px'}"
                      ></i>
                    </div>
                  </div>
                  <p style="margin-top:3px;font-size:14px;text-align:center">{{item.optionName}}</p>
                </div>
              </div>
            </div>
            <!-- 复查结果 -->
            <div class="three">
              <p
                style="margin:5px 0 0 80px;text-align: left;width: 680px;font-size: 14px;font-weight: bold;overflow: hidden;line-height: 42px;"
              >
                <span>复查结果:</span>
                <el-button
                        type="primary"
                        style="padding:8px 7px;margin-top:5px;float: right;margin-right: 80px;"
                        @click="selectTemplate"
                >选择模板</el-button>
              </p>
              <div style="position: relative;" v-show="isprint">
                <el-input
                  type="textarea"
                  id="exCtrl"
                  :autosize="{minRows: 8}"
                  maxlength="230"
                  placeholder="复查结果"
                  v-model="result"
                  style="width:570px;margin-top: 10px;"
                ></el-input>
                <span
                  style="font-size: 14px;position: absolute;bottom: 6px;right: 185px;color: #959595;"
                >还能输入{{exLen}}字</span>
              </div>
              <p
                style="width:570px;height: 40px;text-align: left;padding-left: 110px;"
                v-if="templateBut"
              >

              </p>

              <el-dialog title="对比模板选择" :visible.sync="template" width="500px">
                <p
                  v-for="(item,index) in selectTemplateArr"
                  :key="index"
                  @click="select(item.name)"
                >
                  <el-input
                    type="textarea"
                    style="margin-bottom:10px"
                    :rows="2"
                    disabled
                    placeholder="请输入内容"
                    v-model="item.name"
                  ></el-input>
                </p>
              </el-dialog>

              <p
                v-show="!isprint"
                style="border:1px solid;margin:5px 0 0 90px;line-height: 20px; font-size: 14px;width:570px;word-wrap:break-word;text-align: left;padding: 7px"
              >{{result}}</p>
              <p
                style="margin-left: 90px;padding-right:30px;width:570px;margin-top: 15px;display: flex;justify-content: space-between;"
              >
                <span style="display: inline-block;width: 150px;">影像诊断工程师:{{step2ImageHeader}}</span>
                <span style="display: inline-block;">检测日期:</span>
              </p>
            </div>
          </div>
        </div>
        <div style="margin-top:20px;margin-left:20px;" v-show="showUse">
          <p style="text-align: left;">产品用量</p>
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
                  disabled
                >{{item.productName}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <el-checkbox-group style="display:flex;flex-direction: column;margin-left:10px;">
                <el-input-number
                  :data-id="item.id"
                  style="margin-top: 6px;margin-bottom:5px;"
                  v-for="(item,index) in productArr"
                  :key="index"
                  :min="0"
                  v-model="dataModel[index].value1"
                  @change="handleChange($event,item.id)"
                  size="small"
                  label="描述文字"
                  disabled
                ></el-input-number>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <el-dialog title="部位" :visible.sync="dialogVisible1" width="500px">
          <el-checkbox-group
            v-model="checkedPlace"
            style="display: flex;flex-direction: column;"
            class="carCondi"
          >
            <el-checkbox
              v-for="item in position"
              :label="item.optionId"
              :key="item.optionId"
              style="height: 32px;text-align: left;margin-left:150px;"
            >{{item.optionName}}</el-checkbox>
          </el-checkbox-group>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="selectPlace">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible2" width="700px">
          <div style="width:100%">
            <img :src="bigImage" alt style="width:100%" />
          </div>
        </el-dialog>
      </div>
    </div>
    <el-dialog title="修改里程" :visible.sync="dialogVisible4" width="30%">
      <el-input placeholder="请输入里程" v-model="editMileNumber" maxlength="8" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="ensureEdit">确 定</el-button>
      </span>
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
      //背景图片
      bg_pic: "",
      num1: "",
      listData: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      dialogVisible: true,
      jobId: "",
      orgId: "",
      //参数
      title: "",
      beforeArr: [],
      afterArr: [],
      result:
        "治疗效果非常显著，原来被积碳等沉积物覆盖和包裹的部位经过治疗后，已经露出了金属的光泽。为巩固治疗效果，请在安全行驶的前提下，进行急加速、猛轰油门等操作。建议在每次进站保养时都要给发动机做个健康体检，以便及时发现问题并解决，真正的做到以养代修，保持发动机卓越的动力性和燃油经济性。",
      isprint: true,
      isShowSub: false,
      isShowBtn: true,
      operId: "",
      //车辆信息
      mileNumber: "",
      gasolinetype: "",
      oilDeplete: "",
      testAddr: "",
      carNumber: "",
      brandname: "",
      cartype: "",
      ReseriesName: "",
      isPower: true, //控制打印显隐
      productArr: [],
      checkProList: [],
      dataModel: [], //暂存计步器双休绑定
      useArr: [], //用量暂存
      showUse: true,
      version: "",
      dialogVisible1: false, //照片不合格弹窗
      checkedPlace: [],
      position: [], //部位数据
      carUrl: "", //车牌照片
      carBigImageID: "",
      carPai: null,
      baseArr: [],
      cPlace: "",
      exLen: 0,
      dialogVisible3: false,
      dialogVisible2: false,
      dialogVisible4: false,
      seeArr: [],
      bigImage: "",
      imgWidth: 165, //4张图片165，
      iconTop: 50,
      enterEditing: 0,

      template: false,
      templateBut: true,
      selectTemplateArr: [],
      editMileNumber: "",
      step2ImageHeader: ""
    };
  },
  created() {
    var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
    this.orderPageShowOrgName = signInfo.orgId == 0;
    var args = JSON.parse(sessionStorage.getItem("signInfo"));
    if (args.isPrinting == 0) {
      this.isPower = false;
    }
    this.operId = this.$route.params.operId;
    var row = this.$route.params.row;
    if (this.operId == 2) {
      this.dialogVisible = false;
      this.isShowBtn = false;
      this.showUse = false;
      this.edit(row);
    }
    this.getlistData(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      { type: 8 }
    );
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
    //编辑里程
    editMileage() {
      this.editMileNumber = "";
      this.dialogVisible4 = true;
    },
    //确认编辑
    ensureEdit() {
      let reg = /^\d+$/;
      console.log(this.editMileNumber);
      if (!reg.test(this.editMileNumber)) {
        net.message(this, "里程只能为非负正整数", "error");
        return false;
      }
      net
        .request("admin/order/editJobMile", "post", {
          jobId: this.jobId,
          mile: this.editMileNumber
        })
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, "修改成功", "success");
            this.dialogVisible4 = false;
            this.mileNumber = this.editMileNumber + "km";
          } else {
            net.message(this, res.retmsg, "error");
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
                { carNumber: this.carPai, type: 8 }
              );
            }
          });
      });
    },
    // 查看检测报告
    seeFirstReport(row) {
      this.$router.push({
        name: "InitSurvey",
        params: {
          operId: 5,
          row: row,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          carNumber: this.carPai,
          enter: false,
          print: true
        }
      });
    },
    //监听计步器
    handleChange(val, id) {
      console.log(id, val);
    },
    //取消
    back() {
      if (this.operId == 2) {
        this.$router.push({ path: "/completeOrder" });
      } else {
        this.dialogVisible = true;
        this.getlistData(
          { pageNo: this.pageNo, pageSize: this.pageSize },
          { type: 8, carNumber: this.carPai }
        );
      }
    },

    getlistData(param, data) {
      net
        .request("admin/order/queryListPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.listData = res.data.rows;
            console.log(this.listData);
            for (let i in this.listData) {
              this.listData[i]["review"] = 0;
            }
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
        { type: 8 }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 8 }
      );
    },
    ensure() {},
    edit(row) {
      for (let i in this.listData) {
        this.listData[i]["review"] = 0;
      }
      row.review = 1;
      this.exChange();
      this.dialogVisible = false;
      this.jobId = row.jobId;
      this.jobCode = row.jobCode;
      this.mileNumber = row.mile + "km";
      this.checkProList = [];
      this.dataModel = [];
      this.version = row.version;
      this.getBgImg(row.orgId);
      this.getProductInfo(() => {
        //初始化产品用量
        this.searchProUse();
      });
      if (row.jobCode == 700) {
        this.isShowSub = false;
      } else if (row.jobCode == 800) {
        // this.isShowBtn = false;
        this.isShowSub = true;
      } else {
        this.isShowSub = false;
      }

      //车辆信息
      net
        .request("admin/car/queryById", "post", { carId: row.carId })
        .then(res => {
          this.gasolinetype = res.data.fuelTypeName;
          this.oilDeplete = res.data.oilDeplete;
          this.cPlace = res.data.orgName;
          this.carNumber = res.data.carNumber;
          this.brandname = res.data.brandName;
          this.testAddr = res.data.orgName;
          this.cartype = res.data.modelName;
          this.ReseriesName = res.data.seriesName;
          this.baseArr = res.data.list;
          this.baseArr.unshift({ optionName: "车牌号", optionId: -2 });
          net
            .request("admin/car/queryCarTestingPhoto", "post", {
              //检测前照片
              jobId: this.jobId,
              step: 1
            })
            .then(d => {
              if (d.retcode == 1) {
                var Arr = d.data,
                  before = [];
                this.beforeArr = [];
                this.afterArr = [];
                for (var i = 0; i < Arr.length; i++) {
                  Arr[i]["url"] = net.bigImg + Arr[i].photoId;
                  if (
                    Arr[i].optionId != -1 &&
                    Arr[i].optionId != -11 &&
                    Arr[i].optionId != 5 &&
                    Arr[i].optionId != -2
                  ) {
                    before.push(Arr[i]);
                  }
                  // if (Arr[i].optionId == -1) {
                  //   (Arr[i].optionName = "车牌号"), before.unshift(Arr[i]);
                  //   this.beforeArr.unshift(Arr[i]);
                  // }
                }
                // this.beforeArr = before;
                net
                  .request("admin/car/queryCarTestingPhoto", "post", {
                    //检测后照片
                    jobId: this.jobId,
                    step: 2
                  })
                  .then(r => {
                    if (r.retcode == 1) {
                      var after = [],
                        b_arr = r.data,
                        Arr = [];
                      for (var g = 0; g < b_arr.length; g++) {
                        if (b_arr[g].optionId == -2) {
                          this.carUrl = net.imgUrl + b_arr[g].photoId;
                          this.carBigImageID = b_arr[g].photoId;
                        }
                        for (var j = 0; j < before.length; j++) {
                          if (before[j].optionId == b_arr[g].optionId) {
                            Arr.push(b_arr[g]);
                            break;
                          }
                        }
                      }

                      for (var i = 0; i < Arr.length; i++) {
                        for (let k = 0; k < before.length; k++) {
                          const element = before[k];
                          if (Arr[i].optionId == element.optionId) {
                            this.beforeArr.push(element);
                          }
                        }
                        Arr[i]["url"] = net.bigImg + Arr[i].photoId;
                        if (
                          Arr[i].optionId != -2 &&
                          Arr[i].optionId != -11 &&
                          Arr[i].optionId != 5 &&
                          Arr[i].optionId != -1
                        ) {
                          after.push(Arr[i]);
                        }
                        // if (Arr[i].optionId == -2) {

                        //   Arr[i]["uroptionNamel"] = "车牌号";
                        //   (Arr[i].optionName = "车牌号"), after.unshift(Arr[i]);
                        // }

                        for (let j = 0; j < this.baseArr.length; j++) {
                          if (Arr[i].optionId == this.baseArr[j].optionId) {
                            this.baseArr[j].optionName =
                              this.baseArr[j].optionName + " (已上传图片)";
                          }
                        }
                      }
                      this.afterArr = after;
                      this.trendsEdit(this.beforeArr.length);
                    } else {
                      net.message(this, r.retmsg, "error");
                    }
                  });
              } else {
                net.message(this, d.retmsg, "error");
              }
            });

          net
            .request("admin/order/queryTestingWeb", "post", {
              jobId: this.jobId,
              step: 2
            })
            .then(res => {
              if (res.retcode == 1) {
                if (res.data != null) {
                  this.result = res.data.diagnosticOption;
                  this.step2ImageHeader = res.data.step2ImageHeader;
                  this.exLen = 230 - res.data.diagnosticOption.length;
                } else {
                  this.exLen = 230 - this.result.length;
                }
              } else {
                net.message(this, res.retmsg, "error");
              }
            });
        });
    },
    keepData() {
      let params = {
        jobId: this.jobId,
        diagnosticOption: this.result,
        jobCode: 800,
        version: this.version
      };

      net
        .request("admin/order/writeRecheckExamination", "post", params)
        .then(res => {
          if (res.retcode == 1) {
            this.isShowSub = true;
            this.version = res.data;
            net.message(this, res.retmsg, "suuccess");
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    submitReport() {
      let params = {
        jobId: this.jobId,
        diagnosticOption: this.result,
        jobCode: 850,
        version: this.version
      };
      net
        .request("admin/order/writeRecheckExamination", "post", params)
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "suuccess");
            var skip = net.isJump("/waitVerifyReport");
            if (skip) {
              this.$router.push({ path: "/waitVerifyReport" });
            } else {
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 8 }
              );
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
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
          callback();
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
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
    //照片不合格
    unqualified() {
      this.position = [];
      this.dialogVisible1 = true;
      this.checkedPlace = [];
      console.log(this.baseArr);
      // for(let i=0;i<this.baseArr.length;i++){
      //   if(this.baseArr[i].optionName.substr(-7)=="(已上传图片)"){
      //     this.position.push(this.baseArr[i])
      //   }
      // }
      this.position = this.baseArr;
    },
    selectPlace() {
      var param = {
        version: this.version,
        jobId: this.jobId,
        code: 632
      };
      if (this.checkedPlace.length == 0) {
        net.message(this, "请选择不合格部位", "error");
        return false;
      }
      net
        .request("admin/order/unqualified", "post", param, this.checkedPlace)
        .then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            var skip = net.isJump("/recheckPic");
            if (skip) {
              this.$router.push({ path: "/recheckPic" });
            } else {
              this.getlistData(
                { pageNo: this.pageNo, pageSize: this.pageSize },
                { carNumber: this.carPai, type: 8 }
              );
            }
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
    },
    search() {
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 8, carNumber: this.carPai }
      );
    },
    // 获取背景图
    getBgImg(orgId) {
      this.bg_pic =
        net.imageHP + "web/config/watermark/getImage?orgId=" + orgId;
    },
    exChange() {
      $("#exCtrl").on("input propertychange", e => {
        this.exLen = 230 - e.target.value.length;
      });
    },
    //打印
    printdiv() {
      this.isprint = false;
      this.templateBut = false;
      setTimeout(() => {
        net.printServer(
          document.getElementById("printBody").innerHTML,
          myWindow => {
            setTimeout(() => {
              myWindow.print();
              myWindow.close();
              this.isprint = true;
            }, 1000);
          }
        );
      }, 300);
    },
    //动态控制打印布局
    trendsEdit(len) {
      if (len == 1 || len == 2) {
        this.imgWidth = 270;
        this.iconTop = 90;
      } else if (len == 3) {
        this.imgWidth = 240;
        this.iconTop = 75;
      } else if (len == 4) {
        this.imgWidth = 165;
        this.iconTop = 50;
      }
    },
    //查看记录
    lockOver(row) {
      this.seeArr = [];
      this.dialogVisible3 = true;
      net
        .request("admin/order/queryOrderById", "post", { id: row.jobId })
        .then(res => {
          this.seeArr = res.data.list;
        });
    },
    dateFormat(row) {
      let time = net.dateFormat(row.inputTime);
      return time;
    },
    //鼠标进入图片显示放大按钮
    mouseEnter(d) {
      if (d == -2) {
        $(".showCPBigBtn").hide();
        $(".showCPBigBtn[data-optionid='" + d + "']").show();
        return;
      }

      $(".showBigBtn").hide();
      $(".showBigBtn[data-optionid='" + d + "']").show();
    },
    mouseLeave() {
      $(".showCPBigBtn").hide();
      $(".showBigBtn").hide();
    },
    bigIcon(id) {
      this.dialogVisible2 = true;
      this.bigImage = net.bigImg + id;
    },

    selectTemplate() {
      this.template = true;
      net.request("admin/select/getResult", "post", null, null).then(res => {
        if (res.retcode == 1) {
          this.selectTemplateArr = res.data;
        } else {
          this.$mount.error(res.retmsg);
        }
      });
    },
    select(val) {
      this.result = val;
      this.exLen = 160 - val.length;
      this.template = false;
    }
  }
};
</script>
<style lang='less' scoped>
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
    border-bottom: 1px solid #bfbfbf;
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
    width: 80%;
    margin: 0 auto 0;
    padding: 5px 0;
    max-height: 450px;
    overflow-y: scroll;
  }
}
.enter {
  background-color: #e6a23c;
  border: 1px solid #e6a23c;
}
.default {
  background-color: rgb(0, 150, 136);
  border: 1px solid rgb(0, 150, 136);
}
</style>

