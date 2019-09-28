<template>
  <div class="uploadPhoto" :class="isShowUpload ? '' : 'hide'">
    <p class="header">{{legend}}</p>
    <el-upload
      action
      list-type="picture-card"
      :limit="photoLength"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="photoFile"
      :on-exceed="overLength"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" size="tiny" title="图片放大详情" class="scalePhoto">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <el-dialog :visible.sync="dialogVideo" size="tiny" title="视频预览">
      <div class="videoBox">
        <video :src="videoPath" controls="controls" width="400" height="200">您的浏览器不支持 video 标签。</video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { clearTimeout } from "timers";
export default {
  name: "uploadPhoto",
  props: {
    photoFile: Array,
    legend: String,
    photoLength: Number,
    uploadType: Number,
    uploadSize: Array
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      isCanUpload: true,
      length: 0,
      dialogVideo: false,
      videoPath: "",
      trueFormat: true,
      timer: null
    };
  },
  computed: {
    isShowUpload() {
      if (this.length == this.photoLength) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    trueFormat() {
      if (this.trueFormat == false) {
        let _this = this;
        setTimeout(function() {
          _this.trueFormat = true;
        }, 1000);
      }
    }
  },
  methods: {
    //删除图片
    handleRemove(file, fileList) {
      this.length--;
      var index = this.photoFile.indexOf(file);
      if (this.trueFormat) {
        this.$emit("removeFile", index);
      }
      if (this.action == "") {
        this.$message({
          message: "请勿删除",
          type: "error"
        });
        this.photoFile.splice(index, 1);
        this.photoFile.push(file);
      }
    },
    //预览照片或视频
    handlePictureCardPreview(file) {
      if (this.uploadType == 1) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      } else {
        this.videoPath = file.url;
        this.dialogVideo = true;
      }
    },
    //上传文件前的校验
    beforeAvatarUpload(file) {
      let width = parseInt(this.uploadSize[0]);
      let height = parseInt(this.uploadSize[1]);
      this.trueFormat = true;
      if (width != 8000) {
        //当图片为500像素的时候不能大于1M
        if (width == 500) {
          if (file.size / 1024 / 1024 > 1) {
            this.$message({ type: "error", message: "文件不能大于1M" });
            this.trueFormat = false;
            this.length++;
            return false;
          }
        }
        //当文件为视频格式时限制后缀
        if (this.uploadType == 2) {
          var name = file.name;
          var index = name.indexOf(".");
          name = name.substring(index).toLowerCase();
          if (
            name != ".avi" &&
            name != ".rmvb" &&
            name != ".mp4" &&
            name != ".flv"
          ) {
            this.$message({
              type: "warning",
              message: "请上传avi、mp4、rmvb或者flv格式的视频文件"
            });
            this.length++;
            this.trueFormat = false;
            return false;
          }
          if (file.size / 1024 / 1024 > 30) {
            this.$message({
              type: "error",
              message: "视频文件大小不能大于30M"
            });
            this.length++;
            this.trueFormat = false;
            return false;
          }
        }
        //当文件为图片格式时限制后缀
        if (this.uploadType == 1) {
          const isBig = file.size / 1024 / 1000 < 1;
          var name = file.name;
          var extend = name.substring(name.lastIndexOf(".") + 1);
          if (extend != "") {
            if (
              !(extend == "png") &&
              !(extend == "jpg") &&
              !(extend == "jpeg") &&
              !(extend == "gif")
            ) {
              this.$message({
                type: "error",
                message: "请上传后缀名为png、jpg、jpeg或gif的图片文件"
              });
              this.length++;
              this.trueFormat = false;
              return false;
            }
          }
          const isSize = new Promise(function(resolve, reject) {
            let _URL = window.URL || window.webkitURL;
            console.log(_URL);
            let img = new Image();
            img.onload = function() {
              let valid = img.width == width && img.height == height;
              valid ? resolve() : reject();
            };
            img.src = _URL.createObjectURL(file);
            console.log(img.src);
          }).then(
            () => {
              return file;
            },
            () => {
              this.length++;
              this.trueFormat = false;
              this.$message.error(
                "上传的图片必须是等于" + width + "*" + height + "像素!"
              );
              return Promise.reject();
            }
          );
          return isSize;
        }
      }
    },
    //超出最大上传数量
    overLength() {
      this.$message.error("超出最大上传数量！");
    },
    //处理上传
    handleUpload(obj) {
      let _this = this;
      let formData = new FormData();
      formData.append("file", obj.file);
      formData.append("type", _this.uploadType);
      _this
        .$http({
          url: "szmktstore/proxy/upload/file",
          data: formData,
          method: "post"
        })
        .then(res => {
          this.length++;
          _this.$emit("uploadFile", res, obj.file.name);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    let _this = this;
    setTimeout(function() {
      _this.length = _this.photoFile.length;
    }, 1000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.uploadPhoto {
  display: block;
  overflow: hidden;
  margin-bottom: 15px;
  .header {
    background: #d0dbf3;
    margin-top: 0;
    margin-bottom: 10px;
    line-height: 35px;
    font-size: 16px;
    text-align: left;
    text-indent: 20px;
    color: #0e3e6d;
    border-radius: 5px;
  }
}
</style>
