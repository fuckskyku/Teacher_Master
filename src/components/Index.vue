<template>
  <main>
    <Header></Header>
    <section>
      <div class="class-breadcrumb" v-if="controlShow.classShow==0">
        <div>
          <img src="/static/img/返回.png" alt="">
          <span @click="link"> {{realList&&realList.length>2?"返回":"首页"}}</span>
          <!-- <router-link :to="realList.length>2?{path:'/'}:{path:''}">{{realList.length>2?"返回":"首页"}}</router-link> -->
        </div>
        <div>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item,index) in realList?realList:null" :to="item.path" :key="index">{{item.title}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <div class="class-title" v-if="controlShow.classShow==1" v-hasMenu>
        <div><img src="/static/img/博士帽.png" alt=""></div>
        <div>{{classNameGradeName}}</div>
      </div>

      <transition mode="out-in" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <router-view></router-view>
      </transition>

    </section>
  </main>
</template>
<script>
//接口班级信息
import { gradeClassInfo } from '@/api/api'
import { mapState } from 'vuex'

import Header from '@/components/publicTemplate/Header'

export default {
  inject: ['reload'],
  data() {
    return {
      classInfo: [],
      classNameGradeName: '',
      realList: null
    }
  },
  created() {
    this.realList = this.$route.meta.routeList
    console.log(this.realList, this.$route.meta.routeList)
    // console.log(this.controlShow.classShow)
    //获取班级信息
    gradeClassInfo().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data)
        this.classInfo = res.data.data
        var classNameGradeName = ''
        res.data.data.forEach(item => {
          classNameGradeName += item.gradeName + item.className + '、'
        })
        var name = classNameGradeName.substring(
          0,
          classNameGradeName.length - 1
        )
        this.classNameGradeName = name
        // console.log(classNameGradeName)
        this.saveAllLocalStorage(res.data.data, 'gradeClassInfo')
      }
    })
  },
  mounted() {
    // console.log(this.routeList)
    // this.$loading({
    //   customClass: '.el-loading-mask'
    // })
  },

  methods: {
    //返回事件
    link() {
      if (this.realList && this.realList.length > 2) {
        this.$router.go(-1)
      } else {
        this.$router.push({ path: '/' })
      }
    }
  },
  computed: {
    ...mapState(['controlShow'])
    // classShow() {
    //   return this.$store.state.classShow;
    // }
  },
  components: { Header },
  watch: {
    realList(val) {
      if (val) {
        this.realList = val
      } else {
        console.log(window.location)
        // this.reload()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.animated {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
main {
  max-width: 1200;
  width: 1200px;
  margin: 0 auto;
  height: 100%;
  > section {
    position: relative;
    height: calc(100% - 92px);
  }
  .class-title {
    padding: 50px 31px;
    font-size: 36px;
    align-items: center;
    display: flex;
    > div {
      img {
        padding-right: 20px;
        display: block;
        max-width: 100%;
      }
    }
  }
  .class-breadcrumb {
    // cursor: pointer;
    padding: 34px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    > div {
      font-size: inherit;
      span {
        cursor: pointer;
        font-size: inherit;
        transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        &:hover {
          color: #409eff;
        }
      }
      &:nth-child(1) {
        & > a {
          color: black;
          &:hover {
            color: #409eff;
            transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        }
        img {
          max-width: 100%;
          padding-right: 10px;
        }
      }
    }
  }
}
</style>

