<template>
  <div class="order" v-loading.lock="screenLoading">
    <div class="content-panel">
      <div class="tag">
        <dl>
          <dd 
          v-for="(item,index) in tags" 
          :key="index" 
          :class="activeTag == index ? 'active' : ''" 
          @click="changeTag(index)">{{item}}</dd>
        </dl>
      </div>
      
      <div class="search">
        <div class="pageBox">
          <el-button @click="exportOrder" icon="el-icon-download" type="primary">导出订单列表 </el-button>
          <!-- <el-button <el-button type="primary" :disabled="currentPage == 1 || pageDis" @click="runPage(-1)">上一页</el-button>
          <el-button type="info" :disabled="true">{{currentPage}}</el-button>
          <el-button type="primary" :disabled="currentPage == totalPage/10 || pageDis" @click="runPage(1)">下一页</el-button> -->
        </div>
        <el-input placeholder="请输入搜索内容" v-model="searchTxt" class="input-with-select searchInput" clearable>
          <el-select v-model="searchSelect" slot="prepend" placeholder="请选择">
            <el-option label="商品名称" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
        </el-input> 
      </div>

      <div class="content">
        <div class="content-head">
          <ul>
            <li v-for="(item,index) in orderTitle" :key="index" >{{item}}</li>
          </ul>
        </div>
        <div class="content-body">
          <p class="noData" v-if="tableData.length == 0"></p>
          <div class="orderItem" v-for="(item,index) in tableData" :key="index">
            <div class="orderTitle">  
              <span>订单号：{{item.orderNo}}</span>
              <span>订单时间:{{formatTime(item.createTime)}}</span>
              <span>付款时间：{{formatTime(item.payTime)}}</span>
            </div>
            <div class="orderBody">
              <div class="info">
                <div class="infoItem" v-for="(item1,index1) in item.orderInnerList" :key="index1">
                  <div class="infoDetail">
                    <img :src="$filePath.photo + item1.goodsPic"/>
                    <div class="infoTitle">
                      <p>{{item1.goodsTitle}}</p>
                      <span v-if="item1.goodsType == 0" style="color:#409eff;">规格：{{item1.className}}</span>
                      <span class="promotionTag" v-else-if="item1.goodsType == 2">促销品</span>
                      <span class="drainageTag" v-else-if="item1.goodsType == 1">引流品</span>
                    </div>
                  </div>
                  <div class="price">￥{{(item1.price/100).toFixed(2)}}</div>
                  <div class="num">{{item1.count}}</div>
                </div>
                <div class="activy">
                  优惠券使用:
                  <span v-if="item.couponContent == null" style="color:#909399;">无</span>
                  <span v-else style="color:#909399;">满{{(item.couponContent.standard/100).toFixed(2)}}减{{(item.couponContent.privilege/100).toFixed(2)}}</span>，总运费：0元
                </div>
              </div>
              <div class="pay">
                <span>￥{{(item.totleFee/100).toFixed(2)}}</span>
              </div>
              <div class="status">
                <div class="statusContent">
                  <p v-if="item.orderStatus == 1">买家已付款</p>
                  <p v-else>买家未付款</p>
                  <p v-if="item.streamStatus == 0">待发货</p>
                  <p v-if="item.streamStatus == 1">已发货</p>
                  <p v-if="item.streamStatus == 2">已完成</p>
                  <el-button type="text" @click="watchDetail(item)" style="padding:0;">查看订单详情</el-button>
                </div>
              </div>
              <div class="operate">
                <el-button type="primary" @click="openShip(item)" :disabled="item.streamStatus != 0">商品发货</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next ,jumper"
          :total="totalPage"
          :current-page.sync="currentPage"
          @current-change="changePage">
        </el-pagination>
      </div>
    </div>
    <div class="detailWin" v-if="isShowDetail">
        <div class="detailBox">
          <p class="return" @click="closeDetail">返回上一级</p>
          <div class="detailBox-panel">
          <!-- <i class="el-icon-error" @click="closeDetail" style="font-size:25px;position:absolute;right:50px;top:20px;cursor:pointer;"></i> -->
          <div class="detailInfo">
            <div class="infoHead">
              <span style="border-right: 1px solid #E5E8ED;">订单信息</span>
              <span>物流信息</span>
            </div>
            <div class="infoBody">
              <div class="left">
                <ul>
                  <li>买家名称：{{orderDetail.userName}}</li>
                  <li>收货信息：{{orderDetail.orderAddress}}</li>
                  <li>订单编号：{{orderDetail.orderNo}}</li>
                </ul>
              </div>
              <div class="right">
                <ul>
                  <li>物流公司：<span v-if="orderDetail.streamList != null">{{orderDetail.streamList.name}}</span><span v-else>暂未发货</span></li>
                  <li>快递单号：<span v-if="orderDetail.streamList != null">{{orderDetail.streamList.streamNo}}</span><span v-else>暂未发货</span></li>
                  <el-button type="primary" v-if="orderDetail.streamList == null" @click="openShip(orderDetail)" style="margin:10px 0 0 20px;padding:8px 30px;">发货</el-button>
                </ul>
              </div>
            </div>
          </div>
          <div class="detailList">
            <div class="listHead">
              <span>商品</span>
              <span>单价</span>
              <span>搭配比例</span>
              <span>购买数量</span>
              <span>活动</span>
            </div>
            <div class="listBody">
              <ul v-if="orderDetail.collocationList && orderDetail.collocationList.length != 0">
                <li v-for="(item,index) in orderDetail.collocationList" :key="index">
                  <div class="listTitle"><span>搭配</span></div>
                  <div class="listGoods">
                    <div class="goodsItem">
                      <div class="goodsTitle">
                        <img :src="$filePath.photo + item.goodsPic"/>
                        <div class="infoTitle">
                          <p>{{item.goodsTitle}}</p>
                          <span style="color:rgb(64, 158, 255)">规格：{{item.classTitle}}</span>
                        </div>
                      </div>
                      <div class="listPrice">
                        <span>￥{{(item.goodsPrice/100).toFixed(2)}}</span>
                      </div>
                      <div class="listScale">
                        <span>{{item.goodsRatio}}</span>
                      </div>
                    </div>
                    <div class="goodsItem">
                      <div class="goodsTitle">
                        <img :src="$filePath.photo + item.collPic"/>
                        <div class="infoTitle">
                          <p>{{item.collTitle}}</p>
                          <span class="drainageTag" v-if="item.type == 1">引流</span>
                          <span class="promotionTag" v-else>促销</span>
                        </div>
                      </div>
                      <div class="listPrice">
                        <span>￥{{(item.collPrice/100).toFixed(2)}}</span>
                      </div>
                      <div class="listScale">
                        <span>{{item.collRatio}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="listNum">
                    <span>{{item.count}}</span>
                  </div>
                  <div class="listActity">
                    <span v-if="item.activity.length == 0">无</span>
                    <span v-else>助力有奖</span>
                  </div>
                </li>
              </ul>
              <ul v-if="orderDetail.soloList && orderDetail.soloList.length != 0">
                <li v-for="(item,index) in orderDetail.soloList" :key="index">
                  <div class="listTitle"><span>单品</span></div>
                  <div class="listGoods">
                    <div class="goodsItem">
                      <div class="goodsTitle">
                        <img :src="$filePath.photo + item.goodsPic"/>
                        <div class="infoTitle">
                          <p>{{item.goodsTitle}}</p>
                          <span style="color:rgb(64, 158, 255)">规格：{{item.classTitle}}</span>
                        </div>
                      </div>
                      <div class="listPrice">
                        <span>￥{{(item.goodsPrice/100).toFixed(2)}}</span>
                      </div>
                      <div class="listScale" style="color:#999;">未搭配</div>
                    </div>
                  </div>
                  <div class="listNum">
                    <span>{{item.count}}</span>
                  </div>
                  <div class="listActity">
                    <span v-if="item.activity.length == 0">无</span>
                    <span v-else>助力有奖</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="detailTotal">
            <div class="totalUse">
              <span v-if="orderDetail.couponContent == null">使用优惠券：无</span>
              <span v-else>
                使用优惠券：满{{(orderDetail.couponContent.standard/100).toFixed(2)}}减{{(orderDetail.couponContent.privilege/100).toFixed(2)}}元
                </span>
            </div>
            <div class="totalAccount">
              <div>
                <p>商品总价：{{(orderDetail.totalFee/100).toFixed(2)}}元<span style="display:inline-block;width:20px;height:5px;"></span>运费：0.00元</p>
              </div>
            </div>
          </div>
          </div>
        </div>
    </div>

    <el-dialog title="提示" :visible.sync="shipDialog" @close="cancelShip" width="30%">
      <ul class="shipInfo">
        <li v-for="(shipItem,index) in shipTitle" :key="index">
          <p class="shipTitle">{{shipItem}}</p>
          <p class="shipContent">{{shipInfo[index]}}</p>
        </li>
      </ul>
      <el-form label-width="100px" :model="shipOrder" :rules="rules">
        <el-form-item label="物流公司" prop="company">
          <el-input v-model="shipOrder.company" placeholder="请输入物流公司" :disabled="inputDis"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" prop="number">
          <el-input v-model="shipOrder.number" placeholder="请输入快递单号" :disabled="inputDis"></el-input>
        </el-form-item>
        <div v-show="isShowBtn">
          <el-button style="padding:15px 50px;" @click="cancelShip">取消</el-button>
          <el-button type="primary" style="padding:15px 50px;" @click="submit">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'order',
  data () {
    var validateOrder = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]+$/;
      if (!reg.test(value)) {
        callback(new Error('只能输入字母和数字!'))
      }
    };
    return {
      detailLoading : false,
      searchSelect : '商品名称',
      screenLoading : true,
      pageDis : false,
      orderDetail : {},
      isShowDetail : false,
      queryTag : "",
      orderTitle : ["商品信息","单价","数量","实付款","交易状态","订单操作"],
      activeTag : 0,
      tags: ["所有订单","待发货","已发货","已完成"],
      searchTxt : "",
      tableData: [],
      shipDialog : false,
      shipTitle : [
          "收货姓名","联系电话","收货地址"
      ],
      shipInfo : [],
      shipOrder : {
        company : "",
        number : ""
      },
      isShowBtn : true,
      inputDis : false,
      pageIndex : 0,
      orderNum : "",
      totalPage : 1,
      searchStatus : false,
      rules:{
        company:[
          { required: true, message: '请输入物流公司', trigger: 'blur' },
        ],
        number : [
          { required: true, message: '请输入快递单号', trigger: 'blur' },
          { validator: validateOrder, trigger: 'blur' }
        ]
      },
      currentPage : 1
    }
  },
  watch:{
    searchTxt(val){
      if(val.length == 0){
        this.currentPage = 1;
        this.searchStatus = false;
        this.loadRecord();
      }
    }
  },
  methods : {
    handleRow(row,col){
      //console.log(row);
    },
    //查看收货信息
    watchInfo(row,index){
      this.pageIndex = index;
      this.isShowBtn = false;
      this.shipDialog = true;
      this.inputDis = true;
      this.shipInfo =[row.name,row.phone,row.address];
      if(row.streamStatus != 0){     
        this.shipOrder = {
            company : row.streamName,
            number : row.streamNo
        };
      }else{
        this.shipOrder = {
            company : "",
            number : ""
        };
      }
    },
    //打开发货窗口
    openShip(row){
      this.shipDialog = true;
      this.orderNum = row.orderNo;
      this.shipInfo = row.orderAddress.split(",");
    },
    //取消发货窗口
    cancelShip(){
      this.shipDialog = false;
      this.isShowBtn = true;
      this.inputDis = false;
      this.shipOrder = {
        company : "",
        number : ""
      };
    },
    //提交
    submit(){
      var reg = /^[0-9a-zA-Z]+$/;
      if(this.shipOrder.company == ""){
        this.$message({type:"warning",message:"请输入物流公司"});
        return;
      }
      if(!this.$filterWord(this.shipOrder.company,this.$store.state.filterList)){
        this.$message({type:"error",message:"物流公司包含敏感词汇，请重试"});
        return;
      }
      if(this.shipOrder.number == ""){
        this.$message({type:"warning",message:"请输入快递单号"});
        return;
      }
      if(!this.$filterWord(this.shipOrder.number,this.$store.state.filterList)){
        this.$message({type:"error",message:"快递单号包含敏感词汇，请重试"});
        return;
      }
      if(!reg.test(this.shipOrder.number)) {
        this.$message({type:"warning",message:"订单号只能输入字母和数字"});
        return;
      }
      this.$http.get("/szmktuser/order/submitgoodsstream?orderno=" + this.orderNum + "&company=" + this.shipOrder.company + "&streamno=" + this.shipOrder.number)
      .then(res=>{
        if(res.data.code == 1000){
          this.$message({
            message : "发货成功",
            type : "success"
          })
          this.isShowDetail = false;
          this.shipDialog = false;
          this.loadRecord();
          this.getOrderNum();
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      })
      .catch(err=>{
        console.log(err);
      }) 
    },
    //加载订单列表
    loadRecord(){
      this.screenLoading = true;
      let page = this.currentPage;
      let typeTxt = "";
      if(typeof this.queryTag == "number"){
        typeTxt = "&type=" + this.queryTag;
      }
      this.$http.get("/szmktuser/order/querygoodsstream?storeid=" + this.$store.state.loginInfo.storeId 
      +"&page=" + page + "&rows=10" + typeTxt).then(res=>{
        if(res.data.code == 1000){
          this.tableData = res.data.data.list;
          this.formatTime();
          this.totalPage = res.data.data.totalPage*10;
          document.documentElement.scrollTop = 0;
          this.pageDis = false;
          this.screenLoading = false;
          if(this.totalPage == 0){
            this.totalPage = 10;
          }
        }else{
          this.$message({type: 'error',message: res.data.message});
          this.screenLoading = false;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //搜索商品名称以查找订单
    searchOrder(){
      if(!this.$filterWord(this.searchTxt,this.$store.state.filterList)){
        this.$message({type:"error",message:"输入内容包含敏感词汇，请重试"});
        return false;
      }
      if(this.searchTxt != ""){
        let type = 1;
        if(this.searchSelect == 2){
          type = 2;
        }
        this.screenLoading = true;
        this.searchStatus = true;
        this.$http.get("szmktuser/store/seachgoodsorder?keyword="+ this.searchTxt 
        + "&storeid=" + this.$store.state.loginInfo.storeId +"&page=1&rows=10&type=" + type).then(res=>{
          if(res.data.code == 1000){
            this.tableData = res.data.data.list;
            this.formatTime();
            this.totalPage = res.data.data.totalPage*10;
            this.currentPage = 1;
            this.activeTag = 0;
            this.screenLoading = false;
            document.documentElement.scrollTop = 0;
          }else{
            this.$message({type: 'error',message: res.data.message});
            this.screenLoading = false;
          }
        }).catch(err=>{
          console.log(err);
        })
      }else{
        this.$message({type:"info",message:"请输入搜索内容"});
      }
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
    changeTag(index){
      this.activeTag = index;
      this.searchTxt = "";
      this.currentPage = 1;
      if(index == 0){
        this.queryTag = "";
      }else{
        this.queryTag = index - 1;
      }
      this.loadRecord();
    },
    //查看订单详情
    watchDetail(content){
      this.isShowDetail = true;
      this.$http.get("szmktuser/order/queryOrderStreamContent?type=0&orderNo=" + content.orderNo).then(res=>{
        if(res.data.code == 1000){
          this.orderDetail = res.data.data;
        }else{
          this.$message({type:"",message:res.data.message});
        }
      })
    },
    //关闭订单详情
    closeDetail(){
      this.isShowDetail = false;
    },
    //改变页码
    changePage(index){  
      this.pageIndex = index;
      this.screenLoading = true;
      if(!this.searchStatus){
        this.$http.get("/szmktuser/order/querygoodsstream?storeid=" + this.$store.state.loginInfo.storeId +"&page=" + this.currentPage +"&rows=10").then(res=>{
          if(res.data.code == 1000){
            this.tableData = res.data.data.list;
            this.formatTime();
            this.screenLoading = false;
            document.documentElement.scrollTop = 0;
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
        }).catch(err=>{
          console.log(err);
        })
      }else{
        let type = 1;
        if(this.searchSelect == 2){
          type = 2;
        }
        this.$http.get("szmktuser/store/seachgoodsorder?keyword="+ this.searchTxt 
        + "&storeid=" + this.$store.state.loginInfo.storeId +"&page=" + this.currentPage +"&rows=10&type=" + type).then(res=>{
          if(res.data.code == 1000){
            this.tableData = res.data.data.list;
            this.formatTime();
            this.totalPage = res.data.data.totalPage*10;
            document.documentElement.scrollTop = 0;
            this.screenLoading = false;
            this.activeTag = 0;
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    },
    //上面的翻页
    runPage(index){
      this.currentPage = this.currentPage - 0 + index;
      this.pageDis = true;
      if(this.currentPage > 0 && this.currentPage - 1 < this.totalPage/10){
        if(!this.searchStatus){
          this.loadRecord();
        }else{
          let type = 1;
          if(this.searchSelect == 2){
            type = 2;
          }
          this.screenLoading = true;
          this.$http.get("szmktuser/store/seachgoodsorder?keyword="+ this.searchTxt 
          + "&storeid=" + this.$store.state.loginInfo.storeId +"&page=" + this.currentPage +"&rows=10&type=" + type).then(res=>{
            if(res.data.code == 1000){
              this.tableData = res.data.data.list;
              this.formatTime();
              this.totalPage = res.data.data.totalPage*10;
              this.pageDis = false;
              document.documentElement.scrollTop = 0;
              this.screenLoading = false;
              this.activeTag = 0;
            }else{
              this.$message({type: 'error',message: res.data.message});
            }
          }).catch(err=>{
            console.log(err);
          })
        }
        
      } 
    },
    exportOrder(){
      window.open (this.$filePath.excel +  "szmktuser/order/downloadStoreStreamExcel?storeId=" 
      + this.$store.state.loginInfo.storeId);
    },
    getOrderNum(){
        this.$http.get("szmktuser/store/awaitOrderCount?storeId=" + this.$store.state.loginInfo.storeId).then(res=>{
            if(res.data.code == 1000){
                this.$store.commit("changeHandleOrderNum",res.data.data);
            }else{
                this.$message({
                    type: 'error',
                    message: res.data.message,
                    duration : 1000
                });
            }
        })
    }
  },
  created(){
    let _this = this;
    this.loadRecord();
    this.$store.commit("changeHeaderShow",false);
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13 && _this.$route.name == "order") {
        if(_this.shipDialog == false){
          if(_this.isShowDetail == false){
            _this.searchOrder();
          }
        }else{
          _this.submit();
        }
      }
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
.order{
  min-height: calc(100vh - 100px);
  min-width: 1300px;
  width: calc(100% - 40px);
  padding: 20px;
  background: #E5E8ED;
  position: relative;
  .search{
    overflow: hidden;
    .searchInput{
      width: 450px;
      float: right;
      margin: 20px 40px;
    }
    .pageBox{
      float: right;
      margin: 20px 0; 
    }
  }
  .shipInfo{
    border-bottom: #4e749a 1px solid;
    margin-bottom: 20px;
    li{
      overflow: hidden;
      line-height: 40px;
      border: #4e749a 1px solid;
      border-bottom: none;
      background-color: #ffffc7;
      display: flex;
      justify-content: center;
      align-items: center;
      .shipTitle{   
        flex: 3;
      }
      .shipContent{
        flex: 7;
        border-left: #4e749a 1px solid;
        background-color: #e4f3c2;
      }
    }
  }
  .tag{
    text-align: left;
    padding-top:20px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 2px solid #c0c4cc;
    dl{
      display: flex;
      dd{
        padding: 0 20px;
        margin: 10px 0;
        position: relative;
        border-right: 1px solid #e4e4e4;
        cursor: pointer;
        font-family: "微软雅黑";
      }
      dd.active{
        color: #418EFE;
      }
      dd.active::after{
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        position: absolute;
        left: 0;
        bottom: -12px;
        background-color: #418EFE;
      }
      dd:nth-child(4){
        border-right:none;
      }
    }
  }
  .content-head{
    background: #F5F7FB;
    font-size: 14px;
    line-height: 40px;
    ul{
      display: flex;
      li:nth-child(1){
        flex:3;
      }
      li:nth-child(2){
        flex:1;
      }
      li:nth-child(3){
        flex:1;
      }
      li:nth-child(4){
        flex:1;
      }
      li:nth-child(5){
        flex:1;
      }
      li:nth-child(6){
        flex:1;
      }
    }
  }
  .content-body{
    padding-bottom: 20px;
    min-width: 1000px;
    min-height: 500px;
    .orderItem{
      overflow: hidden;
      border: 1px solid #E5E8ED;
      margin-top: 25px;
      text-align: left;
      font-size: 14px;
      line-height: 30px;
    }
    .orderItem:hover{
      outline: 1px solid rgb(13, 150, 214);
    }
    .orderTitle{
      background-color: #E5E8ED;
      display: flex;
      padding-left: 20px;
      line-height: 40px;
      span{
        flex:1;
        text-align: center;
      }
    }
    .orderBody{
      display: flex;
      .info{
        flex:5;
        .infoItem{
          width: 100%;
          overflow: hidden;
          border-top: 1px solid #E5E8ED;
          display: flex;
          .infoDetail{
            padding: 20px 20px 20px 0;
            flex: 3;
          }
        }
        .activy{
          border-top: 1px solid #E5E8ED;
          text-indent: 20px;
          line-height: 50px;
        }
        img{
          float: left;
          margin: 0 20px;
          width: 65px;
          height:65px;
        }
        .infoTitle{
          float: left;
          width: calc(100% - 105px);
          line-height: 20px;
          span{
            padding:3px;
            border-radius: 3px;
            margin: 5px 10px 0 0;
          }
          p{
            height: 40px;
            padding-bottom: 5px;
          }
          .promotionTag{
            border:1px solid #FF8F32;
            color: #FF8F32;
          }
          .drainageTag{
            border:1px solid #26BD75;
            color: #26BD75;
          }
          .activeTag{
            background-color: #4181FE;
            color: white;
          }
        }
        
      }
      .price,.num,.pay,.status,.operate{
        flex:1;
        text-align: center;
        span{
          display: block;
          width: 100%;
          border-top: 1px solid #daf3ff;
        }
      }
      .price,.num{
        line-height: 105px;
        border-left: 1px solid #daf3ff;
        border-top:none;
      }
      .pay,.status,.operate{
        border-left: 1px solid #daf3ff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .status{
        flex-wrap: wrap;
        padding:20px 0;
        border-top: 1px solid #daf3ff;
        *{
          width: 100%;
          border:none;
          line-height: 30px;
          margin:0;
        }
      }
      .operate{
        border-top: 1px solid #daf3ff;
      }
      .pay{
        border-top: 1px solid #daf3ff;
        span{
          border: none;
        }
      }
    }
    .orderFoot{
      text-indent: 20px;
      line-height: 50px;
      border-top: 1px solid #daf3ff;
    }
  }
  .detailWin{
    font-size: 16px;
    .detailBox{
      width: calc(100% - 200px);
      height: calc(100vh - 60px);
      position: fixed;
      font-size: 14px;
      line-height: 30px;
      top: 60px;
      left: 200px;
      background-color: #E5E8ED;
      overflow-y: auto;
    }
    .detailInfo{
      margin-top: 20px;
      font-size: 16px;
      border: 1px solid #E5E8ED;
      .infoHead{
        display: flex;
        background-color: #E5E8ED;
        line-height: 48px;
        font-weight: bold;
        span{
          flex: 1;
          text-align: left;
          text-indent: 20px;
        }
      }
      .infoBody{
        display: flex;
        text-align: left;
        text-indent: 20px;
        line-height: 35px;
        font-size: 14px;
        .left,.right{
          flex: 1;
          padding: 20px 0;
        }
        .left{
          border-right: 1px solid #E5E8ED;
        }
      }
      
    }
    .detailList{
      margin-top:20px;
      border: 1px solid #E5E8ED;
      .listHead{
        display: flex;
        background-color: #E5E8ED;
        font-weight: bold;
        font-size: 16px;
        span{
          flex: 1;
          line-height: 48px;
        }
        span:first-child{
          flex:4;
        }
      }
      .listBody{
        li{
          display: flex;
          border-top: 1px solid #E5E8ED;
          font-size: 14px;
        }
        .listTitle{
          padding:20px 0;
          flex:1;
          display: flex;
          line-height: 20px;
          justify-content: center;
          align-items: center;
          border-right: 1px solid #E5E8ED;
        }
        .listGoods{
          flex:11;
          border-right: 1px solid #E5E8ED;
          .goodsTitle{
            flex:7;
            padding:20px 0;
            border-right: 1px solid #E5E8ED;
          }
        }
        .listPrice,.listScale,.listNum,.listActity{
          flex: 2;
          border-right: 1px solid #E5E8ED;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .listScale,.listActity{
          border-right:none;
        }
        .goodsItem{
          text-align: left;
          overflow: hidden;
          display: flex;
          border-top: 1px solid #E5E8ED;
          img{
            float: left;
            margin: 0 20px;
            width: 65px;
            height:65px;
          }
          .infoTitle{
            float: left;
            width: calc(100% - 105px);
            line-height: 20px;
            span{
              padding:3px;
              border-radius: 3px;
              margin: 5px 10px 0 0;
            }
            p{
              height: 40px;
              padding-bottom: 5px;
            }
            .promotionTag{
              background-color: #ff6000;
              color: white;
            }
            .drainageTag{
              background-color: #15759b;
              color: white;
            }
            .activeTag{
              background-color: #4181FE;
              color: white;
            }
          }
        }
        .goodsItem:first-child{
          border-top:none;
        }
      }
    }
    .detailTotal{
      display: flex;
      border: 1px solid #E5E8ED;
      border-top: none;
      font-size: 16px;
      line-height: 48px;
      .totalTitle{
        flex:1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 20px;
      }
      .totalUse{
        flex:3;
        display: flex;
        padding-left: 20px;
        justify-content: flex-start;
        align-items: center;
      }
      .totalAccount{
        flex:3;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20px;
        text-align: right;
      }
    }
  }
  // .el-button--primary{
  //   background-color: #4181FE;
  //   border-color: #4181FE;
  // }
  // .el-button--primary:hover{
  //   background: #0368ce;
  //   border-color: #0368ce;
  // }
  // .el-button.is-disabled, 
  // .el-button.is-disabled:focus, 
  // .el-button.is-disabled:hover{
  //   color: #C0C4CC;
  //   cursor: not-allowed;
  //   background-image: none;
  //   background-color: #FFF;
  //   border-color: #EBEEF5;
  // }
  .content-panel{
    background: white;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 5px;
  }
  .detailBox-panel{
    width: calc(100% - 40px);
    min-height: calc(100% - 100px);
    margin: 20px;
    background: white;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 5px;
  }
  .return {
    width: 160px;
    margin-top: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #4181FE;
    text-indent: 45px;
    background: url(../../../assets/img/fanhui.png) 20px center no-repeat;
    background-size: 18px 18px;
    cursor: pointer;
    text-align: left;
  }
  .noData{
    width: 100%;
    height: 450px;
    background: url(../../../assets/img/empty.png) center center no-repeat;
    background-size: 320px 320px;
  }
}
</style>
