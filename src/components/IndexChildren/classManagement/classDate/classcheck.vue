 <template>
  <div id="classcheck">
    <div class="seach">
      <div class="seach_left">
        <!-- <el-date-picker 
          style="width:220px"
         v-model="valueDateOne"
         type="date"
         value-format="yyyy-MM-dd"
         clearable
         placeholder="开始日期">
       </el-date-picker>
       <el-date-picker
          style="width:220px;margin-left:20px"
          v-model="valueDateTwo"
          type="date"
          value-format="yyyy-MM-dd"
           clearable
           clearable @change="startAndEnd" 
          placeholder="结束日期">
       </el-date-picker> -->
        <el-date-picker v-model="statrAndEndVal" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" clearable @change="startAndEnd" picker-options></el-date-picker>
        <!-- <el-button round class="checkbutton">
          查找
        </el-button> -->
      </div>

      <div class="seach_right">
        <el-button round class="checkbutton" @click="leadingOut">
          EXCEL导出
        </el-button>
      </div>

    </div>
    <el-table :data="tableData.data" style="width: 150%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop='gradeClassName' label='年级班级'></el-table-column>
      <el-table-column prop="checkDate" label="日期">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ new Date(scope.row.checkDate).format('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="attendanceTimeTypeStr" label="时刻"></el-table-column>
      <el-table-column prop="classTotal" label="班级人数"></el-table-column>
      <el-table-column prop="normalTotal" label="正常"></el-table-column>
      <el-table-column prop="delayTotal" label="迟到"></el-table-column>
      <el-table-column prop="leaveTotal" label="早退"></el-table-column>
      <el-table-column prop="askTotal" label="请假"></el-table-column>
      <el-table-column prop="truancyTotal" label="旷课"></el-table-column>
      <el-table-column prop="isCheck" label="状态">
        <template slot-scope="scope">
          <span style='margin-left:10px;' :class="[scope.row.isCheck==1?'bule':'red']">
            {{ scope.row.isCheck==1?'已确认':'未确认'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="LookMe(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pageHtml :tabObj.sync='tableData' name="classPage" :otherType="statrAndEndVal"></pageHtml>

  </div>
</template>
<script>
import {
  classPage,
  classAttendanceLogClassAttendanceExportData
} from '@/api/api'

import Vue from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      tableData: [],
      statrAndEndVal: [],
      valueDateOne: '',
      valueDateTwo: ''
    }
  },
  methods: {
    //考勤数据导出
    leadingOut() {
      axios({
        url: '/classAttendanceLog/classAttendanceExportData',
        method: 'get',
        headers: { Authorization: TOKEN },
        responseType: 'blob'
      })
        .then(function(res) {
          // console.log(res);
          var blob = new Blob([res.data], { type: res.headers['content-type'] })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.href = href
          downloadElement.download = '班级考勤数据.xls' //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
        .catch(function() {})
    },
    LookMe(row) {
      this.$router.push({
        name: 'check_children',
        query: {
          date: new Date(row.checkDate).format('yyyy-MM-dd'),
          TimeType: row.attendanceTimeType,
          classId:row.classId
        }
      })
      // console.log(row)
    },

    seach() {
      alert('我回车了')
    },

    startAndEnd(val) {
      console.log(val)
      this.statrAndEndVal = val
      // console.log(val[0],val[1])
      classPage({
        startDate: val ? val[0] : null,
        endDate: val ? val[1] : null
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
          this.tableData = res.data.data
        }
      })
    },

    //筛选条件清空
    selectClear() {
      console.log(1)
    }
  },

  created() {
    //表格数据获取
    classPage().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
      } else {
      }
    })
  }
}
</script>

<style lang="scss">
</style>
