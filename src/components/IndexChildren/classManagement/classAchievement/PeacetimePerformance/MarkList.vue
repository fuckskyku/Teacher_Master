// 学生平时成绩列表
 <template>
  <div id="MarkList">
    <div class="seach">
      <!-- <div class="seach_left">
        <el-input placeholder="搜索学生姓名、历史成绩(回车进行搜索)" suffix-icon="el-icon-search" clearable v-model="keywordsVal" @change="keyWordsInput"></el-input>
      </div> -->
      <div class="seach_right">
        <div class="seach_title">筛选：</div>

        <el-select v-model="schoolTerm" placeholder="按学期筛选" @change="schoolTermChange" clearable>
          <el-option v-for="item in schoolTermObj" :key="item.id" :label="item.term" :value="item.term"></el-option>
        </el-select>

        <el-select v-model="eaminationType" placeholder="按考试类型筛选" @change="eaminationChange" clearable>
          <el-option v-for="item in eaminationTypeObj" :key="item.id" :label="item.typeName" :value="item.typeName"></el-option>
        </el-select>

        <el-select v-model="subjectVal" placeholder="按科目类型筛选" @change="subjectChange" clearable>
          <el-option v-for="item in subjectObj" :key="item.id" :label="item.subjectName" :value="item.subjectId">
          </el-option>
        </el-select>

      </div>
    </div>
    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="term" label="学期" width="100"></el-table-column>
      <el-table-column prop="gradeClassName" label="年级班级" width="110"></el-table-column>
      <el-table-column prop="subjectName" label="科目"></el-table-column>
      <el-table-column prop="examName" label="平时成绩名称" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.examName != 'undefined'?scope.row.examName:'无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="examType" label="平时成绩类型" width="110"></el-table-column>
      <el-table-column prop="examTime" label="考试时间" width="100">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>
            {{ new Date(scope.row.examTime).format('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fullScore" label="满分值"></el-table-column>
      <el-table-column prop="higScore" label="最高分"></el-table-column>
      <el-table-column prop="lowScore" label="最低分"></el-table-column>
      <el-table-column prop="averageScore" label="平均分"></el-table-column>
      <!-- <el-table-column prop="standardDeviation" label="标准差"></el-table-column> -->
      <el-table-column prop="passRate" label="及格率(60%)" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ scope.row.passRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodRate" label="优良率(80%)" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ scope.row.goodRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isSend" label="是否已发给家长" width="120">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ scope.row.isSend==true?"是":'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="exminationInfo(scope.row)">成绩详情</el-button>
          <el-button class="delete" type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pageHtml :tabObj.sync='tableData' name="classStudentSubjectScoreClassSubjectScoreList" :otherType='otherType' :classId="queryObj.classId" :discriminate='2'></pageHtml>

  </div>
</template>
<script>
import {
  classStudentSubjectScoreClassSubjectScoreList,
  schoolTermSchoolTermList, //页面的筛选框  --学期
  examTypeExamTypeList, //页面的筛选框  --考试类型
  classStudentSubjectScoreSubjectScoreDelete, //页面的 删除事件 的接口
  classSubjectClassSubjectListByClassId //班级教师科目列表
} from '@/api/api'

export default {
  inject: ['reload'],
  data() {
    return {
      //关键字过滤
      keywordsVal: '',
      queryObj: this.$route.query, //页面传参 （班级ID 年级班级）
      tableData: [],
      schoolTerm: '',
      eaminationType: '',
      schoolTermObj: [], //学期筛选框
      eaminationTypeObj: [], //考试类型筛选框
      subjectObj: [],
      subjectVal: '',
      otherType: {}
    }
  },
  methods: {
    // keyWordsInput(val) {
    //   this.keywordsVal = val
    //   classStudentSubjectScoreClassSubjectScoreList({
    //     classId: this.queryObj.classId,
    //     type: 2,
    //     term: this.schoolTerm ? this.schoolTerm : null,
    //     examType: this.eaminationType ? this.eaminationType : null,
    //     subjectId: this.subjectVal ? this.subjectVal : null,
    //     searchWord: val
    //   }).then(res => {
    //     if (res.data.code == 200) {
    //       this.tableData = res.data.data
    //       console.log(res.data.data)
    //     }
    //   })
    // },

    //过滤条件事件
    schoolTermChange(val) {
      this.schoolTerm = val
      this.otherType.term = val
      classStudentSubjectScoreClassSubjectScoreList({
        classId: this.queryObj.classId,
        type: 2,
        term: val,
        examType: this.eaminationType ? this.eaminationType : null,
        subjectId: this.subjectVal ? this.subjectVal : null,
        searchWord: this.keywordsVal ? this.keywordsVal : null
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },

    eaminationChange(val) {
      this.otherType.examType = val
      this.eaminationType = val
      classStudentSubjectScoreClassSubjectScoreList({
        examType: val,
        classId: this.queryObj.classId,
        type: 2,
        term: this.schoolTerm ? this.schoolTerm : null,
        subjectId: this.subjectVal ? this.subjectVal : null,
        searchWord: this.keywordsVal ? this.keywordsVal : null
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },

    subjectChange(val) {
      this.otherType.subjectId = val
      this.subjectVal = val
      classStudentSubjectScoreClassSubjectScoreList({
        examType: this.eaminationType ? this.eaminationType : null,
        classId: this.queryObj.classId,
        type: 2,
        term: this.schoolTerm ? this.schoolTerm : null,
        subjectId: val,
        searchWord: this.keywordsVal ? this.keywordsVal : null
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },

    //平时成绩详情
    exminationInfo(row) {
      console.log(row)
      this.$router.push({
        name: 'MarkListInfo',
        query: {
          classId: row.classId, //班级id
          term: row.term, //学期
          examType: row.examType, //考试类型
          subjectId: row.subjectId, //科目ID
          examName: row.examName //平时考试name
        }
      })
    },
    del(row) {
      this.$confirm('是否确定删除该条成绩记录', '提示', {
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
                  type: 'warning',
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
    }
  },

  computed: {},
  created() {
    //平时成绩列表
    classStudentSubjectScoreClassSubjectScoreList({
      subjectId: this.queryObj.subjectId,
      classId: this.queryObj.classId,
      type: 2
    }).then(res => {
      //获取 平时考试 列表
      this.tableData = res.data.data
      console.log(this.tableData)
      // this.tableData.className = this.queryObj.className
    })
    
    schoolTermSchoolTermList().then(res => {
      this.schoolTermObj = res.data.data //页面的学期筛选框
    })

    examTypeExamTypeList({
      type: 2
    }).then(res => {
      this.eaminationTypeObj = res.data.data
    })

    classSubjectClassSubjectListByClassId({
      classId: this.queryObj.classId,
      type:2
    }).then(res => {
      console.log(res.data.data)
      this.subjectObj = res.data.data
    })
  }
}
</script>

<style lang="scss">
</style>
