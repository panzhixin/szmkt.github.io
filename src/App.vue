<template>
  <div id="app" :class="isShowHeader == false ? '' : 'showBg' ">
    <div class="appHeader" v-show="isShowHeader">
      <div class="header-content">
        <div class="header-left">
          <div class="logo" @click="goHome">
            <img src="./assets/img/logo.png"/>
          </div>
        </div>
        <div class="header-right">
          <div class="nav">
            <div :class="['nav-item',navActive == 0 ? 'active' : '']" @click="changeItem(0)">首页</div>
            <div :class="['nav-item',navActive == 1 ? 'active' : '']" @click="changeItem(1)">商家入驻</div>
            <div :class="['nav-item',navActive == 2 ? 'active' : '']" @click="changeItem(2)">店铺登录</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="appBody">
      <router-view/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      logoTxt : "神州集市",
    }
  },
  computed :{
    loading(){
      return this.$store.state.firstLoad;
    },
    isShowFirstNav(){
      return this.$store.state.isShowNav;
    },
    navActive(){
      return this.$store.state.navActive;
    },
    isShowHeader(){
      return this.$store.state.isShowHeader;
    }
  },
  methods:{
    //上方导航栏地址跳转
    changeItem(index){
      if(index == 0){
        //跳转到官网首页
        window.location.href = this.$filePath.gwPath;
      }else if(index == 1){
        window.location.href = this.$filePath.enterPath;
        // this.$router.push({name : "openShop"});
      }else if(index == 2){
        this.$router.push({name : "login"});
      }
    },
    goHome(){
      window.location.href = this.$filePath.gwPath;
    }
  },
  mounted(){
    this.$store.commit("changeFirstLoad");
    this.$http.get("/szmktbackstage/sensitive/all").then(res=>{
      if(res.data.code == 1000){
        this.$store.commit("changeFilterList",res.data.data);
      }
    }).catch(err=>{
      console.log(err);
    })
  }
}
</script>

<style lang="less">
body{
  margin: 0;
  overflow-x: hidden;
  // background: url(./assets/img/bg.png) no-repeat;
  // background-size: 100% 100%;
}
.showBg{
  background: url(./assets/img/bg.png) no-repeat;
  background-size: 100% 100%;
}

body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
pre, /* text formatting elements 文本格式元素 */
form, fieldset, legend, button, input, textarea, /* form elements 表单元素 */
th, td /* table elements 表格元素 */ {
  margin: 0;
  padding: 0;
}
 
/** 设置默认字体 **/
body,
button, input, select, textarea /* for ie */ {
  font: 12px/1.5 tahoma, arial, \5b8b\4f53, sans-serif;
}
h1, h2, h3, h4, h5, h6 { font-size: 100%; }
address, cite, dfn, em, var { font-style: normal; } /* 将斜体扶正 */
code, kbd, pre, samp { font-family: courier new, courier, monospace; } /* 统一等宽字体 */
small { font-size: 12px; } /* 小于 12px 的中文很难阅读，让 small 正常化 */
 
/** 重置列表元素 **/
ul, ol { list-style: none; }
 
