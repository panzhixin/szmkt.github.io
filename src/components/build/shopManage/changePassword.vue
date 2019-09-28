<template>
  <div class="changePassword">
    <div class="content-panel">
        <div class="form">
            <el-form label-width="110px" :model="info" :rules="infoRules">
                <el-form-item label="手机号码">
                    <el-input v-model="phone" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="短信验证码" prop="message">
                    <el-input placeholder="请输入短信验证码" v-model="info.message" class="input-with-select" maxlength="4" autocompleted="off">
                    <el-button slot="append" type="info" class="getMessage" :disabled="getMessageDis" @click="getMessageFunc">{{getMessage}}</el-button>
                </el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-tooltip class="item" effect="dark" content="请输入6到16位字母、英文符号或数字" placement="right">
                        <el-input v-model="info.newPassword" placeholder="请输入您的新密码" show-password maxlength="16"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="确认新密码" prop="againPassword">
                    <el-tooltip class="item" effect="dark" content="请输入6到16位字母、英文符号或数字" placement="right">
                        <el-input v-model="info.againPassword" placeholder="请重复输入您的新密码" show-password maxlength="16"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="change" style="padding:15px 80px;margin-top:50px;">确定修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'changePassword',
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
        getMessageDis : false,
        getMessage : "发送验证码",
        info : {
            message : "",
            newPassword : "",
            againPassword : ""
        },
        infoRules : {
            message : [
                {required : true,message : '请输入短信验证码',trigger : 'blur'}
            ],
            newPassword : [
                {required : true,message : '请输入新密码',trigger : 'blur'},
                { min:6 , max:16, message : '请输入6到16位字母、英文符号或数字',trigger : 'blur'},
                { validator: validatePass, trigger: 'blur' },
            ],
            againPassword : [
                {required : true,message : '请确认新密码',trigger : 'blur'},
                { validator: validatePass2, trigger: 'blur' }
            ]
        },
        revMessage:""
    }
  },
  computed:{
      phone(){
        return this.$store.state.loginInfo.phone;
      }
  },
  methods:{
      //点击确定修改事件
      change(){
            if(this.info.message == ""){
                this.$message({type:"warning",message:"请输入验证码"});
                return;
            }
            if(this.info.newPassword == ""){
                this.$message({type:"warning",message:"请输入新密码"});
                return;
            }
            if(!this.$filterWord(this.info.newPassword,this.$store.state.filterList)){
                this.$message({type:"error",message:"密码包含敏感词汇，请重试"});
                return;
            }
            if(this.info.againPassword == ""){
                this.$message({type:"warning",message:"请确定新密码"});
                return;
            }
            if((this.info.againPassword + "").length < 6 || (this.info.againPassword + "").length > 16){
                this.$message({type:"warning",message:"密码请输入6到16位"});
                return;
            }
            if(this.info.againPassword != this.info.newPassword){
                this.$message({type:"warning",message:"请确定两次密码一致"});
                return;
            }
            this.$http.get("szmktstore/login/password/update?account=" + this.$store.state.loginInfo.phone 
            + "&userid=" + this.$store.state.loginInfo.userId+ "&code=" +  this.info.message
            + "&password=" + encodeURIComponent(this.info.newPassword)).then(res=>{
                if(res.data.code == 1000){
                    this.$message({
                        message: '修改成功,请重新登录',
                        type: 'success',
                        duration : 1000
                    });
                    this.$router.push({ name: 'login'});
                    this.$store.commit("changeHeaderShow",true);
                }else{
                    this.$message({message: res.data.message,type: 'error'});
                }
            }).catch(err=>{
                console.log(err);
            })           
      },
      //请求发送手机验证码
      getMessageFunc(){
        this.$http.get("szmktstore/proxy/send/phoneCode?phone=" + this.phone + "&type=1").then(res => {
            if(res.data.code == 200){
                this.getMessageDis = true;
                //this.revMessage = "4312";
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
                },1000)
            }else{
                this.$message({type:"warning",message:res.data.message});
            }
        }).catch(err => {
            console.log(err);
        })
      }
  },
  mounted(){
      console.log(this.$store.state.loginInfo);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
.changePassword{
    .form{       
        width: 500px;
    }
    .content-panel{
        min-height: calc(100vh - 90px);
        background-color: white;
        box-sizing: border-box;
        margin: 15px;
        overflow: hidden;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
