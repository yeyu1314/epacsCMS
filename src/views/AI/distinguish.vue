<template>
  <div class="AIwin">
    <el-row>
      <el-col :span="10">
        <div class="detectionType">
          <el-form ref="form" label-width="120px">
            <el-form-item label="AI影像检测类型">
              <el-select
                v-model="region"
                class="selevtWidth"
                placeholder="请选择识别类型"
                @change="changeTheQuery(region)"
              >
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="detectionType" v-if="partShow">
          <el-form ref="form" label-width="120px">
            <el-form-item label="选择模型">
              <el-select
                v-model="partRegion"
                class="selevtWidth"
                placeholder="请选择识别部位"
                :change="changedPart(partRegion)"
              >
                <el-option
                  v-for="(item,index) in part"
                  :key="index"
                  :label="item.optionName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="probability" v-if="probabilityBox">
      <el-form ref="form" label-width="120px">
        <el-form-item label="识别几率">
          <div class="probabilityProgressBar">
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="probability"
              :color="color"
            ></el-progress>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="detectionTypeWin">
      <div class="recognitionImg">
        <el-upload
          v-loading="loading"
          element-loading-text="正在识别，请稍后"
          drag
          accept="image/jpeg, image/png, image/bmp"
          :action="picturePath"
          :show-file-list="false"
          :on-progress="beforeUploading"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="recognitionResult" v-loading="loading" element-loading-text="正在识别，请稍后">
        <p :class="[result ?'identificationColor' :'identification']">{{tip}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import net from "../../assets/js/public";
import { all, nfbind } from "q";
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "检测部位的识别"
        },
        {
          value: "2",
          label: "积碳维度的识别"
        }
      ],
      region: "1", //默认选中
      part: [],
      partRegion: 1,
      type: 1,
      picturePath: net.imageHP + "check/option",
      imageUrl: "",
      tip: "识别结果",
      result: false,
      partShow: false,
      probabilityBox: false,
      probability: 0,
      color: "",
      loading: false
    };
  },
  created() {
    this.getPart();
    if (this.$route.params.type == 1 || this.$route.params == undefined) {
      this.region = "1";
      this.changeTheQuery(1);
    } else {
      this.region = "2";
      this.changeTheQuery(2);
    }
  },
  methods: {
    //获取部位信息
    getPart() {
      net.request("admin/select/getOption", "post").then(res => {
        this.part = res.data;
      });
    },

    changeTheQuery(value) {
      if (value == 1) {
        this.picturePath = net.imageHP + "check/option";
        this.partShow = false;
        this.type = 1;
      } else if (value == 2) {
        this.partShow = true;
        this.type = 2;
      }
      this.imageUrl = "";
      this.result = false;
      this.tip = "识别结果";
      this.probabilityBox = false;
    },
    changedPart(val) {
      if (this.partShow) {
        this.picturePath = net.imageHP + "check/carbon?option=" + val;
      }
    },
    //图片上传前操作
    beforeUploading(file, fileList) {
      this.loading = true;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.result = true;
      if (res.data != "" && res.retcode != 0) {
        if (this.type == 1) {
          this.tip = res.data.name;
        } else if (this.type == 2) {
          this.tip = res.data.tagValue;
        }
        this.probability = parseInt(res.data.score * 100);
        this.probabilityColor(this.probability);
        this.probabilityBox = true;
        let that = this;
        setTimeout(function() {
          that.loading = false;
        }, 2000);
      } else {
        this.$message.error(res.retmsg);
        this.loading = false;
        this.tip = "AI识别异常";
        this.probabilityColor(45);
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    //改变进度条颜色
    probabilityColor(a) {
      if (a <= 60) {
        this.color = "red";
      } else if (a >= 60 && a <= 85) {
        this.color = "green";
      } else if (a >= 85) {
        this.color = "#2ca2fc";
      }
    }
  }
};
</script>
<style>
.AIwin {
  width: 100%;
  height: 100%;
}
.detectionType {
  margin-top: 20px;
}
.detectionTypeWin {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.selevtWidth {
  width: 90%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 180px;
}
.el-upload-dragger {
  width: 100%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 248px;
  height: 248px;
  line-height: 248px;
  text-align: center;
}
.avatar {
  width: 250px;
  height: 250px;
  display: block;
}
.recognitionImg {
  width: 250px;
  height: 250px;
  margin-right: 30px;
}
.recognitionImg div {
  width: 100%;
  height: 100%;
}
.probabilityProgressBar {
  width: 30%;
  margin-left: 13px;
  margin-top: 8px;
}
.recognitionResult {
  width: 250px;
  height: 250px;
  border: 1px solid #108cee;
  margin-left: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.identification {
  font-size: 20px;
  color: #000;
  font-weight: 500;
}
.identificationColor {
  color: red;
  font-size: 20px;
  font-weight: 500;
}
</style>

