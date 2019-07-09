<template>
  <div id="issuenotice">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="已发布" name="issued">
        <div class="seach">
          <div class="seach_left">
            <el-input
              placeholder="搜索标题、发布者(回车进行搜索)"
              suffix-icon="el-icon-search"
              @change="keyWordsInput($event,2)"
              v-model="keywordsVal"
              clearable
            ></el-input>
            <div class="section">
              <div class="section_title">筛选：</div>
              <el-select
                v-model="examineTypeVal"
                placeholder="审核状态"
                @change="examineEvent($event,2)"
                clearable
              >
                <el-option
                  v-for="item in examineTypeObj"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
              <el-select
                v-model="noticeVal"
                placeholder="通知类型"
                @change="noticeEvent($event,2)"
                clearable
              >
                <el-option
                  v-for="item in noticeObj"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
            </div>
          </div>

          <div class="seach_right">
            <el-button icon="el-icon-plus" class="seach_yellow" round @click="issuer">发布通知</el-button>
            <el-button icon="el-icon-delete" type="danger" round @click="batchDel">批量删除</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <el-table
          :data="tableData.data"
          style="width: 100%"
          height="550"
          @select="checkbox"
          @select-all="checkboxAll"
          :header-cell-style="{textAlign:'center'}"
          :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" label="序号"></el-table-column> -->
          <el-table-column prop="newsStyleTypeStr" label="类型"></el-table-column>
          <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createUserName" label="发布者"></el-table-column>
          <el-table-column prop="createTime" label="发布时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span
                style="margin-left: 10px"
              >{{ new Date(scope.row.createTime).format('yyyy-MM-dd hh:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="auditTime" label="审核时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <i class="el-icon-time" v-if="scope.row.auditTime"></i>
              <span
                style="margin-left: 10px"
              >{{ scope.row.auditTime?new Date(scope.row.auditTime).format('yyyy-MM-dd hh:mm:ss'):'无' }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="auditStatus" label="审核状态">
            <template slot-scope="scope">
              <span
                :style="{'color':checkAuditStatusType(scope.row.auditStatus,'Color')}"
              >{{ checkAuditStatusType(scope.row.auditStatus,'String')}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button class="look" type="text" @click="LookMe(scope.row)">查看</el-button>
              <el-button class="delete" type="text" @click="del(scope.row,scope.$index,'issued')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageHtml
          :tabObj.sync="tableData"
          name="schoolNoticePage"
          :type="examineTypeVal"
          :typeTwo="noticeVal"
          :searchsKey="keywordsVal"
        ></pageHtml>
      </el-tab-pane>

      <el-tab-pane label="草稿箱" name="rough">
        <div class="seach">
          <div class="seach_left">
            <el-input
              placeholder="搜索标题、发布者(回车进行搜索)"
              suffix-icon="el-icon-search"
              @change="keyWordsInput($event,1)"
              v-model="keywordsRoughVal"
            ></el-input>
            <div class="section">
              <div class="section_title">筛选：</div>
              <!-- <el-select v-model="examineTypeRoughVal" placeholder="审核状态" @change="examineEvent($event,1)" clearable>
                <el-option v-for="item in examineTypeObj" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>-->
              <el-select
                v-model="noticeRoughVal"
                placeholder="通知类型"
                @change="noticeEvent($event,1)"
                clearable
              >
                <el-option
                  v-for="item in noticeObj"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="seach_right">
            <el-button icon="el-icon-plus" class="seach_yellow" round @click="issuer">发布通知</el-button>
            <el-button icon="el-icon-delete" type="danger" round @click="batchDel">批量删除</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <el-table
          :data="roughList.data"
          style="width: 100%"
          height="550"
          @select="checkbox"
          @select-all="checkboxAll"
          :header-cell-style="{textAlign:'center'}"
          :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
        >
          <el-table-column type="selection"></el-table-column>
          <!-- <el-table-column type="index" label="序号"></el-table-column> -->
          <el-table-column prop="newsStyleTypeStr" label="类型"></el-table-column>
          <el-table-column prop="title" label="标题" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createUserName" label="发布者"></el-table-column>
          <el-table-column prop="createTime" label="起稿时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span
                style="margin-left: 10px"
              >{{ new Date(scope.row.createTime).format('yyyy:MM:dd hh:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button class="delete" type="text" @click="del(scope.row,scope.$index,'rough')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageHtml
          :tabObj.sync="roughList"
          name="schoolNoticePage"
          :type="examineTypeRoughVal"
          :typeTwo="noticeRoughVal"
          :searchsKey="keywordsRoughVal"
        ></pageHtml>
      </el-tab-pane>
    </el-tabs>

    <!-- 查看作业 -->
    <!-- <el-dialog :visible.sync="dialogTableVisible" :fullscreen="false" width="1200px" top="0">
      <div slot="title" class="lookTitle">
        三年二班语文作业
      </div>
      <div class="lookContent">
        <div class="title">
          <div>邓丽老师</div>
          <div>
            <time>2018-12-12 09:30</time>
          </div>
        </div>
        <div class="noticeName">
          通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、
        </div>
        <div class="noticeContent">
          作业内容在校园里，有几棵高大的白杨树，那是我最好的朋友。 春天冰雪融化，万物复苏。不知不觉中，储备了一冬天能量的白杨树抽出了嫩芽。渐渐地，又长成了一片片翠色欲流的嫩叶，风一吹，就好像在向我们招手。春天的白杨树总能带给我们惊喜。 当夏天的第一缕阳光照进了了校园，白杨树的叶子已经长得很茂密了。我们就可以在树下乘凉了。夏天的白杨树总能带给我们清凉。 秋天也悄悄地迈向了校园。白杨树的叶子纷纷落下了。我们高兴极了，争着抢着挑选又大又绿的叶子做书签。秋天的白杨树总能带给我们欢乐。
          <img src="/static/Looktext.png" alt="">
        </div>
      </div>
    </el-dialog>-->
    <!-- 通知 -->
    <el-dialog
      :visible.sync="dialogTableVisibleone"
      :fullscreen="false"
      width="580px"
      top="30vh"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="notice">
        <div>
          <img src="/static/insetImg/插画/流程步骤/发布通知.png" alt>
        </div>
        <div class="text">
          <div>是否马上发布通知</div>
          <div style="font-size:16px;margin-top:10px">
            <img
              src="/static/insetImg/插画/流程步骤/发布作业/integral.png"
              alt
              style="vertical-align:middle;"
            >
            发布通知得积分换话费
          </div>
        </div>
        <el-row>
          <el-button round @click="dialogTableVisibleone=false">略过</el-button>
          <el-button round @click="ReleaseSoon">马上发布</el-button>
        </el-row>
      </div>
    </el-dialog>

    <lookNotice :isShow.sync="lookType" :lookData="lookMeObj"></lookNotice>
    <!-- :lookData='lookMeObj' -->
  </div>
</template>

<script>
import { schoolNoticePage, schoolNewsDelete, commonDictList } from "@/api/api";
import lookNotice from "../../../publicTemplate/dialogList/dialogNoticLook";
export default {
  inject: ["reload"],
  data() {
    return {
      //关键字
      keywordsVal: "",
      keywordsRoughVal: "",

      //筛选条件数据
      examineTypeObj: [],
      examineTypeVal: "",
      examineTypeRoughVal: "",
      noticeObj: [],
      noticeVal: "",
      noticeRoughVal: "",

      lookType: false,
      lookMeObj: {},
      dialogTableVisibleone: false,

      activeName: "issued",
      //表格数据
      tableData: [],
      //批量删除数据暂存
      temporaryDelAllObj: [],
      //草稿箱表格数据
      roughList: []
    };
  },
  created() {
    //表格数据
    schoolNoticePage({
      editStatus: 2
    }).then(res => {
      if (res.data.code == 200) {
        this.tableData = res.data.data;
        console.log(res.data.data);
      }
    });

    //数据筛选
    commonDictList({ dataTypeCodes: "audit_status,notify_type" }).then(res => {
      if (res.data.code == 200) {
        this.examineTypeObj = res.data.data.audit_status;
        this.noticeObj = res.data.data.notify_type;
      }
    });

    //控制是否发布通知模态框24小时出现一次
    if (!this.isShow("isShowIssuenotice")) {
      this.saveLocalStorage("isShowIssuenotice", Date.now());
      this.dialogTableVisibleone = true;
    }
  },

  methods: {
    //表格审批值颜色过滤//表格审批状态值过滤
    checkAuditStatusType(val, type) {
      if (type == "Color") {
        if (val == "1") {
          return "#F5A623";
        } else if (val == 2) {
          return "#67C23A";
        } else if (val == 3) {
          return "#F56C6C";
        } else if (val == 4) {
          return "#4A90E2";
        }
      } else if (type == "String") {
        if (val == "1") {
          return "未审核";
        } else if (val == 2) {
          return "审核通过";
        } else if (val == 3) {
          return "审核被拒";
        } else if (val == 4) {
          return "已撤回";
        }
      }
    },

    //关键字模糊过滤
    keyWordsInput(val, type) {
      if (type == 1) {
        this.keywordsRoughVal = val;
      } else if (type == 2) {
        this.keywordsVal = val;
      }
      schoolNoticePage({
        // newsStyleType: this.noticeVal ? this.noticeVal : null,
        newsStyleType:
          type == 2
            ? this.noticeVal
              ? this.noticeVal
              : null
            : this.noticeRoughVal
            ? this.noticeRoughVal
            : null,
        auditStatus:
          type == 2
            ? this.examineTypeVal
              ? this.examineTypeVal
              : null
            : this.examineTypeRoughVal
            ? this.examineTypeRoughVal
            : null,
        searchWord: val,
        editStatus: type
      }).then(res => {
        if (res.data.code == 200) {
          if (type == 1) {
            this.roughList = res.data.data;
          } else {
            this.tableData = res.data.data;
          }
          console.log(res.data.data);
        }
      });
    },

    //马上发布通知
    ReleaseSoon() {
      this.$router.push({ path: "/issuenoticeinfo" });
    },

    //审批筛选过滤
    examineEvent(val, type) {
      if (type == 1) {
        this.examineTypeRoughVal = val;
      } else if (type == 2) {
        this.examineTypeVal = val;
      }
      schoolNoticePage({
        newsStyleType:
          type == 2
            ? this.noticeVal
              ? this.noticeVal
              : null
            : this.noticeRoughVal
            ? this.noticeRoughVal
            : null,
        auditStatus: val,
        searchWord:
          type == 2
            ? this.keywordsVal && this.keywordsVal != ""
              ? this.keywordsVal
              : null
            : this.keywordsRoughVal && this.keywordsRoughVal != ""
            ? this.keywordsRoughVal
            : null,
        editStatus: type
      }).then(res => {
        if (res.data.code == 200) {
          if (type == 1) {
            this.roughList = res.data.data;
          } else {
            this.tableData = res.data.data;
          }
          console.log(res.data.data);
        }
      });
    },
    noticeEvent(val, type) {
      if (type == 1) {
        this.noticeRoughVal = val;
      } else if (type == 2) {
        this.noticeVal = val;
      }
      schoolNoticePage({
        auditStatus:
          type == 2
            ? this.examineTypeVal
              ? this.examineTypeVal
              : null
            : this.examineTypeRoughVal
            ? this.examineTypeRoughVal
            : null,
        searchWord:
          type == 2
            ? this.keywordsVal && this.keywordsVal != ""
              ? this.keywordsVal
              : null
            : this.keywordsRoughVal && this.keywordsRoughVal != ""
            ? this.keywordsRoughVal
            : null,
        newsStyleType: val,
        editStatus: type
      }).then(res => {
        if (res.data.code == 200) {
          if (type == 1) {
            this.roughList = res.data.data;
          } else {
            this.tableData = res.data.data;
          }
          console.log(res.data.data);
        }
      });
    },

    handleClick(tab, event) {
      this.activeName = tab.name;
      if (tab.label == "草稿箱") {
        //作业草稿数据
        schoolNoticePage({
          editStatus: 1
        }).then(res => {
          if (res.data.code == 200) {
            this.roughList = res.data.data;
            console.log(res.data.data);
          }
        });
      } else {
        //作业表格数据
        schoolNoticePage({
          editStatus: 2
        }).then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            console.log(res.data.data);
          }
        });
      }
    },

    del(row, index, type) {
      this.$confirm("是否确定删除该条通知?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          schoolNewsDelete({
            ids: row.id
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.reload();
            } else {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //批量删除
    batchDel() {
      if (this.temporaryDelAllObj.length != 0) {
        this.$confirm("是否确定删除已选通知?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // console.log(this.temporaryDelAllObj)
            let delList = [];
            this.temporaryDelAllObj.forEach(item => {
              delList.push(item.id);
            });
            schoolNewsDelete({ ids: delList.toString() }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.temporaryDelAllObj = [];
                this.reload();
              } else {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
              }
              // console.log(res)
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请先选择至少一项"
        });
      }
    },

    //表格选中方法
    checkbox(selection, row) {
      console.log(selection, row);
      this.temporaryDelAllObj = selection;
    },

    //表格全选方法
    checkboxAll(selection) {
      console.log(selection);
      this.temporaryDelAllObj = selection;
    },

    LookMe(row) {
      this.lookType = true;
      this.lookMeObj = row;
      console.log(row);
    },
    edit(row) {
      this.$router.push({ name: "issuenoticeinfo", query: { id: row.id } });
    },

    issuer() {
      this.$router.push({ name: "issuenoticeinfo" });
    }
  },
  components: {
    lookNotice
  }
};
</script>

<style lang="scss">
</style>
