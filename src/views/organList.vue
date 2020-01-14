<template>
  <div id="userList">
    <div v-show="flag">
      <div class="searchContent">
        <el-input placeholder="请输入用户名" v-model="orgName " clearable></el-input>
        <el-input placeholder="请输入负责人姓名" v-model="orgHeaderName " clearable></el-input>
        <el-input placeholder="请输入电话" v-model="orgHeaderPhone " clearable></el-input>
        <el-button
          type="primary"
          style="background: #009688;"
          @click="search"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          type="primary"
          style="background: #009688;"
          @click="addUser"
          icon="el-icon-plus"
        >新增</el-button>
      </div>
      <div class="table">
        <el-table :data="ueseList" border style="width: 100%">
          <el-table-column prop="orgName" label="维修站名" align="center"></el-table-column>
          <el-table-column prop="areaName" label="所在区" align="center"></el-table-column>
          <el-table-column prop="provinceName" label="所在省" align="center"></el-table-column>
          <el-table-column prop="cityName" label="所在市" align="center"></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
          <el-table-column prop="orgHeaderName" label="负责人" align="center"></el-table-column>
          <el-table-column prop="orgHeaderPhone" label="电话" align="center"></el-table-column>
          <el-table-column prop="statement" label="账单日" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click="editClick(scope.row)"
                type="success"
                style="background: #009688;"
                size="small"
              >修改</el-button>
              <el-button @click="editOrg(scope.row)" type="success" size="small">编辑维修站合同</el-button>
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
    </div>
    <div v-show="!flag" class="editOrgPage">
      <div class="orgInfo">
        <div>
          <span>维修站名：{{edit_OrgName}}</span>
          <span>所属区：{{edit_area}}</span>
          <span>所在省：{{edit_province}}</span>
        </div>
        <div>
          <span>所在市：{{edit_city}}</span>
          <span>品牌：{{edit_brand}}</span>
          <span>负责人：{{edit_headMan}}</span>
        </div>
        <div>
          <span>电话：{{edit_phone}}</span>
        </div>
      </div>
      <div class="orgTabs">
        <el-tabs type="border-card">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <div class="orgBtns">
              <el-button type="success" size="small" @click="keepEdit">保存配置</el-button>
              <el-button
                type="info"
                size="small"
                @click="addConfig"
                v-show="this.activeName != 0 "
              >新增配置</el-button>
              <el-button type="warning" size="small" @click="backList">返回列表</el-button>
            </div>
            <el-tab-pane label="默认配置" name="0">
              <el-table :data="defaultArr" border style="width: 100%" :cell-style="rowStyle">
                <el-table-column prop="busName" label="服务名" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.busName,$event,1)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f1">{{scope.row.busName}}</span>
                      <input
                        type="text"
                        class="changeText"
                        v-model="scope.row.model.val_1"
                        v-show="!scope.row.flag.f1"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_1,1)"
                        style="height: 26px;line-height: 26px;text-align: center;"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultPrice" label="价格" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.defaultPrice,$event,2)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f2">{{scope.row.defaultPrice}}</span>
                      <input
                        type="number"
                        class="changeText"
                        v-model="scope.row.model.val_2"
                        v-show="!scope.row.flag.f2"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_2,2,scope.row.defaultPrice)"
                        style="height: 26px;line-height: 26px;text-align: center;"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="proportion" label="维修站分成比例" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.proportion,$event,3)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f3">{{scope.row.proportion}}</span>
                      <input
                        type="number"
                        class="changeText"
                        v-model="scope.row.model.val_3"
                        v-show="!scope.row.flag.f3"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_3,3,scope.row.proportion)"
                        style="height: 26px;line-height: 26px;text-align: center;"
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="分时配置" name="1">
              <el-table :data="defaultArr" border style="width: 100%" :cell-style="rowStyle">
                <el-table-column prop="busName" label="服务名" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.busName,$event,1)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f1">{{scope.row.busName}}</span>
                      <input
                        type="text"
                        class="changeText"
                        v-model="scope.row.model.val_1"
                        v-show="!scope.row.flag.f1"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_1,1)"
                        style="height: 26px;line-height: 26px;text-align: center;width:140px"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultPrice" label="价格" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.defaultPrice,$event,2)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f2">{{scope.row.defaultPrice}}</span>
                      <input
                        type="number"
                        class="changeText"
                        v-model="scope.row.model.val_2"
                        v-show="!scope.row.flag.f2"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_2,2,scope.row.defaultPrice)"
                        style="height: 26px;line-height: 26px;text-align: center;width:140px"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="proportion" label="维修站分成比例" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.proportion,$event,3)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f3">{{scope.row.proportion}}</span>
                      <input
                        type="number"
                        class="changeText"
                        v-model="scope.row.model.val_3"
                        v-show="!scope.row.flag.f3"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_3,3,scope.row.proportion)"
                        style="height: 26px;line-height: 26px;text-align: center;width:140px"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="start" label="开始时间" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.start,$event,4)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f4">{{scope.row.start}}</span>
                      <el-date-picker
                        v-model="scope.row.model.val_4"
                        v-show="!scope.row.flag.f4"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_4,4,scope.row.start)"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width:140px;"
                        class="start"
                      ></el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="end" label="结束时间" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.end,$event,5)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f5">{{scope.row.end}}</span>
                      <el-date-picker
                        v-model="scope.row.model.val_5"
                        v-show="!scope.row.flag.f5"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_5,5,scope.row.end)"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width:140px;"
                        class="changeText"
                      ></el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="deleteCell(scope.row)" type="success" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="特殊车型配置" name="2">
              <el-table :data="defaultArr" border style="width: 100%" :cell-style="rowStyle">
                <el-table-column prop="busName" label="服务名" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.busName,$event,1)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f1">{{scope.row.busName}}</span>
                      <input
                        type="text"
                        class="changeText"
                        v-model="scope.row.model.val_1"
                        v-show="!scope.row.flag.f1"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_1,1)"
                        style="width: 110px;height: 26px;line-height: 26px;text-align: center;"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultPrice" label="价格" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.defaultPrice,$event,2)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f2">{{scope.row.defaultPrice}}</span>
                      <input
                        type="number"
                        class="changeText"
                        v-model="scope.row.model.val_2"
                        v-show="!scope.row.flag.f2"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_2,2,scope.row.defaultPrice)"
                        style="width: 110px;height: 26px;line-height: 26px;text-align: center;"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="proportion" label="维修站分成比例" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.proportion,$event,3)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f3">{{scope.row.proportion}}</span>
                      <input
                        type="number"
                        class="changeText"
                        v-model="scope.row.model.val_3"
                        v-show="!scope.row.flag.f3"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_3,3,scope.row.proportion)"
                        style="width: 110px;height: 26px;line-height: 26px;text-align: center;"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="start" label="开始时间" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.start,$event,4)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f4">{{scope.row.start}}</span>
                      <el-date-picker
                        v-model="scope.row.model.val_4"
                        v-show="!scope.row.flag.f4"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_4,4,scope.row.start)"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width:110px;"
                        class="start"
                      ></el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="end" label="结束时间" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.end,$event,5)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f5">{{scope.row.end}}</span>
                      <el-date-picker
                        v-model="scope.row.model.val_5"
                        v-show="!scope.row.flag.f5"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_5,5,scope.row.end)"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width:110px;"
                        class="changeText"
                      ></el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="modelName" label="车型" align="center">
                  <template slot-scope="scope">
                    <div
                      @dblclick="cellDblclick(scope.row,scope.row.modelName,$event,6)"
                      class="publicTd"
                    >
                      <span v-show="scope.row.flag.f6">{{scope.row.modelName}}</span>
                      <input
                        type="number"
                        class="changeText"
                        v-model="scope.row.model.val_6"
                        v-show="!scope.row.flag.f6"
                        @blur="cellBlur(scope.row,$event,scope.row.model.val_6,6,scope.row.modelName)"
                        style="height: 26px;line-height: 26px;text-align: center;"
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="deleteCell(scope.row)" type="success" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-tabs>
      </div>
    </div>
    <el-dialog :title="tableTitle" :visible.sync="dialogVisible" width="420px">
      <!-- :before-close="handleClose" -->
      <el-input
        placeholder="请输入维修站名"
        v-model="edit_orgName"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入负责人姓名"
        v-model="edit_orgHeaderName"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入联系电话"
        v-model="edit_orgHeaderPhone"
        style="margin:0 0 15px 0px;width:280px;"
        clearable
      ></el-input>
      <el-select
        v-model="selectBrand"
        clearable
        placeholder="请选择品牌"
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option v-for="item in brandAll" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="sel_area"
        clearable
        placeholder="请选择区"
        style="margin:0 0 15px 0px;width:280px;"
        @change="areaChange"
      >
        <el-option v-for="item in areaArr" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="sel_province"
        clearable
        placeholder="请选择省"
        @change="provinceChange"
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option
          v-for="item in provinceArr"
          :key="item.id"
          :label="item.provinceName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="sel_city"
        clearable
        placeholder="请选择市/县"
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option v-for="item in cityArr" :key="item.id" :label="item.cityName" :value="item.id"></el-option>
      </el-select>
      <el-input
        placeholder="请输入账单日"
        v-model="edit_statement"
        style="margin:0 0 15px 0px;width:280px;"
        type="number"
        :disabled="isDisable"
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择车型" :visible.sync="dialogVisible_type" width="420px">
      <el-select
        v-model="selectBrand"
        clearable
        placeholder="请选择品牌"
        style="margin:0 0 15px 0px;width:280px;"
        @change="brandChange"
      >
        <el-option v-for="item in brandAll" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="value2"
        clearable
        placeholder="请选择主机厂商"
        style="margin:0 0 15px 0px;width:280px;"
        @change="hostChange"
      >
        <el-option
          v-for="item in hostData"
          :key="item.id"
          :label="item.factoryName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="value3"
        clearable
        placeholder="请选择车系"
        style="margin:0 0 15px 0px;width:280px;"
        @change="audiChange"
      >
        <el-option
          v-for="item in audiData"
          :key="item.id"
          :label="item.seriesName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="value4"
        clearable
        placeholder="请选择车型"
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option
          v-for="item in carTypeData"
          :key="item.id"
          :label="item.modelName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_type = false">取 消</el-button>
        <el-button type="primary" @click="carTypeEnsure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../assets/js/public";
