<template>
  <el-dialog
    :visible.sync="showType"
    :fullscreen="false"
    width="1200px"
    top="15vh"
    height="500px"
    @close="closeDialog"
    :close-on-click-modal="false"
  >
    <div slot="title" class="lookTitle">{{lookData?lookData.title:''}}</div>
    <el-scrollbar :native="false" tag="section">
      <div class="lookContent">
        <div class="title">
          <!-- <div>{{lookData?lookData.gradeClassName:''}}</div> -->
          <div class="title_item">
            <time>{{lookData?"发布者:"+lookData.createUserName:''}}</time>
          </div>
          <div class="title_item">
            <time>{{lookData?'类型：'+lookData.newsStyleTypeStr:''}}</time>
          </div>
          <div class="title_item">
            <time>{{lookData?'发布时间：'+ new Date(lookData.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
          </div>
          <div class="title_item">
            <time>{{lookData?'审核时间：'+ new Date(lookData.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
          </div>
        </div>
        <div class="noticeName" v-if="false">
          <!-- 通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、 -->
        </div>
        <div class="noticeContent" v-html="lookData?lookData.content:''"></div>
        <!-- {{lookData}} -->
        <!-- <a :href="lookData?lookData.attachUrl:''">点击</a> -->
        <a
          v-if="lookData?lookData.attachUrl:''"
          :href="lookData.attachUrl"
          target="_blank"
        >{{lookData.attachUrl}}</a>
        <!-- <iframe :src="lookData?lookData.attachUrl:''" frameborder="0" width="100%" height="500px" v-if="lookData?lookData.attachUrl:''"></iframe> -->
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
      showType: this.isShow,
      noticeAllShow: false
    };
  },
  watch: {
    isShow(val) {
      this.showType = val;
    },
    tabobj(val) {
      console.log(val);
    }
  },
  methods: {
    closeDialog() {
      this.$emit("update:isShow", false);
    },
    
    downloadFile() {
      axios({
        url: "/notifyDetail/exportData?infoId=" + this.lookData.id + "",
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
          downloadElement.download = "通知结果.xls"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function() {});
    }
  },

  computed: {}
};
</script>

<style lang="scss" scoped>
@import "../../../assets/Scss/publicTemplate/DigLog.scss";
</style>
