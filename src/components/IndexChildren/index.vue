<template>
  <div id="index_section">
    <div class="steps" v-if="controlShow.leading_in==3?false:true">
      <div class="steps_item">
        <div>
          <img src="/static/img/1.png" alt>
          <div class="steps_title">上传学生和家长</div>
          <div class="steps_img">
            <img src="/static/img/箭头流程.png" alt>
          </div>
        </div>
      </div>
      <div class="steps_item">
        <div>
          <img src="/static/img/2灰.png" alt v-if="controlShow.leading_in==1?true:false">
          <img src="/static/img/2.png" alt v-if="controlShow.leading_in==2?true:false">
          <div class="steps_title">添加科目老师</div>
          <div class="steps_img">
            <!-- <img src="/static/img/箭头流程未.png" alt="" v-if="controlShow.leading_in==1?true:false"> -->
            <!-- <img src="/static/img/箭头流程.png" alt="" v-if="controlShow.leading_in==2?true:false"> -->
          </div>
        </div>
      </div>
      <!-- <div class="steps_item">
        <div><img src="/static/img/完成灰.png" alt="">
          <div class="steps_title">确认提交</div>
        </div>
      </div>-->
    </div>

    <div class="upload_type" v-if="controlShow.leading_in==1?true:false">
      <div class="upload_text">
        请
        <a href="/static/template/咪师学生导入模板.xlsx" download>下载模板</a>，按照模板上传本班的学生家长数据
      </div>
      <div class="upload_file">
        <input type="text" class="file_input" disabled>
        <el-upload
          class="upload-demo"
          ref="upload"
          name="toImportFile"
          action="/api/importStudent/importData"
          :before-upload="beforeAvatarUpload"
          :on-change="fileChange"
          :auto-upload="false"
          :headers="headers"
          :show-file-list="false"
          :multiple="false"
        >
          <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>
      <div class="upload_submit">
        <el-button round @click="jump" class="jump">跳过</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认导入</el-button>
      </div>
    </div>

    <div class="upload_type_two" v-if="controlShow.leading_in==2?true:false">
      <div class="title">
        <div>任课班级</div>
        <div>任课科目</div>
        <div>任课老师</div>
        <div>操作</div>
      </div>

      <el-form
        :inline="true"
        :model="dynamicValidateForm"
        class="demo-form-inline"
        ref="dynamicValidateForm"
      >
        <div
          class="form_children"
          v-for="(domain,index) in dynamicValidateForm.domains"
          :key="domain.index"
        >
          <el-form-item
            label
            :prop="'domains.'+index+'.classId'"
            :rules="{required: true, message: '班级不能为空', trigger: 'change'}"
          >
            <!-- <el-input v-model="dynamicValidateForm.className" class="form_name"></el-input> -->
            <el-select v-model="domain.classId" placeholder="请选择" @change="classChange(domain)">
              <el-option
                v-for="(item,index) in selectClass"
                :key="index"
                :label="item.label"
                :value="item.classId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label
            :prop="'domains.'+index+'.subjectId'"
            :rules="{required: true, message: '科目不能为空', trigger: 'change'}"
          >
            <el-select v-model="domain.subjectId" placeholder="请选择" @change="subjectChange(domain)">
              <el-option
                v-for="(item,index) in selectSbuject"
                :key="index"
                :label="item.subjectName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label
            :prop="'domains.'+index+'.teacherId'"
            :rules="{required: true, message: '教师不能为空', trigger: 'change'}"
          >
            <el-select v-model="domain.teacherId" placeholder="请选择" @change="teacherChange(domain)">
              <el-option
                v-for="(item,index) in selectTeacher"
                :key="index"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-row>
              <el-button type="danger" icon="el-icon-delete" circle @click="removeDomain(domain)"></el-button>
            </el-row>
            <!-- <el-button type="primary">删除</el-button> -->
          </el-form-item>
        </div>
      </el-form>

      <div class="button_group">
        <el-row>
          <el-button type="warning" icon="el-icon-plus" circle @click="addDomain"></el-button>
        </el-row>
      </div>
      <div class="form_group">
        <el-button @click="back">上一步</el-button>
        <el-button @click="submitData">提交</el-button>
      </div>
    </div>

    <div class="index_show" v-if="controlShow.leading_in==3?true:false">
      <div class="index_show_content" v-hasMenu>
        <div>
          教师：
          <span>{{teacherAdmin.teacherCount}}</span> 人
        </div>
        <div>
          学生：
          <span>{{teacherAdmin.studentCount}}</span> 人
        </div>
        <div>
          家长：
          <span>{{teacherAdmin.parentCount}}</span> 人
        </div>
        <div>
          积分：
          <span>{{teacherAdmin.bonusPoint}}</span> 分
        </div>
      </div>
      <div>
        <div @click="skip('classList')" v-if="controlShow.isHeadTeacher==1">
          <div>
            <img src="/static/img/班级管理.png" alt>
          </div>
          <div>班级管理</div>
        </div>

        <div @click="skip('classList')" v-if="controlShow.isHeadTeacher==0">
          <div>
            <img src="/static/img/班级管理.png" alt>
          </div>
          <div>任课班级</div>
        </div>

        <div @click="skip('approvalandpublication')">
          <div>
            <img src="/static/img/审批与发布.png" alt>
          </div>
          <div>审批与发布</div>
        </div>
        <div @click="skip('userInfo')">
          <div>
            <img src="/static/img/个人信息.png" alt>
          </div>
          <div>个人信息</div>
        </div>
      </div>
    </div>

    <!-- <div class="index_footer" v-if="controlShow.leading_in==3?true:false">
      <img src="/static/img/wave1.png" alt="">
      <img src="/static/img/wave2.png" alt="">
      <img src="/static/img/wave3.png" alt="">
    </div>-->
    <!-- 通知 -->
    <el-dialog
      :visible.sync="dialogTableVisible"
      :fullscreen="false"
      width="480px"
      top="30vh"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="notice">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布作业/发布成功.png" alt>
        </div>
        <div class="text">
          <div>每天首次登录获得积分</div>
          <div style="font-size:16px;margin-top:10px">
            <!-- <img src="/static/insetImg/插画/流程步骤/发布作业/integral.png" alt="" style="vertical-align:middle;"> -->
            恭喜获取{{integralObj?integralObj.receiveBonusPoint:''}}积分
          </div>
        </div>
        <el-row>
          <el-button round @click="dialogTableVisible=false">关闭</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  gradeClassInfo,
  teacherList,
  subjectList,
  existclassSubjectList,
  classSubjectSave,
  classSubjectdelete,
  teacherAdmin,
  gradeClassAllGradeClass,
  bonusPointLogSignIn,
  teacherUpdateGuideStep
} from "@/api/api";
//引入Vuex辅助计算属性
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      //表格选择数据
      teacherAdmin: {},
      selectSbuject: [],
      selectTeacher: [],
      selectClass: [],
      //控制文件是否上传成功状态

      fileType: true,

      //控制是否签到
      dialogTableVisible: false,
      //首次登录获得积分对象
      integralObj: null,
      //文件列表
      // fileList: [],

      //班级信息集合
      classAndGradeNameObj: null,
      //动态添加的数据
      dynamicValidateForm: {
        domains: []
      }
    };
  },

  computed: {
    ...mapState(["controlShow"]),
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
    //登录签到
    bonusPointLogSignIn().then(res => {
      if (res.data.code == 200) {
        if (res.data.data) {
          this.integralObj = res.data.data;
          console.log(this.integralObj);
          this.dialogTableVisible = true;
        } else {
          // console.log('不可以签到')
        }
      } else {
      }
    });

    //获取所有的科目
    teacherList().then(res => {
      // console.log(res.data.data)
      this.selectTeacher = res.data.data;
    });
    subjectList().then(res => {
      // console.log(res.data.data)
      this.selectSbuject = res.data.data;
    });

    gradeClassAllGradeClass().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.selectClass = res.data.data;
      }
    });

    //已存在的导入信息
    existclassSubjectList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.dynamicValidateForm.domains = res.data.data;
        // //定时获取数据防止数据为空
        // var getClassInfo = setInterval(() => {
        //   // alert(1)
        //   if (
        //     this.getLocalStorage('gradeClassInfo') != 'undefined' &&
        //     this.getLocalStorage('gradeClassInfo') != null
        //   ) {
        //     // console.log(2)
        //     this.classAndGradeNameObj = this.getLocalStorage('gradeClassInfo')
        //     clearInterval(getClassInfo)
        //   }
        // }, 1000 / 60)
      } else {
        return;
      }
    });

    //获取未激活人数
    teacherAdmin().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.teacherAdmin = res.data.data;
      }
    });

    console.log(this.controlShow);

    if (
      this.controlShow.leading_in == 3 &&
      this.controlShow.isHeadTeacher == 1
    ) {
      this.setheaderNav(1);
      this.setclassShow(1);
    } else if (this.controlShow.isHeadTeacher == 0) {
      this.setheaderNav(1);
      this.setclassShow(0);
    }
  },
  methods: {
    ...mapActions(["setclassShow", "setheaderNav", "setleading_in"]),
    jump() {
      this.setheaderNav(1);
      this.setleading_in(3);
      teacherUpdateGuideStep().then(res => {
        console.log(res);
      });
    },
    //文件上传
    fileChange(file) {
      // if (file.status == "success") {
      document.querySelector(".file_input").value = file.name;
      //控制只能上传一个（进行替换）
      // if (fileList.length > 1) {
      //   fileList.splice(0, 1)
      // }
      this.fileType = true;
      if (file.status == "success") {
        if (file.response.code == "200") {
          // this.imgshow = 2
          this.setleading_in(2);
        } else {
          this.fileType = false;
          this.$message.error(file.response.message);
        }
      }
    },
    //文件上传之前处理
    beforeAvatarUpload(file) {
      //控制上传文件格式
      let Xls = file.name.split(".");
      if (Xls[1] === "xls" || Xls[1] === "xlsx") {
        return file;
      } else {
        this.$message.error("上传文件只能是 xls/xlsx 格式!");
        return false;
      }
    },

    //文件提交
    submitUpload() {
      if (this.fileType) {
        this.$refs.upload.submit();
      } else {
        this.$message.error("文件已经失败请重新选择文件上传");
      }
    },

    classChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },
    subjectChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },
    teacherChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },

    back() {
      this.setleading_in(1);
    },

    //上传步骤控制
    submitData() {
      // console.log(this.dynamicValidateForm)
      this.$refs["dynamicValidateForm"].validate(valid => {
        if (valid) {
          // console.log(this.dynamicValidateForm.domains)
          classSubjectSave(
            JSON.stringify(this.dynamicValidateForm.domains)
          ).then(res => {
            if (res.data.code == "200") {
              console.log("Ok");
              this.setleading_in(3);
              this.setheaderNav(1);
              teacherUpdateGuideStep().then(res => {
                console.log(res);
              });
            } else {
              console.log(res);
              this.$message({
                message: res.data.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //新增表格
    addDomain() {
      this.dynamicValidateForm.domains.push({
        classId: "",
        gradeId: "",
        id: "",
        isHas: 1,
        subjectId: "",
        subjectName: "",
        teacherId: "",
        teacherName: ""
      });
    },

    //移除表格
    removeDomain(item) {
      console.log(item);
      if (item.isHas == 0) {
        console.log(1);
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            classSubjectdelete({ ids: item.id }).then(res => {
              console.log(res);
              if (res.data.code == 200) {
                var index = this.dynamicValidateForm.domains.indexOf(item);
                if (index !== -1) {
                  this.dynamicValidateForm.domains.splice(index, 1);
                }
                this.$message({
                  type: "success",
                  message: "删除成功!"
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
      } else {
        console.log(2);
        var index = this.dynamicValidateForm.domains.indexOf(item);
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1);
        }
      }
    },

    //班级管理列表
    //审批与发布列表
    //个人信息列表
    skip(type) {
      this.setheaderNav(0);
      this.setclassShow(0);
      this.$router.push({
        name: type
      });
      // if (type == 'classList') {
      //   this.$router.push({
      //     name: type
      //   })
      // } else if (type == 'approvalandpublication') {
      //   this.$router.push({
      //     name: type
      //   })
      // } else if (type == 'userInfo') {
      //   this.$router.push({
      //     name: type
      //   })
      // } else {
      //   this.$router.push({
      //     name: 'index'
      //   })
      // }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/Scss/publicTemplate/Index.scss";
</style>