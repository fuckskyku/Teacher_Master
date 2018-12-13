 <template>
  <div id="ClassAchievementInfo">
    <div class="seach">
      <div class="seach_left">
        <el-input placeholder="请输姓名,学号关键字(回车进行搜索)" suffix-icon="el-icon-search" v-model="keywordsVal" clearable @change="keyWordsInput"></el-input>
      </div>

      <div class="seach_right">
        <el-button round class="checkbutton" @click="leadingOut">
          EXCEL导出
        </el-button>
      </div>
    </div>
    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="gradeClassName" label="年级班级"></el-table-column>
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop='studentNo' label='学号'></el-table-column>
      <el-table-column prop="examType" label="考试类型"></el-table-column>
      <el-table-column prop="subjectName" label="科目"></el-table-column>
      <el-table-column prop="fullScore" label="满分值"></el-table-column>
      <el-table-column prop="score" label="分数">
        <template slot-scope="scope">
          <span v-if="!scope.row.hoverShow" :style="{color:scope.row.examStatus==0?'':'red'}">{{scope.row.examStatus==0?scope.row.score:'缺考'}}</span>
          <el-input v-if="scope.row.hoverShow" type="number" min="0" :max="scope.row.fullScore" v-model="scope.row.score" placeholder="请输入修改后的分数"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="classRanking" label="班级名次"></el-table-column>
      <el-table-column prop="gradeRanking" label="年段名次"></el-table-column>
      <el-table-column label="操作" width="220px">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">{{scope.row.hoverShow?'取消':'修改成绩'}}</el-button>
          <el-button v-show="scope.row.hoverShow" type="text" @click="editOk(scope.row)">完成</el-button>
          <el-button class="look" type="text" @click="LookMeHistory(scope.row)">学生历史成绩</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pageHtml :tabObj.sync='tableData' name="classStudentSubjectScoreClassStudentSubjectScoreList" :classId='queryObj.classId' :type='queryObj.subjectId' :discriminate='1' :otherType='queryObj' :searchsKey='keywordsVal' :edit='true'></pageHtml>

  </div>
</template>
<script>
import {
  classStudentSubjectScoreClassStudentSubjectScoreList,
  classStudentSubjectScoreUpdateScore
} from '@/api/api'
import Vue from 'vue'
import axios from 'axios'

export default {
  inject: ['reload'],
  data() {
    return {
      queryObj: this.$route.query,
      keywordsVal: '',
      tableData: [{}],
      tempNumber: ''
    }
  },
  methods: {
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val
      classStudentSubjectScoreClassStudentSubjectScoreList({
        searchWord: val,
        term: this.queryObj.term,
        type: 1,
        classId: this.queryObj.classId,
        subjectId: this.queryObj.subjectId,
        examType: this.queryObj.examType
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          res.data.data.data.forEach(item => {
            item.hoverShow = false
          })
          this.tableData = res.data.data
        }
      })
    },

    leadingOut() {
      axios({
        url:
          '/studentScoreExport/exportStudentSubjectScoreExportData?classId=' +
          this.queryObj.classId +
          '&subjectId=' +
          this.queryObj.subjectId +
          '&term=' +
          this.queryObj.term +
          '&examType=' +
          this.queryObj.examType +
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
          var blob = new Blob([res.data], { type: res.headers['content-type'] })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.href = href
          downloadElement.download = '学生成绩数据.xls' //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
        .catch(function() {})
    },

    edit(row) {
      if (!row.hoverShow) {
        row.hoverShow = true
        this.tempNumber = row.score
      } else {
        row.score = this.tempNumber
        row.hoverShow = false
      }
    },

    editOk(row) {
      classStudentSubjectScoreUpdateScore({
        id: row.id,
        score: row.score
      }).then(res => {
        if (res.data.code == 200) {
          this.$message.success('修改成功')
          row.hoverShow = false
          this.reload()
        } else {
          this.$message.error(res.data.message)
        }
      })
      //   if (row.hoverShow) {
      //     row.hoverShow = false
      //   } else {
      //     row.hoverShow = true
      //   }
    },

    LookMeHistory(row) {
      this.$router.push({
        name: 'ClassAchievementInfoHistory',
        query: {
          studentName: row.studentName,
          term: row.term,
          classId: row.classId,
          studentId: row.studentId
        }
      })
    }
  },
  created() {
    classStudentSubjectScoreClassStudentSubjectScoreList({
      term: this.queryObj.term,
      type: 1,
      classId: this.queryObj.classId,
      subjectId: this.queryObj.subjectId,
      examType: this.queryObj.examType
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        res.data.data.data.forEach(item => {
          item.hoverShow = false
        })
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
