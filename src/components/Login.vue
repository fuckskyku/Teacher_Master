<template>
  <section id="login-section">
    <!-- <div> -->
    <video
      preload="auto"
      :style="fixStyle"
      autoplay="autoplay"
      loop="loop"
      id="video"
      height="100%"
      width="100%"
    >
      <source src="/static/loginvideo.mp4" type="video/mp4">
      <!-- <source src="/static/login.mp4" type="video/mp4"> -->
    </video>
    <!-- </div> -->
    <div class="shade"></div>
    <!-- <transition name="Loginfade"> -->
    <div id="login-container" class="animated flipInX">
      <div>
        <img src="/static/logoYellow.png" alt="LOGO">
      </div>
      <div>咪师校园</div>
      <!-- fjalsfjlksajf <input type="text"> -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        status-icon
        :show-message="true"
        :inline-message="true"
        @submit.native.prevent
      >
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" autofocus="true" class="input"></el-input>
        </el-form-item>

        <el-form-item
          label="验证码"
          prop="code"
          v-if="initlogin==2||initlogin==3"
          class="animated bounceInLeft"
        >
          <el-input v-model="form.code"></el-input>
          <span class="code">
            <img :src="codeSrc" alt="验证码" @click="randomImg($event)">
          </span>
        </el-form-item>

        <el-form-item
          label="短信"
          prop="msgCode"
          v-if="initlogin==2||initlogin==3"
          class="animated bounceInLeft"
        >
          <el-input v-model="form.msgCode"></el-input>
          <span class="code">
            <el-button
              v-model="msgCode"
              :disabled="disabled"
              @click="getCode"
            >{{msgCode!==0?"已发送"+"("+countDown+")":"获取验证码"}}</el-button>
          </span>
        </el-form-item>

        <el-form-item
          :label="initlogin==3?'新密码':'密码'"
          prop="pw"
          v-if="initlogin==1||initlogin==2||initlogin==3"
          class="animated bounceInLeft"
        >
          <!-- <el-input v-model="form.pw" type="password" @change="loginGo('form')"></el-input> -->
          <el-input v-model="form.pw" type="password"></el-input>
        </el-form-item>

        <el-form-item
          label="确认密码"
          prop="pw2"
          v-if="initlogin==2||initlogin==3"
          class="animated bounceInLeft"
        >
          <el-input v-model="form.pw2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="login-go">
        <el-button
          @click="loginGo('form')"
          :disabled="disabled2"
        >{{initlogin ==1?('登录'):initlogin ==2?'激活登录':initlogin==3?'确定':'继续'}}</el-button>
        <el-button @click="initlogin=1" v-if="initlogin ==3" class="back">返回</el-button>
      </div>
      <div class="login-section" v-if="initlogin==1">
        <div>
          <!-- <el-checkbox v-model="checked">记住我</el-checkbox> -->
        </div>
        <div>
          <a href="javascript:" @click="ForgetPassword">忘记密码</a>
        </div>

        <!-- <button @click="switchLang('en')">English</button>
        <button @click="switchLang('cn')">Chinese</button>-->
        <!-- {{$t('message.hello')}} -->
      </div>
      <div class="login-section" v-if="initlogin==2">
        <div>
          <el-checkbox v-model="checkedProtocol">我已阅读并同意</el-checkbox>
          <a href="javascritp:" class="protocol">《咪师校园用户注册协议》</a>
          <a href="javascritp:" class="protocol">《咪师 校园使用规则〉</a>
        </div>
      </div>
    </div>
    <!-- </transition> -->
  </section>
