// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//引入公共Css加动画库
import "../src/assets/css/Public.min.css";
import "animate.css"
import "../src/assets/css/Table.min.css"
//vue基础模块
import Vue from 'vue'
import App from './App'
import router from './router'

//引入Vuex
// import VuexPersistence from 'vuex-persist'
import store from './store/Store'

//引入去全局使用js
import date from './util/date'
import util from './util/util'

//引入elementUI
import ElementUI from 'element-ui';
import { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';


// 富文本
import { quillEditor } from 'vue-quill-editor'
// import { quillRedefine } from 'vue-quill-editor-upload'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.component('quillEditor', quillEditor)
// Vue.component('quillRedefine', quillRedefine)

//引入全局模版
import pageHtml from './components/publicTemplate/pageMp'
Vue.component('pageHtml', pageHtml)

//国际化模块
import i18n from './i18n/i18n';
import { WSAENOBUFS } from "constants";
import { INSPECT_MAX_BYTES } from "buffer";
// import VueI18n from 'vue-i18n'
// import enLocale from 'element-ui/lib/locale/lang/en'
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

//权限控制引入
import has from './util/directive'
import { copyFileSync } from "fs";
import { type } from "os";

Vue.config.productionTip = false;


// Vue.use(VueI18n)
// Vue.use(Element)
// Vue.config.lang = 'zh-cn'
// Vue.locale('zh-cn', zhLocale)
// Vue.locale('en', enLocale)

/* eslint-disable no-new */

Vue.use(ElementUI);

// Vue.use(VueQuillEditor);
Vue.use(util);




//路由守卫
// console.log(store.state.crumbsList.crumbsList);
var routeList = [];
// console.log(store.state.crumbsList.crumbsList,'路由表');

//  &&store.state.crumbsList.crumbsList.length
if (store.state.crumbsList.crumbsList && store.state.crumbsList.crumbsList.length != 0 && window.location.pathname != '/') {
  routeList = store.state.crumbsList.crumbsList.slice(0, store.state.crumbsList.crumbsList.length - 1)
}

router.beforeEach((to, from, next) => {

  var token = window.localStorage.getItem("token");
  if (token == null) {

    //token为空的时候，全局token也的等于空
    global.TOKEN = null;
    if (to.name == 'Login') {
      next()
    } else {
      next('/Login')
    }
  } else {
    if (token) {
      if (to.name == 'Login') {
        next('/')
      }
    }
    //配置全局变量
    if (window.localStorage.getItem('token') != null) {
      global.TOKEN = 'Bearer ' + window.localStorage.getItem('token');
    } else {
      global.TOKEN = null;
    }

    //控制切换学校导致的首页数据混乱
    if (to.name == 'index' || to.name == 'weather') { } else {
      store.commit('classShow', 0);
      store.commit('headerNav', 0)
    }

    // 面包屑导航
    var index = -1
    for (var i = 0; i < routeList.length; i++) {
      if (routeList[i].name == to.name) {
        index = i;
        break;
      }
    }
    if(routeList.length==3){      
        routeList.splice(routeList.length-1,1)
    }
    if (index !== -1) {
      //如果存在路由列表，则把之后的路由都删掉
      routeList.splice(index + 1, routeList.length - index - 1);
    } else if (to.name !== 'Login') {
      routeList.push({ "name": to.name, "path": to.fullPath, "title": to.meta.title });
      to.meta.routeList = routeList;
    }

    store.commit("CrumbsList", routeList)

    next();
  }
});




new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>',
})
