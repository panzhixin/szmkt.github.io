<template>
  <div class="bankBinding">
    <div class="content-panel"> 
        <div class="formBox">
            <el-form label-width="120px" :model="bankCount" :rules="rules">
                <el-form-item label="开户名称" prop="accountName">
                    <el-input v-model="bankCount.accountName" :disabled="inputDis"></el-input>
                </el-form-item>
                <el-form-item label="开户银行" prop="bankName">
                    <el-tooltip class="item" effect="dark" content="开户银行的名称" placement="right">
                        <el-input v-model="bankCount.bankName" :disabled="inputDis"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="开户支行" prop="subBranch">
                    <el-tooltip class="item" effect="dark" content="开户银行的支行名称" placement="right">
                        <el-input v-model="bankCount.subBranch" :disabled="inputDis"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="银行账户" prop="account" style="position:relative">
                    <el-tooltip class="item" effect="dark" content="开户银行的银行账户" placement="right" >
                        <el-input 
                        v-model="bankCount.account" 
                        :disabled="inputDis" 
                        maxlength="24"
                        @keyup.native="isNumber"
                        @blur="blurAccount" 
                        @focus="focusAccount"></el-input>   
                    </el-tooltip>
                    <div class="accountTip" v-show="isShowAccount">
                        <p>{{num}}</p>
                    </div>
                </el-form-item>
                <el-form-item class="btnBox">
                    <el-button 
                        type="primary" 
                        class="btn" 
                        style="margin-right:30px;width:130px;" 
                        @click="changeEdit">{{btnTxt}}</el-button>
                    <el-button 
                        type="primary" 
                        style="width:130px;" 
                        @click="save"
                        v-if="!saveDis"
                    >保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    var validateBank = (rule, value, callback) => {
        var bankReg = /^(\d{16}|\d{19})$/;
        if (!bankReg.test(value)){
          callback(new Error('银行账号应为16或19位数字'));
        }else{
          callback();
        }
    }
    return {
        isShowAccount : false,
        saveDis : true,
        bankCount :{
            accountName : "",
            bankName : "",
            subBranch : "",
            account : "", 
        },
        inputDis : true,
        btnTxt : "编辑",
        rules :{
            accountName:[
                { required: true, message: '请输入开户名称', trigger: 'blur' },
            ],
            bankName:[
                { required: true, message: '请输入开户银行', trigger: 'blur' },
            ],
            subBranch:[
                { required: true, message: '请输入开户支行', trigger: 'blur' },
            ],
            account:[
                { required: true, message: '请输入银行账户', trigger: 'blur' },
                {max:24,min:12, message: '银行账户号码应在12到24位', trigger: 'blur' }
            ]
        }
    } 
  },
  computed : {
    num(){
       let num = "";
       for(let i = 0; i < Math.ceil(this.bankCount.account.length/4);i++){
           num += this.bankCount.account.substr(0 + i*4 ,4) + " ";
       }
       return num;
    }
  },
  methods: {
    //改变编辑状态
    changeEdit(){
        if(this.btnTxt == "编辑"){
            this.btnTxt = "取消编辑";
            this.inputDis = false;
            this.saveDis = false;
        }else{
            this.btnTxt = "编辑";
            this.inputDis = true;
            this.saveDis = true;
            this.isShowAccount = false;
        }
    },
    //保存银行绑定信息
    save(){
        var reg = /^[0-9]*$/;
        if(this.bankCount.accountName == ""){
            this.$message({type:"warning",message:"开户名称不能为空"});
            return;
        }
        if(!this.$filterWord(this.bankCount.accountName,this.$store.state.filterList)){
            this.$message({type:"error",message:"开户名称包含敏感词汇，请重试"});
            return;
        }
        if(this.bankCount.bankName == ""){
           this.$message({type:"warning",message:"开户银行不能为空"});
            return; 
        }
         if(!this.$filterWord(this.bankCount.bankName,this.$store.state.filterList)){
            this.$message({type:"error",message:"开户银行包含敏感词汇，请重试"});
            return;
        }
        if(this.bankCount.subBranch == ""){
            this.$message({type:"warning",message:"开户支行不能为空"});
            return;
        }
        if(!this.$filterWord(this.bankCount.subBranch,this.$store.state.filterList)){
            this.$message({type:"error",message:"开户支行包含敏感词汇，请重试"});
            return;
        }
        if(this.bankCount.account == ""){
            this.$message({type:"warning",message:"银行账户不能为空"});
            return;
        }
        if(this.bankCount.account.length < 12 || this.bankCount.account.length > 24){
            this.$message({type:"warning",message:"银行账户应大于等于12位且小于等于24位"});
            return;
        }
        if(this.inputDis == false){
            this.$confirm('温馨提示：账户信息涉及财产安全，请谨慎填写，是否确认填写无误？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {          
                this.$http.post("szmktstore/storeInfo/bankInfo/save?userid="+this.$store.state.loginInfo.userId ,this.bankCount).then(res=>{
                    //console.log(res);
                    if(res.data.code == 1000){
                        this.saveDis = true;
                        this.$store.commit("updateAccount",this.bankCount);
                        this.$message({
                            type : "success",
                            message : "保存成功!"
                        })
                        this.btnTxt = "编辑";
                        this.inputDis = true;
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消保存'
                });          
            });
        }else{
            this.$message({
                type : "info",
                message : "请确定在可编辑情况下提交!"
            })
        }
    },
    //加载已绑定的银行信息
    loadInfo(){
        this.$http.get("szmktstore/storeInfo/bankInfo?userid=" + this.$store.state.loginInfo.userId).then(res=>{
            if(res.data.code == 1000){
                this.bankCount = res.data.data;
            }else{
                this.$message({
                    type : "info",
                    message : "您尚未绑定银行"
                })
            }
        }).catch(err=>{
            console.log(err);
        })
    },
    blurAccount(){
        this.isShowAccount = false;
    },
    focusAccount(){
        this.isShowAccount = true;
    },
    isNumber(){
        var bankReg = /^[1-9]\d*|0$/;
        if(isNaN(this.bankCount.account)){
           this.bankCount.account = "";
        }else if(!bankReg.test(this.bankCount.account - 0)){
           this.bankCount.account = "";
        }else if(this.bankCount.account.indexOf(".") != -1){
           this.bankCount.account = "";
        }
    }
  },
  created(){
    this.loadInfo();
    this.$store.commit("changeHeaderShow",false);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
.bankBinding{
    .header{
        overflow: hidden;
        .btn{
            float: right;
            margin: 50px 150px 0 0;
        }
    }
    .formBox{
        width: 560px;
        margin: 100px auto;
    }
    .accountTip{
        position: absolute;
        z-index: 200;
        top: 41px;
        right: 0;
        width: 440px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        text-indent: 0.3rem;
        font-size: 20px;
        font-weight: bold;
        background-color: #b7d0ea;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .btnBox{
        overflow: hidden;
        margin-top: 50px;
        .el-button{
            float: left;
        }
    }
    .content-panel{
        min-height: calc(100vh - 90px);
        background-color: white;
        box-sizing: border-box;
        margin: 15px;
        overflow: hidden;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
