<template>
  <div class="notPass">
    <div class="notPassBox">
      <div class="wrong">
          <img src="../../assets/img/failed.png"/>
      </div>
      <p class="title">很抱歉，您的申请未通过，理由如下：</p>
      <p class="reason">{{reason}}</p>
      <el-button type="primary" @click="reSubmit" style="margin-top:30px;padding:15px 100px;">重新提交</el-button>
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
  name: 'notPass',
  data () {
    return {
    }
  },
  computed:{
      reason(){
        return this.$route.query.reason;
      }
  },
  methods : {
      //重新提交店铺注册
      reSubmit(){
          this.$router.push({
              name : 'shopRegister',
              query:{
                  reSubmit : true
              }            
          })
      }
  },
  mounted(){
    this.$store.commit("changeHeaderShow",true);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.notPass{
    padding: 200px 0 80px 0;
    .notPassBox{
      width: 400px;
      height: 430px;
      background-color: #ffffff;
      margin: 0 auto;
    }
    .wrong{
        width: 245px;
        height: 170px;
        margin: 0 auto 30px;
        padding-top: 50px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .title{
        font-size: 20px;
        font-weight: bold;
    }
    .reason{
        font-size: 24px;
        color: red;
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
