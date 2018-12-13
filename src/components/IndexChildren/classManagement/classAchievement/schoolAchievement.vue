 <template>
  <div id="schoolAchievement">
    <div class="seach">
      <div></div>
      <div class="seach_right">
        <el-button icon="el-icon-download" class="seach_yellow" round>
          <!-- 下载模板 -->
          <a href="/static/template/学生成绩导入模板.xls" download style="color:black">下载模板</a>
          <!-- <a href="https://baidu.com/">下载模板</a> -->
        </el-button>
        <el-button icon="el-icon-plus" class="seach_yellow" round @click="AddTestScores">添加考试成绩</el-button>
      </div>
    </div>
    <el-table
      :data="tableData.data"
      style="width: 100%"
      height="600"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
    >
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="schoolName" label="所属分布（校区）"></el-table-column>
      <el-table-column prop="className" label="年级班级"></el-table-column>
      <el-table-column prop="teacherName" label="担任"></el-table-column>
      <el-table-column prop="studentCounts" label="学生人数"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            class="look"
            type="text"
            @click="skipSubject(scope.row)"
            v-if="scope.row.teacherJob==0"
          >科目成绩管理</el-button>
          <el-button
            class="look"
            type="text"
            @click="skip(scope.row)"
            v-if="scope.row.teacherJob==1"
          >学业成绩管理</el-button>
          <el-button
            class="look"
            style="color: #569CCC;"
            type="text"
            @click="majorSetting(scope.row)"
            v-if="scope.row.teacherJob==1"
          >主科设置</el-button>
          <el-button
            class="look"
            style="color: #569CCC;"
            type="text"
            @click="dwonLOadStudentInformation(scope.row)"
          >下载学生信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="count" style="text-align:right;margin-top:10px;">学生总数：{{count}}</div>
    <pageHtml :tabObj.sync="tableData" name="teacherTeacherScoreList"></pageHtml>
    <!-- 主科设置 -->
    <el-dialog :visible.sync="dialogVisible" top="30vh" width="50%">
      <div slot="title" style="text-align:center;">
        <p
          style="font-size: 24px; color: #222;padding: 15px 0;"
        >{{subjectObj[0]?subjectObj[0].gradeClassName + '主科设置':''}}</p>
        <p style="font-size: 12px; color: #666;text-align:left;">主科设置主要用于计算主科总成绩和主科总成绩排名的。</p>
      </div>
      <div class style>
        <el-form ref="subjectForm" :model="form" label-width="80px">
          <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
            <el-checkbox
              v-for="(subjectName,index) in mainSubjectList"
              :label="subjectName"
              :value="index"
              :key="subjectName"
            >{{subjectName}}</el-checkbox>
          </el-checkbox-group>
        </el-form>
        <div slot="footer" style="text-align:center;padding: 20px;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveSubject('subjectForm')">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  teacherTeacherScoreList,
  teacherGetStudentCount,
  gradeMainSubjectSetingClassSubjectList, //主科目查询
  gradeMainSubjectSetingSave //设置主科目
} from "@/api/api";

import Vue from "vue";
import axios from "axios";

export default {
  inject: ["reload"],
  data() {
    return {
      tableData: [],
      count: "",
      //主科设置
      subjectId: "",
      checkList: [],
      mainSubjectList: [],
      subjectIdList: [],
      subjectObj: [],
      dialogVisible: false,
      queryObj: "",
      form: {}
    };
  },
  methods: {
    skip(row) {
      this.$router.push({
        name: "AchievementManagement",
        query: {
          classId: row.id
        }
      });
    },
    skipSubject(row) {
      // console.log(row)
      this.$router.push({
        name: "SubjectGradeManagementStudies",
        query: {
          subjectId: row.subjectId,
          classId: row.classId
        }
      });
    },
    AddTestScores() {
      this.$router.push({
        name: "AddTestScores"
      });
    },
    majorSetting(row) {
      console.log("row", row);
      this.queryObj = row;
      //主科目设置
      this.dialogVisible = true;
      this.subjectId = ""; //主科目设置重置id
      this.mainSubjectList = [];
      gradeMainSubjectSetingClassSubjectList({
        classId: row.id,
        gradeId: row.gradeId
      }).then(res => {
        if (res.data.code == 200) {
          this.subjectObj = res.data.data;
          console.log("this.subjectObj", this.subjectObj);
          this.subjectObj.map(item => {
            if (item.isHas == 1) {
              //当isHas为1勾选复选框，保存对应科目id
              this.checkList.push(item.subjectName);
              this.subjectIdList.push(item.subjectId);
              this.subjectId = this.subjectIdList.toString();
            }
            this.mainSubjectList.push(item.subjectName);
          });
        }
      });
    },
    //科目选择
    handleCheckedChange(val) {
      this.subjectIdList = [];
      //关键字匹配subjectId
      val.map(itemOne => {
        this.subjectObj.map((item, index) => {
          if (item.subjectName == itemOne) {
            this.subjectIdList.push(item.subjectId);
          }
        });
      });
    },
    //保存主科目设置
    saveSubject(subjectForm) {
      //这里执行ajax
      this.$refs[subjectForm].validate(valid => {
        if (valid) {
          gradeMainSubjectSetingSave({
            gradeId: this.queryObj.gradeId,
            subjectId: this.subjectIdList.toString(),
            classId: this.queryObj.id
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              setTimeout(() => {
                this.dialogVisible1 = false;
                this.reload();
              }, 500);
            } else {
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    dwonLOadStudentInformation(row) {
      axios({
        url: "/student/exportStudentScoreTemp?classId=" + row.id,
        method: "get",
        headers: { Authorization: TOKEN },
        responseType: "blob"
      })
        .then(function(res) {
          var blob = new Blob([res.data], {
            type: res.headers["content-type"]
          });
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "学生成绩导入模板.xls"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function() {});
    }
  },

  created() {
    teacherGetStudentCount().then(res => {
      if (res.data.code == 200) {
        this.count = res.data.data;
      } else {
        console.log(res);
      }
    });
    //表格列表
    teacherTeacherScoreList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.tableData = res.data.data;
      } else {
        console.log(res);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.el-checkbox + .el-checkbox {
  margin-left: 0;
  // border: 1px solid red;
}
.el-checkbox {
  margin-right: 30px;
}
</style>
