/*
 * File: TotalPoints.vue
 * Project: teacher
 * File Created: Monday, 5th November 2018 5:54:07 pm
 * Author: LGH (you@you.you)
 * -----
 * Last Modified: Tuesday, 26th March 2019 9:54:42 am
 * Modified By: LGH (1415684247@QQ.COM>)
 * -----
 * Copyright 2017 - 2018 Your Company, Your Company
 * 总成绩排名
 */
 <template>
  <div id="TotalPoints">
    <div class="seach">
      <div class="seach_left">
        <el-input
          placeholder="搜索学生姓名、学号(回车进行搜索)"
          suffix-icon="el-icon-search"
          clearable
          v-model="keywordsVal"
          @change="keyWordsInput"
        ></el-input>
      </div>
      <div class="seach_right">
        <el-button icon class="seach_yellow" round @click="leadingOut">成绩导出</el-button>
        <!-- <el-button icon class="seach_yellow" round @click="majorSetting">主科设置</el-button> -->
        <el-button icon type="primary" round @click="dialogVisible2 = true">发送成绩给家长</el-button>
      </div>
    </div>
    <el-table
      :data="strings"
      style="width: 100%"
      height="600"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
    >
      <template v-for="(item,index) in tableTile">
        <el-table-column
          :label="item.subjectName"
          :key="index"
          width="120"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{scope.row[index]}}</template>
        </el-table-column>
      </template>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="LookMeHistory(scope.$index,scope.row)">学生历史成绩</el-button>
          <el-button class="look" type="text" @click="countLookMe(scope.row)">评价学生</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="PageDiv">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pageNo"
        :page-sizes="[10, 20, 40,60,80,100]"
        :page-size="tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalCount"
      ></el-pagination>
    </div>
    <!-- 评价学生 -->
    <el-dialog :visible.sync="dialogVisible" top="30vh" :close-on-click-modal="false" width="36%">
      <div slot="title" style="text-align:center;">评价学生</div>
      <div class style>
        <el-form ref="form" :model="form" label-width="80px">
          <el-input
            type="textarea"
            resize="none"
            rows="10"
            v-model="form.content"
            placeholder="请输入评价内容（200字符以内)"
            maxlength="200"
          ></el-input>
        </el-form>
        <div slot="footer" style="text-align:center;padding: 20px;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 主科设置 -->
    <el-dialog :visible.sync="dialogVisible1" top="30vh" :close-on-click-modal="false" width="50%">
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
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="saveSubject('subjectForm')">确 定</el-button>
        </div>
      </div>
    </el-dialog>
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
  classStudentScoreStatisStudentScoreRanking,
  classStudentScoreStatisEvaluateStudent, //编辑评价
  classStudentScoreStatisGetEvaluateContent, //获取评价
  studentScoreExportExportStudentScoreRankingExportData, //成绩导出
  gradeMainSubjectSetingClassSubjectList, //主科目查询
  gradeMainSubjectSetingSave, //设置主科目
  // classSubjectClassSubjectListByClassId,
  classStudentSubjectScoreSubjectListByTermAndExamTypeOnClassId,
  classStudentSubjectScoreSendScore,
  classStudentSubjectScoreSendScoreByQuartzTime
} from "@/api/api";

