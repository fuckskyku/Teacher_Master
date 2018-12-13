import {
  kalendarWatch
} from "@/api/api.js";

/**
 *  日历渲染 ，对参数进行字符串拼接操作
 * @param {*} y  年
 * @param {*} m    月
 * @param {*} mon 表示小于10月的月份用0+数字表示
 * @param {*} time 传到后台的YYYY-mm变量格式
 */

export default

function Cwatch(y, m) {
  let resu
  if (m > 9) {

    let time = y + "-" + m
    return kalendarWatch({
      month: time
    }).then(res => {
      resu = res
      return resu
    })
  } else {
    let mon = 0 + "" + m
    let time = y + "-" + mon
    return kalendarWatch({
      month: time
    }).then(res => {
      resu = res
      return resu
    })
  }

}
