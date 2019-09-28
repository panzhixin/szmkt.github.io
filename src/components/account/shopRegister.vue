<template>
  <div class="shopRegister">
    <div class="content">
      <p class="title">店铺注册</p>
      <el-form label-width="120px" :rules="rules" :model="form">
        <div class="idPhotoBox">
          <div class="left photoBox">
            <upload-photo
              :photoFile="idPhotoFirst.file"
              :legend="idPhotoFirst.text"
              :photoLength="idPhotoFirst.length"
              :uploadType="1"
              :uploadSize="[8000,8000]"
              @removeFile="removeIdPhoto1"
              @uploadFile="addIdPhoto1"
            ></upload-photo>
          </div>
          <div class="right photoBox">
            <upload-photo
              :photoFile="idPhotoSecond.file"
              :legend="idPhotoSecond.text"
              :photoLength="idPhotoSecond.length"
              :uploadType="1"
              :uploadSize="[8000,8000]"
              @removeFile="removeIdPhoto2"
              @uploadFile="addIdPhoto2"
            ></upload-photo>
          </div>
        </div>

        <upload-photo
          :photoFile="licensePhoto.file"
          :legend="licensePhoto.text"
          :photoLength="licensePhoto.length"
          :uploadType="1"
          :uploadSize="[8000,8000]"
          @removeFile="removeLicensePhoto"
          @uploadFile="addLicensePhoto"
        ></upload-photo>
        <el-form-item label="企业全称" prop="companyName">
          <el-input v-model="form.companyName"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="form.shopName"></el-input>
        </el-form-item>
        <el-form-item label="经营分类" prop="type">
          <el-select v-model="type" placeholder="请选择">
            <el-option v-for="item in types" :key="item.value" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="finish" style="padding:15px 200px;" :disabled="submitDis">确定</el-button>
      </el-form>
    </div>
    <!-- <div class="foot">
        Copyright © 2012-2019 All Rights Reserved 荟友网络科技版权所有
        <img src='../../assets/img/beian.png' style='height:20px;width:20px'>粤公网安备 44030402000907号 网站备案许可证号:
        <a href="http://beian.miit.gov.cn/" class="beian">粤ICP备17057713号-1</a>
    </div>-->
  </div>
</template>

