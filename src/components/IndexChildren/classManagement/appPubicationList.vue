
<template>
  <div id="container">
    <ul>
      <li v-for="(item,index) in nav" :key="index" @click="navChange(index,item.pathName)" @mousemove="navMove(index)"><img :src="item.img" alt="">{{item.label}}</li>
    </ul>
    <ul>
      <li v-show="indexBgShow==index?true:false" class="animated zoomIn" v-for="(item,index) in nav" :key="index"><img :src="item.imgShow" alt=""></li>
    </ul>
  </div>
</template>

<script>
export default {
  // props: ["nav"],
  data() {
    return {
      indexShow: 0,
      indexBgShow: 0,
      nav: [
        {
          img: '/static/img/通知.png',
          label: '审批管理',
          imgShow: '/static/insetImg/插画/审批管理_icon.png',
          pathName: 'examination'
        },
        {
          img: '/static/img/通知.png',
          label: '抄送我的',
          imgShow: '/static/insetImg/插画/抄送我的_icon.png',
          pathName: 'copy'
        },
        {
          img: '/static/img/通知.png',
          label: '发布作业',
          imgShow: '/static/insetImg/插画/发布作业_icon.png',
          pathName: 'publishobj'
        },
        {
          img: '/static/img/通知.png',
          label: '发布通知',
          imgShow: '/static/insetImg/插画/发布通知_icon.png',
          pathName: 'issuenotice'
        },
        {
          img: '/static/img/通知.png',
          label: '风采管理',
          imgShow: '/static/insetImg/插画/风采管理_icon.png',
          pathName: 'stylenotice'
        }
      ]
    }
  },
  
  methods: {
    navChange(index, pathName) {
      console.log(index)
      if (pathName) {
        this.$router.push({
          name: pathName
          // params: { id: paramsId, columns: item, localStorage: paramsId }
        })
      } else {
        return
      }
    },
    navMove(index) {
      this.indexBgShow = index
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/Scss/navList.scss';
</style>