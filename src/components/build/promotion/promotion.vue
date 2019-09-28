<template>
  <div class="promotion">
    <div class="promotion-box">
      <div class="promotion-head">
        <div class="search-head">
          <span style="margin-right:30px;display:flex;cursor:pointer;" @click="showRules">
            <i class="el-icon-question" style="width:20px;"></i>
            <span style="width:40px;line-height:44px;color:#4181FE;font-size:16px;">规则</span>
          </span>
          <el-input placeholder="输入商品名称进行搜索" v-model="searchTxt" clearable class="searchInput">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="catalog-box">
          <dl class="catalog" v-if="isShowCatalog">
            <dd :class="activeItem == -1 ? 'active' : ''" @click="chooseCatalog(-1)">最新单品</dd>
            <dd v-for="(item,index) in catalogList" :key="index" :class="index == activeItem ? 'active' : ''" @click="chooseCatalog(index,item.id)">{{item.title}}</dd>
          </dl>
        </div>
      <div class="content">
        <div class="goods-box">
          <p class="noData" v-if="noData"></p>
          <ul class="goods-list"> 
            <li class="goods-listItem" v-for="item in goodsList" :key="item.index" @click="goGoods(item.id)">
              <img :src="$filePath.photo + item.picUrl1"/>
              <p class="goods-title">{{item.title}}</p>
              <p class="goods-other">
                <span class="goods-price">￥{{(item.salePrice/100).toFixed(2)}}</span>
                <span class="original-price">{{(item.mktPrice/100).toFixed(2)}}</span>
              </p> 
              <p>
                <span class="goods-stock">库存:{{item.stock}}</span>
              </p>
            </li>
          </ul>
          
        </div>
        <el-pagination
            style="margin-right:30px;"
            background
            layout="prev, pager, next,jumper"
            :current-page.sync="curPage"
            @current-change="changePage"
            :total="total">
          </el-pagination>
      </div>
    </div>
    <div class="cover" v-show="ruleStatus"></div>
    <div class="rulesWin" v-show="ruleStatus">
      <p class="rules-head">规则<i class="el-icon-close closeBtn" @click="closeRules"></i></p>
      <div class="rules-body">
        <p>1、不同的身份享有不同的促销价格，身份越高价格越低</p>
        <p>2、商家预定成功后，可以在“商品管理-我的仓库”查看</p>
        <p>3、商家可以为自己的商品搭配促销品，搭配比例以及促销品的价格可以由商家自行设置</p>
        <p>4、成功售卖出组合后，平台将会根据订单信息发货</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'promotion',
  data () {
    return {
      isShowCatalog : true,
      ruleStatus : false,
      searchTxt : "",
      catalogList : [],
      activeItem : -1,
      goodsList:[],
      curPage: 1,
      total : 10,
      searchStatus : false,
      classifyId : ""
    }
  },
  watch:{
    searchTxt(val){
      if(val == ""){
        this.isShowCatalog = true;
        this.activeItem = -1;
        this.loadList("","");
      }else{
        this.search();
      }
    },
  },
  computed:{
    noData(){
      if(this.goodsList.length == 0){
        return true
      }else{
        return false
      }
    }
  },
  methods:{
    chooseCatalog(index,id){
      this.activeItem = index;
      this.curPage = 1;
      if(index == -1){
        this.classifyId = "";
        this.loadList("","");
      }else{
        this.classifyId = id;
        this.loadList("",id);
      }
    },
    search(){
      if(this.searchTxt.length == 0){
        this.$message({message:"请输入要搜索的商品名称",type:"info"});
        return;
      }
      if(!this.$filterWord(this.searchTxt,this.$store.state.filterList)){
        this.$message({type:"error",message:"搜索内容包含敏感词汇，请重试"});
        return;
      }
      //this.$router.push({name:"searchPromotion",query:{search : this.searchTxt}});
      this.isShowCatalog = false;
      this.loadList(this.searchTxt,"0");
    },
    changePage(){
      this.loadList("",this.classifyId);
    },
    goGoods(id){
      this.$router.push({name:"buyPromotion",query:{goodsId:id}});
    },
    showRules(){
      this.ruleStatus = true;
    },
    closeRules(){
      this.ruleStatus = false;
    },
    loadCatalog(){
      this.$http.get("/szmktbackstage/goodsClassify/children").then(res=>{
        if(res.data.code == 1000){
          this.catalogList = res.data.data;
        }else{
          this.$message({type:"error",message:res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    loadList(keyWords,classifyId){
      this.$http.get("/szmktbackstage/promotion/store/search?userid=" + this.$store.state.loginInfo.userId 
      + "&keyWords=" + keyWords + "&classifyId=" + classifyId + "&size=10&page=" + (this.curPage-1) ).then(res=>{
        if(res.data.code == 1000){
          this.goodsList = res.data.data.content;
          this.total = res.data.data.totalPages * 10;
          document.documentElement.scrollTop = 0;
        }else{
          this.$message({type:"error",message:res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  created(){
    this.loadCatalog();
    this.loadList("","");
  },
  mounted(){
    let _this = this;
    this.$store.commit("changeHeaderShow",false);
    this.$store.commit("changeActiveShopItem","4");
    this.$store.commit("changeShopNavTitle","促销品广场");
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13 && _this.$route.name == "promotion" ) {
        _this.search();
      }
    };
  }
}
</script>

<style scoped  lang="less">
.promotion{
  font-size: 16px;
  background-color: #E5E8ED;
  .promotion-box{
    min-width:1630px;
    padding-top:84px;
    width: calc(100vw - 250px);
    min-height: calc(100vh - 100px);
    margin: 20px;
    background-color: white;
    border-radius: 5px;
    position: relative;
  }
  .promotion-head{
    overflow: hidden;
    width: 1630px;
    margin: 0 auto;
  }
  .search-head{
    position: absolute;
    right: 24px;
    top: 20px;
    display: flex;
  }
  .el-icon-question{
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  [class*=" el-icon-"], [class^=el-icon-]{
    font-size: 18px;
    color:#4181FE;
  }
  .catalog-box{
      width: calc(100% - 10px);
      .catalog{
        background: white;
        overflow: hidden;
        margin:0 20px 20px;
        padding:10px 10px 5px;
        font-size: 16px;
        color: #ABB2C0;
        position: relative;
        dd{
          float: left;
          padding:0 15px;
          line-height: 20px;
          cursor: pointer;
          position: relative;
          margin-bottom: 5px;
          // border-left: 1px solid #ABB2C0;
        }
        dd::before{
          content: "";
          display: block;
          width: 1px;
          height:16px;
          position: absolute;
          left: 0;
          top: 2px;
          background-color: #ABB2C0;
          z-index: 45;
        }
        dd.active,dd:hover{
          color:#4181FE;
        }
      }
      .catalog::before{
        content: "";
          display: block;
          width: 10px;
          height:100%;
          position: absolute;
          left: 5px;
          top: 2px;
          background-color: white;
          z-index: 50;
      }
    }
  .content{
      box-sizing: border-box;
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;
    .goods-box{
      display: flex;
      width: 1630px;
    }
    .goods-list{
      // display: flex;
      // flex-wrap: wrap;
      padding: 20px 0 0 20px;
      overflow: hidden;
      min-height: 620px;
      .goods-listItem{
        float: left;
        width: 260px;
        height: 372px;
        background-color: white;
        padding:20px 20px 10px;
        cursor: pointer;
        margin: 0 20px 20px 0;
        position: relative;
        border: 1px solid #E5E8ED;
        border-radius: 3px;
        img{
          width: 250px;
          height:250px;
        }
        p{
          width: 240px;
          margin: 0 auto;
          overflow: hidden;
        }
        .goods-title{
          text-align: justify;
          color: #333;
          line-height: 25px;
          height: 50px;
          margin-top: 15px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
        }
        .goods-other{
          overflow: hidden;
          padding-top: 5px;
        }
        .goods-price{
          text-align: left;
          font-size: 18px;
          color: #f25664;
          line-height: 20px;
          float: left;
        }
        .goods-stock{
          text-align: left;
          font-size: 12px;
          color: #999;
          float: right;
          line-height: 20px;
        }
        .original-price{
          text-decoration: line-through;
          font-size: 12px;
          padding-left: 5px;
          color: #e3e3e3;
          line-height: 20px;
          float: left;
        }
      }
      .goods-listItem:hover{
        box-shadow: #959595 0 0 20px;
      }
    }
  }
  .noData{
    font-size: 20px;
    line-height: 150px;
    width: 100%;
    text-align: center;
    background: url(../../../assets/img/empty.png) center center no-repeat;
    background-size: 320px 320px;
  }
  .cover{
    width: 100%;
    height:100%;
    position: absolute;
    top:0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 50;
  }
  .rulesWin{
    width: 400px;
    position: absolute;
    background-color: white;
    border-radius: 3px;
    top: 150px;
    left: 50%;
    margin-left: -100px;
    z-index: 100;
    .rules-head{
      line-height: 50px;
      font-size: 20px;
      border-bottom: 1px solid #909399;
      position: relative;
    }
    .rules-body{
      line-height: 30px;
      width: 300px;
      margin: 0 auto;
      text-align: justify;
      padding: 30px 0;
    }
    .closeBtn{
      position: absolute;
      right: 20px;
      top: 15px;
      cursor: pointer;
    }
  }
}
</style>
