/*
 * File: PerformanceDivisionManagement.vue
 * Project: teacher
 * File Created: Monday, 5th November 2018 5:53:30 pm
 * Author: LGH (you@you.you)
 * -----
 * Last Modified: Thursday, 22nd November 2018 10:39:01 am
 * Modified By: LGH (you@you.you>)
 * -----
 * Copyright 2017 - 2018 Your Company, Your Company
 * 成绩分科管理
 */

 <template>
  <div id="PerformanceDivisionManagement">
    <div class="seach">
      <div class="seach_right">
        <div class="seach_title">筛选：</div>
        <el-select class="check_children" v-model="subjectVal" placeholder="请选择科目" clearable @change="subjectChange">
          <el-option v-for="item in subjectObj" :key="item.subjectId" :label="item.subjectName" :value="item.subjectId">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="gradeClassName" label="年级班级" width="100"></el-table-column>
      <el-table-column prop="subjectName" label="科目"></el-table-column>
      <el-table-column prop="examTime" label="考试时间" width="100">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.examTime).format('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="examCount" label="考试人数"></el-table-column>
      <el-table-column prop="missExamCount" label="缺考人数"></el-table-column>
      <el-table-column prop="fullScore" label="满分"></el-table-column>
      <el-table-column prop="higScore" label="最高分"></el-table-column>
      <el-table-column prop="lowScore" label="最低分"></el-table-column>
      <el-table-column prop="averageScore" label="平均分"></el-table-column>
      <el-table-column prop="standardDeviation" label="标准差"></el-table-column>
      <el-table-column prop="passRate" label="及格率(60%)" width="120"></el-table-column>
      <el-table-column prop="goodRate" label="优良率(80%)" width="120"> </el-table-column>
      <el-table-column prop="isSend" label="是否已发给家长" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.isSend?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="195" fixed="right">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="ClassScoreLookMe(scope.row)">成绩详情</el-button>
          <el-button class="look" type="text" @click="ScoreAnalysis(scope.row)">成绩分析</el-button>
          <el-button class="delete" type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pageHtml :tabObj.sync='tableData' name="classStudentSubjectScoreClassSubjectScoreList" :otherType='queryObj' :type='subjectVal'></pageHtml>

  </div>
</template>

<script>
import {
  classStudentSubjectScoreClassSubjectScoreList,
  classSubjectClassSubjectListByClassId,
  classStudentSubjectScoreSubjectScoreDelete
} from '@/api/api'

export default {
  inject: ['reload'],
  data() {
    return {
      //关键字过滤
      queryObj: this.$route.query,
      keywordsVal: '',
      subjectObj: [],
      subjectVal: '',
      tableData: [],
      otherObj: {}
    }
  },
  methods: {
    ClassScoreLookMe(row) {
      this.$router.push({
        name: 'ClassAchievementInfo',
        query: {
          classId: row.classId,
          term: row.term,
          examType: row.examType,
          subjectId: row.subjectId
        }
      })
    },
    ScoreAnalysis(row) {
      // console.log(row)
      this.$router.push({
        name: 'SubjectScoreAnalysis',
        query: {
          classId: row.classId,
          term: row.term,
          examType: row.examType,
          subjectId: row.subjectId
        }
      })
    },
    //删除
    del(row) {
      this.$confirm('是否确定删除该条分科成绩记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          classStudentSubjectScoreSubjectScoreDelete({ id: row.id }).then(
            res => {
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.reload()
              } else {
                this.$message({
                  type: 'success',
                  message: res.data.message
                })
              }
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //过滤筛选
    subjectChange(val) {
      this.subjectVal = val
      classStudentSubjectScoreClassSubjectScoreList({
        subjectId: val,
        classId: this.queryObj.classId,
        // classId:280,
        term: this.queryObj.term,
        examType: this.queryObj.examType
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
          this.tableData = res.data.data
        } else {
          console.log(res)
        }
      })
    }
  },
  computed: {},
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

    classStudentSubjectScoreClassSubjectScoreList({
      classId: this.queryObj.classId,
      // classId:280,
      term: this.queryObj.term,
      examType: this.queryObj.examType
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
      } else {
        console.log(res)
      }
    })
  }
}
</script>

<style lang="scss">
</style>
