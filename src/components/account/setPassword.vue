<template>
  <div class="setPassword">
    <div class="setPasswordBox">
      <div class="firstStep" v-if="showStep">
        <h1 class="title">{{title}}</h1>
        <div class="content">
                <el-form :label-position="labelPosition" label-width="90px" :model="password" :rules="passwordRules">
                    <el-form-item label="设置密码" prop="first">
                        <el-tooltip class="item" effect="dark" content="请输入6到16位字母、英文符号或数字" placement="right">
                            <el-input v-model="password.first" placeholder="请输入你的密码" show-password></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="确定密码" prop="again">
                        <el-input v-model="password.again" placeholder="请再次输入密码" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="绑定微信" prop="bindingWx">
                        <el-button @click="bindWx" style="float:left;">{{wxTxt}}</el-button>
                        <span v-show="hasBind" style="float:left;margin-left:15px;">已绑定</span>
                    </el-form-item>
                    <el-form-item size="large">
                        <el-button type="primary" @click="finish" style="padding:15px 110px;margin-top:30px;">完成设置</el-button>
                    </el-form-item>
                </el-form>         
        </div>
      </div>
      <div class="secondStep" v-else>
          <div class="correct">
              <img src="../../assets/img/succeed.png"/>
          </div>
          <p class="correctTitle">账户已激活</p>
          <el-form :label-position="labelPosition">
            <el-form-item size="large">
                <el-button type="primary" @click="write" style="margin-top:50px;">填写注册资料</el-button>
            </el-form-item>
          </el-form>
      </div>
      <el-dialog
        title="绑定微信二维码"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        :before-close="closeImgWindow"
        width="30%">
        <div class="codeImg">
            <img :src="wxImg"/>
        </div>
        <span slot="footer" class="dialog-footer">
            <h2>{{codeTitle[0]}}</h2>
        </span>
     </el-dialog>
     <div class="foot">
        Copyright © 2012-2019 All Rights Reserved 荟友网络科技版权所有
        <img src='../../assets/img/beian.png' style='height:20px;width:20px'>粤公网安备 44030402000907号 网站备案许可证号:
        <a href="http://beian.miit.gov.cn/" class="beian">粤ICP备17057713号-4</a>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    //密码验证函数
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
    };
    //再次输入密码验证函数
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.password.first) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
        showStep : true,
        title : '登录密码设置',
        labelPosition : 'left',
        password : {
            first : "",
            again : ""
        },
        passwordRules : {
            first : [
                { required : true, message:'请输入密码' , trigger: 'blur' },
                { validator: validatePass, trigger: 'blur' },
                { min : 6,max:16, message : "密码应为6到16位", trigger : 'blur'}
            ],
            again : [
                { required : true, message:'请再次输入密码' , trigger: 'blur' },
                { validator: validatePass2, trigger: 'blur' }
            ],
            bindingWx : {required:true}
        },
        wxTxt : "立即绑定",
        dialogVisible: false,
        codeTitle : ['请打开微信扫描该二维码'],
        hasBind : false,
        bindTimer : null,
        wxImg : require("../../assets/img/default_code.png")
    }
  },
  methods:{
    //绑定微信
    bindWx(){
        let _this = this;
        if(this.wxTxt == "立即绑定"){
            this.dialogVisible = true;
            this.getWxImg();
            this.bindTimer = setInterval(function(){
                _this.checkBind();
            },5000);
        }else{
            this.$confirm('重新绑定微信会解除已绑定微信, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.dialogVisible = true;
                this.$http.get("szmktstore/login/reBind?userid=" + this.$store.state.loginInfo.userId + "&phone=" + this.$store.state.loginInfo.phone).then(res=>{
                    //console.log(res);
                    if(res.data.code == 1000){
                        this.getWxImg();
                        this.hasBind = false;
                        this.wxTxt = "立即绑定";
                        this.bindTimer = setInterval(function(){
                            _this.checkBind();
                        },5000);
                    }else{
                        this.$message({type:"error",message:res.data.message});
                    }
                }).catch(err=>{
                    console.log(err);
                })
                this.$message({
                    type: 'success',
                    message: '解除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        }
    },
    //已完成绑定
    binding(){
        this.hasBind = true;
    },
    closeImgWindow(){
        clearInterval(this.bindTimer);
        this.dialogVisible = false;
    },
    getWxImg(){
        /*
            以前： /szmktuser/store/storebindqrcode
            现在：/szmktuserservice/external/storebindqrcode
        */
        if(this.wxImg.indexOf("store_invite") == -1){
             this.$http.get("/szmktuser/store/storebindqrcode?phone=" + this.$store.state.loginInfo.phone).then(res=>{
                this.wxImg =this.$filePath.wxPhoto + res.data.data;
            }).catch(err=>{
            console.log(err);
            })
        }
    },
    //已经绑定过
    hasBinding(){
        this.hasBind = true;
        this.wxTxt = "重新绑定";
    },
    //点击完成设置后的操作
    finish(){   
        console.log(this.$store.state.loginInfo.userId);
        if(this.password.first == ""){
            this.$message({type : "warning",message : "请输入密码"})
        }else{
            if (this.password.again == "") {
                this.$message({type : "warning",message : "请确定密码"})
            }else{
                if (this.password.again != this.password.first) {
                    this.$message({type : "warning",message : "请保证两次密码一致"})
                }else{
                    if((this.password.first + "").length < 6 || (this.password.again + "").length < 6 ){
                        this.$message({type : "warning",message : "密码请保证在6到16位"})
                    }else{
                        if(this.hasBind == false){
                            this.$message({type : "warning",message : "请绑定微信"});
                            return;
                        }
                        this.$http.get("szmktstore/login/register?userid=" + this.$store.state.loginInfo.userId + "&password=" + encodeURIComponent(this.password.first)).then(res=>{
                                //console.log(res);
                                if(res.data.code == 1000 ){
                                    let status = res.data.data.status;
                                    this.$store.commit("updateLoginInfo",{
                                        userId : this.$store.state.loginInfo.userId,
                                        phone : this.$store.state.loginInfo.phone,
                                        password : this.password.first
                                    });
                                    if(status == 0){
                                        this.$message({
                                            type : 'success',
                                            message : "设置成功!"
                                        })
                                        this.showStep = false;
                                    }else if(status == 4){//注册了账号 但没有提交店铺注册申请
                                        this.$store.commit("changeLogin",100);
                                        this.$message({type:"info",message:"您已设置过密码，请勿重复保存"})    
                                        this.$router.push({
                                            path : '/shopRegister',
                                        });
                                    }else if(status == 5){//店铺注册审核中
                                        this.$router.push({
                                            path : '/checking',
                                        });
                                    }else if(status == 6){//店铺通过审核但没有进店
                                        this.$store.commit("changeLogin",100);
                                        this.$router.push({
                                            path : '/firstEnter'
                                        });
                                    }else if(status == 7){//店铺通过审核并进过店
                                        this.$store.commit("changeLogin",100);
                                        this.$router.push({
                                            path : '/goods'
                                        });
                                    }else if(status == 8){//店铺审核被拒绝
                                        this.$router.push({
                                            path : '/notPass',
                                        });
                                    }
                                }else{
                                    this.$message({type:"warning",message:res.data.message});
                                }
                            }).catch(err=>{
                                console.log(err);
                            })
                        }
                }
            }
        }
    },
    write(){
        this.$store.commit("changeLogin",100);
        this.$router.push({
            path : '/shopRegister'
        });
    },
    checkBind(){
        if(this.$route.name == "setPassword"){
            this.$http.get("szmktstore/login/checkBind?phone="+ this.$store.state.loginInfo.phone).then(res=>{
                console.log(res);
                if(res.data.data != null){
                    this.dialogVisible = false;
                    if(res.data.code == 1000){
                        this.$message({type:"success",message:"绑定成功"});
                        clearInterval(this.bindTimer);
                        this.hasBinding();
                        this.$store.commit("updateLoginInfo",{
                            userId : res.data.data,
                            phone : this.$store.state.loginInfo.phone,
                            password : this.$store.state.loginInfo.password
                        });
                    }else{
                        this.$message({type:"warning",message:res.data.message});
                    }
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    }
  },
  created(){
    this.$store.commit("changeHeaderShow",true);
    this.$http.get("szmktstore/login/checkBind?phone="+ this.$store.state.loginInfo.phone).then(res=>{
        if(res.data.data != null){
            this.hasBinding();
            this.$store.commit("updateLoginInfo",{
                userId : res.data.data,
                phone : this.$store.state.loginInfo.phone,
                password : this.$store.state.loginInfo.password
            });
        }
    }).catch(err=>{
         console.log(err);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.setPassword{
    padding: 200px 0 80px 0;
    .setPasswordBox{
        width: 500px;
        height: 450px;
        background-color: #ffffff;
        margin: 0 auto;
    }
    .title{
        font-size: 40px;
        color: #333;
        margin: 0 auto 40px;
        padding-top: 20px;
    }
    .content,.correct{
        margin: 0 auto;
        width: 370px;
    }
    .codeImg{
        width: 160px;
        height: 160px;
        padding: 15px;
        border: 2px solid #a5a5a5;
        margin:0 auto;
        img{
            width: 100%;
            height: 100%;
        }
    }
    h2{
        text-align: center;
        //text-indent: 50px;
        font-size: 16px;
        font-weight: normal;
    }
    .correct{
        width: 180px;
        height: 180px;
        margin: 0 auto 20px;
        padding-top: 70px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .correctTitle{
        font-size: 18px;
    }
    .foot{
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
        .beian{
            color: #333;
        }
        .beian:hover{
            color: rgb(52, 110, 219);
        }
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