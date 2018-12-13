import hasAuthority from './AuthorityStting'
import Vue from 'vue'

//注册全局自定义指令
const hasButton = Vue.directive('hasButton', {
    bind: function (el, binding) {
        // console.log(el, binding)
        // console.log(this.getLocalStorage('login_userInfo').permissions)
        // hasAuthority()
        if (!hasAuthority()) {
            el.parentNode.removeChild(el);
        }
    }
});

//注册全局自定义指令
const hasMenu = Vue.directive('hasMenu', {
    bind: function (el, binding) {
        // console.log(el, binding)
        // console.log(this.getLocalStorage('login_userInfo').permissions)
        // console.log(hasAuthority());
        if (!hasAuthority()) {
            el.style.display = "none"
        }
    }
});

export { hasButton, hasMenu }
