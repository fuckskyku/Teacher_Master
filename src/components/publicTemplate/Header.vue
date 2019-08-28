<template>
  <header>
    <div class="header_container">
      <div class="title">
        <img src="/static/img/logo.png" alt> 喵喵教师平台
      </div>
      <div class="select-nav">
        <span>更换:</span>
        <el-tooltip class="item" effect="dark" :content="contentText" placement="bottom">
          <el-select v-model="value" placeholder="请选择" @change="SchoolChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.schoolName"
              :value="item.schoolId"
            ></el-option>
          </el-select>
        </el-tooltip>
      </div>
      <div class="header-nav">
        <el-dropdown
          placement="top"
          v-if="controlShow.headerNav==0?true:false"
          @command="headerNavOneClick"
        >
          <span class="el-dropdown-link">审批与发布</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="data in headerNavOneData"
              :key="data.value"
              :command="data.name"
            >{{data.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown
          placement="top"
          v-if="controlShow.headerNav==0?true:false"
          @command="headerNavTwoClick"
          v-hasButton
        >
          <span class="el-dropdown-link">班级管理</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="data in headerNavTwoData"
              :key="data.value"
              :command="data.name"
            >{{data.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="try" v-if="controlShow.headerNav==1?true:false" @click="picktry">
          <img src="/static/img/cousor.png" alt>点我试试
        </div>

        <el-dropdown placement="top" @command="headerNavThreeClick">
          <span class="el-dropdown-link">{{headerInfo}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="info">个人信息</el-dropdown-item>

            <el-dropdown-item command="suggestion">意见反馈</el-dropdown-item>

            <el-dropdown-item command="out">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <Suggestion :isShow.sync="Show"></Suggestion>
    </div>
  </header>
</template>

<script>
//接口学校列表
import { teacherSchools, switchSchool } from "@/api/api.js";
import { mapState, mapActions } from "vuex";
import Suggestion from "@/components/publicTemplate/dialogList/dialogSuggestion";

export default {
  inject: ["reload"],
  data() {
    return {
      username: "",
      //切换学校的数据
      options: [],
      Show: false,
      value: this.getLocalStorage("login_userInfo").schoolId,
      //登入用户的数据
      headerInfo: this.getLocalStorage("login_userInfo").realName,
      //头部导航的数据
      headerNavOneData: [
        { value: "0", label: "审批管理", name: "examination" },
        { value: "1", label: "抄送我的", name: "copy" },
        { value: "2", label: "发布作业", name: "publishobj" },
        { value: "3", label: "发布通知", name: "issuenotice" },
        { value: "4", label: "风采管理", name: "stylenotice" }
      ],
      headerNavTwoData: [
        { value: "0", label: "班级通知", name: "notice" },
        { value: "1", label: "班级考勤", name: "check" },
        { value: "2", label: "班级作业", name: "homework" },
        { value: "3", label: "科目管理", name: "TeacherGradeClass" },
        { value: "4", label: "班级学生", name: "StudentGradeClass" },
        { value: "5", label: "学生家长", name: "Family" },
        { value: "6", label: "学业成绩", name: "schoolAchievement" },
        { value: "7", label: "平时成绩", name: "PeacetimePerformance" },
        { value: "8", label: "发送记录", name: "" }
      ]
      // headerNavThreeData: [{}]
    };
  },
  computed: {
    ...mapState(["controlShow", "crumbsList"]),
    contentText() {
      return this.transform(this.value, "schoolId", this.options, "schoolName")
        .val;
    }
  },
  methods: {
    ...mapActions([
      "setclassShow",
      "setheaderNav",
      "setleading_in",
      "setisHeadTeacher",
      "setCrumbsList"
    ]),
    headerNavOneClick(command) {
      console.log(command);
      this.$router.push({ name: command });
      // this.$message('click on item ' + command)
    },
    headerNavTwoClick(command) {
      console.log(command);
      this.$router.push({ name: command });
      // this.$message('click on item ' + command)
    },
    //点击退出
    headerNavThreeClick(command) {
      if (command == "info") {
        this.$router.push({ path: "userInfo" });
      } else if (command == "out") {
        this.removeItem("token");
        this.clearLocalStorage();
        this.setCrumbsList([]);
        this.$router.push({ path: "/Login" });
      } else if (command == "suggestion") {
        this.Show = true;
        console.log(this.Show);
      }
    },
    picktry() {
      this.$router.push({ path: "/weather" });
      this.setclassShow(0);
      this.setheaderNav(0);
    },
    //切换学校
    SchoolChange(val) {
      // console.log(val)
      switchSchool({ schoolId: val }).then(res => {
        // this.$router.push('/')
        if (res.data.code == 200) {
          // console.log(res.data.data)
          if (res.data.data.isHeadTeacher == "1") {
            this.setisHeadTeacher(1);
            this.setclassShow(1);
          } else {
            this.setisHeadTeacher(0);
            this.setleading_in(3);
            this.setheaderNav(1);
            this.setclassShow(0);
          }
          this.saveAllLocalStorage(res.data.data, "login_userInfo", [
            "permissions",
            "realName",
            "schoolName",
            "schoolId",
            "guideStep",
            "isHeadTeacher"
          ]);
          // //存储token
          this.saveLocalStorage("token", res.data.data.token);
          this.$router.go(0);
        }
      });
    }
  },
  components: { Suggestion },
  created() {
    // console.log(this.setCrumbsList())
    // console.log(this.value)
    teacherSchools().then(res => {
      console.log(res, 1);
      this.options = res.data.data;
      // console.log(res)
    });
  },

  beforeRouteEnter(to, from, next) {
    // console.log(1111111111111)
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  }
};
</script>
<style lang="scss">
@import "@/assets/Scss/publicTemplate/Header.scss";
</style>

