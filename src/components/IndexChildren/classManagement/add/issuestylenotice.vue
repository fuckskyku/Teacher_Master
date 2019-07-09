<template>
  <div id="issuestylenotice">
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
          <div>发布类型:
            <el-radio-group v-model="styleObject.styleType">
              <el-radio :label="1">校园风采</el-radio>
              <el-radio :label="2">校园新闻</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="addtwo">
          <div>标题:</div>
          <el-input v-model="styleObject.styleTitle" placeholder="请输入标题（40字以内）"></el-input>
        </div>
        <div class="addthee">
          <div>头图:</div>
          <el-upload
            class="avatar-uploader"
            action="/api/storage/uploadSingleFile"
            :multiple="false"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="styleObject.imageUrl"
              :src="this.imgJoInUrl() + styleObject.imageUrl"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">文件大小不能超过3M</div>
          </el-upload>
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
          <div>该新闻风采是否需要审批？</div>
          <el-row>
            <el-radio-group v-model="radio" :disabled="radioDisabled">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-row>
          <el-row class v-if="radio">
            <el-scrollbar
              :native="false"
              class="scrollbar"
              :style="{height:styleObject.styleList.length>3?'100px':styleObject.styleList.length==0?'':'50px'}"
            >
              <div v-for="(item,index) in styleObject.styleList" :key="index">
                <el-tag
                  type="warning"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(item.MarkId,index,'examine',item.flag)"
                >{{item.label?item.label:item.teacherName?item.teacherName:item.approvalUser?item.approvalUser:''}}</el-tag>
                <i v-if="styleObject.styleList.length-1!=index">
                  <img src="/static/img/tip.png" alt>
                </i>
              </div>
              <!-- <el-tag 
               v-for="(item,index) in styleObject.styleList"
               :key="index" 
               type="warning" 
               closable 
               :disable-transitions="false"
                @close="handleClose(item.MarkId,index,'examine',item.flag)">
                {{item.label?item.label:item.teacherName?item.teacherName:item.approvalUser?item.approvalUser:''}}
              </el-tag>-->
            </el-scrollbar>
          </el-row>
          <el-button icon="el-icon-plus circular" circle v-if="radio" @click="addClass('examine')"></el-button>
        </div>
        <div class="addtwo">
          <div>该新闻风采是否需要抄送给谁？</div>
          <el-row>
            <el-radio-group v-model="radio1" :disabled="radioDisabledTwo">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-row>
          <el-row class v-if="radio1">
            <el-scrollbar
              :native="false"
              :style="{height:styleObject.copyList.length>3?'100px':styleObject.copyList.length==0?'':'50px'}"
            >
              <el-tag
                v-for="(item,index) in styleObject.copyList"
                :key="index"
                type="warning"
                closable
                :disable-transitions="false"
                @close="handleClose(item.MarkId,index,'copy',item.flag)"
              >{{item.label?item.label:item.teacherName?item.teacherName:item.realName?item.realName:''}}</el-tag>
            </el-scrollbar>
          </el-row>
          <el-button icon="el-icon-plus circular" circle v-if="radio1" @click="addClass('copy')"></el-button>
        </div>
      </div>
    </div>

    <div class="stepthree" v-if="issueShow==3?true:false">
      <div class="stepcontainer">
        <div class="titleicon">
          <i>
            <img src="/static/img/星形.png" alt>
          </i>
          <span>{{textType?'第二步':'第三步'}}</span>
        </div>
        <div class="addone">
          <div>请选择添加内容的方式:</div>
          <el-radio-group v-model="publishType">
            <el-radio :label="1">图文内容</el-radio>
            <el-radio :label="2">文章链接</el-radio>
          </el-radio-group>
        </div>

        <div class="addtwo" v-if="publishType==2">
          <div>网址链接:</div>
          <el-input
            v-model="styleObject.urlAddress"
            placeholder="请输入网址http://www.teacher.school.mseenet.com/"
          ></el-input>
        </div>
        <div class="addtwo" v-if="publishType==1">
          <div>请编写内容:</div>
          <quill-editor
            v-model="styleObject.content"
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
    >
      <div class="notice">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布作业/发布成功.png" alt>
        </div>
        <div class="text">
          <div>发布新闻风采成功</div>
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

    <!-- 通知 -->
    <el-dialog
      :visible.sync="dialogTableVisibleTwo"
      :fullscreen="false"
      width="580px"
      top="30vh"
      :show-close="true"
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
          <el-button round @click="skip('integralDetail',true);dialogTableVisible=false">去兑换</el-button>
          <el-button round @click="skip('rank')">查看积分</el-button>
        </el-row>
      </div>
    </el-dialog>

    <!-- 审批组织树架构 -->
    <el-dialog
      :visible.sync="dialogTableVisibleTree"
      :fullscreen="false"
      width="400"
      top="20vh"
      :center="true"
    >
      <div class="container">
        <el-scrollbar :native="false" tag="section">
          <el-input placeholder="搜索" v-model="TreefilterExamineText" style="margin-bottom:20px"></el-input>
          <el-tree
            :data="treeDateExamineAndExamine"
            :default-checked-keys="styleObject.styleIdsList"
            ref="TreeTwo"
            :filter-node-method="TreefilterNodeExamine"
            :props="defaultProps"
            :default-expand-all="true"
            @node-click="nodeClick"
            node-key="MarkId"
          ></el-tree>
        </el-scrollbar>
      </div>
    </el-dialog>

    <!-- 抄送组织树架构 -->
    <el-dialog
      :visible.sync="dialogTableVisibleTreeTwo"
      :fullscreen="false"
      width="400"
      top="20vh"
      :center="true"
    >
      <div class="container">
        <el-scrollbar :native="false" tag="section">
          <el-input placeholder="搜索" v-model="TreefilterCopyText" style="margin-bottom:20px"></el-input>
          <el-tree
            :data="treeDateExamineAndCopy"
            :default-checked-keys="styleObject.copyIdsList"
            ref="Tree"
            :filter-node-method="TreefilterNodeCopy"
            :props="defaultProps"
            show-checkbox
            @node-click="nodeClick"
            node-key="MarkId"
          ></el-tree>
        </el-scrollbar>
      </div>
      
      <span slot="footer" class="dialog-footer" v-if="treeType=='examine'?false:true">
        <el-button @click="dialogTableVisibleTreeTwo = false">取 消</el-button>
        <el-button type="primary" @click="getNodeAndCheck">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog
      :visible.sync="dialogTableVisibleLook"
      :fullscreen="false"
      width="1200px"
      top="15vh"
      height="500px"
      :close-on-click-modal="false"
    >
      <div slot="title" class="lookTitle">{{styleObject?styleObject.styleTitle:''}}</div>
      <el-scrollbar :native="false" tag="section">
        <div class="lookContent">
          <div class="title">
            <div class="title_item">
              <time>发布人：{{this.getLocalStorage('login_userInfo').realName+'老师'}}</time>
              <!-- <time>{{this.getLocalStorage('login_userInfo').realName+'老师'}}</time> -->
            </div>
            <!-- <div class="title_item">
              <time>发布类型：{{preview(styleObject.styleType)}}</time>
            </div>-->
            <div class="title_item">
              <time>发布类型：{{preview(styleObject.styleType)}}</time>
            </div>
          </div>
          <div class="noticeName" v-if="false">
            <!-- 通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、 -->
          </div>
          <div class="noticeContent" v-html="styleObject?styleObject.content:''"></div>
          <iframe
            :src="styleObject?styleObject.urlAddress:''"
            frameborder="0"
            width="100%"
            height="500px"
            v-if="styleObject?styleObject.urlAddress:''"
          ></iframe>
          <!-- <div>{{styleObject}}</div> -->
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import {
  approvalCopySettingGetApprovalCopy,
  departmentDepartmentUsersTree,
  schoolNewsSave,
  schoolNewsNewsInfo
} from "@/api/api";
import { quillRedefine } from "vue-quill-editor-upload";
import { Loading } from "element-ui";
export default {
  data() {
    return {
      TreefilterExamineText: "",
      TreefilterCopyText: "",
      textType: false,
      styleObject: {
        styleType: 1,
        styleTitle: "",
        imageUrl: "",
        content: "",
        urlAddress: "",
        styleList: [],
        styleIdsList: [],
        copyList: [],
        copyIdsList: []
      },
      treeType: "",
      //tree数据
      treeDateExamineAndExamine: [],
      treeDateExamineAndCopy: [],
      //tree配置
      defaultProps: {
        children: "childTreeList",
        label: "label"
      },
      //获取积分对象
      integralObj: null,

      publishType: 1,
      radio: false,
      radio1: false,
      radioDisabled: false,
      radioDisabledTwo: false,
      editorOption: {
        /* quill options */
      },

      dialogTableVisible: false,
      dialogTableVisibleTree: false,
      dialogTableVisibleTreeTwo: false,
      dialogTableVisibleTwo: false,
      dialogTableVisibleLook: false,
      issueShow: 1,
      options: [],
      //URL参数
      queryObj: this.$route.query,
      //得到默认审批数据进行控制
      defaultExamineList: [],
      defaultCopyList: [],

      dynamicTags: []
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
    //富文本配置上传图片功能
    this.editorOption = quillRedefine({
      // 图片上传的设置
      uploadConfig: {
        action: "/api/storage/uploadSingleFile", // 必填参数 图片上传地址
        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        // 你必须把返回的数据中所包含的图片地址 return 回去
        res: respnse => {
          console.log(respnse.data.url);
          return this.imgJoInUrl() + respnse.data.url;
        },
        methods: "POST", // 可选参数 图片上传方式  默认为post
        headers: { Authorization: TOKEN },
        // Authorization: TOKEN,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
        name: "file", // 可选参数 文件的参数名 默认为img
        size: 500, // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
        accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon", // 可选参数 可上传的图片格式
        // input点击事件  formData是提交的表单实体
        change: formData => {},
        // 设置请求头 xhr: 异步请求， formData: 表单对象
        header: (xhr, formData) => {
          xhr.setRequestHeader("Authorization", TOKEN);
          // formData.append('token', '1234')
        },
        // start: function (){}
        start: () => {}, // 可选参数 接收一个函数 开始上传数据时会触发
        end: () => {}, // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
        success: () => {}, // 可选参数 接收一个函数 上传数据成功时会触发
        error: () => {} // 可选参数 接收一个函数 上传数据中断时会触发
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
    if (this.queryObj.id) {
      schoolNewsNewsInfo({
        id: this.queryObj.id
      }).then(res => {
        console.log(res);
        if (res.data.data.content == "") {
          this.publishType = 2;
          this.styleObject.urlAddress = res.data.data.attachUrl;
        } else {
          console.log(res.data.data.content);

          this.styleObject.content = res.data.data.content;
        }

        this.styleObject.styleType = res.data.data.newsStyleType;
        this.styleObject.styleTitle = res.data.data.title;
        this.styleObject.imageUrl = res.data.data.titleImgUrl;

        if (res.data.data.approvalUsers.length != 0) {
          this.radio = true;
        }

        if (res.data.data.copyUsers.length != 0) {
          this.radio1 = true;
        }

        let styleIdsList = [];
        let copyIdsList = [];

        res.data.data.approvalUsers.forEach(item => {
          item.MarkId = item.approvalUserid;
          styleIdsList.push(item.approvalUserid);
        });

        res.data.data.copyUsers.forEach(item => {
          item.MarkId = item.id;
          copyIdsList.push(item.id);
        });

        this.radioDisabled = res.data.data.approvalUsers.some(
          (item, index, array) => {
            return item.flag == true;
          }
        );

        this.radioDisabledTwo = res.data.data.copyUsers.some(
          (item, index, array) => {
            return item.flag == true;
          }
        );
        console.log(this.radioDisabled, this.radioDisabledTwo);

        this.styleObject.styleList = res.data.data.approvalUsers;
        this.styleObject.copyList = res.data.data.copyUsers;

        this.styleObject.styleIdsList = styleIdsList;
        this.styleObject.copyIdsList = copyIdsList;
        console.log(res.data.data);
      });
    }
  },
  watch: {
    TreefilterExamineText(val) {
      this.$refs.TreeTwo.filter(val);
    },
    TreefilterCopyText(val) {
      this.$refs.Tree.filter(val);
    }
  },
  // created() {},
  methods: {
    preview(val) {
      if (val == 1) {
        return "校园风采";
      } else if (val == 2) {
        return "校园新闻";
      }
      // let a = this.subjectList.filter((item, index, array) => {
      // return item.id == val
      // })
      // return a[0] ? a[0].subjectName : null
    },
    //递归循环
    recurrenceFor(data) {
      if (data.childTreeList && data.childTreeList.length > 1) {
        data.childTreeList.forEach(item => {
          if (item.userId) {
            item.MarkId = item.userId;
          } else if (item.classId) {
            item.MarkId = item.classId;
          }
          if (this.treeType == "examine") {
            this.defaultExamineList.forEach(itemOne => {
              if (item.userId == itemOne) {
                item.disabled = true;
              }
            });
          } else if (this.treeType == "copy") {
            this.defaultCopyList.forEach(itemOne => {
              if (item.userId == itemOne) {
                item.disabled = true;
              }
            });
          }
          this.recurrenceFor(item);
        });
      }
    },

    //树结构过滤
    TreefilterNodeExamine(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //树结构过滤
    TreefilterNodeCopy(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    //选择发送对象
    addClass(type) {
      this.TreefilterExamineText = "";
      this.TreefilterCopyText = "";
      if (type == "examine") {
        this.dialogTableVisibleTree = true;
        departmentDepartmentUsersTree().then(res => {
          if (res.data.code == 200) {
            this.treeDateExamineAndExamine = res.data.data;
            this.recurrenceFor(this.treeDateExamineAndExamine[0]);
          }
        });
      } else {
        this.dialogTableVisibleTreeTwo = true;
        //组织树结构
        departmentDepartmentUsersTree().then(res => {
          if (res.data.code == 200) {
            this.treeDateExamineAndCopy = res.data.data;
            this.recurrenceFor(this.treeDateExamineAndCopy[0]);
          }
        });
      }
      this.treeType = type;
    },
    //头图上传
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.styleObject.imageUrl = res.data.url;
      } else {
        console.log("失败");
      }
    },
    //图片上传之前处理
    beforeAvatarUpload(file) {
      console.log(file.type);
      //控制上传文件格式
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isJPG && !isPNG) {
        this.$message.error("上传头图只能是 JPG 格式和PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头图大小不能超过 3MB!");
      }
      // console.log(file)
      return (isJPG || isPNG) && isLt2M;
    },
    okStyleOne() {
      this.$router.go(-2);
    },
    okStyle() {
      if (this.dialogTableVisibleTwo) {
        this.$router.push({
          name: "stylenotice"
        });
      } else {
        this.$router.go(-1);
      }
    },

    handleClose(classId, index, type, flag) {
      if (type == "examine") {
        if (!flag) {
          // this.dynamicTags.splice(index, 1)
          this.styleObject.styleList.splice(index, 1);
          this.styleObject.styleIdsList.forEach((item, index) => {
            if (item == classId) {
              this.styleObject.styleIdsList.splice(index, 1);
            }
          });
        } else {
          this.$message({
            message: "默认审批人不能删除",
            type: "warning"
          });
        }
        // this.$refs.Tree.setCheckedKeys(this.styleObject.styleIdsList, true)
      } else if (type == "copy") {
        if (!flag) {
          //   // this.dynamicTags.splice(index, 1)
          this.styleObject.copyList.splice(index, 1);

          this.styleObject.copyIdsList.forEach((item, index) => {
            if (item == classId) {
              this.styleObject.copyIdsList.splice(index, 1);
            }
          });
        } else {
          this.$message({
            message: "默认抄送人不能删除",
            type: "warning"
          });
        }
      }
    },

    //保存树结构已选数据
    getNodeAndCheck() {
      // if (this.treeType == 'examine') {
      //得到去除不必要的参数数组
      // this.styleObject.styleIdsList = this.$refs.Tree.getCheckedKeys().filter(
      //   (item, index, array) => {
      //     return !(!item || item === '')
      //   }
      // )
      // this.$refs.Tree.getCheckedNodes().forEach(item => {
      //   if (item.MarkId) {
      //     this.styleObject.styleList.push(item)
      //   }
      // })
      // let result = []
      // let obj = {}
      // this.styleObject.styleList.forEach((item, index) => {
      //   if (!obj[item.userId]) {
      //     result.push(item)
      //     obj[item.userId] = true
      //   }
      // })
      // this.styleObject.styleList = result
      // //使用es6数组去重
      // this.styleObject.styleList = Array.from(
      //   new Set(this.styleObject.styleList)
      // )
      // } else {
      //得到去除不必要的参数数组
      this.styleObject.copyIdsList = this.$refs.Tree.getCheckedKeys().filter(
        (item, index, array) => {
          return !(!item || item === "");
        }
      );
      this.$refs.Tree.getCheckedNodes().forEach(item => {
        if (item.MarkId) {
          this.styleObject.copyList.push(item);
        }
      });

      let result = [];
      let obj = {};
      this.styleObject.copyList.forEach((item, index) => {
        if (!obj[item.MarkId]) {
          result.push(item);
          obj[item.MarkId] = true;
        }
      });
      this.styleObject.copyList = result;
      // }
      this.dialogTableVisibleTreeTwo = false;

      //使用es6数组去重
      this.styleObject.copyIdsList = Array.from(
        new Set(this.styleObject.copyIdsList)
      );
    },
    //保存审批人选择数据
    nodeClick(data) {
      if (this.treeType == "examine") {
        if (data.userId) {
          console.log(data);
          if (this.styleObject.styleIdsList.length == 4) {
            this.$message({
              message: "审批人最多只能设置4个",
              type: "warning",
              center: true
            });
          } else {
            if (
              this.styleObject.styleIdsList.some((item, index, array) => {
                return item == data.userId;
              })
            ) {
              this.$message({
                message: "审批人已经存在",
                type: "warning",
                center: true
              });
            } else {
              this.styleObject.styleIdsList.unshift(data.userId);
              this.styleObject.styleList.unshift(data);
              this.dialogTableVisibleTree = false;
            }
          }
        } else {
          return;
        }
      } else {
        return;
      }
    },

    next(isshow) {
      if (isshow == 1) {
        if (this.styleObject.styleTitle == "") {
          this.$message({
            message: "请输入标题",
            type: "warning",
            center: true
          });
        } else if (this.styleObject.styleTitle.length > 40) {
          this.$message({
            message: "标题不能超过40个字符",
            type: "warning",
            center: true
          });
        } else if (this.styleObject.imageUrl == "") {
          this.$message({
            message: "头图不能为空",
            type: "warning",
            center: true
          });
        } else {
          this.issueShow = 2;
          this.defaultExamineList = [];
          this.defaultCopyList = [];
          approvalCopySettingGetApprovalCopy({
            newsStyleType: this.styleObject.styleType
          }).then(res => {
            if (res.data.code == 200) {
              if (res.data.data.isValid == 0) {
                this.issueShow = 3;
                this.textType = true;
              } else {
                res.data.data.approvalUserList.forEach(item => {
                  this.defaultExamineList.push(item.userId);
                });
                res.data.data.copyUserList.forEach(item => {
                  this.defaultCopyList.push(item.userId);
                });
                if (!this.queryObj.id) {
                  if (res.data.data.approvalUserList.length != 0) {
                    this.radio = true;
                    this.radioDisabled = true;
                    this.styleObject.styleIdsList = [];
                    this.styleObject.styleList = res.data.data.approvalUserList;
                    res.data.data.approvalUserList.forEach(item => {
                      item.MarkId = item.userId;
                      this.styleObject.styleIdsList.push(item.userId);
                    });
                  } else {
                    this.styleObject.styleList = [];
                    this.styleObject.styleIdsList = [];
                  }
                  if (res.data.data.copyUserList.length != 0) {
                    this.radio1 = true;
                    this.radioDisabledTwo = true;
                    this.styleObject.copyIdsList = [];
                    this.styleObject.copyList = res.data.data.copyUserList;
                    res.data.data.copyUserList.forEach(item => {
                      item.MarkId = item.userId;
                      this.styleObject.copyIdsList.push(item.userId);
                    });
                  } else {
                    this.styleObject.copyList = [];
                    this.styleObject.copyIdsList = [];
                  }
                }
              }
            }
          });
        }
      } else if (isshow == 2) {
        // this.issueShow = 3
        if (this.radio) {
          //审批
          if (this.styleObject.styleIdsList.length == 0) {
            this.$message({
              message: "请选择审批对象",
              type: "warning",
              center: true
            });
          } else if (this.radio1) {
            if (this.styleObject.copyIdsList.length == 0) {
              this.$message({
                message: "请选择抄送对象",
                type: "warning",
                center: true
              });
            } else {
              this.issueShow = 3;
            }
          } else {
            this.issueShow = 3;
          }
        } else if (this.radio1) {
          //抄送
          if (this.styleObject.copyIdsList.length == 0) {
            this.$message({
              message: "请选择抄送对象",
              type: "warning",
              center: true
            });
          } else {
            this.issueShow = 3;
          }
        } else {
          this.issueShow = 3;
        }
      } else if (isshow == 3) {
        if (this.publishType == 1) {
          if (this.styleObject.content == "") {
            this.$message({
              message: "请输入内容",
              type: "warning",
              center: true
            });
          } else {
            var LoadingShow = Loading.service({
              lock: true,
              text: "新闻风采发布中,请耐心等待",
              // spinner: 'el-icon-loading',
              background: "rgba(0, 0, 0, 0.7)"
            });
            // this.issueShow = 3
            schoolNewsSave({
              id: this.queryObj.id ? this.queryObj.id : null,
              title: this.styleObject.styleTitle,
              content: this.styleObject.content,
              newsStyleType: this.styleObject.styleType,
              titleImgUrl: this.styleObject.imageUrl,
              attachUrl: this.styleObject.urlAddress,
              approvalUserId: this.styleObject.styleIdsList.toString(),
              copyUserId: this.styleObject.copyIdsList.toString(),
              editStatus: 2
            }).then(res => {
              if (res.data.code == 200) {
                LoadingShow.close();
                this.dialogTableVisible = true;
                this.integralObj = res.data.data;
              } else {
                LoadingShow.close();
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  center: true
                });
              }
            });
          }
        } else {
          if (this.styleObject.urlAddress == "") {
            this.$message({
              message: "请输入网络地址",
              type: "warning",
              center: true
            });
          } else {
            var LoadingShow = Loading.service({
              lock: true,
              text: "新闻风采发布中,请耐心等待",
              // spinner: 'el-icon-loading',
              background: "rgba(0, 0, 0, 0.7)"
            });
            schoolNewsSave({
              id: this.queryObj.id ? this.queryObj.id : null,
              title: this.styleObject.styleTitle,
              content: this.styleObject.content,
              newsStyleType: this.styleObject.styleType,
              titleImgUrl: this.styleObject.imageUrl,
              attachUrl: this.styleObject.urlAddress,
              approvalUserId: this.styleObject.styleIdsList.toString(),
              copyUserId: this.styleObject.copyIdsList.toString(),
              editStatus: 2
            }).then(res => {
              if (res.data.code == 200) {
                LoadingShow.close();
                this.dialogTableVisible = true;
                this.integralObj = res.data.data;
              } else {
                console.log(res);
                LoadingShow.close();
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  center: true
                });
              }
            });
          }
        }
      }
      // this.$router.push({ name: 'issuehomeworktwo' })
    },

    //预览
    LookMe() {
      this.dialogTableVisibleLook = true;
    },

    lastStep() {
      // console.log(this.issueShow)
      if (this.issueShow == 2) {
        if (this.issueShow == 2) {
          this.$confirm(
            "为防止数据出错, 执行此操作将会清空您当前步骤已选择的对象, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.styleObject.styleIdsList = [];
              this.styleObject.styleList = [];
              this.styleObject.copyIdsList = [];
              this.styleObject.copyList = [];
              this.radioDisabled = false;
              this.radioDisabledTwo = false;
              this.radio1 = false;
              this.radio = false;
              this.issueShow = 1;
            })
            .catch(() => {
              return;
            });
        }
        // this.issueShow = 1
      } else if (this.issueShow == 3) {
        this.issueShow = 2;
      }
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

    Save() {
      if (this.publishType == 1) {
        if (this.styleObject.content == "") {
          this.$message({
            message: "请输入内容",
            type: "warning",
            center: true
          });
        } else {
          this.$msgbox({
            title: "",
            message:
              '<div style="text-align: center;padding: 20px 0 0 0;"><div><img src="/static/insetImg/插画/流程步骤/发布作业/存入草稿箱.png" alt=""></div><div><div style="font-size:16px">是否要将新闻风采存入草稿箱</div></div></div>',
            dangerouslyUseHTMLString: true,
            showCancelButton: true,
            distinguishCancelAndClose: true,
            center: true,
            confirmButtonText: "确定",
            cancelButtonText: "关闭"
          })
            .then(() => {
              var LoadingShow = Loading.service({
                lock: true,
                text: "保存草稿中,请耐心等待",
                // spinner: 'el-icon-loading',
                background: "rgba(0, 0, 0, 0.7)"
              });
              schoolNewsSave({
                id: this.queryObj.id ? this.queryObj.id : null,
                title: this.styleObject.styleTitle,
                content: this.styleObject.content,
                newsStyleType: this.styleObject.styleType,
                titleImgUrl: this.styleObject.imageUrl,
                attachUrl: this.styleObject.urlAddress,
                approvalUserId: this.styleObject.styleIdsList.toString(),
                copyUserId: this.styleObject.copyIdsList.toString(),
                editStatus: 1
              }).then(res => {
                // console.log(res)
                // console.log(this.styleObject)
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
            .catch(action => {});
        }
      } else {
        if (this.styleObject.urlAddress == "") {
          this.$message({
            message: "请输入网络地址",
            type: "warning",
            center: true
          });
        } else {
          this.$msgbox({
            title: "",
            message:
              '<div style="text-align: center;padding: 20px 0 0 0;"><div><img src="/static/insetImg/插画/流程步骤/发布作业/存入草稿箱.png" alt=""></div><div><div style="font-size:16px">是否要将作业存入草稿</div></div></div>',
            dangerouslyUseHTMLString: true,
            showCancelButton: true,
            distinguishCancelAndClose: true,
            center: true,
            confirmButtonText: "确定",
            cancelButtonText: "关闭"
          })
            .then(() => {
              // this.Save()
              var LoadingShow = Loading.service({
                lock: true,
                text: "保存草稿中,请耐心等待",
                // spinner: 'el-icon-loading',
                background: "rgba(0, 0, 0, 0.7)"
              });
              schoolNewsSave({
                id: this.queryObj.id ? this.queryObj.id : null,
                title: this.styleObject.styleTitle,
                content: this.styleObject.content,
                newsStyleType: this.styleObject.styleType,
                titleImgUrl: this.styleObject.imageUrl,
                attachUrl: this.styleObject.urlAddress,
                approvalUserId: this.styleObject.styleIdsList.toString(),
                copyUserId: this.styleObject.copyIdsList.toString(),
                editStatus: 1
              }).then(res => {
                // console.log(res)
                // console.log(this.styleObject)
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
              //   next(-1)
              // } else if (action === 'close') {
              //   return
              // }
            });
        }
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
  components: {},
  //监听返回路由
  beforeRouteLeave(to, from, next) {
    // if (this.issueShow == 3) {
    //   if (this.dialogTableVisible || this.dialogTableVisibleTwo) {
    //     next()
    //   } else {
    //     this.$msgbox({
    //       title: '',
    //       message:
    //         '<div style="text-align: center;padding: 20px 0 0 0;"><div><img src="/static/insetImg/插画/流程步骤/发布作业/存入草稿箱.png" alt=""></div><div><div style="font-size:16px">是否要将作业存入草稿</div></div></div>',
    //       dangerouslyUseHTMLString: true,
    //       showCancelButton: true,
    //       distinguishCancelAndClose: true,
    //       confirmButtonText: '保存草稿',
    //       cancelButtonText: '放弃修改'
    //     })
    //       .then(() => {
    //         this.Save()
    //       })
    //       .catch(action => {
    //         if (action === 'cancel') {
    //           // this.$router.go(-1)
    //           next(-1)
    //         } else if (action === 'close') {
    //           return
    //         }
    //       })
    //   }
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
</style>
