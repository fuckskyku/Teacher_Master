<template>
  <el-dialog
    :visible.sync="showType"
    :fullscreen="false"
    width="900px"
    top="15vh"
    @close="closeDialog"
    :close-on-click-modal="false"
  >
    <div slot="title" class="lookTitle" style="text-align:center;">意见反馈</div>
    <el-scrollbar :native="false" tag="section">
      <div class="lookContent" style="height:480px;">
        <div class="select_title">
          <div>意见类型：</div>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            ></el-option>
          </el-select>
        </div>
        <el-input
          class="textarea"
          type="textarea"
          rows="8"
          placeholder="请输入您宝贵的意见和反馈，我们将更努力做好产品。（限定500字符）"
          v-model="textarea"
          resize="none"
        ></el-input>

        <el-upload
          ref="upload"
          action="/api/storage/uploadFiles"
          list-type="picture-card"
          :show-file-list="true"
          :headers="headers"
          :auto-upload="true"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          :limit="5"
          :multiple="true"
          accept="image/*"
          name="files"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>
      </div>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer" style="text-align:center;">
      <el-button type="primary" @click="submitUpload">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { commonDictList, FeebackSave } from "@/api/api";
export default {
  inject: ["reload"],
  props: {
    isShow: Boolean
  },
  data() {
    return {
      urlList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      //控制模态框是否显示和影藏
      showType: this.isShow,
      value: "",
      textarea: "",
      options: []
    };
  },
  watch: {
    isShow(val) {
      this.showType = val;
    }
  },
  methods: {
    // select(val){
    // console.log(val);
    // console.log(this.value)
    // },
    submitUpload() {
      if (!this.value) {
        this.$message.warning("请选择意见类型");
      } else if (!this.textarea) {
        this.$message.warning("请输入意见内容");
      } else if (this.textarea.length > 500) {
        this.$message.warning("不能超过500个字符");
      } else {
        FeebackSave({
          feebackType: this.value,
          feebackText: this.textarea,
          attachUrl: this.urlList.join(",")
        }).then(res => {
          if (res.data.code == 200)
            this.$message({
              message: res.data.message,
              type: "success",
              duration: 1500,
              onClose: () => {
                this.reload();
                this.$emit("update:isShow", false);
              }
            });
        });
        // this.$refs.upload.submit();
      }
    },

    closeDialog() {
      this.reload();
      this.$emit("update:isShow", false);
    },

    handleRemove(file, fileList) {
      let index;
      this.urlList.forEach((item, index) => {
        if (item == file.response.data[0].url) this.urlList.splice(index, 1);
      });
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      if (res.code == 200) {
        // console.log(res.data[0].url)
        // console.log(this.urlList)
        this.urlList.push(res.data[0].url);
        console.log(this.urlList);
      }
    },
    handleChange(file, fileList) {
      // console.log(file, fileList);
      // this.urlList = fileList
    },
    handleExceed(file, fileList) {
      this.$message.warning(
        "最多只能5张图片(如还需要上传请先删除已选择图片)"
      );
    }
  },
  computed: {
    headers() {
      if (TOKEN) {
        return {
          Authorization: TOKEN
        };
      } else {
        this.$router.push("/");
      }
    }
  },
  created() {
    // this.reload()
    commonDictList({ dataTypeCodes: "teacher_feeback_type" }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.options = res.data.data.teacher_feeback_type;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/Scss/publicTemplate/DigLog.scss";
// .el-upload-list--picture-card{
//   display: flex;
//   justify-content: space-between;
// }
</style>
