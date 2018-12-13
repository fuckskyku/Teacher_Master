
export default {
    install(Vue, options) {
        //obj需要的对象，key存储的key，needkey需要那些值，如果不传入则存储整个对象
        Vue.prototype.saveAllLocalStorage = function (obj, key, needkey) {
            var saveObj = {};
            if (needkey) {
                for (const objitem in obj) {
                    needkey.forEach((item, index) => {
                        if (objitem === item) {
                            saveObj[objitem] = obj[objitem];
                        }
                    });
                }
                window.localStorage.setItem(key, JSON.stringify(saveObj));
            } else {
                window.localStorage.setItem(key, JSON.stringify(obj));
            }
        }

        //存储单个
        Vue.prototype.saveLocalStorage = function (key, vlaue) {
            window.localStorage.setItem(key, vlaue);
        }

        //获取单个
        Vue.prototype.getLocalStorage = function (key) {
            if (window.localStorage.getItem(key) == 'undefined') {
                return false
            } else {
                return JSON.parse(window.localStorage.getItem(key));
            }
        }

        //移除单个localStorage
        Vue.prototype.removeItem = function (key) {
            window.localStorage.removeItem(key);
        }

        //移除全部localStorage
        Vue.prototype.clearLocalStorage = function () {
            window.localStorage.clear();
        }

        //控制24小时只能出现一次
        Vue.prototype.isShow = function (val) {
            let start = Date.now();
            let stop = this.getLocalStorage(val);
            if ((start - stop) > 24 * 60 * 60 * 1000) {
                return false
            } else {
                return true;
            }
        }
        
        //后台图片路径配置
        Vue.prototype.imgJoInUrl = function () {
            // return 'http://upload.mseenet.com'
            return 'http://test.admin.teacher.ms.com:8095'
        }
    }
}