/** 重置文本格式元素 **/
a { text-decoration: none; }
a:hover { text-decoration: underline; }
 
 
/** 重置表单元素 **/
legend { color: #000; } /* for ie6 */
fieldset, img { border: 0; } /* img 搭车：让链接里的 img 无边框 */
button, input, select, textarea { font-size: 100%; } /* 使得表单元素在 ie 下能继承字体大小 */
/* 注：optgroup 无法扶正 */
 
/** 重置表格元素 **/
table { border-collapse: collapse; border-spacing: 0; }
 
/* 清除浮动 */
.ks-clear:after, .clear:after {
  content: '\20';
  display: block;
  height: 0;
  clear: both;
}
.ks-clear, .clear {
  *zoom: 1;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  min-height: 100vh; 
  color: #2c3e50;
  .appHeader{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 110px;
    background-color: #ffffff;
    z-index:100;
    //border-bottom: 1px solid #229397;
    .header-content{
      width: 1240px;  
      margin:  0 auto;
      .header-left{
        float: left;
        .logo{
          display: flex;
          height: 110px;
          justify-content: flex-start;
          align-items: center;
          cursor: pointer;
          span{
            font-size: 24px;
            color: #222;
            margin-left: 4px;
            font-weight: 500;
            width: 104px;
            text-align: right;
          }
        }  
      }
      .header-right{
        float: right;
        width: 360px;
        height: 36px;
        margin: 37px 0;
        margin-right: 110px;
        .nav{
          display: flex;
          .nav-item{
            flex: 1;
            font-size: 14px;
            line-height: 36px;
            border-left: 1px solid #b5b5b5;
            cursor: pointer;
          }
          .nav-item:nth-child(1){
            border: none;
          }
          .nav-item:hover,.active{
            color: #e6141f;
          }
        }
      }
    }
  }
  .appBody{
    position: relative;
  }

  .loading{
    width: 100%;
    height: 100vh;
    padding: 0;
    margin: 0;
  }

  .login,.resetPassword,.changePassword{
    .el-tabs__nav-scroll{
        padding-left: 70px;
    }
    .el-tabs__item.is-active{
      color: #F25664;
    }
    .el-tabs__active-bar{
      background-color: #F25664;
    }
    .el-tabs__item:hover{
      color: #F25664;
    }
  }

  .shopRegister{
    .el-form-item__label{
      font-size: 20px;
    }
    .el-select{
      float: left;
    }
    .el-icon-zoom-in{
      display: none;
    }
  }

  .uploadPhoto{
    .el-upload-list--picture-card .el-upload-list__item,.el-upload--picture-card{
        float: left;
    }
    .el-upload-list--picture-card{
      overflow:hidden;
    }
    .el-dialog{
      z-index: 10000;
    }
  }
  .shop{
    .el-menu-item i,.el-submenu__title i{
      color: #999  !important;
    }
    .is-active i,.is-active span{
      color: white;
    }
    .el-menu-item span{
      color:  #999;
    }
    .el-submenu__title{
      text-align: left;
      padding-left: 30px !important;
      background-color: #202E54 !important;
      color:  #999 !important;
    }
    .el-submenu__title span{
      color:  #999 !important;
    }
    .el-submenu__title .new{
      color:  white !important;
    }
    .el-submenu .el-menu-item{
      text-align: center;
      background-color: #202E54 !important;
      color:#999 !important;
    }
    .el-menu-item-group__title{
      background-color: #202E54 !important;
      .new{
        color: white !important;
      }
    }
    .el-submenu__icon-arrow{
        top: 55%;
        right: 0.3rem;
    }
    .el-submenu__title:hover{
      background-color: #4181FE !important;
      color:white !important;
    }
    .el-submenu__title:hover span,.el-submenu__title:hover i{
      color:white !important;
    }
    .el-menu-item{
      background-color: #202E54 !important;
    }
    .el-menu-item.is-active,.el-menu-item:hover{
      background-color: #4181FE !important;
      color:white !important;
    }
    .el-menu-item.is-active span,.el-menu-item.is-active i,.el-menu-item:hover span,.el-menu-item:hover i{
      color:white !important;
    }
    .el-submenu.is-active .el-submenu__title span,.el-submenu.is-active .el-submenu__title i{
      color:white !important;
    }
  }

  .scalePhoto{
    .el-dialog{
      margin-top: 5vh !important;
    }
  }
  .el-upload-list--picture-card .el-upload-list__item-status-label{
    display:none;
  }
  
  .drainageList{
      .el-alert__title{
        font-size: 18px;
      }
      .el-alert .el-alert__description{
        font-size: 16px;
      }
      .el-alert__content{
        text-align: left;
        padding: 0 .05rem;
      }
      .el-alert.is-center{
        justify-content: flex-start;
        margin: 5px 0;
      }
      .drainageDetailDialog{
        .el-upload--picture-card{
          display: none;
        }
      }
      .el-alert:nth-child(4){
        img{
          max-width:720px;
        }
      }
      .el-dialog__body{
        padding: 0.2rem;
      }
      .detailBox-detail{
        img{
          max-width:472px;
        }
      }
  }
  .el-input.is-disabled .el-input__inner{
    color: #595d65;
  }
  .el-radio{
    margin: 0 10px 10px 0;
    float: left;
  }
  .el-dialog__header{
    border-bottom: 1px solid #8baed4;
  }
  .el-pagination{
    margin:0 auto;
    padding: 15px 0;
  }
  .current-row td,.hover-row td{
    background-color: rgba(255,143,50,0.10);;
  }
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
    background-color: #ffffff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    color: #409EFF;
  }
  .el-loading-spinner{
    top:45vh;
  }
  .drainageDetailDialog{
    .el-upload-list--picture-card .el-upload-list__item-actions,
    .el-upload-list--picture-card .el-upload-list__item-actions span,
    .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete{
      display: none;
    }
  }
  .hide{
    .el-upload--picture-card{
      display: none;
    }
  }
  .paginationBox{
    .el-pagination{
      margin: 10px auto 0;
    }
  }
  .buyPromotion{
    .detail-content{
      img{
        max-width: calc(100vw - 700px);
      }
    }
  }
  .searchInput{
    .el-input-group__append:first-child, .el-input-group__prepend:first-child{
      width: 70px;
    }
    .el-input-group__append:last-child, .el-input-group__prepend:last-child{
      background-color: #409eff;
    }
    .el-icon-search{
      color:white;
    }
  }
  .decoration{
    .el-upload--picture-card{
        background-color: #EFF1F6;
        border: 0.02rem solid #c0ccda;
    }
    .uploadPhoto .header{
      display: none;
    }
    .el-icon-plus{
        position: relative;
      }
    .logoPhoto{
      .el-icon-plus:after{
        content: "上传LOGO";
        display: block;
        font-size: 12px;
        position: absolute;
        bottom: -20px;
        left: -25px;
        width: 80px;
        text-align: center;
      }
    }
    .styleVideo{
      .el-icon-plus:after{
        content: "上传视频";
        display: block;
        font-size: 12px;
        position: absolute;
        bottom: -20px;
        left: -26px;
        width: 80px;
        text-align: center;
      }
      .el-upload--picture-card{
        width: 4rem;
      }
      .el-upload-list__item{
        width: 4rem;
      }
    }
    .stylePhoto{
      .el-icon-plus:after{
        content: "上传图片";
        display: block;
        font-size: 12px;
        position: absolute;
        bottom: -20px;
        left: -26px;
        width: 80px;
        text-align: center;
      }
      .el-upload--picture-card{
        width: 4rem;
      }
      .el-upload-list__item{
        width: 4rem;
      }
    }
    .introduceShow{
      img{
        max-width: 1170px;
      }
    }
  }
  .el-pagination{
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li{
    border: 1px solid rgba(229,232,237,1);
  }
  .goods{
    .el-table thead th{
      background-color: #F5F7FB;
    }
    .el-table td{
      padding: 0.2rem 0;
    }
  }
  .addGoods{
    .el-radio-group,.el-radio,.el-input-group,.el-input,.el-cascader,.el-radio-button, .el-radio-button__inner{
      float: left;
      margin: 0 10px 10px 0;
    }
    .el-radio-button__inner{
      border-left:0.02rem solid #DCDFE6;
    }
    .el-dialog__body{
      padding:0.1rem 0.4rem;
    }
    .step:nth-child(4){
      .el-button{
        float: left;
      }
      
      .el-dialog__header{
        padding: 0.2rem;
        background-color: #114f8e;
        .el-dialog__title{
          color: #ffffff;
        }       
      }
      .el-dialog__headerbtn{
        top: 0.2rem;
      }
    } 
    .is-process{
      .el-step__icon.is-text{
        background-color: #4181FE;
        border: none;
      }
      .el-step__icon-inner{
        color: white;
      }
    }
    .el-step__title.is-process{
      color:#4181FE;
    }
    .uploadPhoto{
      margin: 15px 0 0 15px;
    }
    .uploadPhoto .header{
      display: none;
    }
    .el-upload--picture-card{
        background-color: #EFF1F6;
        border: 0.02rem solid #c0ccda;
    }
    .uploadPhoto .header{
      display: none;
    }
    .el-icon-plus{
        position: relative;
      }
    .mainPic{
      .el-icon-plus:after{
        content: "上传商品主图";
        display: block;
        font-size: 12px;
        position: absolute;
        bottom: -20px;
        left: -25px;
        width: 80px;
        text-align: center;
      }
    }
    .coverPic{
      .el-icon-plus:after{
        content: "上传封面";
        display: block;
        font-size: 12px;
        position: absolute;
        bottom: -20px;
        left: -25px;
        width: 80px;
        text-align: center;
      }
      .el-upload--picture-card{
        width: 3.8rem;
      }
      .el-upload-list__item{
        width: 3.8rem;
      }
    }
    .goodsDetailIntroduce{
      .ql-toolbar.ql-snow{
        position: relative;
      }
      .ql-toolbar.ql-snow:before{
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2000;
      }
    }
  }
  .goodsDetail{
    .el-upload--picture-card{
      display: none;
    }
  }
  .promotionOrder,.drainageDialogBox,.runningAccount,.withDraw{
    .el-table thead th{
      background-color: #F5F7FB;
    }
  }
}
.el-message{
  top:150px;
}
.el-button--primary{
  background-color: #4181FE;
  border-color: #4181FE;
}
.search{
  .el-input-group__append{
    background-color: #4181FE !important;
  }
}
// .el-table__fixed-right::before, .el-table__fixed::before,.el-table::before{
//   display: none;
// }
</style>