import Vue from "vue";
import axios from "axios";
import { Loading } from "element-ui";
export default {
  inject: ["reload"],
  data() {
    return {
      checkSubjectObj: [],
      studentId: "",
      subjectId: "",
      queryObj: this.$route.query,
      ParentalControAll: true,
      //主科设置
      checkList: [],
      mainSubjectList: [],
      subjectIdList: [],
      subjectObj: [],
      //关键字过滤
      keywordsVal: "",
      tableTile: [],
      strings: [],
      tableData: [],
      dialogShow: "",
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible2_1: false,
      timing: new Date(),
      //评价内容
      form: { content: "" }
    };
  },
  created() {
    this.countList();
    //发送家长
    classStudentSubjectScoreSubjectListByTermAndExamTypeOnClassId({
      term: this.queryObj.term,
      examType: this.queryObj.examType,
      classId: this.queryObj.classId,
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
    //获取title
    gradeMainSubjectSetingClassSubjectList({
      classId: this.queryObj.classId,
      gradeId: this.queryObj.gradeId
    }).then(res => {
      if (res.data.code == 200) {
        this.subjectObj = res.data.data;
      }
    });
  },
  methods: {
    //查看历史成绩
    LookMeHistory(index, row) {
      //ClassAchievementInfoHistory
      console.log(row);
      this.$router.push({
        name: "ClassAchievementInfoHistory",
        query: {
          classId: this.queryObj.classId,
          term: this.queryObj.term,
          studentId: row[row.length - 1],
          studentName: row[1]
        }
      });
    },
    keyWordsInput(val) {
      this.keywordsVal = val;
      classStudentScoreStatisStudentScoreRanking({
        classId: this.queryObj.classId,
        term: this.queryObj.term,
        examType: this.queryObj.examType,
        searchWord: val
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          this.tableData = res.data.data;
          this.tableTile = res.data.data.data.tableTile;
          this.strings = res.data.data.data.strings;
          console.log(this.tableTile, this.strings);
        } else {
          console.log(res);
        }
      });
    },
    //总成绩列表
    countList() {
      classStudentScoreStatisStudentScoreRanking({
        classId: this.queryObj.classId,
        term: this.queryObj.term,
        examType: this.queryObj.examType
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          this.tableData = res.data.data;
          this.tableTile = res.data.data.data.tableTile;
          this.strings = res.data.data.data.strings;
          console.log(this.tableTile, this.strings);
        } else {
          console.log(res);
        }
      });
    },
    majorSetting() {
      //主科目设置
      this.dialogVisible1 = true;
      this.studentId = ""; //主科目设置重置id
      this.mainSubjectList = [];
      gradeMainSubjectSetingClassSubjectList({
        classId: this.queryObj.classId,
        gradeId: this.queryObj.gradeId
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
    //获取总成绩学生评价
    countLookMe(row) {
      this.dialogVisible = true;
      this.studentId = ""; //提交评价重置id
      this.studentId = row[row.length - 1];
      //获取总成绩学生评价
      classStudentScoreStatisGetEvaluateContent({
        term: this.queryObj.term,
        studentId: this.studentId,
        examType: this.queryObj.examType,
        classId: this.queryObj.classId
      }).then(res => {
        if (res.data.code == 200) {
          this.form.content = res.data.data.content;
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
            classId: this.queryObj.classId
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
    //评价提交
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          classStudentScoreStatisEvaluateStudent({
            //编辑个人评价
            term: this.queryObj.term,
            content: this.form.content,
            studentId: this.studentId,
            examType: this.queryObj.examType,
            ClassId: this.queryObj.classId
          }).then(res => {
            if (res.data.code == 200) {
              // console.log(res)
              this.$message({
                type: "success",
                message: res.data.message
              });
              setTimeout(() => {
                this.dialogVisible = false;
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
    //导出
    leadingOut() {
      axios({
        url:
          "/studentScoreExport/exportStudentScoreRankingExportData?classId=" +
          this.queryObj.classId +
          "&term=" +
          this.queryObj.term +
          "&examType=" +
          this.queryObj.examType +
          "&type=1",
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
          downloadElement.download = "学生成绩数据.xls"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function() {});
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
      item.checkItemAll = !checkItemAll;
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
          classId: this.queryObj.classId,
          term: this.queryObj.term,
          examType: this.queryObj.examType,
          type: 1,
          teahcerType: 1,
          gradeId: this.queryObj.gradeId,
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
    },

    handleSizeChange(val) {
      this.tableData.pageSize = val;
      classStudentScoreStatisStudentScoreRanking({
        classId: this.queryObj.classId,
        term: this.queryObj.term,
        examType: this.queryObj.examType,
        pageNo: this.tableData.pageNo,
        pageSize: val,
        searchWord: this.keywordsVal
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          this.tableData = res.data.data;
          this.tableTile = res.data.data.data.tableTile;
          this.strings = res.data.data.data.strings;
          console.log(this.tableTile, this.strings);
        } else {
          console.log(res);
        }
      });
      //条数
      console.log(val);
    },
    handleCurrentChange(val) {
      this.tableData.pageNo = val;
      classStudentScoreStatisStudentScoreRanking({
        classId: this.queryObj.classId,
        term: this.queryObj.term,
        examType: this.queryObj.examType,
        pageNo: val,
        pageSize: this.tableData.pageSize,
        searchWord: this.keywordsVal
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          this.tableData = res.data.data;
          this.tableTile = res.data.data.data.tableTile;
          this.strings = res.data.data.data.strings;
          console.log(this.tableTile, this.strings);
        } else {
          console.log(res);
        }
      });
      //页数
      console.log(val);
    }
  },
  computed: {}
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