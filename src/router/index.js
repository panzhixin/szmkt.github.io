import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/account/login'//登录主界面
import setPassword from '@/components/account/setPassword'//设置密码
import shopRegister from '@/components/account/shopRegister'//店铺注册
import checking from '@/components/account/checking'//店铺信息已提交，等待审核
import noProof from '@/components/account/noProof'   //无凭证
import openShop from '@/components/account/openShop' //我要开店
import submitShop from '@/components/account/submitShop'//提交店铺
import submitProof from '@/components/account/submitProof'//提交凭证
import resetPassword from '@/components/account/resetPassword'//重置密码
import finishReg from '@/components/account/finishReg'//注册完成
import notPass from '@/components/account/notPass'//注册未通过

import firstEnter from '@/components/build/firstEnter'//首次进入店铺
import shop from '@/components/build/shop'//店铺主页
import changePassword from '@/components/build/shopManage/changePassword'//修改店铺密码
import goods from '@/components/build/shopManage/goods'//商品管理
import order from '@/components/build/shopManage/order'//订单管理
import decoration from '@/components/build/shopManage/decoration'//品牌装修
import addGoods from '@/components/build/shopManage/addGoods'//增加商品
import editGoods from '@/components/build/shopManage/editGoods'//商品管理--编辑商品
import submitResult from '@/components/build/shopManage/submitResult'//提交结果
import runningAccount from '@/components/build/shopManage/runningAccount'//流水记录
import bankBinding from '@/components/build/shopManage/bankBinding'//银行绑定
import withdraw from '@/components/build/shopManage/withdraw'//提现管理
import space from '@/components/tools/space'//空白页
import promotionOrder from '@/components/build/shopManage/promotionOrder'//促销品订单
import activyDetail from '@/components/build/shopManage/activyDetail'//促销活动详情
import goodsDetail from '@/components/build/shopManage/goodsDetail'//促销活动详情

import promotion from '@/components/build/promotion/promotion'//促销品库
import buyPromotion from '@/components/build/promotion/buyPromotion'//购买促销品
import buySuccess from '@/components/build/promotion/buySuccess'//购买成功
import searchPromotion from '@/components/build/promotion/searchPromotion'//搜索促销品

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'login',
      component: login
    },
    {
      path : '/space',
      name : "space",
      component : space,
    },
    {
      path : '/setPassword',
      name : "setPassword",
      component : setPassword,
      meta:{auth:true}
    },
    {
      path : '/shopRegister',
      name : "shopRegister",
      component : shopRegister,
      meta:{auth:true}
    },
    {
      path : '/checking',
      name : "checking",
      component : checking,
    },
    {
      path : '/openShop',
      name : "openShop",
      component : openShop,
    },
    {
      path : '/submitShop',
      name : "submitShop",
      component : submitShop,
    },
    {
      path : '/noProof',
      name : "noProof",
      component : noProof,
    },
    {
      path : '/submitProof',
      name : "submitProof",
      component : submitProof,
    },
    {
      path : '/resetPassword',
      name : "resetPassword",
      component : resetPassword,
    },
    {
      path : '/finishReg',
      name : "finishReg",
      component : finishReg,
      meta:{auth:true},
    },
    {
      path : '/notPass',
      name : "notPass",
      component : notPass,
      meta:{auth:true},
    },
    {
      path : '/firstEnter',
      name : "firstEnter",
      component : firstEnter,
      meta:{auth:true}
    },
    {
      path : '/shopManage',
      name : "shop",
      component : shop,
      meta:{auth:true},
      children : [
        {
          path : 'changePassword',
          name : "changePassword",
          component : changePassword,
          meta:{auth:true}
        },
        {
          path : 'goods',
          name : "goods",
          component : goods,
          meta:{auth:true}
        },
        {
          path : 'editGoods',
          name : "editGoods",
          component : editGoods,
          meta:{auth:true}
        },
        {
          path : 'orderManege/goodsOrder',
          name : "order",
          component : order,
          meta:{auth:true}
        },
        {
          path : 'orderManege/promotionOrder',
          name : "promotionOrder",
          component : promotionOrder,
          meta:{auth:true}
        },
        {
          path : 'decoration',
          name : "decoration",
          component : decoration,
          meta:{auth:true}
        },
        {
          path : 'addGoods',
          name : "addGoods",
          component : addGoods,
          meta:{auth:true}
        },
        {
          path : 'submitResult',
          name : "submitResult",
          component : submitResult,
          meta:{auth:true}
        },
        {
          path : 'finance/runningAccount',
          name : "runningAccount",
          component : runningAccount,
          meta:{auth:true}
        },
        {
          path : 'finance/bankBinding',
          name : "bankBinding",
          component : bankBinding,
          meta:{auth:true}
        },
        {
          path : 'finance/withdraw',
          name : "withdraw",
          component : withdraw,
          meta:{auth:true}
        },
        {
          path : 'promotion',
          name : "promotion",
          component : promotion,
          meta:{auth:true}
        },
        {
          path : 'buyPromotion',
          name : "buyPromotion",
          component : buyPromotion,
          meta:{auth:true}
        },
        {
          path : 'buySuccess',
          name : "buySuccess",
          component : buySuccess,
          meta:{auth:true}
        },
        // {
        //   path : 'searchPromotion',
        //   name : "searchPromotion",
        //   component : searchPromotion,
        //   meta:{auth:true}
        // },
        {
          path : 'activyDetail',
          name : "activyDetail",
          component : activyDetail,
          meta:{auth:true}
        },
        {
          path : 'goodsDetail',
          name : "goodsDetail",
          component : goodsDetail,
          meta:{auth:true}
        }
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

