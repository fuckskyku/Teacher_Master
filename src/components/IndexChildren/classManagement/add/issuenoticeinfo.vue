<template>
  <div id="noticeinfo">

    <div class="stepone" v-if="issueShow==1?true:false">
      <div><img src="/static/logoYellow.png" alt=""></div>
      <div class="stepcontainer">
        <div class="titleicon">
          <i><img src="/static/img/星形.png" alt=""></i>
          <span> 第一步</span>
        </div>
        <div class="addone">
          <div>类型:</div>
          <el-select v-model="noticeObject.noticeVal" placeholder="请选择" clearable @change="noticeChange">
            <el-option v-for="item in noticeObj" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
          </el-select>
        </div>

        <div class="addone" v-if="noticeObject.noticeVal==9">
          <div>回签提醒截止时间:</div>
          <el-date-picker style="width:100%;margin-top: 15px;margin-bottom: 35px;" value-format="yyyy-MM-dd" v-model="noticeObject.backTime" type="date" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
        </div>

        <div class="addtwo">
          <div>请选择您要通知的对象:</div>
          <div>
            <el-tag v-for="(item,index) in noticeObject.classList" :key="index" type="warning" closable :disable-transitions="false" @close="handleClose(item.classId,index,'class')">{{item.label?item.label:item.teacherName}}</el-tag>
          </div>
          <div>
            <el-tag v-for="(item,index) in noticeObject.userList" :key="index" type="warning" closable :disable-transitions="false" @close="handleClose(item.MarkId,index,'user')">{{item.label?item.label:item.teacherName}}</el-tag>
          </div>
          <el-button icon="el-icon-plus circular" circle @click="addClass('class')"></el-button>
          <!-- <el-button icon="el-icon-plus" @click="addClass('user')">添加对象</el-button> -->
        </div>
      </div>
    </div>

    <div class="steptwo" v-if="issueShow==2?true:false">
      <div><img src="/static/logoYellow.png" alt=""></div>
      <div class="stepcontainer">
        <div class="titleicon">
          <i><img src="/static/img/星形.png" alt=""></i>
          <span> 第二步</span>
        </div>
        <div class="addone">
          <div>该通知是否需要审批？</div>
          <el-row>
            <el-radio-group v-model="radio" :disabled='radioDisabled'>
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-row>
          <el-row class="" v-if="radio">
            <el-scrollbar :native="false" class="scrollbar"  :style="{height:noticeObject.noticeList.length>3?'100px':noticeObject.noticeList.length==0?'':'50px'}">
               <div v-for="(item,index) in noticeObject.noticeList" :key="index">
                <el-tag type="warning" closable :disable-transitions="false" @close="handleClose(item.MarkId,index,'examine',item.flag)">
                  {{item.label?item.label:item.teacherName?item.teacherName:item.approvalUser?item.approvalUser:''}}
                </el-tag>
                <i v-if="noticeObject.noticeList.length-1!=index"><img src="/static/img/tip.png" alt=""></i>
              </div>
              <!-- <el-tag v-for="(item,index) in noticeObject.noticeList" 
              :key="index" type="warning"
               closable 
               :disable-transitions="false" 
               @close="handleClose(item.MarkId,index,'examine',item.flag)">
               {{item.label?item.label:item.teacherName?item.teacherName:item.approvalUser?item.approvalUser:''}}
               </el-tag> -->
            </el-scrollbar>
          </el-row>
          <el-button icon="el-icon-plus" circle v-if="radio" @click="addClass('examine')"></el-button>
        </div>
        <div class="addtwo">
          <div>该通知是否需要抄送给谁？</div>
          <el-row>
            <el-radio-group v-model="radio1" :disabled='radioDisabledTwo'>
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-row>
          <el-row class="" v-if="radio1">
             <el-scrollbar :native="false" class="scrollbar"  :style="{height:noticeObject.copyList.length>3?'100px':noticeObject.copyList.length==0?'':'50px'}">
              <el-tag v-for="(item,index) in noticeObject.copyList" :key="index" type="warning" closable :disable-transitions="false" 
              @close="handleClose(item.MarkId,index,'copy',item.flag)">
              {{item.label?item.label:item.teacherName?item.teacherName:item.realName?item.realName:''}}
              </el-tag>
            </el-scrollbar>
          </el-row>
          <el-button icon="el-icon-plus" circle v-if="radio1" @click="addClass('copy')"></el-button>
        </div>
      </div>
    </div>

    <div class="stepthree" v-if="issueShow==3?true:false">
      <div class="stepcontainer">
        <div class="titleicon">
          <i><img src="/static/img/星形.png" alt=""></i>
          <span> {{textType?'第二步':'第三步'}}</span>
        </div>
        <div class="addone">
          <div>给你的通知起个名字吧:</div>
          <div class="time">
            <el-input v-model="noticeObject.noticeName" placeholder="请输入标题（40字以内）"></el-input>
          </div>
        </div>
        <div class="addone">
          <div>赶紧输入内容把:</div>
          <quill-editor v-model="noticeObject.content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)">
          </quill-editor>
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
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="false" width="580px" top="30vh" :show-close=false :close-on-click-modal='false'>
      <div class="notice" style="width:100%">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布作业/发布成功.png" alt="">
        </div>
        <div class="text">
          <div>
            发布通知成功
          </div>
          <div style="font-size:16px;margin-top:10px" v-if="integralObj?integralObj.receiveBonusPoint?true:false:false">
            <img src="/static/insetImg/插画/流程步骤/发布作业/integral.png" alt="" style="vertical-align:middle;">
            恭喜您获得{{integralObj?integralObj.receiveBonusPoint:''}}积分
          </div>
        </div>
        <el-row>
          <el-button round @click="okNoticeOne">退出</el-button>
          <el-button round @click="okNotice">进入列表</el-button>
        </el-row>
      </div>
    </el-dialog>

    <!-- 存入草稿 -->
    <el-dialog :visible.sync="dialogTableVisibleTwo" :fullscreen="false" width="580px" top="30vh" :show-close=false :close-on-click-modal='false'>
      <div class="notice">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布作业/发布成功.png" alt="">
        </div>
        <div class="text">
          <div>
            已存入草稿箱
          </div>
          <div style="font-size:16px;margin-top:10px">
            <!-- <img src="/static/insetImg/插画/流程步骤/发布作业/integral.png" alt="" style="vertical-align:middle;"> -->
            <!-- 恭喜您获得5积分 -->
          </div>
        </div>
        <el-row>
          <el-button round @click="okNoticeOne">退出</el-button>
          <el-button round @click="okNotice">进入列表</el-button>
        </el-row>
      </div>
    </el-dialog>

    <!-- 班级树结构 -->
    <el-dialog :visible.sync="dialogTableVisibleTree" :fullscreen="false" width="800px" top="20vh" :center='true'>
      <div class="container">
        <!-- <div style="text-align:center;font-size:20px">选择班级</div> -->
        <el-scrollbar :native="false" tag="section">
          <el-input placeholder="搜索" v-model="TreefilterTextParent" style='margin-bottom:20px'></el-input>
          <div style="margin-bottom: 20px;">选择家长</div>
          <el-tree :data="treeData" ref="TreeParent" :filter-node-method="TreefilterNode" :props="defaultProps" show-checkbox :default-checked-keys="noticeObject.classIdsList" node-key="id" @node-click="handleNodeClick"></el-tree>
        </el-scrollbar>
      </div>
      <div class="container">
        <el-scrollbar :native="false" tag="section">
          <el-input placeholder="搜索" v-model="TreefilterTextTeacher" style='margin-bottom:20px'></el-input>
          <div style="margin-bottom: 20px;">选择老师</div>
          <el-tree :data="treeDateExamineAndCopy" :default-checked-keys="noticeObject.userIdList" ref="TreeTeacher" :filter-node-method="TreefilterNode" :props="defaultPropsTwo" show-checkbox node-key="MarkId" @node-click="handleNodeClick"></el-tree>
        </el-scrollbar>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisibleTree = false">取 消</el-button>
        <el-button type="primary" @click="getNodeAndCheck">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 组织树架构审批 -->
    <el-dialog :visible.sync="dialogTableVisibleTreeTwoExamine" :fullscreen="false" width="400" top="20vh" :center='true'>
      <div class="container">
        <el-scrollbar :native="false" tag="section">
          <el-input placeholder="搜索" v-model="TreefilterText" style='margin-bottom:20px'></el-input>
          <el-tree :data="treeDateExamine"
           :default-checked-keys="noticeObject.noticeIdsList" 
           ref="TreeTwoExamine" :filter-node-method="TreefilterNode" :props="defaultPropsTwo"
           node-key="MarkId"
           :default-expand-all="true"
           @node-click="handleNodeClick"></el-tree>
        </el-scrollbar>
      </div>
    </el-dialog>

    <!-- 组织树架构抄送 -->
    <el-dialog :visible.sync="dialogTableVisibleTreeTwo" :fullscreen="false" width="400" top="20vh" :center='true'>
      <div class="container">
        <el-scrollbar :native="false" tag="section">
          <el-input placeholder="搜索" v-model="TreefilterTextTwo" style='margin-bottom:20px'></el-input>
          <el-tree :data="treeDateExamineAndCopy"
           :default-checked-keys="noticeObject.copyIdsList" 
           ref="TreeTwo" :filter-node-method="TreefilterNode" :props="defaultPropsTwo"
           show-checkbox
           node-key="MarkId"></el-tree>
        </el-scrollbar>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisibleTreeTwo = false">取 消</el-button>
        <el-button type="primary" @click="getNodeAndCheckTwo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 预览 -->
    <el-dialog :visible.sync="dialogTableVisibleLook" :fullscreen="false" width="1200px" top="15vh" height='500px' :close-on-click-modal="false">
      <div slot="title" class="lookTitle">
        {{noticeObject?noticeObject.noticeName:''}}
      </div>
      <el-scrollbar :native="false" tag="section">
        <div class="lookContent">
          <div class="title">
            <div class="title_item">
              <time>{{this.getLocalStorage('login_userInfo').realName+'老师'}}</time>
            </div>
            <div class="title_item">
              <time>通知类型：{{preview(noticeObject.noticeVal)}}</time>
            </div>
          </div>
          <div class="noticeName" v-if="false">
            <!-- 通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、 -->
          </div>
          <div class="noticeContent" v-html="noticeObject?noticeObject.content:''"></div>
          <!-- <div>{{noticeObject}}}</div> -->
        </div>
      </el-scrollbar>
    </el-dialog>

  </div>
