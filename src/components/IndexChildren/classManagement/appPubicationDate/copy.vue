 <template>
  <div id="copy">
    <div class="seach">
      <div class="seach_left">
        <el-input placeholder="搜索标题、发布者(回车进行搜索)" suffix-icon="el-icon-search" v-model="keywordsVal" clearable @change="keyWordsInput">
        </el-input>
        <div class="section">
          <div class="section_title">阅读状态：</div>
          <el-select v-model="readStatusVal" placeholder="阅读状态" @change="readEvent" clearable>
            <el-option v-for="item in readStatusObj" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
            </el-option>
          </el-select>
        </div>
        <div class="section">
          <div class="section_title">发布类型：</div>
          <el-select v-model="noticeVal" placeholder="发布类型" @change="noticeEvent" clearable>
            <el-option v-for="item in noticeObj" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    
    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <!-- <el-table-column type="selection"></el-table-column> -->
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop='newsStyleTypeStr' label="发布类型"></el-table-column>
      <el-table-column prop="title" label="标题" :show-overflow-tooltip=true></el-table-column>
      <el-table-column prop="createUserName" label="发布者"></el-table-column>
      <el-table-column prop="createTime" label="提交时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ new Date(scope.row.createTime).format('yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="markRead" label="阅读状态">
        <template slot-scope="scope">
          <!-- <span :style="{'color':checkAuditStatusType(scope.row.approvalStatus,'Color')}">{{ checkAuditStatusType(scope.row.approvalStatus,'String')}}</span> -->
          <span>{{scope.row.markRead?'已阅读':'未阅读'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="look" @click="LookMe(scope.row)">查看</el-button>
          <!-- <el-button class="examine" type="text" v-if="scope.row.approvalStatus==1" @click="examineMe(scope.row,scope.$index)">审核</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="false" width="580px" top="30vh" :show-close=false  :close-on-click-modal='false'>
      <div class="notice">
        <div>
          <img :src="waitObj.imgURl" alt="">
        </div>
        <div class="text">{{waitObj.number==0?'今天没有需要查看的内容':'你还有'+waitObj.number+'篇抄送未读'}}</div>
        <el-row>
          <el-button round @click="close">{{waitObj.buttonflagOne?'取消':'退出'}}</el-button>
          <el-button round @click="examineButton(waitObj.buttonflagTwo)">{{waitObj.buttonflagTwo?'去阅读':'继续查看'}}</el-button>
        </el-row>
      </div>
    </el-dialog>
    
    <CopyAtionLook :isShow.sync='dialogTableVisibleTwo' :flag='typeflag' :lookData.sync='lookMeObj'></CopyAtionLook>
    <pageHtml :tabObj.sync='tableData' name="schoolNewsCopyList" :type='readStatusVal' :typeTwo='noticeVal' :keywords='keywordsVal'></pageHtml>

  </div>
</template>
<script>
import CopyAtionLook from '../../../publicTemplate/dialogList/dialogCopyAtion'
import {
  schoolNewsCopyList,
  commonDictList,
  schoolNewsNoReadCopyList,
  schoolNewsChangeCopyRead,
  schoolNewsNoReadCopyInfo
} from '@/api/api'
import { schoolNewsPage } from '../../../../api/api'
export default {
  data() {
    return {
      //表格数据
      tableData: [],
      //筛选条件数据
      readStatusObj: [],
      readStatusVal: '',
      noticeObj: [],
      noticeVal: '',

      //查看数据
      lookMeObj: null,
      typeflag: false,

      //关键字检索
      keywordsVal: '',

      dialogTableVisible: false,
      dialogTableVisibleTwo: false,

      //第一个审批过滤
      waitObj: {
        imgURl: '/static/insetImg/插画/流程步骤/审批完成_icon.png',
        number: 0,
        buttonflagOne: false,
        buttonflagTwo: false
      }
    }
  },
  
  created() {

    //表格数据
    schoolNewsCopyList().then(res => {
      if (res.data.code == 200) {
        this.tableData = res.data.data
        console.log(res.data.data)
      }
    })
    
    //审批状态下拉选择,通知状态下拉选择
    commonDictList({ dataTypeCodes: 'read_status,school_news_type' }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.noticeObj = res.data.data.school_news_type
        this.readStatusObj = res.data.data.read_status
      }
    })

    //检查是否有抄送数据
    schoolNewsNoReadCopyList({
      readStatus: 0
    }).then(res => {
      if (res.data.code == 200) {
        if (!this.isShow('isShowCopyTime')) {
          this.dialogTableVisible = true
          this.saveLocalStorage('isShowCopyTime', Date.now())
          if (res.data.data != 0) {
            this.waitObj.imgURl =
              '/static/insetImg/插画/流程步骤/待审批_icon.png'
            this.waitObj.number = res.data.data
            this.waitObj.buttonflagOne = true
            this.waitObj.buttonflagTwo = true
          }
        }
      }
    })

  },

  methods: {
    //表格审批值颜色过滤//表格审批状态值过滤
    checkAuditStatusType(val, type) {
      if (type == 'Color') {
        if (val == '1') {
          return '#F5A623'
        } else if (val == 2) {
          return '#67C23A'
        } else if (val == 3) {
          return '#F56C6C'
        } else if (val == 4) {
          return '#4A90E2'
        }
      } else if (type == 'String') {
        if (val == '1') {
          return '未审核'
        } else if (val == 2) {
          return '审核通过'
        } else if (val == 3) {
          return '审核被拒'
        } else if (val == 4) {
          return '已撤回'
        }
      }
    },

    //关键字模糊过滤
    keyWordsInput(val) {
      this.keywordsVal = val
      schoolNewsCopyList({
        newsStyleType: this.noticeVal ? this.noticeVal : null,
        readStatus: this.readStatusVal ? this.readStatusVal : null,
        searchWord: val
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },
    //退出
    close(){
      if(!this.waitObj.buttonflagOne){
        this.$router.go(-1)
      }else{
        this.dialogTableVisible=false
      }

    },

    //审批筛选过滤
    readEvent(val) {
      this.readStatusVal = val
      schoolNewsCopyList({
        newsStyleType: this.noticeVal,
        readStatus: val,
        searchWord:
          this.keywordsVal && this.keywordsVal != '' ? this.keywordsVal : null
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },
    noticeEvent(val) {
      this.noticeVal = val
      schoolNewsCopyList({
        readStatus: this.readStatusVal,
        searchWord:
          this.keywordsVal && this.keywordsVal != '' ? this.keywordsVal : null,
        newsStyleType: val
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data
          console.log(res.data.data)
        }
      })
    },
    
    //查看数据
    LookMe(row) {
      this.dialogTableVisibleTwo = true
      this.typeflag = true
      this.lookMeObj = row
      schoolNewsChangeCopyRead({ id: row.id }).then(res => {
        if (res.data.code == 200) {
          row.markRead = true
        }
      })
    },

    examineMe(row, index) {
      this.dialogTableVisibleTwo = true
      this.typeflag = true
      this.lookMeObj = row
    },

    examineButton(flag) {
      if (!flag) {
        this.dialogTableVisible = false
      } else {
        this.dialogTableVisible = false
        // this.lookMeObj = row
        this.dialogTableVisibleTwo = true

          schoolNewsNoReadCopyInfo().then(res => {
          if (res.data.code == 200) {
            console.log(res)
            this.lookMeObj = res.data.data
          }
        })
      }
    }
  },
  components: {
    CopyAtionLook
  }
}
</script>

<style lang="scss"></style>
