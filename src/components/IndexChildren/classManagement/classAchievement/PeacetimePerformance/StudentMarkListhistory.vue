//平时成绩历史成绩
<template>
  <div id="StudentMarkListhistory">
    <div class="Title">
      <span class="name">{{queryObj.studentName}}平时成绩</span>
      <el-select v-model="schoolTerm" placeholder="选择学期" @change="schoolTermChange">
        <el-option v-for="item in schoolTermObj" :key="item.id" :label="item.term" :value="item.term"></el-option>
      </el-select>

      <el-select v-model="subjectVal" v-if="controlShow.isHeadTeacher==1" style="width:150px;margin-left:10px;" placeholder="科目" @change="subjectChange">
        <el-option v-for="item in subjectObj" :key="item.id" :label="item.subjectName" :value="item.subjectId"></el-option>
      </el-select>

      <el-button style="position: absolute;right: 25px;" class="checkbutton" round @click="leadingOut">成绩导出</el-button>
    </div>

    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <el-table-column prop="subjectName" label="科目"></el-table-column>
      <el-table-column prop="examName" label="平时成绩名称"></el-table-column>
      <el-table-column prop="examType" label="平时成绩类型"></el-table-column>
      <el-table-column prop="fullScore" label="满分值"></el-table-column>
      <el-table-column prop="score" label="考试分数"></el-table-column>
      <el-table-column prop="classRanking" label="班级排名"></el-table-column>
      <el-table-column prop="content" :show-overflow-tooltip="true" label="评价内容"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <pageHtml :tabObj.sync='tableData' name="classStudentSubjectScoreStudentHistoryScoreList" :classId='queryObj.classId' :type='queryObj.subjectId' :discriminate='2' :otherType='queryObj'></pageHtml>

  </div>
</template>
<script>
import {
  schoolTermSchoolTermList,
  classStudentSubjectScoreStudentHistoryScoreList,
  classSubjectClassSubjectListByClassId
} from '@/api/api'
import Vue from 'vue'
import axios from 'axios'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      tableData: [],
      strings: [],
      queryObj: this.$route.query,
      schoolTerm: this.$route.query.term,
      schoolTermObj: [],
      subjectVal: '',
      subjectObj: []
    }
  },
  
  created() {
    this.subjectVal = parseInt(this.$route.query.subjectId)

    //学期下拉列表
    schoolTermSchoolTermList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.schoolTermObj = res.data.data
      }
    })
    //科目下拉列表
    classSubjectClassSubjectListByClassId({
      classId: this.queryObj.classId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.subjectObj = res.data.data
      }
    })
    classStudentSubjectScoreStudentHistoryScoreList({
      term: this.queryObj.term,
      type: 2,
      classId: this.queryObj.classId,
      studentId: this.queryObj.studentId,
      subjectId: this.queryObj.subjectId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
        // this.tableTile = res.data.data.tableTile
        // this.strings = res.data.data.strings
      } else {
        console.log(res)
      }
    })
  },
  computed: {
    ...mapState(['controlShow'])
  },
  methods: {
    leadingOut() {
      // if (this.strings.length != 0) {
      axios({
        url:
          '/studentScoreExport/exportStudentHistoryScoreExportData?classId=' +
          this.queryObj.classId +
          '&studentId=' +
          this.queryObj.studentId +
          '&term=' +
          this.schoolTerm +
          '&subjectId=' +
          this.subjectVal +
          '&type=2',
        method: 'get',
        headers: { Authorization: TOKEN },
        // data: {
        //   type: 1,
        //   term: this.queryObj.term,
        //   classId: this.queryObj.classId,
        //   subjectId: this.queryObj.subjectId,
        //   examType: this.queryObj.examType
        // },
        responseType: 'blob'
      })
        .then(function(res) {
          var blob = new Blob([res.data], {
            type: res.headers['content-type']
          })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.href = href
          downloadElement.download = '学生成绩数据.xls' //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
        .catch(function() {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        })
      // } else {
      //   this.$message({
      //     message: res.data.message,
      //     type: 'warning'
      //   })
      // }
    },

    schoolTermChange(val) {
      this.schoolTerm = val
      classStudentSubjectScoreStudentHistoryScoreList({
        term: val,
        type: 2,
        classId: this.queryObj.classId,
        studentId: this.queryObj.studentId,
        subjectId: this.subjectVal ? this.subjectVal : null
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
          this.tableData = res.data.data
          // this.tableTile = res.data.data.tableTile
          // this.strings = res.data.data.strings
        } else {
          console.log(res)
        }
      })
    },

    subjectChange(val) {
      this.subjectVal = val
      classStudentSubjectScoreStudentHistoryScoreList({
        term: this.queryObj.term ? this.queryObj.term : null,
        type: 2,
        classId: this.queryObj.classId,
        studentId: this.queryObj.studentId,
        subjectId: this.subjectVal
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
          this.tableData = res.data.data
          // this.tableTile = res.data.data.tableTile
          // this.strings = res.data.data.strings
        } else {
          console.log(res)
        }
      })
    }
  }
}
</script>

<style>
</style>
