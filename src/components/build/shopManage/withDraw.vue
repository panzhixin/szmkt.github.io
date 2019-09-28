<template>
  <div class="withDraw">
    <div class="content-panel">
        <div class="header">
            <p class="item">
                <span class="title">余额：</span><span class="content" style="margin-right:20px;">￥{{balance}}</span>
                <span class="title">提现中：</span><span class="content">￥{{withdraw}}</span>
            </p>
            <el-button type="primary" class="withdrawBtn" @click="getMoneyOut" >提现</el-button>
        </div>
        <div class="body">
            <el-table
                :data="record"
                height="645"
                :highlight-current-row="true"
                style="width: 96%;margin:10px auto;">
                <el-table-column align="center" label="序号" prop="pageIndex" width="100px"></el-table-column>
                <el-table-column align="center" label="时间">
                    <template slot-scope="scope">
                        {{scope.row.applyTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="金额">
                    <template slot-scope="scope">
                        <span class="moneyItem">￥{{(scope.row.amount/100).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" style="color:#FF8F32;padding:15px 0;"><i class="el-icon-warning"></i>待审核</span>
                        <span v-else-if="scope.row.status == 1" style="color:#26BD75;padding:15px 0;"><i class="el-icon-success"></i>已提现</span>
                        <span v-else style="color:#FF6B6B;padding:15px 0;"><i class="el-icon-error"></i>被拒绝</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button v-if="scope.row.status == 2"  type="text" @click="watchReason(scope.row)" style="padding:0;">查看原因</el-button>
                        <span v-else>-</span> -->
                        <span class="operateBox">
                            <span v-if="scope.row.status == 2" class="operateBtn errorBtn"  @click="watchReason(scope.row)">查看原因</span>
                            <span v-else>-</span>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                style="margin:15px 30px 0 0;"
                background
                layout="prev, pager, next,jumper"
                :current-page.sync="currentPage"
                :total="totalPages"
                @current-change="changePage">
            </el-pagination>
        </div>
    </div>
    <el-dialog 
        title="提现"
        :visible.sync="withDrawStatus"
        :close-on-click-modal="false"
        width="600px"
        class="withDrawWindow">
        <p>余额：{{balance}}元</p>
        <el-form label-width="200px" style="width:96%;margin:0 auto;" :rules="rules" :model="outMoney">
            <el-form-item label="本次提现金额(元)：" prop="money">
                <el-input v-model="outMoney.money" @keyup.native="number"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:200px;margin: 20px 0 0 0;float:left;" @click="submit" :disabled="outDis">提交</el-button>
            </el-form-item>       
        </el-form>
    </el-dialog>

    <el-dialog 
    title="提现失败原因"
    :visible.sync="refuseReasonStatus"
    width="30%">
    <p>{{refuseReasonDetail}}</p>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'withDraw',
  data () {
    var validatePrice = (rule, value, callback) => {
        var  reg = /^(-?\d+)(\.\d{1,2})?$/;
        if(!reg.test(value)){
          callback(new Error('请输入最多两位小数点的数字'));
        }
    };
    return {
        outDis : false,
        balance : 0,
        withdraw : 0,
        withDrawStatus :false,
        refuseReasonStatus : false,
        refuseReasonDetail : "",
        outMoney : {
            money : ""
        },
        record:[],
        totalPages : 10,
        rules :{
            money : [
                {required : true,message : '请输入提现金额',trigger : 'blur'},
                { validator: validatePrice, trigger: 'blur' }
            ]
        },
        currentPage : 1
    }
  },
  methods:{
      //打开提现窗口
      getMoneyOut(){
          this.outMoney.money = "";
          let account = this.$store.state.account;
          this.outDis = false;
          if(account.name == ""){
              this.$message({
                  message : "对不起，您还未绑定账户，请先绑定账户再提现",
                  type : "warning"
              })
          }else{
              this.withDrawStatus = true;
          }
      },
      //提交提现申请
      submit(){
          let balance = parseInt(this.balance*100),
              outMoney = parseInt(this.outMoney.money*100);
          var reg = /^(-?\d+)(\.\d{1,2})?$/;
          
          if(this.balance == 0){
            this.$message({
                message : "当前账户余额为0，无法提现！",
                type : "warning"
            });
            this.withDrawStatus = false;
            this.outMoney.money = "";
            return;
          }
          if(this.outMoney.money == ""){
            this.$message({message : "提现金额不能为空！",type : "warning"});
            return;
          }
          if((this.outMoney.money - 0) < 0){
            this.$message({message : "提现金额不能为负数！",type : "warning"});
            this.outMoney.money = "";
            return;
          }
          if(!reg.test(this.outMoney.money)){
            this.$message({message : "提现金额应为数字且小数点后最多两位！",type : "error"});
            this.outMoney.money = "";
            return; 
          }
          if(outMoney > balance){
            this.$message({message : "提现金额不得多于余额,请重新填写！",type : "error"});
            this.outMoney.money = "";
          }else{
            this.$http.get("szmktbackstage/storeWithdraw/apply?money=" + Math.round(this.outMoney.money*100) + "&userid=" +  this.$store.state.loginInfo.userId).then(res=>{
                if(res.data.code == 1000){
                    this.$message({message : "提交成功，请耐心等待审批",type : "success"});
                    this.outDis = true;
                    this.withDrawStatus = false;
                    this.currentPage = 1;
                    this.loadRecord();
                    this.loadMoney();
                }else{
                    this.$message({message : res.data.message,type : "error"});
                    this.withDrawStatus = false;
                    this.outMoney.money = "";
                    this.loadMoney();
                }        
            }).catch(err=>{
                console.log(err);
            })
          }
      },
      //加载提现记录
      loadRecord(){
          this.$http.get("szmktbackstage/storeWithdraw/my/page?userid=" + this.$store.state.loginInfo.userId + "&page=0&size=10").then(res=>{
                if(res.data.code == 1000){
                    this.record = res.data.data.content;
                    this.totalPages = res.data.data.totalPages*10;
                    this.currentPage = 1;
                    this.formatDate();
                }else{
                    this.$message({type: 'error',message: res.data.message});
                }
          }).catch(err=>{
                console.log(err);
          })
      },
      //查看失败原因
      watchReason(row){
          this.refuseReasonDetail = row.refuseReason;
          this.refuseReasonStatus = true;
      },
      //提现列表翻页
      changePage(index){
          this.$http.get("szmktbackstage/storeWithdraw/my/page?userid=" + this.$store.state.loginInfo.userId + "&page=" + (index-1) +"&size=10").then(res=>{
                if(res.data.code == 1000){
                    this.record = res.data.data.content;
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
              let date = new Date(item.applyTime);
              let year = date.getFullYear();
              let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
              let day = date.getDate()  < 10 ? "0" + date.getDate()  : date.getDate();
              let hour = date.getHours()  < 10 ? "0" + date.getHours()  : date.getHours();
              let min = date.getMinutes()  < 10 ? "0" + date.getMinutes()  : date.getMinutes();
              let second = date.getSeconds()  < 10 ? "0" + date.getSeconds()  : date.getSeconds();
              item.applyTime = year + "-" + month + "-"+ day + " "  + hour + ":"+ min + ":" + second;
              item.pageIndex = index + 1 + (this.currentPage - 1)*10;
          })
      },
      loadMoney(){
        this.$http.get("szmktbackstage/storeWithdraw/balance?userid=" + this.$store.state.loginInfo.userId).then(res=>{
          if(res.data.code == 1000){
              if(res.data.data.balance != 0){
                this.balance = (res.data.data.balance/100).toFixed(2);
              }else{
                this.balance = (res.data.data.balance/100);  
              }
              if(res.data.data.inWithdraw != 0){
                this.withdraw = (res.data.data.inWithdraw/100).toFixed(2);
              }else{
                this.withdraw = (res.data.data.inWithdraw/100);
              }
          }else{
            this.$message({type: 'error',message: res.data.message});
          }
        }).catch(err=>{
            console.log(err);
        })
      },
      number(){
        var reg = /^(-?\d+)(\.\d{1,2})?$/;
         if(!reg.test(this.outMoney.money - 0)){
          this.outMoney.money = "";
        }else if(this.outMoney.money - 0  < 0){
          this.outMoney.money = "";
        }
      }
  },
  created(){
      this.loadMoney();
      this.loadRecord();
      this.$store.commit("changeHeaderShow",false);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
.withDraw{
    .header{
        margin: 20px 0 20px 30px;
        overflow: hidden;
        p{
            display: inline-block;
            width: 500px;
            line-height: 60px;
            font-size: 18px;
            text-align: left;
            float: left;
            .content{
                text-align: left;
                color: #f38787;
            }
        }
        .withdrawBtn{
            width: 100px;
            height: 40px;
            margin: 10px 30px;
            float: right;
        }
    }
    .recordTitle{
        font-size: 24px;
        line-height: 40px;
    }
    .withDrawWindow{
        p{
            font-size: 24px;
            margin-bottom: 20px;
        }
    }
    .red{
        color:#e6afaf;
    }
    .operateBox{
        display: flex;
        justify-content: center;
        align-items: center;
        padding:5px 0;
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

        .errorBtn:hover{
            background-color: #FF6B6B;
            color: white;
        }
    }
    .content-panel{
        min-height: calc(100vh - 90px);
        min-width: 1000px;
        background-color: white;
        box-sizing: border-box;
        margin: 15px;
        overflow: hidden;
        border-radius: 5px;
    }
}
</style>