import $_ from "jquery";
export default {
  data() {
    return {
      //编辑页面显示参数
      edit_OrgName: "",
      edit_area: "",
      edit_province: "",
      edit_city: "",
      edit_brand: "",
      edit_headMan: "",
      edit_phone: "",
      tableTitle: "",

      ueseList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      organization: null,
      //四级联动
      selectBrand: "", //品牌选择
      brandAll: [],
      value2: "", //主机选择
      hostData: [],
      value3: "", //车系选择
      audiData: [],
      value4: "", //车型选择
      carTypeData: [],

      sel_area: "", //区
      areaArr: [],
      sel_province: "", //省
      provinceArr: [],
      sel_city: "", //市
      cityArr: [],
      dialogVisible: false,
      orgName: "",
      edit_orgName: "",
      orgHeaderName: "",
      edit_orgHeaderName: "",
      orgHeaderPhone: "",
      edit_orgHeaderPhone: "",
      enit_id: "",
      sign: 0, //用来判断是新增还是修改

      flag: true, //切换编辑页面
      activeName: "0",
      orgId: "",
      defaultArr: [],
      busName: "",
      defaultPrice: "",
      proportion: "",
      orgTitle: ["编辑默认配置", "分时段配置", "特殊车型配置"],
      editTitle: "",
      moduleArr: [], //模板数组
      dialogVisible_type: false, //控制选择车型弹框
      carIndex: 0, //暂存特殊车型双击的索引
      edit_statement:"",//账单日
      isDisable:false
    };
  },
  created() {
    this.getOrignList(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      {
        orgName: this.orgName,
        orgHeaderName: this.orgHeaderName,
        orgHeaderPhone: this.orgHeaderPhone
      }
    );
  },
  methods: {
    //点击新增
    addUser() {
      this.getAllbrand();
      this.getAllarea();
      this.dialogVisible = true;
      this.edit_orgName = "";
      this.edit_orgHeaderName = "";
      this.edit_orgHeaderPhone = "";
      this.enit_id = "";
      this.selectBrand = "";
      this.sel_area = "";
      this.sel_province = "";
      this.sel_city = "";
      this.statement = "";
      this.sign = 0;
      this.edit_statement = "";
      this.tableTitle = "新增维修站";
      this.isDisable = false;
    },
    editClick(row) {
      //修改
      this.getAllbrand();
      this.getAllarea(() => {
        this.sel_area = row.areaId;
        this.getAllprovince(row.areaId, () => {
          this.sel_province = row.provinceId;
          this.getAllcity(row.provinceId, () => {
            this.sel_city = row.cityId;
          });
        });
      });
      this.dialogVisible = true;
      this.edit_orgName = row.orgName;
      this.edit_orgHeaderName = row.orgHeaderName;
      this.edit_orgHeaderPhone = row.orgHeaderPhone;
      this.selectBrand = row.brandId;
      this.enit_id = row.id;
      this.edit_statement = parseInt(row.statement);
      this.sign = 1;
      this.tableTitle = "修改维修站";
      this.isDisable = true;
    },
    //监听下拉
    areaChange(value) {
      if (value == "") {
        this.sel_province = "";
        this.sel_city = "";
        return false;
      }
      this.getAllprovince(value);
    },
    provinceChange(value) {
      if (value == "") {
        this.sel_city = "";
        return false;
      }
      this.getAllcity(value);
    },
    //确认修改
    ensure() {
      if(this.edit_orgName == ""){
        net.message(this,"请输入维修站名","error");
        return false;
      }
      if(this.edit_orgHeaderName == ""){
        net.message(this,"请输入负责人姓名","error");
        return false;
      }
       if(this.edit_orgHeaderPhone == ""){
        net.message(this,"请输入负责人电话","error");
        return false;
      }
       if(this.selectBrand == ""){
        net.message(this,"请选择品牌","error");
        return false;
      }
       if(this.sel_city == ""){
        net.message(this,"请选择市/县","error");
        return false;
      }
      if(this.edit_statement> 28 || this.edit_statement < 1){
        net.message(this,"输入1~28的整数","error");
        return false;
      }
      let param = {
        brandId: this.selectBrand,
        cityId: this.sel_city,
        orgName: this.edit_orgName,
        orgHeaderName: this.edit_orgHeaderName,
        orgHeaderPhone: this.edit_orgHeaderPhone,
      };
      let url;
      if (this.sign == 1) {
        url = "admin/Organization/updateOrganization";
        param["id"] = this.enit_id;
      }
      if (this.sign == 0) {
        url = "admin/Organization/addOrganization";
        param["statement"] = this.edit_statement;
      }
      net.request(url, "post", null, param).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          this.getOrignList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            {
              orgName: this.orgName,
              orgHeaderName: this.orgHeaderName,
              orgHeaderPhone: this.orgHeaderPhone
            }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },

    //获取列表数据
    getOrignList(param, data) {
      net
        .request("admin/Organization/queryPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.ueseList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrignList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          orgName: this.orgName,
          orgHeaderName: this.orgHeaderName,
          orgHeaderPhone: this.orgHeaderPhone
        }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getOrignList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          orgName: this.orgName,
          orgHeaderName: this.orgHeaderName,
          orgHeaderPhone: this.orgHeaderPhone
        }
      );
    },

    search() {
      //查询
      this.getOrignList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          orgName: this.orgName,
          orgHeaderName: this.orgHeaderName,
          orgHeaderPhone: this.orgHeaderPhone
        }
      );
    },
    //获取品牌数据
    getAllbrand(callback) {
      callback = callback || function() {};
      net.request("admin/select/getCarBrand", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.brandAll = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    brandChange(value) {
      this.hostData = [];
      this.audiData = [];
      this.carTypeData = [];
      this.value2 = "";
      this.value3 = "";
      this.value4 = "";
      this.gethostData(value);
    },
    //获取主机厂商
    gethostData(brandId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCarFactory", "post", { brandId: brandId })
        .then(res => {
          if (res.retcode == 1) {
            this.hostData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    hostChange(value) {
      this.audiData = [];
      this.carTypeData = [];
      this.value3 = "";
      this.value4 = "";
      this.getaudiData(value);
    },
    //获取车系
    getaudiData(factoryId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCarSeries", "post", { factoryId: factoryId })
        .then(res => {
          if (res.retcode == 1) {
            this.audiData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    audiChange(value) {
      this.carTypeData = [];
      this.value4 = "";
      this.getcarTypeData(value);
    },
    //获取车型
    getcarTypeData(seriesId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCarModel", "post", { seriesId: seriesId })
        .then(res => {
          if (res.retcode == 1) {
            this.carTypeData = res.data;
            callback();
          } else {
            net.message(this, res.retmsg, "warning");
          }
        });
    },
    //获取区数据
    getAllarea(callback) {
      callback = callback || function() {};
      net.request("admin/select/getArea", "post", {}).then(res => {
        if (res.retcode == 1) {
          this.areaArr = res.data;
          callback();
        } else {
          net.message(this, "获取数据失败", "warning");
        }
      });
    },
    //获取省数据
    getAllprovince(areaId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getProvince", "post", { areaId: areaId })
        .then(res => {
          if (res.retcode == 1) {
            this.provinceArr = res.data;
            callback();
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    //获取市数据
    getAllcity(provinceId, callback) {
      callback = callback || function() {};
      net
        .request("admin/select/getCity", "post", { provinceId: provinceId })
        .then(res => {
          if (res.retcode == 1) {
            this.cityArr = res.data;
            callback();
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    //监听tabs切换
    handleClick() {
      this.getDefault(this.orgId);
    },
    //编辑维修站合同
    editOrg(row) {
      this.flag = false;
      this.edit_OrgName = row.orgName;
      this.edit_area = row.areaName;
      this.edit_province = row.provinceName;
      this.edit_city = row.cityName;
      this.edit_brand = row.brandName;
      this.edit_headMan = row.orgHeaderName;
      this.edit_phone = row.orgHeaderPhone;
      this.orgId = row.id;
      this.getDefault(row.id);
    },
    //获取列表
    getDefault(orgId) {
      let url;
      if (this.activeName == 0) {
        url = "admin/business/queryBusiness";
      }
      if (this.activeName == 1) {
        url = "admin/business/queryBusinessTimeList";
      }
      if (this.activeName == 2) {
        url = "admin/business/queryBusinessModelTimeList";
      }
      net.request(url, "post", { orgId: orgId }).then(res => {
        var data = [],
          listTemplate = [];
        if (res.retcode == 1) {
          if (this.activeName == 0) {
            data = res.data;
          }
          if (this.activeName == 1 || this.activeName == 2) {
            data = res.data.list;
            listTemplate = res.data.listTemplate;
          }
          //处理模板数据
          for (var i = 0; i < listTemplate.length; i++) {
            listTemplate[i]["start"] = listTemplate[i].startTime;
            listTemplate[i]["end"] = listTemplate[i].endTime;
            listTemplate[i]["flag"] = {
              f1: true,
              f2: true,
              f3: true,
              f4: true,
              f5: true,
              f6: true
            };
            var obj = {
              val_1: "",
              val_2: "",
              val_3: "",
              val_4: "",
              val_5: "",
              val_6: ""
            };
            listTemplate[i]["model"] = obj;
            listTemplate[i]["index"] = i + 1;
          }
          this.moduleArr = listTemplate;
          // 处理列表数据
          for (var j = 0; j < data.length; j++) {
            data[j]["proportion"] = data[j].proportion / 100 + "%";
            data[j]["startTime"] = net.dateFormat(data[j].startTime, 0);
            data[j]["endTime"] = net.dateFormat(data[j].endTime, 0);
            data[j]["start"] = data[j].startTime;
            data[j]["end"] = data[j].endTime;
            data[j]["sign"] = 0;
            data[j]["flag"] = {
              f1: true,
              f2: true,
              f3: true,
              f4: true,
              f5: true,
              f6: true
            };
            var obj1 = {
              val_1: "",
              val_2: "",
              val_3: "",
              val_4: "",
              val_5: "",
              val_6: ""
            };
            data[j]["model"] = obj1;
            data[j]["index"] = j + 1;
          }
          this.defaultArr = data;
        } else {
          net.message(this, res.retmsg, "error");
        }
      });
    },
    //保存配置
    keepEdit() {
      let url;
      var editArr = this.defaultArr;
      if (editArr.length != 0) {
        if (this.activeName == 0) {
          url = "admin/business/preservation";
        }
        if (this.activeName == 1) {
          url = "admin/business/preservationTime";
        }
        if (this.activeName == 2) {
          url = "admin/business/preservationBusinessModelTime";
        }
        var baseArr = [];
        for (var i = 0; i < editArr.length; i++) {
          editArr[i]["proportion"] = parseFloat(editArr[i].proportion) * 100;
          editArr[i]["orgId"] = this.orgId;
          editArr[i]["index"] = i + 1;
          if (this.activeName == 1 || this.activeName == 2) {
            if (editArr[i]["start"] != 0 && editArr[i]["start"] != null) {
              editArr[i]["startTime"] = net.dateToTimestamp(
                editArr[i].start + " " + "00:00:00"
              );
            }
            if (editArr[i]["end"] != 0 && editArr[i]["end"] != null) {
              editArr[i]["endTime"] = net.dateToTimestamp(
                editArr[i].end + " " + "23:59:59"
              );
            }
            if (editArr[i]["start"] == null || editArr[i]["end"] == null) {
              console.log(1);
            } else {
              baseArr.push(editArr[i]);
            }
          }
        }
        if (this.activeName == 1 || this.activeName == 2) {
          editArr = baseArr;
        }
        console.log(editArr);
        net.request(url, "post", null, editArr).then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            this.getDefault(this.orgId);
          } else {
            var retmsg = "第" + res.retmsg + "条数据时间段冲突，请重新添加";
            net.message(this, retmsg, "error");
            this.getDefault(this.orgId);
          }
        });
      }
    },
    //返回列表
    backList() {
      this.flag = true;
      this.getOrignList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        {
          orgName: this.orgName,
          orgHeaderName: this.orgHeaderName,
          orgHeaderPhone: this.orgHeaderPhone
        }
      );
    },
    //双击单元格
    cellDblclick(row, Name, event, sign) {
      if (sign == 1) {
        row.flag["f1"] = false;
        row.model.val_1 = Name;
      }
      if (sign == 2) {
        row.flag["f2"] = false;
        row.model.val_2 = Name;
      }
      if (sign == 3) {
        row.flag["f3"] = false;
        row.model.val_3 = parseFloat(Name);
      }
      if (sign == 4) {
        row.flag["f4"] = false;
        row.model.val_4 = Name;
      }
      if (sign == 5) {
        row.flag["f5"] = false;
        row.model.val_5 = Name;
      }
      if (sign == 6) {
        this.dialogVisible_type = true;
        this.selectBrand = "";
        this.value2 = "";
        this.value3 = "";
        this.value4 = "";
        this.getAllbrand();
        this.carIndex = row.index;
      }
      setTimeout(() => {
        $_(".changeText").each(function() {
          $_(this).focus();
        });
        $_(event.target)
          .children(".el-date-editor")
          .children(".el-input__inner")
          .focus();
      }, 300);
    },
    //失去焦点
    cellBlur(row, event, val, sign, s_val) {
      if (sign == 1) {
        row.flag["f1"] = true;
        row.busName = val;
      }
      if (sign == 2) {
        row.flag["f2"] = true;
        if (val <= 0) {
          net.message(this, "价格不能小于0", "error");
          row.defaultPrice = s_val;
          return false;
        }
        row.defaultPrice = val;
      }
      if (sign == 3) {
        row.flag["f3"] = true;
        if (val <= 0 || val > 100) {
          net.message(this, "分成比例在0~100直接", "error");
          row.proportion = s_val;
          return false;
        }
        row.proportion = parseFloat(val).toFixed(2) + "%";
      }
      if (sign == 4) {
        row.flag["f4"] = true;
        if (val == "" || val == null) {
          row.start = 0;
        } else {
          row.start = val;
        }
      }
      if (sign == 5) {
        console.log(val);
        row.flag["f5"] = true;
        if (val == "" || val == null) {
          row.end = 0;
        } else {
          row.end = val;
        }
      }
    },
    //删除某行
    deleteCell(row) {
      console.log(row);
      var index = parseInt(row.index) - 1;
      var sign = row.sign;
      if (sign == 1) {
        //表示删除未保存数据
        this.defaultArr.splice(index, 1);
      }
      var params = { id: row.id };
      if (this.activeName == 1) {
        params["type"] = 1;
      }
      if (this.activeName == 2) {
        params["type"] = 2;
      }
      if (sign == 0) {
        net.request("admin/business/delete", "post", params).then(res => {
          if (res.retcode == 1) {
            net.message(this, res.retmsg, "success");
            this.getDefault(this.orgId);
          } else {
            net.message(this, res.retmsg, "error");
          }
        });
      }
    },
    //新增配置
    addConfig() {
      var array = this.moduleArr;
      for (var i = 0; i < array.length; i++) {
        array[i]["index"] = this.defaultArr.length + 1;
        array[i]["sign"] = 1;
        this.defaultArr.push(array[i]);
      }
    },
    //设置行的样式
    rowStyle() {
      return "padding:0";
    },
    //车型弹窗确定
    carTypeEnsure() {
      var index = this.carIndex;
      var id = this.value4;
      var name;
      for (var i = 0; i < this.carTypeData.length; i++) {
        if (this.carTypeData[i].id == id) {
          name = this.carTypeData[i].labelName;
        }
      }
      if (id == "") {
        net.message(this, "请选择车型", "error");
        return false;
      }
      for (var j = 0; j < this.defaultArr.length; j++) {
        if (this.defaultArr[j].index == index) {
          this.defaultArr[j].modelName = name;
          this.defaultArr[j].modelId = id;
        }
      }
      this.dialogVisible_type = false;
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
  .editOrgPage {
    display: flex;
    flex-direction: column;
    width: 1000px;
    .orgInfo {
      display: flex;
      flex-direction: column;
      text-align: left;
      font-size: 14px;
      // border-bottom: 1px solid #eee;
      margin-bottom: 10px;
      div {
        span {
          display: inline-block;
          width: 300px;
          height: 32px;
          line-height: 32px;
          padding-left: 5px;
        }
      }
    }
    .orgTabs {
      position: relative;
      .orgBtns {
        text-align: left;
        margin-bottom: 15px;
      }
      .publicTd {
        width: 100%;
        height: 42px;
        line-height: 42px;
      }
    }
  }
}
</style>
