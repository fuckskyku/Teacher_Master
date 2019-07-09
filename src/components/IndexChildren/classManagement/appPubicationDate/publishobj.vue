<template>
  <div id="publishobj">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="已发布" name="issued">
        <div class="seach">
          <div class="seach_left">
            <el-input placeholder="搜索科目、发布者(回车进行搜索)" suffix-icon="el-icon-search" v-model="keywordsVal" clearable @change="keyWordsInput($event,2)">
            </el-input>
            <div class="section">
              <div class="section_title">筛选：</div>
              <el-select v-model="gradeClassVal" placeholder="年级班级" clearable @change="gradeClassEvent($event,2)">
                <el-option v-for="item in gradeClassList" :key="item.classId" :label="item.label" :value="item.classId"></el-option>
              </el-select>
            </div>
          </div>
          <div class="seach_right">
            <el-button icon="el-icon-plus" class="seach_yellow" round @click="issuer">发布作业</el-button>
            <el-button icon="el-icon-delete" type="danger" round @click="batchDel">批量删除</el-button>
          </div>
        </div>

        <!-- 表格 -->
        <el-table :data="tableData.data" style="width: 100%" height="550" @select="checkbox" @select-all="checkboxAll" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" label="序号"></el-table-column> -->
          <el-table-column prop="subjectName" label="科目"></el-table-column>
          <el-table-column prop="gradeClassName" label="班级" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="teacherName" label="发布者"></el-table-column>
          <el-table-column prop="createTime" label="作业发布时间">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{new Date(scope.row.createTime).format('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="finishTime" label="作业提交时间">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{new Date(scope.row.finishTime).format('yyyy-MM-dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button class="look" type="text" @click="LookMe(scope.row)">查看</el-button>
              <el-button class="delete" type="text" @click="del(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pageHtml :tabObj.sync='tableData' name="homeworkList" :type='gradeClassVal' :searchsVal='keywordsVal' :otherType="2"></pageHtml>

      </el-tab-pane>

      <el-tab-pane label="草稿箱" name="rough">
        <div class="seach">
          <div class="seach_left">
            <el-input placeholder="搜索科目、发布者(回车进行搜索)" suffix-icon="el-icon-search" v-model="keywordsRoughVal" clearable @change="keyWordsInput($event,1)"></el-input>
            <div class="section">
              <div class="section_title">筛选：</div>
              <el-select v-model="gradeClassRoughVal" placeholder="选择年级班级" clearable @change="gradeClassEvent($event,1)">
                <el-option v-for="item in gradeClassList" :key="item.classId" :label="item.label" :value="item.classId"></el-option>
              </el-select>
              <!-- <el-select v-model="value" placeholder="请选择性别">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
            </div>
          </div>
          <div class="seach_right">
            <el-button icon="el-icon-plus" class="seach_yellow" round @click="issuer">发布作业</el-button>
            <el-button icon="el-icon-delete" type="danger" round @click="batchDel">批量删除</el-button>
          </div>
        </div>

        <!-- 表格 -->
        <el-table :data="roughList.data" style="width: 100%" height="550" @select="checkbox" @select-all="checkboxAll" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" label="序号"></el-table-column> -->
          <el-table-column prop="subjectName" label="科目"></el-table-column>
          <el-table-column prop="gradeClassName" label="班级"></el-table-column>
          <el-table-column prop="teacherName" label="发布者"></el-table-column>
          <el-table-column prop="createTime" label="作业发布时间">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{new Date(scope.row.createTime).format('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="finishTime" label="作业提交时间">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{new Date(scope.row.finishTime).format('yyyy-MM-dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">继续编辑</el-button>
              <el-button class="delete" type="text" @click="del(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pageHtml :tabObj.sync='roughList' name="homeworkList" :type='gradeClassRoughVal' :searchsVal='keywordsRoughVal' :otherType="1"></pageHtml>

        <!-- <el-card shadow="always" v-for="(item,index) in roughList.data" :key='index' style="margin-bottom:20px;height:120px">
          <div class="tip">
            <div class="title_children">
              <el-checkbox v-model="checked" label="1">&nbsp</el-checkbox>
              <div>
                <span>科目：</span>{{item.subjectName}}</div>
              <div>
                <span>年级班级：</span>{{item.gradeClassName}}</div>
              <div>
                <span>保存时间：</span>{{new Date(item.createTime).format('yyyy-MM-dd hh:mm:ss')}}
              </div>
            </div>
            <div class="button_group">
              <el-button type="text">继续编辑</el-button>
              <el-button type="text" class="delete">删除</el-button>
            </div>
          </div>
          <div class="title">
            {{item.title}}
          </div>
          <div class="container" v-html="item?item.content:''"></div>
        </el-card> -->

      </el-tab-pane>

    </el-tabs>

    <LookHomeWork :isShow.sync='dialogTableVisible' :lookData="LookMeObj"  @click.native="addEvenet($event)"></LookHomeWork>
    
    <!-- 通知 -->
    <el-dialog :visible.sync="dialogTableVisibleone" :fullscreen="false" width="580px" top="30vh" :show-close=false>
      <div class="notice">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布作业.png" alt="">
        </div>
        <div class="text">
          <div>
            是否马上发布作业
          </div>
          <div style="font-size:16px;margin-top:10px">
            <img src="/static/insetImg/插画/流程步骤/发布作业/integral.png" alt="" style="vertical-align:middle;">
            发布作业得积分换话费
          </div>
        </div>
        <el-row>
          <el-button round @click="dialogTableVisibleone=false">略过</el-button>
          <el-button round @click="ReleaseSoon">马上发布</el-button>
        </el-row>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import LookHomeWork from '../../../publicTemplate/dialogList/dialogHomeworkLook'
import {
  homeworkList,
  commonDictList,
  homeworkDelete,
  gradeClassAllGradeClass
} from '@/api/api'
import { OptionGroup } from 'element-ui'
export default {
  inject: ['reload'],
  data() {
    return {
      //关键字过滤
      keywordsVal: '',
      keywordsRoughVal: '',

      dialogTableVisible: false,
      dialogTableVisibleone: false,

      checked: [],
      activeName: 'issued',

      formInline: {},
      //搜索选择区域的数据

      gradeClassList: [],
      gradeClassVal: '',
      gradeClassRoughVal: '',

      //表格数据
      tableData: [],
      //批量删除数据暂存
      temporaryDelAllObj: [],
      //表格草稿数据
      roughList: [],

      //查看暂时数据
      LookMeObj: null
    }
  },
  created() {
    //作业表格数据
    homeworkList({
      editStatus: 2
    }).then(res => {
      if (res.data.code == 200) {
        this.tableData = res.data.data
        console.log(res.data.data)
      }
    })
    
    //年级班级列表
    gradeClassAllGradeClass().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.gradeClassList = res.data.data
      }
    })

    //控制是否发布作业模态框24小时出现一次
    if (!this.isShow('isShowPublishObj')) {
      this.saveLocalStorage('isShowPublishObj', Date.now())
      this.dialogTableVisibleone = true
    }
  },
  methods: {
    //关键字模糊过滤
    keyWordsInput(val, type) {
      if (type == 1) {
        this.keywordsRoughVal = val
      } else if (type == 2) {
        this.keywordsVal = val
      }
      homeworkList({
        searchWord: val,
        editStatus: type,
        classId:
          type == 2
            ? this.gradeClassVal
              ? this.gradeClassVal
              : null
            : this.gradeClassRoughVal
              ? this.gradeClassRoughVal
              : null
      }).then(res => {
        if (res.data.code == 200) {
          if (type == 1) {
            this.roughList = res.data.data
          } else {
            this.tableData = res.data.data
          }
          console.log(res.data.data)
        }
      })
    },

    //马上发布作业
    ReleaseSoon() {
      this.$router.push({ path: '/issuejobnotice' })
    },

    //条件过滤
    gradeClassEvent(val, type) {
      if (type == 1) {
        this.gradeClassRoughVal = val
      } else if (type == 2) {
        this.gradeClassVal = val
      }
      homeworkList({
        searchWord:
          type == 2
            ? this.keywordsVal
              ? this.keywordsVal
              : null
            : this.keywordsRoughVal
              ? this.keywordsRoughVal
              : null,
        editStatus: type,
        classId: val
      }).then(res => {
        if (res.data.code == 200) {
          if (type == 1) {
            this.roughList = res.data.data
          } else {
            this.tableData = res.data.data
          }
          console.log(res.data.data)
        }
      })
    },

    handleClick(tab, event) {
      if (tab.label == '草稿箱') {
        //作业草稿数据
        homeworkList({
          editStatus: 1
        }).then(res => {
          if (res.data.code == 200) {
            this.roughList = res.data.data
            console.log(res.data.data)
          }
        })
      } else {
        //作业表格数据
        homeworkList({
          editStatus: 2
        }).then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data
            console.log(res.data.data)
          }
        })
      }
      // console.log(0)
      // console.log(tab, event)
    },

    del(row, index) {
      this.$confirm('是否确定删除该条作业?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          homeworkDelete({
            ids: row.id
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.reload()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    //批量删除
    batchDel() {
      if (this.temporaryDelAllObj.length != 0) {
        this.$confirm('是否确定删除已选作业?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // console.log(this.temporaryDelAllObj)
            let delList = []
            this.temporaryDelAllObj.forEach(item => {
              delList.push(item.id)
            })
            homeworkDelete({ ids: delList.toString() }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.temporaryDelAllObj = []
                this.reload()
              } else {
                this.$message({
                  type: 'success',
                  message: res.data.message
                })
              }
              // console.log(res)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择至少一项'
        })
      }
    },

    //表格选中方法
    checkbox(selection, row) {
      console.log(selection, row)
      this.temporaryDelAllObj = selection
    },

    //表格全选方法
    checkboxAll(selection) {
      console.log(selection)
      this.temporaryDelAllObj = selection
    },

    LookMe(row) {
      this.dialogTableVisible = true
      this.LookMeObj = row
      console.log(row)
    },

    edit(row) {
      console.log(row)
      this.$router.push({
        name: 'issuejobnotice',
        query: { id: row.id, classId: row.classId }
      })
    },

    issuer() {
      this.$router.push({ name: 'issuejobnotice' })
    },

    //播放语音事件监听
    addEvenet(event) {
      if (event.target.parentNode.classList.contains('img')) {

        let audioList = document.getElementsByClassName('audio')
        for (var i = 0, len = audioList.length; len > i; i++) {
          console.log(audioList[i].children[2])
          console.log(audioList[i].children[2].paused)
          if(!audioList[i].children[2].paused){
            audioList[i].children[2].pause()
            audioList[i].children[0].children[0].src='/static/img/play.png'
            audioList[i].children[2].currentTime = 0
          }
        }

        let el = event.target
        let audio = el.parentNode.parentNode.children[2]
        let timeAndProgressContainer = el.parentNode.parentNode.children[1]
        let progressContainerWidth = timeAndProgressContainer.children[1].clientWidth
        let progress = timeAndProgressContainer.children[1].children[0]
        let starTime = timeAndProgressContainer.children[2]

        if (audio.paused) {
          let timeCount= ~~audio.duration;
          audio.play()

          el.src = '/static/img/pause.png'

          audio.ontimeupdate = function() {
            let datetime = (~~audio.currentTime - ~~(~~audio.currentTime / 60) * 60)

            if (datetime < 10) {
              datetime = '0' + datetime
            }

            starTime.innerText = ~~(datetime / 60) + ':' + datetime

            //得到时间比例
            let timeScale = ~~audio.currentTime/timeCount;
            //利用时间比例计算宽度
            let runWidth = progressContainerWidth * timeScale

            progress.style.width = ~~runWidth +'px'

            if (audio.ended) {
              el.src = '/static/img/play.png'
              starTime.innerText = '0:00'
              progress.style.width = '0px' 
            }
          }
        } else {
          audio.pause()
          el.src = '/static/img/play.png'
        } 
        //监听是否为暂停状态
      } else {
        return
      }
    }
  },
  filters: {
    // date(value) {
    //   return new Date(value).format('yyyy-M-d h:m:s')
    // }
  },
  components: {
    LookHomeWork
  }
}
</script>

<style lang="scss"></style>
