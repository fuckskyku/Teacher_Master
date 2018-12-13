import {
  currentTime
} from '@/api/api.js'
///获取及转换当前服务器时间  判断当月1号是星期几 用于hangintheair.vue页面的生命周期mounted
let Ymd = {}
export default

async function formGenerated() {
  return await currentTime().then(res => {
    var weekDay = ["0", "1", "2", "3", "4", "5", "6"];
    //0--星期天   1--星期一  2--星期二  3--星期三  4--星期四  5--星期五  6--星期六
    if ((res.data.data.year % 4 == 0 && res.data.data.year % 100 != 0) || (res.data.data.year % 400 == 0)) { //判断是不是闰年
      // console.log('是闰年')
      Ymd.year = res.data.data.year
      Ymd.month = res.data.data.month
      Ymd.date = res.data.data.date
      Ymd.leapYear = 0 //表示是闰年
      Ymd.newDate = res.data.data.year + "-" + res.data.data.month + "-" + 1 //字符串 == 当月1号
      var myDate = new Date(Date.parse(Ymd.newDate));
      Ymd.MyDate = weekDay[myDate.getDay()] //当月1号是星期几
      return Ymd
    } else {
      // console.log('不是闰年')
      Ymd.year = res.data.data.year
      Ymd.month = res.data.data.month
      Ymd.date = res.data.data.date
      Ymd.leapYear = 1 //表示不是闰年
      Ymd.newDate = res.data.data.year + "-" + res.data.data.month + "-" + 1 //字符串 == 当月1号
      var myDate = new Date(Date.parse(Ymd.newDate));
      Ymd.MyDate = weekDay[myDate.getDay()] //当月1号是星期几         
      return Ymd
    }
  })
}
