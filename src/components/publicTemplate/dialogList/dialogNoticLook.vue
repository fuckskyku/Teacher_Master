<template>
  <el-dialog :visible.sync="showType" :fullscreen="false" width="1200px" top="15vh" height='500px' @close="closeDialog" :close-on-click-modal="false">
    <div slot="title" class="lookTitle">
      {{lookData?lookData.title:''}}
    </div>

    <el-scrollbar :native="false" tag="section">
      <div class="lookContent">
        <div class="title">
          <div>发布人：{{lookData?lookData.createUserName:''}}</div>

          <div class="title_item">
            <div>类型：{{lookData?lookData.newsStyleTypeStr:''}}</div>
            <!-- <time>发布时间：{{lookData?new Date(lookData.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time> -->
          </div>

          <div v-if="lookData?lookData.signExp?true:false:false">
            <time>回签提醒截止时间：{{lookData?new Date(lookData.signExp).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
          </div>

          <div>
            <time>发布时间：{{lookData?new Date(lookData.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
          </div>
        </div>

        <div class="noticeName" v-if="false">
          <!-- 作业内容在校园里，有几棵高大的白杨树，那是我最好的朋友。 春天冰雪融化，万物复苏。不知不觉中，储备了一冬天能量的白杨树抽出了嫩芽。渐渐地，又长成了一片片翠色欲流的嫩叶，风一吹，就好像在向我们招手。春天的白杨树总能带给我们惊喜。 当夏天的第一缕阳光照进了了校园，白杨树的叶子已经长得很茂密了。我们就可以在树下乘凉了。夏天的白杨树总能带给我们清凉。 秋天也悄悄地迈向了校园。白杨树的叶子纷纷落下了。我们高兴极了，争着抢着挑选又大又绿的叶子做书签。秋天的白杨树总能带给我们欢乐。 -->
          <!-- 通知：一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、 大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、小八尺、大西沙、南平南、一二十、泥泞你、二二二、 -->
        </div>

        <div class="noticeContent" v-html="lookData?lookData.content:''"></div>
        <!-- <div>{{lookData}}</div> -->
      </div>
    </el-scrollbar>
    
    <div slot="footer" v-if="lookData?lookData.auditStatus==2?true:false:false" style='padding-top: 20px;text-align:center'>
      <el-button @click="noticeAllShow=true">查看通知结果</el-button>
      <el-button @click="downloadFile">下载通知结果</el-button>
    </div>
    <NoticeTreeAll :isShow.sync='noticeAllShow' :id="lookData?lookData.id?lookData.id:null:null" :type='lookData?lookData.newsStyleType?lookData.newsStyleType:null:null' append-to-body></NoticeTreeAll>
  </el-dialog>
</template>
<script>
import NoticeTreeAll from '../../publicTemplate/dialogList/dialogNoticeAll'
import Vue from 'vue'
import axios from 'axios'
export default {
  props: {
    isShow: Boolean,
    lookData: Object
  },
  data() {
    return {
      //控制模态框是否显示和影藏
      showType: this.isShow,
      noticeAllShow: false
    }
  },
  watch: {
    isShow(val) {
      this.showType = val
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:isShow', false)
    },

    downloadFile() {
      axios({
        url: '/notifyDetail/exportData?infoId=' + this.lookData.id + '',
        method: 'get',
        headers: { Authorization: TOKEN },
        responseType: 'blob'
      })
        .then(function(res) {
          var blob = new Blob([res.data], {
            type: res.headers['content-type']
          })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.href = href
          downloadElement.download = '通知结果.xls' //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
        .catch(function() {})
    }
  },
  computed: {},
  components: {
    NoticeTreeAll
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/Scss/publicTemplate/DigLog.scss';
</style>
