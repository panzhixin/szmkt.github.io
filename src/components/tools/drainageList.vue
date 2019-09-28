<template>
  <div class="drainageList">
    <transition name="fade">
      <div v-show="drainageDialogStatus" class="drainageDialogBox">
        <p class="return" @click="closeDialog">返回上一级</p>
        <div class="drainageDialog-panel">
          <div class="drainageDialog-panelBody">
            <div class="drainageDialog-head">
              <div class="head-tag">
                <span :class="['tag',activeTag == 0 ? 'activeTag' : '']" @click="chooseTag(0)">平台引流品库</span>
                <span :class="['tag',activeTag == 1 ? 'activeTag' : '']" @click="chooseTag(1)">我的仓库</span>
              </div>
              <div class="search"  v-if="showDrainage">
                  <div class="drainageDialog-header">
                    <span class="total">引流品库（共{{total}}款)</span>
                  </div>
                  <el-input placeholder="请输入引流品名称" style="width:300px;" v-model="searchTxt" class="searchInput" clearable @click.native="openDrainageSearch">
                    <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
                  </el-input>
              </div>
              <div class="search" v-else>
                <div class="drainageDialog-header">
                    <span class="total">我的仓库（共{{totalDepot}}款)</span>
                </div>
                <el-input placeholder="请输入促销品名称" v-model="searchDepotTxt" style="width:300px" class="searchInput" clearable>
                  <el-button slot="append" icon="el-icon-search" @click="searchDepot"></el-button>
                </el-input>
              </div>
            </div>

            <div class="drainageDialogOut" v-if="showDrainage">
              <div class="drainageDialog">   
                <div class="drainageDialog-body">
                  <el-table
                    :data="tableData"
                    :highlight-current-row="true"
                    height="calc(100vh - 320px)"
                    @row-click="handleDrainageChoose"
                    style="width:96%;margin:10px auto 5px;"
                  >
                    <el-table-column label="序号" align="center" width="80px" prop="pageIndex">
                    </el-table-column>
                    <el-table-column label="图片" align="center" width="100px">
                      <template slot-scope="scope">
                        <img
                          v-if="scope.row.cover != ''"
                          :src="$filePath.photo + scope.row.picUrl1"
                          class="cover"
                        >
                        <span v-else>暂无</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="名称" align="left" width="250px">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="点击查看引流品详情" placement="bottom">
                          <span @click="watchDrainage" class="drainageName">{{scope.row.title}}</span>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="库存" align="center" width="100px"></el-table-column>
                    <el-table-column prop="classifyName" label="品类" align="center"  width="180px"></el-table-column>
                    <el-table-column label="状态" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.channelCollocation == null">未搭配</span>
                        <span v-else>已搭配</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="引流价" align="center" width="150px">
                      <template slot-scope="scope">￥{{scope.row.chaPrice/100}}</template>
                    </el-table-column>
                    <el-table-column label="市场价格" align="center" width="150px">
                      <template slot-scope="scope">
                        <span>￥{{(scope.row.mktPrice/100).toFixed(2)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="搭配比例（引流品:商品）" align="center" width="200px">
                      <template slot-scope="scope">
                        <span>1:{{scope.row.ratioNum}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="180px" fixed="right">
                      <template slot-scope="scope">
                        <span class="operateBox">    
                          <span 
                            class="operateBtn primaryBtn" 
                            v-if="scope.row.channelCollocation == null" 
                            @click="submitDrainage(scope.row,scope.$index)">搭配</span>
                          <span 
                            class="operateBtn errorBtn"
                            v-else 
                            @click="cancelDrainage(scope.row,scope.$index)">取消搭配</span>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="paginationBox">
                    <div class="paginationContent">
                      <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="totalPage"
                        :current-page.sync="currentPage"
                        @current-change="changePage">
                      </el-pagination>
                    </div>
                  </div>         
                </div>
              </div>
            </div>
            <div class="myDepot" v-else>
              <div class="drainageDialog-body">
                  <el-table
                    :data="depotData"
                    :highlight-current-row="true"
                    height="calc(100vh - 320px)"
                    style="width:96%;margin:10px auto 5px;"
                  >
                    <el-table-column label="序号" align="center" width="80px" prop="pageIndex">
                    </el-table-column>
                    <el-table-column label="图片" align="center" width="100px">
                      <template slot-scope="scope">
                        <img
                          v-if="scope.row.cover != ''"
                          :src="$filePath.photo + scope.row.picUrl1"
                          class="cover"
                        >
                        <span v-else>暂无</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="名称" align="left" width="250px">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="点击查看促销品详情" placement="bottom">
                          <span @click="watchDepot(scope.row.promotionId)" class="drainageName">{{scope.row.title}}</span>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="库存" align="center" width="150px"></el-table-column>
                    <el-table-column prop="classifyName" label="品类" align="center" width="150px"></el-table-column>
                    <el-table-column label="状态" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.pmtCollocationEntity == null">未搭配</span>
                        <span v-else>已搭配</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="价格" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.pmtCollocationEntity == null">-</span>
                        <span v-else>￥{{(scope.row.pmtCollocationEntity.promotionPrice/100).toFixed(2)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="市场价格" align="center" width="180px">
                      <template slot-scope="scope">
                        <span>￥{{(scope.row.mktPrice/100).toFixed(2)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="搭配比例（促销品:商品）" align="center" width="200px">
                      <template slot-scope="scope">
                        <span v-if="scope.row.pmtCollocationEntity == null">-</span>
                        <span v-else>{{scope.row.pmtCollocationEntity.promotionCount}}:{{scope.row.pmtCollocationEntity.goodsCount}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180px" fixed="right">
                      <template slot-scope="scope">
                        <span class="operateBox">    
                          <span 
                            class="operateBtn primaryBtn" 
                            v-if="scope.row.pmtCollocationEntity == null" 
                            @click="matchDepot(scope.row,scope.$index)">搭配</span>
                          <span 
                            class="operateBtn errorBtn"
                            v-else 
                            @click="cancelDepot(scope.row)">取消搭配</span>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="paginationBox">
                    <div class="paginationContent">
                      <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="depotPage"
                        :current-page.sync="depotCurPage"
                        @current-change="changeDepotPage">
                      </el-pagination>
                    </div>
                  </div>
                  <div class="coverBg" v-show="matchStatus"></div>
                  <div class="matchWin" v-show="matchStatus">
                    <p class="match-head">设置<i class="el-icon-close closeBtn" @click="closeMatch"></i></p>
                    <div class="match-body">
                    <el-form ref="form" :model="matchInfo" label-width="240px" :rules="rules">
                        <el-form-item label="搭配比例（促销品：商品）=">
                          <el-col :span="10">
                            <el-input v-model.number="matchInfo.promotionNum" @keyup.native="number('promotionNum')" @blur.native="number('promotionNum')"></el-input>
                          </el-col>
                          <el-col class="line" :span="4" style="text-align:center;font-weight:bold;">:</el-col>
                          <el-col :span="10">
                            <el-input v-model.number="matchInfo.goodsNum" @keyup.native="number('goodsNum')" @blur.native="number('goodsNum')"></el-input>
                          </el-col>
                        </el-form-item>
                        <el-form-item label="设置促销品价格：">
                          <el-col :span="10">
                            <el-tooltip class="item" effect="dark" :content="depotTips" placement="top">
                              <el-input v-model="matchInfo.promotionPrice" @keyup.native="number('promotionPrice')" @blur.native="number('promotionPrice')"></el-input>
                            </el-tooltip>
                          </el-col>
                          <el-col class="line" :span="6" style="text-align:center;">元/件</el-col>
                        </el-form-item>
                        <p style="text-align:center;">
                          <el-button @click="closeMatch" style="width:150px;">关闭</el-button>
                          <el-button @click="submitMatch" style="width:150px;" type="primary">确定</el-button>
                        </p>
                    </el-form>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="detailBox-cover" v-if="drainageDetailDialog"></div>
    <div class="detailBox-win" v-if="drainageDetailDialog">
        <div class="detailBox-out">
          <p class="detailBox-head">商品信息<span class="detailBox-close" @click="closeWindow"></span></p>
          <div class="detailBox">
            <div class="detailBox-item">
              <p class="detailBox-title">商品标题：</p>
              <p class="detailBox-content">{{drainageItem.title}}</p>
            </div>
            <div class="detailBox-item">
              <p class="detailBox-title">商品类目：</p>
              <p class="detailBox-content">{{drainageItem.type}}</p>
            </div>
            <div class="detailBox-item">
              <p class="detailBox-title">商品主图：</p>
              <ul class="detailBox-photoList">
                <li v-for="(item,index) in drainageItem.photo.file" :key="index">
                  <img :src="item.url"/>
                </li>
              </ul>
            </div>
            <div class="detailBox-item">
              <p class="detailBox-title">商品详情：</p>
              <div class="detailBox-detail" v-html="drainageItem.detail"></div>
            </div>
          </div>
        </div>
    </div>
    
  </div>
</template>

<script>
import uploadPhoto from "./uploadPhoto";
export default {
  name: "drainageList",
  components: { uploadPhoto },
  props: {
    drainageDialog: Boolean,
    drainageData: Array,
    drainageInfo: Object, 
  },
  data() {
    return {
      depotChoose:0,
      drainageSearchStatus : false,
      depotTips : "",
      drainageDetailDialog: false,
      select: {},
      drainageItem: {
        title: "",
        type: "",
        detail: "",
        photo: {
          text: "商品主图",
          length: 4,
          action: "",
          file: []
        }
      },
      selectGoods: "",
      searchTxt : "",
      searchTxtCopy : "",
      isShowPage : true,
      totalPage : 0,
      currentPage : 1,
      searchStatus : false,
      activeTag : 0,//标签页活跃索引
      showDrainage : true,//是否显示引流品列表
      totalDepot : 0,//促销品总数
      searchDepotTxt : "",//查找促销品名称
      searchDepotStatus : false,
      depotData : [],//促销品列表
      depotCurPage : 1, //我的仓库当前页
      depotPage : 1,//促销品总页数
      promotionId : "",//促销品ID
      matchStatus : false,//搭配窗口状态,
      matchInfo:{
        promotionNum : "",
        goodsNum : "",
        promotionPrice : ""
      },
      promotionSelect:"",
      rules : {
        promotionNum : [
          { required: true, message: '请输入促销品搭配数量', trigger: 'blur' },
        ],
        goodsNum : [
          { required: true, message: '请输入商品搭配数量', trigger: 'blur' },
        ],
        promotionPrice : [
          { required: true, message: '请输入促销品价格', trigger: 'blur' },
        ]
      }
    };
  },
  computed: {
    total: {
      set(){
        return this.drainageInfo.number;
      },
      get(){
        return this.drainageInfo.number;
      } 
    },
    drainageDialogStatus: {
      set() {
        return this.drainageDialog;
      },
      get() {
        return this.drainageDialog;
      }
    },
    tableData: {
      set(value) {
        return value;
      },
      get() {
        return this.drainageData;
      }
    }
  },
  watch:{
    searchTxt(val){
      if(val.length == 0){
        this.currentPage = 1;
        this.searchTxtCopy = "";
        this.loadDrainage();
      }else{
        this.searchList();
      }
    },
    searchDepotTxt(val){
      if(val.length == 0){
        this.depotCurPage = 1;
        this.loadDepot();
      }else{
        this.searchDepot();
      }
    }
  },
  methods: {
    //选择引流品列表的一行
    handleDrainageChoose(val) {
      this.selectGoods = val;
      this.select = val.title;
      this.drainageItem.title = val.title;
      this.drainageItem.type = val.classifyName;
      this.drainageItem.detail = val.description.replace(/&gt;/g,">").replace(/&lt;/g,"<");
      this.drainageItem.photo.file = [];
      if (val.picUrl1 != null && val.picUrl1 != "") {
        this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl1 });
      }
      if (val.picUrl2 != null && val.picUrl2 != "") {
        this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl2 });
      }
      if (val.picUrl3 != null && val.picUrl3 != "") {
        this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl3 });
      }
      if (val.picUrl4 != null && val.picUrl4 != "") {
        this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl4 });
      }
    },
    //查看该引流品详情
    watchDrainage() {
      let _this = this;
      setTimeout(function(){
        _this.drainageDetailDialog = true;
      },200)
    },
    addPhoto() {},
    //搭配引流品
    submitDrainage(val,index) {
      this.selectGoods = val.title;
      this.$http.get("/szmktstore/goodsInfo/channel/save?goodsId=" + this.$store.state.goodsId + "&channelId=" + val.id 
      + "&userid=" + this.$store.state.loginInfo.userId).then(res=>{
        if(res.data.code == 1000){
          this.$message({type:"success",message:"搭配成功"});
          //this.loadDrainage();
          this.tableData.forEach(item=>{
            item.channelCollocation = null;
          })
          this.tableData[index].channelCollocation = {
            id : res.data.data.id
          };
         
          this.$emit("submitDrainage", val.title,{
            type : 1,
            id : res.data.data.id
          });
        }
      }) 
    },
    //关闭引流品对话框
    closeDialog() {
      this.$emit("closeDrainageDialog");
      this.isShowPage = true;
      this.searchTxt = "";
      this.searchStatus = false;
      this.currentPage = 1;
      this.depotCurPage = 1;
      this.showDrainage = true;
      this.activeTag = 0;
      this.searchDepotTxt = "";
    },
    //关闭查看引流品详情窗口
    closeWindow() {
      this.drainageDetailDialog = false;
      this.drainageItem.photo.file = [];
    },
    //查找引流商品
    searchList(){
      let text = this.searchTxt;
      this.selectGoods = "";
      if(text == ""){
        this.$message({type:"info",message:"请输入引流商品的名称"});
      }else{
        if(!this.$filterWord(text,this.$store.state.filterList)){
            this.$message({type:"error",message:"搜索内容包含敏感词汇，请重试"});
            this.searchTxt = "";
            return;
        }
        this.searchStatus = true;
        this.$http.get("szmktbackstage/channel/ratio/search?userid=" + this.$store.state.loginInfo.userId + "&goodsId=" + 
          this.$store.state.goodsId + "&keyWord=" + text + "&page=0&size=10").then(res=>{
            this.searchTxtCopy = text;
            let content = res.data.data.content;
            this.currentPage = 1;
            
            content.forEach((item,index) => {
              item.pageIndex = index + (this.currentPage - 1)*10 + 1;
            });
            this.$emit("changeDrainage", content);
            this.drainageInfo.totalPage = res.data.data.totalPages;
            this.drainageInfo.number = res.data.data.totalElements;
            if(res.data.data.content.length == 0){
              this.$message({type:"info",message:"暂无相关引流品"});
            }
        }).catch(err=>{
          console.log(err);
        })
      }
    },
    //引流品翻页
    changePage(){
      if(this.searchStatus == true){ 
        this.$http.get("szmktbackstage/channel/ratio/search?userid=" + this.$store.state.loginInfo.userId + "&goodsId=" + 
          this.$store.state.goodsId + "&keyWord=" + this.searchTxtCopy + "&page="+ (this.currentPage -1) +"&size=10").then(res=>{
            if(res.data.code == 1000){
              let content = res.data.data.content;
              content.forEach((item,index) => {
                item.pageIndex = index + (this.currentPage - 1)*10 + 1;
              });
              this.$emit("changeDrainage", content);
              this.totalPage = res.data.data.totalPages*10;
            }else{
              this.$message({type: 'error',message: res.data.message});
            }
        }).catch(err=>{
            console.log(err);
        })
      }else{
        this.loadDrainage();
      }
    },
    //加载引流品列表
    loadDrainage(){  
      this.$http.get("szmktbackstage/channel/ratio/search?page=" + (this.currentPage-1) +"&size=10&userid=" + this.$store.state.loginInfo.userId 
        +"&goodsId=" + this.$store.state.goodsId + "&keyWord=" + this.searchTxtCopy).then(res=>{
          if(res.data.code == 1000){
            let content = res.data.data.content;
            content.forEach((item,index) => {
              item.pageIndex = index + (this.currentPage - 1)*10 + 1;
            });
            this.$emit("changeDrainage", content);
            this.totalPage = res.data.data.totalPages*10;
            this.total = res.data.data.totalElements;
            this.drainageInfo.totalPage = res.data.data.totalPages;
            this.drainageInfo.number = res.data.data.totalElements;
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
        }).catch(err=>{
            console.log(err);
        })
    },
    chooseTag(index){
      if(index != this.activeTag){
        this.activeTag = index;
        this.showDrainage = !this.showDrainage;
        if(this.activeTag == 0){
          this.loadDrainage();
        }else{
          this.loadDepot();
        }
      }
    },
    loadDepot(){
      this.$http("/szmktstore/storeWarehouse/collocation/page?page=" + (this.depotCurPage-1) +"&size=10&userid=" + this.$store.state.loginInfo.userId 
        +"&goodsId=" + this.$store.state.goodsId + "&keyWords=" + this.searchDepotTxt).then(res=>{
          if(res.data.code == 1000){
            this.depotData = res.data.data.content;
            this.depotData.forEach((item,index) => {
              item.pageIndex = index + (this.depotCurPage - 1)*10 + 1;
            });
            this.totalDepot = res.data.data.totalElements;
            this.depotPage = res.data.data.totalPages * 10;
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
      }).catch(err=>{
        console.log(err);
      })
    },
    searchDepot(){
      if(this.searchDepotTxt.length == 0){
        this.$message({type:"info",message:"请输入促销品名称"});
        return;
      }
      if(!this.$filterWord(this.searchDepotTxt,this.$store.state.filterList)){
        this.$message({type:"error",message:"搜索内容包含敏感词汇，请重试"});
        this.searchDepotTxt = "";
        return;
      }
      this.depotCurPage = 1;
      this.loadDepot();
    },
    changeDepotPage(){
      this.loadDepot();
    },
    matchDepot(row,index){
      this.depotChoose = index;
      this.depotTips = "促销品价格不得高于市场价(￥" + (row.mktPrice/100).toFixed(2) + ")";
      this.promotionId = row.promotionId;
      this.promotionSelect = row.title;
      this.matchStatus = true;
    },
    cancelDepot(row){
      this.$http.get("/szmktstore/goodsInfo/promotion/cancel?goodsId=" + this.$store.state.goodsId + "&collocationId=" + row.pmtCollocationEntity.id).then(res=>{
        if(res.data.code == 1000){
          this.$message({type:"info",message:"取消成功"});
          this.$emit("submitDrainage","",{
            type : 0,
            id : ""
          });
          this.loadDepot();
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      })
    },
    closeMatch(){
      this.matchStatus = false;
      this.matchInfo = {
        promotionNum : "",
        goodsNum : "",
        promotionPrice : ""
      };
    },
    //搭配促销品
    submitMatch(){
      if(this.matchInfo.promotionNum.length == 0){
        this.$message({type:"error",message:"请输入促销品搭配比例"});
        return;
      }
      if(this.matchInfo.goodsNum.length == 0){
        this.$message({type:"error",message:"请输入商品搭配比例"});
        return;
      }
      if(this.matchInfo.promotionPrice.length == 0){
        this.$message({type:"error",message:"请输入促销品价格"});
        return;
      }
      if(this.matchInfo.promotionPrice - 0 <= 0){
        this.$message({type:"error",message:"促销品价格应为0以上"});
        return;
      }
      if(isNaN(this.matchInfo.promotionNum)){
        this.$message({type:"error",message:"请输入有效的促销品比例"});
        return;
      }
      if(isNaN(this.matchInfo.goodsNum)){
        this.$message({type:"error",message:"请输入有效的商品比例"});
        return;
      }
      if(isNaN(this.matchInfo.promotionPrice)){
        this.$message({type:"error",message:"请输入有效的促销品价格"});
        return;
      }
      this.$http.post("/szmktstore/goodsInfo/promotion/save?goodsId=" + this.$store.state.goodsId 
      + "&promotionId=" + this.promotionId +"&goodsCount=" + this.matchInfo.goodsNum+ 
      "&pmtCount=" + this.matchInfo.promotionNum + "&price=" + parseInt(this.matchInfo.promotionPrice*100)).then(res=>{
        if(res.data.code == 1000){
          this.$message({type:"success",message:"搭配成功"});
          this.$emit("submitDrainage", this.promotionSelect,{
            type : 2,
            id : res.data.data.id
          });
          //this.loadDepot();
          this.depotData.forEach(item=>{
            item.pmtCollocationEntity = null;
          });
          this.depotData[this.depotChoose].pmtCollocationEntity={
            promotionPrice : parseInt(this.matchInfo.promotionPrice*100),
            promotionCount : this.matchInfo.promotionNum,
            goodsCount : this.matchInfo.goodsNum,
            id:res.data.data.id
          };
          this.matchStatus = false;
          this.matchInfo = {
            promotionNum : "",
            goodsNum : "",
            promotionPrice : ""
          };
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      })
    },
    //数字规则校验
    number(value){
      if(value != "promotionPrice"){
        var reg = /^(-?\d+)(\.\d{1,2})?$/;
        if(isNaN(this.matchInfo[value])){
          this.matchInfo[value] = "";
        }else if(!reg.test(this.matchInfo[value])){
          this.matchInfo[value] = "";
        }else if(this.matchInfo[value] > 999 || this.matchInfo[value] < 1){
          this.matchInfo[value] = "";
        }
      }else{
        var reg1 = /^(-?\d+)(\.\d{1,2})?$/;
        if(isNaN(this.matchInfo[value])){
          this.matchInfo[value] = "";
        }else if(!reg1.test(this.matchInfo[value] - 0)){
          this.matchInfo[value] = "";
        }
      }
    },
    watchDepot(id){
      this.$http.get("/szmktbackstage/promotion/detail?promotionId=" + id + "&userid=" + this.$store.state.loginInfo.userId).then(res=>{
        if(res.data.code == 1000){
          let val = res.data.data;
          this.drainageItem.title = val.title;
          this.drainageItem.type = val.classifyName;
          this.drainageItem.detail = val.description.replace(/&gt;/g,">").replace(/&lt;/g,"<");
          this.drainageItem.photo.file = [];
          if (val.picUrl1 != null && val.picUrl1 != "") {
            this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl1 });
          }
          if (val.picUrl2 != null && val.picUrl2 != "") {
            this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl2 });
          }
          if (val.picUrl3 != null && val.picUrl3 != "") {
            this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl3 });
          }
          if (val.picUrl4 != null && val.picUrl4 != "") {
            this.drainageItem.photo.file.push({ url: this.$filePath.photo + val.picUrl4 });
          }
          let _this = this;
          setTimeout(function(){
            _this.drainageDetailDialog = true;
          },200)
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    cancelDrainage(row,index){
      this.$http.get("/szmktstore/goodsInfo/channel/cancel?goodsId=" + this.$store.state.goodsId + "&collocationId=" + row.channelCollocation.id).then(res=>{
        if(res.data.code == 1000){
          this.$message({type:"info",message:"取消成功"});
          this.loadDrainage();
          // this.tableData[index].channelCollocation = null;
          this.$emit("submitDrainage","",{
            type : 0,
            id : ""
          });
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      })
    },
    openDrainageSearch(){
      this.drainageSearchStatus = true;
    }
  },
  mounted(){  
    let _this = this;
    // document.onkeydown = function(e) {
    //   var key = window.event.keyCode;
    //   if (_this.$route.name == "goods" || _this.$route.name == "addGoods" || _this.$route.name == "editGoods") {
    //     if(key == 13){
    //       if(_this.activeTag == 0 ){
    //         if(_this.drainageSearchStatus){
    //           _this.searchList();
    //         }
    //       }else if(_this.activeTag == 1 && _this.matchStatus == false){
    //         _this.searchDepot();
    //       }
    //     }
    //   }
    // };
  },
  beforeUpdate(){
    this.totalPage = this.drainageInfo.totalPage*10;
  }
};
</script>

<style scoped lang="less">
.drainageList {
  .drainageDialogBox{
    position: fixed;
    //width: calc(100% - 241px);
    // height: calc(100vh - 70px);
    min-width: calc(100vw - 241px);
    min-height: calc(100vh - 150px);
    top:60px;
    left: 200px;
    padding:20px;
    border-right: 1px solid #c0c4cc;
    background-color: #E5E8ED;
    overflow: auto;
    z-index: 450;
    padding-top: 70px;
  }
  .drainageDialog-panel{
    background-color: white;
    border-radius: 5px;
    margin-bottom: 15px;
    max-width: calc(100vw - 241px);
    // width: calc(100vw - 241px);
    // min-height: 780px;
    overflow-x: auto;
  }
  .drainageDialog-panelBody{
    min-width: 1300px;
  }
  .closeBtn{
      font-size:24px;
      position: absolute;
      cursor: pointer;
      top: 15px;
      right: 40px;
    }
  .drainageDialog-header {
    float: left;
    width: 270px;
  }
  .drainageDialog-btnBox {
    overflow: hidden;
    display: flex;
  }
  .total {
    float: left;
    margin-left: 3%;
    line-height: 40px;
    font-size: 20px;
    color: #942424;
  }
  .drainageDialog-search{
    float: right;
  }
  .cover {
    width: 40px;
    height: 40px;
  }
  .detail {
    img {
      width: 300px;
      height: 300px;
      margin: 20px auto;
    }
  }
  .drainageName{
    color:#0f9ef3;
    cursor: pointer;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  .change{
    color: red;
    cursor: pointer;
  }
  .change:hover{
    color: #0f9ef3;
    text-decoration: underline;
  }
  .search{
    // position: absolute;
    // top: 90px;
    // right: 55px;
    float: right;
    margin: 20px 2% 20px 0;
  }
  .paginationBox{
    overflow: hidden;
    width:98%;
  }
  .drainageDialog-head{
    overflow: hidden;
    margin: 0 0 10px 30px;
    .head-tag{
      width: 400px;
      overflow: hidden;
      margin: 20px 0 15px 5px;
      float: left;
      border: 1px solid rgba(171,178,192,1);
      border-radius: 3px;
      line-height: 40px;
    }
    .tag{
      width: 200px;
      line-height: 40px;
      background-color: #fff;
      float: left;
      cursor: pointer;
      font-size: 16px;
    }
    .activeTag{
      background-color: #4181FE;
      color: white;
    }
  }
  .coverBg{
    width: 100%;
    height:100%;
    position: absolute;
    top:0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 50;
  }
  .matchWin{
    width: 600px;
    position: absolute;
    background-color: white;
    border-radius: 3px;
    top: 150px;
    left: 50%;
    margin-left: -300px;
    z-index: 100;
    .match-head{
      line-height: 50px;
      font-size: 20px;
      border-bottom: 1px solid #909399;
      position: relative;
    }
    .match-body{
      line-height: 30px;
      width: 500px;
      margin: 30px auto;
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
  .return{
    position: absolute;
    top: 20px;
    line-height: 30px;
    font-size: 18px;
    color: #4181FE;
    text-indent: 25px;
    background: url(../../assets/img/fanhui.png) left center no-repeat;
    background-size: 18px 18px;
    cursor: pointer;
  }
  .operateBtn{
      padding: 5px 10px;
      border-radius: 5px;
      margin: 0 5px;
      line-height: 35px;
      cursor: pointer;
  }
  .errorBtn{
      border: 1px solid #FF6B6B;
      color: #FF6B6B;
  }
  .primaryBtn{
      border: 1px solid #418EFE;
      color: #418EFE;
  }
    .successBtn{
      border: 1px solid #26bd76;
      color: #26bd76;
  }
  .errorBtn:hover{
      background-color: #FF6B6B;
      color: white;
  }
  .primaryBtn:hover{
      background-color: #418EFE;
      color: white;
  }
  .successBtn:hover{
      background-color: #26bd76;
      color: white;
  }
  .detailBox-win{
    background: white;
    height: 81.5vh;
    position: fixed;
    z-index: 510;
    left: 50%;
    top: 9.5vh;
    margin-left: -264px;
    border-radius: 5px;
    overflow: hidden;
  }
  .detailBox-out{
    height: 79.6vh;
    padding: 10px 0;
    width: 528px;
    overflow: hidden;
  }
  .detailBox-head{
    line-height: 44px;
    font-size: 16px;
    border-bottom: #ABB2C0 1px solid;
    position: relative;
  }
  .detailBox-cover{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 500;
    background-color: rgba(0,0,0,.5);
  }
  .detailBox-close{
    display: block;
    width: 24px;
    height: 24px;
    background: url(../../assets/img/close.png) center center no-repeat;
    background-size: 13px 13px;
    position: absolute;
    top: 10px;
    right: 30px;
    cursor: pointer;
  }
  .detailBox{
    width: 472px;
    height: 75.5vh;
    padding: 0 28px;
    overflow-y: auto;
    .detailBox-item{
      text-align: left;
      font-size: 16px;
      line-height: 35px;
      width: 472px;
      padding: 5px 0;
      .detailBox-title{
        color: #ABB2C0;
      }
      .detailBox-content{
        color: #2E3034;
        font-weight: bold;
      }
      .detailBox-photoList{
        margin: 10px 0;
        overflow: hidden;
        li{
          width: 112px;
          height: 112px;
          float: left;
          border: 1px solid #ABB2C0;
          border-radius: 3px;
          margin-right:5px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        li:last-child{
          margin-right:0;
        }
      }
    }
  }
}
</style>
