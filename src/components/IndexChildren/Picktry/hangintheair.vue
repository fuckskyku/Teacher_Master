<template>
  <div class="hangintheair">
    <el-button :plain="true" @click="open" style="display:none">打开消息提示</el-button>
    <!-- 第一步  未激活家长 -->
    <div class="hangintheair"  v-if="parent">
      <!-- <div> -->
      <img src="/static/insetImg/插画/点我试试/插图.png" alt="">
      <!-- </div> -->
      <div class="text_group">
        <div class="first-child">竟然还有
          <span>{{tobeDone.number}}</span> 个家长未激活</div>
        <div class="last-child">马上通知他们激活吧～</div>
      </div>
      <div class="button_group">
        <el-button @click="centerDialogVisible = true">{{tobeDone.buttonName}}</el-button>
        <el-button @click="skip(2)">略过</el-button>
      </div>
    </div>

    <!-- 弹出层  绑定于未激活家长模态的通知事件 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="20%"
        center>
        <span>我们将以短信形式通知未激活的家长激活，是否马上通知？<div style="color:red;margin-top:20px;">(注：每24h可以通知一次)</div></span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="unactivatedParent()">确 定</el-button>
          <el-button @click="centerDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    <!-- 第二步  审核文章 -->
    <div class="hangintheair" v-if="article">
      <!-- <div> -->
          <img src="/static/insetImg/插画/点我试试/Blog 2.png" alt="">
      <!-- </div> -->
          <div class="text_group">
        <div class="first-child">有
          <span>{{toArticle.number}}</span> 篇文章待审批</div>
        <div class="last-child">马上去审批吧～</div>
      </div>
      <div class="button_group">
        <el-button @click="examineArticle()">{{toArticle.buttonName}}</el-button>
        <el-button @click="skip(3)">略过</el-button>
      </div>
    </div>
    <!-- 第三步  未读抄送 -->
    <div class="hangintheair" v-if="copyInfo">
      <!-- <div> -->
          <img src="/static/insetImg/插画/点我试试/抄送.png" alt="">
      <!-- </div> -->
          <div class="text_group">
        <div class="first-child">有
          <span>{{toCopyInfo.number}}</span> 个新的抄送还未读哦</div>
          <div class="last-child">去看看吧~</div>
      </div>
      <div class="button_group">
        <el-button @click="unreadCopyInfo()">{{toCopyInfo.buttonName}}</el-button>
        <el-button @click="skip(4)">略过</el-button>
      </div>
    </div>    
    <!-- 第四步  发布作业 -->
    <div class="hangintheair" v-if="Assignment">
      <!-- <div> -->
          <img src="/static/insetImg/插画/点我试试/Homepage.png" alt="">
      <!-- </div> -->
          <div class="text_group">
        <div class="first-child">{{toAssignment.message}}</div>
          <div class="last-child">赶紧去发布作业</div>
      </div>
      <div class="button_group">
        <el-button @click="publishWork()">{{toAssignment.buttonName}}</el-button>
        <el-button @click="skip(5)">略过</el-button>
      </div>
    </div>
    <!-- 最后  已完成所有代办 -->
    <div class="hangintheair" v-if="end">
      <!-- <div> -->
      <img src="/static/insetImg/插画/点我试试/Success Box.png" alt="">
      <!-- </div> -->
      <div class="text_group">
        <div class="first-child">已完成所有待办,明天再来看看吧~</div>
      </div>
      <div class="button_group">
        <el-button @click="back()" class="back">返回首页</el-button>
      </div>
    </div>
  </div>

