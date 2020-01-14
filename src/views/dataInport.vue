<template>
  <div class="onload">
    <div>
      <el-select v-model="value" clearable placeholder="请选择数据类型">
        <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id"></el-option>
      </el-select>
    </div>
    <div>
      <!-- <input type="file" @change="getFile($event)"> -->
      <el-upload
        action
        class="upload-demo"
        ref="upload"
        :limit="1"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="medium" type="primary" style="background:#009688;margin-left:15px;margin-top:2px">选择文件</el-button>
        <el-button
          style="margin-left: 10px;;margin-top:1px"
          size="medium"
          type="success"
          @click="submitUpload($event)"
        >上传</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import net from "../assets/js/public";
export default {
  data() {
    return {
      options: [],
      value: "",
      file: null
    };
  },
  created() {
    this.getSelectData();
  },
  methods: {
    submitUpload() {
      let formData = new FormData();
      formData.append("file", this.file);
      if (this.value == "") {
        net.message(this, "请选择数据类型", "warning");
        return false;
      }
      if (this.file == null) {
        net.message(this, "请选择上传文件", "warning");
        return false;
      }
      net
        .request("import/upload", "post", { opType: this.value }, formData)
        .then(res => {
          if (res.retcode == 1) {
            this.$refs.upload.clearFiles();
            net.message(this, "上传成功", "success");
          } else {
            net.message(this, "上传失败" + res.retmsg, "warning");
            this.$refs.upload.clearFiles();
          }
          console.log(res);
        });
    },
    getSelectData() {
      net.request("import/typeList", "post", {}, null).then(res => {
        if (res.retcode == 1) {
          this.options = res.data;
        } else {
          net.message(this, "获取下拉数据失败", "warning");
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
.onload {
  display: flex;
  flex-direction: row;
  .upload-demo {
    display: flex;
    flex-direction: row;
  }
}
</style>

