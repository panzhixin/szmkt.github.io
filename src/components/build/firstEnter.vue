<template>
  <div class="firstEnter">
    <div class="firstEnterBox">
      <div class="case">
        <img src="../../assets/img/shop.png"/>
      </div>
      <div class="idea">    
        <div class="decoration">
          <p>这样子的介绍可以为你赢得不少人气呢</p>
          <el-button type="primary" @click="decoration" style="padding:15px 60px;margin:30px 0 0 40px;">前去装修品牌</el-button>
        </div> 
      </div>
      <div class="foot">
        Copyright © 2012-2019 All Rights Reserved 荟友网络科技版权所有
        <img
          src="../../assets/img/beian.png"
          style="height:20px;width:20px"
        >粤公网安备 44030402000907号 网站备案许可证号:
        <a
          href="http://beian.miit.gov.cn/"
          class="beian"
        >粤ICP备17057713号-4</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'firstEnter',
  data () {
    return {

    }
  },
  methods : {
    //首次进入店铺应跳转品牌装修
    decoration(){
      this.$store.commit("changeFirstEnter");
      this.$store.commit("changeActiveShopItem","2");
      this.$router.push({
        name : 'decoration',
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
.firstEnter{
  padding: 150px 0 80px 0;
  position: relative;
  .firstEnterBox{
    display: flex;
    width: 800px;
    height: 600px;
    margin : 0 auto;
    background-color: #ffffff;
  }
  .case{
    display: flex;
    flex: 4;
    justify-content: flex-end;
    align-items: center;
    img{
      width: 200px;
      height: 410px;
      margin: 0 auto;
    }
  }
  .idea{
    display: flex;
    flex: 5;
    padding-top: 350px;
    background: url(../../assets/img/show.png) 60px 150px no-repeat;
    background-size: 275px 207px;
    text-indent: 20px;
    font-size: 20px;
    .decoration{
      padding-top: 30px;
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
