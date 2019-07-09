<template>
  <div id="issuejobnotice">
    <div class="stepone" v-if="issueShow==1?true:false">
      <div>
        <img src="/static/logoYellow.png" alt>
      </div>
      <div class="stepcontainer">
        <div class="titleicon">
          <i>
            <img src="/static/img/星形.png" alt>
          </i>
          <span>第一步</span>
        </div>
        <div class="addone">
          <div>科目:</div>
          <el-select v-model="homeWorkObj.subjectVal" placeholder="请选择" clearable>
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.subjectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="addtwo">
          <div>选择班级:</div>
          <el-tag
            v-for="(item,index) in homeWorkObj.dynamicTags"
            :key="index"
            type="warning"
            closable
            :disable-transitions="false"
            @close="handleClose(item.classId,index)"
          >{{item.label}}</el-tag>
          <el-button icon="el-icon-plus circular" circle @click="addClass"></el-button>
        </div>
      </div>
    </div>

    <div class="steptwo" v-if="issueShow==2?true:false">
      <div>
        <img src="/static/logoYellow.png" alt>
      </div>
      <div class="stepcontainer">
        <div class="titleicon">
          <i>
            <img src="/static/img/星形.png" alt>
          </i>
          <span>第二步</span>
        </div>
        <div class="addone">
          <div>提交作业的时间:</div>
          <div class="time">
            <el-date-picker
              v-model="homeWorkObj.submitTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd hh:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </div>
        <div class="addtwo">
          <div>标题:</div>
          <el-input v-model="homeWorkObj.homeWorkTitle" placeholder="请输入标题（40字以内）"></el-input>
        </div>
      </div>
    </div>
    <div class="stepthree" v-if="issueShow==3?true:false">
      <div class="stepcontainer">
        <div class="titleicon">
          <i>
            <img src="/static/img/星形.png" alt>
          </i>
          <span>第三步</span>
        </div>
        <div class="addone">
          <div>内容:</div>
          <quill-editor
            v-model="homeWorkObj.content"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
          <!-- <div style="font-size:14px;color:red;margin-top:10px;">点击左上角“返回”按钮，可以将内容存入草稿箱</div> -->
        </div>
      </div>
    </div>

    <div class="button_group">
      <el-button round @click="lastStep" class="black" v-if="issueShow==2||issueShow==3">上一步</el-button>
      <el-button round @click="LookMe" v-if="issueShow==3">预览</el-button>
      <el-button round @click="DraftBox" v-if="issueShow==3">存草稿</el-button>
      <el-button round @click="next(issueShow)">{{issueShow==3?'发布':'下一步'}}</el-button>
    </div>

    <!-- 通知 -->
    <el-dialog
      :visible.sync="dialogTableVisible"
      :fullscreen="false"
      width="580px"
      top="30vh"
      :show-close="true"
      :close-on-click-modal="false"
    >
      <div class="notice">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布作业/发布成功.png" alt>
        </div>
        <div class="text">
          <div>发布作业成功</div>
          <div
            style="font-size:16px;margin-top:10px"
            v-if="integralObj?integralObj.receiveBonusPoint?true:false:false"
          >
            <!-- <img
              src="/static/insetImg/插画/流程步骤/发布作业/integral.png"
              alt
              style="vertical-align:middle;"
            > -->
            <!-- 恭喜您获得{{integralObj?integralObj.receiveBonusPoint:''}}积分 -->
            <div v-if="integralObj.receiveBonusPoint != '' && integralObj.allBonusPoint != ''">
              恭喜您获得<span style="color:red;">{{integralObj ? integralObj.receiveBonusPoint:''}}</span>积分,当前总积分<span style="color:red;">{{integralObj?integralObj.allBonusPoint:''}}</span>分
            </div>
            <div v-if="integralObj.allBonusPoint == '' && integralObj.receiveBonusPoint != ''">
              恭喜您获得{{integralObj ? integralObj.receiveBonusPoint:''}}积分
            </div>
          </div>
        </div>
        <el-row>
          <el-button round @click="skip('integralDetail',true);dialogTableVisible=false">去兑换</el-button>
          <el-button round @click="skip('integralDetail')">查看积分</el-button>
        </el-row>
      </div>
    </el-dialog>

    <!-- 存入草稿 -->
    <el-dialog
      :visible.sync="dialogTableVisibleTwo"
      :fullscreen="false"
      width="580px"
      top="30vh"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="notice">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布作业/发布成功.png" alt>
        </div>
        <div class="text">
          <div>已存入草稿箱</div>
          <div style="font-size:16px;margin-top:10px">
            <!-- <img src="/static/insetImg/插画/流程步骤/发布作业/integral.png" alt="" style="vertical-align:middle;"> -->
            <!-- 恭喜您获得5积分 -->
          </div>
        </div>
        <el-row>
          <el-button round @click="okHomeWorkOne">退出</el-button>
          <el-button round @click="okHomeWork">进入列表</el-button>
        </el-row>
      </div>
    </el-dialog>

    <!-- 树结构 -->
    <el-dialog
      :visible.sync="dialogTableVisibleTree"
      :fullscreen="false"
      width="400"
      height="200"
      top="20vh"
      :center="true"
    >
      <div class="container">
        <el-scrollbar :native="false" tag="section">
          <el-input placeholder="搜索" v-model="TreefilterText" style="margin-bottom:20px"></el-input>
          <el-tree
            :data="treeData"
            ref="Tree"
            :filter-node-method="TreefilterNode"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="homeWorkObj.dynamicTagsId"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisibleTree = false">取 消</el-button>
        <el-button type="primary" @click="getNodeAndCheck">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog
      :visible.sync="dialogTableVisibleLook"
      :fullscreen="false"
      width="1200px"
      top="15vh"
      :close-on-click-modal="false"
    >
      <div slot="title" class="lookTitle">{{homeWorkObj?homeWorkObj.homeWorkTitle:''}}</div>
      <el-scrollbar :native="false" tag="section">
        <div class="lookContent" style="height:420px">
          <div class="title">
            <div class="title_item">
              <time>发布人：{{this.getLocalStorage('login_userInfo').realName+'老师'}}</time>
            </div>
            <div class="title_item">
              <time>科目：{{preview(homeWorkObj.subjectVal)}}</time>
            </div>
            <div class="title_item">
              <time>{{homeWorkObj?'作业提交时间：'+homeWorkObj.submitTime:''}}</time>
            </div>

            <div class="noticeName" v-if="true">
              通知班级：
              <span v-for="(item,index) in homeWorkObj.dynamicTags" :key="index">{{item.label}}</span>
            </div>
          </div>

          <div class="noticeContent" v-html="homeWorkObj?homeWorkObj.content:''"></div>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import {
  subjectList,
  gradeClassClassGradeTree,
  homeworkSave,
  homeworkInfo
} from "@/api/api";
import { quillRedefine } from "vue-quill-editor-upload";
import { parseDate } from "@/util/date";
import { Loading } from "element-ui";
export default {
  data() {
    return {
      //科目列表数据
      subjectList: [],
      homeWorkObj: {
        subjectVal: "",
        dynamicTags: [],
        dynamicTagsId: [],
        submitTime: "",
        homeWorkTitle: "",
        content: ""
      },

      //URL参数
      queryObj: this.$route.query,

      //获取积分对象
      integralObj: null,

      //tree数据
      treeData: [],
      //节点树过滤
      TreefilterText: "",
      //tree配置
      defaultProps: {
        children: "childTreeList",
        label: "label"
      },

      //富文本区域配置和内容
      editorOption: {
        /* quill options */
      },
      dialogTableVisible: false,
      dialogTableVisibleTree: false,
      dialogTableVisibleTwo: false,
      dialogTableVisibleLook: false,
      issueShow: 1,

      //预览暂时数据
      LookMeObj: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },

  created() {
    //富文本配置上传图片功能
    this.editorOption = quillRedefine({
      // 图片上传的设置
      uploadConfig: {
        action: "/api/storage/uploadSingleFile", // 必填参数 图片上传地址
        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        // 你必须把返回的数据中所包含的图片地址 return 回去
        res: respnse => {
          console.log(respnse.data.url);
          // return respnse.data.url
          return this.imgJoInUrl() + respnse.data.url;
        },
        methods: "POST", // 可选参数 图片上传方式  默认为post
        headers: { Authorization: TOKEN },
        // Authorization: TOKEN,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
        name: "file", // 可选参数 文件的参数名 默认为img
        size: 3072, // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
        accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon", // 可选参数 可上传的图片格式
        // input点击事件  formData是提交的表单实体
        change: formData => {
        },
        // 设置请求头 xhr: 异步请求， formData: 表单对象
        header: (xhr, formData) => {
          xhr.setRequestHeader("Authorization", TOKEN);
          // formData.append('token', '1234')
        },
        // start: function (){}
        start: () => {}, // 可选参数 接收一个函数 开始上传数据时会触发
        end: () => {
        }, // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
        success: () => {}, // 可选参数 接收一个函数 上传数据成功时会触发
        error: () => {
        } // 可选参数 接收一个函数 上传数据中断时会触发
      },
      // 以下所有设置都和vue-quill-editor本身所对应
      placeholder: "请输入内容", // 可选参数 富文本框内的提示语
      theme: "snow", // 可选参数 富文本编辑器的风格
      toolOptions: [
        ["bold", "italic", "underline", "strike", "image", "video"],
        [{ color: [] }, { background: [] }],
        ["clean"]
      ], // 可选参数  选择工具栏的需要哪些功能  默认是全部
      handlers: {} // 可选参数 重定义的事件，比如link等事件
    });
    // console.log(parseDate);
    // this.queryObj = this.$route.queryObj
    // console.log(this.queryObj);

    if (this.queryObj.id && this.queryObj.classId) {
      homeworkInfo({
        id: this.queryObj.id,
        classId: this.queryObj.classId
      }).then(res => {
        console.log(res.data.data);
        res.data.data.classGradeNames.forEach(item => {
          console.log(item);
          this.homeWorkObj.dynamicTags.push(item);
          this.homeWorkObj.dynamicTagsId.push(item.classId);
        });
        this.homeWorkObj.subjectVal = res.data.data.subjectId;
        // let obj = {}
        // obj.label = res.data.data.classGradeName
        // obj.class = res.data.data.classId

        // this.homeWorkObj.dynamicTags.push(obj)
        // this.homeWorkObj.dynamicTagsId.push(res.data.data.classId)

        this.homeWorkObj.submitTime = new Date(res.data.data.finishTime).format(
          "yyyy-MM-dd hh:mm:ss"
        );
        this.homeWorkObj.homeWorkTitle = res.data.data.title;
        this.homeWorkObj.content = res.data.data.content;
        // console.log(this.homeWorkObj.dynamicTags)
      });
    }
    //科目列表
    subjectList().then(res => {
      if (res.data.code == 200) {
        this.subjectList = res.data.data;
      }
    });
    //班级树结构
    gradeClassClassGradeTree().then(res => {
      if (res.data.code == 200) {
        this.treeData = res.data.data;
        console.log(res.data.data);
      }
    });
  },

  watch: {
    TreefilterText(val) {
      this.$refs.Tree.filter(val);
    }
  },
  // created() {},
  methods: {
    //添加班级
    addClass() {
      this.dialogTableVisibleTree = true;
      this.TreefilterText = "";
    },

    preview(val) {
      let a = this.subjectList.filter((item, index, array) => {
        return item.id == val;
      });
      return a[0] ? a[0].subjectName : null;
    },
    //删除已选择的班级
    handleClose(classId, index) {
      this.homeWorkObj.dynamicTags.splice(index, 1);

      this.homeWorkObj.dynamicTagsId.forEach((item, index) => {
        if (item == classId) {
          this.homeWorkObj.dynamicTagsId.splice(index, 1);
        }
      });

      this.$refs.Tree.setCheckedKeys(this.homeWorkObj.dynamicTagsId, true);
    },

    //保存进度和提交方法
    next(isshow) {
      if (isshow == 1) {
        let str;
        if (this.homeWorkObj.subjectVal == "") {
          str = "请选择发布的科目";
          this.$message({
            message: str,
            type: "warning",
            center: true
          });
        } else if (this.homeWorkObj.dynamicTags.length < 1) {
          str = "请选择想要发布的班级";
          this.$message({
            message: str,
            type: "warning",
            center: true
          });
        } else {
          this.issueShow = 2;
        }
      } else if (isshow == 2) {
        let str;
        if (this.homeWorkObj.submitTime == "") {
          str = "请设置提交作业时间";
          this.$message({
            message: str,
            type: "warning",
            center: true
          });
        } else if (this.homeWorkObj.homeWorkTitle == "") {
          str = "请输入作业名称";
          this.$message({
            message: str,
            type: "warning",
            center: true
          });
        } else {
          this.issueShow = 3;
        }
      } else if (isshow == 3) {
        if (!this.homeWorkObj.content == "") {
          var GradeIds = [];
          this.homeWorkObj.dynamicTags.forEach(item => {
            GradeIds.push(item.gradeId);
          });
          var LoadingShow = Loading.service({
            lock: true,
            text: "作业发布中,请耐心等待",
            // spinner: 'el-icon-loading',
            background: "rgba(0, 0, 0, 0.7)"
          });
          homeworkSave({
            id: this.queryObj ? this.queryObj.id : null,
            title: this.homeWorkObj.homeWorkTitle,
            subjectId: this.homeWorkObj.subjectVal,
            classIds: this.homeWorkObj.dynamicTagsId,
            finishTime: this.homeWorkObj.submitTime,
            gradeIds: GradeIds,
            content: this.homeWorkObj.content,
            editStatus: 2
          }).then(res => {
            if (res.data.code == 200) {
              LoadingShow.close();
              this.dialogTableVisible = true;
              this.integralObj = res.data.data;
            } else {
              LoadingShow.close();
              alert(1)
              this.$message({
                message: res.data.message,
                type: "warning",
                center: true
              });
            }
          });
        } else {
          this.$message({
            message: "请填写作业内容",
            type: "warning",
            center: true
          });
        }
      }
      // this.$router.push({ name: 'issuehomeworktwo' })
    },

    lastStep() {
      // console.log(this.issueShow)
      if (this.issueShow == 2) {
        this.issueShow = 1;
      } else if (this.issueShow == 3) {
        this.issueShow = 2;
      }
    },

    //树结构方法
    handleNodeClick(val) {},

    //树结构过滤
    TreefilterNode(value, data) {
      if (!value) return true;
      console.log(data);
      return data.label.indexOf(value) !== -1;
    },

    //保存树结构已选数据
    getNodeAndCheck() {
      //得到去除不必要的参数数组
      this.homeWorkObj.dynamicTagsId = this.$refs.Tree.getCheckedKeys().filter(
        (item, index, array) => {
          return !(!item || item === "");
        }
      );
      this.$refs.Tree.getCheckedNodes().forEach(item => {
        if (item.classId) {
          this.homeWorkObj.dynamicTags.push(item);
        }
      });

      //使用es6数组去重
      this.homeWorkObj.dynamicTags = Array.from(
        new Set(this.homeWorkObj.dynamicTags)
      );

      this.dialogTableVisibleTree = false;
    },

    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },
    //预览
    LookMe() {
      if (!this.homeWorkObj.content == "") {
        this.dialogTableVisibleLook = true;
      } else {
        this.$message({
          message: "请填写作业内容",
          type: "warning",
          center: true
        });
      }
    },

    okHomeWorkOne() {
      this.$router.go(-2);
    },

    okHomeWork() {
      if (this.dialogTableVisibleTwo) {
        this.$router.push({
          name: "publishobj"
        });
      } else {
        this.$router.go(-1);
      }
    },

    Save() {
      if (this.homeWorkObj.homeWorkTitle == "") {
        this.$message({
          message: "请输入作业标题",
          type: "warning",
          center: true
        });
      } else if (this.homeWorkObj.content == "") {
        this.$message({
          message: "请填写作业内容",
          type: "warning",
          center: true
        });
      } else {
        this.$msgbox({
          title: "",
          message:
            '<div style="text-align: center;padding: 20px 0 0 0;"><div><img src="/static/insetImg/插画/流程步骤/发布作业/存入草稿箱.png" alt=""></div><div><div style="font-size:16px">是否要将作业存入草稿箱</div></div></div>',
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          distinguishCancelAndClose: true,
          center: true,
          confirmButtonText: "确定",
          cancelButtonText: "关闭"
        })
          .then(() => {
            // this.Save()
            var GradeIds = [];
            this.homeWorkObj.dynamicTags.forEach(item => {
              GradeIds.push(item.gradeId);
            });
            var LoadingShow = Loading.service({
              lock: true,
              text: "草稿保存中,请耐心等待",
              // spinner: 'el-icon-loading',
              background: "rgba(0, 0, 0, 0.7)"
            });

            homeworkSave({
              id: this.queryObj.id ? this.queryObj.id : null,
              title: this.homeWorkObj.homeWorkTitle,
              subjectId: this.homeWorkObj.subjectVal,
              classIds: this.homeWorkObj.dynamicTagsId,
              finishTime: this.homeWorkObj.submitTime,
              gradeIds: GradeIds,
              content: this.homeWorkObj.content,
              editStatus: 1
            }).then(res => {
              if (res.data.code == 200) {
                LoadingShow.close();
                this.dialogTableVisibleTwo = true;
              } else {
                LoadingShow.close();
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  center: true
                });
              }
            });
          })
          .catch(action => {
            // if (action === 'cancel') {
            //   // this.$router.go(-1)
            //   // next(-1)
            // } else if (action === 'close') {
            //   return
            // }
          });
      }
    },

    DraftBox() {
      this.Save();
    },
    skip(type,prams) {
      this.$router.push({
        name: type,
        query: {
          isShow: prams
        }
      });
    }
  },

  components: {
    // quillEditor
  },

  //监听返回路由
  beforeRouteLeave(to, from, next) {
    // if (this.issueShow == 3) {
    // if (this.dialogTableVisible || this.dialogTableVisibleTwo) {
    //   next()
    // } else {
    //   this.$msgbox({
    //     title: '',
    //     message:
    //       '<div style="text-align: center;padding: 20px 0 0 0;"><div><img src="/static/insetImg/插画/流程步骤/发布作业/存入草稿箱.png" alt=""></div><div><div style="font-size:16px">是否要将作业存入草稿</div></div></div>',
    //     dangerouslyUseHTMLString: true,
    //     showCancelButton: true,
    //     distinguishCancelAndClose: true,
    //     confirmButtonText: '保存草稿',
    //     cancelButtonText: '放弃修改'
    //   })
    //     .then(() => {
    //       this.Save()
    //     })
    //     .catch(action => {
    //       if (action === 'cancel') {
    //         // this.$router.go(-1)
    //         next(-1)
    //       } else if (action === 'close') {
    //         return
    //       }
    //     })
    // }
    // } else {
    if (this.dialogTableVisibleTwo || this.dialogTableVisible) {
      next();
    } else {
      this.$confirm("返回后已填写内容将清空，确定退出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$router.go(-1)
          next(-1);
        })
        .catch(() => {
          next(false);
        });
    }

    // }
  }
};
</script>
<style lang="scss">
@import "../../../../assets/Scss/publicTemplate/issue.scss";
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
