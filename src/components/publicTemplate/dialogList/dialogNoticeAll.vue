<template>
  <el-dialog
    :visible.sync="showType"
    :fullscreen="false"
    width="40%"
    top="15vh"
    height="500px"
    @close="closeDialog"
    :close-on-click-modal="false"
    append-to-body
  >
    <div slot="title" class="lookTitle">查看通知对象</div>
    <div class="lookContent">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="教师" name="Teacher">
          <el-scrollbar :native="false" tag="section">
            <el-tabs v-model="activeNameParent">
              <el-tab-pane
                :label="'已读('+TeacherTreeObj.readSize+'/'+numberTeacherCount+')'"
                name="Read"
              >
                <el-tree
                  :data="TeacherTreeObj.read"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  :render-content="renderContentParRead"
                ></el-tree>
              </el-tab-pane>
              <el-tab-pane
                :label="'未读('+TeacherTreeObj.noReadSize+'/'+numberTeacherCount+')'"
                name="Unread"
              >
                <el-tree
                  :data="TeacherTreeObj.noRead"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  :render-content="renderContentIcon"
                ></el-tree>
              </el-tab-pane>
            </el-tabs>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane label="家长" name="Parent">
          <el-scrollbar :native="false" tag="section">
            <el-tabs v-model="activeNameTeacher">
              <el-tab-pane :label="'已读('+ParentObj.readSize+'/'+numberParentCount+')'" name="Read">
                <el-tree
                  :data="ParentObj.parRead"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  :render-content="renderContentParRead"
                ></el-tree>
              </el-tab-pane>
              <el-tab-pane
                :label="'未读('+ParentObj.noReadSize+'/'+numberParentCount+')'"
                name="Unread"
              >
                <el-tree
                  :data="ParentObj.parNoRead"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  :render-content="renderContentIcon"
                ></el-tree>
              </el-tab-pane>

              <el-tab-pane
                v-if="numberParentSignCount"
                :label="'已签('+ParentObj.singSize+'/'+numberParentSignCount+')'"
                name="Signed"
              >
                <el-tree
                  :data="ParentObj.parSing"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  :render-content="renderContentSigned"
                ></el-tree>
              </el-tab-pane>

              <el-tab-pane
                v-if="numberParentSignCount"
                :label="'未签('+ParentObj.noSingSize+'/'+numberParentSignCount+')'"
                name="NotSigned"
              >
                <el-tree
                  :data="ParentObj.parNoSing"
                  :props="defaultProps"
                  accordion
                  highlight-current
                  :render-content="renderContentIcon"
                ></el-tree>
              </el-tab-pane>
            </el-tabs>
          </el-scrollbar>
          <!-- 九分裤拉设计费克拉斯 -->
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <div slot="footer" style='padding-top: 20px;text-align:center'> -->
    <!-- <el-button>查看回签</el-button> -->
    <!-- <el-button>下载PDF</el-button> -->
    <!-- </div> -->
    <el-dialog
      :visible.sync="signatureShow"
      :fullscreen="false"
      width="30%"
      top="30vh"
      @close="closeDialogSignature"
      :close-on-click-modal="false"
      append-to-body
    >
      <div style="height:200px;display:flex;align-items: center;justify-content: center;">
        <!-- <img :src="this.imgJoInUrl()+signatureImgSrc" alt=""> -->
        <!-- <img :src="signatureImgSrc" alt="" style="max-width:100%"> -->
        <img v-if="signatureImgSrc" :src="this.imgJoInUrl()+signatureImgSrc" alt>
        <div v-if="reasonsDetailText">{{reasonsDetailText}}</div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  departmentNotifyDepartmentUsers,
  notifyDetailNotifyUser,
  notifyDetailGetSingDetail
} from "@/api/api";
import Vue from "vue";
import axios from "axios";
export default {
  props: {
    id: null,
    isShow: Boolean,
    type: Number
  },
  data() {
    return {
      newsStyleType: this.type,
      signatureShow: false,
      signatureImgSrc: "",
      reasonsDetailText: "",
      infoId: this.id,
      //控制模态框是否显示和影藏
      showType: this.isShow,
      //familyParent家长
      activeName: "Teacher",
      activeNameParent: "Read",
      //Teacher教师
      activeNameTeacher: "Read",

      numberTeacherCount: 0,
      TeacherTreeObj: {},
      ParentObj: {},

      numberParentCount: 0,
      numberParentSignCount: 0,

      defaultProps: {
        children: "childTreeList",
        label: (data, node) => {
          // console.log(data, node)
          return data.label
            ? data.label
            : data.gradeName
            ? data.gradeName
            : data.className
            ? data.className
            : data.nickName;
        }
      }
    };
  },
  watch: {
    isShow(val) {
      this.showType = val;
    },
    id(val) {
      this.infoId = val;
      this.getInfo();
    },
    type(val) {
      this.newsStyleType = val;
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    closeDialog() {
      this.$emit("update:isShow", false);
    },
    closeDialogSignature() {
      this.signatureImgSrc = "";
      this.reasonsDetailText = "";
    },
    getInfo() {
      departmentNotifyDepartmentUsers({
        infoId: this.infoId
      }).then(res => {
        if (res.data.code == 200) {
          this.TeacherTreeObj = res.data.data;
          this.numberTeacherCount =
            res.data.data.noReadSize + res.data.data.readSize;
          console.log(res);
        } else {
          console.log(res);
        }
      });

      notifyDetailNotifyUser({ infoId: this.infoId }).then(res => {
        if (res.data.code == 200) {
          this.ParentObj = res.data.data;
          this.numberParentCount =
            res.data.data.noReadSize + res.data.data.readSize;
          this.numberParentSignCount =
            res.data.data.noSingSize + res.data.data.singSize;
          console.log(res);
        } else {
          console.log(res);
        }
      });
    },

    //查看回签
    LookSignature(node, data) {
      console.log(node, data);
      notifyDetailGetSingDetail({ infoId: this.infoId, id: data.id }).then(
        res => {
          if (res.data.code == 200) {
            console.log(res.data);
            this.signatureShow = true;
            this.signatureImgSrc = res.data.data.signImg;
          } else {
            console.log(res);
          }
        }
      );
    },
    //下载PDF
    downloadPDF(node, data) {
      console.log(data);
      axios({
        url: "notifyDetail/downPDF?id=" + data.id + "",
        method: "get",
        headers: { Authorization: TOKEN },
        responseType: "blob"
      })
        .then(function(res) {
          console.log(res);
          var blob = new Blob([res.data], {
            type: res.headers["content-type"]
          });
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = data.nickName + ".pdf"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function() {});
    },
    //参加事件
    // Join(node,data){},

    //不参加事件
    NoJoin(node, data) {
      if (data.teacherId) {
        notifyDetailGetSingDetail({
          infoId: this.infoId,
          notifyUserId: data.userId
        }).then(res => {
          if (res.data.code == 200) {
            console.log(res.data);
            this.signatureShow = true;
            // this.signatureImgSrc = res.data.data.signImg
            this.reasonsDetailText = res.data.data.reasonsDetail;
          } else {
            console.log(res);
          }
        });
      } else {
        notifyDetailGetSingDetail({
          infoId: this.infoId,
          id: data.id
        }).then(res => {
          if (res.data.code == 200) {
            console.log(res.data);
            this.signatureShow = true;
            // this.signatureImgSrc = res.data.data.signImg
            this.reasonsDetailText = res.data.data.reasonsDetail;
          } else {
            console.log(res);
          }
        });
      }
    },

    renderContentSigned(h, { node, data, store }) {
      console.log(data);
      return (
        <span class="custom-tree-node">
          <span>
            {data.notifyUserId || data.teacherId ? (
              <i class="iconfont icon-yonghu" />
            ) : (
              <i class="iconfont icon-zuhe" />
            )}
            {node.label}
          </span>
          {data.nickName ? (
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.LookSignature(node, data)}
              >
                {" "}
                查看回签{" "}
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.downloadPDF(node, data)}
              >
                {" "}
                下载PDF{" "}
              </el-button>
            </span>
          ) : (
            ""
          )}
        </span>
      );
    },

    renderContentIcon(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>
            {data.notifyUserId || data.teacherId ? (
              <i class="iconfont icon-yonghu" />
            ) : (
              <i class="iconfont icon-zuhe" />
            )}
            {node.label}
          </span>
        </span>
      );
    },

    renderContentParRead(h, { node, data, store }) {
      console.log(data);
      return (
        <span class="custom-tree-node">
          <span>
            {data.notifyUserId || data.teacherId ? (
              <i class="iconfont icon-yonghu" />
            ) : (
              <i class="iconfont icon-zuhe" />
            )}
            {node.label}
          </span>
          {data.nickName || data.userId ? (
            <span>
              {data.participateStatus == 2 ? (
                <el-button size="mini" type="text">
                  {" "}
                  参加{" "}
                </el-button>
              ) : (
                ""
              )}
              {data.participateStatus == 1 ? (
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.NoJoin(node, data)}
                >
                  {" "}
                  不参加{" "}
                </el-button>
              ) : (
                ""
              )}
            </span>
          ) : (
            ""
          )}
        </span>
      );
    }
  },

  computed: {}
};
</script>
<style lang="scss">
@import "../../../../static/font_icon/icon/iconfont.css";
.lookContent {
  height: 500px;
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: 90%;
      .el-tab-pane {
        height: 100%;
        .el-scrollbar {
          height: 100%;
          .el-scrollbar__wrap {
            overflow-x: hidden;
            height: 100%;
            .custom-tree-node {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 14px;
              padding-right: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
