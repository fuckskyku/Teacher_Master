 <template>
  <div id="classbaseStudent">
    <el-table :data="tableData" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="gradeName" label="年级"></el-table-column>
      <el-table-column prop="className" label="班级"></el-table-column>
      <el-table-column prop="studentCounts" label="学生人数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="look(scope.row)" class="look">学生管理</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import { gradeClassInfo } from '@/api/api'
import Vue from 'vue'
export default {
  data() {
    return {
      //表格数据
      tableData: []
    }
  },

  computed: {},

  created() {
    //表格数据
    gradeClassInfo().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
      }
    })
  },
  methods: {
    look(row) {
      this.$router.push({
        name: 'Student',
        query: {
          classId: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
