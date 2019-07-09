export default {
  install(Vue, options) {
    //obj需要的对象，key存储的key，needkey需要那些值，如果不传入则存储整个对象
    Vue.prototype.saveAllLocalStorage = function(obj, key, needkey) {
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
    };

    //存储单个
    Vue.prototype.saveLocalStorage = function(key, vlaue) {
      window.localStorage.setItem(key, vlaue);
    };

    //获取单个
    Vue.prototype.getLocalStorage = function(key) {
      if (window.localStorage.getItem(key) == "undefined") {
        return false;
      } else {
        return JSON.parse(window.localStorage.getItem(key));
      }
    };

    //移除单个localStorage
    Vue.prototype.removeItem = function(key) {
      window.localStorage.removeItem(key);
    };

    //移除全部localStorage
    Vue.prototype.clearLocalStorage = function() {
      window.localStorage.clear();
    };

    //控制24小时只能出现一次
    Vue.prototype.isShow = function(val) {
      let start = Date.now();
      let stop = this.getLocalStorage(val);
      if (start - stop > 24 * 60 * 60 * 1000) {
        return false;
      } else {
        return true;
      }
    };
    //控制12小时只能出现一次 val为当前时间戳 val2为时间间隔
    Vue.prototype.is12Show = function(val) {
      let start = Date.now();
      let stop = this.getLocalStorage(val);
      if (start - stop > 12 * 60 * 60 * 1000) {
        return false;
      } else {
        return true;
      }
    };
    //控制时间间隔内只能出现一次 val为当前时间戳 val2为时间间隔
    Vue.prototype.isShowTime = function(val,val2) {
      let start = Date.now();
      let stop = this.getLocalStorage(val);
      if (start - stop > val2) {
        return false;
      } else {
        return true;
      }
    };
    /**
     * @param {*标识} id
     * @param {*标识对比的对象key} objKey
     * @param {*对比对象} obj
     * @param {*对比对象所需要的文字值} val
     * @returns 返回一个对象，flag为其中是否有匹配的值，val为转化的文字
     */
    Vue.prototype.transform = function(id, objKey, obj, val) {
      let ObjTemp = { flag: false, val: "" };
      ObjTemp.flag = obj.some((item, index, array) => {
        if (item[objKey] == id) ObjTemp.val = item[val];
        return item[objKey] == id;
      });
      return ObjTemp;
    };
    
    //后台图片路径配置
    Vue.prototype.imgJoInUrl = function() {
      
      return "http://upload.mseenet.com";

      // return "http://upload2.mseenet.com";
    };
  }
};
