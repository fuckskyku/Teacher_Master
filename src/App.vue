<template>
  <div id="app">
    <div id="context" class="context" style="width: 100%;
      height: 100%;
      background: #000000;
      position: fixed;
      top: 0;
      left: 0;
      background: #ffffff;
      z-index: 9999;
      display: none;">
      <div id="msg" class="msg" style="width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          text-align: center;
          font-size:24px;
          font-family:'幼圆';
          font-weight:400;
          color:#000;">
        <div style="width: 362px;height: 358px;margin: 0 auto; margin-top: 169px;"><img src="/static/img/rocket.png" alt=""></div>
        <p id="text" style="width:914px;
            height:30px;
            margin:0 auto;
            margin-top: 83px;">
            检测到您正在使用Edge<span id="verSion"></span>浏览器,请使用其它浏览器才可以进行浏览
          <p id="chrome" style="
              padding-top: 32px;
              width: 500px;
              margin: 0 auto;
            ">
            推荐使用<img style="vertical-align: middle;margin: 0 3px 6px;" src="/static/img/chrome.png" alt="">谷歌浏览器<a target="_blank"
              href='https://www.google.cn/intl/zh-CN/chrome/'>点击下载</a>
          </p>

        </p>
      </div>
    </div>
    <el-scrollbar :native="false">
      <router-view v-if="isRouterAlive"/>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
      versions: '',
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  mounted() {
    
    this.open()
  },
  methods: {
    reload() {
      (this.isRouterAlive = false),
        this.$nextTick(function() {
          this.isRouterAlive = true;
        });
    },
    open() {
      var versions
      var userAgent = navigator.userAgent;  // 取得浏览器的 userAgent 字符串
      var context = document.getElementById('context')
      var text = document.getElementById('text')
      var app = document.getElementById('app')
      // alert(userAgent)
      /* 检测IE11 */ 
      if ((userAgent.indexOf("compatible") != -1 && userAgent.indexOf("MSIE") != -1 && userAgent.indexOf("Opera") == -1) || userAgent.indexOf('Trident') != -1) {
        var view = document.getElementsByClassName('el-scrollbar__view')[0]
        view.style.width = '1200px'
        view.style.margin = '0 auto'
        // this.$alert('检测到您正在使用IE11浏览器,推荐使用谷歌浏览器,以获得最佳体验', '警告', {
        //   confirmButtonText: '确定',
        // });
      }
      
      /* 检测是否edge浏览器 */ 
      if (userAgent.indexOf("Edge") != -1 ) {
        versions = userAgent.substr(userAgent.indexOf("Edge/"),7).split(".")[0].replace(/[^0-9]/ig, "");
        
        if(versions < 17){
          context.style.display = 'block'
          app.style.display = 'none'
          text.innerText = `检测到您正在使用Edge浏览器版本过低,推荐使用谷歌浏览器,以获得最佳体验`
        }else{
          this.$alert('检测到您正在使用Edge浏览器,推荐使用谷歌浏览器,以获得最佳体验', '警告', {
            confirmButtonText: '确定',
          });
        }  
      }
        /* Safari */
        if (userAgent.indexOf("Chrome") == -1 && userAgent.indexOf("Safari") != -1) {
          // alert("检测到您正在使用Safari浏览器,推荐使用谷歌浏览器,以获得最佳体验")
          // versions = userAgent.substr(userAgent.indexOf("version/"),4);
          // alert(versions)
          context.style.display = 'block'
          text.innerText = `检测到您正在使用Safari浏览器,推荐使用谷歌浏览器,以获得最佳体验`
        }
        /* Safari end */ 
    },
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  .el-scrollbar {
    width: 100%;
    height: 100%;
    .el-scrollbar__wrap {
      .el-scrollbar__view {
        height: 100%;
        // border: 1px solid red;
      }
      overflow-x: hidden;
      height: 100%;
    }
  }
}
</style>