</template>
<script>
import dogin from "@/api/hangInTheair.js";
import {parentsendBatchParentActivateNoticet,
        assignHomework
} from "@/api/api.js";
export default {
  data() {
    return {
      indexShow: 0,
      parent: false, //第一步  未激活家长
      article: false, //第二步  审批文章
      copyInfo: false, //第三布  未读抄送
      Assignment: false, //第四步  发布作业
      end: false, //最后    已完成所有待办事件
      tobeDone: {},
      toArticle: {},
      toCopyInfo: {},
      toAssignment: {},
      //家长激活模态框
      centerDialogVisible: false,
      hint:'',
      IsTeacher:''
      
    };
  },
  methods: {
    back() {
      this.$router.push({ path: "/" });
    },
    //未激活家长  --马上激活
    unactivatedParent() {
      parentsendBatchParentActivateNoticet().then(res=>{
                this.centerDialogVisible = false;
                var a = res.data.message
                this.$options.methods.open.bind(this)(a)
                this.$options.methods.skip.bind(this)(2)
      })
    },
    open(b){
        this.$message(b);
    },
    skip(eventData) {
      //略过时判断哪个步骤有未处理的待办事件 直接进入该步骤
        dogin(eventData).then(res=>{
          if(res.type==2){
              this.parent = false
              this.article = true
              this.copyInfo = false
              this.Assignment = false
              this.end = false
              this.toArticle = res
          }else if(res.type==3){
              this.parent = false
              this.article = false
              this.copyInfo = true
              this.Assignment = false
              this.end = false
              this.toCopyInfo = res
          }else if(res.type==4){
              this.parent = false
              this.article = false
              this.copyInfo = false
              this.Assignment = true
              this.end = false
              this.toAssignment = res
          }else if(res.type==5){
              this.parent = false
              this.article = false
              this.copyInfo = false
              this.Assignment = false
              this.end = true
          }
        })
    },

    //审批    --马上审核
    examineArticle() {
      this.removeItem('isShowExaminationTime');
      this.$router.push({ path: "/examination" });
    },
    //抄送    --马上去读
    unreadCopyInfo() {
      this.removeItem('isShowCopyTime');
      this.$router.push({ path: "/copyittome" });
    },
    //发布作业     --马上发布
    publishWork() {
      this.$router.push({ path: "/publishobj" });
    }
  },

  created() {
      var IsHeadTeacer = this.$store.state.controlShow.isHeadTeacher
      //判断是否为普通教师
    if(IsHeadTeacer == 0){                   //如果是普通教师
        dogin(2).then(res=>{
          if(res.type ==2){
              this.parent = false
              this.article = true
              this.copyInfo = false
              this.Assignment = false
              this.end = false
              this.toArticle = res
          }else if(res.type ==3){
              this.parent = false
              this.article = false
              this.copyInfo = true
              this.Assignment = false
              this.end = false
              this.toCopyInfo = res
          }else if(res.type ==4){
              this.parent = false
              this.article = false
              this.copyInfo = false
              this.Assignment = true
              this.end = false
              this.toAssignment = res
          }else if(res.type ==5){
              this.parent = false
              this.article = false
              this.copyInfo = false
              this.Assignment = false
              this.end = true
          }
        })
    }else{    //如果是班主任
            dogin(1).then(res=>{
          //通过返回的type来判断未处理的待办事件  页面加载完成呈现第一个未处理的待办事件
          if(res.type ==1 ){
              this.parent = true
              this.article = false
              this.copyInfo = false
              this.Assignment = false
              this.end = false
              this.tobeDone = res
          }else if(res.type ==2){
              this.parent = false
              this.article = true
              this.copyInfo = false
              this.Assignment = false
              this.end = false
              this.toArticle = res
          }else if(res.type ==3){
              this.parent = false
              this.article = false
              this.copyInfo = true
              this.Assignment = false
              this.end = false
              this.toCopyInfo = res
          }else if(res.type ==4){
              this.parent = false
              this.article = false
              this.copyInfo = false
              this.Assignment = true
              this.end = false
              this.toAssignment = res
          }else if(res.type ==5){
              this.parent = false
              this.article = false
              this.copyInfo = false
              this.Assignment = false
              this.end = true
          }
      })
    }
  }
};
</script>
<style lang="scss">
@import '../../../assets/Scss/publicTemplate/UserInfoAndWeater.scss'
</style>
