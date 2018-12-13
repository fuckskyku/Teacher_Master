 <template>
  <div id="examination">
    <div class="seach">
      <div class="seach_left">
        <el-input placeholder="搜索标题、发布者(回车进行搜索)" suffix-icon="el-icon-search" v-model="keywordsVal" clearable @change="keyWordsInput">
        </el-input>
        <!-- <div class="section">
          <div class="section_title">审批状态：</div>
          <el-select v-model="examineTypeVal" placeholder="审批状态" @change="examineEvent" clearable>
            <el-option v-for="item in examineTypeObj" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
            </el-option>
          </el-select>
        </div> -->
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
      <!-- <el-table-column prop="approvalStatus" label="审批状态">
        <template slot-scope="scope">
          <span :style="{'color':checkAuditStatusType(scope.row.approvalStatus,'Color')}">{{ checkAuditStatusType(scope.row.approvalStatus,'String')}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" class="look" @click="LookMe(scope.row)">查看</el-button> -->
          <!-- <el-button class="examine" type="text" v-if="scope.row.approvalStatus==1" @click="examineMe(scope.row,scope.$index)">审核</el-button> -->
          <el-button type="text" class="look" @click="LookMe(scope.row)">查看</el-button>
          <el-button class="examine" type="text"  @click="examineMe(scope.row,scope.$index)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog :visible.sync="dialogTableVisible" :fullscreen="false" width="580px" top="30vh" :show-close=false :before-close="handleClose">
      <div class="notice">
        <div>
          <img :src="waitObj.imgURl" alt="">
        </div>
        <div class="text">{{waitObj.number==0?'今天没有需要审批的内容':'还有'+waitObj.number+'个审批待处理'}}</div>
        <el-row>
          <el-button round @click="close">{{waitObj.buttonflagOne?'取消':'退出'}}</el-button>
          <el-button round @click="examineButton(waitObj.buttonflagTwo)">{{waitObj.buttonflagTwo?'去审批':'继续查看'}}</el-button>
        </el-row>
      </div>
    </el-dialog>
    
    <!-- <el-dialog width="900px" :visible.sync="dialogTableVisibleTwo" :show-close=false>
      <div class="container">
        <el-scrollbar :native="false" tag="section">
          <div class="title">三年二班语文作业</div>
          <ul class="tip">
            <li>邓等登老师</li>
            <li>2018-12-12 09:30</li>
          </ul>
          <article>
            作业内容在校园里，有几棵高大的白杨树，那是我最好的朋友。 春天冰雪融化，万物复苏。不知不觉中，储备了一冬天能量的白杨树抽出了嫩芽。渐渐地，又长成了一片片翠色欲流的嫩叶，风一吹，就好像在向我们招手。春天的白杨树总能带给我们惊喜。 当夏天的第一缕阳光照进了了校园，白杨树的叶子已经长得很茂密了。我们就可以在树下乘凉了。夏天的白杨树总能带给我们清凉。 秋天也悄悄地迈向了校园。白杨树的叶子纷纷落下了。我们高兴极了，争着抢着挑选又大又绿的叶子做书签。秋天的白杨树总能带给我们欢乐。 作业内容在校园里，有几棵高大的白杨树，那是我最好的朋友。 春天冰雪融化，万物复苏。不知不觉中，储备了一冬天能量的白杨树抽出了嫩芽。渐渐地，又长成了一片片翠色欲流的嫩叶，风一吹，就好像在向我们招手。春天的白杨树总能带给我们惊喜。 当夏天的第一缕阳光照进了了校园，白杨树的叶子已经长得很茂密了。我们就可以在树下乘凉了。夏天的白杨树总能带给我们清凉。 秋天也悄悄地迈向了校园。白杨树的叶子纷纷落下了。我们高兴极了，争着抢着挑选又大又绿的叶子做书签。秋天的白杨树总能带给我们欢乐。 作业内容在校园里，有几棵高大的白杨树，那是我最好的朋友。 春天冰雪融化，万物复苏。不知不觉中，储备了一冬天能量的白杨树抽出了嫩芽。渐渐地，又长成了一片片翠色欲流的嫩叶，风一吹，就好像在向我们招手。春天的白杨树总能带给我们惊喜。 当夏天的第一缕阳光照进了了校园，白杨树的叶子已经长得很茂密了。我们就可以在树下乘凉了。夏天的白杨树总能带给我们清凉。 秋天也悄悄地迈向了校园。白杨树的叶子纷纷落下了。我们高兴极了，争着抢着挑选又大又绿的叶子做书签。秋天的白杨树总能带给我们欢乐。 作业内容在校园里，有几棵高大的白杨树，那是我最好的朋友。 春天冰雪融化，万物复苏。不知不觉中，储备了一冬天能量的白杨树抽出了嫩芽。渐渐地，又长成了一片片翠色欲流的嫩叶，风一吹，就好像在向我们招手。春天的白杨树总能带给我们惊喜。 当夏天的第一缕阳光照进了了校园，白杨树的叶子已经长得很茂密了。我们就可以在树下乘凉了。夏天的白杨树总能带给我们清凉。 秋天也悄悄地迈向了校园。白杨树的叶子纷纷落下了。我们高兴极了，争着抢着挑选又大又绿的叶子做书签。秋天的白杨树总能带给我们欢乐。
            <img src="/static/Looktext.png" alt="">
          </article>
        </el-scrollbar>
      </div>
      <div class="operate">
        <el-radio v-model="radio" label="1">审核通过</el-radio>
        <el-radio v-model="radio" label="2">审批拒绝</el-radio>
      </div>
      <div class="button_group">
        <el-button round class="cancelUser" @click="dialogTableVisible=false">不想审批了</el-button>
        <el-button round class="next" @click="submitData">下一篇</el-button>
      </div>
    </el-dialog> -->
    <ExaminAtionLook :isShow.sync='dialogTableVisibleTwo' :flag='typeflag' :flagTwo='typeflagTwo' :lookData.sync='lookMeObj'></ExaminAtionLook>
    
    <pageHtml :tabObj.sync='tableData' name="approvalApprovalList" :type='examineTypeVal' :typeTwo='noticeVal' :keywords='keywordsVal'></pageHtml>
  </div>
</template>
<script>
import ExaminAtionLook from '../../../publicTemplate/dialogList/dialogExaminAtion'
import {
  approvalApprovalList,
  commonDictList,
  checkApproval,
  approvalGetOneApproval
} from '@/api/api'
export default {
  inject: ['reload'],
  data() {
    return {
      //表格数据
      tableData: [],
      //筛选条件数据
      examineTypeObj: [],
      examineTypeVal: '',
      noticeObj: [],
      noticeVal: '',

      //查看数据
      lookMeObj: null,
      typeflag: false,
      typeflagTwo: false,

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
    //检查是否有审批数据
    checkApproval().then(res => {
      if (res.data.code == 200) {
        if (!this.isShow('isShowExaminationTime')) {
          this.dialogTableVisible = true
          this.saveLocalStorage('isShowExaminationTime', Date.now())
          if (res.data.data != 0) {
            this.waitObj.imgURl =
              '/static/insetImg/插画/流程步骤/待审批_icon.png'
            this.waitObj.number = res.data.data
            this.waitObj.buttonflagOne = true
            this.waitObj.buttonflagTwo = true
          }
        } else {
          this.dialogTableVisible = false
        }
      }
    })

    //表格数据
    approvalApprovalList().then(res => {
      if (res.data.code == 200) {
        this.tableData = res.data.data
        console.log(res.data.data)
      }
    })

    //审批状态下拉选择,通知状态下拉选择
    commonDictList({ dataTypeCodes: 'audit_status,school_news_type' }).then(
      res => {
        if (res.data.code == 200) {
          console.log(res.data.data.audit_status)
          this.noticeObj = res.data.data.school_news_type
          this.examineTypeObj = res.data.data.audit_status
        }
      }
    )
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
      console.log(val)
      this.keywordsVal = val
      approvalApprovalList({
        newsStyleType: this.noticeVal ? this.noticeVal : null,
        auditStatus: this.examineTypeVal ? this.examineTypeVal : null,
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
        // console.log(1)
        this.$router.go(-1)
      }else{
        // console.log(2)
        this.dialogTableVisible = false;
      }
    },

    //审批模态框关闭前回调
    handleClose(done) {
      this.reload()
      done()
    },
    //审批筛选过滤
    examineEvent(val) {
      this.examineTypeVal = val
      approvalApprovalList({
        newsStyleType: this.noticeVal,
        auditStatus: val,
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
      approvalApprovalList({
        auditStatus: this.examineTypeVal,
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
      console.log(row)
      this.dialogTableVisibleTwo = true
      this.typeflag = false
      this.lookMeObj = row
    },
    
    examineMe(row, index) {
      this.dialogTableVisibleTwo = true
      this.typeflag = true
      this.typeflagTwo = false
      this.lookMeObj = row
    },
    examineButton(flag) {
      if (!flag) {
        this.dialogTableVisible = false
      } else {
        this.typeflagTwo = true
        this.dialogTableVisible = false
        this.dialogTableVisibleTwo = true
        approvalGetOneApproval().then(res => {
          if (res.data.code == 200) {
            console.log(res)
            this.typeflag = true
            this.lookMeObj = res.data.data
          }
        })
      }
    }
  },
  components: {
    ExaminAtionLook
  }
}
</script>

<style lang="scss"></style>
