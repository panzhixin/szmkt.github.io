<template>
  <div class="searchPromotion">
    <div class="search-head">
      <!-- <el-tooltip class="item" effect="dark" content="输入商品名称进行搜索" placement="left">
        <el-input placeholder="请输入商品名称" style="width:300px;margin-left:150px;margin-right:20px;" v-model="searchTxt"></el-input>
      </el-tooltip>
      <el-button type="primary" style="margin-left:10px;margin-right:20px;" @click="search">搜索</el-button> -->
      <el-input placeholder="输入商品名称进行搜索" v-model="searchTxt" style="margin-right:20px;" class="searchInput" clearable>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <!-- <el-button type="text" style="margin-left:10px;margin-right:20px;" @click="cancelSearch">取消搜索</el-button> -->
    </div>
    <div class="content">
      <div class="goods-box">
        <ul class="goods-list">
          <li v-for="item in goodsList" :key="item.index" @click="goGoods(item.id)">
            <img :src="$filePath.photo + item.picUrl1"/>
            <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
              <p class="goods-title">{{item.title}}</p>
            </el-tooltip>
            <p class="goods-price">￥{{(item.salePrice/100).toFixed(2)}}
              <span class="original-price">{{(item.mktPrice/100).toFixed(2)}}</span>
            </p>
            <p class="goods-stock">库存:{{item.stock}}</p>
          </li>
        </ul>
        <p class="noData" v-if="noData">暂无数据</p>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="curPage"
          @current-change="changePage"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'searchPromotion',
  data () {
    return {
      ruleStatus : false,
      searchTxt : "",
      catalogList : [],
      activeItem : 0,
      goodsList:[],
      curPage: 1,
      total : 10,
      searchStatus : false
    }
  },
  computed:{
    noData(){
      if(this.goodsList.length > 0){
        return false;
      }else{
        return true;
      }
    }
  },
  watch:{
    $route:'changePath',
    searchTxt(val){
      if(val == ""){
        this.$router.push({name:"promotion"});
      }
    }
  },
  methods:{
    chooseCatalog(index){
      this.activeItem = index;
    },
    search(){
      if(this.searchTxt.length == 0){
        this.$message({message:"请输入要搜索的商品名称",type:"warning"});
        return;
      }
      if(!this.$filterWord(this.searchTxt,this.$store.state.filterList)){
        this.$message({type:"error",message:"搜索内容包含敏感词汇，请重试"});
        return;
      }
      this.curPage = 1;
      this.$router.push({name:"searchPromotion",query:{search:this.searchTxt}});
    },
    changePage(){
      this.loadList(this.searchTxt);
    },
    goGoods(id){
      this.$router.push({name:"buyPromotion",query:{goodsId:id}});
    },
    cancelSearch(){
      this.$router.push({name:"promotion"});
    },
    loadList(keyWords){
      this.$http.get("/szmktbackstage/promotion/store/search?userid=" + this.$store.state.loginInfo.userId 
      + "&keyWords=" + keyWords + "&size=10&page=" + (this.curPage - 1)).then(res=>{
        if(res.data.code == 1000){
          this.goodsList = res.data.data.content;
          this.total = res.data.data.totalPages * 10;
        }else{
          this.$message({type:"error",message:res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    changePath(){
      this.searchTxt = this.$route.query.search;
      this.loadList(this.searchTxt);
    }
  },
  created(){
    let _this = this;
    this.$store.commit("changeHeaderShow",false);
    this.$store.commit("changeActiveShopItem","4");
    this.$store.commit("changeShopNavTitle","促销品广场");
    if(this.$route.query.search != undefined && this.$route.query.search != ""){
      this.searchTxt = this.$route.query.search;
      this.loadList(this.searchTxt);
    }
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if(_this.$route.name == "searchPromotion"){
        if (key == 13) {
          _this.search();
        }
      }
    };  
  }
}
</script>

<style scoped  lang="less">
.searchPromotion{
  font-size: 16px;
  .search-head{
    float: right;
    margin: 40px 30px 30px 0;
    display: flex;
  }
  .el-icon-question{
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  [class*=" el-icon-"], [class^=el-icon-]{
    font-size: 24px;
  }
  .content{
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 0 150px;
    .catalog-box{
      flex:1;
      .catalog{
        width: 100px;
        margin: 0 auto;
        line-height: 40px;
        dt{
          background-color: #4e749a;
          color: white;
          border: 1px solid #4e749a;
        }
        dd{
          border: 1px solid #666;
          border-top:none;
          cursor: pointer;
        }
        dd:hover,dd.active{
          background-color: #6aabef;
          color:white;
        }
      }
    }
    .goods-box{
      flex: 7;
    }
    .goods-list{
      display: flex;
      flex-wrap: wrap;
      li{
        width: 200px;
        background-color: white;
        padding:20px 20px 10px;
        cursor: pointer;
        margin: 0 30px 20px 0;
        position: relative;
        img{
          width: 180px;
          height:180px;
        }
        p{
          width: 190px;
          margin: 0 auto;
        }
        .goods-title{
          text-align: justify;
          color: #333;
          line-height: 25px;
          height: 50px;
          margin-top: 5px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
        }
        .goods-price{
          padding: 5px 0;
          text-align: left;
          font-size: 18px;
          color: #f25664;
        }
        .goods-stock{
          text-align: left;
          font-size: 16px;
          color: #999;
        }
        .original-price{
          text-decoration: line-through;
          font-size: 12px;
          padding-left: 5px;
          color: #e3e3e3;
        }
      }
      li:hover{
        box-shadow: #959595 0 0 20px;
      }
    }
  }
  .noData{
    font-size: 20px;
    line-height: 100px;
  }
}
</style>
