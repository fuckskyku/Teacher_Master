import Vue from 'vue'
import Router from 'vue-router'
//引入路由组件
import Login from '@/components/Login'
import Home from '@/components/Index'

// import IndexChildren from '@/components/IndexChildren/index'
// import classList from '@/components/IndexChildren/classManagement/classList'
// import weather from '@/components/IndexChildren/Picktry/weather'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/index',
      name: 'Home',
      component: Home,
      children: [
        //首页路由
        { path: '/index', name: "index", component: (resolve) => require(['@/components/IndexChildren/index'], resolve), meta: { title: "首页" } },
        { path: '/classList', name: "classList", component: (resolve) => require(['@/components/IndexChildren/classManagement/classList'], resolve), meta: { title: "班级管理" } },
        { path: '/appPubicationList', name: "approvalandpublication", component: (resolve) => require(['@/components/IndexChildren/classManagement/appPubicationList'], resolve), meta: { title: "审批与发布" } },
        { path: '/weather', name: 'weather', component: (resolve) => require(['@/components/IndexChildren/Picktry/weather'], resolve), meta: { title: "点我试试" } },
        { path: '/hangintheair', name: 'hangintheair', component: (resolve) => require(['@/components/IndexChildren/Picktry/hangintheair'], resolve), meta: { title: "待办事件" } },

        //班级表格
        { path: '/classnotice', name: 'notice', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classnotice'], resolve), meta: { title: "班级通知" } },
        { path: '/classcheck', name: 'check', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classcheck'], resolve), meta: { title: "考勤列表" } },
        { path: '/classhomework', name: 'homework', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classhomework'], resolve), meta: { title: "班级作业" } },
        { path: '/classbaseTeacher', name: 'Teacher', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classbaseTeacher'], resolve), meta: { title: "教师科目管理" } },
        { path: '/classbaseTeacherGradeClass', name: 'TeacherGradeClass', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classbaseTeacherGradeClass'], resolve), meta: { title: "教师班级管理" } },
        { path: '/classbaseStudentGradeClass', name: 'StudentGradeClass', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classbaseStudentGradeClass'], resolve), meta: { title: "学生管理" } },
        { path: '/classbaseStudent', name: 'Student', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classbaseStudent'], resolve), meta: { title: "班级学生" } },
        { path: '/classbaseFamily', name: 'Family', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classbaseFamily'], resolve), meta: { title: "学生家长" } },
        { path: '/classcheck_children', name: 'check_children', component: (resolve) => require(['@/components/IndexChildren/classManagement/classDate/classcheck_children'], resolve), meta: { title: "查看考勤" } },

        //成绩管理
        { path: '/schoolAchievement', name: 'schoolAchievement', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement'], resolve), meta: { title: "班级学业成绩" } },

        //平时成绩管理
        //当前老师所负责的所有的班级
        { path: '/PeacetimePerformance', name: 'PeacetimePerformance', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/PeacetimePerformance'], resolve), meta: { title: "班级平时成绩" } },

        // 以下是平时成绩
        //添加平时考试成绩
        { path: '/AddPeacetimePerformance', name: 'AddPeacetimePerformance', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/PeacetimePerformance/AddPeacetimePerformance'], resolve), meta: { title: "添加平时考试成绩" } },
        //平时考试的 所有考试成绩  --列表
        { path: '/MarkList', name: 'MarkList', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/PeacetimePerformance/MarkList'], resolve), meta: { title: "平时成绩详情" } },
        //平时考试中 某次考试详情  --详情页面
        { path: '/MarkListInfo', name: 'MarkListInfo', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/PeacetimePerformance/MarkListInfo'], resolve), meta: { title: "科目成绩详情" } },
        { path: '/StudentMarkListhistory', name: 'StudentMarkListhistory', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/PeacetimePerformance/StudentMarkListhistory'], resolve), meta: { title: "学生平时历史成绩" } },
        { path: '/SubjectGradeManagementTimes', name: 'SubjectGradeManagementTimes', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/PeacetimePerformance/SubjectGradeManagementTimes'], resolve), meta: { title: "平时科目成绩管理" } },
        { path: '/SubjectGradeManagementTimesInfo', name: 'SubjectGradeManagementTimesInfo', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/PeacetimePerformance/SubjectGradeManagementTimesInfo'], resolve), meta: { title: "成绩详情" } },

        //以上是平时成绩
        { path: '/AchievementManagement', name: 'AchievementManagement', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/AchievementManagement'], resolve), meta: { title: "学业成绩详情" } },
        { path: '/ClassAchievementInfo', name: 'ClassAchievementInfo', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/ClassAchievementInfo'], resolve), meta: { title: "成绩详情" } },
        { path: '/TotalPoints', name: 'TotalPoints', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/TotalPoints'], resolve), meta: { title: "总成绩排名" } },
        { path: '/PerformanceDivisionManagement', name: 'PerformanceDivisionManagement', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/PerformanceDivisionManagement'], resolve), meta: { title: "科目学业成绩详情" } },
        { path: '/ClassAchievementInfoHistory', name: 'ClassAchievementInfoHistory', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/ClassAchievementInfoHistory'], resolve), meta: { title: "学生学业历史成绩" } },
        { path: '/SubjectScoreAnalysis', name: 'SubjectScoreAnalysis', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/SubjectScoreAnalysis'], resolve), meta: { title: "成绩分析" } },
        { path: '/AddTestScores', name: 'AddTestScores', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/AddTestScores'], resolve), meta: { title: "添加考试成绩" } },
        { path: '/SubjectGradeManagementStudies', name: 'SubjectGradeManagementStudies', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/SubjectGradeManagementStudies'], resolve), meta: { title: "学业科目成绩管理" } },

        { path: '/OtClassAchievementInfoHistory', name: 'OtClassAchievementInfoHistory', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/OtClassAchievementInfoHistory'], resolve), meta: { title: "学生科目历史成绩" } },
        //普通教师页面
        { path: '/StudentMarkListInfo', name: 'StudentMarkListInfo', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/StudentMarkListInfo'], resolve), meta: { title: "科目学业成绩详情" } },
        { path: '/OtSubjectScoreAnalysis', name: 'OtSubjectScoreAnalysis', component: (resolve) => require(['@/components/IndexChildren/classManagement/classAchievement/schoolAchievement/OtSubjectScoreAnalysis'], resolve), meta: { title: "成绩分析" } },


        //审批与发布表格
        { path: '/examination', name: 'examination', component: (resolve) => require(['@/components/IndexChildren/classManagement/appPubicationDate/examination'], resolve), meta: { title: "审批管理" } },
        { path: '/copyittome', name: 'copy', component: (resolve) => require(['@/components/IndexChildren/classManagement/appPubicationDate/copy'], resolve), meta: { title: "抄送我的" } },
        { path: '/publishobj', name: 'publishobj', component: (resolve) => require(['@/components/IndexChildren/classManagement/appPubicationDate/publishobj'], resolve), meta: { title: "发布作业" } },
        { path: '/issuenotice', name: 'issuenotice', component: (resolve) => require(['@/components/IndexChildren/classManagement/appPubicationDate/issuenotice'], resolve), meta: { title: "发布通知" } },
        { path: '/stylenotice', name: 'stylenotice', component: (resolve) => require(['@/components/IndexChildren/classManagement/appPubicationDate/stylenotice'], resolve), meta: { title: "风采管理" } },

        //发布页面
        { path: '/issuejobnotice', name: 'issuejobnotice', component: (resolve) => require(['@/components/IndexChildren/classManagement/add/issuejobnotice'], resolve), meta: { title: "作业发布" } },
        { path: '/issuenoticeinfo', name: 'issuenoticeinfo', component: (resolve) => require(['@/components/IndexChildren/classManagement/add/issuenoticeinfo'], resolve), meta: { title: "通知发布" } },
        { path: '/issuestylenotice', name: 'issuestylenotice', component: (resolve) => require(['@/components/IndexChildren/classManagement/add/issuestylenotice'], resolve), meta: { title: "风采发布" } },

        //个人信息
        { path: '/userInfo', name: "userInfo", component: (resolve) => require(['@/components/IndexChildren/classManagement/userInfo/userInfo'], resolve), meta: { title: "个人信息" } },
        { path: '/integralDetail', name: "integralDetail", component: (resolve) => require(['@/components/IndexChildren/classManagement/userInfo/integralDetail'], resolve), meta: { title: "积分明细" } },
        { path: '/signatureDetails', name: "signatureDetails", component: (resolve) => require(['@/components/IndexChildren/classManagement/userInfo/signatureDetails'], resolve), meta: { title: "签到明细" } },
      ]
    }
  ]
})
