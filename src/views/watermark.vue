<template>
  <div id="userList">
    <div class="searchContent">
      <el-input placeholder="请输入机构名" v-model="orgName" clearable></el-input>
      <el-button
        type="primary"
        style="background: #009688;"
        @click="search"
        icon="el-icon-search"
      >搜索</el-button>
    </div>
    <div class="table">
      <el-table :data="ueseList" border style="width: 99%">
        <el-table-column prop="orgName" label="机构名称" align="center"></el-table-column>
        <el-table-column label="水印图片" align="center">
          <template slot-scope="scope">
            <img
              :src="imageH + homeImgPath + '?orgId=' + scope.row.orgId + '&imageName=' + scope.row.fileName"
              style="width:50%;"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="editClick(scope.row)"
              type="success"
              style="background: #009688;"
              size="small"
            >上传</el-button>
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
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="新增" :visible.sync="dialogVisible" width="500px">
      <div style="display:flex;flex-direction: column;padding-left:80px;">
        <input
          type="file"
          accept="image/jpg"
          ref="avatarInput"
          @change="uploading($event)"
          style="display:block;"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      ueseList: [],
      pageNo: 1,
      pageSize: 5,
      total: null,
      imageH: net.imageHP,
      homeImgPath: "web/config/watermark/getImage",
      dialogVisible: false,
      file: null,
      orgID: -1,
      orgName: ""
    };
  },
  created() {
    this.getUserList({
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      orgName: this.orgName
    });
  },
  methods: {
    editClick(row) {
      //修改
      this.dialogVisible = true;
      this.orgID = row.orgId;
    },
    //获取列表数据
    getUserList(param, data) {
      net
        .request2("web/config/watermark/queryPage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.ueseList = res.data.rows;
            this.total = res.data.total;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    // 定义表格样式
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgName: this.orgName
      });
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getUserList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgName: this.orgName
      });
    },
    uploading(event) {
      this.file = event.target.files[0]; //获取文件
      // var windowURL = window.URL || window.webkitURL;
      // this.file = event.target.files[0];
      //创建图片文件的url
      // this.src = windowURL.createObjectURL(event.target.files[0]);
    },
    onSubmit() {
      let formdata = new FormData();
      formdata.append("file", this.file);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
        }
      };

      net.axios
        .post(
          net.imageHP + "web/config/watermark/updateImage?orgId=" + this.orgID,
          formdata,
          config
        )
        .then(res => {
          if (res.data.retcode == 1) {
            this.dialogVisible = false;
            this.getUserList(
              { pageNo: this.pageNo, pageSize: this.pageSize },
              {}
            );
          }
          //做处理
        })
        .catch(error => {
          console.log(error);
        });
    },
    search() {
      //查询
      this.getUserList({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgName: this.orgName
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
}
</style>
