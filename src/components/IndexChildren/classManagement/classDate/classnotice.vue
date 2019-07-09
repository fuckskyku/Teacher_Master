 <template>
  <div id="classnotice">
    <!-- 搜索区域 -->
    <div class="seach">
      <div class="seach_left">
        <el-input
          placeholder="请输入标题关键字(回车搜索)"
          v-model="keywordsVal"
          suffix-icon="el-icon-search"
          clearable
          @change="keyWordsInput"
        ></el-input>
      </div>
      <div class="seach_right">
        <div class="seach_title">筛选：</div>
        <!-- <el-select v-model="examineValue" clearable placeholder="审批状态" @change='examineEvent' @clear="selectClear">
          <el-option v-for="item in examineObj" :key="item.dictCode" :label="item.dictName" :value="item.dictCode">
          </el-option>
        </el-select>-->
        <el-select v-model="noticeValue" clearable placeholder="通知类型" @change="noticeEvent">
          <el-option
            v-for="item in noticeObj"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData.data"
      style="width: 100%"
      height="600px"
      :header-cell-style="{textAlign:'center'}"
      :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
    >
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="newsStyleTypeStr" label="类型"></el-table-column>
      <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>

      <!-- <el-table-column prop="address" label="通知谁">
        <template slot-scope="scope">
          <el-popover placement="bottom" title="" width="400" trigger="hover" content="通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二">
            <el-button type="text" slot="reference">查看</el-button>
      </el-popover>-->
      <!-- <el-tooltip class="item" effect="dark" content="、" placement="bottom">
            <el-button type="text">查看</el-button>
      </el-tooltip>-->
      <!-- <span>无</span> -->
      <!-- </template>
      </el-table-column>-->
      <el-table-column prop="createUserName" label="发布者"></el-table-column>
      <el-table-column prop="createTime" label="发布时间">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.createTime"></i>
          <span
            style="margin-left: 10px"
          >{{ scope.row.createTime?new Date(scope.row.createTime).format('yyyy-MM-dd hh:mm'):"无" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="auditTime" label="审批时间">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.auditTime"></i>
          <span
            style="margin-left: 10px"
          >{{ scope.row.auditTime?new Date(scope.row.auditTime).format('yyyy-MM-dd hh:mm'):'无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="LookMe(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看弹出层区域 -->
    <lookNotice :isShow.sync="lookType" :lookData="lookMeObj"></lookNotice>

    <pageHtml
      :tabObj.sync="tableData"
      name="classNotice"
      :type="noticeValue"
      :keywords="keywordsVal"
    ></pageHtml>
  </div>
</template>
<script>
import { classNotice, commonDictList } from "@/api/api";
import lookNotice from "../../../publicTemplate/dialogList/dialogNoticLook";

export default {
  data() {
    return {
      // loging:true,
      //搜索关键字
      keywordsVal: "",
      //搜索选择区域的数据
      noticeObj: [],
      noticeValue: "",

      //表格数据以及分页数据
      tableData: [],
      // tableDataLogin:true,
      lookMeObj: null,
      lookType: false
    };
  },
  methods: {
    //表格查看事件
    LookMe(row) {
      // console.log(row)
      this.lookMeObj = row;
      // console.log(this.lookMeObj)
      this.lookType = true;
      // console.log(this.lookMeObj)
    },

    //通知类型select
    noticeEvent(value) {
      this.noticeValue = value;
      classNotice({
        newsStyleType: value,
        title:
          this.keywordsVal && this.keywordsVal != "" ? this.keywordsVal : null
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data.data)
          this.tableData = res.data.data;
        }
      });
    },

    //关键字过滤
    keyWordsInput(val) {
      this.keywordsVal = val;
      classNotice({
        title: val,
        newsStyleType: this.noticeValue ? this.noticeValue : null
      }).then(res => {
        if (res.data.code == 200) {
          // console.log(res.data.data)
          this.tableData = res.data.data;
        }
      });
    }
  },

  created() {
    //表格数据
    classNotice().then(res => {
      if (res.data.code == 200) {
        // console.log(res.data.data)
        this.tableData = res.data.data;
      }
    });

    //审批状态下拉选择,通知状态下拉选择
    commonDictList({ dataTypeCodes: "notify_type" }).then(res => {
      if (res.data.code == 200) {
        // this.examineObj = res.data.data.audit_status
        this.noticeObj = res.data.data.notify_type;
        // console.log(this.noticeObj)
      }
    });
  },
  components: {
    lookNotice
  }
};
</script>

<style lang="scss">
</style>
