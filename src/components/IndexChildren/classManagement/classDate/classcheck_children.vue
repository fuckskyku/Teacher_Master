 <template>
  <div id="classcheck_children">
    <div class="seach">
      <div class="seach_left">
        <el-input placeholder="请输入学生姓名(回车搜索)" v-model="keywordsVal" clearable suffix-icon="el-icon-search" @change="keyWordsInput"></el-input>
      </div>
      <div class="seach_right">
        <div class="seach_title">筛选：</div>
        <el-select class="check_children" v-model="checkVal" placeholder="选择考勤情况" clearable @change="selectCheck">
          <el-option v-for="item in checkSelectObj" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="studentNo" label="学号"></el-table-column>
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop="attendanceTimeTypeStr" label="时刻"></el-table-column>

      <el-table-column prop="checkinTime" label="签到时间">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.checkinTime"></i>
          <span style="margin-left: 10px">
            {{ scope.row.checkinTime?new Date(scope.row.checkinTime).format('yyyy-MM-dd hh:mm:ss'):'无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkoutTime" label="签退时间">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.checkoutTime"></i>
          <span style="margin-left: 10px">
            {{ scope.row.checkoutTime?new Date(scope.row.checkoutTime).format('yyyy-MM-dd hh:mm:ss'):'无'}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="checkStatusStr" label="考勤情况">
        <template slot-scope="scope">
          <span :style="{'color':checkStatusStrType(scope.row.checkStatusStr)}">
            {{ scope.row.checkStatusStr}}</span>
        </template>
      </el-table-column>
    </el-table>

    <pageHtml :tabObj.sync='tableData' name="ClassAttendanceLogPage" :otherType='otherObj' :type='checkVal' :classId='otherObj.classId' :keywords='keywordsVal'></pageHtml>

  </div>
</template>
<script>
import { ClassAttendanceLogPage, commonDictList } from '@/api/api'

export default {
  data() {
    return {
      //关键字过滤
      keywordsVal: '',

      checkSelectObj: [],
      checkVal: '',

      tableData: [],
      otherObj: {}
    }
  },
  methods: {
    checkStatusStrType(val) {
      if (val == '旷课') {
        return '#E73E3A'
      } else if (val == '正常') {
        return '#606266'
      } else if (val == '迟到') {
        return '#F56C6C'
      } else if (val == '早退') {
        return '#E73E3A'
      } else if (val == '请假') {
        return '#0486FE'
      }
    },

    //关键字过滤
    keyWordsInput(val) {
      this.keywordsVal = val
      ClassAttendanceLogPage({
        studentName: val,
        checkStatus: this.checkVal ? this.checkVal : null,
        checkDate: this.$route.query.date,
        attendanceTimeType: this.$route.query.TimeType,
        classId:this.$route.query.classId
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          this.tableData = res.data.data
        }
      })
    },
    //筛选条件过滤
    selectCheck(val) {
      // console.log(val)
      this.checkVal = val
      ClassAttendanceLogPage({
        studentName: this.keywordsVal ? this.keywordsVal : null,
        checkStatus: val,
        checkDate: this.$route.query.date,
        attendanceTimeType: this.$route.query.TimeType,
        classId:this.$route.query.classId
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          this.tableData = res.data.data
        }
      })
    }
  },
  computed: {},
  created() {
    this.otherObj.checkDate = this.$route.query.date
    this.otherObj.attendanceTimeType = this.$route.query.TimeType
    this.otherObj.classId = this.$route.query.classId
    //表格数据
    ClassAttendanceLogPage({
      checkDate: this.$route.query.date,
      attendanceTimeType: this.$route.query.TimeType,
      classId:this.$route.query.classId
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
      }
    })

    //筛选条件
    commonDictList({ dataTypeCodes: 'check_status' }).then(res => {
      if (res.data.code == 200) {
        this.checkSelectObj = res.data.data.check_status
      }
    })
  }
}
</script>

<style lang="scss">
</style>
