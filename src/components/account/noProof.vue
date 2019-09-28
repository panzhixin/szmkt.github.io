<template>
  <div class="noProof">
    <div class="noProofBox">
      <div class="error">
          <img src="../../assets/img/failed.png"/>
      </div>
      <p class="errorTitle">对不起，你还没有开店凭证哦</p>
      <el-button type="primary" @click="openShop" style="margin-top:30px;padding:15px 50px;">我要开店</el-button>
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
  name: 'noProof',
  data () {
    return {
    }
  },
  methods : {
      openShop(){
        window.location.href = this.$filePath.enterPath;
          // this.$router.push({
          //   name : 'openShop',
          // })
      }
  },
  mounted(){
    this.$store.commit("changeHeaderShow",true);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.noProof{
    padding: 200px 0 80px 0;
    .noProofBox{
      width: 400px;
      height: 410px;
      background-color: #ffffff;
      margin: 0 auto;
    }
    .error{
        width: 245px;
        height: 170px;
        margin: 0 auto 30px;
        padding-top: 50px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .errorTitle{
        font-size: 20px;
        .red{
            color: red;
        }
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
