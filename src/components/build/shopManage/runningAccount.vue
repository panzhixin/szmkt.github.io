<template>
  <div class="runningAccount">
    <div class="content-panel">
      <el-table
        :data="record"
        :highlight-current-row="true"
        height="700"
        style="width:98%;margin:40px auto 15px;">
        <el-table-column prop="pageIndex" align="center" label="序号" width="120px"></el-table-column>
        <el-table-column prop="orderNo" align="center" label="订单编号"></el-table-column>
        <el-table-column prop="time" align="center" label="时间"></el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">商品售出</span>
            <span v-else-if="scope.row.type == 1">赏金支付</span>
            <span v-else-if="scope.row.type == 2">售出促销品</span>
            <span v-else-if="scope.row.type == 3">预定促销品</span>
            <span v-else-if="scope.row.type == 4">优惠券减免</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="name" align="center" label="名称"></el-table-column> -->
        <el-table-column align="center" label="订单总金额">
          <template slot-scope="scope">
            <span>￥{{(scope.row.total/100).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="佣金金额">
          <template slot-scope="scope">
            <span style="display:block;padding:8px 0;">￥{{(scope.row.divide/100).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0" class="inWallet">+{{(scope.row.income/100).toFixed(2)}}</span>
            <span v-if="scope.row.type == 1" class="outWallet" >-{{(scope.row.income/100).toFixed(2)}}</span>
            <span v-if="scope.row.type == 2" class="inWallet">+{{(scope.row.income/100).toFixed(2)}}</span>
            <span v-if="scope.row.type == 3" class="outWallet">-{{(scope.row.income/100).toFixed(2)}}</span>
            <span v-if="scope.row.type == 4" class="outWallet">-{{(scope.row.income/100).toFixed(2)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-right:20px;"
        background
        layout="prev, pager, next ,jumper"
        :total="totalPage"
        :current-page.sync="currentPage"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'runningAccount',
  data () {
    return {
        record: [],
        totalPage : 1,
        currentPage : 1
    }
  },
  methods:{
    //翻页事件
    changePage(index){
      this.$http.get("/szmktuser/order/querystorera?page=" + index +"&rows=10&storeid=" + this.$store.state.loginInfo.storeId).then(res=>{
        if(res.data.code == 1000){
          this.record = res.data.data.list;
          this.formatDate();
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //格式化日期
    formatDate(){
      this.record.forEach((item,index)=>{
        let date = new Date(item.time);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        let day = date.getDate()  < 10 ? "0" + date.getDate()  : date.getDate();
        let hour = date.getHours()  < 10 ? "0" + date.getHours()  : date.getHours();
        let min = date.getMinutes()  < 10 ? "0" + date.getMinutes()  : date.getMinutes();
        let second = date.getSeconds()  < 10 ? "0" + date.getSeconds()  : date.getSeconds();
        item.pageIndex = index + 1 + (this.currentPage - 1)*10;
        item.time = year + "-" + month + "-"+ day + " "  + hour + ":"+ min + ":" + second;
      })
    }
  },
  created(){
    //加载流水记录列表
    this.$store.commit("changeHeaderShow",false);
    this.$http.get("/szmktuser/order/querystorera?page=1&rows=10&storeid=" + this.$store.state.loginInfo.storeId).then(res=>{
      if(res.data.code == 1000){
        this.record = res.data.data.list;
        this.totalPage = res.data.data.totalPage*10;
        this.formatDate();
      }else{
        this.$message({type: 'error',message: res.data.message});
      }
    }).catch(err=>{
      console.log(err);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
.runningAccount{
    padding: 15px 20px;
    .outWallet{
      color: #FF6B6B;
    }
    .inWallet{
      color: #26BD75;
    }
    .content-panel{
        background-color: white;
        box-sizing: border-box;
        margin-bottom: 10px;
        overflow: hidden;
        border-radius: 5px;
        padding: 10px 0;
    }
}
</style>