</template>
<script>
//接口
import {
  login,
  isStatus,
  sendNoTokenSms,
  captcha,
  userActive,
  forgetPwd
} from "../api/api.js";
//store（Vuex）
import { mapState, mapActions } from "vuex";
export default {
  data() {
    //验证方法
    var verify = {
      Mobilem: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空!"));
          // return callback(new Error(this.$t("message.mobile")));
        } else if (
          !value.match(
            /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
          )
        ) {
          return callback(new Error("输入正确的手机号码!"));
        } else {
          callback();
        }
      },
      Pw: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("密码不能为空!"));
        } else {
          callback();
        }
      },
      Pw2: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入确认密码!"));
        } else if (value !== this.form.pw) {
          return callback(new Error("两次输入的密码不一致!"));
        } else {
          return callback();
        }
      }
    };

    return {
      // lang: "en", //语言切换
      form: {}, //表单数据
      // checked: false, //记住我
      checkedProtocol: false, //服务协议
      initlogin: 0, //登录跳转状态值（1登入，激活登入2,忘记密码3）
      msgCode: 0, //控制是否已发送短信
      countDown: 60, //倒计时计数
      codeSrc: "", //图形验证码
      disabled: false, //控制发送短信按钮是否可以再次点击
      // disabled2: false,

      fixStyle: "",
      /**
        表单的自定义验证
       */
      rules: {
        mobile: [{ validator: verify.Mobilem, trigger: "blur" }],
        pw: [{ validator: verify.Pw, trigger: "blur" }],
        pw2: [{ validator: verify.Pw2, trigger: "blur" }]
      }
    };
  },

  methods: {
    ...mapActions([
      "setclassShow",
      "setheaderNav",
      "setleading_in",
      "setisHeadTeacher"
    ]),
    // switchLang(en) {
    //   this.lang = en;
    //   this.$i18n.locale = this.lang;
    // },
    // 刷新验证码
    randomImg(even) {
      captcha().then(res => {
        console.log(res);
        this.codeSrc = res.data.data;
      });
    },
    //点击登录
    loginGo(form) {
      // this.$refs["form"].clearValidate();
      /** 验证所有表单 */
      this.$refs[form].validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.initlogin == 1) {
            //登录
            //这里执行ajax
            login({ loginName: this.form.mobile, password: this.form.pw }).then(
              res => {
                console.log(res);
                if (res.data.code == "200") {
                  if (res.data.data.isHeadTeacher == "1") {
                    this.setisHeadTeacher(1);
                    //判断是否需要导入数据
                    if (res.data.data.guideStep == "0") {
                      this.setleading_in(1);
                      this.setheaderNav(2);
                      this.setclassShow(1);
                    } else if (res.data.data.guideStep == "1") {
                      this.setleading_in(2);
                      this.setheaderNav(2);
                      this.setclassShow(1);
                    } else if (res.data.data.guideStep == "2") {
                      this.setleading_in(3);
                      this.setheaderNav(1);
                      this.setclassShow(1);
                    }
                  } else {
                    console.log(1);
                    this.setisHeadTeacher(0);
                    this.setleading_in(3);
                    this.setheaderNav(1);
                    this.setclassShow(0);
                  }
                  console.log(res.data.data);
                  // this.$router.push('/')
                  this.saveAllLocalStorage(res.data.data, "login_userInfo", [
                    "permissions",
                    "realName",
                    "schoolName",
                    "schoolId",
                    "guideStep",
                    "isHeadTeacher",
                    "mobile"
                  ]);
                  // //存储token
                  this.saveLocalStorage("token", res.data.data.token);
                  // window.localStorage.setItem('token', res.data.data.token)
                  this.$router.push({ name: "Home" });
                } else {
                  this.$message.error(res.data.message);
                  // console.log('密码错误')
                }
              }
            );
          } else if (this.initlogin == 2) {
            //激活
            userActive({
              mobile: this.form.mobile,
              mobileCode: this.form.msgCode,
              plainPassword: this.form.pw
            }).then(res => {
              if (res.data.code == "200") {
                console.log(res);
                login({
                  loginName: this.form.mobile,
                  password: this.form.pw
                }).then(res => {
                  console.log(res);
                  if (res.data.code == "200") {
                    if (res.data.data.isHeadTeacher == "1") {
                      this.setisHeadTeacher(1);
                      //判断是否需要导入数据
                      if (res.data.data.guideStep == "0") {
                        this.setleading_in(1);
                        this.setheaderNav(2);
                        this.setclassShow(1);
                      } else if (res.data.data.guideStep == "1") {
                        this.setleading_in(2);
                        this.setheaderNav(2);
                        this.setclassShow(1);
                      } else if (res.data.data.guideStep == "2") {
                        this.setleading_in(3);
                        this.setheaderNav(1);
                        this.setclassShow(1);
                      }
                    } else {
                      // console.log(1)
                      this.setisHeadTeacher(0);
                      this.setleading_in(3);
                      this.setheaderNav(1);
                      this.setclassShow(0);
                    }
                    console.log(res.data.data);
                    // this.$router.push('/')
                    this.saveAllLocalStorage(res.data.data, "login_userInfo", [
                      "permissions",
                      "realName",
                      "schoolName",
                      "schoolId",
                      "guideStep",
                      "isHeadTeacher",
                      "mobile"
                    ]);
                    // //存储token
                    this.saveLocalStorage("token", res.data.data.token);
                    // window.localStorage.setItem('token', res.data.data.token)
                    this.$router.push({ name: "Home" });
                  } else {
                    this.$message.error(res.data.message);
                    // console.log('密码错误')
                  }
                });
                // this.$router.push({ name: 'Home' })
              } else {
                // console.log(res);
                this.$message.error(res.data.message);
              }
            });
          } else if (this.initlogin == 3) {
            forgetPwd({
              mobile: this.form.mobile,
              mobileCode: this.form.msgCode,
              plainPassword: this.form.pw
            }).then(res => {
              if (res.data.code == 200) {
                let forgetthis = this;
                this.$message({
                  type: "success",
                  message: res.data.message + "将在3秒后跳转至登录界面",
                  duration: 3000,
                  onClose: function(mes) {
                    forgetthis.initlogin = 0;
                  }
                });
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            //手机号激活验证
            isStatus({ mobile: this.form.mobile }).then(res => {
              console.log(this.form.mobile);
              console.log(res);
              if (res.data.data.islogin == 0) {
                this.$message.error(
                  "哎呀，您的手机号还没有添加喔（请联系学校）"
                );
              } else if (res.data.data.islogin == 1) {
                this.initlogin = 1;
              } else if (res.data.data.islogin == 2) {
                this.initlogin = 2;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    getCode() {
      var type;
      if (this.initlogin != 3) {
        type = "activeUser";
      } else {
        type = "forgetPwd";
      }
      sendNoTokenSms({
        mobile: this.form.mobile,
        captchaCode: this.form.code,
        smsType: type
      }).then(res => {
        console.log(res);
        if (res.data.code == "200") {
          this.msgCode = 1;
          this.disabled = true;
          var time = this.countDown;
          var countInterval = setInterval(() => {
            if (this.countDown !== 0) {
              this.countDown--;
            } else {
              this.msgCode = 0;
              this.disabled = false;
              this.countDown = time;
              clearInterval(countInterval);
            }
          }, 1000);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    ForgetPassword() {
      this.$refs["form"].resetFields();
      this.initlogin = 3;
    }
  },
  created() {
    //  window.onresize = () => {
    //     const windowWidth = document.body.clientWidth
    //     const windowHeight = document.body.clientHeight
    //     const windowAspectRatio = windowHeight / windowWidth
    //     let videoWidth
    //     let videoHeight
    //     if (windowAspectRatio < 0.5625) {
    //       videoWidth = windowWidth
    //       videoHeight = videoWidth * 0.5625
    //       this.fixStyle = {
    //         height: windowWidth * 0.5625 + 'px',
    //         width: windowWidth + 'px',
    //         'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
    //         'margin-left': 'initial'
    //       }
    //     } else {
    //       videoHeight = windowHeight
    //       videoWidth = videoHeight / 0.5625
    //       this.fixStyle = {
    //         height: windowHeight + 'px',
    //         width: windowHeight / 0.5625 + 'px',
    //         'margin-left': (windowWidth - videoWidth) / 2 + 'px',
    //         'margin-bottom': 'initial'
    //       }
    //     }
    //   }
  },
  watch: {
    initlogin(value) {
      if (value == 2 || value == 3) {
        captcha().then(res => {
          // console.log(res)
          this.codeSrc = res.data.data;
        });
      }
    }
  },
  computed: {
    disabled2() {
      if (this.initlogin == 2) {
        return !this.checkedProtocol;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/Scss/Login.scss";
</style>



