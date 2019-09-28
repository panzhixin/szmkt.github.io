<template>
  <div class="decoration" 
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="showBox" v-if="!isUseEdit">
        <div class="btnBox">
            <el-button 
            type="primary" 
            style="float:right;margin-bottom:15px;width:104px;height:40px;"
            @click="changeStatus"
            >编辑</el-button>
        </div>
        <div class="content-box">
            <p class="content-title">企业lOGO</p>
            <div class="photoList logoPhotoList">
                <p class="nodata-title" v-if="brandInfo.logo == '' || brandInfo.logo == null">您还未上传LOGO，快上传LOGO展示您的企业品牌吧</p>
                <ul v-else>
                    <li>
                        <img :src="$filePath.photo + brandInfo.logo"/>
                    </li>
                </ul>
            </div>
        </div>
        <div class="content-box">
            <p class="content-title">企业风采</p>
            <p class="small-title">视频</p>
            <div class="photoList styleVideoList">
                <p class="nodata-title" 
                v-if="brandInfo.video == '' || brandInfo.video == null">
                您还未上传视频，快上传视频展示您的企业风采吧</p>
                <ul v-else>
                    <li>
                        <video :src="$filePath.video + brandInfo.video" width="240" height="160" controls="controls">
                        Your browser does not support the video tag.
                        </video>
                    </li>
                    <!-- <li v-for="(item,index) in brandInfo.imageLlist" :key="index">
                        <img :src="$filePath.photo + item" alt="logo"/>
                    </li> -->
                </ul>
            </div>
            <p class="small-title">图片</p>
            <div class="photoList stylePhotoList">
                <p class="nodata-title" 
                v-if="brandInfo.imageLlist == null || brandInfo.imageLlist.length == 0">
                您还未上传图片，快上传图片展示您的企业风采吧</p>
                <ul v-else>
                    <li v-for="(item,index) in brandInfo.imageLlist" :key="index">
                        <img :src="$filePath.photo + item" alt="logo"/>
                    </li>
                </ul>
            </div>
            <p class="small-title">企业简介</p>
            <div class="introduceShow">
                <p class="nodata-title" v-if="brandInfo.description == '' || brandInfo.description == null">暂无简介</p>
                <div class="introduceShow-content" v-else v-html="brandInfo.description"></div>
            </div>
        </div>
        <div class="content-box">
            <p class="content-title">企业信息</p>
            <div class="infoShow">
                <ul>
                    <li>
                        <p class="infoShow-title">客服电话：</p>
                        <p class="infoShow-content">{{brandInfo.serviceTel}}</p>
                    </li>
                    <li>
                        <p class="infoShow-title">企业规模：</p>
                        <p class="infoShow-content">{{brandInfo.employeeNum}}人</p>
                    </li>
                    <li>
                        <p class="infoShow-title">企业地址：</p>
                        <p class="infoShow-content">{{brandInfo.address}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="editBox" v-else>
        <p class="returnShow" @click="changeStatus" v-if="isExistContent">返回上一级</p>
        <el-form :rules="infoRule" label-width="15px" :model="companyInfo">
            <div class="content-box">
                <p class="content-title">企业lOGO
                    <span class="request">(尺寸:500*500像素,大小:小于1M)</span>
                </p>
                <div class="photoBox logoPhoto">
                    <upload-photo 
                        :photoFile="logoInfo.file" 
                        :legend="logoInfo.text"
                        :photoLength="logoInfo.length"
                        :uploadType="1"
                        :uploadSize="[500,500]"
                        @removeFile = "removeLogoPhoto"
                        @uploadFile="addLogoPhoto">
                    </upload-photo>
                </div>
            </div>
            <div class="content-box" style="padding-bottom:5px;">
                <p class="content-title">企业风采</p>
                <p class="small-title">视频
                    <span class="request">(最多上传一段，应为avi、mp4、rmvb或者flv格式且容量不超过30M)</span>
                </p>
                <div class="photoBox styleVideo">
                    <upload-photo
                        :photoFile="companyVideo.file"
                        :legend="companyVideo.text"
                        :photoLength="companyVideo.length"
                        :uploadSize="[10000,10000]"
                        @uploadFile="addCompanyVideo"
                        @removeFile = "removeCompanyVideo"
                        :uploadType="2">
                    </upload-photo>
                </div>

                <p class="small-title">图片
                    <span class="request">(最多上传4张，尺寸：750*374像素)</span>
                </p>
                <div class="photoBox stylePhoto">
                    <upload-photo 
                        :photoFile="companyPhoto.file"
                        :legend="companyPhoto.text"
                        :photoLength="companyPhoto.length"
                        :uploadSize="[750,374]"
                        @uploadFile="addCompanyPhoto"
                        @removeFile = "removeCompanyPhoto"
                        :uploadType="1">
                    </upload-photo>
                </div>
                <div class="introduce">
                    <div class="title"><span class="red">*</span>企业简介</div>
                    <div class="content">
                        <editor v-model="companyInfo.style" @addEditorPhoto="addEditorPhoto"></editor>
                    </div>
                </div>
            </div>
            <div class="content-box" style="padding-bottom:5px;">
                <div class="content-title">企业信息</div>
                <div class="form-box">
                    <p class="small-title"><span class="red">*</span>客服电话
                        <span class="request">企业客服电话应为11位手机号码或者固定电话号码(如：0755-88600299)</span>
                    </p>
                    <el-form-item prop="phone">
                        <el-tooltip class="item" effect="dark" content="企业客服电话应为11位手机号码或者固定电话号码(如：0755-88600299)" placement="right"> 
                            <el-input v-model="companyInfo.phone" placeholder="请输入客服电话" style="width:300px;float:left;"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <p class="small-title"><span class="red">*</span>企业规模
                        <span class="request">企业规模最多6位数字</span>
                    </p>
                    <el-form-item prop="person">
                        <el-tooltip class="item" effect="dark" content="企业规模最多6位数字" placement="right">

                            <el-input v-model.number="companyInfo.person" placeholder="请输入人数" maxlength="6" style="width:300px;float:left;">
                                <template slot="append">人</template>
                            </el-input>
                        </el-tooltip>
                    </el-form-item>
                    <p class="small-title"><span class="red">*</span>企业地址</p>
                    <el-form-item prop="address">
                        <el-input style="width:400px;" type="textarea" :rows="2" v-model="companyInfo.address" placeholder="请输入地址"></el-input>
                    </el-form-item>
                </div>
            </div>
            <el-button @click="submit" type="primary" style="padding:15px 100px;margin:20px auto 0;" :disabled="submitDis">确定</el-button>
        </el-form>
    </div>    
  </div>
</template>

<script>
import uploadPhoto from "../../tools/uploadPhoto.vue"
import editor from "../../tools/editor.vue"

export default {
  name: 'decoration',
  components : {
    uploadPhoto,editor
  },
  data () {
    var validatePerson = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入企业人数'));
        } else{
          if (!Number.isInteger(value)) {
            callback(new Error('企业人数只允许为数字'));
          }else{
              if((value + "").length > 6){
                  callback(new Error('企业人数最多为6位数'));
              }else{
                  callback();
              }
          }
        }
    };
    return {
        isExistContent : true,
        editBtn : "编辑",
        isUseEdit : false,
        submitDis : false,
        loading:false,
        loadingTimer:null,
        logoInfo:{
            text : "企业LOGO(要求<尺寸:500*500像素,大小:小于1M>)",
            length : 1,
            file: []
        },
        companyVideo : {
            text : "",
            length : 1,
            file: []
        },
        companyPhoto : {
            text : "",
            length : 4,
            file: []
        },
        companyInfo: {
            phone : "",   //客服电话
            person : "",  //企业人数
            address : "", //企业地址
            style : "",   //企业风采
        },     
        infoRule : {
            phone : [
                {required:true , message : "请输入企业客服电话",trigger : "blur"}
            ],
            person : [
                {required:true , message : "请输入企业人数",trigger : "blur"},
                { validator: validatePerson, trigger: 'blur' }
            ],
            address : [
                {required:true , message : "请输入企业地址",trigger : "blur"},
                {min: 1 ,max:150 , message : "最多输入150个字",trigger : "blur"}
            ]
        },
        logoPhotoPath : "",
        companyVideoPath : "",
        companyPhotoPath :[],
        brandInfo:{}
    }
  },
  methods:{
      //添加企业logo照片
      addLogoPhoto(res){
        if(res.data.code == 200){
            this.logoPhotoPath = res.data.data;
        }
      },
      //添加企业风采视频
      addCompanyVideo(res){
        if(res.data.code == 200){
            this.companyVideoPath =  res.data.data;
        }
      },
      //添加企业风采图片
      addCompanyPhoto(res,name){
        if(res.data.code == 200){
            this.companyPhotoPath.push( res.data.data);
            this.companyPhoto.file.push({
                name : name,
                url : this.$filePath.photo + res.data.data
            })
        }
      },
      //提交品牌装修信息
      submit(){      
        this.brandInfo.logo = this.logoPhotoPath;
        this.brandInfo.description = this.companyInfo.style;
        this.brandInfo.video = this.companyVideoPath;
        this.brandInfo.imageLlist = this.companyPhotoPath;
        this.brandInfo.serviceTel = this.companyInfo.phone;
        this.brandInfo.employeeNum = this.companyInfo.person;
        this.brandInfo.address = this.companyInfo.address;
        if(this.companyInfo.style == ''){
            this.$message({type:"warning",message:"请编辑企业简介"})
            return;
        }
        if(!this.$filterWord(this.companyInfo.style,this.$store.state.filterList)){
            this.$message({type:"error",message:"企业简介包含敏感词汇，请重试"});
            return;
        }
        if(this.companyInfo.phone.length == 0){
            this.$message({type:"warning",message:"请填写企业客服电话"});
            return;
        }
        if(!this.$filterWord(this.companyInfo.phone,this.$store.state.filterList)){
            this.$message({type:"error",message:"客服电话包含敏感词汇，请重试"});
            return;
        }
        if(this.companyInfo.person == ''){
            this.$message({type:"warning",message:"请填写企业规模"})
            return;
        }
        if(isNaN(this.companyInfo.person)){
            this.$message({type:"warning",message:"企业规模请填写数字"});
            return;
        }
        if((this.companyInfo.person+"").length > 6){
            this.$message({type:"warning",message:"企业规模应等于或小于六位"});
            return;
        }
        if(this.companyInfo.address == ''){
            this.$message({type:"warning",message:"请填写企业地址"})
            return;
        }
        if(this.companyInfo.address.length > 150){
            this.$message({type:"warning",message:"企业地址应等于或小于150个字符"});
            return;
        }
        if(!this.$filterWord(this.companyInfo.address,this.$store.state.filterList)){
            this.$message({type:"error",message:"企业地址包含敏感词汇，请重试"});
            return;
        }
        //this.submitDis = true;
        this.$http.post("szmktstore/storeInfo/brandInfo/save?userid="+ this.$store.state.loginInfo.userId ,this.brandInfo).then(res=>{
            if(res.data.code == 1000){
                this.$message({
                    message: '保存成功！',
                    center: true,
                    type: 'success'
                });
                document.documentElement.scrollTop = 0;
                this.changeStatus();
                this.loadInfo();
                this.isExistContent = true;
            }else{
                this.$message({
                    message: '保存失败,请检查信息填写是否有误',
                    center: true,
                    type: 'error'
                });
                //this.submitDis = false;
            }
        }).catch(err=>{
            console.log(err);
        })
      },
      //添加企业简介的图片
      addEditorPhoto(text){
        this.companyInfo.style = text;
      },
      //删除logo图片路径
      removeLogoPhoto(){
          this.logoPhotoPath = "";
      },
      //删除企业风采视频路径
      removeCompanyVideo(){
          this.companyVideoPath = "";
      },
      //删除企业风采图片路径
      removeCompanyPhoto(index){
        this.companyPhotoPath.splice(index, 1);
        this.companyPhoto.file.splice(index, 1);
      },
      tipEdit(){
        this.$message({type:"warning",message:"请先点击编辑按钮进入可编辑状态"});
      },
      changeStatus(){
          this.isUseEdit = !this.isUseEdit;
      },
      loadInfo(){
        //加载企业品牌装修信息
        this.$http.get("szmktstore/storeInfo/brandInfo?userid=" + this.$store.state.loginInfo.userId).then(res=>{
                if(res.data.code == 1000){
                let data = res.data.data;
                this.brandInfo = res.data.data;
                this.logoInfo.file= [];
                this.companyVideo.file = [];
                this.companyPhoto.file = [];
                this.companyPhotoPath = [];

                if(data.logo != null && data.logo != ""){
                    this.logoInfo.file.push( {url : this.$filePath.photo + data.logo});
                    this.logoPhotoPath = "";
                    this.logoPhotoPath = data.logo;
                } 
                if(data.video != null && data.video != ""){
                    this.companyVideo.file.push( {url : this.$filePath.video + data.video});
                    this.companyVideoPath = "";
                    this.companyVideoPath = data.video;
                } 
                console.log(this.companyVideo);
                
                if(data.image1!=null&& data.image1!=""){
                    this.companyPhoto.file.push({
                        url : this.$filePath.photo + data.image1
                    })
                    this.companyPhotoPath.push(data.image1);
                }
                if(data.image2!=null&& data.image2!=""){
                    this.companyPhoto.file.push({
                        url : this.$filePath.photo + data.image2
                    })
                    this.companyPhotoPath.push(data.image2);
                }
                if(data.image3!=null&& data.image3!=""){
                    this.companyPhoto.file.push({
                        url :this.$filePath.photo + data.image3
                    })
                    this.companyPhotoPath.push(data.image3);
                }
                if(data.image4!=null&& data.image4!=""){
                    this.companyPhoto.file.push({
                        url : this.$filePath.photo + data.image4
                    })
                    this.companyPhotoPath.push(data.image4);
                }
                this.companyInfo.style = "";
                this.companyInfo.phone = "";
                this.companyInfo.person = "";
                this.companyInfo.address = "";
                this.companyInfo.style = data.description;
                this.companyInfo.phone = data.serviceTel;
                this.companyInfo.person = data.employeeNum;
                this.companyInfo.address = data.address;
            }else{
                this.$message({
                    message : res.data.message,
                    type:"error"
                })
            }
        }).catch(err=>{
            console.log(err);
        })
      }
  },
  created(){
      let _this = this;
      //加载企业品牌装修信息
      this.$http.get("szmktstore/storeInfo/brandInfo?userid=" + this.$store.state.loginInfo.userId).then(res=>{
        if(res.data.code == 1000){
            //this.loading = true;
            let data = res.data.data;
            this.brandInfo = res.data.data;
            if(data.logo != null && data.logo != ""){
                this.logoInfo.file.push( {url : this.$filePath.photo + data.logo});
                this.logoPhotoPath = data.logo;
            } 
            if(data.video != null && data.video != ""){
                this.companyVideo.file.push( {url : this.$filePath.video + data.video});
                this.companyVideoPath = data.video;
            } 
            if(data.image1!=null&& data.image1!=""){
                this.companyPhoto.file.push({
                    url : this.$filePath.photo + data.image1
                })
                this.companyPhotoPath.push(data.image1);
            }
            if(data.image2!=null&& data.image2!=""){
                this.companyPhoto.file.push({
                    url : this.$filePath.photo + data.image2
                })
                this.companyPhotoPath.push(data.image2);
            }
            if(data.image3!=null&& data.image3!=""){
                this.companyPhoto.file.push({
                    url :this.$filePath.photo + data.image3
                })
                this.companyPhotoPath.push(data.image3);
            }
            if(data.image4!=null&& data.image4!=""){
                this.companyPhoto.file.push({
                    url : this.$filePath.photo + data.image4
                })
                this.companyPhotoPath.push(data.image4);
            }
            this.companyInfo.style = data.description;
            this.companyInfo.phone = data.serviceTel;
            this.companyInfo.person = data.employeeNum;
            this.companyInfo.address = data.address;
            _this.loadingTimer = setInterval(()=>{
                //console.log("top",document.documentElement.scrollTop);
                if(document.documentElement.scrollTop != 0){
                    clearInterval(_this.loadingTimer);
                    //_this.loading = false;
                    document.documentElement.scrollTop = 0;
                }     
            },50)
        }else if(res.data.code == 3003){
            this.isExistContent = false;
            this.isUseEdit = true;
            this.$message({
                message : "暂无装修信息",
                type:"info"
            })
        }else{
            this.$message({
                message : res.data.message,
                type:"error"
            })
        }
      }).catch(err=>{
        console.log(err);
      })
  },
  mounted(){
    this.$store.commit("changeHeaderShow",false);  
    this.$store.commit("changeIsShowNav",false);
    this.$store.commit("changeShopNavTitle","品牌装修");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.decoration{
    padding: 20px 20px;
    background-color: #E5E8ED;
    position: relative;
    min-width: 1260px;
    .editBox{
        position: relative;
    }
    .edit{
        position: fixed;
        right: 70px;
        top: 140px;
        width: 120px;
        z-index: 300;
    }
    .introduceHead{
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
    .introduceSup{
        background: #e4ecfd;
        margin: 0;
        line-height: 26px;
        font-size: 14px;
        text-align: left;
        text-indent: 20px;
        color: #203c61;
        border-radius: 3px;
    }
    .introduce{
        width: 100%;
        padding: 20px 0 30px 0;
        margin-bottom:50px;
        .title{
            width: 100%;
            line-height: 30px;
            font-size: 18px;
            text-align: left;
            font-size: 0.28rem;
            text-indent: 15px;
        }
        .content{
            box-sizing: border-box;
            float: left;
            margin-left:15px;
            width: 1200px;
        }
    }
    .introduce::after{
        content:"";
        display: block;
        width:100%;
        height:0;
        clear: both;
    } 
    .content-box{
        background-color: white;
        box-sizing: border-box;
        margin-bottom: 15px;
        overflow: hidden;
        border-radius: 5px;
        .content-title{
            text-align: left;
            text-indent: 15px;
            font-size: 16px;
            line-height: 50px;
            border-bottom: 1px solid #CFD2D9;
            font-weight: bold;
        }
        .photoBox{
            margin:10px 15px;
        }
        .request{
            padding-left: 45px;
            line-height: 50px;
            background: url(../../../assets/img/request.png) 25px center no-repeat;
            background-size: 14px 14px;
            font-size: 14px;
            color: #ABB2C0;
            font-weight: normal;
        }
        .small-title{
            text-align: left;
            text-indent: 15px;
            font-size: 14px;
            line-height: 30px;
            margin-top: 10px;
            .request{
                padding-left: 45px;
                line-height: 30px;
                background: url(../../../assets/img/request.png) 25px center no-repeat;
                background-size: 14px 14px;
                font-size: 14px;
                color: #ABB2C0;
                font-weight: normal;
            }
        }
        .form-box{
            margin: 15px;
        }
    }
    .showBox{
        position: relative;
        min-width: 1300px;
        .btnBox{
            overflow: hidden;
        }
        .photoList{
            ul{
                overflow: hidden;
                padding: 15px;
            }
            li{
                float: left;
                border: 1px solid #E5E8ED;
                border-radius: 4px;
                margin-right: 20px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .logoPhotoList{
            li{
                width: 160px;
                height: 160px;
            }
        }
        .styleVideoList,.stylePhotoList{
            li{
                width: 240px;
                height: 160px;
            }
            video{
                border-radius: 4px;
            }
        }
        .introduceShow{
            width: 1200px;
            height:500px;
            border: 1px solid #E5E8ED;
            margin: 15px;
            overflow: auto;
            padding: 10px;
        }
        .infoShow{
            padding: 15px;
            font-size: 14px;
            line-height: 40px;
            li{
                display: flex;
                text-align: left;
                .infoShow-title{
                    width: 80px;
                }
                .infoShow-content{
                    flex: 1;
                }
            }
        }
    }
    .red{
        color: red;
        line-height: 30px;
        padding-right: 10px;
    }
    .returnShow{
        width: 160px;
        line-height: 60px;
        font-size: 18px;
        color: #4181FE;
        text-indent: 25px;
        background: url(../../../assets/img/fanhui.png) left center no-repeat;
        background-size: 18px 18px;
        cursor: pointer;
        text-align: left;
    }
    .el-form-item{
        margin-top: 15px;
        .el-textarea{
            float: left;
        }
    }
    .nodata-title{
        font-size: 14px;
        line-height: 40px;
        text-align: left;
        text-indent: 15px;
        color: #ABB2C0;
    }
}
</style>
