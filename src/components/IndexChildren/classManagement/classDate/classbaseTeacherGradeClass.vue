 <template>
  <div id="classhomework">
    <!-- <div class="seach">
      <div class="seach_left">
        <el-input placeholder="请输科目,发布者,标题关键字(回车进行搜索)" suffix-icon="el-icon-search" v-model="keywordsVal" clearable @change="keyWordsInput">
        </el-input>
      </div>
    </div> -->
    <el-table :data="tableData" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="gradeName" label="年级"></el-table-column>
      <el-table-column prop="className" label="班级"></el-table-column>
      <el-table-column prop="teacherCounts" label="教师人数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="LookMe(scope.row)">教师科目管理</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import { gradeClassInfo } from '@/api/api'
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    LookMe(row) {
      this.$router.push({
        name: 'Teacher',
        query: {
          classId: row.id
        }
      })
    }
  },

  created() {
    //表格数据
    gradeClassInfo().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
      }
    })
  }
}
</script>

<style lang="scss">
</style>
