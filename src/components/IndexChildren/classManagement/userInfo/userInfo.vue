<template>
  <section id="userInfo">
    <div class="absoluteImg">
      <el-upload
        class="avatar-uploader"
        action="/api/storage/uploadSingleFile"
        :multiple="false"
        :show-file-list="false"
        :headers="headers"
        :on-success="handleAvatarSuccessImgSuccess"
        :before-upload="beforeAvatarUploadImg"
      >
        <img v-if="userInfo.teacherFaceImg" :src="this.imgJoInUrl() + userInfo.teacherFaceImg" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <!-- <i class="tip">上传头像</i> -->
      </el-upload>
      <div class="tip">上传正脸照</div>
      <!-- <img :src="" alt=""> -->
    </div>
    <div class="container">
      <div class="containerInfo">
        <div class="teacherName">
          教师姓名:
          <span>{{userInfo.realName}}</span>
        </div>
        <div class="six">
          性别:
          <span v-if="!sexEditShow">{{userInfo.sex==0?"男":"女"}}</span>
          <el-select
            v-model="userInfo.sex"
            placeholder="请选择"
            v-if="sexEditShow"
            @change="sexChange"
            style="width:50%"
          >
            <el-option
              v-for="item in sexoptions"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
          <img
            src="/static/img/change.png"
            alt
            class="change"
            v-if="!sexEditShow"
            @click="sexEditShow=true"
          >
          <el-button type="text" v-if="sexEditShow" @click="sexEditShow=false">取消</el-button>
        </div>
        <div class="idCard">
          身份证号码:
          <span>{{hiddenCardNO==''?'无':hiddenCardNO}}</span>
          <img src="/static/img/change.png" alt class="change" @click="dialogVisibleCard=true">
        </div>
        <div class="job">
          职务:
          <span>{{userInfo.highestTitleName}}</span>
        </div>
        <div class="subject">
          学科:
          <span>{{userInfo.subjects==''?'无':userInfo.subjects}}</span>
        </div>
        <div class="mobile">
          手机号码:
          <span>{{userInfo.mobile}}</span>
          <img src="/static/img/change.png" alt class="change" @click="dialogVisibleMobile=true">
          <!-- <el-button type="text">修改</el-button> -->
        </div>
        <div class="password">
          密码:
          <span>{{pwType?userInfo.password:pwHidden}}</span>
          <img src="/static/img/change.png" alt class="change" @click="dialogVisiblePw=true">
          <!-- <el-button type="text">修改密码</el-button> -->
        </div>
      </div>
    </div>
    <div class="schedule">
      <div class="icon_title">
        <img src="/static/img/积分icon.png" alt>
        <span>{{userInfo.bonusPoint}}</span>积分
        <!-- <img src="/static/img/change.png" alt=""> -->
        <el-button type="text" @click="goRouter">查看积分</el-button>
      </div>
      <div class="icon_tip">
        <el-button class="ClickSignIn" @click="ClickSignIn" v-if="!buttonFlag">点击签到</el-button>
        <div v-if="buttonFlag">
          已连续签到
          <span>{{dayANDpoint.signInDays}}</span> 天，连续越多获奖越多哟～
        </div>
      </div>

      <div class="backgorundImg">
        <ul class="five">
          <li v-for="(item,index) in fivePoint" :key="index" v-html="item">
            <span>{{item}}</span>
          </li>
          <li>
            <img src="/static/img/礼物.png" alt>
          </li>
        </ul>
        <ul class="six">
          <li>
            <img src="/static/img/礼物.png" alt>
          </li>
          <li v-for="(item,index) in sixPoint" :key="index" v-html="item">
            <span>{{item}}</span>
          </li>
        </ul>
        <ul class="eight">
          <li v-for="(item,index) in eightPoint" :key="index" v-html="item">
            <span>{{item}}</span>
          </li>
          <li>
            <img src="/static/img/礼物.png" alt>
          </li>
        </ul>
        <ul class="thirteen">
          <li>
            <img src="/static/img/礼物.png" alt>
          </li>
          <li v-for="(item,index) in thirteen" :key="index" v-html="item">
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 修改手机号码模态框 -->
    <el-dialog
      :visible.sync="dialogVisibleMobile"
      :before-close="handleClose"
      class="reviseMobile"
      :fullscreen="false"
      center
      :inline-message="true"
      status-icon
      width="40%"
    >
      <div slot="title" class="reviseTitle">修改手机号码</div>
      <div class="reviseTip">更换手机后，下次登录使用新手机号登录，密码不变。 当前手机号：{{userInfo.mobile}}</div>

      <el-form
        class="reviseContent"
        label-position="right"
        label-width="100px"
        :model="reviseInfo"
        ref="reviseInfo"
        :rules="isreviseInfo"
      >
        <el-form-item label="手机号码:" prop="mobile">
          <el-input v-model="reviseInfo.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码:" prop="messageCode" required>
          <el-col :sm="10" :md="12">
            <el-form-item>
              <el-input v-model="reviseInfo.messageCode" placeholder="请输入短信验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="14" :md="12">
            <el-form-item>
              <el-button
                type="primary"
                @click="gainCode(1)"
                :disabled="isdisabled"
              >{{isdisabled?smsNum+'秒':'获取短信验证码'}}</el-button>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMobile=false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleMobileOK('reviseInfo')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改手机号码模态框结束 -->
    <!-- 修改密码模态框 -->
    <el-dialog
      :visible.sync="dialogVisiblePw"
      :before-close="handleClose"
      class="reviseMobile"
      :fullscreen="false"
      center
      :inline-message="true"
      :close-on-click-modal="true"
      status-icon
      width="40%"
    >
      <div slot="title" class="reviseTitle">修改密码</div>
      <el-form
        class="reviseContent"
        label-position="right"
        label-width="100px"
        :model="reviseInfoPw"
        ref="reviseInfoPw"
        :rules="isreviseInfoTwo"
      >
        <el-form-item label="手机号码:" prop="mobile">
          <el-input v-model="reviseInfoPw.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>

        <el-form-item label="旧密码:" prop="pastpw">
          <el-input v-model="reviseInfoPw.pastpw" type="password" placeholder="请输入旧密码"></el-input>
        </el-form-item>

        <el-form-item label="新密码:" prop="pw">
          <el-input v-model="reviseInfoPw.pw" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>

        <el-form-item label="确认密码:" prop="pwTwo">
          <el-input v-model="reviseInfoPw.pwTwo" type="password" placeholder="请输入确认密码"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePw=false">取 消</el-button>
        <el-button type="primary" @click="dialogVisiblePwOK('reviseInfoPw')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码模态框结束 -->
    <!-- 修改身份证号码 -->
    <el-dialog
      :visible.sync="dialogVisibleCard"
      :before-close="handleClose"
      class="reviseMobile"
      :fullscreen="false"
      center
      :inline-message="true"
      :close-on-click-modal="true"
      status-icon
      width="40%"
    >
      <div slot="title" class="reviseTitle">修改身份证号码</div>
      <el-form
        class="reviseContent"
        label-position="right"
        label-width="100px"
        :model="reviseInfoCard"
        ref="reviseInfoCard"
        :rules="isreviseInfoCard"
      >
        <el-form-item label="身份证号码:" prop="Card">
          <el-input v-model="reviseInfoCard.Card" placeholder="请输入身份证号码" type="password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCard=false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleCardOk('reviseInfoCard')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改身份证结束-->
  </section>
