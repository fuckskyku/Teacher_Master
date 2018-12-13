import Cwatch from "@/util/Cwatch.js";

/**
 * 
 * @param {*} number 表示本月1号是星期几
 * @param {*} month   表示当前月份
 * @param {*} leapYear leapyear表示当前年份是否为闰年(0为闰年，1为平年)
 * @param {*} year  year表示当前年份
 */
export function lists(number, month, leapYear, year) { //number表示本月1号是星期几，month表示当前月份，leapyear表示当前年份是否为闰年(0为闰年，1为平年) ,year表示当前年份
  let o = {};
  let daysNumber = "" //表示当前月份有多少天
  let days = [] //li的数量
  //判断当前月份共有多少天
  if (month < 8) { //8月以前的月份
    if (month % 2 == 0 && month != 2) { //8月以前的偶数月(2月除外)为30天
      daysNumber = 30;
    } else if (month == 2) { //如果leapyear为0  2月为29天(闰年)
      if (leapYear == 0) {
        daysNumber = 29
      } else { //如果leapyear为1  2月为28天(平年)
        daysNumber = 28
      }
    } else { //每年8月以前的非偶数月为31天
      daysNumber = 31;
    }



  } else if (month >= 8) { //8月和8月以后的月份
    if (month % 2 == 1) { //奇数月为30天
      daysNumber = 30;
    } else {
      daysNumber = 31 //偶数月为31天
    }
  }

  //生成日期天数
  for (var i = 1; i <= daysNumber; i++) {
    days.push(i)
  }

  //对接数据接口
  Cwatch(year, month).then(res => { //调用Cwatch.js中的Cwatch方法  生成当月共有多少li
    for (var n = 0; n < res.data.data.length; n++) {
      var a = res.data.data[n].oneDate - 1 //此处a作为数组下标  数组下标从0开始所以要-1
      var b = "<img src='/static/img/金币+" + res.data.data[n].todayPoints + ".png' alt=''>"
      days[a] = b
    }
    for (var j = 0; j < number; j++) { //根据当月1号是星期几 向days数组中从开头插入空li占位 
      days.unshift("")
    }
    // console.log(days)  

  })
  return days
}



//判断所选定月份的1号是星期几    
export function judgeWeek(month, year) {
  let weekDay = ["0", "1", "2", "3", "4", "5", "6"];
  //0--星期天   1--星期一  2--星期二  3--星期三  4--星期四  5--星期五  6--星期六
  let YMD = year + "-" + month + "-" + 1 //字符串拼接   以YYYY-mm-1的形式显示当前所选定的年月日
  let myDate = new Date(Date.parse(YMD));
  let weekNumber = weekDay[myDate.getDay()];
  return weekNumber
}



export default {
  lists,
  judgeWeek
}
