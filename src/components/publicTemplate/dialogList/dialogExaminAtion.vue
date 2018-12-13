<template>
  <el-dialog width="900px" :visible.sync="showType" :close-on-click-modal="false" @close="closeDialog">
    <div class="container">
      <el-scrollbar :native="false" tag="section">
        <div class="title">{{lookDataObj?lookDataObj.title:''}}</div>
        <ul class="tip">
          <li>{{lookDataObj?lookDataObj.createUserName:''}}</li>
          <!-- <li>2018-12-12 09:30</li> -->
          <li>
            <div>{{lookDataObj?lookDataObj.newsStyleTypeStr:''}}</div>
            <time> {{lookDataObj?new Date(lookDataObj.createTime).format('yyyy-MM-dd hh:mm:ss'):''}}</time>
          </li>
        </ul>
        <article v-html="lookDataObj?lookDataObj.content:''"></article>
        <a v-if="lookDataObj?lookDataObj.attachUrl:''"  :href="lookDataObj.attachUrl" target="_blank">{{lookDataObj.attachUrl}}</a>
        <!-- <iframe :src="lookDataObj?lookDataObj.attachUrl:''" frameborder="0" width="100%" height="500px" v-if="lookDataObj?lookDataObj.attachUrl:''"></iframe> -->
        <!-- <div>
            {{lookData}}
        </div> -->
      </el-scrollbar>
    </div>

    <div class="operate" v-if="flag">
      <el-radio-group v-model="radio" @change="radioChange">
        <el-radio label="3">审核拒绝</el-radio>
        <el-radio label="2">审批通过</el-radio>
      </el-radio-group>
    </div>

    <div class="button_group" v-if="flag">
      <el-button round class="cancelUser" @click="closeDialog">取消</el-button>
      <el-button round class="next" @click="submitData">{{flagTwo?'下一篇':'提交'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { approvalGetOneApproval, approvalAudit } from '@/api/api'
export default {
  inject: ['reload'],
  props: {
    isShow: Boolean,
    lookData: Object,
    flag: Boolean, //控制查看和审批
    flagTwo: Boolean //控制单条审批和多条审批
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
    },
  },
  methods: {
    closeDialog() {
      this.$emit('update:isShow', false)
      this.reload()
    },
    // Radio(val) {
    //   this.$emit('update:lookData', val)
    // },
    submitData() {
      if (this.lookDataObj) {
        if (this.radio) {
          approvalAudit({
            id: this.lookDataObj.id,
            auditStatus: this.radio
          }).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '审批成功'
              })
              this.radio = ''
              // console.log(this.flag)
              if (this.flagTwo) {
                approvalGetOneApproval().then(res => {
                  if (res.data.code == 200) {
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
              } else {
                this.$emit('update:isShow', false)
                this.reload()
              }
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请选择审批状态'
          })
        }
      } else {
        approvalGetOneApproval().then(res => {
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
