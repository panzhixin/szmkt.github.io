<template>
  <div class="login">
    <div class="login-box">
      <h1 class="title">{{title}}</h1>
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账号登录" name="num">
            <el-form
              :label-position="labelPosition"
              label-width="110px"
              :model="loginInfo"
              :rules="activationRules"
              style="margin-top:30px;"
            >
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="loginInfo.phone" placeholder="请输入你的手机号码" maxlength="11"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" style="margin-bottom:0;">
                <el-input v-model="loginInfo.password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <p class="forget" @click="forgetPassword">忘记密码</p>
              <el-button type="primary" @click="login" style="padding:15px 60px;">火速登录</el-button>
              <el-button @click="openShop" style="padding:15px 60px;">我要开店</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="微信登录" name="wx">
            <div class="wxLogin">
              <div class="codeImg">
                <img :src="wxImg">
                <div class="timeOut" v-if="reflesh">
                    <span class="reflesh" @click="fleshWx">点击刷新</span>
                </div>
              </div>
              <h2>{{codeTitle[0]}}</h2>
              <h2>{{codeTitle[1]}}</h2>
            </div>
          </el-tab-pane>
          <el-tab-pane label="首次激活" name="activation">
            <el-form
              :label-position="labelPosition"
              label-width="110px"
              :model="firstActivation"
              :rules="activationRules"
              style="margin-top:30px;"
            >
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="firstActivation.phone" placeholder="请输入你的手机号码" maxlength="11"></el-input>
              </el-form-item>
              
              <el-form-item label="短信验证码" prop="message" style="margin-bottom:40px;" class="getMes">
                <el-input
                  placeholder="请输入短信验证码"
                  v-model="firstActivation.message"
                  class="input-with-select"
                  maxlength="4"
                >
                  <el-button
                    slot="append"
                    type="info"
                    class="getMessage"
                    :disabled="getMessageDis"
                    @click="getMessageFunc"
                  >{{getMessage}}</el-button>
                </el-input>
              </el-form-item>
              <el-button type="primary" @click="onSubmit" style="padding:15px 60px;">立即激活</el-button>
              <el-button @click="openShop" style="padding:15px 60px;">我要开店</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="foot">
        Copyright © 2012-2019 All Rights Reserved 荟友网络科技版权所有
        <img
          src="../../assets/img/beian.png"
          style="height:20px;width:20px"
        >粤公网安备 44030402000907号 网站备案许可证号:
        <a
          href="http://beian.miit.gov.cn/"
          class="beian"
        >粤ICP备17057713号-4</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      reflesh : false,
      wxImg: require("../../assets/img/default_code.png"),
      title: "店铺登录",
      activeName: "num",
      labelPosition: "left",
      codeTitle: ["请打开微信扫描该二维码", "该二维码5分钟内有效"],
      loginInfo: {
        phone: "",
        password: ""
      },
      firstActivation: {
        phone: "",
        message: ""
      },
      receive: "",
      getMessage: "获取验证码",
      getMessageDis: false,
      activationRules: {
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "手机号码应为11位数字", trigger: "blur" }
        ],
        message: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      enterFuc: "login",
      wxTimer: null,
      wxEffective: 1,
      tabActive: 0,
      isCheckCode: null
    };
  },
  methods: {
    handleClick(tab, event) {
      let _this = this;
      if (tab.index == 0) {
        _this.tabActive = 0;
        _this.enterFuc = "login";
      } else if (tab.index == 2) {
        _this.tabActive = 2;
        _this.enterFuc = "onSubmit";
      } else if (tab.index == 1) {
        //微信登录
        _this.wxLogin();
      }
    },
    //请求发送手机验证码
    getMessageFunc() {
      let phone = this.firstActivation.phone;
      if (phone == "") {
        this.$message({
          type: "warning",
          message: "请先输入手机号码"
        });
      } else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.firstActivation.phone)) {
        this.$message({
          type: "warning",
          message: "请输入11位有效手机号码"
        });
      } else {
        this.$http
          .get("szmktstore/proxy/send/phoneCode?phone=" + phone + "&type=1")
          .then(res => {
            //console.log(res);
            if(res.data.code == 200){
              this.receive = "4312";
              this.getMessageDis = true;
              let second = 60; //倒计时60S
              let timer = null;
              let self = this;
              this.$message({
                type: "success",
                message: "短信已发送，请及时查收"
              });
              timer = setInterval(function() {
                second -= 1;
                if (second > 0) {
                  self.getMessage = second + "S后获取";
                } else {
                  self.getMessage = "获取验证码";
                  self.getMessageDis = false;
                  clearInterval(timer);
                }
              }, 1000);
            }else{
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    onSubmit() {
      //激活按钮事件
      let phone = this.firstActivation.phone;
      let code = this.firstActivation.message;
      //console.log((code + "").length);
      if (phone == "") {
        this.$message({ type: "error", message: "请输入手机号码" });
      } else {
        if (code == "") {
          this.$message({ type: "error", message: "请输入验证码" });
        } else {
          if ((code + "").length != 4) {
            this.$message({ type: "error", message: "验证码请输入4位数字" });
          } else {
            this.$http
              .get(
                "szmktstore/login/activation?phone=" + phone + "&code=" + code
              )
              .then(res => {
                //console.log(res);
                clearInterval(this.isCheckCode); //成功则清除定时器
                clearTimeout(this.wxTimer);
                if (res.data.code == 1000) {
                  let status = res.data.data.status;
                  let id =
                    res.data.data.userid == "" ? "" : res.data.data.userid;
                  //console.log("data",res.data.data);
                  this.$store.commit("updateLoginInfo", {
                    userId: id,
                    phone: phone,
                    password: ""
                  });

                  if (status == 1) {
                    //没有激活码
                    this.$router.push({
                      name: "noProof"
                    });
                  } else if (status == 2) {
                    //有激活码 没有绑定微信（创建店铺账号）
                    this.$store.commit("changeLogin", 100);
                    this.$router.push({
                      path: "/setPassword"
                    });
                  } else if (status == 3) {
                    //绑定微信 没有注册账号（设置店铺账号密码)
                    this.$store.commit("changeLogin", 100);
                    this.$router.push({
                      path: "/setPassword"
                    });
                  } else if (status == 4) {
                    //注册了账号 但没有提交店铺注册申请
                    this.$message({
                      type: "warning",
                      message: "您的账号已注册，请提交店铺注册申请"
                    });
                    this.$store.commit("changeLogin", 100);
                    this.$router.push({
                      path: "/shopRegister",
                      query: {
                        phone: phone
                      }
                    });
                  } else if (status == 5) {
                    //店铺注册审核中
                    this.$message({
                      type: "warning",
                      message: "请耐心等待店铺审核"
                    });
                    this.$router.push({
                      path: "/checking",
                      query: {
                        phone: phone
                      }
                    });
                  } else if (status == 6) {
                    //店铺通过审核但没有进店
                    this.$message({
                      type: "success",
                      message: "恭喜，您的店铺已开张"
                    });
                    this.$store.commit("changeLogin", 100);
                    let loginInfo = {
                      userId: id,
                      phone: this.firstActivation.phone,
                      password: "",
                      storeName: "",
                      storeId: ""
                    };
                    this.$store.commit("updateLoginInfo", loginInfo);
                    this.$router.push({
                      path: "/finishReg",
                      query: {
                        message: "恭喜您的旺铺已开张，快去店铺看看吧"
                      }
                    });
                  } else if (status == 7) {
                    //店铺通过审核并进过店
                    this.$message({ type: "success", message: "登录成功" });
                    this.$store.commit("changeLogin", 100);
                    this.$http
                      .get("szmktstore/storeInfo/myBase?userid=" + id)
                      .then(res => {
                        if (res.data.code == 1000) {
                          let loginInfo = {
                            userId: id,
                            phone: this.firstActivation.phone,
                            password: "",
                            storeName: res.data.data.storeName,
                            storeId: res.data.data.id
                          };
                          this.$store.commit("updateLoginInfo", loginInfo);
                          this.$router.push({
                            name: "goods"
                          });
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  } else if (status == 8) {
                    //店铺审核被拒绝
                    this.$message({
                      type: "error",
                      message: "抱歉，您的店铺审核被拒绝"
                    });
                    let loginInfo = {
                      userId: id,
                      phone: this.firstActivation.phone,
                      password: "",
                      storeName: "",
                      storeId: ""
                    };
                    this.$store.commit("changeLogin", 100);
                    this.$router.push({
                      path: "/notPass",
                      query: {
                        reason: res.data.data.reason
                      }
                    });
                  }
                } else {
                  this.$message({ type: "warning", message: res.data.message });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      }
    },
    openShop() {
      //我要开店
      clearInterval(this.isCheckCode);
      clearTimeout(this.wxTimer);
      window.location.href = this.$filePath.enterPath;
      // this.$router.push({
      //   name: "openShop"
      // });
    },
    login() {
      //店铺登录
      let password = this.loginInfo.password;
      let user = this.loginInfo.phone;
      if (user == "") {
        this.$message({ type: "warning", message: "请输入手机号码" });
      } else {
        if ((user + "").length != 11 && typeof user != "number") {
          this.$message({ type: "warning", message: "手机号码无效" });
        } else {
          if (password == "") {
            this.$message({ type: "warning", message: "请输入密码" });
          } else {
            this.$http
              .get(
                "szmktstore/login/check?account=" +
                  user +
                  "&password=" +
                  encodeURIComponent(password)
              )
              .then(res => {
                //console.log(res.data);
                let code = res.data.code;
                clearInterval(this.isCheckCode); //成功则清除定时器
                clearTimeout(this.wxTimer);
                if (code == 1000) {
                  //正常登录
                  let status = res.data.data.status;
                  if (status == 1) {
                    //无激活码
                    this.$router.push({
                      path: "/noProof"
                    });
                  } else if (status == 2) {
                    //未绑定微信
                    this.$message({ type: "info", message: "请先激活账户" });
                    this.$store.commit("changeLogin", 100);
                    let loginInfo = {
                      userId: res.data.data.token,
                      phone: this.loginInfo.phone,
                      password: this.loginInfo.password,
                      storeName: "",
                      storeId: ""
                    };
                    this.$store.commit("updateLoginInfo", loginInfo);
                    this.activeName = "activation";
                  } else if (status == 3) {
                    //已绑定微信但未设置密码
                    this.$message({ type: "info", message: "请先激活账户" });
                    this.$store.commit("changeLogin", 100);
                    let loginInfo = {
                      userId: res.data.data.token,
                      phone: this.loginInfo.phone,
                      password: this.loginInfo.password,
                      storeName: "",
                      storeId: ""
                    };
                    this.$store.commit("updateLoginInfo", loginInfo);
                    this.activeName = "activation";
                  } else if (status == 4) {
                    //尚未注册店铺
                    this.$store.commit("changeLogin", 100);
                    let loginInfo = {
                      userId: res.data.data.token,
                      phone: this.loginInfo.phone,
                      password: this.loginInfo.password,
                      storeName: "",
                      storeId: ""
                    };
                    this.$store.commit("updateLoginInfo", loginInfo);
                    this.$message({ type: "info", message: "请先注册店铺" });
                    this.$router.push({
                      path: "/shopRegister"
                    });
                  } else if (status == 5) {
                    //审核中
                    this.$router.push({
                      path: "/checking"
                    });
                  } else if (status == 6) {
                    //未进过店
                    this.$store.commit("changeLogin", 100);
                    let loginInfo = {
                      userId: res.data.data.token,
                      phone: this.loginInfo.phone,
                      password: this.loginInfo.password,
                      storeName: "",
                      storeId: ""
                    };
                    this.$store.commit("updateLoginInfo", loginInfo);
                    this.$router.push({
                      path: "/finishReg",
                      query: {
                        message: "恭喜您的旺铺已开张，快去店铺看看吧",
                        isFirstEnter: false
                      }
                    });
                  } else if (status == 7) {
                    //已进过店
                    let token = res.data.data.token;
                    this.$message({
                      type: "success",
                      message: "登录成功",
                      duration: 500
                    });
                    this.$store.commit("changeLogin", 100);
                    this.$store.commit("changeActiveShopItem", "0");
                    this.$http
                      .get(
                        "szmktstore/storeInfo/myBase?userid=" +
                          res.data.data.token
                      )
                      .then(res => {
                        //console.log("store",res);
                        if (res.data.code == 1000) {
                          let loginInfo = {
                            userId: token,
                            phone: this.loginInfo.phone,
                            password: this.loginInfo.password,
                            storeName: res.data.data.storeName,
                            storeId: res.data.data.id
                          };
                          this.$store.commit("updateLoginInfo", loginInfo);
                          this.$router.push({
                            name: "goods"
                          });
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  } else if (status == 8) {
                    //被拒绝
                    let loginInfo = {
                      userId: res.data.data.token,
                      phone: this.loginInfo.phone,
                      password: this.loginInfo.password,
                      storeName: "",
                      storeId: ""
                    };
                    this.$store.commit("updateLoginInfo", loginInfo);
                    this.$store.commit("changeLogin", 100);
                    this.$router.push({
                      path: "/notPass",
                      query: {
                        reason: res.data.data.reason
                      }
                    });
                  }
                } else {
                  this.$message({
                    type: "warning",
                    message: res.data.message
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      }
    },
    forgetPassword() {
      //忘记密码
      clearInterval(this.isCheckCode);
      clearTimeout(this.wxTimer);
      this.$router.push({
        name: "resetPassword"
      });
    },
    addKeyup() {
      var _this = this;
      //敲击回车登录，由于存在缺陷，未添加
      document.onkeydown = function(e) {
        var key = window.event.keyCode;
        if (key == 13 && _this.$route.name == "login") {
          if (_this.enterFuc == "login") {
            _this.login();
          } else {
            _this.onSubmit();
          }
        }
      };
    },
    //微信登录
    wxLogin() {
      let _this = this;
      clearInterval(_this.isCheckCode);
      _this.tabActive = 1;
      if (_this.wxEffective == 1) {
        if (
          _this.wxImg.indexOf("store_login") == -1 &&
          _this.$route.name == "login"
        ) {
          /*
            以前：/szmktuser/store/storeloginqrcode
            现在：/szmktuserservice/external/storeloginqrcode
          */
          _this.$http
            .get("/szmktuser/store/storeloginqrcode")
            .then(res => {
              if (res.data.code == 1000) {
                _this.wxImg = _this.$filePath.wxPhoto + res.data.data;
                _this.wxTimer = setTimeout(function() {
                  clearInterval(_this.isCheckCode);
                  _this.codeTitle = [
                    "该二维码已失效",
                    "请刷新页面获取新二维码"
                  ];
                  _this.wxEffective = 0;
                  if (_this.tabActive == 1) {
                    _this.reflesh = true;
                  }
                }, 5 * 60 * 1000);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
        //不断的请求是否扫码登录
        _this.isCheckCode = setInterval(function() {
          let image = _this.$filePath.wxPhoto + _this.wxImg;
          if (_this.$route.name == "login" && _this.activeName == "wx") {
            if (image != undefined && image != null && image != "") {
              image = image.substr(image.length - 12, 8); //截取token值
              _this.$http
                .get("szmktstore/login/WX/checkToken?webToken=" + image)
                .then(res => {
                  if (res.data.code == 1000) {
                    let status = res.data.data.status;
                    if (status != 0) {
                      clearInterval(_this.isCheckCode); //成功则清除定时器
                      clearTimeout(_this.wxTimer);
                      _this.$store.commit("changeLogin", 100);
                      let loginInfo = {
                        userId: res.data.data.userid,
                        phone: res.data.data.phone,
                        password: "",
                        storeName: "",
                        storeId: ""
                      };
                      _this.$store.commit("updateLoginInfo", loginInfo);
                      if (status == 3) {
                        //已绑定微信但未设置密码
                        _this.$message({
                          type: "warning",
                          message: "请先设置密码"
                        });
                        _this.$router.push({
                          path: "/setPassword"
                        });
                      } else if (status == 4) {
                        //尚未注册店铺
                        _this.$message({
                          type: "warning",
                          message: "请先注册店铺"
                        });
                        _this.$router.push({
                          path: "/shopRegister"
                        });
                      } else if (status == 5) {
                        //审核中
                        _this.$message({
                          type: "warning",
                          message: "请耐心等待店铺审核"
                        });
                        _this.$store.commit("changeLogin", 1);
                        _this.$router.push({
                          path: "/checking"
                        });
                      } else if (status == 6) {
                        //未进过店
                        _this.$message({
                          type: "success",
                          message: "您的旺铺已开张"
                        });
                        _this.$router.push({
                          path: "/finishReg",
                          query: {
                            message: "恭喜您的旺铺已开张，快去店铺看看吧"
                          }
                        });
                      } else if (status == 7) {
                        //已进过店
                        _this.$message({
                          type: "success",
                          message: "登录成功"
                        });
                        _this.$store.commit("changeActiveShopItem", "0");
                        _this.$http
                          .get(
                            "szmktstore/storeInfo/myBase?userid=" +
                              res.data.data.userid
                          )
                          .then(res1 => {
                            if (res1.data.code == 1000) {
                              let loginInfo = {
                                userId: _this.$store.state.loginInfo.userId,
                                phone: _this.$store.state.loginInfo.phone,
                                password: "",
                                storeName: res1.data.data.storeName,
                                storeId: res1.data.data.id
                              };
                              _this.$store.commit("updateLoginInfo", loginInfo);
                              _this.$router.push({
                                name: "goods"
                              });
                            }
                          })
                          .catch(err => {
                            console.log(err);
                          });
                      } else if (status == 8) {
                        //被拒绝
                        _this.$message({
                          type: "error",
                          message: "抱歉,您的店铺没有通过审核"
                        });
                        _this.$router.push({
                          path: "/notPass",
                          query: {
                            reason: res.data.data.reason
                          }
                        });
                      }
                    }
                  } else {
                    _this.$message({
                      type: "warning",
                      message: res.data.message
                    });
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          }
        }, 5000);
      } else {
        if (_this.$route.name == "login") {
            _this.reflesh = true;
        }
      }
    },
    fleshWx(){
        this.$router.push({ name: "space" });
    }
  },
  mounted() {
    this.$store.commit("changeIsShowNav", true); //是否显示头部
    this.$store.commit("changeNavActive", 2); //头部店铺登录活跃
    this.$store.commit("changeHeaderShow",true);
    this.addKeyup();
    if (this.$route.params.activeItem == "wx") {
      this.activeName = "wx";
      this.wxLogin();
    }
  },
  beforeDestroy() {
    clearTimeout(this.wxTimer);
    clearInterval(this.isCheckCode);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login {
  padding:200px 0 80px 0;
  position: relative;
  .login-box{
    width: 500px;
    height: 420px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .title {
    font-size: 40px;
    color: #333;
    line-height: 70px;
    margin-top: 20px;
  }
  .content {
    margin: 0 auto;
    width: 400px;
    .wxLogin {
      box-sizing: border-box;
      width: 270px;
      height: 270px;
      box-shadow: 0 0 inset #666666;
      margin: 0 auto;
      .codeImg {
        width: 160px;
        height: 160px;
        margin: 0 auto 10px;
        padding: 15px;
        border: #c5bbbb 2px solid;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .timeOut{
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          left:0;
          background-color: rgba(68, 68, 68, .7);
          .reflesh{
            width: 100px;
            height:50px;
            background-color: #f56c6c;
            border-radius: 5px;
            font-size: 18px;
            line-height: 50px;
            text-align: center;
            color: #ffffff;
            cursor: pointer;
          }
          .reflesh:hover{
            background-color: red;
          }
        }
      }
      h2 {
        text-align: center;
        font-size: 14px;
        font-weight: normal;
      } 
    }
  }
  .forget {
    line-height: 30px;
    font-size: 14px;
    text-align: right;
    margin: 5px 0 10px;
  }
  .forget:hover {
    text-decoration: red underline;
    color: red;
    cursor: pointer;
  }
  .foot {
    width: 100%;
    height: 20px;
    font-size: 14px;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    padding: 20px 0;
    background-color: #3f3e3e;
    color: #9c9191;
    .beian {
      color: #333;
    }
    .beian:hover {
      color: rgb(52, 110, 219);
    }
  }
}
.el-button--primary{
  background-color: #F25664;
  border-color:#F25664;
}
.el-button:hover{
  border-color:#F25664;
  color: #F25664;
  background-color: white;
}
.el-button--primary:hover{
  background-color: #d22c2c;
  color: white;
}
.getMes{
  .el-button:hover{
    background-color: #f5f7fa;
    border-color: #f5f7fa;
  }
}
</style>
