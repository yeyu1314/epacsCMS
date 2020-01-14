<template>
  <div id="userList">
    <div class="searchContent">
      <el-button type="primary" style="background: #009688;" @click="addUser" icon="el-icon-plus">新增</el-button>
    </div>
    <div class="table">
      <el-table :data="imgList" border style="width: 100%">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">{{scope.row.type == 1 ? "后台首页图片" : "APP首页图片"}}</template>
        </el-table-column>
        <el-table-column prop="note" label="备注" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <img :src="imageH + homeImgPath + '?name=' + scope.row.fileName" style="width:100%;" />
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.switchS"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="100"
              inactive-value="0"
              @change="changeSwitchStatus(scope.row.switchS,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="500px">
      <div style="display:flex;flex-direction: column;padding-left:80px;">
        <el-select
          v-model="selectType"
          clearable
          placeholder="请选择类型"
          style="margin:0 0 15px 0px;width:300px;"
          @change="photoTypeChange"
        >
          <el-option v-for="item in typeAll" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
        <el-input
          placeholder="请输入备注"
          v-model="noteText"
          style="margin:0 0 15px 0px;width:300px;"
          clearable
        ></el-input>
        <input
          type="file"
          accept="image/*"
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
      imgList: [],
      total: null,
      dialogVisible: false,
      noteText: "",
      imageH: net.imageHP,
      homeImgPath: "web/config/homePage/getImage",
      file: null,
      selectType: "",
      typeAll: [
        { type: 1, name: "后台首页图片" },
        { type: 2, name: "APP首页图片" }
      ],
      selectID: null
    };
  },
  created() {
    this.getimgList({}, {});
  },
  methods: {
    //点击新增
    addUser() {
      this.noteText = "";
      this.selectType = "";
      this.selectID = null;
      this.file = null;
      this.dialogVisible = true;
    },
    //获取列表数据
    getimgList(param, data) {
      net
        .request2("web/config/homePage/manage", "post", param, data)
        .then(res => {
          if (res.retcode == 1) {
            this.total = res.data.length;
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].isUse == 1) {
                res.data[i].switchS = "100";
              } else {
                res.data[i].switchS = "0";
              }
            }
            this.imgList = res.data;
          } else {
            net.message(this, "获取数据失败", "warning");
          }
        });
    },
    changeSwitchStatus(status, data) {
      net
        .request2(
          "web/config/homePage/changeUseStatus",
          "post",
          { id: data.id },
          {}
        )
        .then(res => {
          if (res.retcode == 1) {
          }
        });
    },
    photoTypeChange(value) {
      this.selectID = value;
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
          net.imageHP +
            "web/config/homePage/addImage?type=" +
            this.selectID +
            "&note=" +
            this.noteText,
          formdata,
          config
        )
        .then(res => {
          if (res.data.retcode == 1) {
            this.dialogVisible = false;
            this.getimgList({}, {});
          }
          //做处理
        })
        .catch(error => {
          console.log(error);
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
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
