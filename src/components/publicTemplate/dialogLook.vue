<template>
  <el-dialog :visible.sync="showType" :fullscreen="false" width="1200px" top="15vh" height='500px' @close="closeDialog" :close-on-click-modal="false">
    <div slot="title" class="lookTitle">
      <!-- 三年二班语文作业 -->
      {{lookData?lookData.title:''}}
    </div>
    <div class="lookContent">
      <div class="title">
        <div>{{lookData?lookData.createUserName:''}}</div>
        <div class="title_item">
          <div>{{lookData?lookData.newsStyleTypeStr:''}}</div>
          <time>{{lookData?new Date(lookData.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
        </div>
      </div>
      <div class="noticeName" v-if="false">
        <!-- 通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、 -->
      </div>
      <div class="noticeContent" v-html="lookData?lookData.content:''">
        <!-- {{lookData?lookData.content:''}} -->
        <!-- 作业内容在校园里，有几棵高大的白杨树，那是我最好的朋友。 春天冰雪融化，万物复苏。不知不觉中，储备了一冬天能量的白杨树抽出了嫩芽。渐渐地，又长成了一片片翠色欲流的嫩叶，风一吹，就好像在向我们招手。春天的白杨树总能带给我们惊喜。 当夏天的第一缕阳光照进了了校园，白杨树的叶子已经长得很茂密了。我们就可以在树下乘凉了。夏天的白杨树总能带给我们清凉。 秋天也悄悄地迈向了校园。白杨树的叶子纷纷落下了。我们高兴极了，争着抢着挑选又大又绿的叶子做书签。秋天的白杨树总能带给我们欢乐。 -->
        <!-- <img src="/static/Looktext.png" alt=""> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShow: Boolean,
    lookData: Object
  },
  data() {
    return {
      //控制模态框是否显示和影藏
      showType: this.isShow
    }
  },
  watch: {
    isShow(val) {
      this.showType = val
    }
  },
  methods: {
    closeDialog() {
      console.log(false)
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/Scss/publicTemplate/DigLog.scss'
// .el-dialog {
//   .lookTitle {
//     font-size: 40px;
//     color: black;
//   }
//   .el-dialog__body {
//     padding-top: 16px;
//     padding-bottom: 20px;
//   }
//   .lookContent {
//     .title {
//       // border: 1px solid red;
//       border-bottom: 1px solid #dcdfe6;
//       padding-bottom: 20px;
//       // margin-bottom: 20px;
//       font-size: 16px;
//       color: #909399;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       .title_item {
//         display: flex;
//         align-items: center;
//         > div {
//           margin-right: 50px;
//           // margin-bottom: 2px;
//         }
//       }
//     }
//     .noticeName {
//       padding: 13px 30px;
//       background: #f5f6fa;
//       color: #67c23a;
//       font-size: 16px;
//       line-height: 2;
//     }
//     .noticeContent {
//       padding: 16px 0;
//       font-size: 16px;
//       color: #909399;
//       img {
//         display: block;
//         max-width: 100%;
//         margin: 0 auto;
//       }
//     }
//   }
// }
</style>
