import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
      handleOrderNew : true,
      goodsPage : 1,
      handleOrderNum : 0,
      isShowHeader:true,
      filterList:[],
      isLogin : 0,
      firstLoad : true,//是否首次登陆
      isShowNav : true,//是否显示nav
      shopNavTitle : "", //店铺导航标题
      firstEnter : false,
      goodsId : "",//商品id
      activeShopItem : 0,//商铺左侧导航活跃索引，从0开始
      navActive : 2,//登录注册时的头部活跃索引，从0开始
      //用户信息
      loginInfo : {
        userId : "",
        phone : "",
        password : "",
        storeName : "",
        storeId : ""
      },
      //用户账号
      account : {
        accountName : "",
        bankName : "",
        subBranch : "",
        account : ""
      }
    },
    mutations: {
      //改变商品列表页码
      changeHandleOrderNew(state,payload){
        state.handleOrderNew = payload;
      },
      changeGoodsPage(state,payload){
        state.goodsPage = payload;
      },
      //改变未发货订单数量
      changeHandleOrderNum(state,payload){
        state.handleOrderNum = payload;
      },
      //改变头部显示
      changeHeaderShow(state,payload){
        state.isShowHeader = payload;
      },
      //改变敏感词列表
      changeFilterList(state,payload){
        state.filterList = payload;
      },
      //改变登录状态
      changeLogin(state,payload){
        state.isLogin = payload;
      },
      //改变左侧导航栏活跃标签
      changeNavActive(state,payload){
        state.navActive = payload;
      },
      //是否为首次加载
      changeFirstLoad(state){
        state.firstLoad = false;
      },
      //是否为首次进入店铺
      changeFirstEnter(state){
        state.firstEnter = true;
      },
      //是否显示上方导航栏
      changeIsShowNav(state,payload){
        state.isShowNav = payload;
      },
      //改变店铺上面标题
      changeShopNavTitle(state,payload){
        state.shopNavTitle = payload;
      },
      //改变商品id
      changeGoodsId(state,payload){
        state.goodsId = payload;
      },
      //更新登录信息
      updateLoginInfo (state,payload){
        state.loginInfo = payload;
      },
      //更新银行账户
      updateAccount(state,payload){
        state.account = payload;
      },
      //更新店铺活跃标签
      changeActiveShopItem(state,payload){
        state.activeShopItem = payload;
      }
    },
    plugins: [createPersistedState({
      storage: window.sessionStorage
  })]
})
export default store;