 <template>
  <div id="AchievementManagement">
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
      <el-table-column prop="term" label="学期"></el-table-column>
      <el-table-column prop="gradeClassName" label="年级班级"></el-table-column>
      <el-table-column prop="examType" label="考试类型"></el-table-column>
      <el-table-column prop="higScore" label="总分最高分"></el-table-column>
      <el-table-column prop="lowScore" label="总分最低分"></el-table-column>
      <el-table-column prop="averageScore" label="总分平均分"></el-table-column>
      <el-table-column prop="mainAverageScore" label="主科平均分"></el-table-column>
      <el-table-column label="操作" width="340">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="exminationInfo(scope.row)">成绩详情</el-button>
          <el-button class="look" type="text" @click="countLookMe(scope.row)">总成绩排名</el-button>
          <el-button class="look" type="text" @click="markGo(scope.row)">发送成绩给家长</el-button>
          <el-button class="delete" type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pageHtml
      :tabObj.sync="tableData"
      name="classScoreStatisPage"
      :type="schoolTerm"
      :typeTwo="eaminationType"
      :classId="classId"
    ></pageHtml>

    <!-- 发送成绩给家长 -->
    <el-dialog :visible.sync="dialogVisible2" :close-on-click-modal="false" top="30vh" width="50%">
      <div slot="title" style="text-align:center;">是否确定将以下成绩发送给对应的家长？包括对学生的评价。</div>
      <div class="content" style>
        <div style="text-align:center;width:100%;margin-bottom:20px;">
          <el-button @click="AllButton" class="complete" style="font-size:14px !important">全选</el-button>
        </div>
        <div class="checkItem" v-for="(item,index) in checkSubjectObj" :key="index">
          <div class="All">
            <el-checkbox
              v-model="item.checkItemAll"
              :label="item.subjectName"
              @change="AllChange($event,item)"
            ></el-checkbox>
          </div>
          <div class="itemAll" v-for="(itemOne,indexOne) in item.children" :key="indexOne">
            <el-checkbox
              v-model="itemOne.flag"
              :label="itemOne.label"
              @change="CheckChange($event,item,itemOne)"
            ></el-checkbox>
          </div>
        </div>
      </div>

      <div slot="footer" style="padding-top: 20px;display:flex;justify-content: space-around;">
        <el-button @click="dialogVisible2 = false">关闭</el-button>
        <el-button
          type="primary"
          @click="dialogVisible2_1=true;timing=new Date().getTime()+300000"
        >定时发送</el-button>
        <el-button type="primary" @click="sendMark($event)">发送</el-button>
      </div>

      <el-dialog width="30%" top="35vh" :visible.sync="dialogVisible2_1" append-to-body>
        <div slot="title" style="text-align:center;">定时发送</div>
        <div class="content" style>
          <div class="demo-input-suffix">
            <div>选择定时发送的时间：</div>
            <el-date-picker
              style="width:100%; margin:10px 0"
              v-model="timing"
              type="datetime"
              value-format="timestamp"
              placeholder="请选择定时发送时间"
              default-time="12:00:00"
            ></el-date-picker>
            <!-- {{timing}} -->
            <div v-if="timing">
              成绩将会在
              <span
                style="font-weight:600;padding:0 5px"
              >{{new Date(timing).format('yyyy-MM-dd hh:mm:ss')}}</span>发送给家长
            </div>
          </div>
        </div>
        <div slot="footer" style="padding-top: 20px;display:flex;justify-content: space-around;">
          <el-button type="primary" @click="sendMark($event,timing)">发送</el-button>
          <el-button @click="dialogVisible2_1=false">关闭</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import {
  classScoreStatisPage,
  schoolTermSchoolTermList,
  examTypeExamTypeList,
  classScoreStatisClassScoreDelete,
  classStudentSubjectScoreSubjectListByTermAndExamTypeOnClassId,
  classStudentSubjectScoreSendScoreByQuartzTime,
  classStudentSubjectScoreSendScore
} from "@/api/api";
import { Loading } from "element-ui";
export default {
  inject: ["reload"],
  data() {
    return {
      schoolTerm: "",
      schoolTermObj: [],
      eaminationType: "",
      eaminationTypeObj: [],
      classId: this.$route.query.classId,
      tableData: [],

      temp: {},
      timing: new Date(),
      checkSubjectObj: [],
      dialogVisible2: false,
      dialogVisible2_1: false
    };
  },
  methods: {
    exminationInfo(row) {
      this.$router.push({
        name: "PerformanceDivisionManagement",
        query: {
          classId: row.classId,
          term: row.term,
          examType: row.examType
        }
      });
    },
    countLookMe(row) {
      console.log(row);
      this.$router.push({
        name: "TotalPoints",
        query: {
          classId: row.classId,
          term: row.term,
          examType: row.examType,
          gradeId: row.gradeId
        }
      });
    },
    del(row) {
      this.$confirm("是否确定删除该条成绩记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          classScoreStatisClassScoreDelete({ id: row.id }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.reload();
            } else {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //过滤条件事件
    schoolTermChange(val) {
      this.schoolTerm = val;
      classScoreStatisPage({
        classId: this.classId,
        term: val,
        examType: this.eaminationType ? this.eaminationType : null
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          console.log(res.data.data);
        }
      });
    },
    eaminationChange(val) {
      this.eaminationType = val;
      classScoreStatisPage({
        classId: this.classId,
        term: this.schoolTerm ? this.schoolTerm : null,
        examType: val
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          console.log(res.data.data);
        }
      });
    },

    markGo(row) {
      console.log(row);
      this.temp = row;
      this.dialogVisible2 = true;
      //发送家长
      classStudentSubjectScoreSubjectListByTermAndExamTypeOnClassId({
        term: row.term,
        examType: row.examType,
        classId: row.classId,
        type: 1
      }).then(res => {
        if (res.data.code == 200) {
          res.data.data.push({
            checkItemAll: true,
            subjectId: -1,
            subjectName: "总分成绩"
          });
          res.data.data.push({
            checkItemAll: true,
            subjectId: -2,
            subjectName: "主科成绩"
          });
          res.data.data.forEach(item => {
            let newChildrenList = [
              { label: "班级平均分", flag: true, averageScore: 1 },
              { label: "班级排名", flag: true, classRanking: 1 },
              { label: "年段排名", flag: true, gradeRanking: 1 }
            ];
            item.checkItemAll = true;
            item.children = newChildrenList;
          });
          this.checkSubjectObj = res.data.data;
          console.log(this.checkSubjectObj);
        } else {
          console.log(res);
        }
      });
    },

    AllChange(val, item) {
      console.log(val, item);
      item.children.forEach(item => {
        item.flag = val;
        item.averageScore = val ? 1 : 0;
        item.classRanking = val ? 1 : 0;
        item.gradeRanking = val ? 1 : 0;
      });
    },

    AllButton() {
      console.log(this.ParentalControAll);
      this.ParentalControAll = !this.ParentalControAll;
      this.checkSubjectObj.forEach(item => {
        item.checkItemAll = this.ParentalControAll;
        if (item.children.length && item.children.length != 0) {
          item.children.forEach(itemOne => {
            itemOne.flag = this.ParentalControAll;
            itemOne.averageScore = this.ParentalControAll ? 1 : 0;
            itemOne.classRanking = this.ParentalControAll ? 1 : 0;
            itemOne.gradeRanking = this.ParentalControAll ? 1 : 0;
          });
        }
      });
    },
    CheckChange(val, item, itemOne) {
      console.log(val, item, itemOne);
      if (val) {
        itemOne.averageScore = 1;
        itemOne.classRanking = 1;
        itemOne.gradeRanking = 1;
      } else {
        itemOne.averageScore = 0;
        itemOne.classRanking = 0;
        itemOne.gradeRanking = 0;
      }
      let checkItemAll = item.children.every(
        (itemDren, indexDren, arrayDren) => {
          return itemDren.flag == false;
        }
      );
      // item.checkItemAll = !checkItemAll;
    },

    sendMark(event, time) {
      var LoadingShow = Loading.service({
        lock: true,
        text: "成绩发送中,请耐心等待",
        // spinner: 'el-icon-loading',
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (
        this.checkSubjectObj.some((item, index, arrat) => {
          return item.checkItemAll;
        })
      ) {
        let sendScores = [];
        // console.log(this.checkSubjectObj)
        this.checkSubjectObj.forEach(item => {
          if (item.checkItemAll) {
            let obj = {};
            obj.subjectId = item.subjectId;
            // console.log(item)
            item.children.forEach((itemOne, index) => {
              // console.log(itemOne.averageScore)
              if (index == 0) {
                obj.averageScore = itemOne.averageScore;
                obj.classRanking = 0;
                obj.gradeRanking = 0;
              } else if (index == 1) {
                obj.classRanking = itemOne.classRanking;
              } else if (index == 2) {
                obj.gradeRanking = itemOne.gradeRanking;
              }
            });
            sendScores.push(obj);
            console.log(sendScores);
          }
        });
        var obj = {
          classId: this.temp.classId,
          term: this.temp.term,
          examType: this.temp.examType,
          type: 1,
          teahcerType: 1,
          gradeId: this.temp.gradeId,
          sendScores: sendScores,
          sendTime: time ? time : null
        };
        if (!time) {
          classStudentSubjectScoreSendScore(obj).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.dialogVisible2 = false;
              LoadingShow.close();
            } else {
              console.log(res);
              this.$message({
                type: "warning",
                message: res.data.message
              });
              LoadingShow.close();
            }
          });
        } else {
          if (new Date(time).getTime() > Date.now()) {
            classStudentSubjectScoreSendScoreByQuartzTime(obj).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.dialogVisible2 = false;
                this.dialogVisible2_1 = false;
                LoadingShow.close();
              } else {
                console.log(res);
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
                LoadingShow.close();
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: "您设置的定时时间已经过期"
            });
            LoadingShow.close();
          }
        }
      } else {
        this.$message({
          type: "warning",
          message: "至少选择一个"
        });
        LoadingShow.close();
      }
    }
  },
  computed: {},
  created() {
    //表格数据
    classScoreStatisPage({
      classId: this.classId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.tableData = res.data.data;
      } else {
        console.log(res);
      }
    });

    //学期下拉列表
    schoolTermSchoolTermList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.schoolTermObj = res.data.data;
      }
    });

    //考试下拉列表
    examTypeExamTypeList({ type: 1 }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.eaminationTypeObj = res.data.data;
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
.el-textarea__inner {
  height: 200px;
}
</style>