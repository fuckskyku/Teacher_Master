 <template>
  <div id="SubjectGradeManagement">
    <div class="seach">
      <div class="seach_right">
        <div class="seach_title">筛选：</div>
        <el-select
          class="check_children"
          v-model="schoolTerm"
          placeholder="选择学期"
          clearable
          @change="schoolTermChange"
        >
          <el-option
            v-for="item in schoolTermObj"
            :key="item.id"
            :label="item.term"
            :value="item.term"
          ></el-option>
        </el-select>
        <el-select
          class="check_children"
          v-model="eaminationType"
          placeholder="考试类型"
          clearable
          @change="eaminationChange"
        >
          <el-option
            v-for="item in eaminationTypeObj"
            :key="item.id"
            :label="item.typeName"
            :value="item.typeName"
          ></el-option>
        </el-select>
      </div>
    </div>
    <el-table
      :data="tableData.data"
      style="width: 100%"
      height="600"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',color:'#606266'}"
    >
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="term" label="学期" width="100"></el-table-column>
      <el-table-column prop="gradeClassName" label="年级班级" width="100"></el-table-column>
      <el-table-column prop="examType" label="考试类型" width="150"></el-table-column>
      <el-table-column prop="subjectName" label="科目"></el-table-column>
      <el-table-column prop="examTime" label="考试时间" width="100">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ new Date(scope.row.examTime).format('yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fullScore" label="满分值"></el-table-column>
      <el-table-column prop="higScore" label="最高分"></el-table-column>
      <el-table-column prop="lowScore" label="总分最低分" width="90"></el-table-column>
      <el-table-column prop="averageScore" label="平均分(不包括缺考人员)" width="190"></el-table-column>
      <el-table-column prop="standardDeviation" label="标准差(不包括缺考人员)" width="190"></el-table-column>
      <el-table-column prop="passRate" label="及格率(60%)" width="100"></el-table-column>
      <el-table-column prop="goodRate" label="优良率(80%)" width="100"></el-table-column>
      <el-table-column prop="isSend" label="是否已发送家长" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.isSend?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="exminationInfo(scope.row)">成绩详情</el-button>
          <el-button class="look" type="text" @click="countLookMe(scope.row)">成绩分析</el-button>
          <el-button class="delete" type="text" @click="del(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pageHtml
      :tabObj.sync="tableData"
      name="classStudentSubjectScoreClassSubjectScoreList"
      :otherType="queryObj"
      :discriminate="1"
    ></pageHtml>
  </div>
</template>
<script>
import {
  classStudentSubjectScoreClassSubjectScoreList,
  schoolTermSchoolTermList,
  examTypeExamTypeList,
  classStudentSubjectScoreSubjectScoreDelete
} from '@/api/api'
import { mapState } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      keywordsVal: '',
      schoolTerm: '',
      schoolTermObj: [],
      eaminationType: '',
      eaminationTypeObj: [],
      queryObj: this.$route.query,
      tableData: []
    }
  },

  methods: {
    exminationInfo (row) {
      console.log(row)
      this.$router.push({
        name: 'StudentMarkListInfo',
        query: {
          classId: row.classId,
          term: row.term,
          examType: row.examType,
          subjectId: row.subjectId,
          gradeId: row.gradeId
        }
      })
    },

    countLookMe (row) {
      console.log(row)
      this.$router.push({
        name: 'OtSubjectScoreAnalysis',
        query: {
          term: row.term,
          examType: row.examType,
          classId: row.classId,
          subjectId: row.subjectId,
          subjectName: row.subjectName
        }
      })
    },

    del (index, row) {
      let _this = this
      this.$confirm('是否确定删除该条成绩记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          classStudentSubjectScoreSubjectScoreDelete({ id: row.id }).then(res => {
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
    schoolTermChange (val) {
      this.queryObj.term = val
      this.schoolTerm = val
      classStudentSubjectScoreClassSubjectScoreList({
        classId: this.queryObj.classId,
        term: val,
        examType: this.eaminationType ? this.eaminationType : null,
        subjectId: this.queryObj.subjectId,
        type: 1
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },

    eaminationChange (val) {
      this.queryObj.examType = val
      this.eaminationType = val
      classStudentSubjectScoreClassSubjectScoreList({
        classId: this.queryObj.classId,
        subjectId: this.queryObj.subjectId,
        type: 1,
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
  computed: {
    ...mapState(['controlShow'])
  },
  created () {
    //表格数据
    classStudentSubjectScoreClassSubjectScoreList({
      type: 1,
      subjectId: this.queryObj.subjectId,
      classId: this.queryObj.classId
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
