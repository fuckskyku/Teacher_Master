/*
 * File: SubjectScoreAnalysis.vue
 * Project: teacher
 * File Created: Monday, 5th November 2018 6:01:39 pm
 * Author: LGH (you@you.you)
 * -----
 * Last Modified: Thursday, 22nd November 2018 4:34:02 pm
 * Modified By: LGH (you@you.you>)
 * -----
 * Copyright 2017 - 2018 Your Company, Your Company
 *普通老师历史成绩
 */
<template>
  <div id="ClassAchievementInfoHistory">
    <div class="Title">
      <span class="name">{{queryObj.studentName}}成绩</span>
      <el-select v-model="schoolTerm" placeholder="选择学期"  @change="schoolTermChange">
        <el-option v-for="item in schoolTermObj" :key="item.id" :label="item.term" :value="item.term"></el-option>
      </el-select>
      <el-button style="position: absolute;right: 25px;" class="checkbutton" round @click="leadingOut">成绩导出</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <el-table-column prop="examType" label="类型"></el-table-column>
      <el-table-column prop="score" :label="queryObj.subjectName"></el-table-column>
      <el-table-column prop="classRanking" label="班级排名"></el-table-column>
      <el-table-column prop="gradeRanking" label="年段排名"></el-table-column>
      <el-table-column prop="content" label="评价内容"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  schoolTermSchoolTermList,
  classStudentSubjectScoreStudentHistoryScoreList
} from '@/api/api'
import Vue from 'vue'
import axios from 'axios'
export default {
  data() {
    return {
      // tableTile: [],
      // strings: [],
      tableData: [],
      queryObj: this.$route.query,
      schoolTerm: this.$route.query.term,
      schoolTermObj: []
    }
  },

  created() {
    //学期下拉列表
    schoolTermSchoolTermList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.schoolTermObj = res.data.data
      }
    })

    classStudentSubjectScoreStudentHistoryScoreList({
      term: this.queryObj.term,
      type: 1,
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
  methods: {
    leadingOut() {
      axios({
        url:
          '/studentScoreExport/exportStudentHistoryScoreExportData?classId=' +
          this.queryObj.classId +
          '&studentId=' +
          this.queryObj.studentId +
          '&term=' +
          this.schoolTerm +
          '&subjectId=' +
          this.queryObj.subjectId +
          '&type=1',
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
          downloadElement.download = '学生科目历史成绩数据.xls' //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
        .catch(function() {})
    },

    schoolTermChange(val) {
      this.schoolTerm = val
      classStudentSubjectScoreStudentHistoryScoreList({
        term: val,
        type: 1,
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
    }
  }
}
</script>

<style>
</style>
