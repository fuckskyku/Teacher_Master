 <template>
  <div id="classbaseTeacher">
    <div class="seach">
      <div class="seach_left">
        <el-input
          placeholder="搜索任教科目、姓名、手机号(回车进行搜索)"
          suffix-icon="el-icon-search"
          @change="keyWordsInput"
          v-model="keywordsVal"
          clearable
        ></el-input>
        <div class="section">
          <div class="section_title">筛选：</div>
          <el-select v-model="sexVal" placeholder="性别" @change="sexEvent" clearable>
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
        <el-button
          icon="el-icon-plus"
          class="seach_yellow"
          round
          @click="dialogTableVisible=true"
        >新增教师科目</el-button>
        <el-button icon="el-icon-delete" type="danger" round @click="batchDel">批量移除</el-button>
      </div>
    </div>

    <el-table
      :data="tableData.data"
      @select="checkbox"
      @select-all="checkboxAll"
      style="width: 100%"
      height="600"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
    >
      <el-table-column type="selection"></el-table-column>
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="subjectName" label="任教科目"></el-table-column>
      <el-table-column prop="teacherName" label="姓名">
        <template slot-scope="scope">
          <span v-if="!scope.row.hoverShow">{{scope.row.teacherName}}</span>
          <el-select
            v-model="scope.row.teacherId"
            placeholder="请选择"
            v-if="scope.row.hoverShow"
            @change="teahcerChangs($event,scope.row)"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex ==1?'女':'男'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">{{scope.row.hoverShow?'取消':'编辑'}}</el-button>
          <el-button class="delete" type="text" @click="del(scope.row,scope.$index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="false" width="820px">
      <div slot="title" class="teahcerAdd_title">新增教师科目：</div>
      <div class="addInfo">
        <div class="title">
          <div>年级班级</div>
          <div>选择科目</div>
          <div>选择老师</div>
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
            :key="domain.key"
          >
            <el-form-item label :prop="'domains.'+index+'.classId'">
              <span>{{gradeClassName}}</span>
            </el-form-item>

            <el-form-item
              label
              :prop="'domains.'+index+'.subjectId'"
              :rules="{required: true, message: '科目不能为空', trigger: 'change'}"
            >
              <el-select
                v-model="domain.subjectId"
                placeholder="请选择"
                @change="subjectChange(domain)"
              >
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
              <el-select
                v-model="domain.teacherId"
                placeholder="请选择"
                filterable
                @change="teacherChange(domain)"
              >
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
                <el-button type="text" @click="removeDomain(domain)">删除</el-button>
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
        <div class="form_group">
          <el-button @click="submitData" round class="complete">提交</el-button>
          <el-button round class="cancelUser" @click="dialogTableVisible=false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <pageHtml
      :tabObj.sync="tableData"
      name="teacherObjListData"
      :type="sexVal"
      :classId="classId"
      :searchsKey="keywordsVal"
      edit="true"
    ></pageHtml>
  </div>
