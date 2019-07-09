<template>
  <div id="index_section">
    <div class="steps" v-if="controlShow.leading_in==3?false:true">
      <div class="steps_item">
        <div>
          <img src="/static/img/1.png" alt>
          <div class="steps_title">上传学生和家长</div>
          <div class="steps_img">
            <img src="/static/img/箭头流程.png" alt>
          </div>
        </div>
      </div>
      <div class="steps_item">
        <div>
          <img src="/static/img/2灰.png" alt v-if="controlShow.leading_in==1?true:false">
          <img src="/static/img/2.png" alt v-if="controlShow.leading_in==2?true:false">
          <div class="steps_title">添加科目老师</div>
          <div class="steps_img">
            <!-- <img src="/static/img/箭头流程未.png" alt="" v-if="controlShow.leading_in==1?true:false"> -->
            <!-- <img src="/static/img/箭头流程.png" alt="" v-if="controlShow.leading_in==2?true:false"> -->
          </div>
        </div>
      </div>
      <!-- <div class="steps_item">
        <div><img src="/static/img/完成灰.png" alt="">
          <div class="steps_title">确认提交</div>
        </div>
      </div>-->
    </div>

    <div class="upload_type" v-if="controlShow.leading_in==1?true:false">
      <div class="upload_text">
        请
        <a href="/static/template/咪师学生导入模板.xlsx" download>下载模板</a>，按照模板上传本班的学生家长数据
      </div>
      <div class="upload_file">
        <input type="text" class="file_input" disabled>
        <el-upload
          class="upload-demo"
          ref="upload"
          name="toImportFile"
          action="/api/importStudent/importData"
          :before-upload="beforeAvatarUpload"
          :on-change="fileChange"
          :auto-upload="false"
          :headers="headers"
          :show-file-list="false"
          :multiple="false"
        >
          <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>
      <div class="upload_submit">
        <el-button round @click="jump" class="jump">跳过</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认导入</el-button>
      </div>
    </div>

    <div class="upload_type_two" v-if="controlShow.leading_in==2?true:false">
      <div class="title">
        <div>任课班级</div>
        <div>任课科目</div>
        <div>任课老师</div>
        <div>操作</div>
      </div>

      <el-form
        :inline="true"
        :model="dynamicValidateForm"
        class="demo-form-inline"
        ref="dynamicValidateForm"
      >
        <div
          class="form_children"
          v-for="(domain,index) in dynamicValidateForm.domains"
          :key="domain.index"
        >
          <el-form-item
            label
            :prop="'domains.'+index+'.classId'"
            :rules="{required: true, message: '班级不能为空', trigger: 'change'}"
          >
            <!-- <el-input v-model="dynamicValidateForm.className" class="form_name"></el-input> -->
            <el-select v-model="domain.classId" placeholder="请选择" @change="classChange(domain)">
              <el-option
                v-for="(item,index) in selectClass"
                :key="index"
                :label="item.label"
                :value="item.classId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label
            :prop="'domains.'+index+'.subjectId'"
            :rules="{required: true, message: '科目不能为空', trigger: 'change'}"
          >
            <el-select v-model="domain.subjectId" placeholder="请选择" @change="subjectChange(domain)">
              <el-option
                v-for="(item,index) in selectSbuject"
                :key="index"
                :label="item.subjectName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label
            :prop="'domains.'+index+'.teacherId'"
            :rules="{required: true, message: '教师不能为空', trigger: 'change'}"
          >
            <el-select v-model="domain.teacherId" placeholder="请选择" @change="teacherChange(domain)">
              <el-option
                v-for="(item,index) in selectTeacher"
                :key="index"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-row>
              <el-button type="danger" icon="el-icon-delete" circle @click="removeDomain(domain)"></el-button>
            </el-row>
            <!-- <el-button type="primary">删除</el-button> -->
          </el-form-item>
        </div>
      </el-form>

      <div class="button_group">
        <el-row>
          <el-button type="warning" icon="el-icon-plus" circle @click="addDomain"></el-button>
        </el-row>
      </div>
      <div class="form_group">
        <el-button @click="back">上一步</el-button>
        <el-button @click="submitData">提交</el-button>
      </div>
    </div>

    <div class="index_show" v-if="controlShow.leading_in==3?true:false">
      <div class="index_show_content" v-hasMenu>
        <div>
          教师：
          <span>{{teacherAdmin.teacherCount}}</span> 人
        </div>
        <div>
          学生：
          <span>{{teacherAdmin.studentCount}}</span> 人
        </div>
        <div>
          家长：
          <span>{{teacherAdmin.parentCount}}</span> 人
        </div>
        <div>
          积分：
          <span>{{teacherAdmin.bonusPoint}}</span> 分
        </div>
      </div>
      <div>
        <div @click="skip('classList')" v-if="controlShow.isHeadTeacher==1">
          <div class="relative" v-if="relatvieShow">
            <img src="/static/tip.png" alt>
          </div>
          <div>
            <img src="/static/img/班级管理.png" alt>
          </div>
          <div>班级管理</div>
        </div>

        <div @click="skip('classList')" v-if="controlShow.isHeadTeacher==0">
          <div>
            <img src="/static/img/班级管理.png" alt>
          </div>
          <div>任课班级</div>
        </div>

        <div @click="skip('approvalandpublication')">
          <div>
            <img src="/static/img/审批与发布.png" alt>
          </div>
          <div>审批与发布</div>
        </div>
        <div @click="skip('userInfo')">
          <div>
            <img src="/static/img/个人信息.png" alt>
          </div>
          <div>个人信息</div>
        </div>
      </div>
    </div>
    <!-- <div class="index_footer" v-if="controlShow.leading_in==3?true:false">
      <img src="/static/img/wave1.png" alt="">
      <img src="/static/img/wave2.png" alt="">
      <img src="/static/img/wave3.png" alt="">
    </div>-->
    <!-- 通知 -->
    <el-dialog
      id="register"
      :visible.sync="dialogTableVisible"
      :fullscreen="false"
      width="480px"
      top="15vh"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="notice">
        <div @click="goRegister">
          <img src="/static/register.png" alt>
        </div>
        <el-row style="margin-top:20px;">
          <el-button round @click="dialogTableVisible=false">关闭</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!-- 通知结束 -->

    <!-- 报名 -->
    <!-- <div class="suspend" v-if="dialogTableVisible2">
      <a href="http://dbqw0ng9pmd3cnjm.mikecrm.com/GcJmP3h" target="_blank">
        <img src="/static/suspend.png" alt @click="signUp()">
      </a>
    </div>
    <el-dialog
      :visible.sync="dialogTableVisible1"
      :fullscreen="false"
      width="1200px"
      top="5vh"
      :show-close="false"
      :close-on-click-modal="false"
      id="RedEnvelope"
    >
      <section>
        <div class="close">
          <img
            src="/static/close.png"
            alt
            @click="dialogTableVisible1=false;dialogTableVisible2=true"
          >
        </div>
        <a href="http://dbqw0ng9pmd3cnjm.mikecrm.com/GcJmP3h" target="_blank">
          <img style="max-width:100%;" src="/static/signUp.png" alt @click="signUp">
        </a>
      </section>
    </el-dialog> -->
    <!-- 报名结束 -->
    <!-- 红包领取 -->
    <!-- <div class="suspend" v-if="dialogTableVisibleRed2">
      <img src="/static/SmallIcon.png" alt @click="redRoll()">
    </div>
    <el-dialog
      :visible.sync="dialogTableVisibleRed"
      :fullscreen="false"
      width="1200px"
      top="5vh"
      :show-close="false"
      :close-on-click-modal="false"
      id="RedEnvelope"
    >
      <section>
        <img style="max-width:100%;" src="/static/Redenvelopecollection.png" alt>
        <div class="close">
          <img
            src="/static/close.png"
            alt
            @click="dialogTableVisibleRed=false;dialogTableVisibleRed2=true"
          >
        </div>
        <div class="rollContainer">
          <div class="rollContainerActivity" id="rollContainerActivity">
            <div
              class="roll_item"
              v-for="(item,index) in redPacketList"
              :key="index"
            >恭喜{{item}}获取10元奖励</div>
          </div>
        </div>
        <div class="giftsButton">
          <img src="/static/giftsButton.png" alt @click="RedEnvelopeCollection">
        </div>
      </section>

      <el-dialog
        width="30%"
        :visible.sync="innerVisible"
        append-to-body
        :show-close="false"
        :close-on-click-modal="false"
        id="innerVisible"
        top="6.8vh"
        style="box-shadow: none;background: transparent;"
      >
        <section v-if="redType==0">
          <img style="max-width:100%;" src="/static/Receivesuccess.png" alt>
          <div class="close">
            <img src="/static/close.png" alt @click="innerVisible=false">
          </div>
        </section>
        <section v-if="redType==1">
          <img style="max-width:100%;" src="/static/bindingDig.png" alt>
          <div class="close">
            <img src="/static/close.png" alt @click="innerVisible=false">
          </div>
        </section>
        <section v-if="redType==2" class="publishedResults">
          <img style="max-width:100%;" src="/static/issueDig.png" alt>
          <div class="close">
            <img src="/static/close.png" alt @click="innerVisible=false">
          </div>
          <div class="button">
            <img src="/static/issueButton.png" alt @click="redJump">
          </div>
        </section>
        <section v-if="redType==3">
          <img style="max-width:100%;" src="/static/okDig.png" alt>
          <div class="close">
            <img src="/static/close.png" alt @click="innerVisible=false">
          </div>
          <div class="button">
            <img
              src="/static/okButton.png"
              alt
              @click="innerVisible=false;dialogTableVisibleRed=false"
            >
          </div>
        </section>
      </el-dialog>
    </el-dialog> -->
    <!-- 红包领取结束-->
    <!-- ------------------------------------------------------------------------------------------- -->
    <!-- 积分 start -->
    <!-- 悬浮窗 -->
    <div class="integral_suspend"  v-if="dialogTableVisibleIntegral" @click="showIntegral">
      <img src="/static/integral2/教师后台_悬浮框.png" alt="">
    </div>
    <!-- 弹窗 -->
    <el-dialog
        width="710px"
        :visible.sync="dialogTableVisibleIntegral2"
        append-to-body
        :show-close="false"
        :close-on-click-modal="false"
        id="innerVisible"
        top="6vh"
        style="box-shadow: none;background: transparent;"
    >
      <section class="integralPop">
        <img src="/static/integral2/弹窗.png" alt="">
        <div class="closed">
          <img src="/static/closeButton.png" alt @click="dialogTableVisibleIntegral2=false;dialogTableVisibleIntegral=true">
        </div>
        <div class="btn" @click="skip('rank');dialogTableVisibleIntegral2=false;dialogTableVisibleIntegral=true">
            <img src="/static/integral2/弹窗-按钮.png" alt="">
        </div>
      </section>
    </el-dialog>
    <!-- 积分弹窗 end -->
    
  </div>
