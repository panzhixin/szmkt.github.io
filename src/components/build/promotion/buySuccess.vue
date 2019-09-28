<template>
  <div class="buySuccess">
    <div class="yes"></div>
    <p>支付已完成，快去“商品管理-我的仓库”中查看吧</p>
    <el-button style="width:200px;" @click="goPromotion">前去促销品广场</el-button>
    <el-button type="primary" style="width:200px;" @click="goDepository">我的仓库</el-button>
  </div>
</template>

<script>
export default {
  name: 'buySuccess',
  data () {
    return {
    }
  },
  methods:{
    goDepository(){
      this.$router.push({name:"goods",query:{type:2}});
    },
    goPromotion(){
      this.$router.push({name:"promotion"});
    }
  }
}
</script>

<style scoped  lang="less">
.buySuccess{
  .yes{
    width: 300px;
    height: 300px;
    margin: 150px auto 15px;
    background: url(../../../assets/img/succeed.png);
    background-size: 100% 100%;
  }
  p{
    font-size: 24px;
    line-height: 80px;
  }
}
</style>
