<template>
  <div class="buyPromotion">
    <p class="returnPrev" @click="returnList">返回促销品广场</p>
    <div class="goods-content">
      <div class="goods-introduce">
        <div class="pic-show">
          <img :src="activeImg" class="pic-scale"/>
          <div class="pic-operate">
            <span class="goLeft" @click="goImg(-1)"></span>
            <span class="goRight" @click="goImg(+1)"></span>
            <ul class="pic-list">
              <li 
              v-for="(item,index) in goods.picUrls" 
              :key="index"
              :class="index == activeImgIndex ? 'active' : ''"
              @click="scaleImg(item,index)">
                <img :src="$filePath.photo + item"/>
              </li>
            </ul>
          </div>
        </div>
        <div class="buy-detail">
          <p class="buy-title">{{goods.title}}</p>
          <div class="price-box">
            <p class="sale-price"><span class="price-title">市场零售价</span><span class="price-content">{{(goods.mktPrice/100).toFixed(2)}}</span></p>
            <p class="promotion-price"><span class="price-title">促销价</span>
              <span class="price-content">{{(goods.salePrice/100).toFixed(2)}}</span>
            </p>
            <div class="buy-hot">
              <p class="other-content">{{goods.visitNum}}</p>
              <p class="other-title">热度</p>
            </div>
            <div class="buy-hot buy-order">
              <p class="other-content">{{goods.reserveNum}}</p>
              <p class="other-title">预定</p> 
            </div>
          </div>
          <p class="buy-transport">运费<span class="transport-content">包邮代发</span></p>
          <!-- <div class="buy-other">
            <p class="buy-hot">热度<span class="other-title">{{goods.visitNum}}</span></p>
            <p class="buy-order">预定<span class="other-title">{{goods.reserveNum}}</span></p>
          </div> -->
          <p class="buy-min">最低起购件数{{goods.minimum}}</p>
          <div class="buy-count">
            <span>数量</span>
            <el-input-number :precision="0" v-model.number="buyNum" :min="minimum" :max='maximum' style="text-indent:0;margin: 0 20px;"></el-input-number>
            <span>(库存{{goods.stock}})</span>
          </div>
          <!-- <el-button type="primary" 
          style="margin:30px 20px;width:300px;" :disabled="buyUse" @click="buyThis(buyNum)">立即预定</el-button> -->
          <span class="buyBtn" :disabled="buyUse" @click="buyThis(buyNum)">立即预购</span>
        </div>
      </div>
      <div class="goods-detail">
        <p class="detail-title"><span>商品详情</span></p>
        <div class="detail-content" v-html="goods.description"></div>
      </div>
    </div>
    <div class="guess" v-if="goodsList.length != 0">
      <p class="guess-title"><em>猜你喜欢</em></p>
      <ul class="goods-list">
          <li v-for="item in goodsList" :key="item.index" @click="goGoods(item.id)">
            <img :src="$filePath.photo + item.picUrl1"/>
            <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
              <p class="goods-title">{{item.title}}</p>
            </el-tooltip>
            <p class="goods-other">
              <span class="goods-price">￥{{(item.salePrice/100).toFixed(2)}}</span>
              <span class="original-price">{{(item.mktPrice/100).toFixed(2)}}</span> 
            </p>
            <p>
              <span class="goods-stock">库存:{{item.stock}}</span>
            </p>
          </li>
      </ul>
      <!-- <el-button style="width:100%;margin-top:20px;" @click="returnList">返回促销品列表</el-button> -->
    </div>
    <!-- <el-dialog title="支付订单" :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="700px"
     @close="closeHandle">
      <p class="payTitle">订单编号：{{orderNum}}，应付金额：￥<span style="color:#de0d0d;font-weight:bold;">{{(pay/100).toFixed(2)}}</span></p>
      <div class="payCode">
        <div class="payBox" id="qrcode" ref="qrcode"></div>
      </div>
      <div class="payTip"></div>
      <p>该订单30分钟内有效，请尽快支付</p>
    </el-dialog> -->

    <el-dialog title="取消订单" 
    :visible.sync="cancelVisible" 
    :close-on-click-modal="false" width="500px" class="cancelWin">
      <div style="font-size:20px;">您存在一笔尚未支付的订单!</div>
      <p><span class="cancelTitle">订单号</span><span class="cancelContent">{{orderHistory.num}}</span></p>
      <p><span class="cancelTitle">订单生成时间</span><span class="cancelContent">{{formatTime(orderHistory.time)}}</span></p>
      <el-button type="primary" style="margin-right:20px;" @click="payAgain">支付上笔订单</el-button>
      <el-button @click="cancelPay">取消上笔订单</el-button>
    </el-dialog>
    <div class="cover" v-if="dialogTableVisible"  @click="closeHandle"></div>
    <div class="wxPay-win" v-if="dialogTableVisible">
      <span class="closeBtn" @click="closeHandle"></span>
      <p class="payMoneyCul">支付金额：<span class="payMoneyTxt">￥{{(pay/100).toFixed(2)}}</span></p>
      <p class="payMoneyCul">订单编号：<span  class="orderTxt">{{orderNum}}</span></p>
      <div class="payCodeBox" id="qrcode" ref="qrcode"></div>
      <div class="wxPay-tip">
        <p>打开微信扫一扫支付</p>
        <p>该二维码30分钟内有效</p>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout, setInterval, clearInterval } from 'timers';
