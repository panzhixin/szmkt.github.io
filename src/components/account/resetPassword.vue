<template>
  <div class="resetPassword">
    <div class="resetBox">
      <h1 class="mainTitle">密码重置</h1>
      <div class="form-box">  
          <el-form label-width="130px" :model="info" :rules="passwordRules">
              <el-form-item label="手机" prop="phone">
                  <el-input v-model="info.phone" placeholder="请输入您的手机号码" maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="短信验证码" prop="message" class="getMes">
                  <el-input placeholder="请输入短信验证码" v-model="info.message" class="input-with-select" maxlength="4">
                      <el-button slot="append" type="info" class="getMessage" :disabled="getMessageDis" @click="getMessageFunc">{{getMessage}}</el-button>
                  </el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                  <el-tooltip class="item" effect="dark" content="请输入6到16位字母、英文符号或数字" placement="right">
                      <el-input v-model="info.newPassword" placeholder="请输入您的新密码" show-password></el-input>
                  </el-tooltip>
              </el-form-item>
              <el-form-item label="确认新密码" prop="againNew">
                  <el-tooltip class="item" effect="dark" content="请输入6到16位字母、英文符号或数字" placement="right">
                      <el-input v-model="info.againNew" placeholder="请重复输入您的新密码" show-password></el-input>
                  </el-tooltip>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" style="width:100%;margin-top:30px;" @click="resetAction">确定重置</el-button>
              </el-form-item>
          </el-form>                                                                                                                                                          
      </div>
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
  name: 'openShop',
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
        } else if (value !== this.info.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
        getMessage : '发送手机验证码',
        recMessage : "",
        getMessageDis : false,
        info : {
            phone : "",
            message : '',
            newPassword : '',
            againNew : ''
        },
        passwordRules : {
            phone : [
                {required : true,message : '请输入手机号码',trigger : 'blur'},
                {min : 11,max : 11,message : '手机号码应为11位数字',trigger : 'blur'}
            ],
            message : {required : true,message : '请输入短信验证码',trigger : 'blur'},
            newPassword : [
                { required : true,message : '请输入新密码',trigger : 'blur'},
                { min:6 , max:16, message : '请输入6到16位字母、英文符号或数字',trigger : 'blur'},
                { validator: validatePass, trigger: 'blur' },
            ],
            againNew : [
                {required : true,message : '请确定新密码',trigger : 'blur'},
                { validator: validatePass2, trigger: 'blur' }
            ]
        }
    }
  },
  methods:{
      getMessageFunc(){
           //请求发送手机验证码
          let phone = this.info.phone;
          if(phone == ""){
              this.$message({
                type : "warning",
                message : "请先输入手机号码"
              })
          }else if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)){
              this.$message({
                  type : "error",
                  message : "请输入11位有效手机号码"
              })
          }else{   
            this.$http.get("szmktstore/proxy/send/phoneCode?phone=" + phone + "&type=1").then(res => {
                    //console.log(res);
                    this.recMessage = "4312";
                    if(res.data.code == 200){
                      this.getMessageDis = true;
                      let second = 60;//倒计时60S
                      let timer = null;
                      let self = this;
                      this.$message({type:"success",message:"短信已发送，请及时查收"});
                      timer = setInterval(function(){
                          second -= 1;
                          if(second > 0){
                              self.getMessage = second + "S后获取";
                          }else{
                              self.getMessage = "获取验证码";
                              self.getMessageDis = false;
                              clearInterval(timer);
                          }
                      },1000);
                    }else{
                      this.$message({
                        type: "warning",
                        message: res.data.message
                      });
                    }
            }).catch(err => {
                console.log(err);
            })
          }
      },
      //修改密码
      resetAction(){
          //重置后的操作
          let phone = this.info.phone;
          let password = this.info.newPassword;
          let secondPassword = this.info.againNew;
          let code = this.info.message;
          if(phone==""){
            this.$message({message: '请填写手机号',type: 'warning'});
            return;
          }
          if(code==""){
            this.$message({message: '请填写手机验证码',type: 'warning'});
            return;
          }
          if(password==""){
            this.$message({message: '请填写密码',type: 'warning'});
            return;
          }
          if(secondPassword==""){
            this.$message({message: '请确定新密码',type: 'warning'});
            return;
          }
                  
          if(password != secondPassword){
                this.$message({
                    message: '请确保两次密码输入一致',
                    type: 'error'
                });
              }else{
                this.$http.get("szmktstore/login/password/reset?account=" + phone +"&password=" + encodeURIComponent(password) + "&code=" + code).then(res=>{
                    //console.log(res);
                    if(res.data.code == 1000){
                        this.$message({
                            message: '修改成功，请重新登录',
                            type: 'success'
                        });
                        this.$router.push({
                            name : 'login',
                        })
                    }else{
                        this.$message({type:"warning",message:res.data.message});
                    }
                }).catch(err => {
                    console.log(err);
                })
              }
        }       
          
  },
  mounted(){
    this.$store.commit("changeHeaderShow",true);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.resetPassword{
    padding: 150px 0 80px 0;
    .resetBox{
      width: 700px;
      height: 550px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .mainTitle{
        font-size: 40px;
        margin: 0;
        padding-top: 50px;
    }
    .subtitle{
        margin: 0;
        font-size: 16px;
        font-weight: normal;
    }
    .form-box{
        width: 450px;
        margin: 50px auto;
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
.getMes{
  .el-button:hover{
    background-color: #f5f7fa;
    border-color: #f5f7fa;
  }
}
</style>
