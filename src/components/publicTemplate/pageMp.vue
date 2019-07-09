<template>
  <div class="PageDiv">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 40,60,80,100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>
<script>
import * as tabApi from "@/api/api";
export default {
  // ['tabObj', 'name', 'type', 'otherType','keywords'],
  props: {
    tabObj: { default: null }, //表格数据
    name: { default: null }, //接口名称
    type: { default: null }, //筛选过滤类型
    typeTwo: { default: null }, //筛选过滤类型第二个
    otherType: { default: null }, //其他过滤参数
    keywords: { default: null }, //单个关键字过滤搜索
    searchsKey: { default: null }, //多个关键字搜索  或者 可以使用他使用多个筛选过滤条件
    edit: { default: false }, //是否对返回数据进行添加状态控制
    discriminate: { default: 1 }, //区分平时成绩和学业成绩
    classId: { default: null }
  },
  data() {
    return {
      pageNo: 0,
      pageSize: 0,
      totalCount: 0,
      tableData: [],
      //筛选过滤条件参数
      selectType: "",
      selectTypeTwo: "",

      //关键字过滤条件
      keywordsVal: "",
      //多个关键字过滤条件
      searchsVal: ""
    };
  },
  watch: {
    tabObj(val) {
      this.pageNo = val.pageNo;
      this.pageSize = val.pageSize;
      this.totalCount = val.totalCount;
      this.tableData = val;
    },
    type(val) {
      this.selectType = val;
    },
    typeTwo(val) {
      this.selectTypeTwo = val;
    },
    //单个
    keywords(val) {
      this.keywordsVal = val;
    },
    //多个
    searchsKey(val) {
      this.searchsVal = val;
    }
  },
  methods: {
    //     //分页事件
    handleSizeChange(val) {
      // console.log(val)
      tabApi[this.name]({
        pageSize: val,
        pageNo: this.pageNo,
        //筛选过滤参数
        newsStyleType: this.selectType ? this.selectType : this.selectTypeTwo,
        title: this.keywordsVal,
        studentName: this.keywordsVal,
        sex: this.selectType,
        idStatus: this.selectType ? this.selectType : this.selectTypeTwo,
        auditStatus: this.selectType ? this.selectType : this.selectTypeTwo,
        checkStatus: this.selectType ? this.selectType : this.selectTypeTwo,

        classId: this.otherType
          ? this.otherType.classId
            ? this.otherType.classId
            : this.classId
          : this.classId,

        //成绩管理区分平时成绩
        type: this.discriminate,

        subjectId: this.otherType
          ? this.otherType.subjectId
            ? this.otherType.subjectId
            : null
          : this.selectType,

        term: this.otherType
          ? this.otherType.term
            ? this.otherType.term
            : null
          : this.selectType
          ? this.selectType
          : null,

        examType: this.otherType
          ? this.otherType.examType
            ? this.otherType.examType
            : null
          : this.selectTypeTwo
          ? this.selectTypeTwo
          : null,

        examName: this.otherType
          ? this.otherType.examName
            ? this.otherType.examName
            : null
          : null,

        studentId: this.otherType ? this.otherType.studentId : null,

        //多个关键字筛选条件
        searchWord: this.searchsVal,

        //其他参数(考勤分页其他参数))
        startDate:
          this.otherType && this.otherType.valueDateOne
            ? this.otherType.valueDateOne
            : null,
        endDate:
          this.otherType && this.otherType.valueDateTwo
            ? this.otherType.valueDateTwo
            : null,
        //其他参数(考勤详情分页其他参数和过滤参数)
        checkDate:
          this.otherType && this.otherType.checkDate
            ? this.otherType.checkDate
            : null,
        attendanceTimeType:
          this.otherType && this.otherType.attendanceTimeType
            ? this.otherType.attendanceTimeType
            : null,
        //其他参数（正式文章和草稿文章）
        editStatus: this.otherType ? this.otherType : null
      }).then(res => {
        if (res.data.code == 200) {
          if (!this.edit) {
            console.log(1);
            this.tableData = res.data.data;
          } else {
            console.log(2);
            res.data.data.data.forEach(item => {
              item.hoverShow = false;
            });
            this.tableData = res.data.data;
          }
          // console.log(res.data.data)
          this.$emit("update:tabObj", this.tableData);
        }
      });
      this.pageSize = val;
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      tabApi[this.name]({
        pageSize: this.pageSize,
        pageNo: val,
        //筛选过滤参数
        newsStyleType: this.selectType ? this.selectType : this.selectTypeTwo,
        title: this.keywordsVal,
        studentName: this.keywordsVal,
        sex: this.selectType,
        idStatus: this.selectType ? this.selectType : this.selectTypeTwo,
        auditStatus: this.selectType ? this.selectType : this.selectTypeTwo,
        checkStatus: this.selectType ? this.selectType : this.selectTypeTwo,

        classId: this.otherType
          ? this.otherType.classId
            ? this.otherType.classId
            : this.classId
          : this.classId,

        //成绩管理区分平时成绩
        type: this.discriminate,

        subjectId: this.otherType
          ? this.otherType.subjectId
            ? this.otherType.subjectId
            : null
          : this.selectType,

        term: this.otherType
          ? this.otherType.term
            ? this.otherType.term
            : null
          : this.selectType
          ? this.selectType
          : null,

        examType: this.otherType
          ? this.otherType.examType
            ? this.otherType.examType
            : null
          : this.selectTypeTwo
          ? this.selectTypeTwo
          : null,

        studentId: this.otherType ? this.otherType.studentId : null,

        examName: this.otherType
          ? this.otherType.examName
            ? this.otherType.examName
            : null
          : null,

        //多个关键字筛选条件
        searchWord: this.searchsVal,
        //其他参数(考勤分页其他参数))
        startDate:
          this.otherType && this.otherType.valueDateOne
            ? this.otherType.valueDateOne
            : null,
        endDate:
          this.otherType && this.otherType.valueDateTwo
            ? this.otherType.valueDateTwo
            : null,

        //其他参数
        checkDate: this.otherType ? this.otherType.checkDate : null,
        attendanceTimeType: this.otherType
          ? this.otherType.attendanceTimeType
          : null,
        //其他参数（正式文章和草稿文章）
        editStatus: this.otherType ? this.otherType : null
      }).then(res => {
        if (res.data.code == 200) {
          if (!this.edit) {
            this.tableData = res.data.data;
          } else {
            res.data.data.data.forEach(item => {
              item.hoverShow = false;
            });
            this.tableData = res.data.data;
          }
          // this.tableData = res.data.data
          this.$emit("update:tabObj", this.tableData);
        }
      });
      this.pageNo = val;
      // console.log(`当前页: ${val}`)
    }
  }
};
</script>

<style>
</style>
