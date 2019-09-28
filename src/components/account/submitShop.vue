<template>
  <div class="submit">
    <div class="submitBox">
        <div class="correct">
            <img src="../../assets/img/succeed.png"/>
        </div>
        <p class="correctTitle firstTitle">已提交</p>
        <p class="correctTitle">我们会尽快与您联系，记得保持电话畅通哦</p>
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
  name: 'checking',
  data () {
    return {
        
    }
  },
  mounted(){
    this.$store.commit("changeHeaderShow",true);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.submit{
    padding: 180px 0 80px 0;
    .submitBox{
        width: 600px;
        height: 500px;
        background-color: #fff;
        margin: 0 auto;
    }
    .correct{
        width: 180px;
        height: 180px;
        margin: 0 auto 30px;
        padding-top: 80px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .correctTitle{
        font-size: 24px;
        color: #222;
    }
    .firstTitle{
        font-size: 36px;
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
</style>
