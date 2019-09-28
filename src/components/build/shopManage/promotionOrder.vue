<template>
  <div class="promotionOrder">
    <div class="content-panel">
      <el-table
        :data="record"
        :highlight-current-row="true"
        height="740"
        style="width:98%;margin:10px auto;">
        <el-table-column prop="pageIndex" align="center" label="序号" width="80px"></el-table-column>
        <el-table-column prop="orderNo" align="center" label="订单编号" width="230px"></el-table-column>
        <el-table-column prop="payTime" align="center" label="预购时间"></el-table-column>
        <el-table-column prop="title" align="left" label="名称" width="300px"></el-table-column>

        <el-table-column align="center" label="单价">
          <template slot-scope="scope">
            <span>￥{{(scope.row.price/100).toFixed(2)}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="count" align="center" label="购买数量"></el-table-column>

        <el-table-column align="center" label="订单总金额">
          <template slot-scope="scope">
            <span>￥{{(scope.row.totalFee/100).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <div style="padding:10px 0;">
              <span v-if="scope.row.status == 1">已支付</span>
              <span v-else-if="scope.row.status == 0">未支付</span>
              <span v-else>已取消</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-right:30px;"
        background
        layout="prev, pager, next, jumper"
        :total="totalPage"
        :current-page.sync="currentPage"
        @current-change="changePage">
        
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'promotionOrder',
  data () {
    return {
      record: [],
      totalPage : 1,
      currentPage : 1
    }
  },
  methods:{
    loadData(){
      this.$http.get("/szmktuser/order/storePmtOrderList?page=" + this.currentPage +"&rows=10&storeId=" + this.$store.state.loginInfo.storeId).then(res=>{
        if(res.data.code == 1000){
          this.record = res.data.data.list;
          this.totalPage = res.data.data.totalPage*10;
          this.record.forEach((item,index) =>{
            item.pageIndex = index + 1 + (this.currentDepotPage-1)*10;
          })
          this.formatDate();
        }else{
          this.$message({type: 'error',message: res.data.message});
        }
      })
    },
    changePage(){
      this.loadData();
    },
    formatDate(){
      this.record.forEach((item,index)=>{
        let date = new Date(item.payTime);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        let day = date.getDate()  < 10 ? "0" + date.getDate()  : date.getDate();
        let hour = date.getHours()  < 10 ? "0" + date.getHours()  : date.getHours();
        let min = date.getMinutes()  < 10 ? "0" + date.getMinutes()  : date.getMinutes();
        let second = date.getSeconds()  < 10 ? "0" + date.getSeconds()  : date.getSeconds();
        item.pageIndex = index + 1 + (this.currentPage - 1)*10;
        item.payTime = year + "-" + month + "-"+ day + " "  + hour + ":"+ min + ":" + second;
      })
    }
  },
  created(){
    this.loadData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
.promotionOrder{
  position: relative;
  background-color: #E5E8ED;
  .content-panel{
    background-color: white;
    padding:10px;
    margin: 15px;
    border-radius: 5px;
    overflow: hidden;
  }
  .el-table thead th{
    background-color: #F5F7FB;
  }
}
</style>
