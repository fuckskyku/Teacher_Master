 <template>
  <div id="classhomework">
    <div class="seach">
      <div class="seach_left">
        <el-input placeholder="请输科目,发布者,标题关键字(回车进行搜索)" suffix-icon="el-icon-search" v-model="keywordsVal" clearable @change="keyWordsInput">
        </el-input>
      </div>
      <div class="seach_right">
        <div class="seach_title">筛选：</div>
        <el-select v-model="gradeClassVal" clearable placeholder="年级班级" @change="gradeClassChange">
          <el-option v-for="item in gradeClassList" :key="item.id" :label="item.gradeName+item.className" :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="tableData.data" style="width: 100%" height="600" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}">
      <!-- <el-table-column type="index" label="序号"></el-table-column> -->
      <el-table-column prop="gradeClassName" label="班级"></el-table-column>
      <el-table-column prop="subjectName" label="科目"></el-table-column>
      <el-table-column prop="teacherName" label="发布者"></el-table-column>
      <el-table-column prop="createTime" label="作业发布时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ new Date(scope.row.createTime).format('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="look" type="text" @click="LookMe(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <homeworkLook :isShow.sync="lookType" :lookData='lookMeObj' @click.native="addEvenet($event)"></homeworkLook>

    <pageHtml :tabObj.sync='tableData' name="classHomework" :searchsKey="keywordsVal" :classId='gradeClassVal'></pageHtml>

  </div>
</template>
<script>
import { classHomework,gradeClassInfo } from '@/api/api'
import homeworkLook from '../../../publicTemplate/dialogList/dialogHomeworkLook'
export default {
  data() {
    return {
      lookType: false,
      lookMeObj: null,
      gradeClassList:[],
      gradeClassVal:'',
      tableData: [],
      //关键字过滤条件
      keywordsVal: ''
    }
  },
  methods: {
    LookMe(row) {
      this.lookMeObj = row
      this.lookType = true
      // console.log(row)
      console.log(this.lookMeObj)
    },

    //年级筛选
    gradeClassChange(val){
      this.gradeClassVal = val;
      classHomework({
        searchWord: this.keywordsVal?this.keywordsVal:null,
        classId:val
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
          this.tableData = res.data.data
        }
      })
    },
    keyWordsInput(val) {
      this.keywordsVal = val
      classHomework({
        searchWord: val,
        classId:this.gradeClassVal?this.gradeClassVal:null
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
          this.tableData = res.data.data
        }
      })
    },

    //播放语音事件监听
    addEvenet(event) {
      console.log(event.target);
      
      if (event.target.parentNode.classList.contains('img')) {

        let audioList = document.getElementsByClassName('audio')
        for (var i = 0, len = audioList.length; len > i; i++) {
          console.log(audioList[i].children[2])
          console.log(audioList[i].children[2].paused)
          if(!audioList[i].children[2].paused){
            audioList[i].children[2].pause()
            audioList[i].children[0].children[0].src='/static/img/play.png'
            audioList[i].children[2].currentTime = 0
          }
        }

        let el = event.target
        let audio = el.parentNode.parentNode.children[2]
        let timeAndProgressContainer = el.parentNode.parentNode.children[1]
        let progressContainerWidth = timeAndProgressContainer.children[1].clientWidth
        let progress = timeAndProgressContainer.children[1].children[0]
        let starTime = timeAndProgressContainer.children[2]

        if (audio.paused) {
          let timeCount= ~~audio.duration;
          audio.play()

          el.src = '/static/img/pause.png'

          audio.ontimeupdate = function() {
            let datetime = (~~audio.currentTime - ~~(~~audio.currentTime / 60) * 60)

            if (datetime < 10) {
              datetime = '0' + datetime
            }

            starTime.innerText = ~~(datetime / 60) + ':' + datetime

            //得到时间比例
            let timeScale = ~~audio.currentTime/timeCount;
            //利用时间比例计算宽度
            let runWidth = progressContainerWidth * timeScale

            progress.style.width = ~~runWidth +'px'

            if (audio.ended) {
              el.src = '/static/img/play.png'
              starTime.innerText = '0:00'
              progress.style.width = '0px' 
            }
          }
        } else {
          audio.pause()
          el.src = '/static/img/play.png'
        } 
        //监听是否为暂停状态
      } else {
        return
      }
    }
  },

  created() {
    //表格数据
    classHomework().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.tableData = res.data.data
      }
    }),
      //年级班级列表
    gradeClassInfo().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.gradeClassList = res.data.data
      }
    })
  },
  components: {
    homeworkLook
  }
}
</script>

<style lang="scss">
</style>