</template>

<script>
import {
  commonDictList,
  gradeClassClassGradeTree,
  departmentDepartmentUsersTree,
  approvalCopySettingGetApprovalCopy,
  schoolNoticeSave,
  schoolNewsNewsInfo
} from '@/api/api'
import { quillRedefine } from 'vue-quill-editor-upload'
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      radio1: false,
      radio: false,
      radioDisabled: false,
      radioDisabledTwo: false,

      editorOption: {
        /* quill options */
      },
      noticeObject: {
        noticeVal: '',
        backTime: '',
        classList: [],
        classIdsList: [],
        userList: [],
        userIdList: [],
        noticeName: '',
        content: '',
        noticeList: [],
        noticeIdsList: [],
        copyList: [],
        copyIdsList: []
      },
      //tree数据
      treeData: [],
      treeDateExamineAndCopy: [],
      treeDateExamine:[],
      //获取积分对象
      integralObj: null,
      //节点树过滤
      TreefilterTextParent:'',
      TreefilterTextTeacher:'',
      TreefilterText: '',
      TreefilterTextTwo: '',

      treeType: '',
      textType:false,

      //tree配置
      defaultProps: {
        children: 'childTreeList',
        label: 'label'
      },

      defaultPropsTwo: {
        children: 'childTreeList',
        label: 'label'
      },

      //URL参数
      queryObj: this.$route.query,
      //得到默认审批数据进行控制
      defaultExamineList: [],
      defaultCopyList: [],

      dialogTableVisible: false,
      dialogTableVisibleTree: false,
      dialogTableVisibleTreeTwo: false,
      dialogTableVisibleTreeTwoExamine:false,
      dialogTableVisibleTwo: false,
      dialogTableVisibleLook: false,
      issueShow: 1,
      noticeObj: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },

  created() {
    //富文本配置上传图片功能
    this.editorOption = quillRedefine({
      // 图片上传的设置
      uploadConfig: {
        action: '/api/storage/uploadSingleFile', // 必填参数 图片上传地址
        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        // 你必须把返回的数据中所包含的图片地址 return 回去
        res: respnse => {
          console.log(respnse.data.url)
          return this.imgJoInUrl() + respnse.data.url
          // return respnse.data.url
        },
        methods: 'POST', // 可选参数 图片上传方式  默认为post
        headers: { Authorization: TOKEN },
        // Authorization: TOKEN,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
        name: 'file', // 可选参数 文件的参数名 默认为img
        size: 500, // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
        accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon', // 可选参数 可上传的图片格式
        // input点击事件  formData是提交的表单实体
        change: formData => {},
        // 设置请求头 xhr: 异步请求， formData: 表单对象
        header: (xhr, formData) => {
          xhr.setRequestHeader('Authorization', TOKEN)
          // formData.append('token', '1234')
        },
        // start: function (){}
        start: () => {}, // 可选参数 接收一个函数 开始上传数据时会触发
        end: () => {}, // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
        success: () => {}, // 可选参数 接收一个函数 上传数据成功时会触发
        error: () => {} // 可选参数 接收一个函数 上传数据中断时会触发
      },
      // 以下所有设置都和vue-quill-editor本身所对应
      placeholder: '请输入内容', // 可选参数 富文本框内的提示语
      theme: 'snow', // 可选参数 富文本编辑器的风格
      toolOptions: [
        ['bold', 'italic', 'underline', 'strike', 'image', 'video'],
        [{ color: [] }, { background: [] }],
        ['clean']
      ], // 可选参数  选择工具栏的需要哪些功能  默认是全部
      handlers: {} // 可选参数 重定义的事件，比如link等事件
    })

    //班级树结构
    gradeClassClassGradeTree().then(res => {
      if (res.data.code == 200) {
        this.treeData = res.data.data
      }
    })

    //组织树结构
    departmentDepartmentUsersTree().then(res => {
      if (res.data.code == 200) {
        this.treeDateExamineAndCopy = res.data.data
        this.recurrenceFor(this.treeDateExamineAndCopy[0])
        console.log(this.treeDateExamineAndCopy)
        // console.log(res.data.data)
      }
    })

    if (this.queryObj.id) {
      schoolNewsNewsInfo({
        id: this.queryObj.id
      }).then(res => {
        console.log(res.data.data)
        this.noticeObject.noticeVal = res.data.data.newsStyleType
        this.noticeObject.content = res.data.data.content
        this.noticeObject.noticeName = res.data.data.title
        this.noticeObject.backTime = this.noticeObject.backTime = new Date(
          res.data.data.signExp
        ).format('yyyy-MM-dd')

        this.noticeObject.userList = res.data.data.teacherList
        this.noticeObject.classList = res.data.data.classList
        let userIdsList = []
        let classIdsList = []

        res.data.data.teacherList.forEach(item => {
          item.MarkId = item.teacherUserId
          userIdsList.push(item.teacherUserId)
        })
        
        res.data.data.classList.forEach(item => {
          item.MarkId = item.classId
          classIdsList.push(item.classId)
        })

        if (res.data.data.approvalUsers.length != 0) {
          this.radio = true
        }
        if (res.data.data.copyUsers.length != 0) {
          this.radio1 = true
        }

        let noticeIdsList = []
        let copyIdsList = []
        res.data.data.approvalUsers.forEach(item => {
          noticeIdsList.push(item.approvalUserid)
        })

        res.data.data.copyUsers.forEach(item => {
          copyIdsList.push(item.id)
        })

        this.noticeObject.noticeIdsList = noticeIdsList
        this.noticeObject.copyIdsList = copyIdsList

        this.radioDisabled = res.data.data.approvalUsers.some(
          (item, index, array) => {
            return item.flag == true
          }
        )
        this.radioDisabledTwo = res.data.data.copyUsers.some(
          (item, index, array) => {
            return item.flag == true
          }
        )
        this.noticeObject.noticeList = res.data.data.approvalUsers
        this.noticeObject.copyList = res.data.data.copyUsers

        this.noticeObject.userIdList = userIdsList
        this.noticeObject.classIdsList = classIdsList

      })
    }
    commonDictList({ dataTypeCodes: 'notify_type' }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data.notify_type)
        this.noticeObj = res.data.data.notify_type
      }
    })

  },

  watch: {
    TreefilterText(val) {
      this.$refs.TreeTwoExamine.filter(val)
    },
    TreefilterTextTwo(val) {
      this.$refs.TreeTwo.filter(val)
    },
    TreefilterTextParent(val){
      this.$refs.TreeParent.filter(val)
    },
    TreefilterTextTeacher(val){
      this.$refs.TreeTeacher.filter(val)
    }
  },

  // created() {},

  methods: {
    preview(val) {
      let a = this.noticeObj.filter((item, index, array) => {
        return item.dictCode == val
      })
      return a[0] ? a[0].dictName : null
    },

    noticeChange(val) {
      this.noticeObject.noticeVal = val
      console.log(val)
    },

    okNoticeOne() {
      this.$router.go(-2)
    },
    //退出
    okNotice() {
      if (this.dialogTableVisibleTwo) {
        this.$router.push({
          name: 'issuenotice'
        })
      } else {
        this.$router.go(-1)
      }
    },

    //递归循环
    recurrenceFor(data) {
      if (data.childTreeList && data.childTreeList.length > 1) {
        data.childTreeList.forEach(item => {
          if (item.userId) {
            item.MarkId = item.userId
          } else if (item.classId) {
            item.MarkId = item.classId
          }
          if (this.treeType == 'examine') {
            this.defaultExamineList.forEach(itemOne => {
              if (item.userId == itemOne) {
                item.disabled = true
              }
            })
          } else if (this.treeType == 'copy') {
            this.defaultCopyList.forEach(itemOne => {
              if (item.userId == itemOne) {
                item.disabled = true
              }
            })
          }
          this.recurrenceFor(item)
        })
      }
    },

    //添加班级
    addClass(type) {
      this.treeType = type
      if (type == 'class') {
        this.dialogTableVisibleTree = true
        this.TreefilterText = ''
      } else if(type=='examine'){
        this.dialogTableVisibleTreeTwoExamine = true;
          departmentDepartmentUsersTree().then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data)
            this.treeDateExamine = res.data.data
            this.recurrenceFor(this.treeDateExamine[0])
          }
        })
      }else if(type=='copy'){
        //组织树结构
      this.dialogTableVisibleTreeTwo = true
      this.TreefilterTextTwo = ''
        departmentDepartmentUsersTree().then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data)
            this.treeDateExamineAndCopy = res.data.data
            this.recurrenceFor(this.treeDateExamineAndCopy[0])
          }
        })
      }
    },
    
    handleClose(classId, index, type, flag) {
      if (type == 'class') {
        // this.dynamicTags.splice(index, 1)
        this.noticeObject.classList.splice(index, 1)
        this.noticeObject.classIdsList.forEach((item, index) => {
          if (item == classId) {
            this.noticeObject.classIdsList.splice(index, 1)
          }
        })
        this.$refs.TreeParent.setCheckedKeys(this.noticeObject.classIdsList, true)
      } else if (type == 'user') {
        //   // this.dynamicTags.splice(index, 1)
        this.noticeObject.userList.splice(index, 1)

        this.noticeObject.userIdList.forEach((item, index) => {
          if (item == classId) {
            this.noticeObject.userIdList.splice(index, 1)
          }
        })
        this.$refs.TreeTeacher.setCheckedKeys(this.noticeObject.userIdList, true)
      } else if (type == 'examine') {
        if (!flag) {
          // this.dynamicTags.splice(index, 1)
          this.noticeObject.noticeList.splice(index, 1)
          this.noticeObject.noticeIdsList.forEach((item, index) => {
            if (item == classId) {
              this.noticeObject.noticeIdsList.splice(index, 1)
            }
          })
        } else {
          this.$message({
            message: '默认审批人不能删除',
            type: 'warning'
          })
        }
      } else if (type == 'copy') {
        if (!flag) {
          //   // this.dynamicTags.splice(index, 1)
          this.noticeObject.copyList.splice(index, 1)
          this.noticeObject.copyIdsList.forEach((item, index) => {
            if (item == classId) {
              // console.log(item,classId)
              this.noticeObject.copyIdsList.splice(index, 1)
            }
          })
          // console.log(this.noticeObject.copyIdsList)
          // console.log(this.noticeObject.copyIdsList.length,this.noticeObject.copyList.length);
          
        } else {
          this.$message({
            message: '默认抄送人不能删除',
            type: 'warning'
          })
        }
      }
    },

    next(isshow) {
      if (isshow == 1) {
        if (this.noticeObject.noticeVal == '') {
          this.$message({
            message: '请选择类型',
            type: 'warning',
            center: true
          })
        } else if (
          this.noticeObject.classList.length == 0 &&
          this.noticeObject.userList.length == 0
        ) {
          this.$message({
            message: '请选择通知对象',
            type: 'warning',
            center: true
          })
        } else {
          this.issueShow = 2;
          this.defaultExamineList =[];
          this.defaultCopyList = [];
          approvalCopySettingGetApprovalCopy({
            newsStyleType: this.noticeObject.noticeVal
          }).then(res => {
            if (res.data.code == 200) {
              // console.log(res.data.data);
             if(res.data.data.isValid==0){
                this.issueShow = 3;
                this.textType=true;
              }else{
                res.data.data.approvalUserList.forEach(item => {
                  this.defaultExamineList.push(item.userId)
                })
                res.data.data.copyUserList.forEach(item => {
                  this.defaultCopyList.push(item.userId)
                })

                // if (this.noticeObject.noticeList.length == 0) {
                  if (!this.queryObj.id) {
                    if (res.data.data.approvalUserList.length != 0) {
                      this.radioDisabled = true
                      this.radio = true
                      this.noticeObject.noticeIdsList = []
                      this.noticeObject.noticeList = res.data.data.approvalUserList
                      res.data.data.approvalUserList.forEach(item => {
                        this.noticeObject.noticeIdsList.push(item.userId)
                      })
                    }else {
                        this.noticeObject.noticeList = []
                        this.noticeObject.noticeIdsList = []
                    }
                    if (res.data.data.copyUserList.length != 0) {
                      this.radioDisabledTwo = true
                      this.radio1 = true
                      this.noticeObject.copyIdsList = []
                      this.noticeObject.copyList = res.data.data.copyUserList
                      res.data.data.copyUserList.forEach(item => {
                        this.noticeObject.copyIdsList.push(item.userId)
                      })
                    }else{
                        this.noticeObject.copyList = []
                        this.noticeObject.copyIdsList = []
                    }
                  // }
                }
              }
              // this.treeData = res.data.data
            }
          })
        }
      } else if (isshow == 2) {
        // console.log(this.radio1);
        // console.log(this.radio);
        if(this.radio){
          //审批
          if(this.noticeObject.noticeIdsList.length==0){
                this.$message({
                  message: '请选择审批对象',
                  type: 'warning',
                  center: true
                })
          }else if(this.radio1){
               if(this.noticeObject.copyIdsList.length==0){
                  this.$message({
                      message: '请选择抄送对象',
                      type: 'warning',
                      center: true
                  })
                }else{
                    this.issueShow = 3        
                }
          }else{
                    this.issueShow = 3        
          }

        }else if(this.radio1){
          //抄送
          if(this.noticeObject.copyIdsList.length==0){
                  this.$message({
                      message: '请选择抄送对象',
                      type: 'warning',
                      center: true
                  })
          }else{
                this.issueShow = 3        
          }
        }else{
          this.issueShow = 3
        }

      } else if (isshow == 3) {
        if (this.noticeObject.noticeName == '') {
          this.$message({
            message: '请输入通知名字',
            type: 'warning',
            center: true
          })
        } else if (this.noticeObject.noticeName.length > 40) {
          this.$message({
            message: '名字不能超过40个字哦',
            type: 'warning',
            center: true
          })
        } else if (this.noticeObject.content == '') {
          this.$message({
            message: '请输入内容',
            type: 'warning',
            center: true
          })
        } else {
          var LoadingShow = Loading.service({
            lock: true,
            text: '通知发布中,请耐心等待',
            // spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          schoolNoticeSave({
            id: this.queryObj.id ? this.queryObj.id : null,
            title: this.noticeObject.noticeName,
            content: this.noticeObject.content,
            newsStyleType: this.noticeObject.noticeVal,
            classIds: this.noticeObject.classIdsList,
            userIds: this.noticeObject.userIdList,
            signExp: this.noticeObject.backTime,
            approvalUserId: this.noticeObject.noticeIdsList.toString(),
            copyUserId: this.noticeObject.copyIdsList.toString(),
            editStatus: 2
          }).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              LoadingShow.close()
              this.dialogTableVisible = true
              this.integralObj = res.data.data
            } else {
              LoadingShow.close()
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              })
            }
          })
        }
      }
      // this.$router.push({ name: 'issuehomeworktwo' })
    },

    lastStep() {
      // console.log(this.issueShow)
      if (this.issueShow == 2) {
       this.$confirm('为防止数据出错, 执行此操作将会清空您当前步骤已选择的对象, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.noticeObject.noticeIdsList =[]
          this.noticeObject.noticeList = []
          this.noticeObject.copyIdsList = []
          this.noticeObject.copyList = []
          this.radioDisabled = false;
          this.radioDisabledTwo = false;
          this.radio1=false
          this.radio=false
          this.issueShow = 1  
        }).catch(() => {
          return 
        });
      } else if (this.issueShow == 3) {
        this.issueShow = 2
      }
    },
    
    //预览
    LookMe() {
      console.log(this.noticeObject)
      if (!this.noticeObject.content == '') {
        this.dialogTableVisibleLook = true
      } else {
        this.$message({
          message: '请填写通知内容',
          type: 'warning',
          center: true
        })
      }
    },

    //树结构方法
    handleNodeClick(data) {
       if (this.treeType == 'examine') {
        if (data.userId) {
          console.log(data)
          if (this.noticeObject.noticeIdsList.length == 4) {
            this.$message({
              message: '审批人最多只能设置4个',
              type: 'warning',
              center: true
            })
          } else {
            if (
              this.noticeObject.noticeIdsList.some((item, index, array) => {
                return item == data.userId
              })
            ) {
              this.$message({
                message: '审批人已经存在',
                type: 'warning',
                center: true
              })
            } else {
              this.noticeObject.noticeIdsList.unshift(data.userId)
              this.noticeObject.noticeList.unshift(data)
              this.dialogTableVisibleTreeTwoExamine= false
            }
          }
        } else {
          return
        }
      } else {
        return
      }
    },

    //树结构过滤
    TreefilterNode(value, data) {
      if (!value) return true
      console.log(data)
      return data.label.indexOf(value) !== -1
    },

    //保存树结构已选数据
    getNodeAndCheck() {
      //得到去除不必要的参数数组
      this.noticeObject.classIdsList = this.$refs.TreeParent.getCheckedKeys().filter(
        (item, index, array) => {
          return !(!item || item === '')
        }
      )

        //使用es6数组去重
        this.noticeObject.classIdsList = Array.from(
          new Set(this.noticeObject.classIdsList)
        )

      this.$refs.TreeParent.getCheckedNodes().forEach(item => {
        if (item.classId) {
          this.noticeObject.classList.push(item)
        }
      })

      let result = []
      let obj = {}
      this.noticeObject.classList.forEach((item, index) => {
        if (!obj[item.id]) {
          result.push(item)
          obj[item.id] = true
        }
      })
      this.noticeObject.classList = result

      //得到去除不必要的参数数组
      this.noticeObject.userIdList = this.$refs.TreeTeacher.getCheckedKeys().filter(
        (item, index, array) => {
          return !(!item || item === '')
        }
      )

       //使用es6数组去重
        this.noticeObject.userIdList = Array.from(
          new Set(this.noticeObject.userIdList)
        )

      this.$refs.TreeTeacher.getCheckedNodes().forEach(item => {
        if (item.MarkId) {
          this.noticeObject.userList.push(item)
        }
      })

      let result1 = []
      let obj1 = {}
      this.noticeObject.userList.forEach((item, index) => {
        if (!obj1[item.MarkId]) {
          result1.push(item)
          obj1[item.MarkId] = true
        }
      })
      console.log(result1)

      this.noticeObject.userList = result1

      this.dialogTableVisibleTree = false



    },

    //保存树结构已选数据审批人抄送人
    getNodeAndCheckTwo() {
      // if (this.treeType == 'examine') {
      //   //得到去除不必要的参数数组
      //   this.noticeObject.noticeIdsList = this.$refs.TreeTwo.getCheckedKeys().filter(
      //     (item, index, array) => {
      //       return !(!item || item === '')
      //     }
      //   )

      //   this.$refs.TreeTwo.getCheckedNodes().forEach(item => {
      //     if (item.MarkId) {
      //       this.noticeObject.noticeList.push(item)
      //     }
      //   })

      //   let result = []
      //   let obj = {}
      //   this.noticeObject.noticeList.forEach((item, index) => {
      //     if (!obj[item.userId]) {
      //       result.push(item)
      //       obj[item.userId] = true
      //     }
      //   })
      //   this.noticeObject.noticeList = result
      //   // //使用es6数组去重
      //   // this.noticeObject.noticeList = Array.from(
      //   //   new Set(this.noticeObject.noticeList)
      //   // )
      // } else {
        //得到去除不必要的参数数组
        this.noticeObject.copyIdsList = this.$refs.TreeTwo.getCheckedKeys().filter(
          (item, index, array) => {
            return !(!item || item === '')
          }
        )

        this.$refs.TreeTwo.getCheckedNodes().forEach(item => {
          if (item.MarkId) {
            this.noticeObject.copyList.push(item)
          }
        })

        let result = []
        let obj = {}
        this.noticeObject.copyList.forEach((item, index) => {
          if (!obj[item.userId]) {
            result.push(item)
            obj[item.userId] = true
          }
        })
        this.noticeObject.copyList = result

        //使用es6数组去重
        this.noticeObject.copyIdsList = Array.from(
          new Set(this.noticeObject.copyIdsList)
        )
      // }

      this.dialogTableVisibleTreeTwo = false
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
      if (this.noticeObject.noticeName == '') {
        this.$message({
          message: '请输入通知名字',
          type: 'warning',
          center: true
        })
      } else if (this.noticeObject.noticeName.length > 40) {
        this.$message({
          message: '名字不能超过40个字哦',
          type: 'warning',
          center: true
        })
      } else if (this.noticeObject.content == '') {
        this.$message({
          message: '请输入内容',
          type: 'warning',
          center: true
        })
      } else {
        this.$msgbox({
          title: '',
          message:
            '<div style="text-align: center;padding: 20px 0 0 0;"><div><img src="/static/insetImg/插画/流程步骤/发布作业/存入草稿箱.png" alt=""></div><div><div style="font-size:16px">是否要将通知存入草稿箱</div></div></div>',
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          center: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '关闭'
        })
          .then(() => {
            var LoadingShow = Loading.service({
              lock: true,
              text: '草稿保存中,请耐心等待',
              // spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            schoolNoticeSave({
              title: this.noticeObject.noticeName,
              content: this.noticeObject.content,
              newsStyleType: this.noticeObject.noticeVal,
              classIds: this.noticeObject.classIdsList,
              userIds: this.noticeObject.userIdList,
              signExp: this.noticeObject.backTime,
              approvalUserId: this.noticeObject.noticeIdsList.toString(),
              copyUserId: this.noticeObject.copyIdsList.toString(),
              editStatus: 1
            }).then(res => {
              console.log(res)
              if (res.data.code == 200) {
                LoadingShow.close()
                this.dialogTableVisibleTwo = true
              } else {
                LoadingShow.close()
                this.$message({
                  message: res.data.message,
                  type: 'warning',
                  center: true
                })
              }
            })
          })
          .catch(action => {
            // if (action === 'cancel') {
            //   // this.$router.go(-1)
            //   next(-1)
            // } else if (action === 'close') {
            //   return
            // }
          })
      }
    },
    DraftBox() {
      this.Save()
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
    if (this.dialogTableVisibleTwo||this.dialogTableVisible) {
      next()
    } else {
      this.$confirm('返回后已填写内容将清空，确定退出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.$router.go(-1)
          next(-1)
        })
        .catch(() => {
          next(false)
        })
      
    }

    // }
  }
}
</script>

<style lang="scss">
@import '../../../../assets/Scss/publicTemplate/issue.scss';
</style>
