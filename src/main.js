// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import 'lib-flexible'
import Vuex from 'vuex'
import axios from 'axios'
import store from './store'
import './assets/icon/iconfont.css'
import $ from 'jquery'

Vue.use(ElementUI)
Vue.use(Vuex)

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

if (window.location.host == "op.sqplus.cn") {
  Vue.prototype.$filePath = {
    //正式环境
    photo : "https://picop.sqplus.cn/sqj/",
    video : "https://videoop.sqplus.cn/sqj/",
    wxPhoto: "https://picop.sqplus.cn/szmkt/qrcode/",
    excel : "https://op.sqplus.cn/",
    gwPath : "https://op.sqplus.cn/gw",
    enterPath : "https://op.sqplus.cn/gw/#/register"
  };
}else if(window.location.host == "pro.qmbuy.com"){
  Vue.prototype.$filePath = {
    //预生产环境
    photo : "https://pictest.sqplus.cn/sqj/",
    video : "https://videotest.sqplus.cn/sqj/",
    wxPhoto: "https://pictest.sqplus.cn/szmkt/qrcode/",
    excel : "https://pro.qmbuy.com/",
    gwPath : "https://pro.qmbuy.com/",
    enterPath : "https://pro.qmbuy.com/#/register"
  };
}else {
  Vue.prototype.$filePath = {
    //测试环境
    photo : "https://pictest.sqplus.cn/sqj/",
    video : "https://videotest.sqplus.cn/sqj/",
    wxPhoto: "https://pictest.sqplus.cn/szmkt/qrcode/",
    excel : "https://devwww.qmbuy.com/",
    gwPath : "https://devwww.qmbuy.com/",
    enterPath : "https://devwww.qmbuy.com/#/register"
  };
}

//开发环境
axios.defaults.baseURL = '/'

//测试环境
// axios.defaults.baseURL = 'https://devwww.qmbuy.com'

//预生产环境
// axios.defaults.baseURL = 'https://pro.qmbuy.com'

//生产环境
// axios.defaults.baseURL = 'https://op.sqplus.cn'

//生产环境
//axios.defaults.baseURL = '/'

axios.defaults.headers.post['Content-Type'] = 'application/json'

Vue.prototype.$filterWord = function(value,list){
  let filterIndex = 0;
  list = list || [];
  list.forEach(item => {
    if(value.indexOf(item) != -1){
      filterIndex++;
    }
  })
  if(filterIndex>0){
    return false;
  }else{
    return true;
  }
}

axios.interceptors.response.use(res => {
  if (res.data.code == 4010) {
      localStorage.clear();
      alert(res.data.message)
      router.push({
          name: 'login'
      })
  } else {
      return res
  }
}, err => {
  //请求错误时做些事
  console.log(err)
});

//导航钩子，如果没有登录过则提醒用户登录
router.beforeEach(function (to, from, next) {
  if(to.matched.some( m => m.meta.auth)){
    // 对路由进行验证
    if(store.state.isLogin==100) { // 已经登陆
      next()   // 正常跳转 
    }else{
    　next({path:'/login',query:{ Rurl: to.fullPath} })
    } 
  }else{
    next() 
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