</template>
<script>
import {
  userInfo, //渲染页面个人信息
  captcha,
  getSignInPoints, //渲染页面积分
  updateInfo, //修改信息
  modifyMobile, //修改手机号码
  sendSms, //手机验证码
  bonusPointLogSignIn, //签到
  commonDictList,
  SingInIsSign
} from "@/api/api.js";
export default {
  inject: ["reload"],
  data() {
    //修改手机自定义验证方法
    var verifyMobile = {
      //自定义验证手机号码
      Mobile: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空!"));
          // return callback(new Error(this.$t("message.mobile")));
        } else if (
          !value.match(
            /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
          )
        ) {
          return callback(new Error("请输入正确的手机号码!"));
        } else {
          callback();
        }
      }
    };
    //修改密码自定义验证方法
    var verifyPw = {
      //自定义验证手机号码
      Mobile: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空!"));
          // return callback(new Error(this.$t("message.mobile")));
        } else if (
          !value.match(
            /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
          )
        ) {
          return callback(new Error("请输入正确的手机号码!"));
        } else {
          callback();
        }
      },

      Pw2: (rule, value, callback) => {
        var specialPWDEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
          specialPWDCN = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (!value) {
          return callback(new Error("请输入确认密码!"));
        } else if (this.reviseInfoPw.pw.length < 8) {
          return callback(new Error("密码八个字符以上"));
        } else if (
          specialPWDCN.test(this.reviseInfoPw.pw) ||
          specialPWDEn.test(this.reviseInfoPw.pw)
        ) {
          return callback(
            new Error("密码不能包含特殊字符,请输入八位以上的字母或数字")
          );
        } else if (value !== this.reviseInfoPw.pw) {
          console.log(value, this.reviseInfoPw.pw);
          return callback(new Error("两次输入的密码不一致!"));
        } else {
          return callback();
        }
      }
    };
    var verifCard = {
      Card: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("身份证不能为空"));
        } else if (
          !value.match(
            /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
          )
        ) {
          return callback(new Error("请输入正确的身份证号码"));
        } else {
          callback();
        }
      }
    };

    return {
      buttonFlag: true,
      //sexEditShow
      sexoptions: [],
      sexEditShow: false,
      pwType: false, //控制密码显示影藏
      pwHidden: "****************",
      userInfo: {}, //用户信息对象
      dayANDpoint: {}, //用户积分对象
      dialogVisibleMobile: false, //控制修改手机
      dialogVisiblePw: false,
      dialogVisibleCard: false,
      codeSrc: "", //图形验证码
      isdisabled: false,
      smsNum: 60,
      avatarImg: "",
      reviseInfoCard: {
        Card: ""
      },
      isreviseInfoCard: {
        Card: [{ validator: verifCard.Card, trigger: "blur" }]
      },
      hiddenCardNO: "",
      //修改手机数据
      reviseInfo: {
        mobile: "",
        // imgCode: '',
        messageCode: ""
      },
      //手机验证
      isreviseInfo: {
        mobile: [{ validator: verifyMobile.Mobile, trigger: "blur" }],
        messageCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ]
      },
      //修改密码数据
      reviseInfoPw: {
        mobile: "",
        pastpw: "",
        pw: "",
        pwTwo: ""
      },
      //密码验证
      isreviseInfoTwo: {
        mobile: [{ validator: verifyPw.Mobile, trigger: "blur" }],
        pastpw: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        pw: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        pwTwo: [{ validator: verifyPw.Pw2, trigger: "blur" }]
      },
      //签到图案  每个数组的长度必须为6  避免出现适配问题
      fivePoint: ["", "", "", "", "", ""],
      sixPoint: ["", "", "", "", "", ""],
      eightPoint: ["", "", "", "", "", ""],
      thirteen: ["", "", "", "", "", ""]
    };
  },

  created() {
    //判断是否可以签到
    SingInIsSign().then(res => {
      if (res.data.code == 200) {
        this.buttonFlag = res.data.data.isSign;
      }
    });
    //审批状态下拉选择,通知状态下拉选择
    commonDictList({ dataTypeCodes: "sex_type_code" }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.sexoptions = res.data.data.sex_type_code;
      }
    });

    //获取图形验证码
    captcha().then(res => {
      if (res.data.code == "200") {
        this.codeSrc = res.data.data;
      }
    });

    //获取用户信息
    userInfo().then(res => {
      console.log(res);
      if (res.data.code == "200") {
        this.avatarImg = res.data.data.avatarImg;
        this.userInfo = res.data.data;
        this.reviseInfoPw.mobile = res.data.data.mobile;
        this.reviseInfoCard.Card = res.data.data.cardNo;
        //对身份证号码加密
        if (this.userInfo.cardNo.length == 15) {
          this.hiddenCardNO = this.userInfo.cardNo.replace(
            this.userInfo.cardNo.substring(6, 12),
            "******"
          );
        } else {
          this.hiddenCardNO = this.userInfo.cardNo.replace(
            this.userInfo.cardNo.substring(6, 14),
            "********"
          );
        }
      } else {
        console.log(res.data.message);
      }
    });
    //获取用户积分
    getSignInPoints().then(res => {
      if (res.data.code == "200") {
        this.dayANDpoint = res.data.data;
        // this.dayANDpoint.signInDays = 100        //测试签到图案 是否随 签到天数改变而改变
      }
      if (this.dayANDpoint.signInDays !== 0) {
        if (this.dayANDpoint.signInDays < 7) {
          for (var i = 0; i < this.dayANDpoint.signInDays; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
          }
        } else if (
          this.dayANDpoint.signInDays == 7 ||
          this.dayANDpoint.signInDays == 8
        ) {
          for (var i = 0; i < 6; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
          }
        } else if (
          this.dayANDpoint.signInDays > 8 &&
          this.dayANDpoint.signInDays < 14
        ) {
          var a = this.dayANDpoint.signInDays - 9;
          for (var i = 0; i < 6; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
          }

          for (var j = 0; j <= a; j++) {
            this.sixPoint.splice(
              j,
              1,
              "<img src='/static/img/金币+6.png' alt='' >"
            );
          }
        } else if (this.dayANDpoint.signInDays == 14) {
          var a = this.dayANDpoint.signInDays - 9;
          for (var i = 0; i < 6; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
          }

          for (var j = 0; j <= a; j++) {
            this.sixPoint.splice(
              j,
              1,
              "<img src='/static/img/金币+6.png' alt='' >"
            );
          }
        } else if (
          this.dayANDpoint.signInDays > 14 &&
          this.dayANDpoint.signInDays < 21
        ) {
          var a = this.dayANDpoint.signInDays - 15;
          for (var i = 0; i < 6; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
            this.sixPoint.splice(
              i,
              1,
              "<img src='/static/img/金币+6.png' alt='' >"
            );
          }

          for (var j = 0; j <= a; j++) {
            this.eightPoint.splice(
              j,
              1,
              "<img src='/static/img/金币+8.png' alt='' >"
            );
          }
        } else if (
          this.dayANDpoint.signInDays == 21 ||
          this.dayANDpoint.signInDays == 22
        ) {
          for (var i = 0; i < 6; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
            this.sixPoint.splice(
              i,
              1,
              "<img src='/static/img/金币+6.png' alt='' >"
            );
            this.eightPoint.splice(
              i,
              1,
              "<img src='/static/img/金币+8.png' alt='' >"
            );
          }
        } else if (
          this.dayANDpoint.signInDays > 22 &&
          this.dayANDpoint.signInDays <= 28
        ) {
          var a = this.dayANDpoint.signInDays - 22;
          for (var i = 0; i < 6; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
            this.sixPoint.splice(
              i,
              1,
              "<img src='/static/img/金币+6.png' alt='' >"
            );
            this.eightPoint.splice(
              i,
              1,
              "<img src='/static/img/金币+8.png' alt='' >"
            );
          }

          for (var j = 0; j < a; j++) {
            this.thirteen.splice(
              j,
              1,
              "<img src='/static/img/金币+13.png' alt='' >"
            );
          }
        } else if (this.dayANDpoint.signInDays > 28) {
          for (var i = 0; i < 6; i++) {
            this.fivePoint.splice(
              i,
              1,
              "<img src='/static/img/金币+5.png' alt='' >"
            );
            this.sixPoint.splice(
              i,
              1,
              "<img src='/static/img/金币+6.png' alt='' >"
            );
            this.eightPoint.splice(
              i,
              1,
              "<img src='/static/img/金币+8.png' alt='' >"
            );
            this.thirteen.splice(
              i,
              1,
              "<img src='/static/img/金币+13.png' alt='' >"
            );
          }
        }
      }
    });
  },
  computed: {
    headers() {
      if (TOKEN) {
        return {
          Authorization: TOKEN
        };
      } else {
        this.$router.push("/");
      }
    }
  },

  methods: {
    //点击签到
    ClickSignIn() {
      bonusPointLogSignIn().then(res => {
        if (res.data.code == 200) {
          if (res.data.data) {
            const h = this.$createElement;
            if(res.data.data.allBonusPoint == "") {
              this.$notify({
                title: "签到成功",
                message: h(
                  "i",
                  { style: "color: teal" },
                  "恭喜获得" + res.data.data.receiveBonusPoint + "积分"
                  // "恭喜获得" + res.data.data.receiveBonusPoint + "积分" + ',当前总积分' + res.data.data.allBonusPoint + '分'
                )
              });
            }else{
              this.$notify({
              title: "签到成功",
              message: h(
                "i",
                { style: "color: teal" },
                "恭喜获得" + res.data.data.receiveBonusPoint + "积分" + ',当前总积分' + res.data.data.allBonusPoint + '分'
              )
            });
            }
            
            this.reload();
          } else {
            alert("不可以签到");
          }
        } else {
        }
      });
    },

    sexChange() {
      updateInfo({ sex: this.userInfo.sex }).then(res => {
        if (res.data.code == 200) {
          this.sexEditShow = false;
        }
      });
    },

    //学生头像
    handleAvatarSuccessImgSuccess(res, file) {
      console.log(res);
      if (res.code == 200) {
        
        this.$set(this.userInfo,'teacherFaceImg',res.data.url)

        // this.userInfo.avatarImg = res.data.url;
        // this.avatarImg = this.imgJoInUrl() + res.data.url;
        // this. = this.imgJoInUrl() + res.data.url
        // console.log(this.studentImg)
        updateInfo({
          teacherFaceImg: this.userInfo.teacherFaceImg
        }).then(res => {
          if (res.data.code == 200) {
            console.log(1);
          }
        });
        // this.dynamicValidateForm.studentImg =  res.data.url  // this.imageUrl = URL.createObjectURL(file.raw)
        // this.$message.success(res.message)
      } else {
        console.log("失败");
      }
    },

    //图片上传之前处理
    beforeAvatarUploadImg(file) {
      console.log(file.type);
      //控制上传文件格式
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式和PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // console.log(file)
      return (isJPG || isPNG) && isLt2M;
    },

    //刷新验证码
    randomImg(even) {
      captcha().then(res => {
        this.codeSrc = res.data.data;
      });
    },

    //关闭模态框
    handleClose(done) {
      done();
    },

    //查看积分跳转
    goRouter() {
      this.$router.push("integralDetail");
    },

    //获取短信验证码
    gainCode() {
      this.$refs["reviseInfo"].validateField("mobile", message => {
        if (message == "") {
          sendSms({
            mobile: this.reviseInfo.mobile,
            smsType: "modifyMobile"
          }).then(res => {
            if (res.data.code == 200) {
              this.isdisabled = true;
              if (this.smsNum != 0) {
                var _this = this;
                var reckonSmsNum = setInterval(function() {
                  _this.smsNum--;
                }, 1000);
              } else {
                clearInterval(reckonSmsNum);
              }
            } else {
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    //修改手机号码后的确定事件
    dialogVisibleMobileOK(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          modifyMobile({
            newMobile: this.reviseInfo.mobile,
            newMobileCode: this.reviseInfo.messageCode
          }).then(res => {
            console.log(res);
            if (res.data.code == 200) {
              this.dialogVisibleMobile = false;
              this.reload();
            } else {
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    //修改密码后的确认事件
    dialogVisiblePwOK(form) {
      console.log(form);
      this.$refs[form].validate(valid => {
        console.log(valid);
        if (valid) {
          updateInfo({
            password: this.reviseInfoPw.pastpw,
            newPassword: this.reviseInfoPw.pwTwo
          }).then(res => {
            if (res.data.code == 200) {
              var _this = this;
              this.$message({
                type: "success",
                message: res.data.message + "将在3秒后跳转至登录界面",
                duration: 3000,
                onClose: function(mes) {
                  _this.removeItem("token");
                  _this.$router.push("/");
                }
              });
            } else {
              this.reviseInfoPw.pastpw = "";
              this.reviseInfoPw.pw = "";
              this.reviseInfoPw.pwTwo = "";
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    dialogVisibleCardOk(form) {
      this.$refs[form].validate(valid => {
        console.log(valid);
        if (valid) {
          updateInfo({
            cardNo: this.reviseInfoCard.Card
          }).then(res => {
            if (res.data.code == 200) {
              this.dialogVisibleCard = false;
              this.reload();
            } else {
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../../assets/Scss/publicTemplate/UserInfoAndWeater.scss";
</style>




