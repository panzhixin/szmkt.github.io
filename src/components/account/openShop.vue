<template>
  <div class="openShop">
    <div class="openShopBox">
        <h1 class="mainTitle">神州集市正在火热招商中</h1>
        <h2 class="subtitle">旺铺摊位，千金难求</h2>
        <div class="form-box">  
            <el-form label-width="80px" :model="shopInfo" :rules="shopRules">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="shopInfo.name" placeholder="请输入您的姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="shopInfo.phone" placeholder="请输入您的手机号码" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" style="width:100%;margin-top:15px;" @click="order">立即抢订</el-button>
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
    return {
        shopInfo : {
            name : "",
            phone : ""
        },
        shopRules : {
            name : [
                {required : true,message : '请输入姓名',trigger : 'blur'},
            ],
            phone : [
                {required : true,message : '请输入手机号码',trigger : 'blur'},
                {min : 11,max : 11,message : '手机号码应为11位数字',trigger : 'blur'},
            ]
        }
    }
  },
  methods:{
      //抢购注册凭证
      order(){ 
          if(this.shopInfo.name == ""){
            this.$message({ type : "warning",message : "请填写您的姓名"});
            return;
          }
          if(this.shopInfo.phone == ""){
            this.$message({ type : "warning",message : "请填写手机号码"});
            return;
          }
          if((this.shopInfo.phone + "").length != 11){
            this.$message({ type : "warning",message : "手机号码长度应为11位"});
            return;
          }
          if(typeof (this.shopInfo.phone - 0) != "number"){
            this.$message({ type : "warning",message : "手机号码应为11位数字"});
            return;
          }
          this.$http.get("szmktstore/login/entry?userName=" + this.shopInfo.name +"&phone=" + this.shopInfo.phone).then(res => {
                if(res.data.code == 1000){
                    this.$router.push({
                        name : 'submitShop',
                    })
                }else{
                    this.$message({type:"error",message:res.data.message});
                }
            }).catch(err => {
                console.log(err);
          })
          
      }
  },
  mounted () {
      this.$store.commit("changeNavActive",1);
      this.$store.commit("changeHeaderShow",true);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.openShop{  
    padding: 200px 0 80px 0;
    .openShopBox{
        width: 700px;
        height:400px;
        background-color: #ffffff;
        margin: 0 auto;
    }
    .mainTitle{
        font-size: 40px;
        line-height: 100px;
        margin: 30px 0 0 0;
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
.el-button--primary:hover{
  background-color: #d22c2c;
}
</style>