import QRCode from 'qrcodejs2'

export default {
  name: 'promotion',
  components: {QRCode},
  data () {
    return {
      orderHistory:{
        num : "",
        time : "",
        totalFee : ""
      },
      buyUse : false,
      orderNum : "",
      minimum : 1,
      maximum : 1,
      goodsList:[],
      goods:{},
      buyNum : 1,
      activeImg : "",
      activeImgIndex : 0,
      dialogTableVisible : false,
      cancelVisible : false,
      pay : 0,
      payTimer : null
    }
  },
  watch:{
    $route:'changePath'
  },
  methods:{
    //切换商品详情
    goGoods(id){
      this.$router.push({name:"buyPromotion",query:{goodsId:id}});
    },
    //大图切换
    scaleImg(path,index){
      this.activeImg = this.$filePath.photo + path;
      this.activeImgIndex = index;
    },
    //点击箭头切换大图
    goImg(target){
      if(this.activeImgIndex + target > this.goods.picUrls.length - 1 || this.activeImgIndex + target < 0){
        return false;
      }else{
        this.activeImg = this.$filePath.photo + this.goods.picUrls[this.activeImgIndex + target];
        this.activeImgIndex += target;
      }
    },
    //关闭扫码窗口
    closeHandle(){
      this.dialogTableVisible = false;
      document.getElementById('qrcode').innerHTML = "";
      clearInterval(this.payTimer);
    },
    //购买商品生成订单
    buyThis(buyNum){
      let _this = this;
      let num = parseInt(buyNum);
      // if(num > this.goods.stock){
      //   this.$message({type:"error",message:"购买数量超过库存！"});
      //   return;
      // }
      if(num < this.goods.minimum){
        this.$message({type:"error",message:"购买数量不得低于最低起购件数！"});
        return;
      }
      this.$http.get("szmktuser/pay/createPmtOrder?storeId=" + this.$store.state.loginInfo.storeId + "&pmtId=" + this.goods.id + "&count=" + num).then(res=>{
        
        if(res.data.code == 1000){
          this.orderNum = res.data.data.orderNo;
          this.pay = res.data.data.totalFee;
          this.dialogTableVisible =  true;
          this.payMoney(this.orderNum);
          this.loadDetail(this.goods.id);
        }else if(res.data.code == 3001){
          this.orderHistory.time = res.data.data.createTime;
          this.orderHistory.num = res.data.data.orderNo;
          this.orderHistory.totalFee = res.data.data.totalFee;
          this.cancelVisible = true;
        }else{
          this.$message({type:"error",message:res.data.message});
        }
      })
    },
    //付款
    payMoney(orderNum){
        let _this = this;
        clearInterval(_this.payTimer);
        this.$http.get("szmktuser/pay/nativePay?orderNo=" + orderNum).then(res=>{
          this.qrcode(res.data.data);
          _this.payTimer = setInterval(function(){
            if(_this.$route.name == "buyPromotion" && _this.dialogTableVisible == true){
              _this.$http.get("szmktuser/order/queryOrderLite?orderNo=" + orderNum).then(res=>{
                if(res.data.code == 1000){
                  if(res.data.data.status == 1){
                    clearInterval(_this.payTimer);
                    _this.$router.push({name:"buySuccess"});
                  }
                }
              })
            }
          },5000)
        })
    },
    //用url转化成二维码
    qrcode (url) {
      let qrcode = new QRCode('qrcode',{
        width: 280, // 设置宽度，单位像素
        height: 280, // 设置高度，单位像素
        text: url // 设置二维码内容或跳转地址
      })
    },
    //加载商品数据
    loadDetail(id){
      this.$http.get("/szmktbackstage/promotion/detail?promotionId=" + id + "&userid=" + this.$store.state.loginInfo.userId).then(res=>{
        if(res.data.code == 1000){
          this.goods = res.data.data;
          this.activeImg = this.$filePath.photo + res.data.data.picUrl1;
          this.buyNum = this.goods.minimum;
          this.minimum = this.goods.minimum;
          this.maximum = this.goods.stock;
          if(this.goods.minimum >  this.goods.stock){
            this.buyUse = true;
          }
        }else{
          this.$message({type:"error",message:res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //随机加载2个商品
    loadRecommend(){
      this.$http.get("/szmktbackstage/promotion/recommend?userid=" + this.$store.state.loginInfo.userId + "&promotionId=" + this.$route.query.goodsId).then(res=>{
        if(res.data.code == 1000){
          this.goodsList = res.data.data;
        }else{
          this.$message({type:"error",message:res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //改变商品
    changePath(){
      this.loadRecommend();
      this.loadDetail(this.$route.query.goodsId);
    },
    //格式化时间
    formatTime(time){
      let date = new Date(time);
      let year = date.getFullYear();
      let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
      let day = date.getDate()  < 10 ? "0" + date.getDate()  : date.getDate();
      let hour = date.getHours()  < 10 ? "0" + date.getHours()  : date.getHours();
      let min = date.getMinutes()  < 10 ? "0" + date.getMinutes()  : date.getMinutes();
      let second = date.getSeconds()  < 10 ? "0" + date.getSeconds()  : date.getSeconds();
      return  year + "-" + month + "-"+ day + " "  + hour + ":"+ min + ":" + second;
    },
    //继续支付未付款订单
    payAgain(){
      this.cancelVisible = false;
      this.dialogTableVisible = true;
      this.orderNum = this.orderHistory.num;
      this.pay = this.orderHistory.totalFee;
      this.payMoney(this.orderHistory.num);

    },
    //取消订单
    cancelPay(){
      this.$http.get("szmktuser/order/cancelStoreOrder?orderNo=" + this.orderHistory.num 
      + "&storeId=" + this.$store.state.loginInfo.storeId).then(res=>{
        if(res.data.code == 1000){
          this.$message({type:"success",message:"取消订单成功"});
          this.cancelVisible = false;
          this.changePath();
        }else{
          this.$message({type:"error",message:res.data.message,duration:1000});
        }
      })
    },
    returnList(){
      this.$router.push({name:"promotion"});
    }
  },
  created(){
    this.$store.commit("changeHeaderShow",false);
    this.$store.commit("changeActiveShopItem","4");
    this.$store.commit("changeShopNavTitle","促销品广场-商品详情");
    this.loadRecommend();
    if(this.$route.query.goodsId != undefined){
      this.loadDetail(this.$route.query.goodsId);
    }
  }
}
</script>

<style scoped lang="less">
.buyPromotion{
  font-size: 16px;
  padding-top: 70PX;
  display: flex;
  width: 100%;
  position: relative;
  .return{
    height:30px;
    width:30px;
    position:fixed;
    z-index:5000;
    top:15px;
    left:520px;
    background: url(../../../assets/img/return.png);
    background-size: 100% 100%;
    cursor: pointer;
    span{
      display: block;
      width: 100%;
      height:100%;
    }
  }
  .guess{
    flex: 1;
    width: 240px;
    margin:0 20px 0 20px;
    .guess-title{
      color: #ff9f00;
      font-size: 20px;
      text-indent: 30px;
      line-height: 50px;
      position: relative;
      text-align: left;
      background-color: white;
    }
    .guess-title::before{
      content: '';
      position: absolute;
      width: 4px;
      height: 16px;
      top: 17px;
      left: 20px;
      background-repeat: repeat-x;
      background-image: -webkit-linear-gradient(45deg, #fad961, #ff9f00);
      background-image: -o-linear-gradient(45deg, #fad961, #ff9f00);
      background-image: linear-gradient(45deg, #fad961, #ff9f00);
      background: #ff9f00;
    }
    .goods-list{
      display: flex;
      flex-wrap: wrap;
      li{
        background-color: white;
        width: 240px;
        box-sizing: border-box;
        background-color: white;
        padding:15px 20px 10px;
        cursor: pointer;
        position: relative;
        border-top: 1px solid #dcdfe6;
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
          margin-top: 10px;
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
      li:hover{
        border: 1px solid #ff9f00;
      }
    }
  }
  .goods-content{
    flex: 9;
    padding: 20px;
    margin-left: 20px;
    background-color: white;
    border-radius: 5px;
    .goods-introduce{
      display: flex;
      line-height: 30px;
      .pic-show{
        width: 400px;  
        margin: 0 30px 0 0px;
        flex: 1;
        .pic-scale{
          width: 100%;
          // height: 400px;
          //border: 1px solid #e4e4e4;
        }
        .pic-operate{
          overflow: hidden;
          position: relative;
          .goLeft{
            cursor: pointer;
            position: absolute;
            width:11px;
            height:18px;
            left: 10px;
            top: 50%;
            margin-top: -9px;
            background: url(../../../assets/img/returnleft.png);
            background-size: 11 18px;
          }
          .goRight{
            position: absolute;
            width:11px;
            height:18px;
            right: 5px;
            top: 50%;
            margin-top: -9px;
            background: url(../../../assets/img/returnright.png);
            background-size: 11 18px;
            cursor: pointer;
          }
        }
        .pic-list{
          display: flex;
          justify-content: center;
          float: left;
          margin-left: 25px;
          li{
            margin: 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            width: 75px;
            height: 75px;
          }
          img{
            width: 100%;
            height: 100%;
          }
          li.active,li:hover{
            border: #999 1px solid;
          }
        }
      }
      .buy-detail{
        flex: 2;
        text-align: left;
        text-indent: 20px;
        line-height: 30px;
      }
      .buy-title{
        text-align: justify;
        font-weight: bold;
        text-indent: 0;
      }
      .price-box{
        text-align: left;
        background-color: rgba(255,143,50,0.10);
        box-sizing: border-box;
        padding: 10px 20px 10px 0;
        margin: 20px 0;
        position: relative;
        .buy-hot{
          position: absolute;
          right: 120px;
          top: 20px;
          width: 100px;
          height: 40px;
          text-align: center;
          line-height: 20px;
        }
        .buy-order{
          right: 20px;
        }
        .other-title{
          font-size: 14px;
        }
        .other-content{
          color: #FF6B6B;
        }
      }
      .sale-price,.promotion-price{
        display: flex;
      }
      .sale-price{
        .price-content{
          text-decoration: line-through;
          color: #909399;
        }
      }
      .promotion-price{
        .price-content{
          font-weight: bold;
          color: #FF6B6B;
          font-size: 18px;
        }
      }
      .price-title,.price-content{
        display: inline-block;
      }
      .price-title{
        width: 100px;
      }
      .transport-content{
        margin-left: 50px;
      }
      .buy-other{
        padding: 10px 0;
        margin-top: 20px;
        border-top: #909399 1px solid;
        border-bottom: #909399 1px solid;
        display: flex;
        text-align: center;
        line-height: 20px;
      }
      .buy-min{
        line-height: 60px;
      }
      .buy-count{
        line-height: 40px;
      }
    }
    .goods-detail{
      margin-top:30px;
      text-align: center;
      .detail-title{
        line-height: 40px;
        overflow: hidden;
        border-bottom: 2px solid #FF8F32;
        margin-bottom: 20px;
        span{
          padding : 0 30px;
          background-color: #FF8F32;
          color: white;
          float: left;
        }
      }
      .detail-content{
        width: calc(100vw - 700px);
      }
    }
  }
  .buyBtn{
    display: block;
    width: 200px;
    line-height: 56px;
    background: #FF8F32;
    text-align: center;
    text-indent: 0;
    color: white;
    font-size: 18px;
    border-radius: 5px;
    margin:30px 20px;
    cursor: pointer;
  }
  .buyBtn:hover{
    background-color: #de7116;
  }
  .payTitle{
    font-size: 20px;
    line-height: 30px;
    padding-top:40px;
    background: url(../../../assets/img/wePay.png) 20px top no-repeat;
    background-size: 110px 30px;
  }
  .payCode{
    padding-top: 20px;
    .payBox{
      border: 1px solid #999;
      margin: 0 auto;
      width:260px;
      height: 260px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url(../../../assets/img/default_code.png) center center no-repeat;
      background-size: 94% 94%;
      img{
        margin: 3%;
      }
    }
  }
  .payTip{
    width: 260px;
    height: 86px;
    margin: 20px auto;
    background: url(../../../assets/img/wePayTip.png);
    background-size: 100% 100%;
  }
  .cancelWin{
    line-height: 50px;
    font-size: 18px;
    p{
      display: flex;
      padding: 0 50px;
      text-align: left;
      font-size: 16px;
    }
    .cancelTitle{
      flex: 3;
      text-indent: 20px;
    }
    .cancelContent{
      flex: 5;
      color: red;
    }
  }
  .returnPrev{
    position: absolute;
    top: 15px;
    left: 20px;
    line-height: 40px;
    font-size: 18px;
    color: #4181FE;
    text-indent: 25px;
    background: url(../../../assets/img/fanhui.png) left center no-repeat;
    background-size: 18px 18px;
    cursor: pointer;
  }
  .cover{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 500;
    background-color: rgba(0,0,0,.5);
  }
  .wxPay-win{
    position: fixed;
    z-index: 510;
    width:328px;
    height:456px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    left: 50%;
    top: 50%;
    margin-left: -164px;
    margin-top: -228px;
    box-sizing: border-box;
    padding: 20px 24px;
    font-size:16px;
    color: #ABB2C0;
    text-align: left;
    line-height: 35px;
    .closeBtn{
      position: fixed;
      display: block;
      width: 24px;
      height: 24px;
      background: url(../../../assets/img/wxClose.png) center center no-repeat;
      background-size: 20px 20px;
      top: 80px;
      right: 80px;
      cursor: pointer;
    }
    .payMoneyCul{
      position: relative;
      .payMoneyTxt{
        color: #FF6B6B;
        font-size: 24px;
        position: absolute;
        right: 0;
        top: 0;
      }
      .orderTxt{
        position: absolute;
        right: 0;
        top: 0;
        line-height: 40px;
      }
    }
    .payCodeBox{
      margin:5px 0;
      width: 280px;
      height: 280px;
      position: relative;
    }
    .payCodeBox::before{
      content: "";
      display: block;
      position: absolute;
      z-index: 520;
      width: 60px;
      height: 60px;
      left: 50%;
      top: 50%;
      margin-left:-30px;
      margin-top:-30px;
      background: url(../../../assets/img/wxPayLogo.png) center center no-repeat;
      background-size: 60px 53px;
      background-color: white;
      border-radius: 3px;
    }
    .wxPay-tip{
      text-indent: 80px;
      line-height: 24px;
      padding: 10px 0;
      background: url(../../../assets/img/scan.png) 30px center  no-repeat;
      background-size: 38px 38px;
    }
  }
}
</style>
