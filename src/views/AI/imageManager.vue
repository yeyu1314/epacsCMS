<template>
  <div id="imageList">
    <el-tabs type="border-card" v-model="active" @tab-click="tabClick">
      <el-tab-pane label="图片整理">
        <div class="table">
          <div style="width:48%">
            <div
              style="    height: 33px;line-height: 33px;position: relative; bottom: 7px;text-align:left;font-size:14px;color:#f40;padding-left:3px;"
            >
              <p>双击行可以选中数据</p>
            </div>
            <el-table
              ref="imageTable"
              :data="imageList"
              border
              style="width:100%"
              @selection-change="handleSelectionChange"
              @row-dblclick="rowDblclick"
            >>
              <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
              <el-table-column prop="productName" label="部位" align="center">
                <template slot-scope="scope">{{scope.row.optionId | options}}</template>
              </el-table-column>
              <el-table-column prop="productName" label="步骤" align="center">
                <template slot-scope="scope">{{scope.row.step == 1 ? "检测":"复查"}}</template>
              </el-table-column>
              <el-table-column prop="productName" label="程度" align="center">
                <template slot-scope="scope">{{scope.row.optionValue | optionValue}}</template>
              </el-table-column>
            </el-table>
          </div>
          <div class="centerIcon">
            <img src="../../assets/img/1.png" alt>
          </div>
          <div style="width:48%;position: relative;">
            <el-button type="danger" size="small" class="delete" @click="deleteList">删除右边列表数据</el-button>
            <el-table
              ref="imageRightTable"
              :data="rightArr"
              border
              style="width:100%;margin-top:33px"
              @selection-change="handleSelectionChange"
              @row-dblclick="rowDblclick"
            >>
              <el-table-column prop="carNumber" label="车牌号" align="center"></el-table-column>
              <el-table-column prop="productName" label="部位" align="center">
                <template slot-scope="scope">{{scope.row.optionId | options}}</template>
              </el-table-column>
              <el-table-column prop="productName" label="步骤" align="center">
                <template slot-scope="scope">{{scope.row.step == 1 ? "检测":"复查"}}</template>
              </el-table-column>
              <el-table-column prop="productName" label="程度" align="center">
                <template slot-scope="scope">{{scope.row.optionValue | optionValue}}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="配置管理"></el-tab-pane>
      <el-tab-pane label="角色管理"></el-tab-pane>
      <el-tab-pane label="定时任务补偿"></el-tab-pane> -->
    </el-tabs>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="pageNo"
        :page-sizes="[8, 16, 24, 32]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import net from "../../assets/js/public";
export default {
  data() {
    return {
      imageList: [],
      pageNo: 1,
      pageSize: 10,
      total: null,
      multipleSelection: [],
      active: "0",
      rightArr: []
    };
  },
  filters: {
    //部位
    options(val) {
      var arr = [
          "检测车牌号",
          "进气道",
          "进气阀",
          "喷油嘴",
          "活塞顶",
          "缸壁",
          "复查车牌号",
          "车架号"
        ],
        str;
      if (val == -2) {
        str = arr[6];
      } else if (val == -1) {
        str = arr[0];
      } else if (val == -11) {
        str = arr[7];
      } else {
        str = arr[val];
      }
      return str;
    },
    optionValue(val) {
      var arr = ["未赋值", "轻微", "轻度", "中度", "重度", "严重"];
      var str = arr[parseInt(val)];
      return str;
    }
  },
  created() {
    this.getImageList({ pageNo: this.pageNo, pageSize: this.pageSize });
  },
  methods: {
    //监听多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //监听tabs切换
    tabClick(tab, event) {
      console.log(this.active);
    },
    //表格某一行被双击
    rowDblclick(row, event) {
      if(this.rightArr.length == 10){
          net.message(this,"最多选中10条数据","error");
          return false;
      }
      if (this.rightArr.indexOf(row) == -1) {
        this.rightArr.push(row);
      }else{
          net.message(this,"该数据已选中","error");
      }
      
    },
    //删除数据
    deleteList(){
        var list = [],str;
        if(this.rightArr.length==0){
            net.message(this,"未选中数据！！","warning");
        } 
        for(var i=0;i<this.rightArr.length;i++){
            list.push(this.rightArr[i].id);
        }
        if(list.length == 1){
          var str = list[0];
        }
        if(list.length > 1){
          var str = list.join(",");
        }
        net.request2("image/manage/deleteUnUsedRow","post",{images:str}).then(res=>{
            if(res.retcode == 1){
              net.message(this,res.retmsg,"success");
              this.rightArr = [];
              this.getImageList({pageNo: this.pageNo, pageSize: this.pageSize });
            }
        })
    },
    //获取列表数据
    getImageList(param, data) {
      net
        .request2("image/manage/imageNotUsedInDB", "post", param, data)
        .then(res => {
          if (res.code == 0) {
            this.imageList = res.rows;
            this.total = res.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    //监听分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getImageList({pageNo: this.pageNo, pageSize: this.pageSize });
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getImageList({ pageNo: this.pageNo, pageSize: this.pageSize });
    },

    search() {
      //查询
      this.getUserList(
        { pageNo: this.pageNo, pageSize: this.pageSize },
        { productName: this.stencilName }
      );
    }
  }
};
</script>
<style lang="less" scoped>
#imageList {
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
    display: flex;
    flex-direction: row;
    .centerIcon {
      width: 3%;
      height: auto;
      img {
        width: 100%;
        position: relative;
        top: 43px;
      }
    }
    .delete {
      position: absolute;
      top: -7px;
      right: 1%;
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
