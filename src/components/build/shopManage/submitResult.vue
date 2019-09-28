<template>
  <div class="submitResult">
    <div class="stepControl">
      <el-steps :active="activeStep" align-center finish-status="success">
        <el-step title="编辑基本信息"></el-step>
        <el-step title="组合搭配与活动设置"></el-step>
        <el-step title="完成设置"></el-step>
        </el-steps>
    </div>
    <div class="content-panel">
      <div class="resultContent">
        <header></header>
        <p class="title">{{text}}</p>
        <el-button class="return" type="success" @click="returnList" style="width:200px;">返回商品列表</el-button>
        <el-button class="addNew" type="primary" @click="createNew" style="width:200px;">创建新商品</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'submitResult',
  data () {
    return {
      activeStep : 2,
      text : "商品已提交，请耐心等待审核"
    }
  },
  methods:{
      returnList(){
          this.$router.push({
            name : "goods"
          })
      },
      createNew(){
          this.$router.push({
            name : "addGoods"
          })
      }
  },
  created(){
    if(this.$route.query.type == 1 || this.$route.query.type == "1"){
      this.text = "商品已提交";
    }
  }
}
</script>

<style scoped  lang="less">
.submitResult{
    width: calc(100% - 40px);
    margin:20px auto;
    header{
        width: 96px;
        height: 96px;
        margin: 0 auto 30px;
        background: url(../../../assets/img/yes.png);
        background-size: 100% 100%;
    }
    .title{
        font-size: 18px;
        margin-bottom: 30px;
    }
    .stepControl{
      width:100%;
      box-sizing:border-box;
      margin:30px 0;
      padding:20px;
      background:white;
      border-radius: 5px;
    }
    .content-panel{
      height: calc(100vh - 340px);
      background-color: white;
      padding:10px 0 50px 20px;
      margin-bottom: 15px;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .return{
      background-color: white;
      border: 1px solid #4181FE;
      color: #4181FE;
    }
    .return:hover{
      background-color: #4181FE;
      color: #fff;
    }
    .addNew{
      background-color: #4181FE;
    }
    .addNew:hover{
      background-color: #0966c3;
      border-color: #0966c3;
    }
}
</style>
