 <template>
  <div id="classFamily">
    <div class="seach">
      <div class="seach_left">
        <el-input
          placeholder="搜索家长姓名、学生姓名、手机号码(回车进行搜索)"
          suffix-icon="el-icon-search"
          clearable
          v-model="keywordsVal"
          @change="keyWordsInput"
        ></el-input>

        <div class="section">
          <div class="section_title">筛选：</div>
          <el-select
            v-model="activatedStateVal"
            placeholder="激活状态"
            @change="activatedStateEvent"
            clearable
          >
            <el-option
              v-for="item in activatedStateObj"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="seach_right">
        <el-button
          icon="el-icon-bell"
          class="seach_yellow"
          round
          @click="parentsendBatchParentActivateNoticetAll"
        >一键通知激活</el-button>
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
      <el-table-column prop="realName" label="家长姓名">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span>
          <!-- <span v-if="!scope.row.hoverShow">{{scope.row.realName}}</span>
          <el-input v-if="scope.row.hoverShow" v-model="scope.row.realName" placeholder="请输入内容"></el-input>-->
        </template>
      </el-table-column>

      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
          <!-- <span v-if="!scope.row.hoverShow">{{scope.row.mobile}}</span>
          <el-input v-if="scope.row.hoverShow" v-model="scope.row.mobile" placeholder="请输入内容"></el-input>-->
        </template>
      </el-table-column>

      <el-table-column prop="kinshipId" label="关系">
        <template slot-scope="scope">
          <span>{{filterKinshipId(scope.row.kinshipId)}}</span>
          <!-- <span v-if="!scope.row.hoverShow">{{filterKinshipId(scope.row.kinshipId)}}</span>
          <el-select
            v-model="scope.row.kinshipId"
            placeholder="请选择"
            v-if="scope.row.hoverShow"
            @change="kinshipIdChange($event,scope.row)"
          >
            <el-option
              v-for="item in relationObj"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>-->
        </template>
      </el-table-column>

      <el-table-column prop="gradeClassName" label="年级班级"></el-table-column>

      <el-table-column prop="idStatus" label="是否激活">
        <template slot-scope="scope">
          <span
            :style="{'color':scope.row.idStatus==0?'#F56C6C':'#606266'}"
          >{{scope.row.idStatus==0?'未激活':'已激活'}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="primaryStatus" label="回签家长">
        <template slot-scope="scope">
          <!-- <span :class="[scope.row.primaryStatus==1?'StatusActive':'']"></span> -->

          <span>{{scope.row.primaryStatus==1?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" prop="idStatus">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="edit(scope.row)">{{scope.row.hoverShow?'取消':'编辑'}}</el-button> -->
          <!-- <el-button v-show="scope.row.hoverShow" type="text" @click="editOk(scope.row)">完成</el-button> -->
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button
            v-if="scope.row.idStatus==0&&!scope.row.hoverShow"
            class="warning"
            type="text"
            @click="parentsendParentActivateNoticeEvent(scope.row,$event)"
          >通知激活</el-button>
          <!-- <el-button
            v-show="!scope.row.hoverShow"
            class="delete"
            type="text"
            @click="del(scope.row,scope.$index)"
          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogTableVisible"
      :fullscreen="false"
      width="580px"
      top="30vh"
      @close="closeDialog"
      :show-close="false"
    >
      <div class="notice">
        <div>
          <img src="/static/logoYellow.png" alt>
        </div>
        <div class="text">还有{{noActivateCount}}个家长没有激活</div>
        <el-row>
          <el-button round @click="noRemind">不再通知</el-button>
          <el-button round @click="oneClickNotification">一键通知</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogTableVisibleTwo"
      :fullscreen="false"
      width="940px"
      top="15vh"
      custom-class="disalog"
    >
      <div slot="title" class="student_title">家长信息</div>
      <div class="infoContainer">
        <el-form ref="parent" :model="parentInfo" label-width="150px" class="demo-form-inline">
          <div class="studentInfo">
            <el-form-item
              label="家长正脸照"
              class="tip"
              prop="parentFaceImg"
              :rules="{required: true, message: '正脸照不能为空', trigger: 'change'}"
            >
              <el-upload
                class="avatar-uploader"
                action="/api/storage/uploadSingleFile"
                :multiple="false"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleAvatarSuccessImgSuccess"
                :before-upload="beforeAvatarUploadImg"
              >
                <img
                  v-if="parentInfo.parentFaceImg"
                  :src="imgJoInUrl()+parentInfo.parentFaceImg"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div style="margin-left:20px;color:#ccc;">正脸照将用于人脸识别</div>
            </el-form-item>

            <!-- <el-form-item label="活动名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>-->
            <el-form-item label="学生姓名">
              <el-input v-model="parentInfo.studentName" placeholder="请输入学生姓名" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="年级班级">
              <el-input v-model="parentInfo.gradeClassName" placeholder="请输入年级班级" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item
              label="关系"
              prop="kinshipId"
              :rules="{required: true, message: '关系不能为空', trigger: 'change'}"
            >
              <el-select v-model="parentInfo.kinshipId" placeholder="请选择">
                <el-option
                  v-for="item in relationObj"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="家长姓名"
              prop="realName"
              :rules="{required: true, message: '家长姓名不能为空', trigger: 'change'}"
            >
              <el-input v-model="parentInfo.realName" placeholder="请输入家长姓名"></el-input>
            </el-form-item>

            <el-form-item
              label="手机号码"
              prop="mobile"
              :rules="{required: true, message: '手机号码不能为空', trigger: 'change'}"
            >
              <el-input v-model="parentInfo.mobile" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="form_group">
        <el-button round class="complete" @click="submitData">提交</el-button>
        <el-button round class="cancelUser" @click="dialogTableVisibleTwo=false;closeDialog()">取消</el-button>
      </div>
    </el-dialog>

    <pageHtml
      :tabObj.sync="tableData"
      name="parentPageList"
      :keywords="keywordsVal"
      :selectType="activatedStateVal"
      edit="true"
    ></pageHtml>
  </div>
</template>
<script>
import {
  parentPageList,
  parentDelete,
  commonDictList,
  parentsendParentActivateNotice,
  parentsendBatchParentActivateNoticet,
  checkParentActive,
  parentUpdate,
  parentNoRemind,
  ParentForm
} from "@/api/api";
export default {
  inject: ["reload"],
  data() {
    return {
      //关键字过滤
      keywordsVal: "",
      //激活状态过滤
      activatedStateObj: [
        { dictName: "已激活", dictCode: "1" },
        { dictName: "未激活", dictCode: "0" }
      ],
      activatedStateVal: "",

      dialogTableVisible: false,
      dialogTableVisibleTwo: false,

      parentInfo: {},

      //亲属关系数据
      relationObj: [],

      noActivateCount: "",

      //表格数据
      tableData: [],
      //批量删除数据暂存
      temporaryDelAllObj: []
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

  methods: {
    //添加科目控制
    closeDialog() {
      this.parentInfo = {};
      this.$refs["parent"].resetFields();
    },

    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      parentPageList({
        searchWord: val,
        idStatus: this.activatedStateVal ? this.activatedStateVal : null
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

    //是否激活筛选
    activatedStateEvent(val) {
      this.activatedStateVal = val;
      parentPageList({
        searchWord:
          this.keywordsVal && this.keywordsVal != "" ? this.keywordsVal : null,
        idStatus: val
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

    edit(row) {
      ParentForm({ id: row.id }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data);

          this.parentInfo = res.data.data;
          this.dialogTableVisibleTwo = true;
        }
      });
      // if (!row.hoverShow) {
      //   row.hoverShow = true;
      // } else {
      //   row.hoverShow = false;
      // }
    },

    // editOk(row) {
    //   parentUpdate({
    //     id: row.id,
    //     userId: row.userId,
    //     kinshipId: row.kinshipId,
    //     realName: row.realName,
    //     mobile: row.mobile
    //   }).then(res => {
    //     if (res.data.code == 200) {
    //       this.$message.success("修改成功");
    //       row.hoverShow = false;
    //     } else {
    //       this.$message.error(res.data.message);
    //     }
    //   });
    // },

    del(row, index) {
      this.$confirm("是否确定删除该家长？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var arrId = [];
          arrId.push(row.id);
          console.log(JSON.stringify(arrId));

          parentDelete(JSON.stringify(arrId)).then(res => {
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

    //批量删除
    batchDel() {
      if (this.temporaryDelAllObj.length != 0) {
        this.$confirm("是否确定删除已选家长?", "提示", {
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
            console.log(JSON.stringify(delList));

            parentDelete(JSON.stringify(delList)).then(res => {
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

    //点击不再通知
    noRemind() {
      this.dialogTableVisible = false;
      parentNoRemind().then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data);
        }
      });
    },

    //一键通知
    oneClickNotification() {
      this.$confirm(
        "我们将以短信形式通知未激活的家长激活，是否马上通知？（注：每24h可以通知一次）",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //批量激活家长
          parentsendBatchParentActivateNoticet().then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.dialogTableVisible = false;
            } else {
              this.$message({
                type: "error",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.dialogTableVisible = false;
        });
    },

    //过滤关系
    filterKinshipId(val) {
      if (val == 1) {
        return "父亲";
      } else if (val == 2) {
        return "母亲";
      } else if (val == 3) {
        return "爷爷";
      } else if (val == 4) {
        return "奶奶";
      } else if (val == 5) {
        return "外公";
      } else if (val == 6) {
        return "外婆";
      } else if (val == 7) {
        return "其他关系";
      }
    },

    kinshipIdChange(val, row) {
      row.kinshipId = val;
    },

    //单个通知激活
    parentsendParentActivateNoticeEvent(row, ev) {
      this.$confirm(
        "点击通知激活提示：我们将以短信形式通知未激活的家长激活，是否马上通知？（注：每24h可以通知一次）",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          parentsendParentActivateNotice({
            id: row.id
          }).then(res => {
            if (res.data.code == 200) {
              console.log(ev.target.parentNode);
              // ev.target.parentNode.classList.remove('warning');
              this.$message({
                type: "success",
                message: res.data.message
              });
            } else {
              ev.target.parentNode.classList.remove("warning");
              ev.target.parentNode.classList.add("gray");
              console.log(ev.target.parentNode);
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {});
    },

    //批量激活家长
    parentsendBatchParentActivateNoticetAll() {
      parentsendBatchParentActivateNoticet().then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },

    submitData() {
      this.$refs["parent"].validate(valid => {
        if (valid) {
          parentUpdate({
            id: this.parentInfo.id,
            userId: this.parentInfo.userId,
            kinshipId: this.parentInfo.kinshipId,
            realName: this.parentInfo.realName,
            mobile: this.parentInfo.mobile,
            parentFaceImg: this.parentInfo.parentFaceImg
          }).then(res => {
            if (res.data.code == 200) {
              this.$message.success("修改成功");
              this.dialogTableVisibleTwo = false;
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },

    //学生头像
    handleAvatarSuccessImgSuccess(res, file) {
      console.log(res);
      if (res.code == 200) {
        this.$set(this.parentInfo, "parentFaceImg", res.data.url);
      } else {
        console.log("失败");
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
  },
  created() {
    //表格数据
    parentPageList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        res.data.data.data.forEach(item => {
          item.hoverShow = false;
        });
        this.tableData = res.data.data;
      }
    });

    //未激活家长数量
    checkParentActive().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        if (res.data.data.noRemind == 0) {
          if (res.data.data.noActivateCount != 0) {
            if (!this.isShow("isShowFamilyTime")) {
              this.saveLocalStorage("isShowFamilyTime", Date.now());
              this.noActivateCount = res.data.data.noActivateCount;
              this.dialogTableVisible = true;
            } else {
              this.dialogTableVisible = false;
            }
          } else {
            this.dialogTableVisible = false;
          }
        } else {
          this.dialogTableVisible = false;
        }
      }
    });

    //亲属关系数据
    commonDictList({ dataTypeCodes: "kinship_type" }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data.kinship_type);
        this.relationObj = res.data.data.kinship_type;
      }
    });
  }
};
</script>

<style lang="scss">
.gray {
  color: gray !important;
}
</style>
