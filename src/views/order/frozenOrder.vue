<template>
  <div>
    <div v-show="showTable">
      <div class="searchContent">
        <el-input placeholder="请输入车牌号" v-model="carPai" clearable></el-input>
        <el-input placeholder="请输入维修站" v-model="orgSearch" clearable></el-input>
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
          <el-table-column align="center" label="冻结类型">
            <template slot-scope="scope">
              <span>{{scope.row.frozenStatus==1?"系统冻结":scope.row.frozenStatus==2?"人工冻结":"其他" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="工单状态">
            <template slot-scope="scope">
              <span>{{scope.row.jobCode | orderState }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作记录" align="center" width="140">
            <template slot-scope="scope">
              <el-button @click="lockOver(scope.row)" type="success" size="small">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="310">
            <template slot-scope="scope">
              <el-button
                @click="operation(scope.row,1)"
                style="background: #009688;color:#fff"
                size="small"
              >恢复工单</el-button>
              <el-button @click="operation(scope.row,2)" type="danger" size="small">作废工单</el-button>
              <el-button
                v-show="scope.row.jobCode>=600"
                @click="operation(scope.row,3)"
                type="primary"
                size="small"
                style="margin-top:5px;"
              >异常完成</el-button>
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
      <el-dialog title="异常完成工单" :visible.sync="dialogVisible" width="40%">
        <div class="Consumption">
          <p>此操作将直接跳过工单流程,将订单状态设置为完成</p>
          <span>此操作无法逆转,请谨慎操作!!!</span>
          <div style="margin-top:20px;margin-left:20px;">
            <div style="display:flex;justify-content: center;">
              <p
                style="text-align: left;line-height: 36px;padding-left: 20px;font-weight: bold;font-size: 16px;"
              >产品用量</p>
              <!-- <el-button type="success" size="small" @click="addProductNumber">保存产品用量</el-button> -->
            </div>
            <div style="margin-top:15px;display:flex;flex-direction: row;justify-content: center;">
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProductNumber">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible3">
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
import $ from "jquery";
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
      jobCode: "",
      isUse: false,
      carPai: null,
      orgSearch: null,
      carSeSearch: null,
      checkType: null,
      dialogVisible3: false,
      seeArr: [],
      switchPage: true,
      page: this.$route.params,
      checkProList: [],
      productArr: [],
      dataModel: [], //暂存计步器双休绑定
      version: []
    };
  },
  created() {
    var signInfo = JSON.parse(sessionStorage.getItem("signInfo"));
    this.orderPageShowOrgName = signInfo.orgId == 0;
    if (this.page.pageNo == undefined) {
      this.getlistData(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { type: 11 }
      );
    } else {
      this.getlistData(
        { pageNo: this.page.pageNo, pageSize: this.page.pageSize },
        { type: 11, carNumber: this.page.carNumber }
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
    },
    orderState(d) {
      let str = "其他";
      if (d <= 10) {
        str = "待检测工单";
      }
      if (d > 10 && d < 100) {
        str = "待上传照片";
      }
      if (d > 100 && d < 230) {
        str = "待编辑报告";
      }
      if (d == 230) {
        str = "待审核报告";
      }
      if (d >= 500 && d <= 510) {
        str = "治疗单待确认";
      }
      if (d == 550) {
        str = "待复查工单";
      }
      if (d >= 600 && d <= 700) {
        str = "待上传复查照片";
      }
      if (d >= 700 && d <= 850) {
        str = "待编辑复查报告";
      }
      if (d == 850) {
        str = "复查报告待审";
      }
      if (d >= 1000) {
        str = "工单已完成";
      }
      return str;
    }
  },
  methods: {
    formartTime(row) {
      return net.dateFormat(row.inputTime, 1);
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
    //保存产品用量
    addProductNumber() {
      var params = {
        version: this.version,
        jobId: this.jobId
      };
      var data = this.getProArgs();
      net
        .request("admin/abnormalOrder/specialComplete", "post", params, data)
        .then(res => {
          if (res.retcode == 1) {
            this.version = res.data;
            net.message(this, "操作成功", "success");
            this.dialogVisible = false;
            this.getlistData(
              { pageNo: this.pageNo, pageSize: this.pageSize },
              {
                type: 11,
                carNumber: this.carPai,
                orgName: this.orgSearch,
                seriesName: this.carSeSearch,
                checkType: this.checkType
              }
            );
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
    //操作
    operation(row, index) {
      let title = "",
        url;
      if (index == 1) {
        title = "恢复";
        url = "admin/abnormalOrder/renewByUser";
      }
      if (index == 2) {
        title = "作废";
        url = "admin/abnormalOrder/discardByUser";
      }
      if (index == 1 || index == 2) {
        this.$confirm("此操作将" + title + "此工单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          net
            .request(url, "post", {
              jobId: row.jobId,
              version: row.version
            })
            .then(res => {
              if (res.retcode == 1) {
                net.message(this, "操作成功", "success");
                this.getlistData(
                  { pageNo: this.pageNo, pageSize: this.pageSize },
                  {
                    type: 11,
                    carNumber: this.carPai,
                    orgName: this.orgSearch,
                    seriesName: this.carSeSearch,
                    checkType: this.checkType
                  }
                );
              }
            });
        });
      }
      if (index == 3) {
        this.dialogVisible = true;
        this.version = row.version;
        this.jobId = row.jobId;
        this.getProductInfo(() => {
          //初始化产品用量
          this.searchProUse();
        });
      }
    },
    getlistData(param, data) {
      net
        .request("/admin/abnormalOrder/frozenPage", "post", param, data)
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
          type: 11,
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
          type: 11,
          carNumber: this.carPai,
          orgName: this.orgSearch,
          seriesName: this.carSeSearch,
          checkType: this.checkType
        }
      );
    },

    record(jobId, step) {
      net
        .request("admin/order/OperationMark", "post", {
          jobId: jobId,
          step: step
        })
        .then(res => {
          console.log(res);
        });
    },
    search() {
      this.pageNo = 1;
      (this.pageSize = 10),
        this.getlistData(
          { pageNo: this.pageNo, pageSize: this.pageSize },
          {
            type: 11,
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
.Consumption {
  display: flex;
  flex-direction: column;
  line-height: 32px;
  font-size: 18px;
  span {
    color: #f40;
  }
}
.searchContent {
  margin: 10px 0 20px 0;
  display: flex;
  flex-direction: row;
  .el-input--suffix {
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