</template>
<script>
import {
  teacherObjListData,
  teacherList,
  commonDictList,
  classSubjectupdate,
  subjectList,
  classSubjectSave,
  classSubjectdelete,
  gradeClassAllGradeClass
} from "@/api/api";
export default {
  inject: ["reload"],
  data() {
    return {
      //新增模态框
      dialogTableVisible: false,
      dynamicValidateForm: {
        domains: [
          {
            classId: this.$route.query.classId,
            subjectId: "",
            teacherId: "",
            isHas: 1
          }
        ]
      },

      selectSbuject: [],
      selectTeacher: [],
      //   rowData: "",
      //教师列表数据
      teacherList: [],
      //表格数据
      tableData: [],

      //批量删除数据暂存
      temporaryDelAllObj: [],

      //条件筛选数据
      sexObj: [],
      sexVal: "",

      //关键字筛选值
      keywordsVal: "",
      //url参数
      classId: "",
      //class年级班级名称
      gradeClassName: ""
    };
  },
  methods: {
    //筛选条件
    sexEvent(val) {
      console.log(val);
      this.sexVal = val;
      teacherObjListData({
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
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      teacherObjListData({
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

    //修改科目教师
    teahcerChangs(value, row) {
      console.log(row);
      classSubjectupdate({
        id: row.id,
        teacherId: value,
        subjectId: row.subjectId
      }).then(res => {
        if (res.data.code == 200) {
          this.teacherList.forEach(item => {
            if (item.id == value) {
              row.mobile = item.mobile;
              row.sex = item.sex;
              row.teacherName = item.realName;
            }
          });
        }
      });
      row.hoverShow = false;
    },

    //批量删除
    batchDel() {
      if (this.temporaryDelAllObj.length != 0) {
        this.$confirm("是否确定批量移除科目教师?", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning"
        })
          .then(() => {
            // console.log(this.temporaryDelAllObj)
            let delList = [];
            this.temporaryDelAllObj.forEach(item => {
              delList.push(item.id);
            });
            classSubjectdelete({ ids: delList.toString() }).then(res => {
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
              message: "已取消移除"
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

    //科目新增方法
    subjectChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },

    //教师新增方法
    teacherChange(domain) {
      if (domain.isHas == 0) {
        domain.isHas = 2;
      }
    },

    //编辑表格数据
    edit(row) {
      console.log(row);
      if (!row.hoverShow) {
        row.hoverShow = true;
        this.rowData = row.name;
      } else {
        row.hoverShow = false;
      }
    },

    //删除方法
    del(row, index) {
      this.$confirm("是否确定移除该科目教师?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          classSubjectdelete({
            ids: row.id
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.reload();
              // this.reload()
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
            message: "已取消移除"
          });
        });
    },

    //新增科目
    addDomain() {
      this.dynamicValidateForm.domains.push({
        classId: this.classId,
        subjectId: "",
        teacherId: "",
        isHas: 1
      });
    },

    //提交
    submitData() {
      if (!this.dynamicValidateForm.domains.length < 1) {
        this.$refs["dynamicValidateForm"].validate(valid => {
          if (valid) {
            classSubjectSave(
              JSON.stringify(this.dynamicValidateForm.domains)
            ).then(res => {
              console.log(res);
              if (res.data.code == 200) {
                var _this = this;
                this.dialogTableVisible = false;
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1000,
                  onClose(res) {
                    _this.reload();
                  }
                });
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning"
                });
              }
              // console.log(res)
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$message({
          message: "请至少添加一个",
          type: "warning"
        });
      }
    },

    //删除添加的科目
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    }
  },

  created() {
    // console.log(this.getLocalStorage('gradeClassInfo').gradeId)

    this.classId = this.$route.query.classId;

    //教师科目表格列表
    teacherObjListData({
      classId: this.classId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        res.data.data.data.forEach(item => {
          item.hoverShow = false;
        });
        this.tableData = res.data.data;
      }
    });

    //审批状态下拉选择,通知状态下拉选择
    commonDictList({ dataTypeCodes: "sex_type_code" }).then(res => {
      if (res.data.code == 200) {
        this.sexObj = res.data.data.sex_type_code;
      }
    });

    //获取教师列表
    teacherList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.teacherList = res.data.data;
        this.selectTeacher = res.data.data;
      }
    });

    //获取所有科目列表
    subjectList().then(res => {
      if (res.data.code == 200) {
        this.selectSbuject = res.data.data;
        console.log(this.selectSbuject);
      }
      // console.log(res)
    });

    //获取年级班级name
    gradeClassAllGradeClass().then(res => {
      if (res.data.code == 200) {
        res.data.data.some((item, index, array) => {
          if (item.classId == this.classId) {
            this.gradeClassName = item.label;
            console.log(this.gradeClassName);
            return;
          }
        });
      }
    });
  }
};
</script>

<style lang="scss">
</style>
