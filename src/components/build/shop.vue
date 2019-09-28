<template>
  <div class="shop">
    <nav class="nav">
        <div class="navBox">
            <div class="userInfo">
                <p class="userTitle">欢迎您，</p>
                <p class="user">{{user}}</p>
                <p :class=" changeActive ? ['active','changePass'] : ['changePass'] " @click="changePassword">修改密码</p>
            </div>
            <el-col>
                <el-menu
                :default-active="showShopItem"
                class="el-menu-vertical-demo"
                background-color="#4e749a"
                text-color="#fff"
                active-text-color="#ffd04b">
                    <el-menu-item @click="goItem('0')" index="0">
                        <i class="iconfont icon-shangpinguanli"></i>
                        <span slot="title">商品管理</span>
                    </el-menu-item>
                    <el-submenu index="1">
                        <template slot="title">
                            <span class="new" v-show="isShowNew">new</span>
                            <i class="iconfont icon-tubiao_dingdanguanli"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="1-0" @click="order('0')">商品订单<span class="num" v-show="isShowTag">{{OrderNum}}</span></el-menu-item>
                            <el-menu-item index="1-1" @click="order('1')">促销品预购</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item @click="goItem('2')" index="2">
                        <i class="el-icon-edit"></i>
                        <span slot="title">品牌装修</span>
                    </el-menu-item>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="iconfont icon-caiwuguanli"></i>
                            <span>财务管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="3-0" @click="finance('0')">流水记录</el-menu-item>
                            <el-menu-item index="3-1" @click="finance('1')">银行绑定</el-menu-item>
                            <el-menu-item index="3-2" @click="finance('2')">提现管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item @click="goItem('4')" index="4">
                        <i class="iconfont icon-liwuhuodong"></i>
                        <span slot="title">促销品广场</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </div>
    </nav>
    <header class="header">当前位置：<span class="location">{{location}}</span>
    <span class="exit" @click="exitLogin">退出登录</span></header>
    <!-- <transition name="fade"> -->
    <router-view/>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'shop',
  data () {
    return {
        user : "",
        changeActive : false,
        menu : ['商品管理','订单管理','品牌装修','财务管理',"促销品广场"],
        itemRouter : ["goods","order","decoration","","promotion"],
        financeRouter : ["runningAccount","bankBinding","withdraw"],
        financemenu : ['流水记录','银行绑定','提现管理'],
        ordermenu : ["商品订单","促销品预购"],
        orderRouter : ["order","promotionOrder"]
    }
  },
  computed:{
      location(){
        return this.$store.state.shopNavTitle || "商品管理";
      },
      showShopItem(){
        return this.$store.state.activeShopItem + "";
      },
      OrderNum(){
        if(parseInt(this.$store.state.handleOrderNum) < 100){
            return this.$store.state.handleOrderNum;
        }else{
            return "99+";
        }
      },
      isShowTag(){
        if(parseInt(this.$store.state.handleOrderNum) == 0){
            return false;
        }else{
            return true;
        }
      },
      isShowNew(){
        if(parseInt(this.$store.state.handleOrderNum) > 0 && this.$store.state.handleOrderNew){
            return true;
        }else{
            return false;
        } 
      }
  },
  methods: {
    //选择左侧导航栏的一项
    goItem(index){
        index = parseInt(index);
        this.changeActive = false;
        this.$store.commit("changeGoodsPage",1);
        this.$store.commit("changeShopNavTitle",this.menu[index]);
        this.$store.commit("changeActiveShopItem",index + "");
        this.$router.push({
            name : this.itemRouter[index],
        });
    },
    //跳转至修改密码页面
    changePassword(){
        this.changeActive = true;
        this.$store.commit("changeShopNavTitle","修改密码");
        this.$store.commit("changeActiveShopItem",this.$store.state.activeShopItem);
        this.$router.push({
            name : 'changePassword',
        })
    },
    //跳转至财务管理
    finance(index){
        this.changeActive = false;
        this.$store.commit("changeShopNavTitle","财务管理-"+this.financemenu[index]);
        this.$store.commit("changeActiveShopItem","3");
        this.$router.push({
            name : this.financeRouter[index],
        })
    },
    //跳转至订单管理
    order(index){
        if(index == 0){
            this.getOrderNum();
            this.$store.commit("changeHandleOrderNew");
        }
        this.changeActive = false;
        this.$store.commit("changeShopNavTitle","订单管理-"+this.ordermenu[index]);
        this.$store.commit("changeActiveShopItem","1");
        this.$router.push({
            name : this.orderRouter[index],
        })
    },
    //退出登录
    exitLogin(){
        this.$confirm('是否退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit("changeGoodsPage",1);
          this.$store.commit("changeIsShowNav",true);
          this.$message({
            type: 'info',
            message: '退出成功!',
            duration : 1000
          });
          this.$router.push({
              name : "login"
          });
          this.$store.commit("changeHeaderShow",true);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
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
  mounted(){
    let firstEnter = this.$store.state.firstEnter;
    this.user = this.$store.state.loginInfo.storeName;
    this.getOrderNum();
  }
}
</script>

<style scoped  lang="less">
.shop{
    padding: 60px 0 0 200px;
    overflow: auto;
    width: calc(100% - 200px);
    height: calc(100vh - 60px);
    background-color: #E5E8ED;
    position:relative;
    //z-index: 2000;
    .header{
        width: 100%;
        height: 59px;
        background-color: white;
        line-height: 59px;
        text-align: left;
        text-indent: 220px;
        font-size: 18px;
        color: #ABB2C0;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        border-bottom: #dcdfe6 1px solid;
        .exit{
            position: absolute;
            text-indent: 0;
            width: 88px;
            text-align: right;
            right: 20px;
            font-size: 16px;
            cursor: pointer;
            color: #4181FE;
            background: url(../../assets/img/exit.png) center left no-repeat;
            background-size: 20px 20px;
        }
        .exit:hover{
            text-decoration: underline;
        }
        .location{
            color: #4181FE;
        }
    }
    .nav{
        position: fixed;
        top:0;
        left: 0;
        width: 200px;
        height: 100vh;
        background-color: #202E54;
        box-sizing: border-box;
        z-index: 500;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .navBox{
        width: 100%;
    }
    .nav:before{
        content: "";
        display: block;
        width: 0.02rem;
        height: 100%;
        background-color: #ffffff;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 500;
    }
    .userInfo{
        width: 100%;
        color: #fff;
        padding-bottom: 50px;
        .userTitle{
           font-size: 20px;
           margin-top: 20px;
           text-align: left;
           text-indent: 20px;
           line-height: 30px;
        }
        .user{
            width: 160px;
            box-sizing: border-box;
            border-radius: 5px;
            font-size: 20px;
            margin : 15px 20px;
            line-height: 40px;
            font-weight: bold;
            padding:10px;
            background-color: white;
            color: #4181FE;
        }
        .changePass{
            font-size: 18px;
            line-height: 20px;
            text-align: left;
            text-indent: 20px;
            cursor: pointer;
            color: #ABB2C0;
        }
        .changePass:hover,.active{
            text-decoration: underline;
            color: red;
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: all .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
}
.el-menu-item{
    text-align: left;
    padding-left: 30px !important;
    position: relative;
    .num{
        position: absolute;
        width: 32px;
        line-height: 20px;
        border-radius: 10px;
        right: 50px;
        top: 17px;
        background-color: #ef2828;
        color: white !important;
        text-decoration: none;
    } 
}
@keyframes twinkling {
    from{
        opacity: 0.1;
    }
    to{
        opacity: 1;
    }
}

@webkit-keyframes twinkling {
    from{
         opacity: 0.1;
    }
    to{
        opacity: 1;
    }
}
.el-submenu__title{
    text-align: left;
    padding-left: 0 !important;
    .new{
        position: absolute;
        text-align: center;
        width: 35px;
        line-height: 20px;
        border-radius: 10px;
        left: 130px;
        top: 22px;
        background-color: #da2828;
        text-decoration: none;
        animation: twinkling 1s alternate;
        -webkit-animation: twinkling 1s alternate;
        animation-iteration-count: infinite;
        -webkit-animation-iteration-count: infinite; 
    }
}
</style>
