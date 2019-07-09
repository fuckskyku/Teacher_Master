 <template>
  <div id="classbaseStudent">
    <div class="seach">
      <div class="seach_left">
        <el-input
          placeholder="搜索姓名、学号(回车进行搜索)"
          suffix-icon="el-icon-search"
          @change="keyWordsInput"
          v-model="keywordsVal"
          clearable
        ></el-input>
        <div class="section">
          <div class="section_title">筛选：</div>
          <el-select v-model="sexVal" placeholder="请选择性别" clearable @change="sexEvent">
            <el-option
              v-for="item in sexObj"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="seach_right">
        <el-button icon="el-icon-plus" class="seach_yellow" round @click="addStudent">新增学生</el-button>
        <el-button icon="el-icon-download" class="seach_yellow" round>
          <!-- 下载模板 -->
          <a href="/static/template/咪师学生导入模板.xlsx" download style="color:black">下载模板</a>
          <!-- <a href="https://baidu.com/">下载模板</a> -->
        </el-button>

        <!-- <el-button icon="el-icon-upload" class="add" round>导入数据</el-button> -->
        <el-upload
          class="upload-demo"
          ref="upload"
          name="toImportFile"
          action="/api/importStudent/importData"
          :before-upload="beforeAvatarUploadFile"
          :on-success="handleAvatarSuccessFile"
          :show-file-list="false"
          :headers="headers"
          :multiple="false"
        >
          <el-button icon="el-icon-upload" class="seach_yellow" round>导入数据</el-button>
        </el-upload>

        <el-button icon="el-icon-delete" type="danger" round @click="batchDel">批量删除</el-button>
      </div>
    </div>

    <el-table
      :data="tableData.data"
      style="width: 100%"
      height="600"
      @select="checkbox"
      @select-all="checkboxAll"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
    >
      <el-table-column type="selection"></el-table-column>
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <!-- <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="商品名称">
                        <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="所属店铺">
                        <span>{{ props.row.shop }}</span>
                    </el-form-item>
                    <el-form-item label="商品 ID">
                        <span>{{ props.row.id }}</span>
                    </el-form-item>
                    <el-form-item label="店铺 ID">
                        <span>{{ props.row.shopId }}</span>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <span>{{ props.row.category }}</span>
                    </el-form-item>
                    <el-form-item label="店铺地址">
                        <span>{{ props.row.address }}</span>
                    </el-form-item>
                    <el-form-item label="商品描述">
                        <span>{{ props.row.desc }}</span>
                    </el-form-item>
                    </el-form>
                </template>
      </el-table-column>-->
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop="studentNo" label="学号"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.sex==0?"男":"女"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prentCount" label="家长人数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="look(scope.row)" class="look">查看</el-button>
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <!-- <el-button class="delete" type="text" @click="del(scope.row,scope.$index)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogTableVisible"
      :fullscreen="false"
      width="940px"
      top="1.5vh"
      custom-class="disalog"
      @closed="close"
    >
      <div slot="title" class="student_title">学生信息</div>
      <div class="infoContainer">
        <el-form
          ref="studentInfo"
          :rules="verifyInfo"
          :model="dynamicValidateForm"
          label-width="150px"
          class="demo-form-inline"
          :disabled="!dialogButtonFlag"
        >
          <div class="studentInfo">
            <el-form-item label="学生正脸照">
              <el-upload
                class="avatar-uploader"
                action="/api/storage/uploadSingleFile"
                :multiple="false"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleAvatarSuccessImgSuccess"
                :before-upload="beforeAvatarUploadImg"
              >
                <img v-if="studentImg" :src="studentImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div style="margin-left:20px;color:#ccc;">正脸照将用于人脸识别</div>
            </el-form-item>

            <!-- <el-form-item label="活动名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>-->
            <el-form-item label="班牌卡号">
              <el-input v-model="dynamicValidateForm.ecardId" placeholder="请输入班牌卡号"></el-input>
            </el-form-item>

            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="dynamicValidateForm.studentName" placeholder="请输入学生姓名"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="dynamicValidateForm.sex" @change="sexChange">
                <el-radio :label="1">女</el-radio>
                <el-radio :label="0">男</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="入学时间">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="dynamicValidateForm.enterSchoolTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="出生日期">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="dynamicValidateForm.birthday"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="身份证/护照">
              <el-input v-model="dynamicValidateForm.idCard" placeholder="请输入身份证或护照"></el-input>
            </el-form-item>

            <el-form-item label="学号" prop="studentNo">
              <el-input v-model="dynamicValidateForm.studentNo" placeholder="请输入学号"></el-input>
            </el-form-item>
          </div>
          <!-- 家长信息 -->
          <div class="student_title">家长信息</div>
          <div class="familyInfo">
            <div class="title">
              <div>亲属关系</div>
              <div>姓名</div>
              <div>手机号</div>
              <div>主家长</div>
              <div>操作</div>
            </div>
            <el-form
              :inline="true"
              :model="dynamicValidateForm"
              class="demo-form-inline"
              ref="dynamicValidateForm"
              :disabled="!dialogButtonFlag"
            >
              <div
                class="form_children"
                v-for="(parentDatas,index) in dynamicValidateForm.parentDatas"
                :key="parentDatas.key"
              >
                <el-form-item
                  label
                  :prop="'parentDatas.'+index+'.kinshipId'"
                  :rules="{required: true, message: '关系不能为空', trigger: 'change'}"
                >
                  <el-select v-model="parentDatas.kinshipId" placeholder="请选择">
                    <el-option
                      v-for="(item,index) in relationObj"
                      :key="index"
                      :label="item.dictName"
                      :value="item.dictCode"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label
                  :prop="'parentDatas.'+index+'.realName'"
                  :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}"
                >
                  <el-input v-model="parentDatas.realName" placeholder="请输入姓名"></el-input>
                </el-form-item>

                <el-form-item label :prop="'parentDatas.'+index+'.mobile'" :rules="Ismobile">
                  <el-input v-model="parentDatas.mobile" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                <el-form-item
                  label
                  prop="radio"
                  :rules="{required: true, message: '主家长不能为空', trigger: 'change'}"
                >
                  <!-- <el-radio-group > -->
                  <el-radio v-model="dynamicValidateForm.radio" :label="index">&nbsp;</el-radio>
                  <!-- </el-radio-group> -->
                </el-form-item>

                <el-form-item label>
                  <el-row>
                    <el-button type="text" @click="removeDomain(parentDatas)">删除</el-button>
                    <!-- <el-button type="danger" icon="el-icon-delete" circle @click="removeDomain(domain)"></el-button> -->
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
          </div>
        </el-form>
      </div>

      <div class="form_group">
        <el-button round class="complete" v-if="dialogButtonFlag" @click="submitData">提交</el-button>
        <el-button round class="cancelUser" @click="dialogTableVisible=false">取消</el-button>
      </div>
    </el-dialog>

    <pageHtml
      :tabObj.sync="tableData"
      name="studentPageList"
      :type="sexVal"
      :searchsKey="keywordsVal"
      :classId="classId"
    ></pageHtml>
  </div>
