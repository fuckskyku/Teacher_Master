<template>
  <div id="AddTestScores">
    <div class="form">
      <el-form ref="ruleForm" :model="form" label-width="80px">
        <el-form-item
          label="考试类型"
          prop="eaminationType"
          :rules="[{ required: true, message: '请选择考试类型', trigger: 'change' }]"
        >
          <el-select v-model="form.eaminationType" placeholder="请选择考试类型" style="margin-right:20px">
            <el-option
              v-for="item in eaminationTypeObj"
              :key="item.id"
              :label="item.typeName"
              :value="item.typeName"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-plus circular" circle @click="addShow"></el-button>
        </el-form-item>
        <div class="tip">
          <p>
            <i class="el-icon-warning"></i>
            为了确保年段的排名正确，年段各个班级的考试类型要一致，所以在导入成绩的时候年段内要商量，选择一致的考试类型再上传。
          </p>
        </div>
        <el-form-item
          label="学期"
          prop="schoolTerm"
          :rules="[{ required: true, message: '请选择学期', trigger: 'change' }]"
        >
          <el-select v-model="form.schoolTerm" placeholder="请选择学期">
            <el-option
              v-for="item in schoolTermObj"
              :key="item.id"
              :label="item.term"
              :value="item.term"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="tip">
          <p>
            <i class="el-icon-warning"></i>
            上学期从九月至隔年一月，下学期从二月(依照农历新年的日期决定)至六月。
          </p>
        </div>
        <el-form-item
          label="考试时间"
          prop="eaminationTime"
          :rules="[{ required: true, message: '请选择考试时间', trigger: 'change' }]"
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.eaminationTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="考试成绩" class="tip-content">
          <el-upload
            class="upload-demo"
            ref="upload"
            name="file"
            action="/api/classStudentSubjectScore/importStudentScore"
            :on-change="fileChange"
            :before-upload="beforeAvatarUploadFile"
            :on-success="handleAvatarSuccessFile"
            :show-file-list="false"
            :auto-upload="false"
            :headers="headers"
            :multiple="false"
            :data="{term:this.form.schoolTerm,examType:this.form.eaminationType,type:1,examTime:this.form.eaminationTime}"
          >
            <el-button icon="el-icon-upload" class="seach_yellow" type="primary">请选择考试成绩</el-button>
          </el-upload>
          <span class="tips" v-if="fileFlagErr" style="color: #FF7262;">
            <i class="el-icon-error"></i> 选择失败
          </span>
          <span class="tips" v-if="fileFlag" style="color: #0ACF83;">
            <i class="el-icon-success"></i> 选择成功
          </span>
          <a href="/static/template/学生成绩导入模板.xls" download>下载模板</a>
          <!-- <el-button type="primary" @click="">请导入考试成绩</el-button>-->
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <!-- <el-button>取消</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title" class="title">考试类型管理</div>
      <div class="container">
        <div>
          <el-button type="primary" @click="addType">添加类型</el-button>
          <el-button type="danger" @click="batchDel">批量删除</el-button>
        </div>
        <!-- <el-scrollbar :native="false" tag="section"> -->
        <el-table
          :data="tableData.data"
          style="width: 100%;"
          @select="checkbox"
          @select-all="checkboxAll"
          border
          height="380px"
          :header-cell-style="{textAlign:'center'}"
          :cell-style="{textAlign:'center',color:'#606266'}"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="类型" prop="typeName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">修改</el-button>
              <el-button class="delete" type="text" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageHtml :tabObj.sync="tableData" name="examTypeExamTypePage" :discriminate="1"></pageHtml>
        <!-- </el-scrollbar> -->
      </div>
      <!-- <div>
                <el-button @click="dialogVisible = false">取 消</el-button>
      </div>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <!-- <el-button type="primary" @click='submit'>确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  schoolTermSchoolTermInList,
  examTypeExamTypeList,
  examTypeExamTypePage,
  examTypeDelete,
  examTypeSave
} from "@/api/api";
import { Loading } from "element-ui";
var LoadingShow;
export default {
  inject: ["reload"],
  data() {
    return {
      schoolTermObj: [],
      eaminationTypeObj: [],
      dialogVisible: false,
      form: { schoolTerm: "" },
      tableData: [],
      eaminationDelAllObj: [],
      fileFlag: false,
      fileFlagErr: false
    };
  },

  computed: {
    headers() {
      if (TOKEN) {
        return {
          Authorization: TOKEN
        };
      } else {
        this.$router.push("/");
      }
    }
  },

  created() {
    //学期下拉列表
    schoolTermSchoolTermInList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.form.schoolTerm = res.data.data[0].term;
        this.schoolTermObj = res.data.data;
      }
    });

    //考试下拉列表
    this.examTypeExamTypeListFun();

    // this.examTypeExamTypePageFun(1);
  },
  methods: {
    //考试类型列表
    examTypeExamTypePageFun() {
      //考试类型列表
      examTypeExamTypePage({
        type: 1
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data);
          this.tableData = res.data.data;
        } else {
          console.log(res);
        }
      });
    },
    examTypeExamTypeListFun() {
      //考试下拉列表
      examTypeExamTypeList({ type: 1 }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data);
          this.eaminationTypeObj = res.data.data;
        }
      });
    },

    addShow() {
      this.dialogVisible = true;
      this.examTypeExamTypePageFun();
    },

    handleClose(done) {
      done();
    },

    //添加考试类型提交
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //   console.log(valid)
          //   alert('submit!')
          console.log(this.form);
          //手动提交文件
          if (this.fileFlag != true) {
            this.$message({
              type: "error",
              message: "请选择考试成绩"
            });
          } else {
            LoadingShow = Loading.service({
              lock: true,
              text: "文件上传中,请耐心等待",
              // spinner: 'el-icon-loading',
              background: "rgba(0, 0, 0, 0.7)"
            });
            this.$refs.upload.submit();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //提示用户文件选择成功
    fileChange(file) {
      //控制上传文件格式
      let Xls = file.name.split(".");
      if (Xls[1] === "xls" || Xls[1] === "xlsx") {
        if (file.status == "ready") {
          this.$message.success("选择成功");
          this.fileFlag = true;
          this.fileFlagErr = false;
        }
        return file;
        // this.fileFlag = true
      } else {
        this.$message.error("上传文件只能是 xls/xlsx 格式!");
        this.fileFlag = false;
        this.fileFlagErr = true;
        return false;
      }
    },

    //文件上传之前处理
    beforeAvatarUploadFile(file) {
      //控制上传文件格式
      let Xls = file.name.split(".");
      if (Xls[1] === "xls" || Xls[1] === "xlsx") {
        return file;
      } else {
        this.$message.error("上传文件只能是 xls/xlsx 格式!");
        this.fileFlag = false;
        this.fileFlagErr = true;
        return false;
      }
    },

    //导入文件
    handleAvatarSuccessFile(res, file) {
      console.log(res, file);
      if (file.response.code == "200") {
        LoadingShow.close();
        this.$message.success(file.response.message);
        this.$router.go(-1);
      } else {
        LoadingShow.close();
        this.$message.error(file.response.message);
        this.fileFlagErr = true;
        this.fileFlag = false;
      }
    },

    //手动提交文件
    // submitFile() {},

    //删除考试类型
    del(row) {
      //   console.log(row,index);
      this.$confirm("是否确定删除该条考试类型?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          examTypeDelete({ ids: row.id }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.examTypeExamTypePageFun();
              this.examTypeExamTypeListFun();
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

    //批量删除
    batchDel() {
      if (this.eaminationDelAllObj.length != 0) {
        this.$confirm("是否确定删除已选考试类型?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // console.log(this.temporaryDelAllObj)
            let delList = [];
            this.eaminationDelAllObj.forEach(item => {
              delList.push(item.id);
            });
            examTypeDelete({ ids: delList.toString() }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.eaminationDelAllObj = [];
                this.examTypeExamTypePageFun();
                this.examTypeExamTypeListFun();
              } else {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
              }
              // console.log(res)
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请先选择至少一项"
        });
      }
    },

    //表格选中方法
    checkbox(selection, row) {
      console.log(selection, row);
      this.eaminationDelAllObj = selection;
    },

    //表格全选方法
    checkboxAll(selection) {
      console.log(selection);
      this.eaminationDelAllObj = selection;
    },

    //添加类型
    addType() {
      this.$prompt("请输入类型", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        //   inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        //   inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          // var arr = []
          // this.tableData.data.map(item =>{
          //   arr.push(item.typeName)
          // })
          //添加内容为空判断
          if (value != null) {
            // if(arr.indexOf(value) == -1){
            examTypeSave({
              type: 1,
              typeName: value
            }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
              } else {
                this.$message({
                  type: "error",
                  message: `${res.data.message}`
                });
              }

              this.examTypeExamTypePageFun();
              this.examTypeExamTypeListFun();
            });
            // }else{
            //   this.$message({
            //     type: 'error',
            //     message: '添加失败，类型已存在'
            //   })
            // }
          } else {
            this.$message({
              type: "error",
              message: "添加失败，内容为空"
            });
          }
        })
        .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '取消输入'
          //   });
        });
    },
    edit(row) {
      console.log("row", row);
      this.$prompt("请输入类型", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        if (value != null) {
          examTypeSave({
            id: row.id,
            type: 1,
            typeName: value
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.examTypeExamTypePageFun();
              this.examTypeExamTypeListFun();
            } else {
              this.$message({
                type: "error",
                message: res.data.message
              });
            }
          });
        }
        // else {
        //   this.$message({
        //     type: "error",
        //     message: "修改失败"
        //   });
        // }
      });
    }
  }
};
</script>

<style lang="scss">
.is-circle {
  background: #ffde2a;
  border: none;
}
</style>
