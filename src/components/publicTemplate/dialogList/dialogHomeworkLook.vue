<template>
  <el-dialog :visible.sync="showType" :fullscreen="false" width="1200px" top="15vh" height='500px' @close="closeDialog" :close-on-click-modal='false'>
    <div slot="title" class="lookTitle" id="time">
      {{lookData?lookData.title:''}}
    </div>
    <el-scrollbar :native="false" tag="section">
      <div class="lookContent">
        <div class="title">
          <div>{{lookData?lookData.gradeClassName:''}}</div>
          <div class="title_item">
            <time>{{lookData?lookData.subjectName+'作业':''}}</time>
          </div>
          <div class="title_item">
            <time>{{lookData?lookData.teacherName+'老师':''}}</time>
          </div>
          <div class="title_item">
            <time>{{lookData?'作业发布时间'+ new Date(lookData.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
          </div>
          <div class="title_item">
            <time>{{lookData?lookData.finishTime?'作业提交时间'+ new Date(lookData.finishTime).format('yyyy-MM-dd hh:mm:ss'):'':null}}</time>
          </div>
        </div>
        <div class="noticeName" v-if="false">
          <!-- 通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、 -->
        </div>
        <div class="noticeContent" v-html="lookData?lookData.content:''"></div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShow: Boolean,
    lookData: Object,
    tabobj: Object
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
    },
    tabobj(val) {
      console.log(val)
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:isShow', false)
    },
  },
  computed: {},
  created() {}
}
</script>

<style lang="scss">
@import '../../../assets/Scss/publicTemplate/DigLog.scss';
</style>