</template>
<script>
import axios from "axios";
import {
  studentPageList,
  commonDictList,
  studentLookForm,
  studentDelete,
  studentAdd,
  studentUpdate
} from "@/api/api";
// import util from '@/util/util'
import Vue from "vue";
export default {
  inject: ["reload"],
  data() {
    var verify = {
      studentNo: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入学号!"));
        } else if (!value.match(/^[A-Za-z0-9]+$/)) {
          return callback(new Error("请输入正确的学号!"));
        } else {
          callback();
        }
      },
      mobile: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入手机号码"));
        } else if (
          !value.match(
            /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
          )
        ) {
          return callback(new Error("请输入正确的手机号码!"));
        } else {
          callback();
        }
      }
    };
    //表单验证
    var verifyParents = [];

    return {
      Ismobile: { validator: verify.mobile, trigger: "blur",required: true},

      studentImg: "",

      //url传参
      classId: "",

      //关键字搜索
      keywordsVal: "",
      //条件筛选数据
      sexObj: [],
      sexVal: "",
      //亲属关系
      relationObj: [],

      //查看和编辑的暂时数据
      occActionData: null,
      //查看学生所有家长暂时数据
      occActionParents: null,

      dialogTableVisible: false,
      dialogButtonFlag: true,
      //表格数据
      tableData: [],

      //批量删除数据暂存
      temporaryDelAllObj: [],

      //控制是新增还是修改的状态
      flagType: true,
      //表单数据
      dynamicValidateForm: {
        classId: this.$route.query.classId,
        sex: 0,
        parentDatas: [
          {
            kinshipId: "",
            realName: "",
            mobile: "",
            primaryStatus: 0,
            rowState: "create"
          }
        ]
      },
      //表单废弃数据存储
      discardObj: [],

      // //文件列表
      // fileList: [],
      // imgList: [],

      //学生信息验证
      verifyInfo: {
        studentName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        studentNo: [
          { required: true, validator: verify.studentNo, trigger: "blur" }
        ]
      }
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
    this.classId = this.$route.query.classId;

    //表格数据
    studentPageList({
      classId: this.classId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.tableData = res.data.data;
      }
    });

    //审批状态下拉选择,通知状态下拉选择
    commonDictList({ dataTypeCodes: "sex_type_code,kinship_type" }).then(
      res => {
        if (res.data.code == 200) {
          console.log(res.data.data);
          this.sexObj = res.data.data.sex_type_code;
          this.relationObj = res.data.data.kinship_type;
        }
      }
    );
  },

  methods: {
    //关键字筛选
    keyWordsInput(val) {
      console.log(val);
      this.keywordsVal = val;
      studentPageList({
        sex: this.sexVal ? this.sexVal : null,
        searchWord: val,
        classId: this.classId
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          res.data.data.data.forEach(item => {
            item.hoverShow = false;
          });
          this.tableData = res.data.data;
        }
      });
    },

    //筛选条件
    sexEvent(val) {
      this.sexVal = val;
      console.log(this.sexVal);
      studentPageList({
        sex: val,
        searchWord:
          this.keywordsVal && this.keywordsVal != "" ? this.keywordsVal : null,
        classId: this.classId
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          res.data.data.data.forEach(item => {
            item.hoverShow = false;
          });
          this.tableData = res.data.data;
        }
      });
    },

    sexChange(val) {
      console.log(val);
    },

    addStudent() {
      this.dialogButtonFlag = true;
      this.dialogTableVisible = true;
    },

    look(row) {
      this.dialogTableVisible = true;
      this.dialogButtonFlag = false;
      studentLookForm({
        id: row.id
      }).then(res => {
        if (res.data.code == 200) {
          res.data.data.student.birthday = new Date(
            res.data.data.student.birthday
          ).format("yyyy-MM-dd");
          res.data.data.student.enterSchoolTime = new Date(
            res.data.data.student.enterSchoolTime
          ).format("yyyy-MM-dd");
          this.dynamicValidateForm = res.data.data.student;
          this.dynamicValidateForm.parentDatas = res.data.data.studentParents;
          this.dynamicValidateForm.studentImg =
            this.imgJoInUrl() + this.dynamicValidateForm.studentImg;
          this.studentImg = this.dynamicValidateForm.studentImg;
          res.data.data.studentParents.some((item, index, array) => {
            if (item.primaryStatus == 1) {
              this.dynamicValidateForm.radio = index;
            }
          });
        }
      });
    },

    edit(row) {
      this.flagType = false;
      studentLookForm({
        id: row.id
      }).then(res => {
        if (res.data.code == 200) {
          this.dialogTableVisible = true;
          this.dialogButtonFlag = true;

          res.data.data.student.birthday = res.data.data.student.birthday
            ? new Date(res.data.data.student.birthday).format("yyyy-MM-dd")
            : null;
          res.data.data.student.enterSchoolTime = res.data.data.student
            .enterSchoolTime
            ? new Date(res.data.data.student.enterSchoolTime).format(
                "yyyy-MM-dd"
              )
            : null;

          this.dynamicValidateForm = res.data.data.student;
          res.data.data.studentParents.forEach(item => {
            item.rowState = "update";
          });
          Vue.set(
            this.dynamicValidateForm,
            "parentDatas",
            res.data.data.studentParents
          );
          this.studentImg =
            this.imgJoInUrl() + this.dynamicValidateForm.studentImg;
          this.dynamicValidateForm.studentImg = this.dynamicValidateForm.studentImg;

          res.data.data.studentParents.some((item, index, array) => {
            if (item.primaryStatus == 1) {
              this.dynamicValidateForm.radio = index;
            }
          });
          console.log(this.dynamicValidateForm);
        }
      });
    },

    //批量删除
    batchDel() {
      if (this.temporaryDelAllObj.length != 0) {
        this.$confirm("是否确定删除已选学生?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // console.log(this.temporaryDelAllObj)
            let delList = [];
            this.temporaryDelAllObj.forEach(item => {
              delList.push(item.id);
            });
            studentDelete({ ids: delList.toString() }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.temporaryDelAllObj = [];
                this.reload();
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
      this.temporaryDelAllObj = selection;
    },

    //表格全选方法
    checkboxAll(selection) {
      console.log(selection);
      this.temporaryDelAllObj = selection;
    },

    del(row, index) {
      this.$confirm("是否确定删除该学生?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          studentDelete({
            ids: row.id
          }).then(res => {
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

    removeDomain(item) {
      var index = this.dynamicValidateForm.parentDatas.indexOf(item);
      if (index !== -1) {
        let zero = this.dynamicValidateForm.parentDatas.splice(index, 1);
        this.discardObj.push(zero[0]);
      }
    },

    //关闭弹出层
    close() {
      this.$refs["studentInfo"].clearValidate();
      this.$refs["dynamicValidateForm"].clearValidate();
      this.flagType = true;
      this.dialogTableVisible = false;
      this.studentImg = "";
      this.dynamicValidateForm = {
        classId: this.classId,
        sex: 0,
        parentDatas: [
          {
            kinshipId: "",
            realName: "",
            mobile: "",
            primaryStatus: 0,
            rowState: "create"
          }
        ]
      };
    },

    addDomain() {
      this.dynamicValidateForm.parentDatas.push({
        kinshipId: "",
        realName: "",
        mobile: "",
        primaryStatus: 0,
        rowState: "create"
      });

      // console.log(this.dynamicValidateForm.parentDatas)
    },
    submitData() {
      if (!this.dynamicValidateForm.parentDatas.length < 1) {
        this.$refs["studentInfo"].validate(valid => {
          if (valid) {
            this.$refs["dynamicValidateForm"].validate(valid => {
              if (valid) {
                this.dynamicValidateForm.parentDatas.some(
                  (item, index, array) => {
                    if (this.dynamicValidateForm.radio == index) {
                      item.primaryStatus = 1;
                      return;
                    }
                  }
                );
                var obj = { ...this.dynamicValidateForm };
                obj.parentDatas = JSON.stringify(obj.parentDatas);
                if (this.flagType) {
                  studentAdd(obj).then(res => {
                    if (res.data.code == 200) {
                      this.$message({
                        type: "success",
                        message: res.data.message
                      });
                      this.discardObj = [];
                      this.dialogTableVisible = false;
                      this.dynamicValidateForm = {
                        classId: this.classId,
                        parentDatas: [
                          {
                            kinshipId: "",
                            realName: "",
                            mobile: "",
                            primaryStatus: 0,
                            rowState: "create"
                          }
                        ]
                      };
                      this.reload();
                    } else {
                      this.$message({
                        type: "error",
                        message: res.data.message
                      });
                    }
                  });
                } else {
                  let updateObj = JSON.parse(obj.parentDatas);
                  this.discardObj.forEach(item => {
                    item.rowState = "delete";
                    updateObj.push(item);
                  });
                  obj.parentDatas = JSON.stringify(updateObj);
                  studentUpdate(obj).then(res => {
                    if (res.data.code == 200) {
                      this.$message({
                        type: "success",
                        message: res.data.message
                      });
                      this.dialogTableVisible = false;
                      this.dynamicValidateForm = {
                        classId: this.classId,
                        parentDatas: [
                          {
                            kinshipId: "",
                            realName: "",
                            mobile: "",
                            primaryStatus: 0,
                            rowState: "create"
                          }
                        ]
                      };
                      this.reload();
                    } else {
                      this.$message({
                        type: "error",
                        message: res.data.message
                      });
                    }
                  });
                }
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "至少有一个家长"
        });
      }
    },
    // download() {
    //   // window.location.host +
    //   window.open('/template/咪师学生导入模板.xlsx')
    // },

    //学生头像
    handleAvatarSuccessImgSuccess(res, file) {
      console.log(res);
      if (res.code == 200) {
        this.studentImg = this.imgJoInUrl() + res.data.url;
        console.log(this.studentImg);

        this.dynamicValidateForm.studentImg = res.data.url; // this.imageUrl = URL.createObjectURL(file.raw)
        this.$message.success(res.message);
      } else {
        console.log("失败");
      }
    },

    //导入文件
    handleAvatarSuccessFile(res, file) {
      if (file.response.code == "200") {
        this.$message.success(file.response.message);
        this.reload();
      } else {
        this.$message.error(file.response.message);
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
        return false;
      }
    },

    //图片上传之前处理
    beforeAvatarUploadImg(file) {
      console.log(file.type);
      //控制上传文件格式
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式和PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // console.log(file)
      return (isJPG || isPNG) && isLt2M;
    }
  }
};
</script>

<style lang="scss">
</style>
