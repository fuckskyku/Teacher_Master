/*
 * File: SubjectScoreAnalysis.vue
 * Project: teacher
 * File Created: Monday, 5th November 2018 6:01:39 pm
 * Author: LGH (you@you.you)
 * -----
 * Last Modified: Thursday, 22nd November 2018 10:39:01 am
 * Modified By: LGH (you@you.you>)
 * -----
 * Copyright 2017 - 2018 Your Company, Your Company
 *普通老师学科成绩分析
 */

<template>
  <div id="SubjectScoreAnalysis">
    <div class="Title">
      <span class="name">{{queryObj.term+" "+queryObj.examType+" "+queryObj.subjectName}}</span>
      <!-- <el-select v-model="subjectVal" placeholder="请选择" clearable>
        <el-option v-for="item in subjectObj" :key="item.id" :label="item.subjectName" :value="item.subjectId"></el-option>
      </el-select> -->
    </div>

    <el-table :data="tableData.stageList" style="width: 100%" height="400" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <el-table-column label="分数" prop="stage" width="220"></el-table-column>
      <el-table-column label="人数" prop="count" width="220"></el-table-column>
      <el-table-column label="所占比例" prop="scale" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.scale}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="对应的学生" prop="students" :show-overflow-tooltip='true'></el-table-column>
    </el-table>
    <div class="totalParticulars">
      <ul>
        <li>合计</li>
        <li>{{tableData.examCount}}</li>
        <li>{{tableData.examScale}}%</li>
        <li>*优秀学生前3名</li>
        <li>{{tableData.threeName}}</li>
      </ul>
      <ul>
        <li>最高分</li>
        <li>{{tableData.higScore}}</li>
        <li>{{tableData.highestName}}</li>
      </ul>
      <ul>
        <li>最低分</li>
        <li>{{tableData.lowScore}}</li>
        <li>{{tableData.lowestName}}</li>
      </ul>
      <ul>
        <li>平均分</li>
        <li>{{tableData.averageScore}}</li>
      </ul>
      <ul>
        <li>标准差</li>
        <li>{{tableData.standardDeviation}}</li>
      </ul>
      <ul>
        <li>及格率</li>
        <li>{{tableData.passRate}}</li>
      </ul>
      <ul>
        <li>优良率</li>
        <li>{{tableData.goodRate}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  classSubjectScoreStageStatisClassSubjectScoreList,
  classSubjectScoreStageStatisGetSubjectScore,
  classSubjectClassSubjectListByClassId
} from '@/api/api'
export default {
  data() {
    return {
      queryObj: this.$route.query,
      tableData: [],
      subjectVal: this.$route.query.subjectId,
      subjectObj: []
    }
  },
  created() {
    //科目下拉列表
    classSubjectClassSubjectListByClassId({
      classId: this.queryObj.classId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.subjectObj = res.data.data
      } else {
        console.log(res)
      }
    })

    classSubjectScoreStageStatisGetSubjectScore({
      classId: this.queryObj.classId,
      subjectId: this.queryObj.subjectId,
      term: this.queryObj.term,
      examType: this.queryObj.examType
    }).then(res => {
      if (res.data.code == 200) {
        this.tableData = res.data.data
        // this.
        // res.data.data.forEach(item => {
        //   if(!item.length){

        //   }
        // });
        console.log(res.data.data)
      } else {
        console.log(res)
      }
    })
  }
}
</script>

<style>
</style>
