
<template>
  <div id="container">
    <!-- {{nav}} -->
    <ul>
      <li
        v-for="(item,index) in controlShow.isHeadTeacher==1?nav:navTwo"
        :key="index"
        @click="navChange(index,item.pathName)"
        @mouseenter="navMove(index,item)"
        @mouseleave="navLeave(item)"
      >
        <img :src="item.img" alt>
        {{item.label}}
        <transition
          mode="out-in"
          enter-active-class="animatedOne zoomIn"
          leave-active-class="animatedOne zoomOut"
        >
          <ul v-show="item.childrenListShow" v-if="item.children" :class="'ulChildren'+ index">
            <li
              v-for="(item,index) in item.children"
              :key="index"
              @click.stop="navChildren(item.pathName)"
            >{{item.label}}</li>
          </ul>
        </transition>
      </li>
    </ul>
    <ul>
      <li
        v-show="indexBgShow==index?true:false"
        class="animated zoomIn"
        v-for="(item,index) in controlShow.isHeadTeacher==1?nav:navTwo"
        :key="index"
      >
        <img :src="item.imgShow" alt>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  // props: ["nav"],
  data() {
    return {
      indexShow: 0,
      indexBgShow: 0,
      nav: [
        {
          img: "/static/img/通知.png",
          label: "班级通知",
          imgShow: "/static/insetImg/插画/班级通知_icon.png",
          pathName: "notice"
          // columns: [{ label: "日期", prop: "date" }]
        },
        {
          img: "/static/img/考勤.png",
          label: "班级考勤",
          imgShow: "/static/insetImg/插画/班级考勤_icon.png",
          pathName: "check"
        },
        {
          img: "/static/img/作业.png",
          label: "班级作业",
          imgShow: "/static/insetImg/插画/班级作业_icon.png",
          pathName: "homework"
        },
        {
          img: "/static/img/成绩.png",
          label: "班级成绩",
          imgShow: "/static/insetImg/插画/班级成绩_icon.png",
          childrenListShow: false,
          pathName: "",
          children: [
            { label: "学业成绩", pathName: "schoolAchievement" },
            { label: "平时成绩", pathName: "PeacetimePerformance" }
          ]
        },
        {
          img: "/static/img/基础.png",
          label: "基础信息",
          imgShow: "/static/insetImg/插画/基础设置_icon.png",
          childrenListShow: false,
          children: [
            { label: "科目信息", pathName: "TeacherGradeClass" },
            { label: "学生信息", pathName: "StudentGradeClass" },
            { label: "家长信息", pathName: "Family" }
          ]
        }
      ],
      navTwo: [
        {
          img: "/static/img/成绩.png",
          label: "任课科目成绩",
          imgShow: "/static/insetImg/插画/班级成绩_icon.png",
          // pathName: 'notice',
          childrenListShow: false,
          children: [
            { label: "任课科目学业成绩", pathName: "schoolAchievement" },
            { label: "任课科目平时成绩", pathName: "PeacetimePerformance" }
          ]
        }
      ]
    };
  },
  methods: {
    navChange(index, pathName) {
      if (pathName) {
        this.$router.push({
          name: pathName
        });
      } else {
        return;
      }
    },
    navMove(index, item) {
      this.indexBgShow = index;
      this.nav.forEach((itemOne, indexOne) => {
        if (index == indexOne) {
          item.childrenListShow = true;
        }
      });
    },
    navLeave(item) {
      // this.childrenListShow = false
      item.childrenListShow = false;
    },
    navChildren(pathName) {
      console.log(pathName);
      this.$router.push({
        name: pathName
      });
    }
  },
  computed: {
    ...mapState(["controlShow"])
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/Scss/navList.scss";
.animatedOne {
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
</style>