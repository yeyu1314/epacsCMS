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
        <el-table :data="ueseList" border style="width: 99%">
          <el-table-column prop="orgName" label="维修站名" align="center"></el-table-column>
          <el-table-column prop="areaName" label="所在区" align="center"></el-table-column>
          <el-table-column prop="provinceName" label="所在省" align="center"></el-table-column>
          <el-table-column prop="cityName" label="所在市" align="center"></el-table-column>
          <el-table-column prop="groupName" label="所在集团" align="center"></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
          <el-table-column prop="orgHeaderName" label="负责人" align="center"></el-table-column>
          <el-table-column prop="orgHeaderPhone" label="电话" align="center"></el-table-column>
          <el-table-column prop="statement" label="账单日" align="center"></el-table-column>
          <el-table-column prop="chargeTime" label="正式收费时间" align="center" :formatter="formartTime"></el-table-column>
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
      <el-select
        v-model="edit_groupId"
        clearable
        placeholder="请选择集团"
        style="margin:0 0 15px 0px;width:280px;"
      >
        <el-option v-for="item in groupArr" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
      </el-select>
      <el-input
        placeholder="请输入账单日"
        v-model="edit_statement"
        style="margin:0 0 15px 0px;width:280px;"
        type="number"
        :disabled="isDisable"
        clearable
      ></el-input>
      <el-date-picker
        style="margin:0 0 15px 0px;width:280px;"
        v-model="downOrderDate"
        type="date"
        value-format="timestamp"
        placeholder="请选择正式收费日期">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../../assets/js/public";
// import $_ from "jquery";
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
      edit_groupName:"",
      edit_groupId:"",
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
      group:"",//集团
      groupArr:[],

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
      isDisable:false,
      downOrderDate : '',//下单日期
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
    formartTime(row) {
      return net.dateFormat(row.chargeTime,1);
    },
    //点击新增
    addUser() {
      this.getAllbrand();
      this.getAllarea();
      this.groupNm()
      this.dialogVisible = true;
      this.edit_orgName = "";
      this.edit_orgHeaderName = "";
      this.edit_orgHeaderPhone = "";
      this.edit_groupName= "";
      this.edit_groupId= "";
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
      this.downOrderDate = '';// 正式收费时间
    },
    editClick(row) {
      console.log(row)
      //修改
      this.getAllbrand();
      this.groupNm()
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
      this.edit_groupId=row.groupId;
      this.enit_id = row.id;
      this.edit_statement = parseInt(row.statement);
      this.sign = 1;
      this.tableTitle = "修改维修站";
      this.isDisable = true;
      this.downOrderDate = row.chargeTime;
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
      console.log('时间戳',this.downOrderDate)
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
        groupId:this.edit_groupId,
        chargeTime : this.downOrderDate,
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
            console.log(res)
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
    //获取集团数据
    groupNm() {
      net
        .request("admin/group/getGroupInfoList", "post")
        .then(res => {
          if (res.retcode == 1) {
            console.log(res)
            this.groupArr = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
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