</template>

<script>
import {
  gradeClassInfo,
  teacherList,
  subjectList,
  existclassSubjectList,
  classSubjectSave,
  classSubjectdelete,
  teacherAdmin,
  gradeClassAllGradeClass,
  bonusPointLogSignIn,
  teacherUpdateGuideStep,
  SendWxRedPacketGetReceiveRedPacket, //滚动
  SendWxRedPacketSendRedPacket,
  ClickLogSave,
  SendWxRedPacketGetPopupAd,
  SendWxRedPacketSendRedPacketTime,
  adGetPopupAd  //弹窗控制接口
} from "@/api/api";
//引入Vuex辅助计算属性
import { mapState, mapActions } from "vuex";
import util from "@/util/util.js"

export default {
  data() {
    return {
      //表格选择数据
      teacherAdmin: {},
      selectSbuject: [],
      selectTeacher: [],
      selectClass: [],
      //控制文件是否上传成功状态

      fileType: true,

      relatvieShow: false,
      
      //红包
      way: true,
      href: "",
      href2: "",
      imgUrl: "",
      imgUrl2: "",
      // 积分悬浮窗
      dialogTableVisibleIntegral: false,
      dialogTableVisibleIntegral2: false,
      dialogTableVisible3: false,
      // dialogTableVisible1: false,
      // dialogTableVisible2: false,
      innerVisible: false,
      //红包滚动数据
      redPacketList: [],

      //红包活动页面显示控制
      dialogTableVisibleRed: false,
      dialogTableVisibleRed2: false,
      //红包领取状态控制
      redType: "4",
      //红包结束

      //控制是否签到
      dialogTableVisible: false,
      //首次登录获得积分对象
      integralObj: null,
      //文件列表
      // fileList: [],

      //班级信息集合
      classAndGradeNameObj: null,
      //动态添加的数据
      dynamicValidateForm: {
        domains: []
      }
    };
  },

  computed: {
    ...mapState(["controlShow"]),
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
  created() {
    //控制首次登入只出现一次图标
    if (!this.getLocalStorage("relatvieShow")) {
      this.relatvieShow = true;
      this.saveLocalStorage("relatvieShow", true);
    }
    // 控制12小时出现一次积分弹出框
    adGetPopupAd().then(res=> {
      if(res.data.code == 200) {
        var popObj = res.data.data.banner
        // console.log('adGetPopupAd',res.data.data.banner)
        // 任务尚未完成时12h弹出一次
        if(popObj.taskFinish == false) {
          if(popObj.url == "") {
            this.dialogTableVisibleIntegral = false;
            this.dialogTableVisibleIntegral2 = false;
          }else{
            // 活动有效期内
            if (!this.isShowTime("showPop",popObj.displayType)) {
              this.saveLocalStorage("showPop", Date.now());
              this.dialogTableVisibleIntegral = false;
              this.dialogTableVisibleIntegral2 = true;
            }else{
              this.dialogTableVisibleIntegral = true;
              console.log("showPop","xiatan")
            }
          }
        }else{
          if(popObj.url == "") {
            this.dialogTableVisibleIntegral = false;
            this.dialogTableVisibleIntegral2 = false;
          }else{
            this.dialogTableVisibleIntegral = true;
            this.dialogTableVisibleIntegral2 = false;
          }
        }
      }else{
        this.dialogTableVisibleIntegral2 = false;
      }
    })
    /**********************************************************************************************************************/
    // //控制发布成绩红包报名悬浮窗是否显示
    // SendWxRedPacketSendRedPacketTime({
    //   userType: 1
    // }).then(res => {
    //   if (res.data.code == 200) {
    //     console.log("res1", res.data);
    //     if (res.data.data.type == "1") {
    //       this.imgUrl = res.data.data.imgUrl;
    //       this.dialogTableVisibleRed = false; //
    //       this.dialogTableVisibleRed2 = false; //youxia
    //       this.dialogTableVisible2 = true;
    //     } else if (res.data.data.type == "2") {
    //       this.dialogTableVisible1 = false; //报名弹窗是否显示
    //       this.dialogTableVisible2 = false;
    //       //  this.dialogTableVisibleRed = false;
    //       if (!this.isShow("signUp")) {
    //         this.saveLocalStorage("signUp", Date.now());
    //         this.dialogTableVisibleRed = true;
    //       }
    //       this.dialogTableVisibleRed2 = true;
    //     } else {
    //       this.dialogTableVisible1 = false;
    //       this.dialogTableVisible2 = false;
    //       this.dialogTableVisibleRed = false; //
    //       this.dialogTableVisibleRed2 = false; //youxia
    //     }
    //   }
    // });
    //红包报名
    //控制是否发布通知模态框24小时出现一次
    //控制红包报名弹窗是否显示
    // SendWxRedPacketGetPopupAd({
    //   userType: 1
    // }).then(res => {
    //   if (res.data.code == 200) {
    //     console.log("res", res.data);
    //     if (res.data.data.id == "") {
    //       this.dialogTableVisible1 = false;
    //       this.imgUrl2 = res.data.data.imgUrl2;
    //     } else {
    //       if (!this.isShow("signUp")) {
    //         this.saveLocalStorage("signUp", Date.now());
    //         this.dialogTableVisible1 = true;
    //       }
    //     }
    //   }
    // });
    // //红包领取
    // if (!this.isShow("redUp")) {
    //   this.saveLocalStorage("redUp", Date.now());
    //   this.dialogTableVisibleRed = true;
    // }

    // //红包中奖滚动
    // SendWxRedPacketGetReceiveRedPacket().then(res => {
    //   this.redPacketList = res.data;
    //   this.roll();
    //   // }
    // });

    // //登录签到
    // bonusPointLogSignIn().then(res => {
    //   if (res.data.code == 200) {
    //     if (res.data.data) {
    //       const h = this.$createElement;
    //       this.$notify({
    //         title: "每天首次登录获得积分",
    //         message: h(
    //           "i",
    //           { style: "color: teal" },
    //           "恭喜获得" + res.data.data.receiveBonusPoint + "积分"
    //         )
    //       });
    //     } else {
    //       // console.log('不可以签到')
    //     }
    //   } else {
    //   }
    // });

    //获取所有的科目
    teacherList().then(res => {
      // console.log(res.data.data)
      this.selectTeacher = res.data.data;
    });
    subjectList().then(res => {
      // console.log(res.data.data)
      this.selectSbuject = res.data.data;
    });

    gradeClassAllGradeClass().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.selectClass = res.data.data;
      }
    });

    //已存在的导入信息
    existclassSubjectList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.dynamicValidateForm.domains = res.data.data;
        // //定时获取数据防止数据为空
        // var getClassInfo = setInterval(() => {
        //   // alert(1)
        //   if (
        //     this.getLocalStorage('gradeClassInfo') != 'undefined' &&
        //     this.getLocalStorage('gradeClassInfo') != null
        //   ) {
        //     // console.log(2)
        //     this.classAndGradeNameObj = this.getLocalStorage('gradeClassInfo')
        //     clearInterval(getClassInfo)
        //   }
        // }, 1000 / 60)
      } else {
        return;
      }
    });

    //获取未激活人数
    teacherAdmin().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.teacherAdmin = res.data.data;
      }
    });

    console.log(this.controlShow);

    if (
      this.controlShow.leading_in == 3 &&
      this.controlShow.isHeadTeacher == 1
    ) {
      this.setheaderNav(1);
      this.setclassShow(1);
    } else if (this.controlShow.isHeadTeacher == 0) {
      this.setheaderNav(1);
      this.setclassShow(0);
    }
  },
  methods: {
    ...mapActions(["setclassShow", "setheaderNav", "setleading_in"]),
    // 积分弹窗
    showIntegral() {
      this.dialogTableVisibleIntegral = false;
      this.dialogTableVisibleIntegral2 = true;
    },
    goRegister(){
      this.$router.push({ name: "userInfo" });
    },
    //红包报名
    // signUp() {
    //   ClickLogSave({
    //     statisticsType: 1,
    //     statisticsId: this.getLocalStorage("login_userInfo").id,
    //     source: 3
    //   }).then(res => {
    //     if (res.data.code == 200) {
    //       console.log(res);

    //       // window.open("http://dbqw0ng9pmd3cnjm.mikecrm.com/GcJmP3h", "_blank");
    //     }
    //   });
    // },
    // //红包领取事件
    // RedEnvelopeCollection() {
    //   SendWxRedPacketSendRedPacket().then(res => {
    //     if (res.data.code == 200) {
    //       console.log("res.data.data", res.data.data);
    //       if (res.data.data.type == 4) {
    //         const h = this.$createElement;
    //         this.$notify({
    //           title: "每天首次登录获得积分",
    //           message: h(
    //             "i",
    //             { style: "color: teal" },
    //             "红包领取异常！请联系咪师客服人员"
    //           )
    //         });
    //       } else {
    //         console.log("res.data.data", res.data.data.type);
    //         this.innerVisible = true;
    //         this.redType = res.data.data.type;
    //         // console.log(res);
    //       }
    //     }
    //   });
    // },

    // //红包小图标
    // redRoll() {
    //   this.dialogTableVisibleRed = true;
    //   setTimeout(() => {
    //     this.roll();
    //   }, 1000);
    // },
    // //滚动事件
    // roll() {
    //   console.log(document.getElementById("rollContainerActivity"));

    //   if (document.querySelector(".rollContainerActivity")) {
    //     var index = 0;
    //     var dom = document.querySelector(".rollContainerActivity");
    //     setInterval(() => {
    //       dom.style.top = "-" + index * 30 + "px";
    //       if (index == this.redPacketList.length) {
    //         index = 0;
    //       }
    //       index++;
    //     }, 3000);
    //   }
    // },
    // redJump() {
    //   this.$router.push({
    //     name: "schoolAchievement"
    //   });
    // },
    //红包结束

    jump() {
      this.setheaderNav(1);
      this.setleading_in(3);
      teacherUpdateGuideStep().then(res => {
        console.log(res);
      });
    },
    //文件上传
    fileChange(file) {
      // if (file.status == "success") {
      document.querySelector(".file_input").value = file.name;
      //控制只能上传一个（进行替换）
      // if (fileList.length > 1) {
      //   fileList.splice(0, 1)
      // }
      this.fileType = true;
      if (file.status == "success") {
        if (file.response.code == "200") {
          // this.imgshow = 2
          this.setleading_in(2);
        } else {
          this.fileType = false;
          this.$message.error(file.response.message);
        }
      }
    },
    //文件上传之前处理
    beforeAvatarUpload(file) {
      //控制上传文件格式
      let Xls = file.name.split(".");
      if (Xls[1] === "xls" || Xls[1] === "xlsx") {
        return file;
      } else {
        this.$message.error("上传文件只能是 xls/xlsx 格式!");
        return false;
      }
    },

    //文件提交
    submitUpload() {
      if (this.fileType) {
        this.$refs.upload.submit();
      } else {
        this.$message.error("文件已经失败请重新选择文件上传");
      }
    },

    classChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },
    subjectChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },
    teacherChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },

    back() {
      this.setleading_in(1);
    },

    //上传步骤控制
    submitData() {
      // console.log(this.dynamicValidateForm)
      this.$refs["dynamicValidateForm"].validate(valid => {
        if (valid) {
          // console.log(this.dynamicValidateForm.domains)
          classSubjectSave(
            JSON.stringify(this.dynamicValidateForm.domains)
          ).then(res => {
            if (res.data.code == "200") {
              console.log("Ok");
              this.setleading_in(3);
              this.setheaderNav(1);
              teacherUpdateGuideStep().then(res => {
                console.log(res);
              });
            } else {
              console.log(res);
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增表格
    addDomain() {
      this.dynamicValidateForm.domains.push({
        classId: "",
        gradeId: "",
        id: "",
        isHas: 1,
        subjectId: "",
        subjectName: "",
        teacherId: "",
        teacherName: ""
      });
    },

    //移除表格
    removeDomain(item) {
      console.log(item);
      if (item.isHas == 0) {
        console.log(1);
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            classSubjectdelete({ ids: item.id }).then(res => {
              console.log(res);
              if (res.data.code == 200) {
                var index = this.dynamicValidateForm.domains.indexOf(item);
                if (index !== -1) {
                  this.dynamicValidateForm.domains.splice(index, 1);
                }
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        console.log(2);
        var index = this.dynamicValidateForm.domains.indexOf(item);
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1);
        }
      }
    },

    //班级管理列表
    //审批与发布列表
    //个人信息列表
    skip(type) {
      this.setheaderNav(0);
      this.setclassShow(0);
      this.$router.push({
        name: type
      });
      // if (type == 'classList') {
      //   this.$router.push({
      //     name: type
      //   })
      // } else if (type == 'approvalandpublication') {
      //   this.$router.push({
      //     name: type
      //   })
      // } else if (type == 'userInfo') {
      //   this.$router.push({
      //     name: type
      //   })
      // } else {
      //   this.$router.push({
      //     name: 'index'
      //   })
      // }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/Scss/publicTemplate/Index.scss";

</style>