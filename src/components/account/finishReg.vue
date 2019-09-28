<template>
  <div class="finishReg">
    <div class="finishBox">
        <div class="correct">
            <img src="../../assets/img/succeed.png"/>
        </div>
        <p class="correctTitle">恭喜您的旺铺已开张</p>
        <p class="correctTitle">快去店铺看看吧</p>
        <el-button type="primary" style="padding:15px 50px;margin-top:30px;" @click="goShop">前往店铺</el-button>
        <div class="foot">
            Copyright © 2012-2019 All Rights Reserved 荟友网络科技版权所有
            <img src='http://www.sqplus.cn/images/beian.png' style='height:20px;width:20px'>粤公网安备 44030402000907号 网站备案许可证号:
            <a href="http://beian.miit.gov.cn/" class="beian">粤ICP备17057713号-4</a>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'finishReg',
  data () {
    return {
    }
  },
  computed:{

  },
  methods:{
      goShop(){
          this.$router.push({
             name : "firstEnter",
          })
      }
  },
  mounted(){
      this.$store.commit("changeHeaderShow",true);
      //店铺注册完成后，根据用户id获取店铺信息
      this.$http.get("szmktstore/storeInfo/myBase?userid=" + this.$store.state.loginInfo.userId).then(res=>{
        if(res.data.code == 1000){
            let loginInfo = {
                userId : this.$store.state.loginInfo.userId,
                phone : this.$store.state.loginInfo.phone,
                password : this.$store.state.loginInfo.password,
                storeName : res.data.data.storeName,
                storeId : res.data.data.id
            };
            this.$store.commit("updateLoginInfo",loginInfo);
        }
      }).catch(err=>{  
          console.log(err);
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.finishReg{
        padding: 200px 0 80px 0;
    .finishBox{
        width: 600px;
        height: 440px;
        background-color: #fff;
        margin: 0 auto;
    }
    .correct{
        width: 180px;
        height: 180px;
        margin: 0 auto 20px;
        padding-top: 50px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .correctTitle{
        font-size: 24px;
        color: #333;
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