<script>
import uploadPhoto from "../tools/uploadPhoto";
export default {
  name: "shopRegister",
  components: {
    uploadPhoto
  },
  data() {
    return {
      submitDis : false,
      personPhoto: [],
      licensePhoto: [],
      form: {
        companyName: "",
        shopName: ""
      },
      rules: {
        companyName: [
          { required: true, message: "请输入企业全称", trigger: "blur" },
          { min: 1, max: 20, message: "企业名称最多20个字符", trigger: "blur" }
        ],
        shopName: [
          { required: true, message: "请输入店铺名称", trigger: "blur" },
          { min: 1, max: 12, message: "店铺名称最多12个字符", trigger: "blur" }
        ],
        type: { required: true, message: "请选择经营分类", trigger: "blur" }
      },
      types: [
        // {id: '选项1',title: '互联网科技'},
        // {id: '选项2',title: '零售百货'},
        // {id: '选项3',title: '批发代理'},
        // {id: '选项4',title: '医疗器械'}
      ],
      type: "",
      idPhotoFirst: {
        text: "身份证正面照片(要求：必传,大小：1M以内)",
        length: 1,
        action: "",
        file: []
      },
      idPhotoSecond: {
        text: "身份证反面照片(要求：必传,大小：1M以内)",
        length: 1,
        action: "",
        file: []
      },
      licensePhoto: {
        text: "营业执照(要求：必传,大小：1M以内)",
        length: 1,
        action: "",
        file: []
      },
      idPhotoPath1: "", //存放身份证正面图片
      idPhotoPath2: "", //存放身份证反面图片
      licensePhotoPath: "" //存放营业执照图片的路径
    };
  },
  methods: {
    //点击注册完成操作
    finish() {
      let info = {
        idcard1: this.idPhotoPath1,
        idcard2: this.idPhotoPath2,
        licence: this.licensePhotoPath,
        companyName: this.form.companyName,
        storeName: this.form.shopName,
        classifyId: this.type
      };

      if (this.idPhotoPath1 == "") {
        this.$message({ type: "warning", message: "请上传身份证正面照片" });
      } else {
        if (this.idPhotoPath2 == "") {
          this.$message({ type: "warning", message: "请上传身份证反面照片" });
        } else {
          if (this.licensePhotoPath == "") {
            this.$message({ type: "warning", message: "请上传营业执照照片" });
          } else {
            if (this.form.companyName == "") {
              this.$message({ type: "warning", message: "请填写企业名称" });
            } else {
              if (this.form.shopName == "") {
                this.$message({ type: "warning", message: "请填写店铺名称" });
              } else {
                if (this.type == "") {
                  this.$message({ type: "warning", message: "请选择经营分类" });
                } else {
                  if (
                    !this.$filterWord(
                      this.form.companyName,
                      this.$store.state.filterList
                    )
                  ) {
                    this.$message({
                      type: "error",
                      message: "企业全称包含敏感词汇，请重试"
                    });
                    this.searchTxt = "";
                    return;
                  }
                  if (
                    !this.$filterWord(
                      this.form.shopName,
                      this.$store.state.filterList
                    )
                  ) {
                    this.$message({
                      type: "error",
                      message: "店铺名称包含敏感词汇，请重试"
                    });
                    this.searchTxt = "";
                    return;
                  }
                  this.submitDis = true;
                  this.$http
                    .post(
                      "szmktstore/login/store/register?userid=" +
                        this.$store.state.loginInfo.userId,
                      info
                    )
                    .then(res => {
                      
                      if (res.data.code == 1000) {
                        if (res.data.data.status == 5) {
                          this.$message({
                            type: "error",
                            message: "您已申请过,请耐心等耐审核"
                          });
                          this.$router.push({
                            name: "checking"
                          });
                        } else if (res.data.data.status == 6) {
                          this.$message({
                            type: "error",
                            message: "您已注册过，正在为您跳转"
                          });
                          this.$router.push({
                            name: "firstEnter"
                          });
                        } else if (res.data.data.status == 7) {
                          this.$message({
                            type: "error",
                            message: "您已注册过，正在为您登陆店铺"
                          });
                          this.$router.push({
                            name: "goods"
                          });
                        } else {
                          this.$router.push({
                            name: "checking"
                          });
                        }
                      } else {
                        this.submitDis = false;
                        this.$message({
                          type: "error",
                          message: res.data.message
                        });
                      }
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }
              }
            }
          }
        }
      }
    },
    //添加营业执照照片的路径
    addLicensePhoto(res) {
      this.licensePhotoPath = res.data.data;
    },
    //添加身份证正面照片的路径
    addIdPhoto1(res) {
      this.idPhotoPath1 = res.data.data;
    },
    //添加身份证反面照片的路径
    addIdPhoto2(res) {
      this.idPhotoPath2 = res.data.data;
    },
    //加载商铺分类
    loadShopType() {
      this.$http
        .get(
          "szmktbackstage/storeClassify/list?userid=" +
            this.$store.state.loginInfo.userId
        )
        .then(res => {
          if (res.data.code == 1000) {
            console.log(res);
            this.types = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除身份证正面照片路径
    removeIdPhoto1(file) {
      this.idPhotoPath1 = "";
    },
    //删除身份证反面照片路径
    removeIdPhoto2(file) {
      this.idPhotoPath2 = "";
    },
    //删除营业执照照片路径
    removeLicensePhoto(file) {
      this.licensePhotoPath = "";
    }
  },
  mounted() {
    this.$store.commit("changeHeaderShow",true);
    this.loadShopType();
    let info = this.$route.query.info;
    if (info != undefined && info.shopName != "") {
      this.personPhoto = info.personPhoto;
      this.licensePhoto = info.licensePhoto;
      this.form.companyName = info.companyName;
      this.form.shopName = info.shopName;
      this.type = info.type;
    }
    //如果用户是重新提交的，要拉取之前填过的店铺注册信息
    if (
      this.$route.query.reSubmit == true ||
      this.$route.query.reSubmit == "true"
    ) {
      this.$http
        .get(
          "szmktstore/storeInfo/myBase?userid=" +
            this.$store.state.loginInfo.userId
        )
        .then(res => {
          //console.log(res);
          if (res.data.code == 1000) {
            let data = res.data.data;
            this.idPhotoFirst.file = [
              { url: this.$filePath.photo + data.idcard1 }
            ];
            this.idPhotoSecond.file = [
              { url: this.$filePath.photo + data.idcard2 }
            ];
            this.idPhotoPath1 = data.idcard1;
            this.idPhotoPath2 = data.idcard2;
            this.licensePhoto.file = [
              { url: this.$filePath.photo + data.licence }
            ];
            this.licensePhotoPath = data.licence;
            this.form.companyName = data.companyName;
            this.form.shopName = data.storeName;
            this.type = data.classifyId;
          } else {
            this.$message({ type: "error", message: res.data.message });
            this.$router.push({ name: "login" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.shopRegister {
  padding: 150px 0 0 0;
}
.content {
  width: 700px;
  padding: 0 20px 10px;
  background-color: #ffffff;
  margin: 0 auto;
  overflow: hidden;
  .title {
    text-align: center;
    font-size: 40px;
    color: #333;
    line-height: 70px;
  }
  .form-item {
    width: 100%;
    overflow: hidden;
    margin: 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e4e4;
    .form-item-left {
      width: 188px;
      padding-right: 12px;
      float: left;
      font-size: 20px;
      line-height: 40px;
      text-align: right;
      p {
        margin: 0;
      }
    }
    .form-item-right {
      width: calc(100% - 200px);
      float: left;
    }
  }
  .idPhotoBox {
    width: 100%;
    display: flex;
    .photoBox {
      flex: 1;
    }
    .photoBox:nth-child(1) {
      padding-right: 15px;
    }
  }
}
.foot {
  width: 100%;
  height: 20px;
  font-size: 14px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  padding: 20px 0;
  background-color: #3f3e3e;
  color: #9c9191;
  .beian {
    color: #333;
  }
  .beian:hover {
    color: rgb(52, 110, 219);
  }
}
.el-button--primary{
  background-color: #F25664;
  border-color:#F25664;
}
.el-button:hover{
  border-color:#F25664;
  color: #F25664;
  background-color: white;
}
.el-button--primary:hover{
  background-color: #d22c2c;
  color: white;
}
</style>
