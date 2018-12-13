 <template>
  <div id="PeacetimePerformance">
    <div class="seach">
      <div></div>
      <div class="seach_right">
        <el-button icon="el-icon-download" class="seach_yellow" round>
          <!-- 下载模板 -->
          <a href="/static/template/学生成绩导入模板.xls" download style="color:black">下载模板</a>
          <!-- <a href="https://baidu.com/">下载模板</a> -->
        </el-button>
        <el-button icon="el-icon-plus" class="seach_yellow" round @click="addUsuallyGarde">添加平时成绩</el-button>
      </div>
    </div>
    <el-table
      :data="tableData.data"
      style="width: 100%"
      height="600"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
    >
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="schoolName" label="所属分布（校区）"></el-table-column>
      <el-table-column prop="className" label="年级班级"></el-table-column>
      <el-table-column prop="teacherName" label="担任"></el-table-column>
      <el-table-column prop="studentCounts" label="学生人数"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            class="look"
            type="text"
            @click="skipSubject(scope.row)"
            v-if="scope.row.teacherJob==0"
          >科目平时成绩管理</el-button>
          <el-button
            class="look"
            type="text"
            @click="skip(scope.row)"
            v-if="scope.row.teacherJob==1"
          >班级平时成绩管理</el-button>
          <el-button
            class="look"
            type="text"
            style="color: #569CCC;"
            @click="dwonLOadStudentInformation(scope.row)"
          >下载学生信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="count" style="text-align:right;margin-top:10px;">学生总数：{{count}}</div>
    <pageHtml :tabObj.sync="tableData" name="teacherTeacherScoreList"></pageHtml>
  </div>
</template>
<script>
import { teacherTeacherScoreList, teacherGetStudentCount } from "@/api/api";
import Vue from "vue";
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      count: ""
    };
  },
  methods: {
    addUsuallyGarde() {
      //添加平时成绩
      this.$router.push({
        name: "AddPeacetimePerformance"
      });
    },

    skipSubject(row) {
      // console.log(row)
      this.$router.push({
        name: "SubjectGradeManagementTimes",
        query: {
          subjectId: row.subjectId,
          classId: row.id
        }
      });
    },
    skip(row) {
      console.log(row);
      this.$router.push({
        name: "MarkList",
        query: {
          classId: row.id,
          className: row.className
        }
      });
      // if(row.teacherJob==1){

      // }else{

      // }
    },
    dwonLOadStudentInformation(row) {
      axios({
        url: "/student/exportStudentScoreTemp?classId=" + row.id,
        method: "get",
        headers: { Authorization: TOKEN },
        responseType: "blob"
      })
        .then(function(res) {
          var blob = new Blob([res.data], {
            type: res.headers["content-type"]
          });
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = "学生成绩导入模板.xls"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function() {});
    }
  },
  created() {
    teacherGetStudentCount().then(res => {
      if (res.data.code == 200) {
        this.count = res.data.data;
      } else {
        console.log(res);
      }
    });
    //表格列表
    teacherTeacherScoreList().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.tableData = res.data.data;
      } else {
        console.log(res);
      }
    });
  }
};
</script>

<style lang="scss">
</style>
