<template>
  <div class="goods">
    <div class="goodsPanel">
    <div class="goods-head">
      <div class="head-tag">
        <span :class="['tag',activeTag == 0 ? 'activeTag' : '']" @click="chooseTag(0)">我的商品</span>
        <span :class="['tag',activeTag == 1 ? 'activeTag' : '']" @click="chooseTag(1)">我的仓库</span>
      </div>
      <el-button class="addGoods" type="primary" icon="el-icon-circle-plus-outline" style="margin-bottom:20px;" @click="addGoods" v-show="showGoods">新增商品</el-button>
      <div class="search" v-show="showGoods">
        <el-input placeholder="请输入搜索内容" v-model="searchTxt" class="input-with-select searchInput" clearable>
          <el-select v-model="searchSelect" slot="prepend" placeholder="请选择">
            <el-option label="商品名称" value="1"></el-option>
            <el-option label="商品编号" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
        </el-input>
      </div>  
    </div>
    <div class="goodsShow" v-show="showGoods">
      <el-table :data="goodsList" height="694" style="width: 100%;margin-bottom:5px;" @current-change="changeRow" :highlight-current-row="true">
        <el-table-column label="序号" width="100" align="center" prop="pageIndex"></el-table-column>
        <el-table-column prop="title" label="商品名称" width="350" align="left">
        </el-table-column>
        <el-table-column prop="sku" label="商品编号" align="center"  width="150px">
          <template slot-scope="scope">
            <span v-if="scope.row.sku == ''">暂无</span>
            <span v-else>{{scope.row.sku}}</span>
          </template>
        </el-table-column>
        <el-table-column label="销量" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.saleCount == 0">0</span>
            <el-tooltip v-else class="item" effect="dark" content="点击查看销量情况" placement="bottom">
              <el-button type="text" @click="watchSaleCount(scope.row)">{{scope.row.saleCount}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" prop="totalStock"></el-table-column>
        <el-table-column prop="channelId" label="搭配" align="center"  width="200px">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1 || scope.row.status == 3">
              <span v-if="scope.row.channelStock == null && scope.row.promotionStock == null" @click="openDrainage(scope.row,scope.$index,'add')">无(<el-button type="text" style="margin-left:5px;">添加</el-button>)</span>
              <span v-else-if="scope.row.channelStock == 0 || scope.row.promotionStock == 0" @click="openDrainage(scope.row,scope.$index,'replace')">
                <span style="color:#FF8F32;">已售罄</span>(<el-button type="text" style="margin-left:5px;">更换</el-button>)
              </span>
              <span v-else @click="openDrainage(scope.row,scope.$index,'replace')">有(<el-button type="text" style="margin-left:5px;">更换</el-button>)</span>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityId" label="促销活动" align="center"  width="180px">
          <template slot-scope="scope">
            <span v-if="scope.row.activityType == 0">无</span>
            <span v-else-if="scope.row.activityType == 1">赏金(<el-button type="text" @click="watchActivy(scope.row.id)">查看</el-button>)</span>
            <span v-else >满减(<el-button type="text" @click="watchActivy(scope.row.id)">查看</el-button>)
              <!-- 满{{scope.row.standard/100}}减{{scope.row.privilege/100}}
              <el-button type="text" style="margin-left:5px;">更换</el-button> -->
            </span>
          </template>
        </el-table-column> 
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <div class="statusBox" style="padding: 0;">
              <span v-if="scope.row.status == 0" style="color:#FF8F32;"><i class="el-icon-warning"></i>待审核</span>
              <span v-else-if="scope.row.status == 1" style="color:#26BD75;"><i class="el-icon-success"></i>已上架</span>
              <span v-else-if="scope.row.status == 2" style="color:#FF6B6B;"><i class="el-icon-error"></i>被拒绝</span>
              <span v-else-if="scope.row.status == 3" style="color:#ABB2C0;"><i class="el-icon-info"></i>已下架</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="200">
          <template slot-scope="scope">
            <span class="operateBox" v-if="scope.row.status == 0">
              <span>-</span>
            </span>
            <span class="operateBox" v-if="scope.row.status == 1">
              <span class="operateBtn primaryBtn" @click="watchGoods(scope.row)">查看</span>
              <span class="operateBtn errorBtn" @click="downGoods(scope.row)">下架</span>
            </span>
            <span class="operateBox" v-else-if="scope.row.status == 2">    
              <span class="operateBtn primaryBtn" @click="watchReason(scope.row)">查看原因</span>
              <span class="operateBtn errorBtn" @click="handleEdit(scope.row)">重新提交</span>
            </span>
            <span class="operateBox" v-if="scope.row.status == 3">
              <span class="operateBtn successBtn" @click="upGoods(scope.row)">上架</span>
              <span class="operateBtn primaryBtn" @click="handleEdit(scope.row)">编辑</span>
              <span class="operateBtn errorBtn" @click="handleDelete(scope.$index, goodsList)">删除</span>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="goodsListPage"
        :current-page.sync="currentPage"
        @current-change="changePage">
      </el-pagination>
    </div>
    <div class="depotShow" v-show="!showGoods">
      <el-table :data="depotList" height="680" style="width: 100%;margin-bottom:15px;" :highlight-current-row="true">
        <el-table-column label="序号" width="100" align="center" prop="pageIndex"></el-table-column>
        <el-table-column prop="title" label="商品名称" width="350" align="left">
        </el-table-column>
        <el-table-column label="销量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.saleNum}}</span>
            <!-- <span v-if="scope.row.saleNum == 0">0</span>
            <el-tooltip v-else class="item" effect="dark" content="点击查看销量情况" placement="bottom">
              <el-button type="text" @click="watchSaleCount(scope.row)">{{scope.row.saleNum}}</el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column  label="商品搭配" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.collocationNum == 0" style="display:block;padding:6px 0;">0</span>
            <span v-else>
              {{scope.row.collocationNum}}(<el-button  type="text" @click="watchCollocation(scope.row.promotionId)">查看</el-button>)
            </span>
            
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="addSock(scope.row.promotionId)">添加库存</el-button> -->
            <span class="operateBox">
              <span class="operateBtn primaryBtn" @click="addSock(scope.row.promotionId)">添加库存</span>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="depotListPage"
        :current-page.sync="currentDepotPage"
        @current-change="changeDepotPage">
      </el-pagination>   
    </div>
    </div>

    <transition name="saleCount">
        <div class="collocationWindow" v-if="showCollocation">
          <p @click="returnDepot" class="returnPrev">返回上一级</p>
          <div class="collocationPanel">
            <div class="collocation-head">
              <p>搭配详情</p>
              <!-- <el-button type="primary" style="float:right;" @click="returnDepot">返回</el-button> -->
            </div>
            <div class="collocation-body">
              <el-table :data="collocationData" style="width: 100%;margin-bottom:10px;" height="calc(100vh - 310px)" :highlight-current-row="true">
                <el-table-column label="序号"  align="center" prop="pageIndex" width="150px">
                </el-table-column>
                <el-table-column prop="title" label="商品名称"  align="center">
                </el-table-column>
                <el-table-column prop="classifyName" label="类型"  align="center">
                </el-table-column>
                <el-table-column label="成交数量" align="center" prop="saleNum">
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next, jumper"
                :total="matchListPage"
                :current-page.sync="matchCurrentPage"
                @current-change="changeMatchPage">
              </el-pagination>
            </div>
          </div>
        </div>
    </transition>
    
    <drainage-list
      :drainageDialog="drainageDialog"
      :drainageData="drainageData"
      :drainageInfo="drainageInfo"
      :goodsId="goodsId"
      @closeDrainageDialog="closeDrainageDialog"
      @submitDrainage="submitDrainage"
      @changeDrainage ="changeDrainage">
    </drainage-list>
    
    <activy-window :goodsId="activyGoodsId" @closeActivyDetail="closeActivyDetail" v-if="isShowActivyWindow"></activy-window>

    <transition name="saleCount">
      <div class="saleCountWindow" v-show="showSaleCount">
        <p class="returnPrev"  @click="closeSaleCount">返回上一级</p>
        <div class="saleCountPanel">
          <!-- <i class="el-icon-error closeBtn" @click="closeSaleCount"></i> -->
          <p class="title">累计订单统计（<span class="redTitle">{{saleCountGoods}}</span>）</p>
          <div class="saleCountTable-box">
            <el-table :data="saleCountData" height="calc(100vh - 280px)" class="saleCountTable" :highlight-current-row="true">
              <el-table-column label="序号" width="150px" align="center" prop="pageIndex">
              </el-table-column>
              <el-table-column prop="payTime" label="时间"  align="center">
              </el-table-column>
              <el-table-column prop="count" label="数量"  align="center">
              </el-table-column>
              <el-table-column label="单价(元)" align="center">
                <template slot-scope="scope">
                  {{(scope.row.price/100).toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="总价(元)" align="center">
                <template slot-scope="scope">
                  {{(scope.row.price*scope.row.count/100).toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.streamStatus == 0">
                    <span v-if="scope.row.goodsStreamNo == null">待发货</span>
                    <span v-else>已发货</span>
                  </span>
                  <span v-else>已收货</span>
                </template>
              </el-table-column>
              <el-table-column label="收货信息" align="center">
                <template slot-scope="scope">         
                  <span v-if="scope.row.streamStatus == 0">-</span>
                  <el-button v-else type="text" @click="watchInfo(scope.row)">查看</el-button>
                </template> 
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="sellListPage"
            :current-page.sync="saleCurrentPage"
            @current-change="changeSellPage">
          </el-pagination>
        </div>
      </div>
    </transition>
    
    <el-dialog 
      title="收货信息"
      :visible.sync="dialogVisible"
      width="30%">
      <ul class="saleCountInfo">
        <li v-for="(saleCountItem,index) in saleCountTitle" :key="index">
          <p class="saleCountInfoTitle">{{saleCountItem}}</p>
          <p class="saleCountInfoContent">{{saleCountInfo[index]}}</p>
        </li>
      </ul>
    </el-dialog>

    <el-dialog 
      title="更换促销活动"
      :visible.sync="changeActivityStatus"
      width="45%">
      <el-radio-group v-model="changeActivityRadio">
        <el-radio 
        border
        v-for="(item,index) in activyList"
        :label="item.label"
        :key="index">{{item.title}}</el-radio>
      </el-radio-group>
      <br/>
      <el-button 
      type="primary" 
      style="padding:15px 50px;margin:20px auto 0;" 
      @click="submitChangeActivity">确定</el-button>
    </el-dialog>

    <el-dialog 
      title="被拒绝原因"
      :visible.sync="refuseReasonStatus"
      width="30%">
      <p>{{refuseReasonDetail}}</p>
    </el-dialog>
  
  </div>
</template>

<script>
import drainageList from "../../tools/drainageList"
import activyWindow from "./activyDetail"

import { truncate } from 'fs';
export default {
  name: 'goods',
  components:{
    drainageList,activyWindow
  },
  data () {
    return {
      isShowActivyWindow : false,
      activyGoodsId : "",
      searchStatus : false,
      searchSelect : "商品名称",
      searchTxt :"",
      matchId : "",
      matchCurrentPage : 1,
      matchListPage : 0,
      collocationData : [],//已搭配商品列表
      showCollocation : false,
      currentDepotPage : 1,//我的仓库当前页
      depotListPage : 0,//我的仓库页数
      showGoods : true,
      depotList :[],
      activeTag:0,
      goodsList: [],
      showSaleCount : false,
      goodsId : "",
      drainageInfo :{
        number : 0,
        totalPage : 0
      },
      currentRow : {},//当前选择行
      saleCountData:[],//销量
      dialogVisible :false,
      saleCountTitle : [
          "收货姓名","收货电话","收货地址","快递信息"
      ],
      saleCountGoods:"",
      saleCountInfo : [],
      drainageDialog : false,     
      drainageData :[],//引流品列表数据
      drainageDetailDialog : false,//引流品详情弹窗显示
      thisSelectRow : "",//当前操作的行索引
      changeActivityStatus : false,//改变促销活动的窗口状态
      changeActivityRadio : 0,
      activityContent :[],//促销活动具体内容
      refuseReasonStatus : false,//拒绝原因窗口状态
      refuseReasonDetail : "",
      activyList : [],
      goodsListPage : 0,
      sellListPage : 0,
      addDrainage : true,
      currentPage : 1,//当前商品页
      saleCurrentPage : 1
   }
  },
  watch:{
    searchTxt(val){
      if(val.length == 0){
        this.searchStatus = false;
        this.currentPage = 1;
        this.loadGoodsData();
      }else{
        this.searchGoods();
      }
    }
  },
  methods:{
    //新增商品跳转
    addGoods(){
      this.$store.commit("changeShopNavTitle","商品管理-新增商品");
      this.$router.push({
        name : "addGoods"
      })
    },
    //选择一行获取当前行索引
    changeRow(currentRow, oldCurrentRow){
      if(currentRow != null){
        this.saleCountGoods = currentRow.title;
        this.currentRow = currentRow;
      }
    },
    //处理删除操作
    handleDelete(index,rows){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("szmktstore/goodsInfo/delete/" + this.goodsList[index].id).then(res=>{
          if(res.data.code == 1000){
            rows.splice(index, 1);
            this.loadGoodsData();
            this.$message({type: 'success',message: '删除成功!'});
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
        }).catch(err=>{
          console.log(err);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    //查看原因
    watchReason(row){
      this.refuseReasonStatus = true;
      this.refuseReasonDetail = row.refuseReason;
    },
    //处理编辑操作
    handleEdit(row){
      this.$store.commit("changeShopNavTitle","商品管理-编辑商品");
      this.$store.commit("changeGoodsId",row.id);
      this.$router.push({ 
        path: 'editGoods',
        query: { 
          shopId : row.id
        }
      });
    },
    //查看销量
    watchSaleCount(row){
      this.showSaleCount = true;
      this.saleCurrentPage = 1;
      this.$store.commit("changeGoodsId",row.id);
      this.$http.get("szmktuser/store/viewgoodssales?goodsid=" + row.id + "&page=1&rows=10").then(res=>{
        if(res.data.code == 1000){       
          this.saleCountData = res.data.data.list;
          this.sellListPage = res.data.data.totalPage*10;
          this.saleCountData.forEach((item,index)=>{
              let date = new Date(item.payTime);
              let year = date.getFullYear();
              let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
              let day = date.getDate()  < 10 ? "0" + date.getDate()  : date.getDate();
              let hour = date.getHours()  < 10 ? "0" + date.getHours()  : date.getHours();
              let min = date.getMinutes()  < 10 ? "0" + date.getMinutes()  : date.getMinutes();
              let second = date.getSeconds()  < 10 ? "0" + date.getSeconds()  : date.getSeconds();
              item.pageIndex = index + (this.saleCurrentPage-1)*10 + 1;
              item.payTime = year + "-" + month + "-"+ day + " "  + hour + ":"+ min + ":" + second;
          })
          //console.log(this.saleCountData);
        }else{
          this.$message({type: 'error',message: res.data.message});
        } 
      }).catch(err=>{
        console.log(err);
      })
    },
    //关闭销量
    closeSaleCount(){
      this.showSaleCount = false;
    },
    //查看收货信息
    watchInfo(row){
      this.dialogVisible = true;
      if(row.streamName == null || row.streamNo == null){
        this.saleCountInfo = [
          row.name,
          row.phone,
          row.address,
          "暂无"
        ];
      }else{
        this.saleCountInfo = [
          row.name,
          row.phone,
          row.address,
          "快递公司：" + row.streamName + ",快递单号：" + row.streamNo
        ];
      }
    },
    //打开引流品框
    openDrainage(row,index,operate){
      let _this = this;
      if(operate == "add"){
        this.addDrainage = true
      }else if(operate == "replace"){
        this.addDrainage = false
      }
      this.thisSelectRow = index;
      this.$store.commit("changeGoodsId",row.id);
      this.$http.get("szmktbackstage/channel/ratio/search?page=0&size=10&userid=" + this.$store.state.loginInfo.userId +"&goodsId=" + row.id).then(res=>{
          if(res.data.code == 1000){
            this.drainageData = res.data.data.content;
            this.drainageData.forEach((item,index)=>{
              item.pageIndex = index + 1;
            });
            this.drainageInfo.number = res.data.data.totalElements;
            this.drainageInfo.totalPage = res.data.data.totalPages;
            this.drainageDialog =true;
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
      }).catch(err=>{
          console.log(err);
      })
    },
    //关闭引流品框
    closeDrainageDialog(){
      this.drainageDialog =false;
    },
    //改变引流搭配
    submitDrainage(){
      this.loadGoodsData();
    },
    //改变活动
    changeActivity(index){
      this.thisSelectRow = index;
      this.changeActivityStatus = true;
      this.changeActivityRadio = index.activityId;
      this.$store.commit("changeGoodsId",index.id);
    },
    //更改活动
    submitChangeActivity(){
      this.$http.post("szmktstore/goodsInfo/changeActivity?goodsId=" + this.$store.state.goodsId +"&activityId=" + this.changeActivityRadio).then(res=>{
          //console.log(res);
          if(res.data.code == 1000){
            this.$message({
              message : "更换成功！",
              type : "success"
            });  
            this.changeActivityStatus = false;
            this.loadGoodsData();
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
      }).catch(err=>{
        console.log(err);
      })
    },
    //点击页码事件
    changePage(){
      this.loadGoodsData();
    },
    //随机改变引流品
    changeDrainage(data){
      this.drainageData = data;
    },
    //加载商品数据
    loadGoodsData(){
      let type = 0;
      if(!this.searchStatus){
        this.searchTxt = "";
      }else{
        type = 1;
      }
      if(this.searchSelect == 2){
        type = 2;
      }
      let page = this.currentPage - 1;
      this.$http.get("szmktstore/goodsInfo/storeManage/page?storeId=" + this.$store.state.loginInfo.storeId 
      + "&page=" + page +"&size=10&searchType=" + type + "&keyword=" + this.searchTxt).then(res=>{
        if(res.data.code == 1000){
          this.goodsListPage = res.data.data.totalPages*10;
          this.goodsList = res.data.data.content;
          this.goodsList.forEach((item,index)=>{
            item.pageIndex = index + (this.currentPage-1)*10 + 1;
          })
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //销量换页
    changeSellPage(index){
      this.$http.get("szmktuser/store/viewgoodssales?goodsid=" + this.$store.state.goodsId + "&page=" + index +"&rows=10").then(res=>{
        if(res.data.code == 1000){
          this.saleCountData = res.data.data.list;
          this.saleCountData.forEach((item,index)=>{
              let date = new Date(item.payTime); 
              let year = date.getFullYear();
              let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
              let day = date.getDate()  < 10 ? "0" + date.getDate()  : date.getDate();
              let hour = date.getHours()  < 10 ? "0" + date.getHours()  : date.getHours();
              let min = date.getMinutes()  < 10 ? "0" + date.getMinutes()  : date.getMinutes();
              let second = date.getSeconds()  < 10 ? "0" + date.getSeconds()  : date.getSeconds();
              item.pageIndex = index + (this.saleCurrentPage-1)*10 + 1;
              item.payTime = year + "-" + month + "-"+ day + " "  + hour + ":"+ min + ":" + second;
          })
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //选择顶部标签页
    chooseTag(index){
      if(index != this.activeTag){
        this.activeTag = index;
        this.showGoods = !this.showGoods;
        if(this.activeTag == 0){
          this.loadGoodsData();
        }else{
          this.loadDepotData();
        }
      }
    },
    //添加库存
    addSock(id){
      this.$router.push({name:"buyPromotion",query:{goodsId:id}});
    },
    //查看商品搭配
    watchCollocation(id){
      this.showCollocation = true;
      this.matchId = id;
      this.matchCurrentPage = 1;
      this.loadMatch();
    },
    //加载搭配详情
    loadMatch(){
      this.$http.get("/szmktstore/storeWarehouse/collocation/goods?size=10&userid=" + this.$store.state.loginInfo.userId 
      + "&promotionId=" + this.matchId + "&page=" + (this.matchCurrentPage-1)).then(res=>{
        if(res.data.code == 1000){
          this.collocationData = res.data.data.content;
          this.collocationData.forEach((item,index) =>{
            item.pageIndex = index + 1 + (this.matchCurrentPage - 1)*10;
          })
          this.matchListPage = res.data.data.totalPages*10;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //我的仓库翻页
    changeDepotPage(){
      this.loadDepotData();
    },
    //返回我的仓库
    returnDepot(){
      this.showCollocation = false;
      this.matchCurrentPage = 1;
    },
    //加载我的仓库数据
    loadDepotData(){
      this.$http.get("/szmktstore/storeWarehouse/manage/page?userid=" + this.$store.state.loginInfo.userId 
      + "&size=10&page=" + (this.currentDepotPage -1)).then(res=>{
        if(res.data.code == 1000){
          this.depotList = res.data.data.content;
          this.depotListPage = res.data.data.totalPages*10;
          this.depotList.forEach((item,index) =>{
            item.pageIndex = index + 1 + (this.currentDepotPage-1)*10;
          })
        }else{
            this.$message({type: 'error',message: res.data.message});
          }
      }).catch(err=>{
        console.log(err);
      })
    },
    //已搭配商品翻页
    changeMatchPage(){
      this.loadMatch();
    },
    //上架商品
    upGoods(row){
      this.$confirm('上架该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/szmktstore/goodsInfo/up?userid=" + this.$store.state.loginInfo.userId 
        + "&goodsId="+ row.id).then(res=>{
            if(res.data.code == 1000){
              this.loadGoodsData();
              this.$message({type: 'success',message: '上架成功!',duration:300});
            }else{
              this.$message({type: 'error',message: res.data.message});
            }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        });          
      });
    },
    //下架商品
    downGoods(row){
      this.$confirm('对该商品进行下架操作后，在商城内就查看不到本款商品了，是否要继续下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get("/szmktstore/goodsInfo/down?userid=" + this.$store.state.loginInfo.userId 
        + "&goodsId="+ row.id).then(res=>{
          if(res.data.code == 1000){
            this.loadGoodsData();
            this.$message({type: 'success',message: '下架成功!',duration:300});
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        });          
      });
    },
    //查看活动
    watchActivy(id){
      this.isShowActivyWindow = true;
      this.activyGoodsId = id;
      //this.$router.push({name:"activyDetail",query:{goodsId:id}});
    },
    //关闭活动详情
    closeActivyDetail(){
      this.isShowActivyWindow = false;
    },
    //搜索商品
    searchGoods(){
      if(this.searchTxt.length > 0){
        if(!this.$filterWord(this.searchTxt,this.$store.state.filterList)){
          this.$message({type:"error",message:"输入内容包含敏感词汇，请重试"});
          return false;
        }
        this.currentPage = 1;
        this.searchStatus = true;
        this.loadGoodsData();
      }else{
        this.$message({type:"error",message:"请输入搜索内容"});
      }
    },
    watchGoods(row){
      this.$store.commit("changeGoodsPage",this.currentPage);
      this.$store.commit("changeShopNavTitle","商品管理-查看商品");
      this.$store.commit("changeGoodsId",row.id);
      this.$router.push({ 
        path: 'goodsDetail',
        query: { 
          shopId : row.id
        }
      });
    }
  },
  created(){
    if(this.$route.query.type == 2){
      this.showGoods = false;
      this.activeTag = 1;
      this.loadDepotData();
    }else{
      this.currentPage = this.$store.state.goodsPage;
      this.loadGoodsData();
    }
  },
  mounted(){
    let _this = this;
    //this.loadActivty();
    this.loadDepotData();
    this.$store.commit("changeHeaderShow",false);
    this.$store.commit("changeIsShowNav",false);
    this.$store.commit("changeShopNavTitle","商品管理");
    this.$store.commit("changeActiveShopItem","0");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.goods{
  padding: 10px 20px 0;
  margin: 10px 0 20px;
  position: relative;
  min-width: 1200px;
  .goodsPanel{
    background-color: white;
    overflow: hidden;
    box-sizing: border-box;
    padding:15px 20px 0;
    border-radius: 5px;
  }
  .addGoods{
    float: right;
  }
  .search{
    overflow: hidden;
    float: right;
    margin-right: 100px;
    .searchInput{
      width: 450px;
      float: left;
    }
    .pageBox{
      float: right;
      margin: 20px 0; 
    }
  }
  .saleCountWindow{
    position: fixed;
    background-color: #E5E8ED;
    width: calc(100% - 240px);
    min-height:calc(100vh - 160px);
    left: 200px;
    top:60px;
    z-index: 1000;
    padding: 70px 20px 20px;
    margin-bottom: 10px;
    .redTitle{
      color: #9e2020;
    }
    .closeBtn{
      font-size:24px;
      float:right;
      cursor: pointer;
    }
    .title{
      margin-bottom: 15px;
      text-align: left;
      font-size: 18px;
      color: #4e749a;
    }
    .saleCountTable-box{
      height: calc(100vh - 280px);
      margin-bottom: 15px;
      .saleCountTable{
        width: 100%;
      }
    }
    
  }
  .saleCountInfo{
    border-bottom: #4e749a 1px solid;
    li{
      overflow: hidden;
      line-height: 40px;
      border: #4e749a 1px solid;
      border-bottom: none;
      background-color: #ffffc7;
      display: flex;
      justify-content: center;
      align-items: center;
      .saleCountInfoTitle{   
        flex: 3;
      }
      .saleCountInfoContent{
        flex: 7;
        border-left: #4e749a 1px solid;
        background-color: #e4f3c2;
        padding: 0 10px;
      }
    }
  }  
  .saleCount-enter-active, .saleCount-leave-active {
    transition: all .5s;
  }
  .saleCount-enter, .saleCount-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .redTitle{
    color: #e6afaf;
  }
  .goods-head{
    overflow: hidden;
    .head-tag{
      float: left;
      overflow: hidden;
      border: 1px solid #ABB2C0;
      border-radius: 3px;
    }
    .tag{
      padding: 10px 60px;
      background-color: white;
      float: left;
      cursor: pointer;
      font-size: 16px;
    }
    .activeTag{
      //background-color: #4181FE;
      background-color: #4181FE;
      color: white;
    }
  }
  .depotShow{
    margin-top: 20px;
  }
  .collocationWindow{
    position: fixed;
    background-color: #E5E8ED;
    width: calc(100% - 240px);
    min-height:calc(100vh - 140px);
    left: 200px;
    top:60px;
    z-index: 1000;
    padding: 70px 20px 20px; 
    .collocation-head{
      overflow: hidden;
      p{
        font-size: 18px;
        line-height: 40px;
        text-align: left;
        width: 300px;
        float: left;
      }
    }
    .collocation-body{
      margin-top: 20px;
    }
  }
  .operateBox{
    display: flex;
    justify-content: center;
    align-items: center;
    .operateBtn{
      padding: 0 5px;
      border-radius: 5px;
      margin: 0 5px;
      line-height: 25px;
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
  }
  .collocationPanel,.saleCountPanel{
    background: white;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 5px;
    overflow-y: auto;
  }
  .returnPrev{
      position: absolute;
      top: 20px;
      line-height: 30px;
      font-size: 18px;
      color: #4181FE;
      text-indent: 25px;
      background: url(../../../assets/img/fanhui.png) left center no-repeat;
      background-size: 18px 18px;
      cursor: pointer;
  }
  .saleCountPanel{
    padding-bottom: 0;
  }
}
</style>
