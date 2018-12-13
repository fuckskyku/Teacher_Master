<template>
  <el-dialog width="900px" :visible.sync="showType" @close="closeDialog" :close-on-click-modal="false">
    <div class="container">
      <el-scrollbar :native="false" tag="section" >
        <div class="title">{{lookDataObj?lookDataObj.title:''}}</div>
        <ul class="tip">
          <li>{{lookDataObj?lookDataObj.createUserName:''}}</li>
          <!-- <li>2018-12-12 09:30</li> -->
           <li v-if="lookData?lookDataObj.signExp:false">回签提醒截止时间 {{lookDataObj?lookDataObj.signExp?new Date(lookDataObj.signExp).format('yyyy-MM-dd hh:mm:ss'):'':''}}</li>
          <li>
            <div>{{lookDataObj?lookDataObj.newsStyleTypeStr:''}}</div>
            <time> {{lookDataObj?new Date(lookDataObj.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
          </li>
        </ul>
        <article v-html="lookDataObj?lookDataObj.content:''"></article>
        
        <a v-if="lookDataObj?lookDataObj.attachUrl:''"  :href="lookDataObj.attachUrl" target="_blank">{{lookDataObj.attachUrl}}</a>

        <!-- <iframe :src="lookDataObj?lookDataObj.attachUrl:''" frameborder="0" width="100%" height="500px" v-if="lookDataObj?lookDataObj.attachUrl:''"></iframe> -->
      </el-scrollbar>
    </div>
    <!-- {{lookData}}
    {{lookDataObj}} -->
    <div class="button_group" style="margin-top:30px">
      <el-button round class="cancelUser" @click="showType=false">关闭</el-button>
      <el-button round class="next" v-if="!flag" @click="submitData">下一篇</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { schoolNewsNoReadCopyInfo, schoolNewsChangeCopyRead } from '@/api/api'
export default {
  inject: ['reload'],
  props: {
    isShow: Boolean,
    lookData: Object,
    flag: Boolean
  },
  data() {
    return {
      //控制模态框是否显示和影藏
      showType: this.isShow,
      lookDataObj: this.lookData,
      radio: ''
    }
  },
  watch: {
    isShow(val) {
      this.showType = val
    },
    lookData(val) {
      this.lookDataObj = val
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:isShow', false)
      this.reload()
    },
    // Radio(val) {
    //   this.$emit('update:lookData', val)
    // }
    submitData() {
      if (this.lookDataObj) {
        schoolNewsChangeCopyRead({
          id: this.lookDataObj.id
        }).then(res => {
          // console.log(res)
          if (res.data.code == 200) {
            schoolNewsNoReadCopyInfo().then(res => {
              // console.log(res.data.data)
              if (res.data.code == 200) {
                // console.log(res.data.data);
                if (res.data.data) {
                  console.log(this.lookDataObj)
                  console.log(res.data.data)
                  this.lookDataObj = res.data.data
                } else {
                  this.$emit('update:isShow', false)
                  this.reload()
                }
              }
            })
          }
        })
      } else {
        schoolNewsNoReadCopyInfo().then(res => {
          console.log(res.data.data)
          if (res.data.code == 200) {
             console.log(this.lookDataObj)
             console.log(res.data.data)
            this.lookDataObj = res.data.data
          }
        })
      }
    },
    radioChange(val) {
      this.radio = val
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>

</style>
