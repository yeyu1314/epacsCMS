<template>
  <div id="setproduct">
    <div class="searchContent">
      <el-input placeholder="请输入维修站名" v-model="orgName " clearable></el-input>
      <el-input placeholder="请输入产品名" v-model="productName " clearable></el-input>

      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="conditionList" border style="width: 100%">
        <el-table-column prop="orgName" label="维修站名" align="center"></el-table-column>
        <el-table-column prop="productName" label="产品名" align="center"></el-table-column>
        <!-- <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="editClick(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >修改</el-button>
          </template>
        </el-table-column>-->
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
    <el-dialog :title="title" :visible.sync="dialogVisible" width="420px" height="400">
      <!-- :before-close="handleClose" -->
      <el-select
        v-model="orgin"
        clearable
        placeholder="请选择维修站"
        @change="changeOrg"
        style="margin:0 0 15px 10px;width:280px;"
        filterable
      >
        <el-option v-for="item in orginArr" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
      </el-select>
      <el-checkbox-group v-model="checkProList" style="display:flex;flex-direction: column;">
        <el-checkbox
          style="margin-left: 56px;text-align: left;height: 42px;line-height: 42px;    margin-bottom: 1px;"
          v-for="(item,index) in productArr"
          :key="index"
          :label="item.id"
        >{{item.productName}}</el-checkbox>
      </el-checkbox-group>
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
      conditionList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      orgName: null,
      productName:null,
      orgin: "",
      enit_id: "",
      orginArr: [],
      sign: 0, //用来判断是新增还是修改
      dialogVisible: false,
      title: "",
      productArr: [],
      checkProList: []
    };
  },
  created() {
    this.getSetList(
      { pageNo: this.pageNo, pageSize: this.pageSize },
      { orgName: this.orgName, productName: this.productName }
    );
  },
  methods: {
    //点击新增
    addUser() {
      this.dialogVisible = true;
      this.orgin = "";
      //   this.enit_id = "";
      this.sign = 0;
      this.title = "新增产品配置";
      this.checkProList = [];
      this.getOrgin();
      this.getProductInfo();
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
    //获取产品数量
    getProductInfo(callback) {
      callback = callback || function() {};
      net.request("admin/product/selectProductList", "post", {}).then(res => {
        if (res.retcode == 1) {
          var data = res.data;
          this.productArr = data;
          callback();
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //根据维修站显示产品
    seacrchProduct(id){
        net.request("admin/productConfigure/queryProductConfigure","post",{"orgId":id}).then(res=>{
            if(res.retcode ==1){
                var data = res.data;
                for(var i=0;i<data.length;i++){
                    this.checkProList.push(data[i].id);
                }
            }else{
                net.message(this,"error","获取产品数据失败");
            }
        });
    },
    changeOrg(){
        this.checkProList = [];
        if(this.orgin != ""){
            this.seacrchProduct(this.orgin)
        }
    },
    // editClick(row) {
    //   //修改
    //   this.dialogVisible = true;
    //   this.edit_carnick = row.productName;
    //   this.enit_id = row.id;
    //   this.sign = 1;
    //   this.title = "修改产品";
    // },
    //确认修改
    ensure() {
      var data = [];
      for (var i = 0; i < this.checkProList.length; i++) {
          var obj = {};
          obj["orgId"] = this.orgin;
          obj["id"] = this.checkProList[i];
          data.push(obj)
      }
    //   let url;
    //   if (this.sign == 1) {
    //     url = "admin/product/updateProduct";
    //     param["id"] = this.enit_id;
    //   }
    //   if (this.sign == 0) {
      let url = "admin/productConfigure/configure";
    //   }
      net.request(url, "post", null, data).then(res => {
        if (res.retcode == 1) {
          net.message(this, res.retmsg, "success");
          this.dialogVisible = false;
          this.getSetList(
            { pageNo: this.pageNo, pageSize: this.pageSize },
            { orgName: this.orgName, productName: this.productName }
          );
        } else {
          net.message(this, res.retmsg, "warning");
        }
      });
    },
    //获取列表数据
    getSetList(param, data) {
      net
        .request("admin/productConfigure/queryPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.conditionList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getSetList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, productName: this.productName }
      );
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getSetList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, productName: this.productName }
      );
    },

    search() {
      //查询
      this.getSetList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { orgName: this.orgName, productName: this.productName }
      );
    }
  }
};
</script>
<style lang="less" scoped>
#setproduct {
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
