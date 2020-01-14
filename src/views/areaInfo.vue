<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入区" v-model="areaName " clearable></el-input>
      <el-input placeholder="请输入省" v-show="isShowProvince" v-model="provinceName " clearable></el-input>
      <el-input placeholder="请输入市/县" v-show="isShowCity" v-model="cityName " clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addData" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-tabs type="border-card" v-model="tabName" @tab-click="tabClick">
        <el-tab-pane label="区">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="areaName" label="区名" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="editClick(scope.row)"
                  type="success"
                  style="background: #009688;"
                  size="small"
                >修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="省份">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="areaName" label="区名" align="center"></el-table-column>
            <el-table-column prop="provinceName" label="省份" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="editClick(scope.row)"
                  type="success"
                  style="background: #009688;"
                  size="small"
                >修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="市/县">
          <el-table :data="dataList" border style="width: 100%">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="areaName" label="区名" align="center"></el-table-column>
            <el-table-column prop="provinceName" label="省份" align="center"></el-table-column>
            <el-table-column prop="cityName" label="市/县" align="center"></el-table-column>
            <el-table-column prop="cityCode" label="代码" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="editClick(scope.row)"
                  type="success"
                  style="background: #009688;"
                  size="small"
                >修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
    <el-dialog :title="title" :visible.sync="dialogVisible" width="420px">
      <!-- :before-close="handleClose" -->
      <el-select
        v-model="areaId"
        clearable
        placeholder="请选择区"
        style="margin:0 0 15px 0px;width:280px;"
        v-show="isShowProvince"
        @change="areaChange"
      >
        <el-option v-for="item in AreaData" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="provinceId"
        clearable
        placeholder="请选择省份"
        style="margin:0 0 15px 0px;width:280px;"
        v-show="isShowCity"
      >
        <el-option
          v-for="item in provinceData"
          :key="item.id"
          :label="item.provinceName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-input
        :placeholder="inputTitle"
        v-model="publicArgu"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入代码"
        v-model="code"
        style="margin:0 0 15px 0px;width:280px;"
        v-show="isShowCity"
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      publicArgu: "",
      areaName: "",
      provinceName: "",
      cityName: "",
      dataList: [],
      dialogVisible: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tabName: 0,
      urlArr: [
        "admin/areaInfo/queryAreaPage",
        "admin/areaInfo/queryProvincePage",
        "admin/areaInfo/queryCityPage",
        "admin/areaInfo/addArea",
        "admin/areaInfo/addProvince",
        "admin/areaInfo/addCity",
        "admin/areaInfo/updateArea",
        "admin/areaInfo/updateProvince",
        "admin/areaInfo/updateCity"
      ],
      isShowProvince: false,
      isShowCity: false,
      sign: 0, //默认是新增
      add_title: ["新增区信息", "新增省信息", "新增市/县信息"],
      edit_title: ["修改区信息", "修改省信息", "修改市/县信息"],
      placeholder_input: ["请输入区名", "请输入省份", "请输入市县"],
      inputTitle: "",
      title: "",
      areaId: "",
      AreaData: [],
      provinceId: "",
      provinceData: [],
      edit_id: 0,
      edit_key: ["areaName", "provinceName", "cityName"],
      code: ""
    };
  },
  created() {
    this.getList(this.urlArr[this.tabName], { areaName: this.areaName });
  },
  methods: {
    ensure() {
      var url;
      let param = {};
      if (this.sign == 0) {
        //新增
        var s = parseInt(this.tabName) + 3;
        url = this.urlArr[s];
      }
      if (this.sign == 1) {
        //修改
        var s = parseInt(this.tabName) + 6;
        url = this.urlArr[s];
        param["id"] = this.edit_id;
      }
      param[this.edit_key[this.tabName]] = this.publicArgu; //输入框参数
      if (this.isShowProvince == true && this.isShowCity == false) {
        param["areaId"] = this.areaId;
      }
      if (this.isShowCity == true) {
        param["provinceId"] = this.provinceId;
        param["cityCode"] = this.code;
      }
      console.log(param);
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          this.dialogVisible = false;
          this.public(this.tabName);
        }
      });
    },
    addData() {
      //点击新增
      this.dialogVisible = true;
      this.title = this.add_title[this.tabName];
      this.inputTitle = this.placeholder_input[this.tabName];
      this.sign = 0;
      this.publicArgu = "";
      this.areaId = "";
      this.AreaData = [];
      this.provinceId = "";
      this.provinceData = [];
      this.code = "";
      if (this.isShowProvince == true) {
        this.getAllArea();
      }
    },
    editClick(row) {
      //点击修改
      this.dialogVisible = true;
      this.sign = 1;
      this.publicArgu = "";
      this.areaId = "";
      this.AreaData = [];
      this.provinceId = "";
      this.code = "";
      this.provinceData = [];
      this.title = this.edit_title[this.tabName];
      this.inputTitle = this.placeholder_input[this.tabName];
      this.edit_id = row.id;
      if (this.tabName == 0) {
        this.publicArgu = row.areaName;
      }
      if (this.tabName == 1) {
        this.publicArgu = row.provinceName;
        this.getAllArea(() => {
          this.areaId = row.areaId;
        });
      }
      if (this.tabName == 2) {
        this.publicArgu = row.cityName;
        this.getAllArea(() => {
          this.areaId = row.areaId;
          this.getAllProvince(row.areaId, () => {
            this.provinceId = row.provinceId;
          });
        });
        this.code = row.cityCode;
      }
    },
    getAllArea(callback) {
      //获取所有区域
      callback = callback || function() {};
      net.request("admin/select/getArea", "post").then(res => {
        this.AreaData = res.data;
        callback();
      });
    },
    areaChange(value) {
      this.provinceId = "";
      this.provinceData = [];
      this.getAllProvince(value);
    },
    getAllProvince(areaId, callback) {
      //获取所有省份
      callback = callback || function() {};
      net
        .request("admin/select/getProvince", "post", { areaId: areaId })
        .then(res => {
          this.provinceData = res.data;
          callback();
        });
    },
    //获取区列表
    getList(url, data) {
      net
        .request(
          url,
          "post",
          { pageNo: this.pageNo, pageSize: this.pageSize },
          data
        )
        .then(res => {
          if (res.retcode == 1) {
            this.dataList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据异常", "warning");
          }
        });
    },
    //tab点击
    tabClick() {
      this.public(this.tabName);
      if (this.tabName == 0) {
        this.isShowProvince = false;
        this.isShowCity = false;
      }
      if (this.tabName == 1) {
        this.isShowProvince = true;
        this.isShowCity = false;
      }
      if (this.tabName == 2) {
        this.isShowProvince = true;
        this.isShowCity = true;
      }
    },
    search() {
      this.public(this.tabName);
    },
    public(index) {
      var data = {};
      if (index == 0) {
        data = { areaName: this.areaName };
        this.getList(this.urlArr[this.tabName], data);
      }
      if (index == 1) {
        data = {
          areaName: this.areaName,
          provinceName: this.provinceName
        };
        this.getList(this.urlArr[this.tabName], data);
      }
      if (index == 2) {
        data = {
          areaName: this.areaName,
          provinceName: this.provinceName,
          cityName: this.cityName
        };
        this.getList(this.urlArr[this.tabName], data);
      }
    },
    //弹窗确认
    handleSizeChange(val) {
      this.pageSize = val;
      this.public(this.tabName);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.public(this.tabName);
    }
  }
};
</script>
<style lang="less" scoped>
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
  .pagination {
    position: relative;
    margin-top: 20px;
    .el-pagination {
      position: absolute;
      left: 0px;
    }
    .number .active {
      background: #009688 !important;
    }
  }
}
</style>
