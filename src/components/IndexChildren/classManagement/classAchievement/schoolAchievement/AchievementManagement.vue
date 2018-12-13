 <template>
  <div id="AchievementManagement">
    <div class="seach">
      <div class="seach_right">
        <div class="seach_title">筛选：</div>
        <el-select class="check_children" v-model="schoolTerm" placeholder="选择学期" clearable @change="schoolTermChange">
          <el-option v-for="item in schoolTermObj" :key="item.id" :label="item.term" :value="item.term"></el-option>
        </el-select>
        <el-select class="check_children" v-model="eaminationType" placeholder="考试类型" clearable @change="eaminationChange">
          <el-option v-for="item in eaminationTypeObj" :key="item.id" :label="item.typeName" :value="item.typeName"></el-option>
        </el-select>
      </div>
    </div>

    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="term" label="学期"></el-table-column>
      <el-table-column prop="gradeClassName" label="年级班级"></el-table-column>
      <el-table-column prop="examType" label="考试类型"></el-table-column>
      <el-table-column prop="higScore" label="总分最高分"></el-table-column>
      <el-table-column prop="lowScore" label="总分最低分"></el-table-column>
      <el-table-column prop="averageScore" label="总分平均分"></el-table-column>
      <el-table-column prop="mainAverageScore" label="主科平均分"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="exminationInfo(scope.row)">成绩详情</el-button>
          <el-button class="look" type="text" @click="countLookMe(scope.row)">总成绩排名</el-button>
          <el-button class="delete" type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pageHtml :tabObj.sync='tableData' name="classScoreStatisPage" :type='schoolTerm' :typeTwo='eaminationType' :classId='classId'></pageHtml>

  </div>
</template>
<script>
import {
  classScoreStatisPage,
  schoolTermSchoolTermList,
  examTypeExamTypeList,
  classScoreStatisClassScoreDelete
} from '@/api/api'

export default {
  inject: ['reload'],
  data() {
    return {
      schoolTerm: '',
      schoolTermObj: [],
      eaminationType: '',
      eaminationTypeObj: [],
      classId: this.$route.query.classId,
      tableData: []
    }
  },
  methods: {
    exminationInfo(row) {
      this.$router.push({
        name: 'PerformanceDivisionManagement',
        query: {
          classId: row.classId,
          term: row.term,
          examType: row.examType
        }
      })
    },
    countLookMe(row) {
      console.log(row)
      this.$router.push({
        name: 'TotalPoints',
        query: {
          classId: row.classId,
          term: row.term,
          examType: row.examType,
          gradeId: row.gradeId
        }
      })
    },
    del(row) {
      this.$confirm('是否确定删除该条成绩记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          classScoreStatisClassScoreDelete({ id: row.id }).then(res => {
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
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //过滤条件事件
    schoolTermChange(val) {
      this.schoolTerm = val
      classScoreStatisPage({
        classId: this.classId,
        term: val,
        examType: this.eaminationType ? this.eaminationType : null
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },
    eaminationChange(val) {
      this.eaminationType = val
      classScoreStatisPage({
        classId: this.classId,
        term: this.schoolTerm ? this.schoolTerm : null,
        examType: val
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    }
  },
  computed: {},
  created() {
    //表格数据
    classScoreStatisPage({
      classId: this.classId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
      } else {
        console.log(res)
      }
    })

    //学期下拉列表
    schoolTermSchoolTermList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.schoolTermObj = res.data.data
      }
    })

    //考试下拉列表
    examTypeExamTypeList({ type: 1 }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.eaminationTypeObj = res.data.data
      }
    })
  }
}
</script>

<style lang="scss">
</style>
