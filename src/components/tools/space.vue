<template>
  <div class="space">
    <div class="foot">
        Copyright © 2012-2019 All Rights Reserved 荟友网络科技版权所有
        <img src='../../assets/img/beian.png' style='height:20px;width:20px'>粤公网安备 44030402000907号 网站备案许可证号:
        <a href="http://beian.miit.gov.cn/" class="beian">粤ICP备17057713号-1</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'space',
  data () {
    return {
    }
  },
  mounted(){
    this.$router.push({name:"login",params:{activeItem:"wx"}});
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
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
</style>
